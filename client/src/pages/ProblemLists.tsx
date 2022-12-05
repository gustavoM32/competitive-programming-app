import { Button, Link, Tooltip } from "@mui/material";
import {
  CreateProblemListDialog,
  DeleteProblemListButton,
} from "components/problemListCRUD";
import { UpdateDataButton } from "components/general";
import { useReadList } from "hooks/crudHooks";
import DataGrid from "components/DataGrid";
import { formatDateTime } from "utils/utils";
import { SpacedRow } from "components/SpacedRow";
import { DataLoadingInfo } from "components/DataLoadingInfo";

export default function ProblemLists() {
  const problemLists = useReadList(["problemLists"]);

  const information = [problemLists];

  const columns = [
    {
      headerName: "Creation date",
      field: "dateAdded",
      width: 180,
      valueFormatter: (params: any) => formatDateTime(params.data.dateAdded),
    },
    {
      headerName: "Link",
      field: "link",
      width: 80,
      cellRenderer: (cell: any) => (
        <Link href={cell.value} target="_blank" rel="noopener">
          Link
        </Link>
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
        <CreateProblemListDialog />
        <UpdateDataButton />
        <DataLoadingInfo information={information} />
      </SpacedRow>

      <DataGrid rowData={problemLists.resources} columnDefs={columns} />
    </>
  );
}
