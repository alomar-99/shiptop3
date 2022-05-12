import React, { useCallback, useEffect } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import { debounce } from "lodash";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputBase from "@material-ui/core/InputBase";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Filter } from "@material-ui/icons";

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

export default function Search({ Filter , handleFilters, routes }) {
  if(routes === null) {
    routes = [{name: "in Filter", link:"/",activeIndex:0}]
  }
  const classes = useStyles();
  const [filter, setFilter] = React.useState(Filter.filters[0]);

  useEffect(() => {
    debouncedQuery(filter)
  }, [])
  // ** Use Debounce to handle search query 
  const debouncedQuery = useCallback(debounce((filter) => handleFilters(filter), 599), [])


  const handleChange = (event) => {
    setFilter(event.target.value);
    // ** Emit filter query to Parent Component
    debouncedQuery(event.target.value)
  };


  return (
    <div>

      

      <FormControl className={classes.margin}>
        <InputLabel id="demo-customized-select-label">{Filter.name}</InputLabel>
        <Select
          labelId="demo-customized-select-label"
          id="demo-customized-select"
          placeholder="Select Hub code"
          value={filter}
          onChange={handleChange}
          input={<BootstrapInput />}
        >
        {Filter.filters.map((filter, idx) => {
          return (
            <MenuItem value={filter} key={idx}>{filter} </MenuItem>
          )
        })}
          
        </Select>
      </FormControl>
    </div>
  );
}