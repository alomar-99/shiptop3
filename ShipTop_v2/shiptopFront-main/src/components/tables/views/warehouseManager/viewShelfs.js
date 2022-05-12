import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import FilterListIcon from "@material-ui/icons/FilterList";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import XLSX from "xlsx";
import FileSaver from "file-saver";
import config from "../../../../config/index";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "../../../ops/Alert";
import queryString from "query-string";
// ************
// ** All Utility functions STARTS
// ************
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
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
// exportDocument - It Export JSON type data into .xlsx and .csv formats
// (*) params - (ext -> '.xlsx' or '.csv'  , jsonData -> Data )
function exportDocument(ext, jsonData) {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = `.${ext}`;
  const date = new Date();
  const fileName = `routifics_${date.getDate()}${date.getMonth()}${date.getFullYear()}_${date.getTime()}`;
  const ws = XLSX.utils.json_to_sheet(jsonData);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: `${ext}`, type: "array" });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, fileName + fileExtension);
}
// ************
// ** All Utility functions ENDS
// ************
const headCells = [
  {
    id: "shelfNumber",
    numeric: true,
    disablePadding: false,
    label: "Number",
  },
  {
    id: "row",
    numeric: false,
    disablePadding: false,
    label: "Row",
  },
  {
    id: "section",
    numeric: false,
    disablePadding: false,
    label: "Section",
  },
  {
    id: "lane",
    numeric: true,
    disablePadding: false,
    label: "Lane",
  },
  {
    id: "floor",
    numeric: true,
    disablePadding: false,
    label: "Floor",
  },
  {
    id: "width",
    numeric: true,
    disablePadding: false,
    label: "Width",
  },
  {
    id: "height",
    numeric: true,
    disablePadding: false,
    label: "Height",
  },
  {
    id: "assignedShipment",
    numeric: true,
    disablePadding: false,
    label: "AssignedShipment",
  },
  {
    id: "assignedTo",
    numeric: true,
    disablePadding: false,
    label: "assignedTo",
  },
];
// *************
// **    Table Header Component
// *************

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    filter,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        {/* Column Header for Action buttons STARTS */}
        {filter === "Assign" ? (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ "aria-label": "select all desserts" }}
            />
          </TableCell>
        ) : (
          <TableCell align="center" className={classes.tableCell} key="view">
              Details
            </TableCell>
        )}
        {/* Column Header for Action buttons ENDS */}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

// ** Toolbar Styles
const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  marginL1: {
    marginLeft: "1rem",
  },
  title: {
    flex: "1 1 100%",
  },
}));
// finalizeToExportRFD - It finalize the raw data to export
// (*) params (data -> rowData)
const finalizeToExportRFD = (data) => {
  let finalizeData = [];
  if (Array.isArray(data)) {
    finalizeData = data.map((item) => ({
      reference_number: item.reference_number,
      coord:
        item.locations && item.locations.length > 0
          ? item.locations[0].coord
          : null,
      from:
        item.routifics && item.routifics.length > 0
          ? item.routifics[0].from
          : null,
      to:
        item.routifics && item.routifics.length > 0
          ? item.routifics[0].to
          : null,
      aging: "7",
      load: null,
      destination_phone: item.destination_phone,
      email: null,
      service_type: item.service_type,
      priority: "yes",
      destination_name: item.destination_name,
      cod_amount: item.cod_amount,
      customer_reference_number: item.customer_reference_number,
      whatsapp_link: "http://wa.me/" + item.destination_phone,
      whatsapp_location:
        "http://wa.me/" +
        item.destination_phone +
        "?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%20" +
        item.destination_name.split(" ").slice(0, 2).join("%20") +
        "%20%D9%85%D8%B9%D8%A7%D9%83%20%D9%85%D9%86%D8%AF%D9%88%D8%A8%20",
    }));
  }
  return finalizeData;
};

