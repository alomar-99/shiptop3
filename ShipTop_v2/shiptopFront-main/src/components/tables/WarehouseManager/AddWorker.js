import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputBase from "@material-ui/core/InputBase";
import FormControl from "@material-ui/core/FormControl";
import { withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
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

export default function AddShipment({ setShips }) {
  const [isvalid, setIsValid] = useState(true);
  const [shipmentDetails, setShipmentDetails] = useState({
    shipmentName: "",
    category: "",
    isBreakable: "true",
    height: "",
    weight: "",
    width: "",
    length: "",
    description: "",
  });
  const [shipments, setShipments] = useState([shipmentDetails]);
  const handleRemoveItem = (idx) => {
    // assigning the list to temp variable
    const temp = [...shipments];

    // removing the element using splice
    temp.splice(idx, 1);

    // updating the list
    setShipments(temp);
  };
  useEffect(() => {setShips([...shipments])}, [shipments])

  return (
    <>
      <Grid container direction="column">
        {shipments.length > 0 ? (
          shipments.map((shipment, idx) => {
            return (
              <Grid
                container
                direction="row"
                style={{ minWidth: "62vw" }}
                spacing={2}
              >
                <Grid item>
                  <TextField
                    required
                    color="primary"
                    error={!isvalid}
                    id="margin-dense"
                    label="Name"
                    style={{ maxWidth: "8vw" }}
                    onChange={(event) =>
                      setShipments((prev) =>
                        prev.map((pre, id) => {
                          if (idx === id) {
                            return { ...pre, shipmentName: event.target.value };
                          }
                          return pre;
                        })
                      )
                    }
                    defaultValue={shipment.shipmentName}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    required
                    color="primary"
                    error={!isvalid}
                    id="margin-dense"
                    label="category"
                    onChange={(event) =>
                      setShipments((prev) =>
                        prev.map((pre, id) => {
                          if (idx === id) {
                            return { ...pre, category: event.target.value };
                          }
                          return pre;
                        })
                      )
                    }
                    value={shipment.category}
                  />
                </Grid>
                <Grid item>
                  <FormControl>
                    <InputLabel id="demo-customized-select-label">
                      Breakable?
                    </InputLabel>
                    <Select
                      labelId="demo-customized-select-label"
                      id="demo-customized-select"
                      value={shipment.isBreakable}
                      onChange={(event) =>
                      setShipments((prev) =>
                        prev.map((pre, id) => {
                          if (idx === id) {
                            return { ...pre, isBreakable: event.target.value };
                          }
                          return pre;
                        })
                      )
                    }
                      input={<BootstrapInput />}
                    >
                      <MenuItem value={"true"}>true </MenuItem>
                      <MenuItem value={"false"}>false</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item>
                  <TextField
                    style={{ maxWidth: "5vw" }}
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    required
                    color="primary"
                    error={!isvalid}
                    id="margin-dense"
                    label="height"
                    onChange={(event) =>
                      setShipments((prev) =>
                        prev.map((pre, id) => {
                          if (idx === id) {
                            return { ...pre, height: event.target.value };
                          }
                          return pre;
                        })
                      )
                    }
                    value={shipment.height}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    style={{ maxWidth: "5vw" }}
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    required
                    color="primary"
                    error={!isvalid}
                    id="margin-dense"
                    label="width"
                    onChange={(event) =>
                      setShipments((prev) =>
                        prev.map((pre, id) => {
                          if (idx === id) {
                            return { ...pre, width: event.target.value };
                          }
                          return pre;
                        })
                      )
                    }
                    value={shipment.width}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    style={{ maxWidth: "5vw" }}
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    required
                    color="primary"
                    error={!isvalid}
                    id="margin-dense"
                    label="weight"
                    onChange={(event) =>
                      setShipments((prev) =>
                        prev.map((pre, id) => {
                          if (idx === id) {
                            return { ...pre, weight: event.target.value };
                          }
                          return pre;
                        })
                      )
                    }
                    value={shipment.weight}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    style={{ maxWidth: "5vw" }}
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    required
                    color="primary"
                    error={!isvalid}
                    id="margin-dense"
                    label="length"
                    onChange={(event) =>
                      setShipments((prev) =>
                        prev.map((pre, id) => {
                          if (idx === id) {
                            return { ...pre, length: event.target.value };
                          }
                          return pre;
                        })
                      )
                    }
                    value={shipment.length}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    required
                    color="primary"
                    error={!isvalid}
                    id="margin-dense"
                    label="description"
                    onChange={(event) =>
                      setShipments((prev) =>
                        prev.map((pre, id) => {
                          if (idx === id) {
                            return { ...pre, description: event.target.value };
                          }
                          return pre;
                        })
                      )
                    }
                    value={shipment.desription}
                  />
                </Grid>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleRemoveItem(idx)}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            );
          })
        ) : (
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setShipments((prev) => [...prev, shipmentDetails]);
              }}
            >
              New Shipment
            </Button>
          </Grid>
        )}
        {shipments.length > 0 ? (
          <Grid item style={{ minHeight: "10vh" }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setShipments((prev) => [...prev, shipmentDetails]);
              }}
            >
              New Shipment
            </Button>
          </Grid>
        ) : (
          <></>
        )}
      </Grid>
    </>
  );
}
