import useSWR from "swr";
import resourceFetcher from "../fetchers/resource";

export default function useRead(name) {
  let { data, error, mutate } = useSWR(name, resourceFetcher);
  let resourcesMutate

  if (data && mutate) {
    resourcesMutate = (mutateResources) => {
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
