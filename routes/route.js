const express = require("express");

const bodyParser = require("body-parser");
const { doResearchFromHost } = require("../helpers/tools");
const { stringIsEqual } = require("../helpers/validators");
const { defaultRoute } = require("./default.js");
const { adminRoute } = require("./admin.js");
const { securityRoute } = require("./security");
const { portalDefaultRoute } = require("./portaldefault");
const isProduction = process.env.NODE_ENV == "production";
const router = express.Router();


  
router.use(async (req, res, next) => {
  const response = await new Promise((resolve) => {

    doResearchFromHost(req.headers.host, resolve);
  });
 const  { success, message, lastSubdomain } =response

    // adminRoute(true)(req, res, next);
    // portalDefaultRoute()(req, res, next);
        // securityRoute()(req, res, next);
 
if(!isProduction){

 if (!stringIsEqual(typeof lastSubdomain, "string")) {
    defaultRoute()(req, res, next);
  } else if (stringIsEqual(lastSubdomain, "admin")) {
    adminRoute(true)(req, res, next);
  }  else if (stringIsEqual(lastSubdomain, "security")) {
    securityRoute()(req, res, next);
  }  else if (stringIsEqual(lastSubdomain, "portal")) {
    portalDefaultRoute()(req, res, next);
  } else {
    defaultRoute(false)(req, res, next);
  
  }}
  


else{
   
 if (!stringIsEqual(req.headers.host.split(".")[0], "emanager")) {
  defaultRoute()(req, res, next);
} else if (stringIsEqual(req.headers.host.split(".")[0], "emanager-admin")) {
  adminRoute(true)(req, res, next);
}  else if (stringIsEqual(req.headers.host.split(".")[0], "emanager-security")) {
  securityRoute()(req, res, next);
}  else if (stringIsEqual(req.headers.host.split(".")[0], "emanager-webportal")) {
  portalDefaultRoute()(req, res, next);
} else {
  defaultRoute(false)(req, res, next);

}
}
});

module.exports = router;
