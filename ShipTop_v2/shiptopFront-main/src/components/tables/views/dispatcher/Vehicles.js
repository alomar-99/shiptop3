import axios from "axios";
import React, { useEffect, useState } from "react";
import ViewDrivers from "./viewDrivers";
import ViewVehicles from "./viewVehicles";
import config from "../../../../config/index";
function Vehicles() {
  const [filter, setFilter] = useState("");
  const [vehicleID, setvehicleID] = useState(null);
  const [DIID, setDIID] = useState(null);
  const [Display, setDisplay] = useState("Assign");

  const assignEmployees = async () => {
    console.log("in post request");
    const body = JSON.stringify({
      vehicleID: vehicleID,
      driverID: DIID,
      employeeID: sessionStorage.getItem("userId"),
    });
    axios
      .post(
        `${config.API_ROOT}/api/dispatcher/assignVehicleToDriver`,

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
          setDIID(null);
          setvehicleID(null);
        }
      });
  };
  useEffect(() => {
    console.log(`Driver: ${DIID}, Vehicle: ${vehicleID}`)
    if (vehicleID !== null && DIID == null) {
      setFilter("View Drivers");
    } else if (DIID !== null && vehicleID !== null) {
      assignEmployees();
    } else {
      setFilter("")
    }
  }, [DIID, vehicleID]);
  if (filter === "View Drivers") {
    return (
      <>
        <ViewDrivers setDispatcher={setDIID} Display="Assign" />
      </>
    );
  }

  return (
    <>
      <ViewVehicles setDispatcher={setvehicleID} Display="Assign"/>
    </>
  );
}

export default Vehicles;
