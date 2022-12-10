import { API_URL, INFO_URL, SERVER_URL } from "constants/constants";
import { ReadListRequestKey, ReadOneRequestKey } from "utils/queryUtils";
import { readResource } from "./crud";

export type InformationListResponse = {
  resources: any[];
  isUpdating: boolean;
};

export async function resourcePageFetcher(
  { queryKey }: { queryKey: string[] },
  pageNumber: number,
  pageSize: number
) {
  const uri = `${API_URL}/${queryKey.join(
    "/"
  )}?page=${pageNumber}&size=${pageSize}`;

  if (queryKey.length === 0) {
    throw Error("Empty queryKey");
  }

  const lastElement = findResourceName(queryKey);

  return readResource(uri).then((data) => {
    return {
      resources: data._embedded[lastElement],
      uri: data._links.self.href,
      page: data.page,
    };
  });
}

export async function resourceListFetcher({
  queryKey,
}: {
  queryKey: ReadListRequestKey;
}) {
  const [path, parameters] = queryKey;
  const uri = `${API_URL}/${path.join("/")}`;

  if (path.length === 0) {
    throw Error("Empty query path");
  }

  const lastElement = findResourceName(path); // FIXME: Use query key to get the resource name

  return readResource(uri, parameters).then((data) => {
    return {
      resources: data._embedded[lastElement],
      uri: data._links.self.href,
    };
  });
}

function findResourceName(path: string[]): string {
  const searchIndex = path.findIndex((el) => el === "search");
  if (searchIndex === -1) return path[path.length - 1];
  return path[searchIndex - 1];
}

export async function resourceFetcher({
  queryKey,
}: {
  queryKey: ReadOneRequestKey;
}) {
  const [uri, parameters] = queryKey;

  return readResource(uri, parameters).then((data) => {
    return {
      resource: data,
      uri: data._links.self.href,
    };
  });
}

export async function informationListFetcher({
  queryKey,
}: {
  queryKey: ReadListRequestKey;
}): Promise<InformationListResponse> {
  const [path, parameters] = queryKey;
  const uri = `${INFO_URL}/${path.join("/")}`;

  if (path.length === 0) {
    throw Error("Empty query path");
  }

  return readResource(uri, parameters);
}

export async function readOnlyFetcher({ queryKey }: { queryKey: string[] }) {
  const uri = `${SERVER_URL}/info/${queryKey.join("/")}`;

  if (queryKey.length === 0) {
    throw Error("Empty queryKey");
  }

  return readResource(uri).then((data) => {
    return {
      resource: data,
    };
  });
}
