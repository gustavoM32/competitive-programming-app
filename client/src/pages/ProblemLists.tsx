import { Button, Link, Tooltip } from "@mui/material";
import {
  CreateProblemListButtonAndDialog,
  DeleteProblemListButton,
} from "components/problemList/crud";
import { UpdateDataButton } from "components/general";
import { useReadList } from "hooks/crudHooks";
import DataGrid from "components/DataGrid";
import { formatDateTime } from "utils/utils";
import { SpacedRow } from "components/SpacedRow";
import { DataLoadingInfo } from "components/DataLoadingInfo";
import { getCfHandleFromStorage } from "utils/userUtils";

export default function ProblemLists() {
  const loggedInUser = getCfHandleFromStorage();
  const problemListsKey =
    loggedInUser.length > 0
      ? ["problemLists", "search", "findByCreatedBy"]
      : [];

  const problemLists = useReadList(problemListsKey, {
    user: loggedInUser,
  });

  const information = [problemLists];

  const columns = [
    {
      headerName: "Creation date",
      field: "dateAdded",
      width: 180,
      sort: "desc",
      valueFormatter: (params: any) => formatDateTime(params.data.dateAdded),
    },
    {
      headerName: "Link",
      field: "link",
      width: 80,
      cellRenderer: (cell: any) =>
        typeof cell.value === "string" && cell.value.length > 0 ? (
          <Link href={"//" + cell.value} target="_blank" rel="noopener">
            Link
          </Link>
        ) : (
          "None"
        ),
    },
    { headerName: "Name", field: "name", width: 200 },
    {
      headerName: "Action",
      field: "action",
      flex: 1,
      cellRenderer: (cell: any) => {
        let listId = cell.data.id;
        return (
          <>
            <Tooltip title="View problem list">
              <Button href={`/problemLists/${listId}`} variant="contained">
                View
              </Button>
            </Tooltip>{" "}
            <DeleteProblemListButton id={cell.data._links.self.href} />
          </>
        );
      },
    },
  ];

  return (
    <>
      <SpacedRow>
        <CreateProblemListButtonAndDialog
          disabled={loggedInUser.length === 0}
        />
        <UpdateDataButton />
        <DataLoadingInfo information={information} />
      </SpacedRow>

      <DataGrid rowData={problemLists.resources} columnDefs={columns} />
    </>
  );
}
