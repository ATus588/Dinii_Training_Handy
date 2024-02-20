import JWTManager from "./jwt";
/* eslint-disable no-param-reassign */
import axios from "axios";

const axiosJWT = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosJWT.interceptors.request.use(
  async (config: any) => {
    const accessToken = JWTManager.getToken();

    config.headers.authorization = accessToken ? `Bearer ${accessToken}` : "";

    return config;
  },
  (err) => Promise.reject(err)
);

export default axiosJWT;
