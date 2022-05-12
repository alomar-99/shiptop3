import React, { useState } from "react";
import ReactDom from "react-dom";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { isValid } from "date-fns";

const MODAL_STYLES = {
  position: "absolute",
  top: "60%",
  left: "50%",
  alignItems: "center",
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
export default function CreateOrder({ open, children, onClose }) {
  const [isvalid, setIsValid] = useState(true);

  const [dispatcherDetails, setDispatcherDetails] = useState({
    model: "",
    yearOfManufactoring: "",
    manufacturerCompany: "",
    color: "",
    plateNumber: "",
    weightInTons: "",
    capacity: "",
    
  });
  const classes = useStyles();
  const sendOrder = async () => {
    const orderDetails = JSON.stringify({
      employeeID: sessionStorage.getItem("userId"),
      capacity: dispatcherDetails.capacity,
      registration: {
        plateNumber: dispatcherDetails.plateNumber,
        yearOfManufactoring: dispatcherDetails.yearOfManufactoring,
        model: dispatcherDetails.model,
        color: dispatcherDetails.color,
        manufacturerCompany: dispatcherDetails.manufacturerCompany,
        weightInTons: dispatcherDetails.weightInTons,
      },
    });
    console.log(orderDetails);
    axios
      .post(
        "http://localhost:5001/api/dispatcher/addVehicle",
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
          onClose();
        }
      })
      .catch((err) => {
        isValid(false);
      });
  };

  if (!open) return null;

  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLES} />
      <div style={MODAL_STYLES}>
        <Grid
          container
          spacing={1}
          style={{ minWidth: "30vw", minHeight: "60vh" }}
          direction="column"
        >
          <Grid
            container
            direction="row"
            style={{ minHeight: "60vh", minWidth: "35vw" }}
            id="DispatcherDetails"
          >
            <Grid
              container
              spacing={3}
              direction="column"
              alignItems="left"
              justify="top"
              lg={4}
              xl={3}
              style={{ minHeight: "20vh", minWidth: "40vw" }}
            >
              <Grid style={{ minHeight: "13vh" }} item id="AddDispatcher">
                <Typography color="secondary" variant="h3">
                  Add Vehicle
                </Typography>
              </Grid>
              <Grid item id="personalLabel">
                <Typography color="primary" variant="h5">
                  Vehicle Details:
                </Typography>
              </Grid>
              <Grid item id="personalDetails">
                <Grid direction="column" spacing={4}>
                  <Grid container direction="row" spacing={2} id="ContactInfo">
                    <Grid item>
                      <TextField
                        required
                        color="primary"
                        error={!isvalid}
                        id="model"
                        label="model"
                        onChange={(event) =>
                          setDispatcherDetails((prev) => ({
                            ...prev,
                            model: event.target.value,
                          }))
                        }
                        value={dispatcherDetails.model}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        required
                        color="primary"
                        error={!isvalid}
                        id="yearOfManufactoring"
                        label="Year"
                        onChange={(event) =>
                          setDispatcherDetails((prev) => ({
                            ...prev,
                            yearOfManufactoring: event.target.value,
                          }))
                        }
                        value={dispatcherDetails.yearOfManufactoring}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        required
                        color="primary"
                        error={!isvalid}
                        id="color"
                        label="Color"
                        onChange={(event) => {
                          setDispatcherDetails((prev) => ({
                            ...prev,
                            color: event.target.value,
                          }));
                        }}
                        value={dispatcherDetails.color}
                      />
                    </Grid>
                  </Grid>
                  <Grid container direction="row" spacing={2} id="credentials">
                    <Grid item>
                      <TextField
                        required
                        color="primary"
                        error={!isvalid}
                        id="manufacturerCompany"
                        label="man. Company"
                        onChange={(event) =>
                          setDispatcherDetails((prev) => ({
                            ...prev,
                            manufacturerCompany: event.target.value,
                          }))
                        }
                        value={dispatcherDetails.manufacturerCompany}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        required
                        color="primary"
                        error={!isvalid}
                        id="plateNumber"
                        label="Plate Number"
                        onChange={(event) =>
                          setDispatcherDetails((prev) => ({
                            ...prev,
                            plateNumber: event.target.value,
                          }))
                        }
                        value={dispatcherDetails.plateNumber}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item id="addressLabel">
                <Typography color="primary" variant="h5">
                  Vehicle Specifications:
                </Typography>
              </Grid>
              <Grid item container direction="row" id="" spacing={3} style={{minWidth: "35vw"}}>
              <Grid item >
                <TextField
                  required
                  color="primary"
                  error={!isvalid}
                  id="Weight"
                  label="Weight"
                  onChange={(event) =>
                    setDispatcherDetails((prev) => ({
                      ...prev,
                      weightInTons: event.target.value,
                    }))
                  }
                  value={dispatcherDetails.weightInTons}
                />
                </Grid>
                <Grid item>
                <TextField
                  required
                  color="primary"
                  error={!isvalid}
                  id="capacity"
                  label="Capacity"
                  onChange={(event) =>
                    setDispatcherDetails((prev) => ({
                      ...prev,
                      capacity: event.target.value,
                    }))
                  }
                  value={dispatcherDetails.capacity}
                />
                </Grid>
              </Grid>
              <Grid item>
                
              </Grid>
            </Grid>
          </Grid>

          <Grid container spacing={2} direction="row" id="Buttons">
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                className={classes.spacing}
                onClick={onClose}
                sx={{ p: 2 }}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                className={classes.spacing}
                onClick={sendOrder}
              >
                add Vehicle 
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {children}
      </div>
    </>,
    document.getElementById("portal")
  );
}
