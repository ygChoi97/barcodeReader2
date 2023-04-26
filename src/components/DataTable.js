import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { useEffect } from 'react';
import { useState } from 'react';

import PwsContext from "./PWS-Context";
import { useContext } from 'react';
import { Button } from '@mui/material';

import { Spinner } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import useConfirm from "./useConfirm";
import "../css/datatable.css";

const BASE_URL = 'http://localhost:8181/api/pws';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// const headCells = [
//   {
//     id: 'name',
//     numeric: false,
//     disablePadding: true,
//     label: 'Dessert (100g serving)',
//   },
//   {
//     id: 'calories',
//     numeric: true,
//     disablePadding: false,
//     label: 'Calories',
//   },
//   {
//     id: 'fat',
//     numeric: true,
//     disablePadding: false,
//     label: 'Fat (g)',
//   },
//   {
//     id: 'carbs',
//     numeric: true,
//     disablePadding: false,
//     label: 'Carbs (g)',
//   },
//   {
//     id: 'protein',
//     numeric: true,
//     disablePadding: false,
//     label: 'Protein (g)',
//   },
// ];



function EnhancedTableHead(props) {
  // const headCells1 = [
  //   {
  //     id: 'name',
  //     numeric: false,
  //     disablePadding: true,
  //     label: 'Dessert (100g serving)',
  //   },
  //   {
  //     id: 'calories',
  //     numeric: true,
  //     disablePadding: false,
  //     label: 'Calories',
  //   },
  //   {
  //     id: 'fat',
  //     numeric: true,
  //     disablePadding: false,
  //     label: 'Fat (g)',
  //   },
  //   {
  //     id: 'carbs',
  //     numeric: true,
  //     disablePadding: false,
  //     label: 'Carbs (g)',
  //   },
  //   {
  //     id: 'protein',
  //     numeric: true,
  //     disablePadding: false,
  //     label: 'Protein (g)',
  //   },
  // ];



  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, pws_item } =
    props;


  const headCells = pws_item.map(itm => {
    let obj = { id: '', numeric: false, disablePadding: false, label: '' };
    obj.id = itm.column_name;
    // if(itm.column_name === 'userid')
    //   obj.numeric = true;
    obj.label = itm.column_comment;
    return obj;
  });

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  console.log("pass through item : ", pws_item);
  console.log("headCells : ", headCells);
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  pws_item: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string))
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          PWS List
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const EnhancedTable = function ({ doScan }) {
  const [order, setOrder] = React.useState('asc');
  //const [orderBy, setOrderBy] = React.useState('calories');
  const [orderBy, setOrderBy] = React.useState('idasset');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);

  const [contents, setContents] = useState([]);
  const { managementId, setManagementId } = useContext(PwsContext);
  const [loading, setLoading] = useState(true);
  const [getConfirmationYN, ConfirmationYN, getConfirmationOK, ConfirmationOK] = useConfirm();
  const [menu, setMenu] = React.useState([]);
  const fileInput = React.useRef(null);
  //   function createData(name, calories, fat, carbs, protein) {
  //   console.log({name,
  //     calories,
  //     fat,
  //     carbs,
  //     protein,});rows
  //   return {
  //     name,
  //     calories,
  //     fat,
  //     carbs,
  //     protein,
  //   };
  // }

  function createData(...param) {
    let obj = {};
    for (let i = 0; i < menu.length; i++) {
      obj[menu[i].column_name] = param[i];
    }
    // console.log(obj);
    return obj;
  }

  // const rows = contents.map(pws => {
  //   let obj = [];
  //   for(let name in pws) {
  //     if(name === 'userid')
  //       parseInt(obj.push(pws[name]));
  //     obj.push(pws[name]);

  //   }

  //   return createData(...obj);
  // });

  const rows = [...contents];

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      // const newSelected = rows.map((n) => n.name);
      const newSelected = rows.map((n) => n.idasset);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, idasset) => {
    const selectedIndex = selected.indexOf(idasset);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, idasset);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleRowClick = (event, idasset) => {
    setManagementId(idasset);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  function dateFormat(date) {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    month = month >= 10 ? month : '0' + month;
    day = day >= 10 ? day : '0' + day;
    hour = hour >= 10 ? hour : '0' + hour;
    minute = minute >= 10 ? minute : '0' + minute;
    second = second >= 10 ? second : '0' + second;

    return date.getFullYear() + '-' + month + '-' + day;
  }

  useEffect(() => {
    fetch(BASE_URL + `/menu`)
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        else {
          return res.json();
        }
      })
      .then(json => {
        let copyMenu = [];
        for (let i = 0; i < json.length; i++) {
          copyMenu.push(json[i]);
        }
        setMenu(copyMenu);
        console.log('useEffect() fetch - /menu', copyMenu);
      });

    fetch(BASE_URL)
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        else {
          return res.json();
        }
      })
      .then(json => {
        let copyContents = [...contents];
        for (let i = 0; i < json.count; i++) {
          //console.log(json.pwsDtos[i]);
          let copyContent = {};
          copyContent = json.pwsDtos[i]
          if (json.pwsDtos[i].introductiondate != null || json.pwsDtos[i].introductiondate != undefined) {
            let day = new Date(json.pwsDtos[i].introductiondate);
            copyContent['introductiondate'] = dateFormat(day);
          }

          copyContents.push(copyContent);
        }
        setContents(copyContents);

        setLoading(false);
        //setContents(json.pwsDtos);
        // console.log(copyContents[0]);
        // console.log(copyContents[json.count-1]);
        console.log('all data : ', copyContents);
      })

  }, []);
  const excelExportHandler = (e) => {
    let obj = {};
    let copyContents = [...contents];
    for (let i = 0; i < menu.length; i++)
      obj[menu[i].column_name] = menu[i].column_comment;

    copyContents.unshift(obj);
    console.log(copyContents);

    const xlsx = require("xlsx");

    const write_opts = {
      type: "buffer",
      cellDates: false,
      bookSST: false,
      bookType: "xlsx",
      sheet: "Sheet1",
      compression: false,
      Props: {
        Author: "Someone",
        Company: "SheetJS LLC"
      }
    };

    const assets = xlsx.utils.json_to_sheet(copyContents, { header: menu.map((it) => { return it.column_name }), skipHeader: true });

    const book = xlsx.utils.book_new();
    assets["!cols"] = [
      { wpx: 70 }    // 자산관리번호
      , { wpx: 50 }    // 사용구분
      , { wpx: 40 }    // 회사
      , { wpx: 100 }   // 본부
      , { wpx: 130 }   // 센터
      , { wpx: 120 }   // 관리부서
      , { wpx: 60 }    // 사용자
      , { wpx: 60 }    // 사용자ID
      , { wpx: 100 }   // 코스트센터CD
      , { wpx: 60 }    // 모델명
      , { wpx: 70 }    // 자산번호
      , { wpx: 80 }    // S/N
      , { wpx: 60 }    // 그래픽카드
      , { wpx: 60 }    // 모니터
      , { wpx: 70 }    // 지역
      , { wpx: 80 }    // 건물명
      , { wpx: 40 }    // 층수
      , { wpx: 100 }   // 상세위치
      , { wpx: 50 }    // 구매용도
      , { wpx: 50 }    // 사용용도
      , { wpx: 70 }    // 도입년월
      , { wpx: 120 }   // 비고
      , { wpx: 120 }   // 상세업무
    ]

    xlsx.utils.book_append_sheet(book, assets, "자산리스트");

    //getDir();
    //fileInput.current.click();
    xlsx.writeFile(book, "pws_list.xlsx");
    getConfirmationOK(`PWS 자산리스트를 엑셀파일로 내보냈습니다.`);
  };
  const handleChange = e => {
    console.log(e.target.files[0]);
  };
  async function getDir() {
    const dirHandle = await window.showFilePicker();

    // run code for dirHandle
  }

  const listPage = (
    <Box sx={{ width: '100%' }} style={{ overflow: 'auto' }}>
      <ConfirmationOK />
      <Paper sx={{ width: '4000px', mb: 2 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <Button variant='contained' sx={{ width: 145, height: 29 }} onClick={excelExportHandler}>excel export</Button>
          <input type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ref={fileInput} onChange={handleChange} style={{ display: "none" }} />
        </div>
        <TableContainer>
          <Table
            sx={{
              minWidth: 750,
              borderBottom: "2px solid black",
              "& th": {
                fontSize: ".75rem",
                fontWeight: 900

              }
            }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              pws_item={menu}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  // const isItemSelected = isSelected(row.name);
                  const isItemSelected = isSelected(row.idasset);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover

                      onClick={(event) => handleRowClick(event, row.idasset)}

                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      // key={row.name}
                      key={row.idasset}
                      selected={isItemSelected}

                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          onClick={(event) => handleClick(event, row.idasset)}
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        // component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        sx={{ fontSize: ".6rem", width: '136px' }}
                      >
                        {/* {row.name} */}
                        {row.idasset}

                      </TableCell>

                      <TableCell align="left" sx={{ fontSize: "0.6rem" }}>{row.uptake}</TableCell>
                      <TableCell align="left" sx={{ fontSize: "0.6rem" }}>{row.company}</TableCell>
                      <TableCell align="left" sx={{ fontSize: "0.6rem" }}>{row.headquarters}</TableCell>
                      <TableCell align="left" sx={{ fontSize: "0.6rem" }}>{row.center}</TableCell>
                      <TableCell align="left" sx={{ fontSize: "0.6rem" }}>{row.department}</TableCell>
                      <TableCell align="left" sx={{ fontSize: "0.6rem" }}>{row.username}</TableCell>
                      <TableCell align="left" sx={{ fontSize: "0.6rem" }}>{row.userid}</TableCell>
                      <TableCell align="left" sx={{ fontSize: "0.6rem" }}>{row.centercd}</TableCell>
                      <TableCell align="left" sx={{ fontSize: "0.6rem" }}>{row.model}</TableCell>
                      <TableCell align="left" sx={{ fontSize: "0.6rem" }}>{row.assetno}</TableCell>
                      <TableCell align="left" sx={{ fontSize: "0.6rem" }}>{row.sn}</TableCell>
                      <TableCell align="left" sx={{ fontSize: "0.6rem" }}>{row.graphic}</TableCell>
                      <TableCell align="left" sx={{ fontSize: "0.6rem" }}>{row.monitor}</TableCell>
                      <TableCell align="left" sx={{ fontSize: "0.6rem" }}>{row.area}</TableCell>
                      <TableCell align="left" sx={{ fontSize: "0.6rem" }}>{row.building}</TableCell>
                      <TableCell align="left" sx={{ fontSize: "0.6rem" }}>{row.storey}</TableCell>
                      <TableCell align="left" sx={{ fontSize: "0.6rem" }}>{row.location}</TableCell>
                      <TableCell align="left" sx={{ fontSize: "0.6rem" }}>{row.objpurchase}</TableCell>
                      <TableCell align="left" sx={{ fontSize: "0.6rem" }}>{row.objuse}</TableCell>
                      <TableCell align="left" sx={{ fontSize: "0.6rem" }}>{row.introductiondate}</TableCell>
                      <TableCell align="left" sx={{ fontSize: "0.6rem" }}>{row.note}</TableCell>
                      <TableCell align="left" sx={{ fontSize: "0.6rem" }}>{row.desctask}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={1} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50, 100, 200]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
    </Box>
  );
  // 로딩중일 때 렌더링할 페이지
  const loadingPage = (
    <div style={{ border: 'solid', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '70vh' }}>
      <Spinner color="primary">
        Loading...
      </Spinner>
    </div>
  );

  const content = loading ? loadingPage : listPage;

  console.log('EnhancedTable() 렌더링');
  return (
    <div className={doScan ? "hide-data" : "show-data"}>
      {content}
    </div>

  );
}

export default React.memo(EnhancedTable);