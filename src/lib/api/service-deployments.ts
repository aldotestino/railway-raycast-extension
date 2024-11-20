import { ServiceDeployment } from "../types";
import { gqlFetch } from "../utils";

const query = (serviceId: string) => `
query {
	service (id: "${serviceId}") {
		deployments {
			edges {
				node {
					id
					status
					createdAt
				}
			}
		}
	}
}
`;

type ServiceDeploymentsResponse = {
  service: {
    deployments: {
      edges: Array<{
        node: {
          id: string
          status: string
          createdAt: string
        }
      }>
    }
  }
};

export async function getServiceDeployments(serviceId: string): Promise<Array<ServiceDeployment>> {
  const { service } = await gqlFetch<ServiceDeploymentsResponse>(query(serviceId));
  return service.deployments.edges.map(({ node }) => node) as Array<ServiceDeployment>;
}
