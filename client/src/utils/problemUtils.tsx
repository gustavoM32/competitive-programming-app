import { Fragment } from "react";
import { Link } from "@mui/material";

type CellParams = {
  value: string;
};

export const problemStatusMap: { [key: string]: string } = {
  NOTHING: "Not read",
  READ: "Read",
  WA: "WA",
  AC: "Accepted",
};

const editorialStatusMap: { [key: string]: string } = {
  NOTHING: "Not read",
  READ_BEFORE_AC: "Read before",
  READ_AFTER_AC: "Read after",
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
  { headerName: "Date added", field: "dateAdded", width: 150 },
  {
    headerName: "Link",
    field: "link",
    width: 80,
    cellRenderer: (cell: any) => (
      <Link href={cell.value} target="_blank" rel="noopener">
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

export const getRowClass = (row: any) => {
  const status = row.data.problemStatus;
  if (status === "AC") return "ac-color";
  if (status === "WA") return "wa-color";
  if (status === "READ") return "read-color";
  return "";
};
