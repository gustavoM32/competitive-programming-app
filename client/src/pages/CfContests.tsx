import { DataGrid } from "@mui/x-data-grid";
import { CreateProblemDialog, UpdateProblemDialog, DeleteProblemButton } from "components/problemCRUD";
import { useReadList } from "hooks/crudHooks";
import { UpdateDataButton, UpdateCfDataButton } from "components/general";

type RowParams = {
  id: any,
  row: any
}

export default function CfContests() {
  const contests = useReadList(["cfContests"]);

  const columns = [
    { field: 'id', headerName: 'Id', width: 80},
    { field: 'name', headerName: 'Name', width: 500},
    { field: 'action', headerName: 'Action', width: 300, renderCell: (params: RowParams) => (
      <>
        <UpdateProblemDialog problem={params.row}/>{' '}
        <DeleteProblemButton id={params.id}/>
      </>
    )},
  ];

  if (contests.isError) console.error(contests.error)

  return (
    <>
      <div>
        <h1>Contests</h1>
        {contests.isLoading ? <p>Loading...</p> : null}
        {contests.error ? <p>Error: check console</p> : null}
        <UpdateDataButton/>
        <UpdateCfDataButton infoPath='contests'/>
        <DataGrid
          autoHeight
          rows={contests.resources}
          columns={columns}
          getRowId={(row) => row._links.self.href}
        />
        <CreateProblemDialog/>
      </div>
    </>
  );
}
