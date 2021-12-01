const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const { createProxyMiddleware } = require("http-proxy-middleware");

// Create Express Server
const app = express();
var csrfProtection = csrf({ cookie: true });
var parseForm = bodyParser.urlencoded({ extended: false });
app.use(cookieParser());
app.use(cors());

// Configuration
const PORT = process.env.PORT || 5000;
const HOST = "localhost";
const API_SERVICE_URL = "https://paywithracks.herokuapp.com/racksapi/v1/";
let DynamicUrl = "https://wwww.google.com";

// Logging
app.use(morgan("dev"));

const updateQueryStringParameter = (path, key, value) => {
  const re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  const separator = path.indexOf("?") !== -1 ? "&" : "?";
  if (path.match(re)) {
    return path.replace(re, "$1" + key + "=" + value + "$2");
  } else {
    return path + separator + key + "=" + value;
  }
};

const customQueryAdder = (path) => {
  const splitter = path.split("?");
  const url = splitter[0];
  const params = new URLSearchParams(path);
  for (const [key, value] of params) {
  }
};

app.get("/convert/:amount/:to/:from", (req, res) => {});
// Proxy endpoints
app.use((req, res, next) => {
  DynamicUrl = req.headers.location;
  delete req.headers.location;
  console.log("Destination ", DynamicUrl);
  app.use(
    "*",
    /* parseForm,
    csrfProtection, */
    createProxyMiddleware({
      target: DynamicUrl,
      changeOrigin: true,
      ws: true,
      logLevel: "debug",
      /* pathRewrite: (path, req) => {
        console.log("console logging anything", path, req.originalUrl);
        return path;
      }, */
    })
  );
  next();
});

// Start Proxy
app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
