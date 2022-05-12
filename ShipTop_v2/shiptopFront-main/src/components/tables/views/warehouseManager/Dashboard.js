import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import theme from "../../../UI/Theme.js";
import Header from "../../../UI/Headers/Header"
import ViewWorkers from "./ViewWorker";
//import ViewShipments from "../tables/views/logisticManager/viewShipments";
import ToStored from "./toConsignee"
import ToPickedUp from "./toWarehouse"
import Shelves from "./viewShelfs"
import AssignShelves from "./assignShelves"
function WMDashboard() {
  
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Header
          routes={[
            { name: "To fetch", link: "/toBeStored", activeIndex: 0 },
            { name: "To store", link: "/toBePickedUp", activeIndex: 1 },
            { name: "Workers", link: "/workers", activeIndex: 2 },
            { name: "My Warehouse", link: "/warehouse", activeIndex: 3 },
            { name: "Assign Shelves", link: "/assignShelves", activeIndex: 4 }, 
            { name: "Shelves", link: "/shelves", activeIndex: 5 },
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
            <></>
          </Route>

          <Route exact path="/workers">
            {" "}
            <ViewWorkers Display="View" />{" "}
          </Route>
          <Route exact path="/warehouse"></Route>
          <Route exact path="/shelves">
          <Shelves filters="Display"/>
            
          </Route>
          <Route exact path="/assignShelves">
          <AssignShelves />
          </Route>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default WMDashboard;
