import React, { useEffect } from "react";
import Landing from "./Landing";
import Dashboard from "./Dashboard";
import Signup from "./Signup";
import useToken from "./useToken";
import useUserId from "./useUserId";
import useUserType from "./useUserType";

import LogisitcsManagerDashboard from "./Dashboards/LogisticsManagerDashboard";
import AdministratorDashboard from "./Dashboards/AdministratorDashboard";
import CustomerServiceDashBoard from "./Dashboards/CustomerServiceDashBoard";
import FreightBrokerDashboard from "./Dashboards/FreightBrokerDashboard";
import OwnerDashboard from "./Dashboards/OwnerDashboard";
import AccountantDashboard from "./Dashboards/AccountantDashboard";
import WMDashboard from "./Dashboards/WarehouseManagerDashboard";
import DriverDashboard from "./Dashboards/DriverDashboard";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import DispatcherDashboard from "./Dashboards/DispatcherDashboard";
import WorkerDashboard from "./Dashboards/WarehouseWorker"
function App() {
  const { token, setToken } = useToken();
  const { userId, setUserId } = useUserId();

  const { userType, setUserType } = useUserType();
  //const userType = 'LogisticsManager'
  if (!token) {
    return (
      <Router>
        <Switch>
          <Route exact path="/signup">
            <Signup />
          </Route>
          <Landing
            setToken={setToken}
            setUserId={setUserId}
            setUserType={setUserType}
          />
        </Switch>
      </Router>
    );
  }

  return (
    <React.Fragment>
      {userType === "LM" && <LogisitcsManagerDashboard />}
      {userType === "WM" && <WMDashboard />}
      {userType === "AD" && <AdministratorDashboard />}
      {userType === "CO" && <Dashboard />}
      {userType === "FB" && <FreightBrokerDashboard />}
      {userType === "DI" && <DispatcherDashboard />}
      {userType === "DR" && <DriverDashboard />}
      {userType === "OW" && <OwnerDashboard />}
      {userType === "AC" && <AccountantDashboard />}
      {userType === "CS" && <CustomerServiceDashBoard />}
      {userType === "WO" && <WorkerDashboard />}
    </React.Fragment>
  );
}

export default App;
