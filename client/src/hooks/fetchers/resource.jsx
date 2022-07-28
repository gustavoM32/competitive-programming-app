import generalFetcher from "./general";
import { API_URL } from "constants/constants";

export default async function resourceFetcher(name) {
  return generalFetcher(`${API_URL}/${name}`)
    .then(data => {
      return {
        resources: data._embedded[name],
        uri: data._links.self.href
      }
    })
}
