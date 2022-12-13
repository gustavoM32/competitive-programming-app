import axios, { AxiosRequestConfig } from "axios";
import { RequestParameters, UriString } from "utils/queryUtils";

const DEV_MODE =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development";
const ADD_REQUEST_DELAY = true && DEV_MODE;
const REQUEST_DELAY = 100;
const MAKE_REQUESTS_FAIL = false && DEV_MODE;

type RequestResponse = {
  data: any;
};

function consoleLog(msg: string) {
  if (DEV_MODE) {
    console.info(msg);
  } else {
    console.debug(msg);
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function parametersToString(parameters?: RequestParameters) {
  if (parameters === undefined) return "";
  return Object.keys(parameters)
    .map(
      (key: string, i: number) =>
        `${i === 0 ? "?" : "&"}${key}=${parameters[key]}`
    )
    .join("");
}

export async function readResource(
  uri: UriString,
  parameters?: RequestParameters
) {
  const success = (res: RequestResponse) => {
    consoleLog(`GET ${uri}${parametersToString(parameters)} success`);
    return res.data;
  };
  const fail = (e: any) => {
    console.error(e);
  };

  consoleLog(`GET ${uri}${parametersToString(parameters)}`);

  if (ADD_REQUEST_DELAY) await sleep(REQUEST_DELAY);
  if (MAKE_REQUESTS_FAIL)
    return new Promise(() => {
      throw Error("ERROR");
    });

  return axios.get(uri, { params: parameters }).then(success).catch(fail);
}

export async function createResource(
  uri: string,
  newResource: any,
  config?: AxiosRequestConfig<any>
) {
  const success = (response: RequestResponse) => {
    consoleLog(`POST ${uri} success`);
    return response.data;
  };
  const fail = (e: any) => {
    console.error(e);
  };

  consoleLog(`POST ${uri}`);

  if (ADD_REQUEST_DELAY) await sleep(REQUEST_DELAY);
  if (MAKE_REQUESTS_FAIL)
    return new Promise(() => {
      throw Error("ERROR");
    });

  return axios.post(uri, newResource, config).then(success).catch(fail);
}

export async function updateResource(uri: string, updatedResource: any) {
  const success = () => {
    consoleLog(`PATCH ${uri} success`);
  };
  const fail = (e: any) => {
    console.error(e);
  };

  consoleLog(`PATCH ${uri}`);

  if (ADD_REQUEST_DELAY) await sleep(REQUEST_DELAY);
  if (MAKE_REQUESTS_FAIL)
    return new Promise(() => {
      throw Error("ERROR");
    });

  return axios.patch(uri, updatedResource).then(success).catch(fail);
}

export async function deleteResource(uri: string) {
  const success = () => {
    consoleLog(`DELETE ${uri} success`);
  };
  const fail = (e: any) => {
    console.error(e);
  };

  consoleLog(`DELETE ${uri}`);

  if (ADD_REQUEST_DELAY) await sleep(REQUEST_DELAY);
  if (MAKE_REQUESTS_FAIL)
    return new Promise(() => {
      throw Error("ERROR");
    });

  return axios.delete(uri).then(success).catch(fail);
}
