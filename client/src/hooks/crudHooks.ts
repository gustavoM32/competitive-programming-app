import { useIsMutating, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { resourceFetcher, resourceListFetcher } from "./fetchers";
import { createResource, updateResource, deleteResource } from "./crud"
import { API_URL } from "constants/constants";
import { Resource, ResourceData, ResourceList } from "./types";

type crudContext = {
  previousResources?: ResourceList
}

export function useReadList(name: string) {
  const isMutating = useIsMutating([name])
  const query = useQuery([name], resourceListFetcher, { enabled: isMutating === 0 } )

  return {
    ...query,
    resources: query.data?.resources ?? [],
    uri: query.data?.uri
  }
}

export function useRead(uri: string) {
  const isMutating = useIsMutating([uri])
  const query = useQuery([uri], resourceFetcher, { enabled: isMutating === 0 } )
 
  return {
    ...query,
    resources: query.data?.resource ?? {},
    uri: query.data?.uri
  }
}

function useCommonOptions(resourceName: string) {
  const queryClient = useQueryClient()

  // If the mutation fails, use the context returned from onMutate to roll back
  const onError = (err: any, variables: any, context: crudContext | undefined ) => {
    if (context?.previousResources) {
      queryClient.setQueryData<ResourceList>([resourceName], context.previousResources)
    }
  }

  // Always refetch after error or success
  const onSettled = () => {
    queryClient.invalidateQueries([resourceName])
  }

  return {
    mutationKey: [resourceName],
    onError: onError,
    onSettled: onSettled,
  }
}

export function useCreate(resourceName: string) {
  const queryClient = useQueryClient()

  const mutationFn = (newResource: Resource) => {
    // FIXME: this solution may not generalize well; will /api/parents/{pid}/childs ever be needed?; API_URL shouldn't be used in this file
    const uri = `${API_URL}/${resourceName}`
    return createResource(uri, newResource)
  }

  const getOptimisticUpdate = (previousResources: ResourceList, newResource: ResourceData): ResourceList => {
    newResource._links = { self: { href: "new" } }
    return {
      ...previousResources,
      resources: [...previousResources.resources, newResource]
    }
  }

  const onMutate = async (newResource: Resource) => {
    // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries([resourceName])

    // Snapshot the previous value
    const previousResources = queryClient.getQueryData<ResourceList>([resourceName])

    // Optimistically update to the new value
    if (previousResources) {
      queryClient.setQueryData<ResourceList>([resourceName], getOptimisticUpdate(previousResources, newResource))
    }

    // Return a context object with the snapshotted value
    return { previousResources }
  }

  const commonOptions = useCommonOptions(resourceName)

  return useMutation(mutationFn, {
    ...commonOptions,
    onMutate: onMutate  
  })
}

export function useUpdate(resourceName: string) {
  const queryClient = useQueryClient()

  const mutationFn = (updatedResource: ResourceData) => {
    const updatedId: string = updatedResource._links.self.href
    return updateResource(updatedId, updatedResource)
  }

  const getOptimisticUpdate = (previousResources: ResourceList, updatedResource: ResourceData): ResourceList => {
    const updatedId: string = updatedResource._links.self.href
    return {
      ...previousResources,
      resources: previousResources.resources.map((r: any) => r._links.self.href == updatedId ? updatedResource : r)
    }
  }

  const onMutate = async (updatedResource: ResourceData) => {
    await queryClient.cancelQueries([resourceName])
    const previousResources = queryClient.getQueryData<ResourceList>([resourceName])
    if (previousResources) {
      queryClient.setQueryData<ResourceList>([resourceName], getOptimisticUpdate(previousResources, updatedResource))
    }
    return { previousResources }
  }

  const commonOptions = useCommonOptions(resourceName)

  return useMutation(mutationFn, {
    ...commonOptions,
    onMutate: onMutate  
  })
}

export function useDelete(resourceName: string) {
  const queryClient = useQueryClient()

  const mutationFn = (deletedId: ResourceData) => {
    return deleteResource(deletedId)
  }

  const getOptimisticUpdate = (previousResources: ResourceList, deletedId: string): ResourceList => {
    return {
      ...previousResources,
      resources: previousResources.resources.filter((r: any) => r._links.self.href != deletedId)
    }
  }

  const onMutate = async (deletedId: string) => {
    await queryClient.cancelQueries([resourceName])
    const previousResources = queryClient.getQueryData<ResourceList>([resourceName])
    if (previousResources) {
      queryClient.setQueryData<ResourceList>([resourceName], getOptimisticUpdate(previousResources, deletedId))
    }
    return { previousResources }
  }

  const commonOptions = useCommonOptions(resourceName)

  return useMutation(mutationFn, {
    ...commonOptions,
    onMutate: onMutate  
  })
}
