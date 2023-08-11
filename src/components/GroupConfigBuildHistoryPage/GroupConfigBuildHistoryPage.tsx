import { useParams } from 'react-router-dom';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import * as groupConfigApi from 'services/groupConfigApi';

interface IGroupConfigBuildHistoryPageProps {
  componentId?: string;
}

export const GroupConfigBuildHistoryPage = ({ componentId = 'g2' }: IGroupConfigBuildHistoryPageProps) => {
  const { groupConfigId } = useParams();

  const serviceContainerGroupConfigBuilds = useServiceContainer(groupConfigApi.getGroupConfigBuilds);
  const serviceContainerGroupConfigBuildsRunner = serviceContainerGroupConfigBuilds.run;

  useQueryParamsEffect(
    ({ requestConfig } = {}) => serviceContainerGroupConfigBuildsRunner({ serviceData: { groupConfigId }, requestConfig }),
    {
      componentId,
    }
  );
  return <></>;
  // @todo: implement GroupBuildsList after rebasing the latest code
  // return <GroupBuildsList serviceContainerGroupBuilds={serviceContainerGroupConfigBuilds} {...{ componentId }} />;
};
