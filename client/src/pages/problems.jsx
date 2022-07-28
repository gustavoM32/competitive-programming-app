import { AppBar, Button, Link, Toolbar, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { CreateProblemDialog, UpdateProblemDialog, DeleteProblemButton } from "components/problemCRUD";
import Head from "next/head";
import { useRead } from "hooks/crud";

export default function Problems() {
  const problems = useRead("problems");

  const columns = [
    { field: 'dateAdded', headerName: 'Date added', type: 'dateTime', width: 250},
    { field: 'link', headerName: 'Link', width: 50, renderCell: (params) => (
      <Link href={params.row.link} target="_blank" rel="noopener">Link</Link>
    )},
    { field: 'name', headerName: 'Name', width: 200},
    // { field: 'rating', headerName: 'Rating'},
    // { field: 'topics', headerName: 'Topics'},
    { field: 'problemStatus', headerName: 'Status', width: 150},
    { field: 'editorialStatus', headerName: 'Editorial', width: 200},
    { field: 'comments', headerName: 'Comments', width: 400},
    // { field: 'studies', headerName: 'Studies'},
    { field: 'action', headerName: 'Action', width: 200, renderCell: (params) => (
      <>
        <UpdateProblemDialog id={params.id} problem={params.row}/>{' '}
        <DeleteProblemButton id={params.id}/>
      </>
    )},
  ];

  return (
    <>
      <Head>
        <title>Problems</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Problems
          </Typography>
        </Toolbar>
      </AppBar>

      <div>
        <h1>Problems</h1>
        {problems.isLoading ? <p>Loading...</p> : null}
        {problems.error ? <p>Error: {problems.error.message}</p> : null}
        <Button onClick={() => problems.mutate()}>Update data</Button>
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
