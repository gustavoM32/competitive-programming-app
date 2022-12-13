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
import { getCfHandleFromStorage } from "utils/userUtils";

export default function Problems() {
  const loggedInUser = getCfHandleFromStorage();
  const problemsKey =
    loggedInUser.length > 0 ? ["problems", "search", "findByCreatedBy"] : [];

  const problems = useReadList(problemsKey, {
    user: loggedInUser,
  });

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
        <CreateProblemButtonAndDialog disabled={loggedInUser.length === 0} />
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
