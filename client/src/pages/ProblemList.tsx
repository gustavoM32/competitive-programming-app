import { Grid, Link } from "@mui/material";
import {
  UpdateProblemListDialog,
  DeleteProblemListButtonOne,
  AddProblemToListDialog,
  RemoveProblemFromListButton,
  AddNewProblemToListDialog,
} from "components/problemListCRUD";
import { API_URL } from "constants/constants";
import { useRead, useReadList } from "hooks/crudHooks";
import { UpdateDataButton } from "components/general";
import {
  DeleteProblemButton,
  UpdateProblemDialog,
} from "components/problemCRUD";
import { useParams } from "react-router-dom";
import { getRowClass, problemsColumns } from "utils/problemUtils";
import DataGrid from "components/DataGrid";
import { ProblemType } from "types";
import { useMemo } from "react";
import { DataLoadingInfo } from "components/DataLoadingInfo";
import { SpacedRow } from "components/SpacedRow";

export default function ProblemList() {
  const { problemListId } = useParams();
  const resourceURI =
    problemListId !== undefined
      ? `${API_URL}/problemLists/${problemListId}`
      : "";
  const problemsKey =
    problemListId !== undefined
      ? ["problemLists", `${problemListId}`, "problems"]
      : [];
  const problemListData = useRead(resourceURI);
  const problemListProblems = useReadList(problemsKey);

  const information = [problemListData, problemListProblems];

  const explicitSolved = useMemo(
    () =>
      problemListProblems.resources.filter(
        (p: ProblemType) => p.problemStatus === "AC"
      ).length,
    [problemListProblems.resources]
  );
  const explicitTotal = useMemo(
    () => problemListProblems.resources.length,
    [problemListProblems.resources]
  );

  const { resource: problemList } = problemListData;

  const columns = [
    ...problemsColumns,
    {
      headerName: "Action",
      field: "action",
      width: 400,
      cellRenderer: (cell: any) => {
        return (
          <>
            <UpdateProblemDialog problem={cell.data} />
            <RemoveProblemFromListButton
              problemList={problemList}
              problemId={cell.data.id}
            />
            <DeleteProblemButton id={cell.data._links.self.href} />
          </>
        );
      },
    },
  ];

  const solved = problemList.solvedCount + explicitSolved;
  const total = problemList.totalCount + explicitTotal;

  if (problemListData.isError) console.error(problemListData.error);

  const link = "//" + problemList.link;

  return (
    <>
      {problemListData.isLoading ? <p>Loading...</p> : null}
      {problemListData.isError ? <p>Error: check console</p> : null}
      <Grid container>
        <h2>
          <Link href={link} target="_blank" rel="noopener">
            {problemList.name}
          </Link>
        </h2>
      </Grid>
      <p>{problemList.description}</p>
      <p>{problemList.notes}</p>
      <h3>Problems {Number.isFinite(total) ? `${solved}/${total}` : null}</h3>

      <SpacedRow>
        <AddProblemToListDialog problemList={problemList} />
        <AddNewProblemToListDialog problemList={problemList} />
        <UpdateProblemListDialog problemList={problemList} />
        <DeleteProblemListButtonOne id={problemListData.uri} />
        <UpdateDataButton />
        <DataLoadingInfo information={information} />
      </SpacedRow>

      <DataGrid
        rowData={problemListProblems.resources}
        columnDefs={columns}
        getRowClass={getRowClass}
      />
    </>
  );
}
