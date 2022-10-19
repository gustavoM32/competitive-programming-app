import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { ProblemListType, ProblemType } from "types";
import {
  useCreate,
  useDelete,
  useReadList,
  useUpdateOne,
} from "hooks/crudHooks";
import { focusManager, useQueryClient } from "@tanstack/react-query";
import { createResource, deleteResource } from "api/crud";
import { ProblemDialog } from "./problemCRUD";
import { API_URL } from "constants/constants";

type ProblemListDialogProps = {
  title: string;
  tooltip?: string;
  problemList?: ProblemListType;
  actionName: string;
  actionFunc: (problemList: ProblemListType) => void;
};

// TODO: refactor this and problemCRUD

export function ProblemListDialog(props: ProblemListDialogProps) {
  const [problemList, setProblemList] = useState(props.problemList ?? {});
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
      <Tooltip title={props.tooltip ?? ""}>
        <Button variant="outlined" color="primary" onClick={handleOpen}>
          {props.title}{" "}
        </Button>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
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
            value={problemList.name ?? ""}
            name="name"
            label="Name"
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

          {/* TODO: add problems */}
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

export function CreateProblemListDialog() {
  const createProblemList = useCreate("problemLists");

  return (
    <ProblemListDialog
      title="Create"
      tooltip="Create problem list"
      actionName="Create"
      actionFunc={createProblemList}
    />
  );
}

export function UpdateProblemListDialog(props: {
  problemList: ProblemListType;
}) {
  const editProblemList = useUpdateOne(props.problemList._links.self.href);

  return (
    <ProblemListDialog
      title="Edit"
      tooltip="Edit problem list"
      problemList={props.problemList}
      actionFunc={editProblemList}
      actionName="Save"
    />
  );
}

export function DeleteProblemListButton(props: { id: string }) {
  const deleteProblemList = useDelete();

  const onDelClick = () => {
    focusManager.setFocused(false);
    const shouldDelete = window.confirm("Are you sure to delete?");

    if (shouldDelete) deleteProblemList(props.id);

    setTimeout(() => focusManager.setFocused(undefined), 0);
  };

  return (
    <Tooltip title="Delete problem list">
      <Button variant="outlined" color="error" onClick={onDelClick}>
        Delete
      </Button>
    </Tooltip>
  );
}

export function DeleteProblemListButtonOne(props: { id: string }) {
  const onDelClick = () => {
    const shouldDelete = window.confirm("Are you sure to delete?");

    if (shouldDelete) {
      deleteResource(props.id)
        .then(() => {
          window.location.pathname = "/problemLists";
        })
        .catch((e) => console.error(e));
    }
  };

  return (
    <Tooltip title="Delete problem list">
      <Button variant="outlined" color="error" onClick={onDelClick}>
        Delete problem list
      </Button>
    </Tooltip>
  );
}

export function AddProblemToListDialog(props: {
  problemList: ProblemListType;
}) {
  const [open, setOpen] = useState(false);
  const [problemURI, setProblemURI] = useState("");
  const { resources: allProblems } = useReadList(["problems"]);
  const { problemList } = props;
  const queryClient = useQueryClient();

  const problemsKey =
    problemList?.id !== undefined
      ? ["problemLists", `${problemList.id}`, "problems"]
      : [];
  const problemsData = useReadList(problemsKey);

  // FIXME: this doesn't look so good...
  if (problemsData.isLoading) return <p>Loading...</p>;
  if (problemsData.error || !problemsData.data) {
    console.error(problemsData.error);
    return <p>Error: check console</p>;
  }

  const { resources: listProblems } = problemsData.data;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: SelectChangeEvent) => {
    setProblemURI(e.target.value as string);
  };

  const addProblemToList = async () => {
    const problemListProblems = problemList._links.problems.href;
    createResource(problemListProblems, problemURI, {
      headers: { "Content-Type": "text/uri-list" },
    }).then(() => {
      queryClient.invalidateQueries([
        "problemLists",
        `${problemList.id}`,
        "problems",
      ]);
      handleClose();
    });
  };

  const problemsIdsInList = listProblems.map((p: ProblemType) => p.id);
  const filteredProblems = allProblems.filter(
    (p: ProblemType) => !problemsIdsInList.includes(p.id)
  );

  return (
    <>
      <Tooltip title="Add existing problem to list">
        <Button variant="outlined" color="primary" onClick={handleOpen}>
          Add problem
        </Button>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="form-dialog-title">Add problem</DialogTitle>
        <DialogContent>
          <InputLabel id="demo-simple-select-label">Problem</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={problemURI}
            label="Problem"
            onChange={handleChange}
          >
            {filteredProblems.map((p: ProblemType) => {
              return (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              );
            })}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="warning">
            Cancel
          </Button>
          <Button onClick={addProblemToList} color="primary">
            Add selected
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export function AddNewProblemToListDialog(props: {
  problemList: ProblemListType;
}) {
  const queryClient = useQueryClient();
  const { problemList } = props;

  const addNewProblemToList = async (newProblem: ProblemType) => {
    const uri = `${API_URL}/problems`; // FIXME: API_URL should not be used here
    const createdProblem = await createResource(uri, newProblem);

    const problemListProblems = problemList._links.problems.href;
    const newProblemURI = createdProblem._links.self.href;

    await createResource(problemListProblems, newProblemURI, {
      headers: { "Content-Type": "text/uri-list" },
    });
    queryClient.invalidateQueries([
      "problemLists",
      `${problemList.id}`,
      "problems",
    ]);
  };

  return (
    <ProblemDialog
      title="Create and add"
      tooltip="Create problem and add it to list"
      actionName="Add new problem to list"
      actionFunc={addNewProblemToList}
    />
  );
}

export function RemoveProblemFromListButton(props: {
  problemList: ProblemListType;
  problemId: string;
}) {
  const { problemList, problemId } = props;
  const queryClient = useQueryClient();

  const deleteProblemFromList = () => {
    const shouldDelete = window.confirm("Are you sure to delete?");

    if (shouldDelete) {
      deleteResource(`${problemList._links.problems.href}/${problemId}`).then(
        () => {
          queryClient.invalidateQueries([
            "problemLists",
            `${problemList.id}`,
            "problems",
          ]);
        }
      );
    }
  };

  return (
    <Tooltip title="Remove problem from list">
      <Button
        variant="outlined"
        color="warning"
        onClick={deleteProblemFromList}
      >
        Remove
      </Button>
    </Tooltip>
  );
}
