import { UPDATE_INFO_URL } from "constants/constants";
import { readResource } from "./crud";

export async function updateInfo(info: string) {
  const uri = `${UPDATE_INFO_URL}/${info}`;

  return await readResource(uri).then((res) => {
    if (res !== "OK") throw Error("Update was not OK");
    return res;
  });
}
