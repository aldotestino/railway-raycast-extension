import { calculateTotalCostByProjectId, gqlFetch } from "../utils";
import { Member, Project } from "../types";

const projectsQuery = `
query {
  me {
    workspaces {
      team {
        id
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
      }
    }
  }
}
`;

const costsQuery = (teamId: string) => `
query {
  usage(teamId: "${teamId}", measurements: [CPU_USAGE, MEMORY_USAGE_GB, DISK_USAGE_GB, NETWORK_RX_GB, NETWORK_TX_GB]) {
    measurement
    value
    tags {
      projectId
    }
  }
  estimatedUsage(teamId: "${teamId}", measurements: [CPU_USAGE, MEMORY_USAGE_GB, DISK_USAGE_GB, NETWORK_RX_GB, NETWORK_TX_GB]) {
		estimatedValue
		measurement
		projectId
	}
}
`;

export type ProjectsResponse = {
  me: {
    workspaces: Array<{
      team: {
        id: string;
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
      };
    }>;
  };
};

export type CostsResponse = {
  usage: Array<{
    measurement: string;
    value: number;
    tags: {
      projectId: string;
    };
  }>;
  estimatedUsage: Array<{
    measurement: string;
    estimatedValue: number;
    projectId: string;
  }>;
};

export async function getProjects(): Promise<Array<Project>> {
  const {
    me: { workspaces },
  } = await gqlFetch<ProjectsResponse>(projectsQuery);

  const teamIds = workspaces.map(({ team }) => team.id);

  const costs = await Promise.all(teamIds.map((teamId) => gqlFetch<CostsResponse>(costsQuery(teamId))));

  const projects = workspaces.flatMap(({ team }) => team.projects.edges.map(({ node }) => node));
  const usage = costs.flatMap(({ usage }) => usage);
  const estimatedUsage = costs.flatMap(({ estimatedUsage }) => estimatedUsage);

  const costByProjectId = calculateTotalCostByProjectId(
    usage.map(({ measurement, value, tags }) => ({ measurement, value, projectId: tags.projectId })),
  );
  const estimatedCostByProjectId = calculateTotalCostByProjectId(estimatedUsage);

  return projects.map((p) => ({
    name: p.name,
    id: p.id,
    description: p.description,
    members: p.members as Array<Member>,
    environments: p.environments.edges.map(({ node }) => node.name),
    admin: p.members.find(({ role }) => role === "ADMIN")! as Member,
    cost: costByProjectId[p.id] || 0,
    estimatedCost: estimatedCostByProjectId[p.id] || 0,
  }));
}
