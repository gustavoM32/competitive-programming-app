import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { ProblemListType } from "types";

export type ProblemListDialogProps = {
  title: string;
  problemList: ProblemListType;
  setProblemList: (problemList: ProblemListType) => void;
  open: boolean;
  handleClose: () => void;
  actionName: string;
  actionFunc: (problemList: ProblemListType) => void;
};

// TODO: refactor this and problemCRUD
export function ProblemListDialog(props: ProblemListDialogProps) {
  const { problemList, setProblemList, open, handleClose } = props;

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setProblemList({ ...problemList, [e.target.name]: e.target.value });
  };

  const handleSolvedChange = (e: { target: { name: any; value: any } }) => {
    let solved = Math.max(0, e.target.value);
    let total = Math.max(solved, problemList.totalCount);
    setProblemList({ ...problemList, solvedCount: solved, totalCount: total });
  };

  const handleTotalChange = (e: { target: { name: any; value: any } }) => {
    let total = Math.max(0, e.target.value);
    let solved = Math.min(total, problemList.solvedCount);
    setProblemList({ ...problemList, solvedCount: solved, totalCount: total });
  };

  const actionProblemList = async () => {
    await props.actionFunc(problemList);
    handleClose();
  };

  return (
    <>
      <Dialog open={open}>
        <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            onChange={handleChange}
            fullWidth
            value={problemList.name ?? ""}
            name="name"
            label="Name"
          />

          <TextField
            margin="dense"
            onChange={handleChange}
            fullWidth
            value={problemList.link ?? ""}
            name="link"
            label="Link"
          />

          <TextField
            margin="dense"
            onChange={handleChange}
            fullWidth
            multiline
            value={problemList.description ?? ""}
            name="description"
            label="Description"
          />

          <TextField
            margin="dense"
            onChange={handleChange}
            fullWidth
            multiline
            value={problemList.notes ?? ""}
            name="notes"
            label="Notes"
          />

          <TextField
            margin="dense"
            onChange={handleSolvedChange}
            fullWidth
            value={problemList.solvedCount ?? ""}
            type="number"
            name="solvedCount"
            label="Implicit solved"
          />

          <TextField
            margin="dense"
            onChange={handleTotalChange}
            fullWidth
            value={problemList.totalCount ?? ""}
            type="number"
            name="totalCount"
            label="Implicit total"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="warning">
            Cancel
          </Button>
          <Button onClick={actionProblemList} color="primary">
            {props.actionName}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
