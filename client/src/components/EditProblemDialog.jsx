import axios from "axios";
import ProblemDialog from "./ProblemDialog";

export default function EditProblemDialog(props) {
  const editItem = async (problem) => {
    try {
      await axios.patch(props.id, problem)
      props.problems.mutate()
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <ProblemDialog
      title="Edit problem"
      problem={props.problem}
      actionFunc={editItem}
      actionName="Save" />
  );
}
