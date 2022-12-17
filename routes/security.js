const express = require("express");
const Controller = require("../controllers/controller"); 
const { isSecurity } = require("../utils/Middleware/Middleware");
function securityRoute() {
  const router = express.Router();
  router
    .route("/")
    .all((req, res, next) => {
      res.statusCode = 200;
      next();
    })
    .get((req, res, next) => {
      res.send("<h1> Welcome to Security App </h1>");
    });
  
  router.route("/login").post((req, res, next) => {
    return new Controller(req, res, next).securityLogin();
  });
  router.route("/estates").get((req, res, next) => {
    return new Controller(req, res, next).findEstates();
  });
  
  router.route("/pass/check").post(isSecurity, (req, res, next) => {
    return new Controller(req, res, next).checkPass();
  });
  router.route("/pass/:passId/confirm").post(isSecurity, (req, res, next) => {
    return new Controller(req, res, next).confirmPass();
  });


  
  return router;
}
module.exports = { securityRoute };
