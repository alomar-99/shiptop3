import axios from "axios";
import React, { useEffect, useState } from "react";
import ViewWorkers from "./ViewWorker";
import ViewShipments from "./viewShipment";
import config from "../../../../config/index";
function Shipments() {
  const [filter, setFilter] = useState("View Shipments");
  const [shipments, setShipments] = useState([]);
  const [WMID, setWMID] = useState(null);
  const [DIID, setDIID] = useState(null);

  const assignEmployees = async () => {
    console.log("in post request");

    const shelfs = shipments.map((prev) => ({ shelfID: "", shipmentID: prev }));
    const body = JSON.stringify({
      shelfs: shelfs,
      assignedEmployeeID: DIID,
      employeeID: sessionStorage.getItem("userId"),
    });
    axios
      .post(`${config.API_ROOT}/api/worker/moveShipments`, body, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          console.log("assigned successfully!!");
          setDIID(null);
          setWMID(null);
          setShipments([]);
        }
      });
  };
  useEffect(() => {
    if (shipments.length > 0) {
      assignEmployees();
    }
  }, [DIID]);
  

  return (
    <>
      <ViewShipments setShipments={setShipments} filters={["PICKUP"]} />
    </>
  );
}

export default Shipments;
