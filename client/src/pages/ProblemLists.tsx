import { Button, Link } from "@mui/material";
import { CreateProblemListDialog, DeleteProblemListButton } from "components/problemListCRUD";
import { UpdateDataButton } from "components/general";
import { PaginatedTableFetchPage } from "components/TableWithPagination";

export default function ProblemLists() {
  const columns = [
    { Header: 'Date added', accessor: 'dateAdded', width: 250 },
    { Header: 'Link', accessor: 'link', width: 50,
      Cell: (cell: any) => <Link href={cell.value} target="_blank" rel="noopener">Link</Link>
    },
    { Header: 'Name', accessor: 'name', width: 200 },
    { Header: 'Action', accessor: 'action', width: 200
    , Cell: (cell: any) => {
      let listId = cell.row.original.id
        return (
          <>
            <Button href={`/problemLists/${listId}`} variant="contained">View</Button>
            {' '}
            <DeleteProblemListButton id={cell.row.original._links.self.href}/>
          </>
        )
    }},
  ];

  return (
    <div>
      <PaginatedTableFetchPage
        columns={columns}
        dataPath={["problemLists"]}
        />
      <UpdateDataButton/>
      <CreateProblemListDialog/>
    </div>
  );
}
