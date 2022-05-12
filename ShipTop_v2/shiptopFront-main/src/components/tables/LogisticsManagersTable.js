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
import CircularProgress from "@material-ui/core/CircularProgress";
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
import config from "./../../config/index";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import TextField from "@material-ui/core/TextField";
import CustomTableCell from "./../ops/CustomTableCell";
import EditIcon from "@material-ui/icons/EditOutlined";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";
import Alert from "./../ops/Alert";
import Search from "./../UI/Search";
import queryString from "query-string";
import { io } from "socket.io-client";
import moment from "moment";

function createData(firstName, lastName, email, phoneNumber, password) {
  return {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
  };
}

// ************************************
// ** All Utility functions STARTS
// ************************************

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
  const fileName = `routifics_${date.getDate()}_${date.getMonth()}_${date.getFullYear()}_${date.getTime()}`;
  const ws = XLSX.utils.json_to_sheet(jsonData);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: `${ext}`, type: "array" });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, fileName + fileExtension);
}

// ************************************
// ** All Utility functions ENDS
// ************************************

const headCells = [
  {
    id: "firstName",
    numeric: false,
    disablePadding: true,
    label: "First Name",
  },
  {
    id: "lastName",
    numeric: false,
    disablePadding: false,
    label: "Last Name",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "phoneNumber",
    numeric: false,
    disablePadding: false,
    label: "Phone Number",
  },
  {
    id: "city",
    numeric: true,
    disablePadding: false,
    label: "City",
  },
  
];

// *************************************
// **    Table Header Component
// *************************************

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all shipments" }}
          />
        </TableCell>
        {/*** Column Header for Action buttons STARTS ***/}
        <TableCell className={classes.tableCell} key="action">
          Action
        </TableCell>
        {/*** Column Header for Action buttons ENDS ***/}

        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
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
        "%20%D9%85%D8%B9%D8%A7%D9%83%20%D9%85%D9%86%D8%AF%D9%88%D8%A8%20%D8%B4%D8%B1%D9%83%D8%A9%20%D9%85%D8%AD%D9%85%D9%88%D9%84%D8%8C%20%D8%A7%D8%B1%D8%AC%D9%88%20%D8%A5%D8%B1%D8%B3%D8%A7%D9%84%20%D8%A7%D9%84%D9%84%D9%88%D9%83%D9%8A%D8%B4%D9%86%20%D9%84%D9%8A%D8%AA%D9%85%20%D8%AA%D9%88%D8%B5%D9%8A%D9%84%20%D8%B4%D8%AD%D9%86%D8%AA%D9%83%20%D8%A8%D8%B1%D9%82%D9%85%20" +
        item.reference_number,
      whatsapp_no_answer:
        "http://wa.me/" +
        item.destination_phone +
        "?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%20" +
        item.destination_name.split(" ").slice(0, 2).join("%20") +
        "%20%D9%85%D8%B9%D8%A7%D9%83%20%D9%85%D9%86%D8%AF%D9%88%D8%A8%20%D8%B4%D8%B1%D9%83%D8%A9%20%D9%85%D8%AD%D9%85%D9%88%D9%84%D8%8C%20%D8%A7%D9%86%D8%A7%20%D9%82%D8%B1%D9%8A%D8%A8%20%D9%85%D9%86%20%D8%A7%D9%84%D9%85%D9%88%D9%82%D8%B9%20%D9%88%D8%AA%D9%85%D8%AA%20%D9%85%D8%AD%D8%A7%D9%88%D9%84%D8%A9%20%D8%A7%D9%84%D8%A7%D8%AA%D8%B5%D8%A7%D9%84%D8%8C%20%D9%86%D8%B1%D8%AC%D9%88%20%D8%A7%D9%84%D8%B1%D8%AF%20%D8%B3%D8%B1%D9%8A%D8%B9%D8%A7%20%D9%84%D9%8A%D8%AA%D9%85%20%D8%AA%D9%88%D8%B5%D9%8A%D9%84%20%D8%B4%D8%AD%D9%86%D8%AA%D9%83%20" +
        item.reference_number +
        "%20%D9%81%D9%8A%20%D8%AD%D8%A7%D9%84%20%D9%84%D9%85%20%D9%8A%D8%AA%D9%85%20%D8%A7%D9%84%D8%B1%D8%AF%20%D8%B3%D8%B1%D9%8A%D8%B9%D8%A7%D8%8C%20%D8%B3%D8%AA%D8%AA%D9%85%20%D8%A5%D8%B9%D8%A7%D8%AF%D8%A9%20%D8%A7%D9%84%D8%AC%D8%AF%D9%88%D9%84%D8%A9%20%D9%84%D9%8A%D9%88%D9%85%20%D8%A7%D9%84%D8%B9%D9%85%D9%84%20%D8%A7%D9%84%D9%82%D8%A7%D8%AF%D9%85%D8%8C%20%D9%88%D8%B4%D9%83%D8%B1%D8%A7%D8%8C%0A",
    }));
  }

  return finalizeData;
};

// ***********************************************
// **    Table Toolbar Component
// ***********************************************

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected, selectedRows, data } = props;

  async function getSelectedData(fileType) {
    const { data } = await axios.post(`${config.API_ROOT}/rfdexport`, {
      reference_number: [...selectedRows],
    });
    let finalData = finalizeToExportRFD(data);
    exportDocument(fileType, finalData);
  }

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
          Shipments
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="">
          <>
            <Grid container>
              <Button
                onClick={async () => await getSelectedData("csv")}
                className={classes.marginL1}
                variant="contained"
              >
                Export CSV
              </Button>
            </Grid>
          </>
        </Tooltip> //
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
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

