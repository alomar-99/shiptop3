import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import theme from "../UI/Theme.js";


import Header from '../UI/Headers/Header.js';
import ViewConsignors from "../tables/views/freightBroker/viewConsignors"
function FBDashboard() {
  
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Header routes = {[
    {name: "Consignors", link: "/consignors", activeIndex: 1},

    
  ]}/>
        <Switch>

          

          <Route exact path="/consignors">
            {" "}
            <ViewConsignors />{" "}
          </Route>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default FBDashboard;