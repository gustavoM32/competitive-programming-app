import axios from "axios";

const DEV_MODE = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
const ADD_REQUEST_DELAY = true && DEV_MODE
const REQUEST_DELAY = 500;

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

  return axios.get(uri)
    .then(success)
    .catch(fail)
}

export async function createResource(uri: string, newResource: any) {
  const success = () => { console.log(`POST ${uri} success`) }
  const fail = (e: any) => { console.error(e) }

  console.log(`POST ${uri}`)

  if (ADD_REQUEST_DELAY) await sleep(REQUEST_DELAY)

  return axios.post(uri, newResource)
    .then(success)
    .catch(fail)
}

export async function updateResource(uri: string, updatedResource: any) {
  const success = () => { console.log(`PATCH ${uri} success`) }
  const fail = (e: any) => { console.error(e) }

  console.log(`PATCH ${uri}`)

  if (ADD_REQUEST_DELAY) await sleep(REQUEST_DELAY)

  return axios.patch(uri, updatedResource)
    .then(success)
    .catch(fail)
}

export async function deleteResource(uri: string) {
  const success = () => { console.log(`DELETE ${uri} success`) }
  const fail = (e: any) => { console.error(e) }

  console.log(`DELETE ${uri}`)

  if (ADD_REQUEST_DELAY) await sleep(REQUEST_DELAY)

  return axios.delete(uri)
    .then(success)
    .catch(fail)
}
