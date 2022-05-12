// import { Typography } from '@material-ui/core';
import { createTheme } from '@material-ui/core/styles';

export default createTheme({
  palette: {
    common: {
      mahmoolBlue: "#29467f",

    },
    primary: {
      main: "#82c0d9"
    },

    secondary: {
      main: "#29467f"
    },

    typography: {
      h5: {
        color: 'white'
      },
      tab: {
        fontFamily: "Raleway",
        textTransform: "none",
        fontWeight: "700",
        fontSize: "1rem"
      }

    },

  }



});