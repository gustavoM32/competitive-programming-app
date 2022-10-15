import { UpdateDataButton, UpdateCfDataButton } from "components/general";
import { Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import DataGrid from "components/DataGrid";
import { useReadList } from "hooks/crudHooks";


export default function CfContests() {
  const cfContests = useReadList(["cfContests"]);

  const columns = [
    {
      headerName: 'Id',
      field: 'id',
      width: 80
    },
    {
      headerName: 'Name',
      field: 'name',
    },
  ];

  return (
    <>
      <DataGrid
        rowData={cfContests.resources}
        columnDefs={columns}
      />
      <UpdateDataButton/>
      <UpdateCfDataButton infoPath='contests'/>
    </>
  );
}
