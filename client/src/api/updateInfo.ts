import { INFO_URL } from "constants/constants";
import { RequestParameters } from "utils/queryUtils";
import { readResource } from "./crud";

/** @deprecated */
export async function updateInfo(info: string, parameters?: RequestParameters) {
  const uri = `${INFO_URL}/${info}`;

  return await readResource(uri, parameters).then((res) => {
    if (res !== "OK") throw Error("Update was not OK");
    return res;
  });
}
