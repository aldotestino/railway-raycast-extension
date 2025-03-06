import { List } from "@raycast/api";
import { useCachedPromise, useCachedState } from "@raycast/utils";
import { useCallback } from "react";
import ProjectDetails from "./components/project-details";
import { getProjects } from "./lib/api/projects";
import ProjectActions from "./components/project-actions";

export default function Command() {

  const { data, isLoading } = useCachedPromise(getProjects, [], {
    keepPreviousData: false,
    initialData: [],
  });

  const [showDetails, setShowDetails] = useCachedState("show-details", false);
  const toggleDetails = useCallback(() => setShowDetails((prev) => !prev), []);

  return (
    <List isLoading={isLoading} isShowingDetail={showDetails}>
      <List.EmptyView title="No projects found" />
      {data.map((project) => (
        <List.Item
          key={project.id}
          title={project.name}
          subtitle={!showDetails ? project.description : undefined}
          actions={<ProjectActions projectId={project.id} toggleDetails={toggleDetails} />}
          detail={<ProjectDetails project={project} />}
        />
      ))}
    </List>
  );
}
