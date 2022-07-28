import axios from "axios";
import useRead from "./useRead"

export default function useUpdate(name) {
  const resources = useRead(name);

  return (updatedResource) => {
    const updateResource = (resources) => {
      const updatedId = updatedResource._links.self.href

      axios.patch(`${updatedId}`, updatedResource)
        .then(() => console.log(`updated ${updatedId}`))
        .catch(err => console.error(err))

      return resources.map(r => r._links.self.href == updatedId ? updatedResource : r)
    }

    resources.mutate(updateResource)
  }
}
