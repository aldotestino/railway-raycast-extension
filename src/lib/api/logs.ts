import {
  // Log,
  ServiceLogs
} from "../types";
import { gqlFetch } from "../utils";

const deployQuery = (deploymentId: string) => `
query {
	deploymentLogs(deploymentId: "${deploymentId}", limit: 100) {
		timestamp
		message
		severity
	}
}
`;

// const buildQuery = (deploymentId: string) => `
// query {
// 	buildLogs(deploymentId: "${deploymentId}", limit: 100) {
// 		timestamp
// 		message
// 		severity
// 	}
// }
// `;

type DeploymentLogsResponse = {
  deploymentLogs: Array<{
    timestamp: string;
    message: string;
    severity: string;
  }>;
};

// type BuildLogsResponse = {
//   buildLogs: Array<{
//     timestamp: string;
//     message: string;
//     severity: string;
//   }>;
// };

export async function getLogs(deploymentId: string, type: "deploy" | "build"): Promise<ServiceLogs> {
  // let logs: Array<Log>;

  // if (type === "build") {
  //   const { buildLogs } = await gqlFetch<BuildLogsResponse>(buildQuery(deploymentId));
  //   logs = buildLogs;
  // } else {
  //   console.log("Fetching deployment logs");
  //   const { deploymentLogs } = await gqlFetch<DeploymentLogsResponse>(deployQuery(deploymentId));
  //   logs = deploymentLogs;
  // }

  console.log("Fetching deployment logs");
  const { deploymentLogs } = await gqlFetch<DeploymentLogsResponse>(deployQuery(deploymentId));

  return {
    type,
    logs: deploymentLogs.toReversed()
  };
}
