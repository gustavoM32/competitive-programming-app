import { UpdateDataButton, UpdateCfDataButton } from "components/general";
import TableWithPagination from "components/TableWithPagination";

export default function CfProblems() {
  const columns = [
    {
      Header: 'Code',
      accessor: 'code',
      width: 80
    },
    {
      Header: 'Name',
      accessor: 'name',
    },
  ];

  return (
    <>
      <TableWithPagination
        columns={columns}
        dataPath={["cfProblems"]}
        />
      <UpdateDataButton/>
      <UpdateCfDataButton infoPath='problemsetProblems'/>
    </>
  );
}
