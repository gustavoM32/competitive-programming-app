import { UpdateDataButton, UpdateCfDataButton } from "components/general";
import DataGrid from "components/DataGrid";
import { useReadList, useReadPage } from "hooks/crudHooks";
import "styles/globals.css";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Link,
  TextField,
} from "@mui/material";
import { useState } from "react";

export default function CfProblems() {
  const cfProblems = useReadPage(["cfProblemsWithUserStatuses"], 0, 200); // FIXME: Fetch all
  const [queryName, setQueryName] = useState("");
  const [statusFilter, setStatusFilter]: any = useState({
    nothing: true,
    wa: true,
    ac: true,
  });

  const columns = [
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
      headerName: "Name",
      field: "name",
      flex: 1,
    },
  ];

  const getRowClass = (row: any) => {
    const problem = row.data;
    const acs = problem.submissions.filter((p: any) => p.verdict === "OK");
    if (acs.length > 0) return "ac-color";
    if (problem.submissions.length > 0) return "wa-color";
    return "";
  };

  const handleChange = (e: any) => {
    setQueryName(e.target.value);
  };

  const handleStatusChange = (e: any) => {
    const statusName = e.target.name;
    setStatusFilter({
      ...statusFilter,
      [statusName]: e.target.checked,
    });
  };

  const filteredCfProblems = cfProblems.resources.filter((p: any) => {
    const lowercasedName = p.name.toLowerCase();
    if (!lowercasedName.includes(queryName)) return false;

    let lowercasedStatus: string = getRowClass({ data: p });
    if (lowercasedStatus === "ac-color") lowercasedStatus = "ac";
    else if (lowercasedStatus === "wa-color") lowercasedStatus = "wa";
    else lowercasedStatus = "nothing";
    if (!statusFilter[lowercasedStatus]) return false;

    return true;
  });

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <TextField
            label="Name"
            name="name"
            value={queryName}
            onChange={handleChange}
          />
        </Grid>

        <Grid item>
          <FormControl component="fieldset" sx={{ m: 3 }} variant="standard">
            <FormLabel>Status</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={statusFilter.nothing}
                    onChange={handleStatusChange}
                    name="nothing"
                  />
                }
                label="Nothing"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={statusFilter.wa}
                    onChange={handleStatusChange}
                    name="wa"
                  />
                }
                label="WA"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={statusFilter.ac}
                    onChange={handleStatusChange}
                    name="ac"
                  />
                }
                label="AC"
              />
            </FormGroup>
          </FormControl>
        </Grid>
      </Grid>
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
