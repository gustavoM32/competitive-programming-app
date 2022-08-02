import axios from "axios";
import { API_URL } from "constants/constants";

const FETCH_DELAY = 1000;

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function generalFetcher(uri: string) {
  console.log(`starting: ${uri}`);
  await sleep(FETCH_DELAY);
  console.log(`fetching: ${uri}`);

  return axios.get(uri)
    .then(res => {
      console.log(`fetched: ${uri}`);
      return res.data;
    })
}

export async function resourceListFetcher(name: string) {
  return generalFetcher(`${API_URL}/${name}`)
    .then(data => {
      return {
        resources: data._embedded[name],
        uri: data._links.self.href
      }
    })
}

