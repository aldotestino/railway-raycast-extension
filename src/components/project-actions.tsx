import { Action, ActionPanel, Icon } from "@raycast/api";
import ProjectServices from "../screens/project-services-list";
import { projectPage } from "../lib/utils";

function ProjectActions({ projectId, toggleDetails }: { projectId: string; toggleDetails: () => void }) {
  return (
    <ActionPanel>
      <ActionPanel.Section title="Open in Raycast">
        <Action.Push title="Show Services" target={<ProjectServices projectId={projectId} />} />
      </ActionPanel.Section>

      <ActionPanel.Section title="Open in Browser">
        <Action.OpenInBrowser
          title="Open Architecture"
          url={projectPage(projectId)}
          shortcut={{ modifiers: ["opt"], key: "a" }}
        />
        <Action.OpenInBrowser
          title="Open Observability"
          url={projectPage(projectId, "observability")}
          shortcut={{ modifiers: ["opt"], key: "o" }}
        />
        <Action.OpenInBrowser
          title="Open Settings"
          url={projectPage(projectId, "settings")}
          shortcut={{ modifiers: ["opt"], key: "s" }}
        />
      </ActionPanel.Section>

      <ActionPanel.Section>
        <Action.CopyToClipboard
          title="Copy Project URL"
          content={projectPage(projectId)}
          shortcut={{ modifiers: ["opt"], key: "c" }}
        />
        <Action
          title="Toggle Details"
          icon={Icon.AppWindowSidebarRight}
          onAction={toggleDetails}
          shortcut={{ modifiers: ["shift", "cmd"], key: "d" }}
        />
      </ActionPanel.Section>
    </ActionPanel>
  );
}

export default ProjectActions;