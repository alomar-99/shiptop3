import axios from "axios";
import React, { useEffect, useState } from "react";
import ViewWorkers from "./ViewWorker";
import ViewShipments from "./viewShipment";
import config from "../../../../config/index";
function Shipments() {
  const [filter, setFilter] = useState("View Shipments");
  const [shipments, setShipments] = useState([])
  const [WMID, setWMID] = useState(null)
  const [DIID, setDIID] = useState(null)
 
  const assignEmployees = async () => {
    console.log("in post request")
    const body = JSON.stringify({
      shipmentID: shipments,
      assignedEmployeeID: DIID,
      employeeID: sessionStorage.getItem("userId"),
    });
    axios
      .post(
        `${config.API_ROOT}/api/worker/moveShipments`,
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
          setShipments([])
        }
      });
  };
  useEffect(() => {
    if (
      shipments.length > 0 &&
      DIID === null
    ) {
      setFilter("View Drivers");
    } else if (shipments.length === 0) {
      setFilter("View Shipments");
    } else if (
      DIID !== null &&
      shipments.length > 0
    ) {
      console.log(WMID)
      assignEmployees();
    }
  }, [DIID, shipments]);
  if (filter === "View Drivers") {
    return (
      <>
        <ViewWorkers setDispatcher={setDIID} Display="Assign" />
      </>
    );
  }
 
  return (
    <>
      <ViewShipments setShipments={setShipments} filters={["TOBESTORED"]}/>
    </>
  );
}

export default Shipments;
