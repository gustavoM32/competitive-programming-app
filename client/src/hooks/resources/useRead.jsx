import useSWR from "swr";
import fetcher from "../fetcher"

export default function useRead(name) {
  const { data, error, mutate } = useSWR(name, fetcher);

  return {
    data: error ? [] : (data ?? []),
    isLoading: !error && !data,
    isError: error,
    mutate: mutate
  }
}
