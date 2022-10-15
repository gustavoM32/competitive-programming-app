import { UpdateDataButton, UpdateCfDataButton } from "components/general";
import DataGrid from "components/DataGrid";
import { useReadList, useReadPage } from "hooks/crudHooks";
import 'styles/globals.css'

export default function CfProblems() {
  const cfProblems = useReadPage(["cfProblemWithUserStatuses"], 0, 200);
  
  const columns = [
    {
      headerName: 'Code',
      field: 'code',
      width: 120
    },
    {
      headerName: 'Name',
      field: 'name',
      flex: 1
    },
  ];

  const getRowClass = (row: any) => {
    console.log(row);
    const problem = row.data
    const acs = problem.submissions.filter((p: any) => p.verdict === "OK");
    if (acs.length > 0) return "ac-color";
    if (problem.submissions.length > 0) return "wa-color";
  }

  return (
    <>
      <DataGrid
        rowData={cfProblems.resources}
        columnDefs={columns}
        getRowClass={getRowClass}
      />
      <UpdateDataButton/>
      <UpdateCfDataButton infoPath='problemsetProblems'/>
    </>
  );
}
