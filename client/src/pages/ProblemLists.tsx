import { Button, Link } from "@mui/material";
import {
  CreateProblemListDialog,
  DeleteProblemListButton,
} from "components/problemListCRUD";
import { UpdateDataButton } from "components/general";
import { PaginatedTableFetchPage } from "components/TableWithPagination";
import { useReadList } from "hooks/crudHooks";
import DataGrid from "components/DataGrid";

export default function ProblemLists() {
  const problemLists = useReadList(["problemLists"]);

  const columns = [
    { headerName: "Date added", field: "dateAdded", width: 150 },
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
            <Button href={`/problemLists/${listId}`} variant="contained">
              View
            </Button>{" "}
            <DeleteProblemListButton id={cell.data._links.self.href} />
          </>
        );
      },
    },
  ];

  return (
    <div>
      <DataGrid rowData={problemLists.resources} columnDefs={columns} />
      <UpdateDataButton />
      <CreateProblemListDialog />
    </div>
  );
}
