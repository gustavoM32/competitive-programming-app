import { Link } from '@mui/material'
import { UpdateProblemListDialog, DeleteProblemListButtonOne } from 'components/problemListCRUD'
import { API_URL } from 'constants/constants'
import { useRead } from 'hooks/crudHooks'
import { useRouter } from 'next/router'
import { UpdateDataButton } from 'components/general'

export default function ProblemList() {
  const { query } = useRouter()
  const resourceURI = query?.id != undefined ? `${API_URL}/problemLists/${query.id}` : ""
  const problemListData = useRead(resourceURI)

  if (problemListData.isLoading) return <p>Loading...</p>
  if (problemListData.error || !problemListData.data) {
    console.error(problemListData.error)
    return <p>Error: check console</p>
  }

  const { resource: problemList, uri } = problemListData.data

  return (
    <>
      <h1>Problem list</h1>
      <h2>{problemList.name}</h2>
      <UpdateDataButton/>
      <Link href={problemList.link} target="_blank" rel="noopener">Link</Link>
      <p>{problemList.description}</p>
      <p>{problemList.notes}</p>
      <>
        <UpdateProblemListDialog problemList={problemList}/>{' '}
        <DeleteProblemListButtonOne id={uri}/>
      </>
    </>
  )
}
