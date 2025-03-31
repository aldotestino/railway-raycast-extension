import { Color, Icon, List } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { getProjectServices } from "../lib/api/project-services";
import ServiceActions from "../components/service-actions";
import { getEnvironmentTag } from "../lib/utils";
import { useState } from "react";

function ProjectServices({ projectId }: { projectId: string }) {
  const { data, isLoading } = useCachedPromise(getProjectServices, [projectId], {
    keepPreviousData: true,
    initialData: {
      services: [],
      environments: [],
    },
  });

  const [environment, setEnvironment] = useState<string>("all");
  const filteredServices = data.services.filter((service) =>
    environment !== "all" ? service.environment === environment : true,
  );

  return (
    <List
      isLoading={isLoading}
      searchBarAccessory={
        <List.Dropdown tooltip="Select environment" defaultValue="all" onChange={setEnvironment}>
          <List.Dropdown.Item title="All" value="all" />
          {data.environments.map((env) => (
            <List.Dropdown.Item key={env} title={env} value={env} icon={getEnvironmentTag(env).icon} />
          ))}
        </List.Dropdown>
      }
    >
      <List.EmptyView title="No services found" />
      {filteredServices.map((service) => (
        <List.Item
          key={`${service.id}-${service.environment}`}
          title={service.name}
          icon={service.repo ? Icon.Code : Icon.Box}
          accessories={[
            {
              tag: {
                value: service.environment,
                color: getEnvironmentTag(service.environment).color || Color.PrimaryText,
              },
              icon: getEnvironmentTag(service.environment).icon,
            },
          ]}
          actions={<ServiceActions service={service} projectId={projectId} />}
        />
      ))}
    </List>
  );
}

export default ProjectServices;
