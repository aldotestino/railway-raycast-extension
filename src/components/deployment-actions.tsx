import { Action, ActionPanel } from "@raycast/api";
import { deploymentPage } from "../lib/utils";
import DetailLogs from "../screens/detail-logs";

function DeploymentActions({ projectId, serviceId, deploymentId }: { projectId: string; serviceId: string; deploymentId: string }) {
  return (
    <ActionPanel>
      <ActionPanel.Section title="Open in Raycast">
        <Action.Push title="Show Deployment Logs" target={<DetailLogs projectId={projectId} serviceId={serviceId} deploymentId={deploymentId} type="deploy" />} />
        <Action.Push title="Show Build Logs" target={<DetailLogs projectId={projectId} serviceId={serviceId} deploymentId={deploymentId} type="build" />} />
      </ActionPanel.Section>

      <ActionPanel.Section title="Open in Browser">
        <Action.OpenInBrowser
          title="Open Deployment"
          url={deploymentPage(projectId, serviceId, deploymentId)}
          shortcut={{ modifiers: ["opt"], key: "o" }}
        />
      </ActionPanel.Section>

      <ActionPanel.Section>
        <Action.CopyToClipboard
          title="Copy Deployment URL"
          content={deploymentPage(projectId, serviceId, deploymentId)}
          shortcut={{ modifiers: ["opt"], key: "c" }}
        />
      </ActionPanel.Section>
    </ActionPanel>
  );
}

export default DeploymentActions;