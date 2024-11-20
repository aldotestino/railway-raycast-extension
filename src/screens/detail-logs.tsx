import { Action, ActionPanel, Detail } from "@raycast/api"
import { useCachedPromise } from "@raycast/utils"
import { getLogs } from "../lib/api/deployment-logs"
import { deploymentPage } from "../lib/utils"

function DetailLogs({ projectId, serviceId, deploymentId, type }: { projectId: string, serviceId: string, deploymentId: string, type: "deploy" | "build" }) {

  const { data } = useCachedPromise(getLogs, [deploymentId, type], {
    keepPreviousData: true,
    initialData: ""
  })

  return (
    <Detail markdown={data} 
      actions={
        <ActionPanel>
          <Action.OpenInBrowser title="Open Logs" url={`${deploymentPage(projectId, serviceId, deploymentId, type)}`} />
        </ActionPanel>
      } 
    />
  )
}

export default DetailLogs