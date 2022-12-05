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
import {
  contestStatusMap,
  getProblemCode,
  getProblemContestStatus,
  getProblemRowClass,
  getProblemStatus,
  problemStatusMap,
} from "utils/problemUtils";
import { UserProblemStatus } from "types";
import { getCfHandleFromStorage } from "utils/userUtils";

export default function CfProblems() {
  const cfProblems = useReadList(["cfProblems"]);
  const userProblemStatus = useReadList(["userProblemStatuses"], {
    handle: getCfHandleFromStorage(),
  });

  const userProblemStatusMap = useMemo(
    () =>
      new Map<string, UserProblemStatus>(
        userProblemStatus.resources.map((el: UserProblemStatus) => [
          getProblemCode(el.problemId),
          el,
        ])
      ),
    [userProblemStatus.resources]
  );

  const columns = useMemo(
    () => [
      {
        headerName: "Code",
        field: "code",
        width: 120,
        cellRenderer: (params: any) => {
          const { contestId, index } = params.data.problemId;
          const link = `http://codeforces.com/problemset/problem/${contestId}/${index}`;
          return (
            <Link href={link} target="_blank" rel="noopener">
              {`${contestId}${index}`}
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

  const [problemName, setProblemName] = useState("");
  const [problemStatus, setProblemStatus] = useState<string[]>([]);
  const [contestStatus, setContestStatus] = useState<string[]>([]);
  const [problemHasRating, setContestHasRating] = useState<boolean>(false);
  const [problemRating, setContestRating] = useState<number[]>([0, 4000]);

  const problemStatuses = useMemo(() => Object.keys(problemStatusMap), []);
  const contestStatuses = useMemo(() => Object.keys(contestStatusMap), []);

  const handleNameChange = useCallback(
    (e: any) => {
      setProblemName(e.target.value);
    },
    [setProblemName]
  );

  const handleProblemStatusChange = useCallback(
    (event: SelectChangeEvent<typeof problemStatus>) => {
      const value = event.target.value;
      setProblemStatus(typeof value === "string" ? value.split(",") : value);
    },
    [setProblemStatus]
  );

  const handleContestStatusChange = useCallback(
    (event: SelectChangeEvent<typeof contestStatus>) => {
      const value = event.target.value;
      setContestStatus(typeof value === "string" ? value.split(",") : value);
    },
    [setContestStatus]
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
            problemStatus.includes(
              getProblemStatus(p, userProblemStatusMap)
            )) &&
          (contestStatus.length === 0 ||
            contestStatus.includes(
              getProblemContestStatus(p, userProblemStatusMap)
            )) &&
          (!problemHasRating || p.rating != null) &&
          (p.rating == null ||
            (problemRating[0] <= p.rating && p.rating <= problemRating[1]))
        );
      }),
    [
      cfProblems.resources,
      problemName,
      problemStatus,
      contestStatus,
      problemHasRating,
      problemRating,
      userProblemStatusMap,
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
          onChange={handleProblemStatusChange}
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
        getRowClass={(row: any) =>
          getProblemRowClass(row, userProblemStatusMap)
        }
      />
      <UpdateDataButton />
      <UpdateCfDataButton
        infoPath="userStatus"
        parameters={{ handle: getCfHandleFromStorage() }}
      />
    </>
  );
}
