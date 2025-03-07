import { Action, ActionPanel, Icon } from '@raycast/api'

function LogActions({toggleDetails, openLogsUrl, content}: {openLogsUrl: string, content: string, toggleDetails: () => void}) {
  return (
    <ActionPanel>
      <Action.OpenInBrowser title="Open Logs" url={openLogsUrl} />
        <Action.CopyToClipboard title="Copy Log" content={content} />
          <ActionPanel.Section>
          <Action
            title="Toggle Details"
            icon={Icon.AppWindowSidebarRight}
            onAction={toggleDetails}
            shortcut={{ modifiers: ["shift", "cmd"], key: "d" }}
          />
      </ActionPanel.Section>
    </ActionPanel>
  )
}

export default LogActions