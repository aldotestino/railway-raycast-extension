import { getPreferenceValues } from "@raycast/api";
import fetch from "node-fetch";
import { ENV_COLORS, ENV_ICONS, ENV_REGEX, GITHUB_URL, PRICES, RAILWAY_API_URL, RAILWAY_URL } from "./data";
import { ExtensionSettings, GQLData, GQLErrors, Log, Measuements, RawUsage } from "./types";

const { railwayApiKey } = getPreferenceValues<ExtensionSettings>();

export async function gqlFetch<T>(query: string): Promise<T> {
  const res = await fetch(RAILWAY_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${railwayApiKey}`,
    },
    body: JSON.stringify({ query }),
  });

  const json = (await res.json()) as GQLErrors | GQLData<T>;
  if ("errors" in json) throw new Error(json.errors[0].message);

  return json.data;
}

function envMatch(envName: string): keyof typeof ENV_REGEX {
  return (
    (Object.keys(ENV_REGEX).find((key) =>
      envName.match(ENV_REGEX[key as keyof typeof ENV_REGEX]),
    ) as keyof typeof ENV_REGEX) || "prod"
  );
}

export function getColorByEnvName(envName: string) {
  return ENV_COLORS[envMatch(envName)];
}

export function getIconByEnvName(envName: string) {
  return ENV_ICONS[envMatch(envName)];
}

export function projectPage(id: string, page?: "observability" | "logs" | "settings") {
  return `${RAILWAY_URL}/project/${id}${page ? `/${page}` : ""}`;
}

export function servicePage(projectId: string, serviceId: string) {
  return `${RAILWAY_URL}/project/${projectId}/service/${serviceId}`;
}

export function deploymentPage(projectId: string, serviceId: string, deploymentId: string, page: "details" | 'deploy' | 'build' = 'details') {
  return `${RAILWAY_URL}/project/${projectId}/service/${serviceId}?id=${deploymentId}#${page}`;
}

export function repoPage(repo: string) {
  return `${GITHUB_URL}/${repo}`;
}

export function formatLogs(logs: Array<Log>, type: 'deploy' | 'build'): string {
  const formattedLogs: { [key: string]: string[] } = {};

  logs.forEach((log) => {
    const logDate = new Date(log.timestamp);
    const date = logDate.toLocaleDateString('it-IT'); // Get local date
    const time = logDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }); // Get local time

    if (!formattedLogs[date]) {
      formattedLogs[date] = [];
    }

    formattedLogs[date].push(
      `- **[${time}]** [${log.severity}] ${log.message || '(no message)'}`
    );
  });

  let markdownOutput = `## ${type === 'build' ? "Build" : "Deployment"} Logs\n\n`;

  Object.keys(formattedLogs).forEach((date) => {
    markdownOutput += `### ${date}\n`;
    markdownOutput += formattedLogs[date].join('\n') + '\n\n';
  });

  return markdownOutput.trim();
}

export function calculateTotalCostByProjectId(usage: RawUsage) {
  const usageByProjectId = groupUsageByProjectId(usage);
  return Object.keys(usageByProjectId).reduce((acc, key) => {
    acc[key] = calculateTotalCost(usageByProjectId[key]);
    return acc;
  }, {} as Record<string, number>);
}

export function groupUsageByProjectId(usage: RawUsage) {
  return usage.reduce((acc, curr) => {
    const { projectId } = curr;

    if (!(projectId in acc)) acc[projectId] = { cpu: 0, memory: 0, network: 0, disk: 0 };

    switch (curr.measurement) {
      case 'CPU_USAGE': acc[projectId].cpu = curr.value || curr.estimatedValue || 0; break;
      case 'NETWORK_TX_GB': acc[projectId].network = curr.value || curr.estimatedValue || 0; break;
      case 'MEMORY_USAGE_GB': acc[projectId].memory = curr.value || curr.estimatedValue || 0; break;
      case 'DISK_USAGE_GB': acc[projectId].disk += curr.value || curr.estimatedValue || 0; break;
      case 'EPHEMERAL_DISK_USAGE_GB': acc[projectId].disk += curr.value || curr.estimatedValue || 0; break;
    }

    return acc;
  }, {} as Record<string, Record<Measuements, number>>)
}

export function calculateTotalCost(usage: Record<Measuements, number>) {
  return Object.keys(usage)
    .reduce((acc, key) => acc += usage[key as Measuements] * PRICES[key as Measuements], 0)
}
