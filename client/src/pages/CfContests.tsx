import { UpdateDataButton, UpdateCfDataButton } from "components/general";
import { PaginatedTableFetchPage } from "components/TableWithPagination";


export default function CfContests() {
  const columns = [
    {
      Header: 'Id',
      accessor: 'id',
      width: 80
    },
    {
      Header: 'Name',
      accessor: 'name',
    },
  ];

  return (
    <>
      <PaginatedTableFetchPage
        columns={columns}
        dataPath={["cfContests"]}
        />
      <UpdateDataButton/>
      <UpdateCfDataButton infoPath='contests'/>
    </>
  );
}
