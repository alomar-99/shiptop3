import React, { useState } from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ViewDispatchers from "../tables/views/logisticManager/viewDispatchers";
import ViewWarehouseManagers from "../tables/views/logisticManager/viewWarehouseManagers";

import theme from "../UI/Theme.js";
// import Header from "../UI/Header.js";

import ToWarehouse from "../tables/views/logisticManager/toWarehouse";
import ToConsignee from "../tables/views/logisticManager/toConsignee"
import Header from "../UI/Headers/Header";

function LMDashboard() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Header
          routes={[
            {
              name: "To Warehouse",
              link: "/toWarehouse",
              activeIndex: 0,
            },
            { name: "To Consignee", link: "/toConsignee", activeIndex: 1 },
            { name: "Dispatchers", link: "/", activeIndex: 2 },
            { name: "Warehouse Managers", link: "/WM", activeIndex: 3 },
          ]}
        />
        <Switch>
          <Route exact path="/toWarehouse">
            <ToWarehouse />
          </Route>
          <Route exact path="/toConsignee">
            <ToConsignee />
          </Route>
          <Route exact path="/">
            {" "}
            <ViewDispatchers Display={"View"} />{" "}
            {
              // <WaitingFromWarehouse/>
            }
          </Route>
          <Route exact path="/WM">
            {" "}
            <ViewWarehouseManagers />{" "}
            {
              // <Dispatchers/>
            }
          </Route>
          


        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default LMDashboard;
