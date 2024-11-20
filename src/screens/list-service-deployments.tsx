import { List } from '@raycast/api'
import { useCachedPromise } from '@raycast/utils';
import { getServiceDeployments } from '../lib/api/service-deployments';
import DeploymentActions from '../components/deployment-actions';
import { DEPLOYMENT_STATUS_COLOR, DEPLOYMENT_STATUS_ICON } from '../lib/data';

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
          icon={{source: DEPLOYMENT_STATUS_ICON[deployment.status], tintColor: DEPLOYMENT_STATUS_COLOR[deployment.status]}}
          accessories={[{date: new Date(deployment.createdAt)}]}
          actions={<DeploymentActions projectId={projectId} serviceId={serviceId} deploymentId={deployment.id} />}
        />
      ))}
    </List>
  )
}

export default ServiceDeployments