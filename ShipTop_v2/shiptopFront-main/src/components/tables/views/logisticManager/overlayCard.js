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

const MODAL_STYLES = {
  position: "absolute",
  top: "70%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#ffffff",
  padding: "40px",
  zIndex: 1000,
  width: "50%",
  height: "70%",
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
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    telephone: "",
    roomNumber: "",
  });
  const classes = useStyles();
  const sendOrder = async () => {
    const orderDetails = JSON.stringify({
      employeeID: sessionStorage.getItem("userId"),
      firstName: dispatcherDetails.firstName,
      lastName: dispatcherDetails.lastName,
      email: dispatcherDetails.email,
      phoneNumber: dispatcherDetails.phoneNumber,
      office: {
        telephone: dispatcherDetails.telephone,
        roomNumber: dispatcherDetails.roomNumber,
      },
    });
    console.log(orderDetails);
    axios
      .post(
        "http://localhost:5001/api/logisticManager/addDispatcher",
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
          style={{ minWidth: "70vw", minHeight: "100vh" }}
          direction="column"
        >
          <Grid
            container
            direction="row"
            style={{ minHeight: "70vh", minWidth: "62vw" }}
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
              style={{ minHeight: "20vh" }}
            >
              <Grid style={{ minHeight: "13vh" }} item id="AddDispatcher">
                <Typography color="secondary" variant="h3">
                  Add Dispatcher
                </Typography>
              </Grid>
              <Grid item id="personalLabel">
                <Typography color="primary" variant="h5">
                  personal Details:
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
                        id="firstName"
                        label="First Name"
                        onChange={(event) =>
                          setDispatcherDetails((prev) => ({
                            ...prev,
                            firstName: event.target.value,
                          }))
                        }
                        value={dispatcherDetails.firstName}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        required
                        color="primary"
                        error={!isvalid}
                        id="lastName"
                        label="Last Name"
                        onChange={(event) =>
                          setDispatcherDetails((prev) => ({
                            ...prev,
                            lastName: event.target.value,
                          }))
                        }
                        value={dispatcherDetails.lastName}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        required
                        color="primary"
                        error={!isvalid}
                        id="phoneNumber"
                        label="Phone Number"
                        onChange={(event) => {
                          setDispatcherDetails((prev) => ({
                            ...prev,
                            phoneNumber: event.target.value,
                          }));
                        }}
                        value={dispatcherDetails.phoneNumber}
                      />
                    </Grid>
                  </Grid>
                  <Grid container direction="row" spacing={2} id="credentials">
                    <Grid item>
                      <TextField
                        required
                        color="primary"
                        error={!isvalid}
                        id="email"
                        label="Email"
                        onChange={(event) =>
                          setDispatcherDetails((prev) => ({
                            ...prev,
                            email: event.target.value,
                          }))
                        }
                        value={dispatcherDetails.email}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        required
                        color="primary"
                        error={!isvalid}
                        id="password"
                        label="Password"
                        onChange={(event) =>
                          setDispatcherDetails((prev) => ({
                            ...prev,
                            password: event.target.value,
                          }))
                        }
                        value={dispatcherDetails.password}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item id="addressLabel">
                <Typography color="primary" variant="h5">
                  Address:
                </Typography>
              </Grid>
              <Grid item id="">
                <TextField
                  required
                  color="primary"
                  error={!isvalid}
                  id="firstName"
                  label="landline"
                  onChange={(event) =>
                    setDispatcherDetails((prev) => ({
                      ...prev,
                      telephone: event.target.value,
                    }))
                  }
                  value={dispatcherDetails.telephone}
                />
              </Grid>
              <Grid item>
                <TextField
                  required
                  color="primary"
                  error={!isvalid}
                  id="roomNumber"
                  label="Room Number"
                  onChange={(event) =>
                    setDispatcherDetails((prev) => ({
                      ...prev,
                      roomNumber: event.target.value,
                    }))
                  }
                  value={dispatcherDetails.roomNumber}
                />
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
                add Dispatcher
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
