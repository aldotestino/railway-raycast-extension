import { List } from "@raycast/api"
import { useCachedPromise, useCachedState } from "@raycast/utils"
import { getLogs } from "../lib/api/logs"
import { deploymentPage, getSeverityTag } from "../lib/utils"
import { useMemo, useState } from "react"
import LogDetails from "../components/log-details"
import LogActions from "../components/log-actions"
import { LOG_SEVERITY_TAG_PROPS, SEVERITY_REGEX } from "../lib/data"

function DetailLogs({ projectId, serviceId, deploymentId, type }: { projectId: string, serviceId: string, deploymentId: string, type: "deploy" | "build" }) {

  const { data, isLoading } = useCachedPromise(getLogs, [deploymentId, type], {
    keepPreviousData: true,
    initialData: {
      type: "deploy",
      logs: []
    }
  })

  const [severity, setSeverity] = useState<keyof typeof SEVERITY_REGEX | "all">("all");
  const [showDetails, setShowDetails] = useCachedState("show-details", false);
  
  const filteredLogs = useMemo(() => {
    if (severity === "all") return data.logs;
    return data.logs.filter((log) => log.severity.match(SEVERITY_REGEX[severity]));
  }, [data.logs, severity])

  return (
    <List 
      isLoading={isLoading} 
      isShowingDetail={data.logs.length > 0 ? showDetails: false}
      searchBarAccessory={
        <List.Dropdown 
          tooltip="Select severity"
          defaultValue="all"
          onChange={(value) => setSeverity(value as typeof severity)}
        >
          <List.Dropdown.Item title="All" value="all" />
          {Object.entries(LOG_SEVERITY_TAG_PROPS).map(([severity, { text, icon }]) => (
            <List.Dropdown.Item key={severity} title={text} value={severity} icon={icon} />
          ))}
        </List.Dropdown>
      }
    >
      <List.EmptyView title={severity === "all" ? "No logs found" : `No ${severity} logs found`} />
      {filteredLogs.map((log, index) => (
        <List.Item key={index} 
          title={log.message}
          accessories={!showDetails ? [
            {
              tooltip: new Date(log.timestamp).toLocaleString(),
              date: new Date(log.timestamp)
            }, {
              tag: {color: getSeverityTag(log.severity).color, value: getSeverityTag(log.severity).text},
              icon: getSeverityTag(log.severity).icon
            }
          ]: undefined}
          detail={<LogDetails log={log} />}
          actions={<LogActions openLogsUrl={deploymentPage(projectId, serviceId, deploymentId, type)} content={log.message} toggleDetails={() => setShowDetails((prev) => !prev)} />}
        />
      ))}
    </List>
  )
}

export default DetailLogs