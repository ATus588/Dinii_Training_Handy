import { ERole } from "@/gql/schema";
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";

export interface IJwtPayload {
  uid: number;
  eml: string;
  rol: ERole;
  iat: number;
  exp: number;
}

let inMemoryToken: string | null = null;
let refreshTokenTimeoutId: number | null = null;
let userId: number | null = null;

const getToken = () => inMemoryToken;

const getUserId = () => userId;

const setToken = (accessToken: string) => {
  inMemoryToken = accessToken;

  // Decode and set countdown to refresh
  const decoded = jwtDecode<IJwtPayload>(accessToken);
  userId = decoded.uid;
  setRefreshTokenTimeout((decoded.exp as number) - (decoded.iat as number));
  return true;
};

const abortRefreshToken = () => {
  if (refreshTokenTimeoutId) window.clearTimeout(refreshTokenTimeoutId);
};

const deleteToken = () => {
  inMemoryToken = null;
  abortRefreshToken();
  return true;
};

const getRefreshToken = async () => {
  try {
    const response = await fetch("http://localhost:3008/refresh-token", {
      credentials: "include",
    });
    const data = (await response.json()) as {
      success: boolean;
      accessToken: string;
    };

    setToken(data.accessToken);
    return true;
  } catch (error) {
    console.log("UNAUTHENTICATED", error);
    deleteToken();
    return false;
  }
};

const setRefreshTokenTimeout = (delay: number) => {
  // 5s before token expires
  refreshTokenTimeoutId = window.setTimeout(
    getRefreshToken,
    delay * 1000 - 5000
  );
};

const JWTManager = {
  getToken,
  setToken,
  getRefreshToken,
  deleteToken,
  getUserId,
};

export default JWTManager;
