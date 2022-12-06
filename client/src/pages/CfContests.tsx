import { UpdateDataButton } from "components/general";
import {
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  Link,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import DataGrid from "components/DataGrid";
import { useInformationList } from "hooks/crudHooks";
import { useCallback, useMemo, useState } from "react";
import { UserContestStatus } from "types";
import {
  contestStatusMap,
  getContestRowClass,
  getContestStatus,
} from "utils/problemUtils";
import { getCfHandleFromStorage } from "utils/userUtils";
import { DataLoadingInfo } from "components/DataLoadingInfo";
import { SpacedRow } from "components/SpacedRow";

export default function CfContests() {
  const cfContests = useInformationList(["cfContests"]);
  const userContestStatus = useInformationList(["userContestStatus"], {
    handle: getCfHandleFromStorage(),
  });

  const information = [cfContests, userContestStatus];

  const userContestStatusMap = useMemo(
    () =>
      new Map<number, UserContestStatus>(
        userContestStatus.resources.map((el: UserContestStatus) => [el.id, el])
      ),
    [userContestStatus.resources]
  );

  const columns = useMemo(
    () => [
      {
        headerName: "Id",
        field: "id",
        width: 80,
        cellRenderer: (params: any) => {
          const { id } = params.data;
          const link = `http://codeforces.com/contest/${id}`;
          return (
            <Link href={link} target="_blank" rel="noopener">
              {id}
            </Link>
          );
        },
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
    ],
    []
  );

  // filters
  const [contestName, setContestName] = useState<string>("");
  const [contestStatus, setContestStatus] = useState<string[]>([]);
  const [contestDuration, setContestDuration] = useState<number[]>([0, 8]);

  const contestStatuses = useMemo(() => Object.keys(contestStatusMap), []);

  const handleNameChange = useCallback(
    (event: any) => {
      const value = event.target.value;
      setContestName(value);
    },
    [setContestName]
  );

  const handleContestStatusChange = useCallback(
    (event: SelectChangeEvent<typeof contestStatus>) => {
      const value = event.target.value;
      setContestStatus(typeof value === "string" ? value.split(",") : value);
    },
    [setContestStatus]
  );

  const calcDurationValue = useCallback((value: number) => {
    return value < 8 ? value : Number.MAX_SAFE_INTEGER;
  }, []);

  const handleDurationChange = useCallback(
    (event: Event, newValue: number | number[]) => {
      if (typeof newValue === "number") return;
      newValue[1] = Math.max(newValue[1], 1);
      newValue[0] = Math.min(newValue[0], 7);
      setContestDuration(newValue);
    },
    [setContestDuration]
  );

  const filteredContests = useMemo(() => {
    const duration = contestDuration.map(calcDurationValue);
    const SECONDS_IN_A_HOUR = 3600;

    return cfContests.resources.filter(
      (c: any) =>
        `${c.id} ${c.name}`.toLowerCase().includes(contestName.toLowerCase()) &&
        (contestStatus.length === 0 ||
          contestStatus.includes(getContestStatus(c, userContestStatusMap))) &&
        SECONDS_IN_A_HOUR * duration[0] <= c.durationSeconds &&
        c.durationSeconds <= SECONDS_IN_A_HOUR * duration[1]
    );
  }, [
    cfContests.resources,
    calcDurationValue,
    contestName,
    contestStatus,
    contestDuration,
    userContestStatusMap,
  ]);

  return (
    <>
      <FormControl sx={{ mx: 2, my: 1, width: 400 }}>
        <TextField
          variant="outlined"
          label="Contest name"
          value={contestName}
          onChange={handleNameChange}
        />
      </FormControl>

      <FormControl sx={{ mx: 2, my: 1, width: 400 }}>
        <InputLabel>Contest status</InputLabel>
        <Select
          multiple
          value={contestStatus}
          onChange={handleContestStatusChange}
          input={<OutlinedInput label="Contest status" />}
          renderValue={(selected) =>
            selected.map((s: string) => contestStatusMap[s]).join(", ")
          }
        >
          {contestStatuses.map((status) => (
            <MenuItem key={status} value={status}>
              <Checkbox checked={contestStatus.indexOf(status) > -1} />
              <ListItemText primary={contestStatusMap[status]} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ mx: 2, my: 1, width: 400 }}>
        <Typography gutterBottom>
          {contestDuration[1] === 8
            ? contestDuration[0] > 0
              ? `Duration greater than or equal to ${contestDuration[0]}h`
              : "Any duration"
            : contestDuration[0] > 0
            ? `Duration between ${contestDuration[0]}h and ${contestDuration[1]}h`
            : `Duration less than or equal to ${contestDuration[1]}h`}
        </Typography>
        <Grid container direction="row" alignItems="center" sx={{ height: 42 }}>
          <Slider
            value={contestDuration}
            onChange={handleDurationChange}
            min={0}
            step={1}
            max={8}
            scale={calcDurationValue}
            valueLabelDisplay="off"
          />
        </Grid>
      </FormControl>

      <SpacedRow>
        <UpdateDataButton />
        <DataLoadingInfo information={information} />
      </SpacedRow>

      <DataGrid
        rowData={filteredContests}
        columnDefs={columns}
        getRowClass={(row: any) =>
          getContestRowClass(row, userContestStatusMap)
        }
      />
    </>
  );
}
