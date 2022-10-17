import {
  CreateProblemDialog,
  UpdateProblemDialog,
  DeleteProblemButton,
} from "components/problemCRUD";
import { UpdateDataButton } from "components/general";
import { PaginatedTableFetchPage } from "components/TableWithPagination";
import { problemsColumns } from "utils/problemUtils";
import DataGrid from "components/DataGrid";
import { useReadList } from "hooks/crudHooks";

export default function Problems() {
  const problems = useReadList(["problems"]);

  const columns = [
    ...problemsColumns,
    {
      headerName: "Action",
      accessor: "action",
      width: 300,
      cellRenderer: (cell: any) => (
        <>
          <UpdateProblemDialog problem={cell.data} />{" "}
          <DeleteProblemButton id={cell.data._links.self.href} />
        </>
      ),
    },
  ];

  return (
    <>
      <DataGrid rowData={problems.resources} columnDefs={columns} />
      <UpdateDataButton />
      <CreateProblemDialog />
    </>
  );
}
