import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import theme from "../UI/Theme.js";
import Search from "../UI/Search.js";
import Signup from "../Signup.js";
import Landing from "../Landing.js";


import InvalidPhone from "../tables/invalidPhoneTable.js";
import InvalidCity from "../tables/invalidCityTable.js";
import WaitingLocation from "../tables/waitingLocationTable.js";
import WaitingReschedule from "../tables/waitingRescheduleTable.js";
import ToReturn from "../tables/toReturnTable.js";
import Header from '../UI/Headers/Header.js';
import ViewCustomerServices from "../tables/views/owner/viewCustomerServices"
import ViewAccountants from "../tables/views/owner/viewAccountants"
import ViewLogisticManagers from "../tables/views/owner/viewLogisticManagers"
import ViewFreightBrokers from "../tables/views/owner/viewFreightBrokers"

function ADDashboard() {
  
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Header routes = {[
    {name: "Accountants", link: "/accountant", activeIndex: 0},
    {name: "Customer Services", link: "/", activeIndex: 1},
    {name: "Freight Brokers", link: "/freightBroker", activeIndex: 2},
    {name: "Logistic Managers", link: "/logisticManager", activeIndex: 3},


    
  ]}/>
        <Switch>

          <Route exact path="/">
            {" "}
            <ViewCustomerServices />{" "}
          </Route>
          <Route exact path="/accountant">
            {" "}
            <ViewAccountants />{" "}
          </Route>
          <Route exact path="/logisticManager">
            {" "}
            <ViewLogisticManagers />{" "}
          </Route>
          <Route exact path="/freightBroker">
            {" "}
            <ViewFreightBrokers />{" "}
          </Route>

        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default ADDashboard;