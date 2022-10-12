import { Link } from "@mui/material";
import { CreateProblemDialog, UpdateProblemDialog, DeleteProblemButton } from "components/problemCRUD";
import { UpdateDataButton } from "components/general";
import { Fragment } from "react";
import TableWithPagination from "components/TableWithPagination";

type CellParams = {
  value: string
}

const problemStatusMap : { [key: string]: string } = {
  "NOTHING": "Not read",
  "READ": "Read",
  "WA": "WA",
  "AC": "Accepted"
};

const editorialStatusMap : { [key: string]: string } = {
  "NOTHING": "Not read",
  "READ_BEFORE_AC": "Read before",
  "READ_AFTER_AC": "Read after",
};

export default function Problems() {
  const convertStatus = (map: { [key: string]: string }) => {
    return (cell: CellParams) => {
      return map[cell.value];
    }
  }

  const convertLinesToBr = () => {
    return (cell: CellParams) => {
      const text = cell.value ?? "";
      const result = text.split('\n').map((item: string, index: number) => {
        return (<Fragment key={index}>{item}<br/></Fragment>)
      });
      return result;
    }
  }

  const columns = [
    { Header: 'Date added', accessor: 'dateAdded', width: 250 },
    { Header: 'Link', accessor: 'link', width: 50,
      Cell: (cell: any) => <Link href={cell.value} target="_blank" rel="noopener">Link</Link>
    },
    { Header: 'Name', accessor: 'name', width: 200 },
    { Header: 'Status', accessor: 'problemStatus', width: 150
    , Cell: convertStatus(problemStatusMap) },
    { Header: 'Editorial', accessor: 'editorialStatus', width: 150
    , Cell: convertStatus(editorialStatusMap) },
    { Header: 'Comments', accessor: 'comments', width: 400
    , Cell: convertLinesToBr() },
    { Header: 'Action', accessor: 'action', width: 300
    , Cell: (cell: any) => (
      <>
        <UpdateProblemDialog problem={cell.row.original}/>{' '}
        <DeleteProblemButton id={cell.row.original._links.self.href}/>
      </>
    ) },
  ];

  return (
    <div>
      <TableWithPagination
        columns={columns}
        dataPath={["problems"]}
        />
      <UpdateDataButton/>
      <CreateProblemDialog/>
    </div>
  );
}
