import axios from "axios";
import useSWR from "swr";
import resourceFetcher from "./fetchers/resource";

export function useRead(name) {
  let { data, error, mutate } = useSWR(name, resourceFetcher);
  let resourcesMutate

  if (data && mutate) {
    resourcesMutate = (mutateResources) => {
      if (!mutateResources) {
        mutate();
        return;
      }

      let updatedResources = mutateResources(data.resources)

      mutate((oldData) => {
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

export function useCreate(name) {
  const { uri, mutate } = useRead(name);

  return (newResource) => {
    const createResource = (resources) => {
      axios.post(uri, newResource)
        .then(() => console.log(`post ${uri}`))
        .catch(err => console.error(err))
      
      newResource._links = { self: { href: "new" } }

      return [...resources, newResource]
    }

    mutate(createResource)
  }
}

export function useUpdate(name) {
  const { mutate } = useRead(name);

  return (updatedResource) => {
    const updateResource = (resources) => {
      const updatedId = updatedResource._links.self.href

      axios.patch(`${updatedId}`, updatedResource)
        .then(() => console.log(`updated ${updatedId}`))
        .catch(err => console.error(err))

      return resources.map(r => r._links.self.href == updatedId ? updatedResource : r)
    }

    mutate(updateResource)
  }
}

export function useDelete(name) {
  const { mutate } = useRead(name);

  return (deletedId) => {
    const deleteResource = (resources) => {
      axios.delete(deletedId)
        .then(() => console.log(`deleted ${deletedId}`))
        .catch(err => console.error(err))

      return resources.filter(r => r._links.self.href != deletedId)
    }

    mutate(deleteResource)
  }
}
