import useCreate from "hooks/resources/useCreate";
import ProblemDialog from "./ProblemDialog";

export default function AddProblemDialog() {
  const addProblem = useCreate("problems")

  return (
    <ProblemDialog
      title="Add problem"
      actionName="Add"
      actionFunc={addProblem} />
  );
}
