import { SERVER_URL } from "constants/constants";
import axios from "axios";

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default async function fetcher(name) {
  let url = `${SERVER_URL}api/${name}`
  console.log(`starting: ${url}`);
  await sleep(1000);
  console.log(`fetching: ${url}`);

  return axios.get(url)
    .then(res => {
      console.log(`fetched: ${url}`);
      return res.data;
    })
    .then(data => data._embedded)
    .then(e => e[name])
};
