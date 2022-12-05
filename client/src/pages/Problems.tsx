import {
  CreateProblemDialog,
  UpdateProblemDialog,
  DeleteProblemButton,
} from "components/problemCRUD";
import { UpdateDataButton } from "components/general";
import { getRowClass, problemsColumns } from "utils/problemUtils";
import DataGrid from "components/DataGrid";
import { useReadList } from "hooks/crudHooks";
import { SpacedRow } from "components/SpacedRow";
import { DataLoadingInfo } from "components/DataLoadingInfo";

export default function Problems() {
  const problems = useReadList(["problems"]);

  const information = [problems];

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
      <SpacedRow>
        <CreateProblemDialog />
        <UpdateDataButton />
        <DataLoadingInfo information={information} />
      </SpacedRow>

      <DataGrid
        rowData={problems.resources}
        columnDefs={columns}
        getRowClass={getRowClass}
      />
    </>
  );
}
