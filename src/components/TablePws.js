import { useContext, useEffect} from "react";
import { useTable, usePagination, useFilters, useGlobalFilter, useSortBy } from "react-table";
import { GlobalFilter, DefaultFilterForColumn } from "./Filter";
import "../css/tablePws.css";
import PwsContext from "./PWS-Context";

function TablePws({ columns, data, dataWasFiltered }) {
    const { managementId, setManagementId } = useContext(PwsContext);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        page,
        nextPage,
        previousPage,
        canPreviousPage,
        canNextPage,
        pageOptions,
        state,
        gotoPage,
        pageCount,
        setPageSize,
        visibleColumns,
        prepareRow,
        setGlobalFilter,
        preGlobalFilteredRows,
        // setFilter is the key!!!
        setFilter,
    } = useTable({ columns, data, initialState: { pageIndex: 0, pageSize: 25 }, defaultColumn: { Filter: DefaultFilterForColumn }, }, useFilters, useGlobalFilter, useSortBy, usePagination);

    const { pageIndex, pageSize } = state;

    const searchs = columns.map((col) => {
        return col.Header + "";
    });
    
    useEffect(() => { dataWasFiltered(rows);}, [rows, dataWasFiltered]);

    const handleRowClick = (event, values) => {
        console.log('event : ', values);
        setManagementId(values.idasset);

      };
    console.log('Pws Table 랜더링');
    return (
        <>
            <div style={{border: '1px solid',width:'100%', height: '82vh', overflow: 'auto'}}>
            <table className="pws-table" {...getTableProps()}>
                <thead>
                    {/* <tr>            
                        <th
                            colSpan={visibleColumns.length}
                            style={{
                                textAlign: "center",
                            }}
                        >
                            Rendering Global Filter 
                            <GlobalFilter
                                preGlobalFilteredRows={preGlobalFilteredRows}
                                globalFilter={state.globalFilter}
                                setGlobalFilter={setGlobalFilter}
                            />
                        </th>
                    </tr> */}
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render("Header")}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? '⬇'
                                                : '⬆'
                                            : '⇳'}
                                    </span>
                                    {/* Rendering Default Column Filter */}
                                    {/* <div>
                                        {column.canFilter ? column.render("Filter")
                                            : null}
                                    </div> */}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row) => {
                        prepareRow(row);
                        return (
                            <tr onClick={(event) => handleRowClick(event, row.values)} {...row.getRowProps()} >
                                {row.cells.map((cell) => (
                                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
                <button className="btnPageSE" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {"<<"}
                </button>
                <button className="btnPage" onClick={() => previousPage()} disabled={!canPreviousPage}>
                    Previous
                </button>
                <button className="btnPage" onClick={() => nextPage()} disabled={!canNextPage}>
                    Next
                </button>
                <button className="btnPageSE" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {">>"}
                </button>
                <div style={{fontSize: '0.8rem', margin: '0 1rem'}}>
                <span>
                    Page{" "}
                    <strong>{pageIndex + 1}</strong> of <strong>{pageOptions.length}</strong>
                  
                </span>
                <span style={{ marginLeft: '5px' }}>
                    | Go to page:{" "}
                    <input
                        type="number"
                        min='1'
                        max={pageCount}
                        defaultValue={pageIndex + 1}
                        onChange={(e) => {
                            const pageNumber = e.target.value
                                ? Number(e.target.value) - 1
                                : 0;
                            gotoPage(pageNumber);
                        }}
                        style={{ width: "50px", height: '1.5rem', marginRight: '5px',borderLeftWidth: '0', borderTopWidth: '0', borderRightWidth: '0', borderBottomWidth: '2px', outline: 'none', fontWeight: '600' }}
                    />
                </span>{" "}
                <select className="selectItem"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                >
                    {[10, 25, 50, 100, 150].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            페이지당 {pageSize}
                        </option>
                    ))}
                </select>
                <span style={{marginLeft: '1rem'}}><strong>{rows.length}</strong> rows</span>
                </div>
            </div>
        </>
    );
}

export default TablePws;