import React, { useState } from "react";
import ReactDom from "react-dom";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import { sizing } from "@material-ui/system";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { isValid } from "date-fns";
import config from "../../../../config/index";

const MODAL_STYLES = {
  position: "absolute",
  top: "60%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#ffffff",
  padding: "40px",
  zIndex: 1000,
  width: "37%",
  height: "65%",
  borderRadius: "1em",
  display: "inline-table",
};

const OVERLAY_STYLES = {
  position: "fixed",
  display: "flex",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, .7)",
  zIndex: 1000,
  height: "100%",
  width: "100%",
  overflowY: "auto",
};

const useStyles = makeStyles({
  h5: {
    color: "white",
  },
});
export default function CreateOrder() {
  const [isvalid, setIsValid] = useState(true);

  const [driverDetails, setAdminDetails] = useState({
    city: { value: "", isValid: true },
    floor: { value: "", isValid: true },
    lane: { value: "", isValid: true },
    section: { value: "", isValid: true },
    row: { value: "", isValid: true },
    number: { value: "", isValid: true },
    width: {value: "", isValid: true},
    height: {value: "", isValid: true}
  });
  const classes = useStyles();
  const sendOrder = async () => {
    const orderDetails = JSON.stringify({
      employeeID: sessionStorage.getItem("userId"),
      city: driverDetails.city.value,
      address: "",
      shelf: {
        floors: driverDetails.floor.value,
        lanes: driverDetails.lane.value,
        rows: driverDetails.row.value,
        sections: driverDetails.section.value,
        number: driverDetails.number.value,
        width: driverDetails.width.value,
        height: driverDetails.height.value
      },
    });
    console.log(orderDetails);
    axios
      .post(
        `${config.API_ROOT}/api/warehouseManager/addWarehouse`,
        orderDetails,
        {
          headers: {
            Authorization: "Bearer token",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
        if (res.data.status === "SUCCESS") {
          sessionStorage.clear();
          localStorage.clear();
          window.location.href = "/";
        }
      })
      .catch((err) => {
        isValid(false);
      });
  };


  return (
    <>
      <div style={OVERLAY_STYLES} />
      <div style={MODAL_STYLES}>
        <Grid
          container
          spacing={1}
          style={{ minWidth: "35vw", minHeight: "80vh" }}
          direction="column"
        >
          <Grid
            container
            direction="row"
            style={{ minHeight: "80vh", minWidth: "35vw" }}
            id="AdminDetails"
          >
            <Grid
              container
              spacing={3}
              direction="column"
              alignItems="left"
              justify="top"
              lg={4}
              xl={3}
              style={{ minHeight: "80vh", minWidth: "40vw" }}
            >
              <Grid style={{ minHeight: "13vh" }} item id="AddAdminr">
                <Typography color="secondary" variant="h3">
                  Please Create your warehouse
                </Typography>
              </Grid>
              <Grid item id="personalLabel">
                <Typography color="primary" variant="h5">
                  Warehouse Details:
                </Typography>
              </Grid>
              <Grid item id="personalDetails">
                <Grid direction="column" spacing={4}>
                  <Grid container direction="row" spacing={2} id="ContactInfo">
                    <Grid item>
                      <TextField
                        required
                        color="primary"
                        error={!driverDetails.city.isValid}
                        id="city"
                        label="City"
                        onChange={(event) =>
                          setAdminDetails((prev) => {
                            if (
                              !/^[a-zA-Z]+$/.test(event.target.value) &&
                              event.target.value.length !== 0
                            ) {
                              return { ...prev };
                            }
                            return {
                              ...prev,
                              city: {
                                value: event.target.value,
                                isValid: prev.city.isValid,
                              },
                            };
                          })
                        }
                        value={driverDetails.city.value}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item id="addressLabel">
                <Typography color="primary" variant="h5">
                  Shelfs:
                </Typography>
              </Grid>
              <Grid container direction="row" spacing={2} id="address">
                <Grid item>
                  <TextField
                    required
                    color="primary"
                    error={!driverDetails.number.isValid}
                    id="number"
                    label="Number"
                    onChange={(event) =>
                      setAdminDetails((prev) => {
                        if (
                          !Number(event.target.value) &&
                          event.target.value.length !== 0 &&
                          event.target.value !== "0"
                        ) {
                          return { ...prev };
                        }
                        return {
                          ...prev,
                          number: {
                            value: event.target.value,
                            isValid: prev.number.isValid,
                          },
                        };
                      })
                    }
                    value={driverDetails.number.value}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    required
                    color="primary"
                    error={!driverDetails.lane.isValid}
                    id="lane"
                    label="lane"
                    onChange={(event) =>
                      setAdminDetails((prev) => {
                        if (
                          !Number(event.target.value) &&
                          event.target.value.length !== 0 &&
                          event.target.value !== "0"
                        ) {
                          return { ...prev };
                        }
                        return {
                          ...prev,
                          lane: {
                            value: event.target.value,
                            isValid: prev.lane.isValid,
                          },
                        };
                      })
                    }
                    value={driverDetails.lane.value}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    required
                    color="primary"
                    error={!driverDetails.row.isValid}
                    id="row"
                    label="row"
                    onChange={(event) =>
                      setAdminDetails((prev) => {
                        if (
                          !Number(event.target.value) &&
                          event.target.value.length !== 0 &&
                          event.target.value !== "0"
                        ) {
                          return { ...prev };
                        }
                        return {
                          ...prev,
                          row: {
                            value: event.target.value,
                            isValid: prev.row.isValid,
                          },
                        };
                      })
                    }
                    value={driverDetails.row.value}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    required
                    color="primary"
                    error={!driverDetails.floor.isValid}
                    id="floor"
                    label="Floor"
                    onChange={(event) =>
                      setAdminDetails((prev) => {
                        if (
                          !Number(event.target.value) &&
                          event.target.value.length !== 0 &&
                          event.target.value !== "0"
                        ) {
                          return { ...prev };
                        }
                        return {
                          ...prev,
                          floor: {
                            value: event.target.value,
                            isValid: prev.floor.isValid,
                          },
                        };
                      })
                    }
                    value={driverDetails.floor.value}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    required
                    color="primary"
                    error={!driverDetails.section.isValid}
                    id="section"
                    label="Sections"
                    onChange={(event) =>
                      setAdminDetails((prev) => {
                        if (
                          !Number(event.target.value) &&
                          event.target.value.length !== 0 &&
                          event.target.value !== "0"
                        ) {
                          return { ...prev };
                        }
                        return {
                          ...prev,
                          section: {
                            value: event.target.value,
                            isValid: prev.section.isValid,
                          },
                        };
                      })
                    }
                    value={driverDetails.section.value}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    required
                    color="primary"
                    error={!driverDetails.height.isValid}
                    id="height"
                    label="Height"
                    onChange={(event) =>
                      setAdminDetails((prev) => {
                        if (
                          !Number(event.target.value) &&
                          event.target.value.length !== 0 &&
                          event.target.value !== "0"
                        ) {
                          return { ...prev };
                        }
                        return {
                          ...prev,
                          height: {
                            value: event.target.value,
                            isValid: prev.height.isValid,
                          },
                        };
                      })
                    }
                    value={driverDetails.height.value}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    required
                    color="primary"
                    error={!driverDetails.width.isValid}
                    id="width"
                    label="Width"
                    onChange={(event) =>
                      setAdminDetails((prev) => {
                        if (
                          !Number(event.target.value) &&
                          event.target.value.length !== 0 &&
                          event.target.value !== "0"
                        ) {
                          return { ...prev };
                        }
                        return {
                          ...prev,
                          width: {
                            value: event.target.value,
                            isValid: prev.width.isValid,
                          },
                        };
                      })
                    }
                    value={driverDetails.width.value}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container spacing={2} direction="row" id="Buttons">
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                className={classes.spacing}
                onClick={() => {
                  sessionStorage.clear();
                  localStorage.clear();
                  window.location.href = "/";
                }}
                sx={{ p: 2 }}
              >
                Logout
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                className={classes.spacing}
                onClick={sendOrder}
              >
                Add warehouse
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
