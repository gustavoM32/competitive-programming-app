import axios from "axios";
import { SERVER_URL } from "constants/constants";
import useSWR from "swr";

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const fetcher = async url => {
  console.log(`starting: ${url}`);
  await sleep(1000);
  console.log(`fetching: ${url}`);

  return axios.get(url).then(res => {
    console.log(`fetched: ${url}`);

    return res.data._embedded.problems;
  })
};

export default function useProblems() {
  const { data, error, mutate } = useSWR(`${SERVER_URL}api/problems`, fetcher);

  return {
    data: data ?? [],
    isLoading: !error && !data,
    isError: error,
    mutate: mutate
  }
}
