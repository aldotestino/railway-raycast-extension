import { calculateTotalCostByProjectId, gqlFetch } from "../utils";
import { Member, Project } from "../types";

const query = `
query {
	projects {
		edges {
			node {
				id
				name
        description
        members {
          id
					email
          name
          avatar
          role
				}
				environments {
					edges {
						node {
              id
							name
						}
					}
				}
			}
		}
	}
  usage(groupBy: PROJECT_ID, measurements: [CPU_USAGE, MEMORY_USAGE_GB, DISK_USAGE_GB, NETWORK_RX_GB, NETWORK_TX_GB, EPHEMERAL_DISK_USAGE_GB]) {
		measurement
		value
		tags {
			projectId
		}
	}
  estimatedUsage(measurements: [CPU_USAGE, MEMORY_USAGE_GB, DISK_USAGE_GB, NETWORK_RX_GB, NETWORK_TX_GB, EPHEMERAL_DISK_USAGE_GB]) {
		estimatedValue
		measurement
		projectId
	}
}
`;

export type ProjectsResponse = {
  projects: {
    edges: Array<{
      node: {
        id: string;
        name: string;
        description: string;
        members: Array<{
          id: string;
          email: string;
          name?: string;
          avatar?: string;
          role: string;
        }>;
        environments: {
          edges: Array<{
            node: {
              id: string;
              name: string;
            };
          }>;
        };
      };
    }>;
  };
  usage: Array<{
    measurement: string
    value: number
    tags: {
      projectId: string
    }
  }>;
  estimatedUsage: Array<{
    measurement: string
    estimatedValue: number
    projectId: string
  }>;
};

export async function getProjects(): Promise<Array<Project>> {
  const { projects, usage, estimatedUsage } = await gqlFetch<ProjectsResponse>(query);

  const costByProjectId = calculateTotalCostByProjectId(usage.map(({ measurement, value, tags }) => ({ measurement, value, projectId: tags.projectId })));
  const estimatedCostByProjectId = calculateTotalCostByProjectId(estimatedUsage);

  return projects.edges.map(({ node }) => ({
    name: node.name,
    id: node.id,
    description: node.description,
    members: node.members as Array<Member>,
    environments: node.environments.edges.map(({ node }) => node),
    admin: node.members.find(({ role }) => role === "ADMIN")! as Member,
    cost: costByProjectId[node.id] || 0,
    estimatedCost: estimatedCostByProjectId[node.id] || 0,
  }));
}
