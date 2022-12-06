import {
  CreateProblemButtonAndDialog,
  UpdateProblemDialog,
  DeleteProblemButton,
  UpdateProblemButton,
} from "components/problem/crud";
import { UpdateDataButton } from "components/general";
import { getRowClass, problemsColumns } from "utils/problemUtils";
import DataGrid from "components/DataGrid";
import { useReadList } from "hooks/crudHooks";
import { SpacedRow } from "components/SpacedRow";
import { DataLoadingInfo } from "components/DataLoadingInfo";
import { useDialogState } from "hooks/useDialogState";

export default function Problems() {
  const problems = useReadList(["problems"]);
  const editDialogState = useDialogState();

  const information = [problems];

  const columns = [
    ...problemsColumns,
    {
      headerName: "Action",
      accessor: "action",
      width: 300,
      cellRenderer: (cell: any) => {
        return (
          <>
            <UpdateProblemButton
              dialogState={editDialogState}
              problem={cell.data}
            />
            <DeleteProblemButton id={cell.data._links.self.href} />
          </>
        );
      },
    },
  ];

  return (
    <>
      <SpacedRow>
        <CreateProblemButtonAndDialog />
        <UpdateDataButton />
        <DataLoadingInfo information={information} />
      </SpacedRow>

      <UpdateProblemDialog dialogState={editDialogState} />

      <DataGrid
        rowData={problems.resources}
        columnDefs={columns}
        getRowClass={getRowClass}
      />
    </>
  );
}
