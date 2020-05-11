require("dotenv").config();

module.exports = {
  env: {
    API_URL: process.env.API_URL,
    WEBSOCKET_PORT: process.env.WEBSOCKET_PORT
  }
};
