import { Action, ActionPanel } from "@raycast/api";
import { repoPage, servicePage } from "../lib/utils";
import ServiceDeployments from "../screens/list-service-deployments";

function ServiceActions({
  serviceId,
  projectId,
  domain,
  repo,
}: {
  serviceId: string;
  projectId: string;
  domain?: string;
  repo?: string;
}) {

  return (
    <ActionPanel>
      <ActionPanel.Section title="Open in Raycast">
        <Action.Push title="Show Deployments" target={<ServiceDeployments projectId={projectId} serviceId={serviceId} />} />
      </ActionPanel.Section>

      <ActionPanel.Section title="Open in Browser">
        <Action.OpenInBrowser title="Open Service" url={servicePage(projectId, serviceId)} shortcut={{ modifiers: ["opt"], key: "s" }} />
        {domain && <Action.OpenInBrowser title="Open Domain" url={domain} shortcut={{ modifiers: ["opt"], key: "w" }} />}
        {repo && (
          <Action.OpenInBrowser title="Open GitHub" url={repoPage(repo)} shortcut={{ modifiers: ["opt"], key: "g" }} />
        )}
      </ActionPanel.Section>

      <ActionPanel.Section>
        <Action.CopyToClipboard
          title="Copy Service URL"
          content={servicePage(projectId, serviceId)}
          shortcut={{ modifiers: ["opt"], key: "c" }}
        />
        {domain && (
          <Action.CopyToClipboard
            title="Copy Domain"
            content={domain}
            shortcut={{ modifiers: ["opt", "shift"], key: "c" }}
          />
        )}
        {repo && <Action.CopyToClipboard title="Copy Repository URL" content={repoPage(repo)} />}
      </ActionPanel.Section>
    </ActionPanel>
  );
}

export default ServiceActions;