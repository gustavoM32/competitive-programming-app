import { UpdateDataButton, UpdateCfDataButton } from "components/general";
import { Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import DataGrid from "components/DataGrid";
import { useReadList } from "hooks/crudHooks";

// const Inputs = () => {
//   return (
//     <Grid>
//     <TextField label="Name">Name</TextField>
//     <InputLabel id="demo-simple-select-label">Type</InputLabel>
//     <Select>
//       <MenuItem value={10}>Codeforces Round</MenuItem>
//       <MenuItem value={20}>Educational Round</MenuItem>
//       <MenuItem value={30}>Global Round</MenuItem>
//     </Select>
//     <InputLabel id="demo-simple-select-label">Div</InputLabel>
//     <Select>
//       <MenuItem value={1}>1</MenuItem>
//       <MenuItem value={2}>2</MenuItem>
//       <MenuItem value={3}>3</MenuItem>
//       <MenuItem value={4}>4</MenuItem>
//     </Select>
//   </Grid>
//   )
// }

export default function CfContests() {
  const cfContests = useReadList(["cfContests"]);

  const columns = [
    {
      headerName: "Id",
      field: "id",
      width: 80,
    },
    {
      headerName: "Name",
      field: "name",
    },
  ];

  return (
    <>
      <DataGrid rowData={cfContests.resources} columnDefs={columns} />
      <UpdateDataButton />
      <UpdateCfDataButton infoPath="contests" />
    </>
  );
}
