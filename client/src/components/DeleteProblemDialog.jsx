import { Button } from "@mui/material";
import axios from "axios";

export default function DeleteProblemDialog(props) {
  const onDelClick = () => {
    if (!window.confirm('Are you sure to delete?')) return;


    axios.delete(props.id)
      .then(() => {
        console.log("deletou")

      })
      .catch(err => console.error(err));

    
    props.problems.mutate(props.problems.data.filter((p) => p._links.self.href != props.id))
  }

  return (
    <Button variant="outlined" color="warning" onClick={onDelClick}>Delete</Button>
  );
}
