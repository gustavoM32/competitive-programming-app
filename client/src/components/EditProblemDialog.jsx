import useUpdate from "hooks/resources/useUpdate";
import ProblemDialog from "./ProblemDialog";

export default function EditProblemDialog(props) {
  const editProblem = useUpdate("problems")

  return (
    <ProblemDialog
      title="Edit problem"
      problem={props.problem}
      actionFunc={editProblem}
      actionName="Save" />
  );
}
