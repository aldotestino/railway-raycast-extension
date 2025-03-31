import { List } from "@raycast/api";
import { getSeverityTag } from "../lib/utils";
import { Log } from "../lib/types";

function LogDetails({ log }: { log: Log }) {
  return (
    <List.Item.Detail
      metadata={
        <List.Item.Detail.Metadata>
          <List.Item.Detail.Metadata.Label title="Timestamp" text={new Date(log.timestamp).toLocaleString()} />
          <List.Item.Detail.Metadata.TagList title="Severity">
            <List.Item.Detail.Metadata.TagList.Item {...getSeverityTag(log.severity)} />
          </List.Item.Detail.Metadata.TagList>
        </List.Item.Detail.Metadata>
      }
      markdown={log.message}
    />
  );
}

export default LogDetails;
