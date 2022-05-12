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
export default function CreateOrder({ open, children, onClose }) {
  const [isvalid, setIsValid] = useState(true);

  const [driverDetails, setAdminDetails] = useState({
    firstName: { value: "", isValid: true },
    lastName: { value: "", isValid: true },
    email: { value: "", isValid: true },
    phoneNumber: { value: "", isValid: true },
    password: { value: "", isValid: true },
    telephone: { value: "", isValid: true },
    roomNumber: { value: "", isValid: true },
    location: { value: "", isValid: true },
  });
  const classes = useStyles();
  const sendOrder = async () => {
    const orderDetails = JSON.stringify({
      employeeID: sessionStorage.getItem("userId"),
      firstName: driverDetails.firstName.value,
      lastName: driverDetails.lastName.value,
      email: driverDetails.email.value,
      password: driverDetails.password.value,

      phoneNumber: driverDetails.phoneNumber.value,
      office: {
        telephone: driverDetails.telephone.value,
        roomNumber: driverDetails.roomNumber.value,
        location: driverDetails.location.value,
      },
    });
    console.log(orderDetails);
    axios
      .post(`${config.API_ROOT}/api/dispatcher/addDriver`, orderDetails, {
        headers: {
          Authorization: "Bearer token",
          "Content-Type": "application/json",
        },
      })
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
                  Add Driver
                </Typography>
              </Grid>
              <Grid item id="personalLabel">
                <Typography color="primary" variant="h5">
                  Personal Details:
                </Typography>
              </Grid>
              <Grid item id="personalDetails">
                <Grid direction="column" spacing={4}>
                  <Grid container direction="row" spacing={2} id="ContactInfo">
                    <Grid item>
                      <TextField
                        required
                        color="primary"
                        error={!driverDetails.firstName.isValid}
                        id="firstName"
                        label="First Name"
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
                              firstName: {
                                value: event.target.value,
                                isValid: prev.firstName.isValid,
                              },
                            };
                          })
                        }
                        value={driverDetails.firstName.value}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        required
                        color="primary"
                        error={!driverDetails.lastName.isValid}
                        id="lastName"
                        label="Last Name"
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
                              lastName: {
                                value: event.target.value,
                                isValid: prev.firstName.isValid,
                              },
                            };
                          })
                        }
                        value={driverDetails.lastName.value}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        required
                        color="primary"
                        error={!driverDetails.phoneNumber.isValid}
                        id="phoneNumber"
                        label="Phone Number"
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
                              phoneNumber: {
                                value: event.target.value,
                                isValid: prev.firstName.isValid,
                              },
                            };
                          })
                        }
                        value={driverDetails.phoneNumber.value}
                      />
                    </Grid>
                  </Grid>
                  <Grid container direction="row" spacing={2} id="credentials">
                    <Grid item>
                      <TextField
                        required
                        color="primary"
                        error={!driverDetails.email.isValid}
                        id="email"
                        label="Email"
                        onChange={(event) =>
                          setAdminDetails((prev) => {
                            // if (!/^[a-zA-Z]+$/.test(event.target.value) && event.target.value.length !== 0) {
                            //   return { ...prev };
                            // }
                            return {
                              ...prev,
                              email: {
                                value: event.target.value,
                                isValid: prev.firstName.isValid,
                              },
                            };
                          })
                        }
                        value={driverDetails.email.value}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        required
                        color="primary"
                        error={!driverDetails.password.isValid}
                        id="password"
                        label="Password"
                        onChange={(event) =>
                          setAdminDetails((prev) => {
                            if (event.target.value.length > 8) {
                              return { ...prev };
                            }
                            return {
                              ...prev,
                              password: {
                                value: event.target.value,
                                isValid: prev.firstName.isValid,
                              },
                            };
                          })
                        }
                        value={driverDetails.password.value}
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
              <Grid container direction="row" spacing={2} id="address">
                <Grid item id="">
                  <TextField
                    required
                    color="primary"
                    error={!driverDetails.telephone.isValid}
                    id="firstName"
                    label="landline"
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
                          telephone: {
                            value: event.target.value,
                            isValid: prev.firstName.isValid,
                          },
                        };
                      })
                    }
                    value={driverDetails.telephone.value}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    required
                    color="primary"
                    error={!driverDetails.roomNumber.isValid}
                    id="roomNumber"
                    label="Room Number"
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
                          roomNumber: {
                            value: event.target.value,
                            isValid: prev.firstName.isValid,
                          },
                        };
                      })
                    }
                    value={driverDetails.roomNumber.value}
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
                add Driver
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
