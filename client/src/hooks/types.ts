export type ResourceData = any

export type Resource = {
  resource: ResourceData,
  uri: string
}

export type ResourceList = {
  resources: ResourceData[],
  uri: string
}
