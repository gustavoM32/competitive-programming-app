// @ts-nocheck
import { useReadList, useReadPage } from 'hooks/crudHooks'
import { useEffect, useState } from 'react'
import { usePagination, useTable } from 'react-table'
import { PaginatedTable } from './PaginatedTable'

type TableParams = {
  columns: any,
  dataPath: string[],
}

export function PaginatedTableFetchPage({
  columns,
  dataPath
}: TableParams) {
  const [tPageNumber, setTPageNumber] = useState(0)
  const [tPageSize, setTPageSize] = useState(8)
  const data = useReadPage(dataPath, tPageNumber, tPageSize)
  const controlledPageCount = data.page.totalPages ?? 0

  const table = useTable(
    {
      columns,
      data: data.resources,
      initialState: { pageIndex: 0, pageSize: 8 },
      manualPagination: true,
      pageCount: controlledPageCount,
      defaultColumn: {width: "auto"}
    },
    usePagination
  )
  
  const { pageIndex, pageSize } = table.state;

  useEffect(() => {
    setTPageNumber(pageIndex);
    setTPageSize(pageSize);
  }, [pageIndex, pageSize])

  if (data.isError) {
    console.error(data.error)
  }

  return (
    <PaginatedTable
      table={table}
      data={data}/>
  )
}

export function PaginatedTableFetchAll({ columns, dataPath }) {
  const data = useReadList(dataPath);

  const table = useTable(
    {
      columns,
      data: data.resources,
      initialState: { pageIndex: 0, pageSize: 8 },
      defaultColumn: { width: "auto" },
      autoResetSortBy: false,
      autoResetPage: false
    },
    usePagination
  );

  if (data.isError) {
    console.error(data.error)
  }

  return (
    <PaginatedTable
      table={table}
      data={data}/>
  )
}
