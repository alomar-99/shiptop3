import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import theme from "../UI/Theme.js";


import Header from '../UI/Headers/Header.js';


function AccountantDashboard() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Header routes = {[
    { name: "Orders", link: "/", activeIndex: 0 },
    
  ]}/>
        <Switch>
          <Route exact path="/">
            {" "}
            <h1> BYE BUEEEEEE</h1>{" "}
          </Route>


        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default AccountantDashboard;