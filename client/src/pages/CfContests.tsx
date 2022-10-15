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
      headerName: "Start time",
      field: "startTime",
      valueFormatter: (params: any) => {
        const startTime = params.data.startTime + "Z"; // for some reason spring strips the z
        const date = new Date(Date.parse(startTime));
        return date.toLocaleTimeString([], {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
      width: 180,
    },
    {
      headerName: "Duration",
      field: "durationSeconds",
      width: 100,
      valueFormatter: (params: any) => {
        const durationSeconds = params.data.durationSeconds;
        const hours = Math.floor(durationSeconds / 3600);
        const minutes = String((durationSeconds / 60) % 60).padStart(2, "0");
        return `${hours}h${minutes}`;
      },
    },
    {
      headerName: "Name",
      field: "name",
      flex: 1,
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
