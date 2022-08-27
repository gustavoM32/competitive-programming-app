import { Link } from '@mui/material'
import { UpdateProblemListDialog, DeleteProblemListButtonOne } from 'components/problemListCRUD'
import { API_URL } from 'constants/constants'
import { useRead, useReadList } from 'hooks/crudHooks'
import { useRouter } from 'next/router'
import { UpdateDataButton } from 'components/general'
import { DataGrid } from '@mui/x-data-grid'

type RowParams = {
  id: any,
  row: any
}

export default function ProblemList() {
  const { query } = useRouter()
  const resourceURI = query?.id != undefined ? `${API_URL}/problemLists/${query.id}` : ""
  const problemsKey = query?.id != undefined ? ["problemLists", `${query.id}`, "problems"] : []
  const problemListData = useRead(resourceURI)
  const problemsData = useReadList(problemsKey)

  if (problemListData.isLoading) return <p>Loading...</p>
  if (problemListData.error || !problemListData.data) {
    console.error(problemListData.error)
    return <p>Error: check console</p>
  }

  if (problemsData.isLoading) return <p>Loading...</p>
  if (problemsData.error || !problemsData.data) {
    console.error(problemsData.error)
    return <p>Error: check console</p>
  }

  const { resource: problemList, uri } = problemListData.data
  const { resources: problems } = problemsData.data

  // DRY: problems.tsx uses the same columns variable
  // TODO: Delete problem forever/Delete problem from list
  const columns = [
    { field: 'dateAdded', headerName: 'Date added', type: 'dateTime', width: 250},
    { field: 'link', headerName: 'Link', width: 50, renderCell: (params: RowParams) => (
      <Link href={params.row.link} target="_blank" rel="noopener">Link</Link>
    )},
    { field: 'name', headerName: 'Name', width: 200},
    // { field: 'rating', headerName: 'Rating'},
    // { field: 'topics', headerName: 'Topics'},
    { field: 'problemStatus', headerName: 'Status', width: 150},
    { field: 'editorialStatus', headerName: 'Editorial', width: 200},
    { field: 'comments', headerName: 'Comments', width: 400},
    // { field: 'studies', headerName: 'Studies'},
    { field: 'action', headerName: 'Action', width: 200, renderCell: (params: RowParams) => (
      <>
      </>
    )},
  ];

  return (
    <>
      <h1>Problem list</h1>
      <h2>{problemList.name}</h2>
      <UpdateDataButton/>
      <Link href={problemList.link} target="_blank" rel="noopener">Link</Link>
      <p>{problemList.description}</p>
      <p>{problemList.notes}</p>
      <h3>Problems</h3>
      <>
        <UpdateProblemListDialog problemList={problemList}/>{' '}
        <DeleteProblemListButtonOne id={uri}/>
      </>
      <DataGrid
        autoHeight
        rows={problems}
        columns={columns}
        getRowId={(row) => row._links.self.href}
      />
    </>
  )
}
