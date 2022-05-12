import React, { useEffect, useState } from "react";

import axios from "axios";
import config from "../../config/index";
import queryString from "query-string";
import Dashboard from "../tables/views/warehouseManager/Dashboard";
import AddWH from "../tables/views/warehouseManager/addWH"
function WMDashboard() {
  const [valid, setValid] = useState(false)
  const checkWarehouse = async () => {
    const queryParams = queryString.stringify(
      {
        employeeID: sessionStorage.getItem("userId"),
      },
      { skipEmptyString: true, skipNull: true }
    );
    axios
      .get(
        `${config.API_ROOT}/api/warehouseManager/checkWarehouse${
          queryParams ? `?${queryParams}` : ""
        }`
      )
      .then((res) => {
        console.log(res.data)
        if (res.data.status === "NOWAREHOUSE") {
          
          setValid(false);
        } else {
          setValid(true);
        }
      });
  };
  useEffect(() => {

  }, [valid])
  checkWarehouse()
  console.log(`valid ${valid}`)
  if (valid) return <Dashboard />

  return <AddWH></AddWH>
}

export default WMDashboard;
