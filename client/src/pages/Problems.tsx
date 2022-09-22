import { Link } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { CreateProblemDialog, UpdateProblemDialog, DeleteProblemButton } from "components/problemCRUD";
import { useReadList } from "hooks/crudHooks";
import { UpdateDataButton } from "components/general";
import { Fragment } from "react";

type RowParams = {
  id: any,
  row: any
}

const problemStatusMap : { [key: string]: string } = {
  "NOTHING": "Not read",
  "READ": "Read before",
  "WA": "WA",
  "AC": "Accepted"
};

const editorialStatusMap : { [key: string]: string } = {
  "NOTHING": "Not read",
  "READ_BEFORE_AC": "Read before",
  "READ_AFTER_AC": "Read after",
};

export default function Problems() {
  const problems = useReadList(["problems"]);

  const convertStatus = (field: string, map: { [key: string]: string }) => {
    return (params: RowParams) => {
      return map[params.row[field]];
    }
  }

  const convertLinesToBr = (field: string) => {
    return (params: RowParams) => {
      const text = params.row[field];
      const result = text.split('\n').map((item: string, key: string) => {
        return (<Fragment key={key}>{item}<br/></Fragment>)
      });
      return result;
    }
  }

  const columns = [
    { field: 'dateAdded', headerName: 'Date added', type: 'dateTime', width: 250},
    { field: 'link', headerName: 'Link', width: 50, renderCell: (params: RowParams) => (
      <Link href={params.row.link} target="_blank" rel="noopener">Link</Link>
    )},
    { field: 'name', headerName: 'Name', width: 200},
    // { field: 'rating', headerName: 'Rating'},
    // { field: 'topics', headerName: 'Topics'},
    { field: 'problemStatus', headerName: 'Status', width: 150, renderCell: convertStatus('problemStatus', problemStatusMap) },
    { field: 'editorialStatus', headerName: 'Editorial', width: 200, renderCell: convertStatus('editorialStatus', editorialStatusMap)},
    { field: 'comments', headerName: 'Comments', width: 400, renderCell: convertLinesToBr('comments')},
    // { field: 'studies', headerName: 'Studies'},
    { field: 'action', headerName: 'Action', width: 300, renderCell: (params: RowParams) => (
      <>
        <UpdateProblemDialog problem={params.row}/>{' '}
        <DeleteProblemButton id={params.id}/>
      </>
    )},
  ];

  if (problems.isError) console.error(problems.error)

  return (
    <>
      <div>
        <h1>Problems</h1>
        {problems.isLoading ? <p>Loading...</p> : null}
        {problems.error ? <p>Error: check console</p> : null}
        <UpdateDataButton/>
        <DataGrid
          autoHeight
          rows={problems.resources}
          columns={columns}
          getRowId={(row) => row._links.self.href}
        />
        <CreateProblemDialog/>
      </div>
    </>
  );
}
