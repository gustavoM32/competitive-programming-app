import axios from "axios";
import { SERVER_URL } from "constants/constants";
import ProblemDialog from "./ProblemDialog";

export default function AddProblemDialog(props) {
  const addItem = async (problem) => {
    try {
      await axios.post(`${SERVER_URL}api/problems`, problem)
      props.problems.mutate();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <ProblemDialog
      title="Add problem"
      actionName="Add"
      actionFunc={addItem} />
  );
}
