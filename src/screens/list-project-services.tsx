import { Icon, List } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { getProjectServices } from "../lib/api/project-services";
import { getColorByEnvName, getIconByEnvName } from "../lib/utils";
import ServiceActions from "../components/service-actions";

function ProjectServices({ projectId }: { projectId: string }) {
  
  const { data, isLoading } = useCachedPromise(getProjectServices, [projectId], {
    keepPreviousData: true,
    initialData: [],
  });

  return (
    <List isLoading={isLoading}>
      <List.EmptyView title="No services found" />
      {data.environments.map((env) => (
        <List.Section key={env.id}>
          {env.services.map((service) => (
            <List.Item
              key={service.id}
              title={service.name}
              icon={service.repo ? Icon.Code : Icon.Box}
              accessories={[
                { tag: { value: env.name, color: getColorByEnvName(env.name) }, icon: getIconByEnvName(env.name) },
              ]}
              actions={
                <ServiceActions
                  serviceId={service.id}
                  projectId={projectId}
                  domain={service.domain}
                  repo={service.repo}
                />
              }
            />
          ))}
        </List.Section>
      ))}
    </List>
  );
}

export default ProjectServices;
