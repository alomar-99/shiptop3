import React, { useState } from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ViewDrivers from "../tables/views/dispatcher/viewDrivers";
import Vehicles from "../tables/views/dispatcher/Vehicles";
import ViewVehicles from "../tables/views/dispatcher/viewVehicles"
import theme from "../UI/Theme.js";
// import Header from "../UI/Header.js";

import ToWarehouse from "../tables/views/dispatcher/toWarehouse";
import ToConsignee from "../tables/views/dispatcher/toConsignee";
import Header from "../UI/Headers/Header";

function DispatcherDashboard() {
  const routes = [
    {
      name: "To Warehouse",
      link: "/toWarehouse",
      activeIndex: 0,
    },
    { name: "To Consignee", link: "/toConsignee", activeIndex: 1 },
    { name: "Drivers", link: "/", activeIndex: 2 },
    {name: "Assign Vehicles", link:"/assignVehicles", activeIndex:3},
    { name: "Vehicles", link: "/vehicles", activeIndex: 4 },
  ];
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
      <Header routes={routes} />
        <Switch>
          <Route exact path="/toWarehouse">
            <ToWarehouse />
          </Route>
          <Route exact path="/toConsignee">
            <ToConsignee />
          </Route>
          <Route exact path="/">
            {" "}
            <ViewDrivers Display={"View"} />{" "}
          </Route>
          <Route exact path="/vehicles">
            {" "}
            <ViewVehicles Display="View"/>{" "}
          </Route>
          <Route exact path="/assignVehicles">
    <Vehicles></Vehicles>
          </Route>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default DispatcherDashboard;
