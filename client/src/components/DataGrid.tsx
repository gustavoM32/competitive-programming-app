import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-material.css'; // Optional theme CSS
import { Grid } from '@mui/material';

const DataGrid = (props: any) => {
  const {
    rowData,
    columnDefs,
    defaultColDef = {sortable: true},
    cellClickedListener = () => {},
    getRowClass = () => ""
  } = props;

  const rowHeight = 55;

  console.log(defaultColDef)

  return (
    <Grid className="ag-theme-material p-2 w-100" style={{height: 500}}>
      <AgGridReact
        rowData={rowData} // Row Data for Rows
        rowHeight={rowHeight}
        
        columnDefs={columnDefs} // Column Defs for Columns

        defaultColDef={defaultColDef} // Default Column Properties
        getRowClass={getRowClass}
        animateRows={true} // Optional - set to 'true' to have rows animate when sorted
        // rowSelection='multiple' // Options - allows click selection of rows
        
        onCellClicked={cellClickedListener} // Optional - registering for Grid Event
        />
    </Grid>
  );
};

export default DataGrid;