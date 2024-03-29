import { UpdateDataButton } from "components/general";
import DataGrid from "components/DataGrid";
import { useInformationList } from "hooks/crudHooks";
import StarIcon from "@mui/icons-material/Star";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
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
import { useCallback, useMemo, useState } from "react";
import { getPossibleFieldValues, MenuProps } from "utils/filterUtils";
import { formatDateTime } from "utils/utils";
import { DataLoadingInfo } from "components/DataLoadingInfo";
import { SpacedRow } from "components/SpacedRow";

export default function CfGym() {
  const cfGym = useInformationList(["cfGymContests"]);

  const information = [cfGym];

  const columns = useMemo(
    () => [
      {
        headerName: "Id",
        field: "id",
        width: 100,
        cellRenderer: (params: any) => {
          const { id } = params.data;
          const link = `http://codeforces.com/gym/${id}`;
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
        valueFormatter: (params: any) => formatDateTime(params.data.startTime),
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
        headerName: "Difficulty",
        field: "difficulty",
        width: 150,
        cellRenderer: (params: any) => {
          const diff = params.data.difficulty;
          if (diff == null)
            return (
              <Grid container direction="row" justifyContent="center">
                <Grid item>-</Grid>
              </Grid>
            );

          const stars = [];
          for (let i = 0; i < diff; i++)
            stars.push(
              <Grid item key={i}>
                <StarIcon fontSize="small" />
              </Grid>
            );

          return (
            <Grid container direction="row" justifyContent="center">
              {stars}
            </Grid>
          );
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
  const contestTypes = useMemo(
    () => getPossibleFieldValues(cfGym.resources, "type"),
    [cfGym.resources]
  );

  const contestRegions = useMemo(
    () => getPossibleFieldValues(cfGym.resources, "region"),
    [cfGym.resources]
  );

  const contestCountries = useMemo(
    () => getPossibleFieldValues(cfGym.resources, "country"),
    [cfGym.resources]
  );

  const reversedList = useMemo(
    () => [...cfGym.resources].reverse(),
    [cfGym.resources]
  );

  const [contestName, setContestName] = useState<string>("");
  const [contestHasDifficulty, setContestHasDifficulty] =
    useState<boolean>(false);
  const [contestDifficulty, setContestDifficulty] = useState<number[]>([1, 5]);
  const [contestDuration, setContestDuration] = useState<number[]>([0, 8]);
  const [contestType, setContestType] = useState<string[]>([]);
  const [contestRegion, setContestRegion] = useState<string[]>([]);
  const [contestCountry, setContestCountry] = useState<string[]>([]);

  const handleNameChange = useCallback(
    (event: any) => {
      const value = event.target.value;
      setContestName(value);
    },
    [setContestName]
  );

  const handleHasDifficultyChange = useCallback(
    (event: any) => {
      setContestHasDifficulty(event.target.checked);
    },
    [setContestHasDifficulty]
  );

  const handleDifficultyChange = useCallback(
    (event: Event, newValue: number | number[]) => {
      if (typeof newValue === "number") return;
      setContestDifficulty(newValue);
    },
    [setContestDifficulty]
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

  const handleTypeChange = useCallback(
    (event: SelectChangeEvent<typeof contestType>) => {
      const value = event.target.value;
      setContestType(typeof value === "string" ? value.split(",") : value);
    },
    [setContestType]
  );

  const handleRegionChange = useCallback(
    (event: SelectChangeEvent<typeof contestRegion>) => {
      const value = event.target.value;
      setContestRegion(typeof value === "string" ? value.split(",") : value);
    },
    [setContestRegion]
  );

  const handleCountryChange = useCallback(
    (event: SelectChangeEvent<typeof contestCountry>) => {
      const value = event.target.value;
      setContestCountry(typeof value === "string" ? value.split(",") : value);
    },
    [setContestCountry]
  );

  const filteredContests = useMemo(() => {
    const duration = contestDuration.map(calcDurationValue);
    const SECONDS_IN_A_HOUR = 3600;

    return reversedList.filter(
      (c: any) =>
        `${c.id} ${c.name}`.toLowerCase().includes(contestName.toLowerCase()) &&
        SECONDS_IN_A_HOUR * duration[0] <= c.durationSeconds &&
        c.durationSeconds <= SECONDS_IN_A_HOUR * duration[1] &&
        (!contestHasDifficulty || c.difficulty != null) &&
        (c.difficulty == null ||
          (contestDifficulty[0] <= c.difficulty &&
            c.difficulty <= contestDifficulty[1])) &&
        (contestType.length === 0 || contestType.includes(c.type)) &&
        (contestRegion.length === 0 || contestRegion.includes(c.region)) &&
        (contestCountry.length === 0 || contestCountry.includes(c.country))
    );
  }, [
    calcDurationValue,
    reversedList,
    contestName,
    contestHasDifficulty,
    contestDifficulty,
    contestDuration,
    contestType,
    contestRegion,
    contestCountry,
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

      <FormControl sx={{ mx: 2, my: 1, width: 400 }}>
        <Typography gutterBottom>
          Difficulty {`${contestDifficulty[0]} - ${contestDifficulty[1]}`}
        </Typography>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={contestHasDifficulty}
                  onChange={handleHasDifficultyChange}
                />
              }
              label="has"
            />
          </Grid>
          <Grid
            item
            container
            sx={{ width: 320 }}
            alignItems="center"
            justifyContent="center"
          >
            <Slider
              value={contestDifficulty}
              onChange={handleDifficultyChange}
              min={1}
              step={1}
              max={5}
              // disabled={!contestHasDifficulty}
              valueLabelDisplay="off"
            />
          </Grid>
        </Grid>
      </FormControl>

      <FormControl sx={{ mx: 2, my: 1, width: 400 }}>
        <InputLabel>Contest type</InputLabel>
        <Select
          multiple
          value={contestType}
          onChange={handleTypeChange}
          input={<OutlinedInput label="Contest type" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {contestTypes.map((type) => (
            <MenuItem key={type} value={type}>
              <Checkbox checked={contestType.indexOf(type) > -1} />
              <ListItemText primary={type} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ mx: 2, my: 1, width: 400 }}>
        <InputLabel>ICPC region</InputLabel>
        <Select
          multiple
          value={contestRegion}
          onChange={handleRegionChange}
          input={<OutlinedInput label="ICPC region" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {contestRegions.map((region) => (
            <MenuItem key={region} value={region}>
              <Checkbox checked={contestRegion.indexOf(region) > -1} />
              <ListItemText primary={region} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ mx: 2, my: 1, width: 400 }}>
        <InputLabel>Country</InputLabel>
        <Select
          multiple
          value={contestCountry}
          onChange={handleCountryChange}
          input={<OutlinedInput label="Country" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {contestCountries.map((country) => (
            <MenuItem key={country} value={country}>
              <Checkbox checked={contestCountry.indexOf(country) > -1} />
              <ListItemText primary={country} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <SpacedRow>
        <UpdateDataButton />
        <DataLoadingInfo information={information} />
      </SpacedRow>

      <DataGrid rowData={filteredContests} columnDefs={columns} />
    </>
  );
}
