import { DataGrid } from "@mui/x-data-grid";
import { useReadList } from "hooks/crudHooks";
import { UpdateDataButton, UpdateCfDataButton } from "components/general";

type RowParams = {
  id: any,
  row: any
}

export default function CfProblems() {
  const problems = useReadList(["cfProblems"]);

  const columns = [
    { field: 'code', headerName: 'Code', width: 200 },
    { field: 'name', headerName: 'Name', width: 200 }
  ];

  if (problems.isError) console.error(problems.error)

  return (
    <>
      <div>
        {problems.isLoading ? <p>Loading...</p> : null}
        {problems.error ? <p>Error: check console</p> : null}
        <UpdateDataButton/>
        <UpdateCfDataButton infoPath='problemsetProblems'/>
        <DataGrid
          autoHeight
          rows={problems.resources}
          columns={columns}
          getRowId={(row) => row._links.self.href}
        />
      </div>
    </>
  );
}
