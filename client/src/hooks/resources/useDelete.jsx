import axios from "axios";
import useRead from "./useRead"

export default function useDelete(name) {
  const { mutate } = useRead(name);

  return (deletedId) => {
    const deleteResource = (resources) => {
      axios.delete(deletedId)
        .then(() => console.log(`deleted ${deletedId}`))
        .catch(err => console.error(err))

      return resources.filter(r => r._links.self.href != deletedId)
    }

    mutate(deleteResource)
  }
}
