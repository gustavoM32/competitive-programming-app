import { useIsMutating, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  informationListFetcher,
  resourceFetcher,
  resourceListFetcher,
  resourcePageFetcher,
} from "../api/fetchers";
import {
  createResource,
  updateResource,
  deleteResource,
  readResource,
} from "../api/crud";
import { API_URL, INFO_URL } from "constants/constants";
import { Resource, ResourceData } from "../api/types";
import {
  ReadListRequestKey,
  ReadOneRequestKey,
  RequestParameters,
  ResourcePath,
  UriString,
} from "utils/queryUtils";

type UpdateResponse = {
  didUpdate: boolean;
};

export function useReadPage(
  path: string[],
  pageNumber: number,
  pageSize: number
) {
  const query = useQuery(
    [path, pageNumber.toString(), pageSize.toString()],
    () => resourcePageFetcher({ queryKey: path }, pageNumber, pageSize),
    { enabled: path.length !== 0 }
  );

  return {
    ...query,
    resources: query.data?.resources ?? [],
    uri: query.data?.uri,
    page: query.data?.page ?? {},
  };
}

/* read */
export function useReadList(
  resourcePath: ResourcePath,
  parameters?: RequestParameters
) {
  const key: ReadListRequestKey = [resourcePath, parameters];
  const isMutating = useIsMutating(key);
  const query = useQuery(key, resourceListFetcher, {
    enabled: resourcePath.length !== 0 && isMutating === 0,
  });

  return {
    ...query,
    resources: query.data?.resources ?? [],
    uri: query.data?.uri,
  };
}

export function useRead(uri: UriString, parameters?: RequestParameters) {
  const key: ReadOneRequestKey = [uri, parameters];
  const isMutating = useIsMutating(key);
  const query = useQuery(key, resourceFetcher, {
    enabled: uri !== "" && isMutating === 0,
  });

  return {
    ...query,
    resource: query.data?.resource ?? {},
    uri: query.data?.uri,
  };
}

export function useCreate(resourceName: string) {
  const queryClient = useQueryClient();

  return (newResource: Resource) => {
    // FIXME: this solution may not generalize well; will /api/parents/{pid}/childs ever be needed?; API_URL shouldn't be used in this file
    const uri = `${API_URL}/${resourceName}`;
    return createResource(uri, newResource).then(() =>
      queryClient.invalidateQueries()
    );
  };
}

export function useUpdate() {
  const queryClient = useQueryClient();

  return (updatedResource: ResourceData) => {
    const updatedId: string = updatedResource._links.self.href;
    return updateResource(updatedId, updatedResource).then(() =>
      queryClient.invalidateQueries()
    );
  };
}

export function useDelete() {
  const queryClient = useQueryClient();

  return (deletedId: ResourceData) => {
    return deleteResource(deletedId).then(() =>
      queryClient.invalidateQueries()
    );
  };
}

export function useUpdateOne(uri: string) {
  const queryClient = useQueryClient();

  return (updatedResource: ResourceData) => {
    return updateResource(uri, updatedResource).then(() =>
      queryClient.invalidateQueries()
    );
  };
}

/* information */
export function useInformationList(
  resourcePath: ResourcePath,
  parameters?: RequestParameters
) {
  const queryClient = useQueryClient();
  const key: ReadListRequestKey = [resourcePath, parameters];
  const query = useQuery(key, informationListFetcher, {
    enabled: resourcePath.length !== 0,
    refetchInterval: (data) => (data?.isUpdating ?? false ? 3000 : 10000),
    refetchIntervalInBackground: false,
    onSuccess: (data: any) => {
      if (!(data?.isUpdating ?? false)) {
        const updateUri = `${INFO_URL}/${resourcePath.join("/")}/update`;
        readResource(updateUri, parameters).then((data: UpdateResponse) => {
          if (data.didUpdate) {
            queryClient.invalidateQueries({ queryKey: key });
          }
        });
      }
    },
  });

  return {
    ...query,
    resources: query.data?.resources ?? [],
    isUpdating: query.data?.isUpdating ?? false,
  };
}
