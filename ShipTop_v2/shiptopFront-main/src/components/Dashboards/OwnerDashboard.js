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
import ViewAdministrators from "../tables/views/owner/viewAdministrators"
import ViewCustomerServices from "../tables/views/owner/viewCustomerServices"
import ViewAccountants from "../tables/views/owner/viewAccountants"
import ViewLogisticManagers from "../tables/views/owner/viewLogisticManagers"
import ViewFreightBrokers from "../tables/views/owner/viewFreightBrokers"

function OWDashboard() {
  
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Header routes = {[
    {name: "Administrators", link: "/", activeIndex: 0},
    {name: "Accountants", link: "/accountant", activeIndex: 1},
    {name: "Customer Services", link: "/customerService", activeIndex: 2},
    {name: "Freight Brokers", link: "/freightBroker", activeIndex: 3},
    {name: "Logistic Managers", link: "/logisticManager", activeIndex: 4},


    
  ]}/>
        <Switch>

          

          <Route exact path="/">
            {" "}
            <ViewAdministrators />{" "}
          </Route>
          <Route exact path="/customerService">
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

export default OWDashboard;