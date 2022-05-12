import axios from "axios";
import React, { useEffect, useState } from "react";
import ViewDispatchers from "./viewDispatchers";
import ViewShipments from "./ViewShipments";
import config from "../../../../config/index";
function Shipments() {
  const [filter, setFilter] = useState("View Shipments");
  const [shipments, setShipments] = useState([])
  const [DIID, setDIID] = useState(null)
 
  const assignEmployees = async () => {
    console.log("in post request")
    const body = JSON.stringify({
      shipmentID: shipments,
      warehouseManagerID: null,
      dispatcherID: DIID,
      employeeID: sessionStorage.getItem("userId"),
      deliveryStatus: "TOPICKUP"
    });
    axios
      .post(
        `${config.API_ROOT}/api/logisticManager/assignShipmentsToDispatcher`,
        body,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          console.log("assigned successfully!!");
          setDIID(null)
          setShipments([])
        }
      });
  };
  useEffect(() => {

    if (
      shipments.length > 0 &&
      DIID === null
    ) {
      setFilter("View Dispatchers");
    }  else if (shipments.length === 0) {
      setFilter("View Shipments");
    } else if (
      DIID !== null  &&
      shipments.length > 0
    ) {
      assignEmployees();
    }
  }, [DIID, shipments]);
  if (filter === "View Dispatchers") {
    return (
      <>
        <ViewDispatchers setDispatcher={setDIID} Display="Assign" />
      </>
    );
  }

  return (
    <>
      <ViewShipments setShipments={setShipments} filters={["STORED"]}/>
    </>
  );
}

export default Shipments;
