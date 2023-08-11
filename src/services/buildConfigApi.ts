import { AxiosRequestConfig } from 'axios';

import { Build, BuildConfigPage } from 'pnc-api-types-ts';

import { pncClient } from './pncClient';

export interface IBuildStartParams {
  id: string;
  temporaryBuild?: boolean;
  rebuildMode?: string;
  buildDependencies?: boolean;
  keepPodOnFailure?: boolean;
  alignmentPreference?: string;
}

/**
 * Gets all BuildConfigs with latest build.
 *
 * @param requestConfig - Axios based request config
 */
export const getBuildConfigsWithLatestBuild = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<BuildConfigPage>('/build-configs/x-with-latest-build', requestConfig);
};

/**
 * Triggers a Build of a specific Build Config.
 *
 * @param buildStartParams - Object containing parameters to start a Build
 * @param requestConfig - Axios based request config
 */
export const build = ({ buildStartParams }: { buildStartParams: IBuildStartParams }, requestConfig: AxiosRequestConfig = {}) => {
  requestConfig.params = requestConfig.params ? Object.assign(requestConfig.params, buildStartParams) : buildStartParams;
  return pncClient.getHttpClient().post<Build>(`/build-configs/${buildStartParams.id}/build`, null, requestConfig);
};

// interface IGetByGroupConfigData {
//   groupConfigId?: number;
// }

/**
 * Get all Build Configs of a Group Config with the latest Build.
 *
 * @param groupConfigId - The id of the Group Config
 *
 * @param requestConfig - Axios based request config
 */
export const getByGroupConfigIdWithLatestBuild = (
  // { groupConfigId }: { groupConfigId: IGetByGroupConfigData },
  requestConfig: AxiosRequestConfig = {}
) => {
  requestConfig.params = requestConfig.params
    ? Object.assign(requestConfig.params, { q: `groupConfigurations.id==100` })
    : { q: `groupConfigurations.id==100` };
  return pncClient.getHttpClient().get<BuildConfigPage>('/build-configs/x-with-latest-build', requestConfig);
};
