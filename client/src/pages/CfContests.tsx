import { DataGrid } from "@mui/x-data-grid";
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
  ];

  if (contests.isError) console.error(contests.error)

  return (
    <>
      <div>
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
      </div>
    </>
  );
}
