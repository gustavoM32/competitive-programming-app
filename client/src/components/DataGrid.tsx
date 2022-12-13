import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-material.css"; // Optional theme CSS
import { Grid } from "@mui/material";

const DataGrid = (props: any) => {
  const {
    rowData,
    columnDefs,
    defaultColDef = { sortable: true, suppressMovable: true },
    cellClickedListener = () => {},
    getRowClass = () => "",
    rowClassRules = {},
  } = props;

  const rowHeight = 55;

  return (
    <Grid className="ag-theme-material p-2 w-100" style={{ height: 500 }}>
      <AgGridReact
        rowData={rowData} // Row Data for Rows
        rowHeight={rowHeight}
        columnDefs={columnDefs} // Column Defs for Columns
        defaultColDef={defaultColDef} // Default Column Properties
        getRowClass={getRowClass}
        rowClassRules={rowClassRules}
        animateRows={true} // Optional - set to 'true' to have rows animate when sorted
        // rowSelection='multiple' // Options - allows click selection of rows

        suppressRowHoverHighlight={true}
        onCellClicked={cellClickedListener} // Optional - registering for Grid Event
        enableCellTextSelection={true}
        ensureDomOrder={true}
      />
    </Grid>
  );
};

export default DataGrid;
