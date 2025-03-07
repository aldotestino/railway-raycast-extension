import { Action, ActionPanel } from "@raycast/api";
import { repoPage, servicePage } from "../lib/utils";
import ServiceDeployments from "../screens/service-deployments-list";
import { Service } from "../lib/types";

function ServiceActions({
  service,
  projectId,
}: {
  service: Service,
  projectId: string,
}) {

  return (
    <ActionPanel>
      <ActionPanel.Section title="Open in Raycast">
        <Action.Push title="Show Deployments" target={<ServiceDeployments projectId={projectId} serviceId={service.id} />} />
      </ActionPanel.Section>

      <ActionPanel.Section title="Open in Browser">
        <Action.OpenInBrowser title="Open Service" url={servicePage(projectId, service.id)} shortcut={{ modifiers: ["opt"], key: "s" }} />
        {service.domain && <Action.OpenInBrowser title="Open Domain" url={service.domain} shortcut={{ modifiers: ["opt"], key: "w" }} />}
        {service.repo && (
          <Action.OpenInBrowser title="Open GitHub" url={repoPage(service.repo)} shortcut={{ modifiers: ["opt"], key: "g" }} />
        )}
      </ActionPanel.Section>

      <ActionPanel.Section>
        <Action.CopyToClipboard
          title="Copy Service URL"
          content={servicePage(projectId, service.id)}
          shortcut={{ modifiers: ["opt"], key: "c" }}
        />
        {service.domain && (
          <Action.CopyToClipboard
            title="Copy Domain"
            content={service.domain}
            shortcut={{ modifiers: ["opt", "shift"], key: "c" }}
          />
        )}
        {service.repo && <Action.CopyToClipboard title="Copy Repository URL" content={repoPage(service.repo)} />}
      </ActionPanel.Section>
    </ActionPanel>
  );
}

export default ServiceActions;