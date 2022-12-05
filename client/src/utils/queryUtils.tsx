export type UriString = string;

export type ResourcePath = string[];

export type RequestParameters = { [key: string]: string };

export type ReadOneRequestKey = [UriString, RequestParameters?];

export type ReadListRequestKey = [ResourcePath, RequestParameters?];
