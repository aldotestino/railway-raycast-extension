import { List } from '@raycast/api'
import { useCachedPromise } from '@raycast/utils';
import { getServiceDeployments } from '../lib/api/service-deployments';
import DeploymentActions from '../components/deployment-actions';
import { getDeploymentStatusIcon } from '../lib/utils';

function ServiceDeployments({ projectId, serviceId }: { projectId: string, serviceId: string }) {

  const { data, isLoading } = useCachedPromise(getServiceDeployments, [serviceId], {
    keepPreviousData: true,
    initialData: [],
  });

  return (
    <List isLoading={isLoading}>
      <List.EmptyView title="No deployments found" />
      {data.map((deployment) => (
        <List.Item
          key={deployment.id}
          title={deployment.id}
          icon={getDeploymentStatusIcon(deployment.status)}
          accessories={[{date: new Date(deployment.createdAt), tooltip: new Date(deployment.createdAt).toLocaleString()}]}
          actions={<DeploymentActions projectId={projectId} serviceId={serviceId} deploymentId={deployment.id} />}
        />
      ))}
    </List>
  )
}

export default ServiceDeployments