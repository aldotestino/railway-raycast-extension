import { ProjectServices } from "../types";
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

export async function getProjectServices(projectId: string): Promise<ProjectServices> {
  const { project } = await gqlFetch<ProjectServicesResponse>(query(projectId));

  return {
    environments: project.environments.edges.map(({ node }) => ({
      id: node.id,
      name: node.name,
      services: node.serviceInstances.edges.map(({ node }) => ({
        id: node.serviceId,
        name: node.serviceName,
        repo: node.source.repo,
        domain: node.latestDeployment?.staticUrl ? `https://${node.latestDeployment.staticUrl}` : undefined,
      })),
    })),
  };
}
