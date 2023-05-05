import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import { SCMRepository } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';

import { IServiceContainer } from 'hooks/useServiceContainer';
import { ISortOptions, useSorting } from 'hooks/useSorting';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { Filtering, IFilterOptions } from 'components/Filtering/Filtering';
import { Pagination } from 'components/Pagination/Pagination';
import { ScmRepositoryLink } from 'components/ScmRepositoryLink/ScmRepositoryLink';
import { ScmRepositoryUrl } from 'components/ScmRepositoryUrl/ScmRepositoryUrl';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

// keeping also not supported operations for testing purposes
const filterOptions: IFilterOptions = {
  filterAttributes: {
    internalUrl: {
      id: 'internalUrl',
      title: 'Internal URL',
      operator: '=like=',
    },
    externalUrl: {
      id: 'externalUrl',
      title: 'External URL',
      operator: '=like=',
    },
  },
};

const sortOptions: ISortOptions = {
  internalUrl: {
    id: 'internalUrl',
    title: 'Internal URL',
    tableColumnIndex: 0,
  },
  externalUrl: {
    id: 'externalUrl',
    title: 'External URL',
    tableColumnIndex: 1,
  },
};

interface IScmRepositoriesListProps {
  serviceContainerScmRepositories: IServiceContainer;
  componentId: string;
}

/**
 * Component displaying list of SCM Repositories.
 *
 * @param serviceContainerScmRepositories - Service Container for SCM Repositories
 * @param componentId - Component ID
 */
export const ScmRepositoriesList = ({ serviceContainerScmRepositories, componentId }: IScmRepositoriesListProps) => {
  const { getSortParams } = useSorting(sortOptions, componentId);

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering filterOptions={filterOptions} componentId={componentId} />
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerScmRepositories} title={PageTitles.scmRepositories}>
          <TableComposable variant="compact" isStriped>
            <Thead>
              {/**
               * If column order is changed, the property tableColumnIndex (see sortOptions) has to be updated.
               * Better solution can be implemented in the future.
               */}
              <Tr>
                <Th width={20}>Name</Th>
                <Th width={30} sort={getSortParams(sortOptions['internalUrl'].id)}>
                  Internal SCM URL
                </Th>
                <Th width={30} sort={getSortParams(sortOptions['externalUrl'].id)}>
                  External SCM URL
                </Th>
                <Th width={10}>Pre-build Sync</Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerScmRepositories.data?.content.map((scmRepository: SCMRepository, rowIndex: number) => (
                <Tr key={rowIndex}>
                  <Td>{<ScmRepositoryLink scmRepository={scmRepository} />}</Td>
                  <Td>{<ScmRepositoryUrl isInline internalScmRepository={scmRepository} />}</Td>
                  <Td>{scmRepository.externalUrl && <ScmRepositoryUrl isInline externalScmRepository={scmRepository} />}</Td>
                  <Td>
                    {scmRepository?.preBuildSyncEnabled !== undefined &&
                      (scmRepository.preBuildSyncEnabled ? 'enabled' : 'disabled')}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </TableComposable>
        </ServiceContainerLoading>
      </ContentBox>

      {/* Pagination need to be outside of ServiceContainerLoading so that it can initialize Query Params */}
      <Pagination componentId={componentId} count={serviceContainerScmRepositories.data?.totalHits} />
    </>
  );
};
