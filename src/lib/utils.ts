import fetch from "node-fetch";
import { getPreferenceValues } from "@raycast/api";
import { DEPLOYMENT_STATUS_ICON_PROPS, ENV_REGEX, ENV_TAG_PROPS, GITHUB_URL, LOG_SEVERITY_TAG_PROPS, PRICES, RAILWAY_API_URL, RAILWAY_URL, SEVERITY_REGEX } from "./data";
import { DeploymentStatus, ExtensionSettings, GQLData, GQLErrors, Measuements, RawUsage } from "./types";

export async function gqlFetch<T>(query: string): Promise<T> {
  const { railwayApiKey } = getPreferenceValues<ExtensionSettings>();

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

function findMatchIn<T extends Record<string, RegExp>>(stringToMatch: string, matches: T): keyof T {
  return Object.keys(matches).find((key) => stringToMatch.match(matches[key as keyof T])) as keyof T;
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

export function getSeverityTag(severity: string) {
  return LOG_SEVERITY_TAG_PROPS[findMatchIn(severity, SEVERITY_REGEX)];
}

export function getEnvironmentTag(environment: string) {
  return ENV_TAG_PROPS[findMatchIn(environment, ENV_REGEX)];
}

export function getDeploymentStatusIcon(deploymentStatus: DeploymentStatus) {
  return DEPLOYMENT_STATUS_ICON_PROPS[deploymentStatus];
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