import { useEffect } from 'react';
import { Outlet, useOutletContext, useParams } from 'react-router-dom';

import { IServiceContainer, useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Tabs } from 'components/Tabs/Tabs';
import { TabsItem } from 'components/Tabs/TabsItem';

import * as groupConfigApi from 'services/groupConfigApi';

import { generatePageTitle } from 'utils/titleHelper';

type ContextType = { serviceContainerGroupConfig: IServiceContainer };

export const GroupConfigPages = () => {
  const { groupConfigId } = useParams();

  const serviceContainerGroupConfig = useServiceContainer(groupConfigApi.getGroupConfig);
  const serviceContainerGroupConfigRunner = serviceContainerGroupConfig.run;

  useEffect(() => {
    serviceContainerGroupConfigRunner({ serviceData: { id: groupConfigId } });
  }, [serviceContainerGroupConfigRunner, groupConfigId]);

  useTitle(
    generatePageTitle({
      serviceContainer: serviceContainerGroupConfig,
      firstLevelEntity: 'Group Config',
      entityName: serviceContainerGroupConfig.data?.identifier,
    })
  );

  const pageTabs = (
    <Tabs>
      <TabsItem url="details">Details</TabsItem>
      <TabsItem url="buildConfigs">Build Configs</TabsItem>
      <TabsItem url="buildHistory">Build History</TabsItem>
    </Tabs>
  );

  return (
    <ServiceContainerLoading {...serviceContainerGroupConfig} title="Group config details">
      <PageLayout title={serviceContainerGroupConfig.data?.identifier} tabs={pageTabs}>
        <Outlet context={{ serviceContainerGroupConfig }} />
      </PageLayout>
    </ServiceContainerLoading>
  );
};

export function useServiceContainerGroupConfig() {
  return useOutletContext<ContextType>();
}
