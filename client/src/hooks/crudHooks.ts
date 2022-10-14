import { QueryClient, useIsMutating, useQuery, useQueryClient } from "@tanstack/react-query"
import { resourceFetcher, resourceListFetcher, resourcePageFetcher } from "../api/fetchers";
import { createResource, updateResource, deleteResource } from "../api/crud"
import { API_URL } from "constants/constants";
import { Resource, ResourceData } from "../api/types";

export function useReadPage(path: string[], pageNumber: number, pageSize: number) {
  const query = useQuery([path, pageNumber.toString(), pageSize.toString()],
    () => resourcePageFetcher({ queryKey: path}, pageNumber, pageSize),
    { enabled: path.length !== 0, keepPreviousData: true } )

  return {
    ...query,
    resources: query.data?.resources ?? [],
    uri: query.data?.uri,
    page: query.data?.page ?? {}
  }
}

/* read */
export function useReadList(key: string[]) {
  const isMutating = useIsMutating(key)
  const query = useQuery(key, resourceListFetcher, { enabled: key.length !== 0 && isMutating === 0 } )

  return {
    ...query,
    resources: query.data?.resources ?? [],
    uri: query.data?.uri
  }
}

export function useRead(uri: string) {
  const isMutating = useIsMutating([uri])
  const query = useQuery([uri], resourceFetcher, { enabled: uri !== "" && isMutating === 0 } )
 
  return {
    ...query,
    resources: query.data?.resource ?? {},
    uri: query.data?.uri
  }
}

export function useCreate(resourceName: string) {
  const queryClient = useQueryClient()

  return (newResource: Resource) => {
    // FIXME: this solution may not generalize well; will /api/parents/{pid}/childs ever be needed?; API_URL shouldn't be used in this file
    const uri = `${API_URL}/${resourceName}`
    return createResource(uri, newResource)
      .then(() => queryClient.invalidateQueries())
  }
}

export function useUpdate() {
  const queryClient = useQueryClient()

  return (updatedResource: ResourceData) => {
    const updatedId: string = updatedResource._links.self.href
    return updateResource(updatedId, updatedResource)
      .then(() => queryClient.invalidateQueries())
  }
}

export function useDelete() {
  const queryClient = useQueryClient()

  return (deletedId: ResourceData) => {
    return deleteResource(deletedId)
      .then(() => queryClient.invalidateQueries())
  }
}

export function useUpdateOne(uri: string) {
  const queryClient = useQueryClient()
  
  return (updatedResource: ResourceData) => {
    return updateResource(uri, updatedResource)
      .then(() => queryClient.invalidateQueries())
  }
}
