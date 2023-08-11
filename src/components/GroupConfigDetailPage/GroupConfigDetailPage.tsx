import { Grid, GridItem } from '@patternfly/react-core';

import { groupConfigEntityAttributes } from 'common/groupConfigEntityAttributes';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { useServiceContainerGroupConfig } from 'components/GroupConfigPages/GroupConfigPages';
import { ProductVersionLink } from 'components/ProductVersionLink/ProductVersionLink';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as productVersionApi from 'services/productVersionApi';

import { generatePageTitle } from 'utils/titleHelper';

interface IGroupConfigDetailPageProps {
  componentId?: string;
}

export const GroupConfigDetailPage = ({ componentId = 'g1' }: IGroupConfigDetailPageProps) => {
  const { serviceContainerGroupConfig } = useServiceContainerGroupConfig();
  const serviceContainerProductVersion = useServiceContainer(productVersionApi.getProductVersion);
  const serviceContainerProductVersionRunner = serviceContainerProductVersion.run;

  useTitle(generatePageTitle({ serviceContainer: serviceContainerGroupConfig, firstLevelEntity: 'Group Config' }));

  useQueryParamsEffect(
    ({ requestConfig } = {}) =>
      serviceContainerProductVersionRunner({
        serviceData: { id: serviceContainerGroupConfig.data.productVersion.id },
        requestConfig,
      }),
    { componentId }
  );

  return (
    <Grid hasGutter>
      <GridItem span={12}>
        <ContentBox padding isResponsive>
          <Attributes>
            <AttributesItem title={groupConfigEntityAttributes.name.title}>
              {serviceContainerGroupConfig.data.name}
            </AttributesItem>
            <AttributesItem title={groupConfigEntityAttributes.productVersion.title}>
              <ServiceContainerLoading
                {...serviceContainerProductVersion}
                title={groupConfigEntityAttributes.productVersion.title}
              >
                <ProductVersionLink productVersion={serviceContainerProductVersion.data} />
              </ServiceContainerLoading>
            </AttributesItem>
          </Attributes>
        </ContentBox>
      </GridItem>
    </Grid>
  );
};
