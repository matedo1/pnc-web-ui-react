import { useParams } from 'react-router-dom';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { BuildConfigsList } from 'components/BuildConfigsList/BuildConfigsList';

import * as buildConfigApi from 'services/buildConfigApi';

interface IGroupConfigBuildConfigsPageProps {
  componentId?: string;
}

export const GroupConfigBuildConfigsPage = ({ componentId = 'g2' }: IGroupConfigBuildConfigsPageProps) => {
  const { groupConfigId } = useParams();

  const serviceContainerBuildConfigs = useServiceContainer(buildConfigApi.getByGroupConfigIdWithLatestBuild);
  const serviceContainerBuildConfigsRunner = serviceContainerBuildConfigs.run;

  useQueryParamsEffect(
    ({ requestConfig } = {}) => {
      serviceContainerBuildConfigsRunner({ serviceData: { groupConfigId }, requestConfig });
    },
    { componentId }
  );

  return (
    <BuildConfigsList
      columns={['name', 'project.name', 'buildType', 'buildStatus', 'actions']}
      serviceContainerBuildConfigs={serviceContainerBuildConfigs}
      {...{ componentId }}
    />
  );
};
