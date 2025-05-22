import { getProjects } from "../lib/api/projects";

async function tool() {

  const projects = await getProjects();

  return projects
}

export default tool;