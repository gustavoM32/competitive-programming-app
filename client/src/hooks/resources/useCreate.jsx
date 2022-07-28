import axios from "axios";
import useRead from "./useRead";

export default function useCreate(name) {
  const { uri, mutate } = useRead(name);

  return (newResource) => {
    const createResource = (resources) => {
      axios.post(uri, newResource)
        .then(() => console.log(`post ${uri}`))
        .catch(err => console.error(err))
      
      newResource._links = { self: { href: "new" } }

      return [...resources, newResource]
    }

    mutate(createResource)
  }
}
