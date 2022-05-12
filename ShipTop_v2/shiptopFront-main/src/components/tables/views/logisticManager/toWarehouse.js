import axios from "axios";
import React, { useEffect, useState } from "react";
import ViewDispatchers from "./viewDispatchers";
import ViewShipments from "./ViewShipments";
import ViewWarehouses from "./ViewWarehouses";
import config from "../../../../config/index";
function Shipments() {
  const [filter, setFilter] = useState("View Shipments");
  const [shipments, setShipments] = useState({filter: null, shipment:[]})
  const [WMID, setWMID] = useState(null)
  const [DIID, setDIID] = useState(null)
 
  const assignEmployees = async () => {
    console.log("in post request")
    const body = JSON.stringify({
      shipmentID: shipments.shipment,
      warehouseManagerID: WMID,
      dispatcherID: DIID,
      employeeID: sessionStorage.getItem("userId"),
      deliveryStatus: shipments.filter === "NEW" ? ("ONDELIVERY") : ("TOSTORE")
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
          setWMID(null)
          setShipments({filter: null, shipment:[]})
        }
      });
  };
  useEffect(() => {
    console.log(WMID)
    if (
      shipments.shipment.length > 0 &&
      DIID === null
    ) {
      setFilter("View Dispatchers");
    } else if (DIID !== null && WMID === null) {
      setFilter("View Warehouses");
    } else if (shipments.shipment.length === 0) {
      setFilter("View Shipments");
    } else if (
      DIID !== null &&
     WMID !== null &&
      shipments.shipment.length > 0
    ) {
      console.log(WMID)
      assignEmployees();
    }
  }, [DIID, WMID, shipments]);
  if (filter === "View Dispatchers") {
    return (
      <>
        <ViewDispatchers setDispatcher={setDIID} Display="Assign" />
      </>
    );
  }
  if (filter === "View Warehouses") {
    return (
      <>
        <ViewWarehouses setWarehouse={setWMID} />
      </>
    );
  }
  return (
    <>
      <ViewShipments setShipments={setShipments} filters={["NEW", "STORED"]} />
    </>
  );
}

export default Shipments;
