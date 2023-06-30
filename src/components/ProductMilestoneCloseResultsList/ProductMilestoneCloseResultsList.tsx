import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { Link } from 'react-router-dom';

import { ProductMilestoneCloseResult } from 'pnc-api-types-ts';

import { getFilterAttributes } from 'common/entityAttributes';
import { productMilestoneCloseResultEntityAttributes } from 'common/productMilestoneCloseResultEntityAttributes';

import { IServiceContainer } from 'hooks/useServiceContainer';
import { IDefaultSorting, ISortAttributes, useSorting } from 'hooks/useSorting';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { Filtering } from 'components/Filtering/Filtering';
import { ProductMilestoneCloseStatusLabelMapper } from 'components/LabelMapper/ProductMilestoneCloseStatusLabelMapper';
import { Pagination } from 'components/Pagination/Pagination';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import { createDateTime } from 'utils/utils';

const sortAttributes: ISortAttributes = {
  startingDate: {
    id: 'startingDate',
    title: 'Start Date',
    tableColumnIndex: 1,
  },
  endDate: {
    id: 'endDate',
    title: 'End Date',
    tableColumnIndex: 2,
  },
  status: {
    id: 'status',
    title: 'Status',
    tableColumnIndex: 3,
  },
};

const defaultSorting: IDefaultSorting = {
  attribute: sortAttributes.endDate.id,
  direction: 'desc',
};

interface IProductMilestoneCloseResultsListProps {
  serviceContainerCloseResults: IServiceContainer;
  componentId: string;
}

/**
 * Component displaying list of Close Results.
 *
 * @param serviceContainerProducts - Service Container for CLose Results
 * @param componentId - Component ID
 */
export const ProductMilestoneCloseResultsList = ({
  serviceContainerCloseResults,
  componentId,
}: IProductMilestoneCloseResultsListProps) => {
  const { getSortParams } = useSorting(sortAttributes, componentId, defaultSorting);

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering filterOptions={getFilterAttributes(productMilestoneCloseResultEntityAttributes)} componentId={componentId} />
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerCloseResults} title="Close Results">
          <TableComposable isStriped variant="compact">
            <Thead>
              <Tr>
                <Th width={20}>{productMilestoneCloseResultEntityAttributes.id.title}</Th>
                <Th width={30} sort={getSortParams(sortAttributes['startingDate'].id)}>
                  {productMilestoneCloseResultEntityAttributes.startingDate.title}
                </Th>
                <Th width={30} sort={getSortParams(sortAttributes['endDate'].id)}>
                  {productMilestoneCloseResultEntityAttributes.endDate.title}
                </Th>
                <Th width={20} sort={getSortParams(sortAttributes['status'].id)}>
                  {productMilestoneCloseResultEntityAttributes.status.title}
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerCloseResults.data?.content.map((closeResult: ProductMilestoneCloseResult, rowIndex: number) => (
                <Tr key={rowIndex}>
                  <Td>
                    <Link to="">{closeResult.id}</Link>
                  </Td>
                  <Td>{createDateTime({ date: closeResult.startingDate }).custom}</Td>
                  <Td>{closeResult.endDate && createDateTime({ date: closeResult.endDate }).custom}</Td>
                  <Td>
                    <ProductMilestoneCloseStatusLabelMapper status={closeResult.status} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </TableComposable>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerCloseResults.data?.totalHits} />
    </>
  );
};
