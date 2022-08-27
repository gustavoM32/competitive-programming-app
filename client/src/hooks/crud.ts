import axios, { AxiosRequestConfig } from "axios";

const DEV_MODE = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
const ADD_REQUEST_DELAY = true && DEV_MODE
const REQUEST_DELAY = 500;
const MAKE_REQUESTS_FAIL = false && DEV_MODE

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function readResource(uri: string) {
  const success = (res: any) => { 
    console.log(`GET ${uri} success`)
    return res.data
  }
  const fail = (e: any) => { console.error(e) }

  console.log(`GET ${uri}`)

  if (ADD_REQUEST_DELAY) await sleep(REQUEST_DELAY)
  if (MAKE_REQUESTS_FAIL) return new Promise(() => {throw Error("ERROR")})

  return axios.get(uri)
    .then(success)
    .catch(fail)
}

export async function createResource(uri: string, newResource: any, config?: AxiosRequestConfig<any>) {
  const success = () => { console.log(`POST ${uri} success`) }
  const fail = (e: any) => { console.error(e) }

  console.log(`POST ${uri}`)

  if (ADD_REQUEST_DELAY) await sleep(REQUEST_DELAY)
  if (MAKE_REQUESTS_FAIL) return new Promise(() => {throw Error("ERROR")})

  return axios.post(uri, newResource, config)
    .then(success)
    .catch(fail)
}

export async function updateResource(uri: string, updatedResource: any) {
  const success = () => { console.log(`PATCH ${uri} success`) }
  const fail = (e: any) => { console.error(e) }

  console.log(`PATCH ${uri}`)

  if (ADD_REQUEST_DELAY) await sleep(REQUEST_DELAY)
  if (MAKE_REQUESTS_FAIL) return new Promise(() => {throw Error("ERROR")})

  return axios.patch(uri, updatedResource)
    .then(success)
    .catch(fail)
}

export async function deleteResource(uri: string) {
  const success = () => { console.log(`DELETE ${uri} success`) }
  const fail = (e: any) => { console.error(e) }

  console.log(`DELETE ${uri}`)

  if (ADD_REQUEST_DELAY) await sleep(REQUEST_DELAY)
  if (MAKE_REQUESTS_FAIL) return new Promise(() => {throw Error("ERROR")})

  return axios.delete(uri)
    .then(success)
    .catch(fail)
}
