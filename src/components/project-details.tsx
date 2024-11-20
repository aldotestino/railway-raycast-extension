import { List, Image, Icon } from "@raycast/api";
import { Project } from "../lib/types";
import { getColorByEnvName, getIconByEnvName } from "../lib/utils";

function ProjectDetails({ project }: { project: Project }) {
  return (
    <List.Item.Detail
      metadata={
        <List.Item.Detail.Metadata>
          <List.Item.Detail.Metadata.Label title="Detais" />
          {project.description && <List.Item.Detail.Metadata.Label title="Description" text={project.description} />}
          <List.Item.Detail.Metadata.Label
            title="Admin"
            text={project.admin.name || project.admin.email.split("@")[0]}
            icon={{ mask: Image.Mask.Circle, source: project.admin.avatar || `z=${project.admin.email}` }}
          />
          <List.Item.Detail.Metadata.Label
            title="Members"
            icon={project.members.length > 1 ? Icon.TwoPeople : Icon.Person}
            text={project.members.length.toString()}
          />
          <List.Item.Detail.Metadata.TagList title="Environments">
            {project.environments.map((env) => (
              <List.Item.Detail.Metadata.TagList.Item
                key={env.id}
                text={env.name}
                color={getColorByEnvName(env.name)}
                icon={getIconByEnvName(env.name)}
              />
            ))}
          </List.Item.Detail.Metadata.TagList>
          <List.Item.Detail.Metadata.Separator />
          <List.Item.Detail.Metadata.Label title="Costs" />
          <List.Item.Detail.Metadata.Label title="Current usage" text={`$ ${project.cost.toFixed(2)}`} />
          <List.Item.Detail.Metadata.Label title="Estimated usage" text={`$ ${project.estimatedCost.toFixed(2)}`} />
        </List.Item.Detail.Metadata>
      }
    />
  );
}

export default ProjectDetails