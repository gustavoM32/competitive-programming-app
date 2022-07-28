import { Button } from "@mui/material";
import useDelete from "hooks/resources/useDelete";

export default function DeleteProblemDialog(props) {
  const deleteProblem = useDelete("problems");

  const onDelClick = () => {
    if (!window.confirm('Are you sure to delete?')) return;

    deleteProblem(props.id)
  }

  return (
    <Button variant="outlined" color="warning" onClick={onDelClick}>Delete</Button>
  );
}
