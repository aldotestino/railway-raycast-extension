import { ProjectDetails } from "../types";
import { gqlFetch } from "../utils";

const query = (projectId: string) => `
query {
	project (id: "${projectId}") {
		environments {
			edges {
				node {
					id
					name
					serviceInstances {
						edges {
							node {
								latestDeployment {
									staticUrl
								}
                source {
									image
									repo
								}
								serviceName
								serviceId
							}
						}
					}
				}
			}
		}
	}
}
`;

type ProjectServicesResponse = {
  project: {
    environments: {
      edges: Array<{
        node: {
          id: string;
          name: string;
          serviceInstances: {
            edges: Array<{
              node: {
                latestDeployment?: {
                  staticUrl?: string;
                };
                source: {
                  image?: string;
                  repo?: string;
                };
                serviceName: string;
                serviceId: string;
              };
            }>;
          };
        };
      }>;
    };
  };
};

export async function getProjectServices(projectId: string): Promise<ProjectDetails> {
  const { project } = await gqlFetch<ProjectServicesResponse>(query(projectId));

  return {
    services: project.environments.edges.flatMap(e => e.node.serviceInstances.edges.map(s => ({
      environment: e.node.name,
      id: s.node.serviceId,
      name: s.node.serviceName,
      repo: s.node.source?.repo,
      domain: s.node.latestDeployment?.staticUrl ? `https://${s.node.latestDeployment.staticUrl}` : undefined
    }))),
    environments: project.environments.edges.map(e => e.node.name)
  }
}
