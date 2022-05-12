import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import theme from "../UI/Theme.js";

import Header from "../UI/Headers/Header.js";
import ViewWorkers from "../tables/views/warehouseWorker/ViewWorker";
//import ViewShipments from "../tables/views/logisticManager/viewShipments";
import ToStored from "../tables/views/warehouseWorker/toStore"
import ToPickedUp from "../tables/views/warehouseWorker/tofetch"
function WMDashboard() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Header
          routes={[
            { name: "To store", link: "/toBeStored", activeIndex: 0 },
            { name: "To fetch", link: "/toBePickedUp", activeIndex: 1 },
            { name: "My shelves", link: "/", activeIndex: 2 },
          ]}
        />
        <Switch>
          <Route exact path="/toBeStored">
            <ToStored />
          </Route>

          <Route exact path="/toBePickedUp">
          <ToPickedUp />
          </Route>
          <Route exact path="/">
            {/* //<ViewShipments /> */}
            <ViewWorkers Display="View" />{" "}
            <></>
          </Route>

          
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default WMDashboard;
