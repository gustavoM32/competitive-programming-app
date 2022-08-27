import { AppBar, Button, Link, Toolbar, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { CreateProblemListDialog, DeleteProblemListButton } from "components/problemListCRUD";
import Head from "next/head";
import { useReadList } from "hooks/crudHooks";
import { UpdateDataButton } from "components/general";

type RowParams = {
  id: any,
  row: any
}

export default function ProblemLists() {
  const problemLists = useReadList("problemLists");

  const columns = [
    { field: 'dateAdded', headerName: 'Date added', type: 'dateTime', width: 250},
    { field: 'link', headerName: 'Link', width: 50, renderCell: (params: RowParams) => (
      <Link href={params.row.link} target="_blank" rel="noopener">Link</Link>
    )},
    { field: 'name', headerName: 'Name', width: 200},
    { field: 'rating', headerName: 'Rating'},
    { field: 'topics', headerName: 'Topics'},
    { field: 'action', headerName: 'Action', width: 200, renderCell: (params: RowParams) => {
      let listId = params.row._links.self.href.split("/").slice(-1)
      return (
        <>
          <Button href={`/problemLists/${listId}`} variant="contained">View</Button>
          <DeleteProblemListButton id={params.id}/>
        </>
      )
    }},
  ];

  if (problemLists.error) console.error(problemLists.error)

  return (
    <>
      <Head>
        <title>Problem Lists</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Problem Lists
          </Typography>
        </Toolbar>
      </AppBar>

      <div>
        <h1>Problem Lists</h1>
        {problemLists.isLoading ? <p>Loading...</p> : null}
        {problemLists.error ? <p>Error: check console</p> : null}
        <UpdateDataButton/>
        <DataGrid
          autoHeight
          rows={problemLists.resources}
          columns={columns}
          getRowId={(row) => row._links.self.href}
        />
        <CreateProblemListDialog/>
      </div>
    </>
  );
}
