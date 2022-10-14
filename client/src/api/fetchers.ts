import { API_URL, SERVER_URL } from "constants/constants";
import { readResource } from "./crud";

export async function resourceListFetcher({ queryKey } : { queryKey: string[] }) {
  const uri = `${API_URL}/${queryKey.join('/')}`

  if (queryKey.length === 0) {
    throw Error("Empty queryKey")
  }

  const lastElement = queryKey[queryKey.length-1]

  return readResource(uri)
    .then(data => {
      return {
        resources: data._embedded[lastElement],
        uri: data._links.self.href
      }
    })
}

export async function resourceFetcher({ queryKey } : { queryKey: [string] }) {
  const [uri] = queryKey;

  return readResource(uri)
    .then(data => {
      return {
        resource: data,
        uri: data._links.self.href
      }
    })
}

export async function readOnlyFetcher({ queryKey } : { queryKey: string[] }) {
  const uri = `${SERVER_URL}/info/${queryKey.join('/')}`

  if (queryKey.length === 0) {
    throw Error("Empty queryKey")
  }

  return readResource(uri)
  .then(data => {
    return {
      resource: data,
    }
  })
}
