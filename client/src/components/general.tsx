import { Button } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";

export function UpdateDataButton() {
  const queryClient = useQueryClient()
  
  return (
    <Button variant="outlined" onClick={() => queryClient.invalidateQueries() }>Update data</Button>
  )
}
