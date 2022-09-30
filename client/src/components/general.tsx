import { Button } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { updateInfo } from "api/updateInfo";

export function UpdateDataButton() {
  const queryClient = useQueryClient()
  
  return (
    <Button variant="outlined" onClick={() => queryClient.invalidateQueries() }>Update data</Button>
  )
}

export function UpdateCfDataButton(props: { infoPath: string }) {
  const queryClient = useQueryClient()

  const updateCfData = () => {
    updateInfo(props.infoPath)
      .then(() => queryClient.invalidateQueries())
  }
  
  return (
    <Button variant="outlined" onClick={updateCfData}>Update CF data</Button>
  )
}