import { API_URL } from "constants/constants";
import { readResource } from "./crud";

export async function resourceListFetcher({ queryKey } : { queryKey: [string] }) {
  const [name] = queryKey;

  return readResource(`${API_URL}/${name}`)
    .then(data => {
      return {
        resources: data._embedded[name],
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
