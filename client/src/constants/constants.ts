const DEV_MODE =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development";

// Change domain and port for production
export const SERVER_DOMAIN = DEV_MODE ? "localhost" : "localhost";
export const SERVER_PORT = DEV_MODE ? "8080" : "8080";

export const SERVER_URL = `http://${SERVER_DOMAIN}:${SERVER_PORT}`;
export const API_URL = `${SERVER_URL}/api`;
export const INFO_URL = `${SERVER_URL}/info`;
