import React, { useCallback, useEffect } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import { debounce } from "lodash";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputBase from "@material-ui/core/InputBase";
import { makeStyles, withStyles } from "@material-ui/core/styles";

const BootstrapInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

export default function Search({ handleFilters }) {
  const classes = useStyles();
  const [filter, setFilter] = React.useState('DMM');
  const [search, setSearch] = React.useState(null)

  useEffect(() => {
    debouncedQuery(search, filter)
  }, [])
  // ** Use Debounce to handle search query 
  const debouncedQuery = useCallback(debounce((search, filter) => handleFilters(search, filter), 599), [])


  const handleChange = (event) => {
    setFilter(event.target.value);
    // ** Emit filter query to Parent Component
    debouncedQuery(search, event.target.value)
  };


  return (
    <div>

      <FormControl className={classes.margin}>
        <InputLabel htmlFor="textbox">Shipment Search</InputLabel>
        <BootstrapInput
          value={search}
          placeholder="Search here..."
          onChange={(e) => {
            setSearch(e.target.value)
            // ** Emit filter query to Parent Component
            debouncedQuery(e.target.value, filter)
          }}
          id="textbox" />
      </FormControl>

      <FormControl className={classes.margin}>
        <InputLabel id="demo-customized-select-label">Filter</InputLabel>
        <Select
          labelId="demo-customized-select-label"
          id="demo-customized-select"
          placeholder="Select Hub code"
          value={filter}
          onChange={handleChange}
          input={<BootstrapInput />}
        >
          <MenuItem value="ALL">
            <em>All</em>
          </MenuItem>
          <MenuItem value={"DMM"}>DMM </MenuItem>
          <MenuItem value={"RUH"}>RUH</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}