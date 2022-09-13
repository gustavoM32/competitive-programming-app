import { createResource, deleteResource, readResource, updateResource } from 'api/crud'
import axios, { AxiosResponse } from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('readResource', () => {
  const resource = { "name": "value" }
  const response = { "data": [ resource ] }
  
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue(response as AxiosResponse)
  })
  
  test('should be called', async () => {
    await readResource("uri")
    expect(mockedAxios.get).toHaveBeenCalledWith("uri")
  })

  test('should return the resource', async () => {
    let returnedResource = await readResource("uri")
    expect(returnedResource[0]).toEqual(resource)
  })
})

describe('createResource', () => {
  const newResource = { "name": "value" }
  const response = { "data": [ newResource ] }
  
  beforeEach(() => {
    mockedAxios.post.mockResolvedValue(response as AxiosResponse)
  })
  
  describe('when called without the config parameter', () => {
    test('should be called', async () => {
      await createResource("uri", newResource)
      expect(mockedAxios.post).toHaveBeenCalledWith("uri", newResource, undefined)
    })

    test('should return the created resource', async () => {
      let createdResource = await createResource("uri", newResource)
      expect(createdResource[0]).toEqual(newResource)
    })
  })
  
  describe('when called with the config parameter', () => {
    let config = { headers: { "key": "value" } }

    test('should be called', async () => {
      await createResource("uri", newResource, config)
      expect(mockedAxios.post).toHaveBeenCalledWith("uri", newResource, config)
    })

    test('should return the created resource', async () => {
      let createdResource = await createResource("uri", newResource, config)
      expect(createdResource[0]).toEqual(newResource)
    })
  })
})

describe('updateResource', () => {
  const updatedResource = { "name": "value" }
  const response = {} as AxiosResponse
  
  beforeEach(() => {
    mockedAxios.patch.mockResolvedValue(response)
  })
  
  test('should be called', async () => {
    await updateResource("uri", updatedResource)
    expect(mockedAxios.patch).toHaveBeenCalledWith("uri", updatedResource)
  })
})

describe('deleteResource', () => {
  const response = {} as AxiosResponse
  
  beforeEach(() => {
    mockedAxios.delete.mockResolvedValue(response)
  })

  test('should be called', async () => {
    await deleteResource("uri")
    expect(mockedAxios.delete).toHaveBeenCalledWith("uri")
  })
})
