import React, { useState } from "react";
import PropTypes from "prop-types";
// import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Car from "../assets/shiptop.jpg";
import Logo from "../assets/logo.png";
import { makeStyles } from "@material-ui/core/styles";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import config from "./../config/index";

const useStyles = makeStyles((theme) => ({
  h2: {
    color: "white",
  },
  carStyle: {
    // bacgroundImage: "url(${Car})",
    backgroundPosition: "center",
    backgroundSize: "fill",
    backgroundRepeat: "no-repeat",
    height: "55em",
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
  spacing: {
    marginTop: "2em",
  },
}));

export default function Landing({ setToken, setUserId, setUserType }) {
  // let history = useHistory();

  // Axios.defaults.withCredentials = true;
  const classes = useStyles();
  // const theme = useTheme();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    const payload = {
      email: username,
      password: password,
    };

    console.log(payload);
    Axios.post(`${config.API_ROOT}/api/user/signIn`, { ...payload })
      .then((res) => {
        console.log(res);

        if (res.data.status !== "ACC DOESN't EXIST") {
          setToken("12312");
          setUserId(res.data.employeeID);
          setUserType(res.data.role);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Grid container direction="row" style={{ backgroundColor: "#82c0d9" }}>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
        lg={4}
        xl={3}
      >
        <Grid item>
          <img src={Logo} className={classes.logo} alt="shiptop logo" />
        </Grid>
        <Grid item className={classes.h2}>
          <Typography variant="h2">Login</Typography>
        </Grid>

        <Grid item>
          <TextField
            label="Username"
            id="username"
            onChange={(event) => setUsername(event.target.value)}
          />
        </Grid>
        <Grid item>
          <TextField
            type="password"
            label="Password"
            id="pafssword"
            onChange={(event) => setPassword(event.target.value)}
          />
        </Grid>

        <Grid item className={classes.h2}>
          <Button
            variant="contained"
            color="primary"
            className={classes.spacing}
            onClick={login}
          >
            Log in
          </Button>
          {/* <p>
            Don't you have an account? <br />
            <a href="/signup">Sign Up here</a>
          </p> */}
        </Grid>
      </Grid>

      <Grid container className={classes.carStyle} lg={8} xl={9}>
        <img src={Car} className={classes.carStyle} alt="shiptop pack" />
      </Grid>
    </Grid>
  );
}

Landing.propTypes = {
  setToken: PropTypes.func.isRequired,
};
