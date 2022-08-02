import axios from "axios";
import useSWR from "swr";
import { resourceListFetcher } from "./fetchers";

type UpdateFunction = (oldData: any[]) => any[];
type MutateFunctionWithUpdate = (updateFn?: UpdateFunction) => void;

type Resource = any

type ResourceObject = {
  resources: Resource[],
  uri: string,
  isLoading: boolean,
  error: Error,
  mutate?: MutateFunctionWithUpdate,
}

export function useRead(name: string): ResourceObject {
  const { data, error, mutate } = useSWR(name, resourceListFetcher);
  let resourcesMutate: MutateFunctionWithUpdate | undefined

  if (data && mutate) {
    resourcesMutate = (mutateResources?: UpdateFunction) => {
      if (!mutateResources) {
        mutate();
        return;
      }

      let updatedResources = mutateResources(data.resources)

      mutate((oldData) => {
        if (!oldData) return undefined

        return {
          resources: updatedResources,
          uri: oldData.uri
        }
      })
    }
  }

  return {
    resources: data?.resources ?? [],
    uri: data?.uri,
    isLoading: !data && !error,
    error: error,
    mutate: resourcesMutate
  }
}

export function useCreate(name: string) {
  const { uri, mutate } = useRead(name);

  if (!mutate) return () => { console.error("mutate undefined") }

  return (newResource: Resource) => {
    const createResource = (resources: Resource[]) => {
      axios.post(uri, newResource)
        .then(() => console.log(`post ${uri}`))
        .catch(err => console.error(err))

      newResource._links = { self: { href: "new" } }

      return [...resources, newResource]
    }

    mutate(createResource)
  }
}

export function useUpdate(name: string) {
  const { mutate } = useRead(name);

  if (!mutate) return () => { console.error("mutate undefined") }

  return (updatedResource: Resource) => {
    const updateResource = (resources: Resource[]) => {
      const updatedId: string = updatedResource._links.self.href

      axios.patch(`${updatedId}`, updatedResource)
        .then(() => console.log(`updated ${updatedId}`))
        .catch(err => console.error(err))

      return resources.map(r => r._links.self.href == updatedId ? updatedResource : r)
    }

    mutate(updateResource)
  }
}

export function useDelete(name: string) {
  const { mutate } = useRead(name);

  if (!mutate) return () => { console.error("mutate undefined") }

  return (deletedId: string) => {
    const deleteResource = (resources: Resource[]) => {
      axios.delete(deletedId)
        .then(() => console.log(`deleted ${deletedId}`))
        .catch(err => console.error(err))

      return resources.filter(r => r._links.self.href != deletedId)
    }

    mutate(deleteResource)
  }
}
