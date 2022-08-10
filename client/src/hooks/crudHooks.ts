import { useIsMutating, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { resourceFetcher, resourceListFetcher } from "./fetchers";
import { createResource, updateResource, deleteResource } from "./crud"
import { API_URL } from "constants/constants";
import { Resource, ResourceList } from "./types";

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

export function useCreate(name: string) {
  const queryClient = useQueryClient()

  const updateFn = (newResource: Resource) => {
    // FIXME: this solution may not generalize well; will /api/parents/{pid}/childs ever be needed?; API_URL shouldn't be used in this file
    const uri = `${API_URL}/${name}`
    return createResource(uri, newResource)
  }

  const getOptimisticUpdate = (previousResources: ResourceList, newResource: Resource): ResourceList => {
    newResource._links = { self: { href: "new" } }
    return {
      ...previousResources,
      resources: [...previousResources.resources, newResource]
    }
  }

  // When mutate is called:
  const onMutate = async (newResource: Resource): Promise<crudContext> => {
    // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries([name])

    // Snapshot the previous value
    const previousResources = queryClient.getQueryData<ResourceList>([name])

    // Optimistically update to the new value
    if (previousResources) {
      queryClient.setQueryData<ResourceList>([name], getOptimisticUpdate(previousResources, newResource))
    }

    // Return a context object with the snapshotted value
    return { previousResources }
  }
  
  // If the mutation fails, use the context returned from onMutate to roll back
  const onError = (err: any, variables: any, context: crudContext | undefined ) => {
    if (context?.previousResources) {
      queryClient.setQueryData<ResourceList>([name], context.previousResources)
    }
  }

  // Always refetch after error or success
  const onSettled = () => {
    queryClient.invalidateQueries([name])
  }

  return useMutation(updateFn, {
    mutationKey: [name],
    onMutate: onMutate,
    onError: onError,
    onSettled: onSettled,
  })
}

export function useUpdate(name: string) {
  const queryClient = useQueryClient()

  const updateFn = (updatedResource: Resource) => {
    const updatedId: string = updatedResource._links.self.href
    return updateResource(updatedId, updatedResource)
  }

  const getOptimisticUpdate = (previousResources: ResourceList, updatedResource: Resource): ResourceList => {
    const updatedId: string = updatedResource._links.self.href
    
    return {
      ...previousResources,
      resources: previousResources.resources.map((r: any) => r._links.self.href == updatedId ? updatedResource : r)
    }
  }

  const onMutate = async (updatedResource: Resource): Promise<crudContext> => {
    await queryClient.cancelQueries([name])
    const previousResources = queryClient.getQueryData<ResourceList>([name])
    if (previousResources) {
      queryClient.setQueryData<ResourceList>([name], getOptimisticUpdate(previousResources, updatedResource))
    }
    return { previousResources }
  }
  
  const onError = (err: any, variables: any, context: crudContext | undefined ) => {
    if (context?.previousResources) {
      queryClient.setQueryData<ResourceList>([name], context.previousResources)
    }
  }

  const onSettled = () => {
    queryClient.invalidateQueries([name])
  }

  return useMutation(updateFn, {
    mutationKey: [name],
    onMutate: onMutate,
    onError: onError,
    onSettled: onSettled,
  })
}

export function useDelete(name: string) {
  const queryClient = useQueryClient()

  const updateFn = (deletedId: Resource) => {
    return deleteResource(deletedId)
  }

  const getOptimisticUpdate = (previousResources: ResourceList, deletedId: string): ResourceList => {
    return {
      ...previousResources,
      resources: previousResources.resources.filter((r: any) => r._links.self.href != deletedId)
    }
  }

  const onMutate = async (deletedId: string): Promise<crudContext> => {
    await queryClient.cancelQueries([name])
    const previousResources = queryClient.getQueryData<ResourceList>([name])
    if (previousResources) {
      queryClient.setQueryData<ResourceList>([name], getOptimisticUpdate(previousResources, deletedId))
    }
    return { previousResources }
  }
  
  const onError = (err: any, variables: any, context: crudContext | undefined ) => {
    if (context?.previousResources) {
      queryClient.setQueryData<ResourceList>([name], context.previousResources)
    }
  }

  const onSettled = () => {
    queryClient.invalidateQueries([name])
  }

  return useMutation(updateFn, {
    mutationKey: [name],
    onMutate: onMutate,
    onError: onError,
    onSettled: onSettled,
  })
}
