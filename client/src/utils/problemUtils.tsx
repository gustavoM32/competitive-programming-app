import { Fragment } from "react";
import { Link } from "@mui/material";
import {
  CfContest,
  CfProblem,
  Problem,
  ProblemId,
  UserContestStatus,
  UserProblemStatus,
} from "types";
import { formatDateTime } from "./utils";

type CellParams = {
  value: string;
};

export const problemStatusMap: { [key: string]: string } = {
  NOTHING: "Not read",
  READ: "Read",
  WA: "Wrong answer",
  AC: "Accepted",
};

export const contestStatusMap: { [key: string]: string } = {
  CLEAN: "Clean",
  DIRTY: "Tried",
  COMPLETED: "Completed",
};

const editorialStatusMap: { [key: string]: string } = {
  NOTHING: "Not read",
  READ_BEFORE_AC: "Read before AC",
  READ_AFTER_AC: "Read after AC",
};

const convertStatus = (map: { [key: string]: string }) => {
  return (cell: CellParams) => {
    return map[cell.value];
  };
};

const convertLinesToBr = () => {
  return (cell: CellParams) => {
    const text = cell.value ?? "";
    const result = text.split("\n").map((item: string, index: number) => {
      return (
        <Fragment key={index}>
          {item}
          <br />
        </Fragment>
      );
    });
    return result;
  };
};

export const problemsColumns = [
  {
    headerName: "Addition date",
    field: "dateAdded",
    width: 180,
    valueFormatter: (params: any) => formatDateTime(params.data.dateAdded),
  },
  {
    headerName: "Link",
    field: "link",
    width: 80,
    cellRenderer: (cell: any) => (
      <Link href={"//" + cell.value} target="_blank" rel="noopener">
        Link
      </Link>
    ),
  },
  { headerName: "Name", field: "name", width: 200 },
  {
    headerName: "Status",
    field: "problemStatus",
    width: 150,
    cellRenderer: convertStatus(problemStatusMap),
  },
  {
    headerName: "Editorial",
    field: "editorialStatus",
    width: 150,
    cellRenderer: convertStatus(editorialStatusMap),
  },
  {
    headerName: "Comments",
    field: "comments",
    flex: 1,
    cellRenderer: convertLinesToBr(),
  },
];

export const getProblemCode = (problemId: ProblemId) => {
  return `${problemId.contestId}${problemId.index}`;
};

export const getProblemStatus = (
  problem: CfProblem,
  userProblemStatusMap: Map<string, UserProblemStatus>
): string => {
  const code = getProblemCode(problem.problemId);
  const status = userProblemStatusMap.get(code)?.problemStatus;
  if (status === undefined) return "NOTHING";
  return status;
};

export const getProblemContestStatus = (
  problem: CfProblem,
  userProblemStatusMap: Map<string, UserProblemStatus>
): string => {
  const code = getProblemCode(problem.problemId);
  const status = userProblemStatusMap.get(code)?.contestStatus;
  if (status === undefined) return "CLEAN";
  return status;
};

export const getContestStatus = (
  contest: CfContest,
  userContestStatusMap: Map<number, UserContestStatus>
): string => {
  const status = userContestStatusMap.get(contest.id)?.contestStatus;
  if (status === undefined) return "CLEAN";
  return status;
};

type Row<T> = {
  data: T;
};

export const getRowClass = (row: Row<Problem>): string => {
  const status = row.data.problemStatus;
  if (status === "AC") return "ac-color";
  if (status === "WA") return "wa-color";
  if (status === "READ") return "read-color";
  return "";
};

export const getProblemRowClass = (
  row: Row<CfProblem>,
  userProblemStatusMap: Map<string, UserProblemStatus>
): string => {
  const status = getProblemStatus(row.data, userProblemStatusMap);
  if (status === "AC") return "ac-color";
  if (status === "WA") return "wa-color";
  if (status === "READ") return "read-color";
  return "";
};

export const getContestRowClass = (
  row: Row<CfContest>,
  userContestStatusMap: Map<number, UserContestStatus>
): string => {
  const status = getContestStatus(row.data, userContestStatusMap);
  if (status === "COMPLETED") return "ac-color";
  if (status === "DIRTY") return "read-color";
  return "";
};
