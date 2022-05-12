import React, { useState } from "react";
import ReactDom from "react-dom";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import { sizing } from "@material-ui/system";
import Theme from "../../UI/Theme";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ConsigneeLocator from "./ConsigneeLocator";
import AddShipment from "./AddShipment";
import axios from "axios";
import { isValid } from "date-fns";
import config from "../../../config/index"
const MODAL_STYLES = {
  position: "absolute",
  top: "70%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#ffffff",
  padding: "40px",
  zIndex: 1000,
  width: "50%",
  height: "40%",
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
  const [PhoneNum, setPhoneNum] = useState("");
  const [city, setCity] = useState("");
  const [coord, setCoord] = useState("None");
  const [orderID, setOrderID] = useState(null);
  const [shipments, setShipments] = useState([]);
  const classes = useStyles();
  const sendOrder = async () => {
    const orderDetails = JSON.stringify({
      employeeID: sessionStorage.getItem("userId"),
      location: city,
      phoneNumber: PhoneNum,
      address: coord,
      shipments: [...shipments]
    });
    console.log(orderDetails)
    axios
      .post(`${config.API_ROOT}/api/consignor/createOrder`, orderDetails, {

        headers: {
          Authorization: "Bearer token",
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res)
        if (res.data.status === "SUCCESS"){
          onClose()
        }
        }
      ).catch(err => {
        isValid(false)
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
          style={{ minWidth: "0vw", minHeight: "100vh" }}
          direction="column"
        >
          <Grid
            container
            direction="row"
            style={{ minHeight: "30vh", minWidth: "62vw" }}
            id="DeliveryDetails"
          >
            <Grid
              container
              spacing={3}
              direction="column"
              alignItems="left"
              justify="top"
              style={{ minHeight: "30vh", minWidth: "62vw" }}
              lg={4}
              xl={3}
            >
              <Grid style={{ minHeight: "10vh" }} item id="CreateOrder">
                <Typography color="secondary" variant="h3">
                  Create Order
                </Typography>
              </Grid>
              <Grid item id="deliveryLabel">
                <Typography color="primary" variant="h5">
                  Delivery Details:
                </Typography>
              </Grid>
              <Grid item id="deliveryinfo">
                <Grid direction="column" spacing={4}>
                  <Grid container direction="row" spacing={2} id="ContactInfo">
                    <Grid item>
                      <TextField
                        required
                        color="primary"
                        error={!isvalid}
                        id="PhoneNumber"
                        label="Phone Number"
                        onChange={(event) => setPhoneNum(event.target.value)}
                        value={PhoneNum}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        required
                        color="primary"
                        error={!isvalid}
                        id="margin-dense"
                        label="City"
                        onChange={(event) => setCity(event.target.value)}
                        value={city}
                      />
                    </Grid>
                  </Grid>
                 
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            style={{ minWidth: "70vw" }}
            direction="row"
            id="Shipment Details"
          >
            <Grid
              container
              spacing={3}
              direction="column"
              alignItems="left"
              justify="top"
              style={{ minHeight: "30vh", minWidth: "62vw" }}
              lg={4}
              xl={3}
            >
              <Grid item>
                <Typography color="primary" variant="h5">
                  Shipment Details:
                </Typography>
              </Grid>
              <Grid style={{ minWidth: "70vw" }} item>
                <AddShipment setShips={setShipments} />
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
                Create Order
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
