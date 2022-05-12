import { useState } from "react";
// import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Car from "../assets/car.png";
import Logo from "../assets/logo-wb.png";
import { makeStyles } from "@material-ui/core/styles";
import Axios from "axios";
import config from "./../config/index";

const useStyles = makeStyles((theme) => ({
  h2: {
    color: "white",
  },

  carStyle: {
    // bacgroundImage: "url(${Car})",
    backgroundPosition: "center",
    backgroundSize: "cover",
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

export default function Signup() {
  const classes = useStyles();
  //   const theme = useTheme();

  const [usernameReg, setUsernameReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [emailReg, setEmailReg] = useState("");
  const [errors, setErros] = useState("");
  // Axios.defaults.withCredentials = true;

  const register = () => {
    const payload = {
      username: usernameReg,
      email: emailReg,
      password: passwordReg,
    };

    Axios.post(`${config.API_ROOT}/signup`, { payload })
      .then((res) => {
        if (res.data.success === true) {
          localStorage.token = res.data.token;
          localStorage.isAuthenticated = 1;
          window.location.href = "/";
          // localStorage.clear();
        } else {
          setErros(res.data.message);
          localStorage.isAuthenticated = 0;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Grid container direction="row" style={{ backgroundColor: "#29467f" }}>
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
          <Grid container direction="column">
            <Grid item>
              <img src={Logo} className={classes.logo} alt="shiptop logo" />
            </Grid>
            <Grid item className={classes.h2}>
              <Typography variant="h2">Sign up</Typography>
              {localStorage.isAuthenticated == 0 ? (
                <Typography variant="h5">{errors}</Typography>
              ) : localStorage.isAuthenticated == 1 ? (
                <Typography variant="h5">Success!</Typography>
              ) : (
                ""
              )}
            </Grid>

            <Grid item className={classes.h2}>
              <TextField
                label="Username"
                id="username"
                onChange={(event) => setUsernameReg(event.target.value)}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Email"
                id="email"
                onChange={(event) => setEmailReg(event.target.value)}
              />
            </Grid>
            <Grid item>
              <TextField
                color="white"
                type="password"
                label="Password"
                id="password"
                onChange={(event) => setPasswordReg(event.target.value)}
              />
            </Grid>

            <Grid item className={classes.h2}>
              <Button
                variant="contained"
                color="white"
                className={classes.spacing}
                onClick={register}
              >
                Signup
              </Button>
              <p>
                Do you have an account? <br />
                <a style={{ color: "#82c0d9" }} href="/">
                  Sign in here
                </a>
              </p>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container className={classes.carStyle} lg={2}>
        <img src={Car} className={classes.carStyle} alt="shiptop car" />
      </Grid>
    </Grid>
  );
}
