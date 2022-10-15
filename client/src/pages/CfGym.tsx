import { UpdateDataButton, UpdateCfDataButton } from "components/general";
import DataGrid from "components/DataGrid";
import { useReadList } from "hooks/crudHooks";

export default function CfGym() {
  const cfGym = useReadList(["cfGyms"]);

  const columns = [
    {
      headerName: "Id",
      field: "id",
      width: 100,
      sort: "desc",
    },
    {
      headerName: "Start time",
      field: "startTime",
      valueFormatter: (params: any) => {
        const startTime = params.data.startTime;
        if (startTime == null) return "No date";

        const utcStartTime = startTime + "Z"; // for some reason spring strips the z
        const date = new Date(Date.parse(utcStartTime));
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
      <DataGrid rowData={cfGym.resources} columnDefs={columns} />
      <UpdateDataButton />
      <UpdateCfDataButton infoPath="contests" />
    </>
  );
}
