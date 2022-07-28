import axios from "axios";
import { SERVER_URL } from "constants/constants";
import useRead from "./useRead"

export default function useCreate(name) {
  const resources = useRead(name);

  return (newResource) => {
    const createResource = (resources) => {
      // TODO: stop using server_url
      axios.post(`${SERVER_URL}/api/${name}`, newResource)
        .then(() => console.log(`created ${name}`))
        .catch(err => console.error(err))
      
      newResource._links = { self: { href: "new" } }

      return [...resources, newResource]
    }

    resources.mutate(createResource)
  }
}
