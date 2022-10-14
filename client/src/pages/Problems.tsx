import { CreateProblemDialog, UpdateProblemDialog, DeleteProblemButton } from "components/problemCRUD";
import { UpdateDataButton } from "components/general";
import { PaginatedTableFetchPage } from "components/TableWithPagination";
import { problemsColumns } from "utils/ProblemUtils";

export default function Problems() {
  const columns = [
    ...problemsColumns,
    { Header: 'Action', accessor: 'action', width: 300
    , Cell: (cell: any) => (
      <>
        <UpdateProblemDialog problem={cell.row.original}/>{' '}
        <DeleteProblemButton id={cell.row.original._links.self.href}/>
      </>
    ) },
  ];

  return (
    <div>
      <PaginatedTableFetchPage
        columns={columns}
        dataPath={["problems"]}
        />
      <UpdateDataButton/>
      <CreateProblemDialog/>
    </div>
  );
}
