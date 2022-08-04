import { API_URL } from "constants/constants";
import { readResource } from "./crud";

export async function resourceListFetcher(name: string) {
  return readResource(`${API_URL}/${name}`)
    .then(data => {
      return {
        resources: data._embedded[name],
        uri: data._links.self.href
      }
    })
}

export async function resourceFetcher(uri: string) {
  return readResource(uri)
    .then(data => {
      return {
        resource: data,
        uri: data._links.self.href
      }
    })
}
