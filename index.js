const isProduction = process.env.NODE_ENV == "production";

require("dotenv").config();
const express = require("express"),
  cookieParser = require("cookie-parser"),
  compression = require("compression"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  cors = require("cors");
const router = require("./routes/route");
const app = express();
const path = require("path");
const {
  verifyEmail,
  invalidatePass, 
} =require("./crons");
const domainName = process.env.DOMAIN_NAME || "localhost:1200";
global.appData = {
  domainName,
  isProduction,
};
global.saltRounds = 10;
global.generalSessionDomain = "." + domainName;
global.generalCookie = {
  path: "/",
  httpOnly: true,
  expires: new Date(253402300000000),
  domain: generalSessionDomain,
};
const port = process.env.PORT || 3000;
const dbHost = process.env.HOST || "localhost";
const dbName = process.env.DATABASE || "qpay-estate-management-app";
mongoose
  .connect(
    true
      ? `mongodb+srv://estate_management_app:management@cluster0.y1wve.mongodb.net/test2`
      : `mongodb://${dbHost}:27017/${dbName}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Successfully connected to database");
  })
  .catch((error) => {
    console.log("Database connection failed. exiting now....");
    console.error(error);
    process.exit(1);
  });
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
); 
// setInterval(invalidatePass, 1000);

app.use(bodyParser.json());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
const io = () => {};
app.use((req, res, next) => {
  res.removeHeader("x-powered-by");
  next();
});

app.use(cookieParser());
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "e-manager api",
      description: "custom api information",
      contact: {
        name: "amazing developer",
      },
      servers: ["https://qpayestatemanagementapp.herokuapp.com/"],
    },
  },
  // [".routes/*.js"]
  apis: ["./docs/user/*.js"],
};
const swaggerOptions1 = {
  swaggerDefinition: {
    info: {
      title: "e-manager api",
      description: "custom api information",
      contact: {
        name: "amazing developer",
      },
      servers: ["https://qpayestatemanagementapp.herokuapp.com/"],
    },
  },
  // [".routes/*.js"]
  apis: ["./docs/admin/*.js"],
};
const swaggerOptions2 = {
  swaggerDefinition: {
    info: {
      title: "e-manager api",
      description: "custom api information",
      contact: {
        name: "amazing developer",
      },
      servers: ["https://qpayestatemanagementapp.herokuapp.com/"],
    },
  },
  // [".routes/*.js"]
  apis: ["./docs/portal/*.js"],
};
const swaggerOptions3 = {
  swaggerDefinition: {
    info: {
      title: "e-manager api",
      description: "custom api information",
      contact: {
        name: "amazing developer",
      },
      servers: ["https://qpayestatemanagementapp.herokuapp.com/"],
    },
  },
  // [".routes/*.js"]
  apis: ["./docs/security/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
const swaggerDocs1 = swaggerJsDoc(swaggerOptions1);
const swaggerDocs2 = swaggerJsDoc(swaggerOptions2);
const swaggerDocs3 = swaggerJsDoc(swaggerOptions3);
// app.use("/security/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs3));

// app.use("/resident/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// app.use("/admin/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs1));
// app.use("/portal/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs2));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
var dir = path.join(__dirname, "/");

app.use(express.static(dir));
app.use(router);

app.listen(port, () => {
  console.log("server running at " + port);
});