export default function EnhancedTable() {
  const [dataTable, setDataTable] = useState([]);

  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("reference_number");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(200);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = dataTable.map((n) => n.reference_number);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, reference_number) => {
    const selectedIndex = selected.indexOf(reference_number);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, reference_number);
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

  const isSelected = (reference_number) =>
    selected.indexOf(reference_number) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, dataTable.length - page * rowsPerPage);

  // ** FetchData Method --> Fetch data from the API based on given params
  // ** (params) => searchQ, filterV
  const fetchData = async (searchQ, filterV) => {
    const token = sessionStorage.getItem("token");

    // ** Create queryString if the params has defined
    const queryParams = queryString.stringify(
      {
        searchQuery: searchQ,
        hub_code: filterV === "ALL" ? "" : filterV,
      },
      { skipEmptyString: true, skipNull: true }
    );

    const { data } = await axios.get(
      `${config.API_ROOT}/rfd${queryParams ? `?${queryParams}` : ""}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    let finalizeData = [];

    // ** Finalize the data
    if (Array.isArray(data)) {
      finalizeData = data.map((item, index) => ({
        ...item,
        id: `sh_${item.reference_number}`,
        isEditMode: false,
        coord:
          item.locations && item.locations.length > 0
            ? item.locations[0].coord
            : null,
      }));
    }
    setDataTable([...finalizeData]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const rows = [createData(dataTable[0])];

  // *************************************
  // ** Snackbar Configs
  // ** Use Snackbar to show Alerts
  // *************************************

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

  // ****************************************************************
  // **          Editable Rows Functions START
  // ****************************************************************

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

    if (action === "Save" && !currentObj["coord"]) {
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
      if (action === "Save") {
        sendUpdateRequest({ ...currentObj });
        setPrevious([]);
      }
    }
  };

  // onRevert - It reverts all the changes when user clicks on cancel
  //(*) params - (id)

  const onRevert = (id) => {
    const finalizeRows = dataTable.map((row) => {
      if (row.id === id) {
        return previous[id]
          ? { ...previous[id], isEditMode: false }
          : { ...row, isEditMode: false };
      }
      return row;
    });
    setDataTable([...finalizeRows]);
    setPrevious((state) => {
      delete state[id];
      return state;
    });
  };

  // onCustomCellChange - It updates the value of the editable column --> $dataTable
  //(*) params - (   e   -> React Synthetic Event,  row   -> current value of row    )
  const onCustomCellChange = (e, row) => {
    if (!previous[row.id]) {
      setPrevious((state) => ({ ...state, [row.id]: row }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    const newRows = dataTable.map((row) => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setDataTable([...newRows]);
  };

  // ****************************************************************
  // **          Editable Rows Functions END
  // ****************************************************************

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

    // // ** Fetch New Data on collection updated
    // socketIo.on("rfd:get", function (rfdData) {
    //   if (rfdData) {
    //     fetchData();
    //   }
    // });
  }, []);

  return (
    <div className={classes.root}>
      {/** SEARCH Component  --- STARTS **/}
      {/** 
          {props} => handleFilters : Search component will emit two values (searchQuery, filterValue) 
                                     based on that we're fetching data from the API.
      **/}
      <Search
        handleFilters={(searchQuery, filterValue) =>
          fetchData(searchQuery, filterValue)
        }
      />
      {/** SEARCH Component  --- ENDS **/}

      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          data={dataTable}
          selectedRows={[...selected]}
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
            />
            <TableBody>
              {stableSort(dataTable, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.reference_number);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.reference_number}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          onChange={(event) =>
                            handleClick(event, row.reference_number)
                          }
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      {/*** Column for Action buttons STARTS ***/}
                      <TableCell key="action">
                        {row.isEditMode ? (
                          <>
                            <IconButton
                              aria-label="done"
                              onClick={() => onToggleEditMode(row.id, "Save")}
                            >
                              <DoneIcon />
                            </IconButton>
                            <IconButton
                              aria-label="revert"
                              onClick={() => onRevert(row.id)}
                            >
                              <RevertIcon />
                            </IconButton>
                          </>
                        ) : (
                          <IconButton
                            aria-label="delete"
                            onClick={() => onToggleEditMode(row.id, "Edit")}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                      </TableCell>
                      {/*** Column for Action buttons ENDS ***/}
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.reference_number || "-"}
                      </TableCell>
                      <CustomTableCell
                        row={{ ...row }}
                        name="coord"
                        onInputChange={(e, r) => onCustomCellChange(e, r)}
                      />
                      <TableCell align="right">{row.status || "-"}</TableCell>{" "}
                      <TableCell align="right">
                        {row.updatedAt
                          ? moment(row.updatedAt).format("yyyy-MM-DD")
                          : "-"}
                      </TableCell>
                      <TableCell align="right">
                        {row.service_type || "-"}
                      </TableCell>
                      <TableCell align="right">
                        {row.destination_phone || "-"}
                      </TableCell>
                      <TableCell align="right">
                        {row.destination_name || "-"}
                      </TableCell>
                      <TableCell align="right">
                        {row.destination_city || "-"}
                      </TableCell>
                      <TableCell align="right">{row.hub_code || "-"}</TableCell>
                      <TableCell align="right">
                        {row.origin_name || "-"}
                      </TableCell>
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

      {/***   Snackbar component use to render alerts STARTS  ***/}
      <Snackbar
        open={snackConfig.open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error">
          {snackConfig.message}
        </Alert>
      </Snackbar>
      {/***   Snackbar component use to render alerts ENDS  ***/}

      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </div>
  );
}
