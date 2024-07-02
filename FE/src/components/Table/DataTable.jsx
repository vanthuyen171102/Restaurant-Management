import { AgGridReact } from "ag-grid-react";

function Datatable({ cols, rows }) {
  return (
    <div
      className="ag-theme-quartz-dark" // applying the grid theme
    >
      <AgGridReact
        rowData={rows}
        columnDefs={cols}
        autoSizeStrategy={{ type: "fitGridWidth" }}
        domLayout="autoHeight"
        detailRowAutoHeight={true}
        wrapText={true}
      />
    </div>
  );
}

export default Datatable;
