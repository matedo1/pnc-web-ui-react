import { IDefaultSorting, ISortAttributes, ISortOptions, TSortAttribute } from 'hooks/useSorting';

import { IFilterAttributes, IFilterOptions, TFilterAttribute } from 'components/Filtering/Filtering';

import { uiLogger } from 'services/uiLogger';

import { IQParamOperators } from 'utils/qParamHelper';

/**
 * Not all possible combinations are valid.
 *
 * @example
 * {
 *   id: 'name',
 *   title: 'Name',
 *   filter: {
 *     operator: '=like='
 *     placeholder: 'Custom placeholder',
 *   }
 * }
 *
 * @example
 * {
 *   id: 'status',
 *   title: 'Status',
 *   values: ['SUCCESS', 'REJECTED', 'FAILED'],
 *   filter: {
 *     operator: '=='
 *   }
 * }
 *
 * @example
 * {
 *   id: 'customParam',
 *   title: 'Custom Param',
 *   filter: {
 *     operator: '=like='
 *     isCustomParam: true,
 *   }
 * }
 */
export interface IEntityAttribute<T = string> {
  /**
   * ID has to match object key , there is automatic TypeScript based checker throwing errors if they don't match.
   */
  id: T;

  /**
   * Title will be displayed to the user.
   */
  title: string;

  /**
   * Description helping user to understand attribute details.
   */
  tooltip?: string;

  /**
   * Select instead of text input will be displayed.
   */
  values?: any;

  /**
   * Filter related properties. If this property is defined, then entity attribute is automatically used as filtering attribute.
   */
  filter?: {
    /**
     * Additional operators (see IQParamOperators):
     *  - '=like=' valid only when property values are not defined ('=notlike=' is determined automatically when filter value starts with ! character)
     *  - '==' valid only when property values are defined
     *  - '!=' valid only when property values are defined
     */
    operator: IQParamOperators;

    /**
     * When true, custom id based Query Param (not Q) will be used.
     */
    isCustomParam?: boolean;

    /**
     * Placeholder when text input is displayed.
     */
    placeholder?: string;
  };

  /**
   * Sort related properties.
   */
  sort?: {
    /**
     * Possibility to add attribute into sorting group with the same name. Then sort dropdown is used instead. See for example Builds > "Times" column.
     */
    group?: string;

    /**
     * Unique table column index required by PatternFly library. It's supposed to be auto-generated.
     */
    tableColumnIndex?: number;
  };
}

export interface IEntityAttributes {
  [key: string]: IEntityAttribute<typeof key>;
}

export type TEntityAttributes<Entity> = {
  [key in keyof Entity]: IEntityAttribute<key>;
};

export const getFilterAttributes = (
  entityAttributes: IEntityAttributes,
  customKeys: IFilterOptions['customKeys'] = null
): IFilterOptions => {
  const filterAttributes: IFilterAttributes = {};

  (customKeys ? customKeys : Object.keys(entityAttributes)).forEach((entityAttributeKey) => {
    if (entityAttributes[entityAttributeKey]?.filter) {
      filterAttributes[entityAttributeKey] = entityAttributes[entityAttributeKey] as TFilterAttribute;
    }
  });

  return {
    filterAttributes,
    customKeys,
  };
};

/**
 * Get sort attributes derived from entity attributes. Validate default sorting parameters.
 */
export const getSortOptions = ({
  entityAttributes,
  defaultSorting,
  customColumns,
}: {
  /**
   * Entity attributes for given entity.
   */
  entityAttributes: IEntityAttributes;

  /**
   * Optional default sorting, otherwise no sorting is applied.
   */
  defaultSorting?: IDefaultSorting;

  /**
   * Entity attributes can contain 5 sort attributes, but only 3 of them can be displayed.
   */
  customColumns?: string[];
}): ISortOptions => {
  const sortAttributes: ISortAttributes = {};

  // Process entity attributes
  let i = 0;
  (customColumns ? customColumns : Object.keys(entityAttributes)).forEach((entityAttributeKey) => {
    const entityAttribute = entityAttributes[entityAttributeKey];

    // Get only entity attributes with sort property defined
    if (entityAttribute.sort) {
      sortAttributes[entityAttributeKey] = JSON.parse(JSON.stringify(entityAttribute)) as TSortAttribute;

      // Add auto-generated table column unique index required by PatternFly library
      if (!sortAttributes[entityAttributeKey].sort.tableColumnIndex) {
        sortAttributes[entityAttributeKey].sort.tableColumnIndex = i;
      } else {
        uiLogger.error(
          `Sort attribute 'tableColumnIndex' for key ${entityAttributeKey} is already defined, original value: ${sortAttributes[entityAttributeKey].sort.tableColumnIndex}, new value: ${i}`
        );
      }

      i++;
    }
  });

  // Validate default sorting parameters
  if (defaultSorting && !Object.keys(sortAttributes).includes(defaultSorting?.attribute)) {
    uiLogger.error(
      `Custom default sorting key '${
        defaultSorting?.attribute
      }' is not supported, it's probably entityAttribute without 'sort' property: ${JSON.stringify(
        entityAttributes[defaultSorting?.attribute]
      )}`
    );
  }

  return {
    sortAttributes,
    defaultSorting,
  };
};
