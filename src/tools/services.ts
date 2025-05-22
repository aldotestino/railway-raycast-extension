import { getProjectServices } from "../lib/api/project-services";

type ServicesProps = {
  projectId: string;
}

async function tool(props: ServicesProps) {
  const { projectId } = props;

  const services = await getProjectServices(projectId);

  return services;
}

export default tool;