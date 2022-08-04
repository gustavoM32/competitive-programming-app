import useSWR from "swr";
import { resourceFetcher, resourceListFetcher } from "./fetchers";
import { createResource, updateResource, deleteResource } from "./crud"

type UpdateFunction = (oldData: any[]) => any[];
type MutateFunctionWithUpdate = (updateFn?: UpdateFunction) => void;

type Resource = any

type ResourceObject = {
  resources: any[],
  uri: string,
  isLoading: boolean,
  error: Error,
  mutate?: MutateFunctionWithUpdate,
}

export function useReadList(name: string) {
  const { data, error, mutate } = useSWR(name, resourceListFetcher);

  return {
    resources: data?.resources ?? [],
    uri: data?.uri,
    isLoading: !data && !error,
    error: error,
    mutate: mutate
  }
}

export function useRead(uri: string) {
  const { data, error, mutate } = useSWR(uri, resourceFetcher);
 
  return {
    resources: data?.resource ?? {},
    uri: data?.uri,
    isLoading: !data && !error,
    error: error,
    mutate: mutate
  }
}

export function useCreate(name: string) {
  const { uri, mutate } = useReadList(name);

  return (newResource: Resource) => {
    const createResourceMutate = (oldData: any) => {
      createResource(uri, newResource)
      newResource._links = { self: { href: "new" } }
      return {
        ...oldData,
        resources: [...oldData.resources, newResource]
      }
    }

    mutate(createResourceMutate)
  }
}

export function useUpdate(name: string) {
  const { mutate } = useReadList(name)

  return (updatedResource: Resource) => {
    const updatedId: string = updatedResource._links.self.href

    const updateResourceMutate = (oldData: any) => {
      updateResource(updatedId, updatedResource)
      return {
        ...oldData,
        resources: oldData.resources.map((r: any) => r._links.self.href == updatedId ? updatedResource : r)
      }
    }

    mutate(updateResourceMutate)
  }
}

export function useDelete(name: string) {
  const { mutate } = useReadList(name)

  return (deletedId: string) => {
    const deleteResourceMutate = (oldData: any) => {
      deleteResource(deletedId)
      return {
        ...oldData,
        resources: oldData.resources.filter((r: any) => r._links.self.href != deletedId)
      }
    }

    mutate(deleteResourceMutate)
  }
}
