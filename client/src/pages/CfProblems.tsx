import { UpdateDataButton, UpdateCfDataButton } from "components/general";
import { PaginatedTableFetchPage } from "components/TableWithPagination";
import 'styles/globals.css'

export default function CfProblems() {
  const columns = [
    {
      Header: 'Code',
      accessor: 'code',
      width: 80
    },
    {
      Header: 'Name',
      accessor: 'name',
    },
  ];

  const tableClasses = {
    getRowClasses: (row: any) => {
      console.log(row);
      const problem = row.original
      const acs = problem.submissions.filter((p: any) => p.verdict === "OK");
      if (acs.length > 0) return "ac-color";
      if (problem.submissions.length > 0) return "wa-color";
    }
  }

  return (
    <>
      <PaginatedTableFetchPage
        columns={columns}
        dataPath={["cfProblemWithUserStatuses"]}
        tableClasses={tableClasses}
        />
      <UpdateDataButton/>
      <UpdateCfDataButton infoPath='problemsetProblems'/>
    </>
  );
}
