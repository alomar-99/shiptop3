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
import Axios from "../../api/tables";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
// Icons
import EditIcon from "@material-ui/icons/EditOutlined";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";
import CustomTableCell from './../ops/CustomTableCell';
import Alert from './../ops/Alert';
import config from "../../config";
import CustomDateTableCell from './../ops/CustomDateTableCell/index';
import moment from "moment";


function createData(
  awb,
  date,
  from,
  to,
  destinationPhone,
  destinationName,
  destinationCity,
  inHub,
) {
  return {
    awb,
    date,
    from,
    to,
    destinationPhone,
    destinationName,
    destinationCity,
    inHub,
  };
}

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

const headCells = [
  { id: "awb", numeric: false, disablePadding: true, label: "AWB" },
  { id: "date", numeric: false, disablePadding: false, label: "Date" },
  { id: "from", numeric: false, disablePadding: false, label: "From" },
  { id: "to", numeric: false, disablePadding: false, label: "To" },
  {
    id: "destinationPhone",
    numeric: true,
    disablePadding: false,
    label: "Customer Phone",
  },
  {
    id: "destinationName",
    numeric: true,
    disablePadding: false,
    label: "Customer Name",
  },
  {
    id: "destinationCity",
    numeric: true,
    disablePadding: false,
    label: "Destination City",
  }
];

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
            inputProps={{ "aria-label": "select all desserts" }}
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
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

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
          <Grid container spacing={3}>
            <Button variant="contained" color="secondary">
              Request Location
            </Button>
            <Button variant="contained">Export</Button>
          </Grid>
        </Tooltip>
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
  tableCell: {
    width: 130,
    height: 40
  },
  input: {
    width: 130,
    height: 40
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



//  ** Table component 
export default function EnhancedTable() {
  const [dataTable, setDataTable] = useState([]);

  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("aging");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = dataTable.map((n) => n.awb);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, awb) => {
    const selectedIndex = selected.indexOf(awb);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, awb);
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

  const isSelected = (awb) => selected.indexOf(awb) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, dataTable.length - page * rowsPerPage);

  // ** fetch AwaitingReschedules from the server populate some additional Keys
  const fetchData = async () => {
    const token = (sessionStorage.getItem('token'));
    const { data } = await Axios.get(`${config.API_ROOT}/waitingr`, { headers: { "Authorization": `Bearer ${token}` } });
    let finalizeData = []

    // @ Finalize the data
    if (Array.isArray(data)) {
      finalizeData = data.map((item, index) => ({
        ...item,
        id: `sh_${item.reference_number}`,
        isEditMode: false,
        date: (item.routifics && item.routifics.length > 0) ? item.routifics[0].date : null,
        from: (item.routifics && item.routifics.length > 0) ? item.routifics[0].from : null,
        to: (item.routifics && item.routifics.length > 0) ? item.routifics[0].to : null
      }))
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
    message: ''
  })

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackConfig({ open: false, message: '' });
  };



  // ****************************************************************
  // **          Editable Rows Functions START
  // ****************************************************************

  const [previous, setPrevious] = React.useState({});


  // sendUpdateRequest - Send request to update From, To
  //(*) params - ({ from, to, reference_number })
  const sendUpdateRequest = async (payload) => {
    const { data } = await Axios.post(`${config.API_ROOT}/newroutific`, { ...payload });
    if (data.statusCode !== 200) {
      setSnackConfig({
        open: true,
        message: data.message
      })
    }

  }


  // switchMode - It will switch isEditMode of the given $id
  // (*) params - (id -> id of the row) 
  const switchMode = (id) => {
    setDataTable((state) => {
      return dataTable.map((row) => {
        if (row.id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
  }

  // onToggleEditMode - Validate from, to and send request to the server
  //                  - Toggle editMode for each row
  //(*) params - (id, action -> 'Save' or 'Edit')

  const onToggleEditMode = (id, action) => {
    const currentObj = dataTable.filter(item => item.id == id)[0]

    // console.log(moment(currentObj.date).format("yyyy-MM-DD h:mm:ss"), "datetabledatetabledatetabledatetabledatetabledatetabledatetable")

    if (action == 'Save') {
      // if ((!currentObj['from'] || !currentObj['date'] || !currentObj['to'])) setSnackConfig({ open: true, message: "Date, From, and To are not allowed to be empty" })
      // if ((currentObj['from'] && currentObj['date'] && currentObj['to'])) {
      switchMode(id)
      setPrevious([])
      sendUpdateRequest({
        from: currentObj.from,
        date: currentObj.date ? moment(currentObj.date).format("yyyy-MM-DD h:mm:ss") : "",
        to: currentObj.to, reference_number: currentObj.reference_number
      })
      // }
    }
    else {
      switchMode(id)
    }
  }

  // onRevert - It reverts all the changes when user clicks on cancel
  //(*) params - (id)
  const onRevert = (id) => {
    const finalizeRows = dataTable.map((row) => {
      if (row.id === id) {
        return previous[id] ? { ...previous[id], isEditMode: false } : { ...row, isEditMode: false };
      }
      return row;
    });
    setDataTable([...finalizeRows]);
    setPrevious((state) => { delete state[id]; return state; });
  };



  // onCustomCellChange - It updates the value of the editable column --> $dataTable
  //(*) params - (   e   -> React Synthetic Event,  row   -> current value of row   )
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



  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} />
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
                  const isItemSelected = isSelected(row.awb);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.awb}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          onChange={(event) => handleClick(event, row.awb)}
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
                              onClick={() => onToggleEditMode(row.id, 'Save')}
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
                      <CustomDateTableCell row={{ ...row }} dateFormat="yyyy-MM-dd" momentFormat="yyyy-MM-DD" name="date" onInputChange={(e, r) => onCustomCellChange(e, r)} />
                      <CustomTableCell row={{ ...row }} name="from" onInputChange={(e, r) => onCustomCellChange(e, r)} />
                      <CustomTableCell row={{ ...row }} name="to" onInputChange={(e, r) => onCustomCellChange(e, r)} />
                      <TableCell align="right">
                        {row.destination_phone || "-"}
                      </TableCell>
                      <TableCell align="right">
                        {row.destination_name || "-"}
                      </TableCell>
                      <TableCell align="right">
                        {row.destination_city || "-"}
                      </TableCell>
                      <TableCell align="right">{row.origin_name}</TableCell>
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
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={dataTable.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>

      {/***   Snackbar component use to render alerts STARTS  ***/}
      <Snackbar open={snackConfig.open} autoHideDuration={3000} onClose={handleClose}>
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
