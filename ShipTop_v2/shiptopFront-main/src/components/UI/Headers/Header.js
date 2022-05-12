import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import { makeStyles } from "@material-ui/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";

import logo from "../../../assets/logo.svg";
import { Link } from "react-router-dom";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { useHistory } from "react-router-dom";

function ElevationScroll(props) {
  const { children } = props;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

const useStyles = makeStyles((theme) => ({
  toolbarMargin: {
    ...theme.mixins.toolbar,
    marginBottom: "3em",
    [theme.breakpoints.down("md")]: {
      marginBottom: "2em",
    },
    [theme.breakpoints.down("xs")]: {
      marginBottom: "1.25em",
    },
  },
  logo: {
    height: "6em",
    [theme.breakpoints.down("md")]: {
      height: "5em",
    },
    [theme.breakpoints.down("xs")]: {
      height: "4.5em",
    },
  },
  tabContainer: {
    margin: "auto",
  },
  tab: {
    // ...theme.typography.tab,  is not working
    fontFamily: "Raleway",
    textTransform: "none",
    fontWeight: "700",
    fontSize: "1rem",
    minWidth: 10,
    marginLeft: "25px",
    color: "white",
  },

  button: {
    fontFamily: "Raleway",
    textTransform: "none",
    fontWeight: "700",
    fontSize: "1rem",
    marginRight: "25px",
  },

  drawerIcon: {
    height: "50px",
    width: "50px ",
  },

  drawerIconContainer: {
    marginLeft: "auto",
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  drawer: {
    backgroundColor: theme.palette.common.mahmoolBlue,
    width: "178.9px",
    [theme.breakpoints.down("xs")]: {
      width: "161px",
    },
  },

  drawerItem: {
    ...theme.typography.tab,
    color: "white",
    opacity: 0.7,
  },

  draweItemSelected: {
    opacity: 1,
  },
  appbar: {
    zIndex: theme.zIndex.modal + 1,
  },
}));

function Header(props) {
  let history = useHistory();

  console.log(`props: ${props.routes}`)
  const [openDrawer, setOpenDrawer] = useState(false);
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const [value, setValue] = useState(0);

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  const routes = props.routes
  console.log(routes)
  

  useEffect(() => {
    routes.forEach((route) => {
      switch (window.location.pathname) {
        case `${route.link}`:
          if (value !== route.activeIndex && route.name !== "Log in") {
            setValue(route.activeIndex);
          }
          break;
        default:
          break;
      }
    });
  }, [value, routes]);

  const tabs = (
    <React.Fragment>
      <Tabs
        value={value}
        onChange={handleChange}
        className={classes.tabContainer}
        indicatorColor="primary"
      >
        {routes.map((route, i) => {
          return (
            <Tab
              className={classes.tab}
              label={route.name}
              component={Link}
              to={route.link}
              key={route.activeIndex}
            />
          );
        })}
      </Tabs>

      <Button
        className={classes.button}
        endIcon={<ExitToAppOutlinedIcon />}
        color="inherit"
        onClick={() => {
          sessionStorage.clear();
          localStorage.clear();
          window.location.href = "/";
        }}
      >
        {" "}
        Log out
      </Button>
    </React.Fragment>
  );

  const drawer = (
    <React.Fragment>
      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        onOpen={() => setOpenDrawer(true)}
        classes={{
          paper: classes.drawer,
        }}
      >
        <di className={classes.toolbarMargin} />
        <List disablePadding>
{routes.map((route, i) => {
          return (
            <ListItem
            key={route.activeIndex}
            className={
              value === route.activeIndex
                ? [classes.drawerItem, classes.draweItemSelected]
                : classes.drawerItem
            }
            onClick={() => {
              setOpenDrawer(false);
              setValue(route.activeIndex);
            }}
            divider
            button
            component={Link}
            to= {route.link}
            selected={value === route.activeIndex}
          >
            <ListItemText disableTypography>{route.name}</ListItemText>
          </ListItem>
          );
        })}
         
          <ListItem
            className={classes.drawerItem}
            onClick={() => setOpenDrawer(false)}
            divider
            button
            component={Link}
            to="/"
            selected={value === 5}
          >
            <Button
              className={classes.button}
              endIcon={<ExitToAppOutlinedIcon />}
              color="inherit"
              onClick={() => {
                sessionStorage.clear();
                localStorage.clear();
                window.location.href = "/";
              }}
            >
              {" "}
              Log out
            </Button>
          </ListItem>
        </List>
      </SwipeableDrawer>
      <IconButton
        className={classes.drawerIconContainer}
        onClick={() => setOpenDrawer(!openDrawer)}
        disableRipple
      >
        <MenuIcon className={classes.drawerIcon} />
      </IconButton>
    </React.Fragment>
  );
  return (
    <React.Fragment>
      <ElevationScroll>
        <AppBar className={classes.appbar}>
          <Toolbar disableGutters>
            <img src={logo} className={classes.logo} alt="mahmool logo" />
            {matches ? drawer : tabs}
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <div className={classes.toolbarMargin} />
    </React.Fragment>
  );
}

export default Header;
