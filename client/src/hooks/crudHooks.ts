import { useIsMutating, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { resourceFetcher, resourceListFetcher } from "./fetchers";
import { createResource, updateResource, deleteResource } from "./crud"

type UpdateFunction = (oldData: any[]) => any[];
type MutateFunctionWithUpdate = (updateFn?: UpdateFunction) => void;

type Resource = any

type ResourceList = {
  resources: Resource[],
  uri: string
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

  const updateFn = async (newResource: Resource) => {
    const { uri } = queryClient.getQueryData<ResourceList>([name]) // FIXME: find another way to get the uri
    await createResource(uri, newResource)
  }

  const getOptimisticUpdate = (previousResources: ResourceList, newResource: Resource): ResourceList => {
    newResource._links = { self: { href: "new" } }
    return {
      ...previousResources,
      resources: [...previousResources.resources, newResource]
    }
  }

  // When mutate is called:
  const onMutate = async (newResource: Resource): Promise<{ previousResources: ResourceList | undefined }> => {
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
  const onError = (err: any, variables: any, context: { previousResources: ResourceList }) => {
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

  const updateFn = async (updatedResource: Resource) => {
    const updatedId: string = updatedResource._links.self.href
    await updateResource(updatedId, updatedResource)
  }

  const getOptimisticUpdate = (previousResources: ResourceList, updatedResource: Resource): ResourceList => {
    const updatedId: string = updatedResource._links.self.href
    
    return {
      ...previousResources,
      resources: previousResources.resources.map((r: any) => r._links.self.href == updatedId ? updatedResource : r)
    }
  }

  const onMutate = async (updatedResource: Resource): Promise<{ previousResources: ResourceList | undefined }> => {
    await queryClient.cancelQueries([name])
    const previousResources = queryClient.getQueryData<ResourceList>([name])
    if (previousResources) {
      queryClient.setQueryData<ResourceList>([name], getOptimisticUpdate(previousResources, updatedResource))
    }
    return { previousResources }
  }
  
  const onError = (err: any, variables: any, context: { previousResources: ResourceList }) => {
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

  const updateFn = async (deletedId: Resource) => {
    await deleteResource(deletedId)
  }

  const getOptimisticUpdate = (previousResources: ResourceList, deletedId: string): ResourceList => {
    return {
      ...previousResources,
      resources: previousResources.resources.filter((r: any) => r._links.self.href != deletedId)
    }
  }

  const onMutate = async (deletedId: string): Promise<{ previousResources: ResourceList | undefined }> => {
    await queryClient.cancelQueries([name])
    const previousResources = queryClient.getQueryData<ResourceList>([name])
    if (previousResources) {
      queryClient.setQueryData<ResourceList>([name], getOptimisticUpdate(previousResources, deletedId))
    }
    return { previousResources }
  }
  
  const onError = (err: any, variables: any, context: { previousResources: ResourceList }) => {
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