// *****************
// **    Table Toolbar Component
// *****************
const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected, selectedRows, data, setShipments } = props;
  const [isOpen, setIsOpen] = useState(false);
  async function getSelectedData(fileType) {
    const { data } = await axios.post(
      `${config.API_ROOT}/Accountant/exportOrders`,
      {
        reference_number: [...selectedRows],
      }
    );
    let finalData = finalizeToExportRFD(data);
    exportDocument(fileType, finalData);
  }
  const assignShipments = () => {
    console.log(`selected rows: ${selectedRows}`);
    setShipments([...selectedRows]);
  };
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Shelves
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="">
          <>
            <Grid container direction="row" spacing={2}>
              <Grid item>
                <Button
                  color="secondary"
                  onClick={assignShipments}
                  className={classes.marginL1}
                  variant="contained"
                >
                  Assign
                </Button>
              </Grid>
            </Grid>
          </>
        </Tooltip> //
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}{" "}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};
// ** Styles for Table
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  ml1: {
    marginLeft: "1rem",
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

export default function EnhancedTable(props) {
  const [dataTable, setDataTable] = useState([]);
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("shelfID");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(200);
  const [isOpen, setIsOpen] = useState(false);
  const { shipments, setShipments } = props;
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = dataTable.map((n) => n.shelfID);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const handleClick = (event, shelfID) => {
    const selectedIndex = selected.indexOf(shelfID);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, shelfID);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
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
  const isSelected = (shelfID) => selected.indexOf(shelfID) !== -1;
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, dataTable.length - page * rowsPerPage);
  // ** FetchData Method --> Fetch data from the API based on given params
  // ** (params) => searchQ, filterV
  const fetchData = async () => {
    // console.log(`fliterV: ${filterV}`)
    const token = sessionStorage.getItem("token");
    // console.log(filter)
    // ** Create queryString if the params has defined
    const body = queryString.stringify(
      {
        employeeID: sessionStorage.getItem("userId"),
      },
      { skipEmptyString: true, skipNull: true }
    );
    var data = [];
    axios
      .get(
        `${config.API_ROOT}/api/warehouseManager/viewShelfs${
          body ? `?${body}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      .then((res) => {
        console.log(res.data);
        data = res.data;
        let finalizeData = [];
        // console.log("is Array");
        // ** Finalize the data
        if (Array.isArray(data)) {
          finalizeData = data.map((item, index) => ({
            ...item,
            employeeID: item.employeeID,
            isEditMode: false,
          }));
        }
        if (props.filters === "Assign") {
          finalizeData = finalizeData.filter(
            (item) => item.assignedTo === null
          );
        }
        // console.log(finalizeData);
        setDataTable([...finalizeData]);
      });
    // console.log(data);
  };
  useEffect(() => {
    fetchData();
    // console.log(dataTable);
  }, []);

  // *************
  // ** Snackbar Configs
  // ** Use Snackbar to show Alerts
  // *************
  const [snackConfig, setSnackConfig] = React.useState({
    open: false,
    message: "",
  });
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackConfig({ open: false, message: "" });
  };
  // **********************
  // **          Editable Rows Functions START
  // **********************
  const [previous, setPrevious] = React.useState({});

  // sendUpdateRequest - Send request to update -> destination_phone
  //(*) params - ({ ...row } -> table row)
  const sendUpdateRequest = async (payload) => {
    const { data } = await axios.post(`${config.API_ROOT}/newlocation`, {
      reference_number: payload.reference_number,
      coord: payload.coord,
    });
    if (data.statusCode !== 200) {
      setSnackConfig({
        open: true,
        message: data.message,
      });
    }
  };
  // onToggleEditMode - Validate destination_phone and send request to the server
  //                  - Toggle editMode for each row
  //(*) params - (id, action -> 'Save' or 'Edit')
  const onToggleEditMode = (id, action) => {
    const currentObj = dataTable.filter((item) => item.id == id)[0];

    if (action == "Save" && !currentObj["coord"]) {
      setSnackConfig({
        open: true,
        message: "Coord is not allowed to be empty",
      });
    } else {
      setDataTable((state) => {
        return dataTable.map((row) => {
          if (row.id === id) {
            return { ...row, isEditMode: !row.isEditMode };
          }
          return row;
        });
      });
      if (action == "Save") {
        sendUpdateRequest({ ...currentObj });
        setPrevious([]);
      }
    }
  };
  // onRevert - It reverts all the changes when user clicks on cancel
  //(*) params - (id)
  // ** Socket IO Client :
  // *
  // ** It will establish connection to Socket IO Server!

  useEffect(() => {
    // let socketIo = io(config.API_ROOT);
    // socketIo.on("connect", function () {
    //   console.log("socket connected!");
    // });
    // socketIo.on("disconnect", function () {
    //   console.log("socket disconnected!");
    // });
    // ** Fetch New Data on collection updated
  }, []);
  return (
    <div className={classes.root}>
      {/* SEARCH Component  --- STARTS */}
      {/** 
              {props} => handleFilters : Search component will emit two values (searchQuery, filterValue) 
                                         based on that we're fetching data from the API.
          **/}
      {/*
      // will add filter by attribute and search later
       <Search
        handleFilters={(searchQuery, filterValue) => (searchQuery, filterValue)}
      /> */}

      {/* SEARCH Component  --- ENDS */}
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          data={dataTable}
          selectedRows={[...selected]}
          setShipments={setShipments}
          filter={props.filters}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={dataTable.length}
              filter={props.filters}

            />
            <TableBody>
              {stableSort(dataTable, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.shelfID);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.shelfID}
                      selected={isItemSelected}
                    >
                      {/* Column for Action buttons STARTS */}
                      
                      {props.filters === "Assign" ? (
                        <TableCell padding="checkbox">
                          <Checkbox
                            onChange={(event) =>
                              handleClick(event, row.shelfID)
                            }
                            checked={isItemSelected}
                            inputProps={{ "aria-labelledby": labelId }}
                          />
                        </TableCell>
                      ) : (
                        <TableCell align="center" key="view">
                        <Button
                          variant="contained"
                          color="secondary"
                          className={classes.spacing}
                          onClick={() => {}}
                        >
                          View
                        </Button>
                      </TableCell> 
                      )}
                      {/* Column for Action buttons ENDS */}
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        align="center"
                      >
                        {row.shelfNumber || "-"}
                      </TableCell>
                      <TableCell align="center">{row.row || "-"}</TableCell>{" "}
                      <TableCell align="center">{row.section || "-"}</TableCell>{" "}
                      <TableCell align="center">{row.lane || "-"}</TableCell>{" "}
                      <TableCell align="center">{row.floor || "-"}</TableCell>{" "}
                      <TableCell align="center">{row.width || "-"}</TableCell>{" "}
                      <TableCell align="center">{row.height || "-"}</TableCell>{" "}
                      <TableCell align="center">
                        {row.assignedShipment || "-"}
                      </TableCell>{" "}
                      <TableCell align="center">
                        {row.assignedTo || "-"}
                      </TableCell>{" "}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[100, 200, 300]}
          component="div"
          count={dataTable.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      {/*   Snackbar component use to render alerts STARTS  */}
      <Snackbar
        open={snackConfig.open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error">
          {snackConfig.message}
        </Alert>
      </Snackbar>
      {/*   Snackbar component use to render alerts ENDS  */}
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </div>
  );
}
