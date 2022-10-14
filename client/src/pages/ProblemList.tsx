import { Link } from '@mui/material'
import { UpdateProblemListDialog, DeleteProblemListButtonOne, AddProblemToListDialog, RemoveProblemFromListButton, AddNewProblemToListDialog } from 'components/problemListCRUD'
import { API_URL } from 'constants/constants'
import { useRead } from 'hooks/crudHooks'
import { UpdateDataButton } from 'components/general'
import { DeleteProblemButton } from 'components/problemCRUD'
import { useParams } from 'react-router-dom'
import { PaginatedTableFetchAll } from 'components/TableWithPagination'
import { problemsColumns } from 'utils/ProblemUtils'


export default function ProblemList() {
  const { problemListId } = useParams();
  const resourceURI = problemListId !== undefined ? `${API_URL}/problemLists/${problemListId}` : ""
  const problemsKey = problemListId !== undefined ? ["problemLists", `${problemListId}`, "problems"] : []
  const problemListData = useRead(resourceURI)

  if (problemListData.isLoading) return <p>Loading...</p>
  if (problemListData.isError || !problemListData.data) {
    console.error(problemListData.error)
    return <p>Error: check console</p>
  }

  const { resource: problemList, uri } = problemListData.data

  // FIXME: DeleteProblemButton does not invalidate queries because of optimistic mutation
  const columns = [
    ...problemsColumns,
    { Header: 'Action', accessor: 'action', width: 300
    , Cell: (cell: any) => {
        console.log(cell.row.original);
        return (
          <>
            {/* <UpdateProblemDialog problem={params.row}/>*/}
            <RemoveProblemFromListButton problemList={problemList} problemId={cell.row.original.id}/>
            <DeleteProblemButton id={cell.row.original._links.self.href}/>
          </>
        )
      }
    },
  ];

  return (
    <>
      <h2>{problemList.name}</h2>
      <p><Link href={problemList.link} target="_blank" rel="noopener">Link</Link></p>
      <p>{problemList.description}</p>
      <p>{problemList.notes}</p>
      <h3>Problems</h3>
      <PaginatedTableFetchAll
        columns={columns}
        dataPath={problemsKey}
        />
      <>
        <AddProblemToListDialog problemList={problemList}/>{' '}
        <AddNewProblemToListDialog problemList={problemList}/>{' '}
        <UpdateProblemListDialog problemList={problemList}/>{' '}
        <DeleteProblemListButtonOne id={uri}/>
        <UpdateDataButton/>
      </>
    </>
  )
}
