import Axios from "axios";
import config from './../config/index';

export default Axios.create({
   baseURL: "http://localhost:5001",
  //baseURL: `${config.API_ROOT}`,
  //baseURL : "http://localhost:5001"
});


