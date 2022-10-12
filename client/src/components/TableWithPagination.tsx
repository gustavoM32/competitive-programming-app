// @ts-nocheck
import { Button, Container, MenuItem, Select, Stack, Table, TableBody, TableCell, TableHead, TableRow, Grid, TextField } from '@mui/material'
import { useReadPage } from 'hooks/crudHooks'
import { useEffect, useState } from 'react'
import { usePagination, useTable } from 'react-table'
import { UpdateDataButton } from './general'
import Spinner from 'react-bootstrap/Spinner'

type TableParams = {
  columns: any,
  dataPath: string[],
}

// Let's add a fetchData method to our Table component that will be used to fetch
// new data when pagination state changes
// We can also add a loading state to let our table know it's loading new data
export default function TableWithPagination({
  columns,
  dataPath
}: TableParams) {
  const [tPageNumber, setTPageNumber] = useState(0)
  const [tPageSize, setTPageSize] = useState(8)
  const data = useReadPage(dataPath, tPageNumber, tPageSize)
  const controlledPageCount = data.page.totalPages ?? 0

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // Get the state from the instance
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: data.resources,
      initialState: { pageIndex: 0, pageSize: 8 }, // Pass our hoisted table state
      manualPagination: true,
      pageCount: controlledPageCount,
      defaultColumn: {width: "auto"}
    },
    usePagination
  )

  // Listen for changes in pagination and use the state to fetch our new data
  useEffect(() => {
    setTPageNumber(pageIndex);
    setTPageSize(pageSize);
  }, [pageIndex, pageSize])

  // Render the UI for your table
  return (
    <Stack spacing={2}>
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableCell {...column.getHeaderProps()} style={{width: (column.width)}}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {page.map((row: any, i: any) => {
            prepareRow(row)
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell: any) => {
                  return <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                })}
              </TableRow>
            )
          })}
          <TableRow>
            <TableCell colSpan={10000}>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  Page{' '}
                  <strong>
                    {pageIndex + 1} of {pageOptions.length}
                  </strong>{' '}
                </Grid>
                {data.isPreviousData ? (
                  // Use our custom loading state to show a loading indicator
                  <Grid item><Spinner animation="border" size="sm"/></Grid>
                  ) : null}
              </Grid>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      <Container className="pagination">
        <Button variant="outlined" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </Button>{' '}
        <Button variant="outlined" onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </Button>{' '}
        <Button variant="outlined" onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </Button>{' '}
        <Button variant="outlined" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </Button>{' '}
        <span>
          <TextField
            label="Page"
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <Select
          label="Rows"
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[5, 8, 10].map(pageSize => (
            <MenuItem key={pageSize} value={pageSize}>
              {pageSize}
            </MenuItem>
          ))}
        </Select>
      </Container>
    </Stack>
  )
}

export function Aqui() {
  const columns = [
    {
      Header: 'Field 1',
      accessor: 'field1',
    },
    {
      Header: 'Field 2',
      accessor: 'field2',
      Cell: (cell) => <span>A {cell.value}</span>,
    },
    {
      Header: 'Field 3',
      accessor: 'field3',
    },
  ];

  return (
    <>
      <TableWithPagination
        columns={columns}
        dataPath={["allots"]}
        />
      <UpdateDataButton/>
    </>
  )
}
