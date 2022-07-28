import axios from "axios";

const FETCH_DELAY = 1000;

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default async function generalFetcher(uri: string) {
  console.log(`starting: ${uri}`);
  await sleep(FETCH_DELAY);
  console.log(`fetching: ${uri}`);

  return axios.get(uri)
    .then(res => {
      console.log(`fetched: ${uri}`);
      return res.data;
    })
}
