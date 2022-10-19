import { UpdateDataButton, UpdateCfDataButton } from "components/general";
import DataGrid from "components/DataGrid";
import { useReadList } from "hooks/crudHooks";
import "styles/globals.css";
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
import { problemStatusMap } from "utils/problemUtils";

export default function CfProblems() {
  const cfProblems = useReadList(["cfProblemsWithUserStatuses"]);

  const columns = useMemo(
    () => [
      {
        headerName: "Code",
        field: "code",
        width: 120,
        cellRenderer: (params: any) => {
          const { code, contestId, index } = params.data;
          const link = `http://codeforces.com/problemset/problem/${contestId}/${index}`;
          return (
            <Link href={link} target="_blank" rel="noopener">
              {code}
            </Link>
          );
        },
      },
      {
        headerName: "Rating",
        field: "rating",
        width: 120,
      },
      {
        headerName: "Name",
        field: "name",
        flex: 1,
      },
    ],
    []
  );

  const getRowClass = useCallback((row: any) => {
    const status = row.data.userStatus;
    if (status === "AC") return "ac-color";
    if (status === "WA") return "wa-color";
    if (status === "READ") return "read-color";
    return "";
  }, []);

  const [problemName, setProblemName] = useState("");
  const [problemStatus, setProblemStatus] = useState<string[]>([]);
  const [problemHasRating, setContestHasRating] = useState<boolean>(false);
  const [problemRating, setContestRating] = useState<number[]>([0, 4000]);

  const problemStatuses = useMemo(() => Object.keys(problemStatusMap), []);

  const handleNameChange = useCallback(
    (e: any) => {
      setProblemName(e.target.value);
    },
    [setProblemName]
  );

  const handleStatusChange = useCallback(
    (event: SelectChangeEvent<typeof problemStatus>) => {
      const value = event.target.value;
      setProblemStatus(typeof value === "string" ? value.split(",") : value);
    },
    [setProblemStatus]
  );

  const handleHasRatingChange = useCallback(
    (event: any) => {
      setContestHasRating(event.target.checked);
    },
    [setContestHasRating]
  );

  const handleRatingChange = useCallback(
    (event: Event, newValue: number | number[]) => {
      if (typeof newValue === "number") return;
      setContestRating(newValue);
    },
    [setContestRating]
  );
  const filteredCfProblems = useMemo(
    () =>
      cfProblems.resources.filter((p: any) => {
        const lowercasedName = p.name.toLowerCase();
        if (!lowercasedName.includes(problemName)) return false;

        return (
          (problemStatus.length === 0 ||
            problemStatus.includes(p.userStatus)) &&
          (!problemHasRating || p.rating != null) &&
          (p.rating == null ||
            (problemRating[0] <= p.rating && p.rating <= problemRating[1]))
        );
      }),
    [
      cfProblems.resources,
      problemName,
      problemStatus,
      problemHasRating,
      problemRating,
    ]
  );

  return (
    <>
      <FormControl sx={{ mx: 2, my: 1, width: 400 }}>
        <TextField
          variant="outlined"
          label="Problem name"
          value={problemName}
          onChange={handleNameChange}
        />
      </FormControl>

      <FormControl sx={{ mx: 2, my: 1, width: 400 }}>
        <InputLabel>Problem status</InputLabel>
        <Select
          multiple
          value={problemStatus}
          onChange={handleStatusChange}
          input={<OutlinedInput label="Problem status" />}
          renderValue={(selected) =>
            selected.map((s: string) => problemStatusMap[s]).join(", ")
          }
        >
          {problemStatuses.map((status) => (
            <MenuItem key={status} value={status}>
              <Checkbox checked={problemStatus.indexOf(status) > -1} />
              <ListItemText primary={problemStatusMap[status]} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ mx: 2, my: 1, width: 400 }}>
        <Typography gutterBottom>
          Rating {`${problemRating[0]} - ${problemRating[1]}`}
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
                  checked={problemHasRating}
                  onChange={handleHasRatingChange}
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
              value={problemRating}
              onChange={handleRatingChange}
              min={0}
              step={100}
              max={4000}
              valueLabelDisplay="off"
            />
          </Grid>
        </Grid>
      </FormControl>
      <DataGrid
        rowData={filteredCfProblems}
        columnDefs={columns}
        getRowClass={getRowClass}
      />
      <UpdateDataButton />
      <UpdateCfDataButton infoPath="cfProblems" />
    </>
  );
}
