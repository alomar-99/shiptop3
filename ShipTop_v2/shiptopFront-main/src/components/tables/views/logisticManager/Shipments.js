import React, { useEffect, useState } from "react";
import ViewDispatchers from './viewDispatchers'
import ViewShipments from './ViewShipments'
import ViewWarehouses from './ViewWarehouses'
function Shipments() {
  const [ATD, setATD] = useState([]);
  const [ATW, setATW] = useState([]);
  const [filter, setFilter] = useState("View Shipments");
  const [shipmentType, setShipmentType] = useState("To Consignee");
  useEffect(() => {
    if (ATD.length > 0 && ATW.length === 0) {
      setFilter("View Dispatchers");
    } else if (ATD.length === 0 && ATW.length === 0) {
      setFilter("View Shipments");
    } else if (ATD.length === 0 && ATW.length > 0) {
      setFilter("View Warehouses");
    }
  }, [ATD, ATW]);
  if (filter === "View Dispatchers") {
    return (
      <>
        <ViewDispatchers
          dispatcherShipments={ATD}
          setDispatcherShipments={setATD}
          setATW={setATW}
        />
      </>
    );
  }
  if (filter === "View Warehouses") {
    return (
      <>
        <ViewWarehouses shipments={ATW} setShipments={setATW} />
      </>
    );
  }
  return (
    <>
      <ViewShipments
        shipmentType={shipmentType}
        setShipmentType={setShipmentType}
        setATD={setATD}
      />
    </>
  );
}

export default Shipments;
