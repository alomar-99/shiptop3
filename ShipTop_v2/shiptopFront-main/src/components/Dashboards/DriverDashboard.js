import React, { useState } from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import theme from "../UI/Theme.js";
// import Header from "../UI/Header.js";

import Header from "../UI/Headers/Header";
import ViewShipments from "../tables/views/driver/viewShipments"
import Vehicle from "../tables/views/driver/Vehicle";
function DriverDashboard() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Header
          routes={[
            {
              name: "Shipments",
              link: "/",
              activeIndex: 0,
            },
           
            { name: "my Vehicle", link: "/myVehicle", activeIndex: 1 },
          ]}
        />
        <Switch>
          <Route exact path="/">
            <ViewShipments />
          </Route>
          <Route exact path="/vehicle">
            <Vehicle />
          </Route>
         
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default DriverDashboard;
