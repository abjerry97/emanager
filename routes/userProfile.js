const Controller = require("../controllers/controller");
const express = require("express"); 
const { isAuth, travelMode } = require("../utils/Middleware/Middleware");

const profileRoute = express.Router();

profileRoute
  .route("/")
  .all((req, res, next) => {
    next();
  })
  .get((req, res, next) => {
    res.send("<h1>  profile  Estate Management </h1>");
  });



profileRoute.route("/edit").put(isAuth, travelMode, (req, res, next) => {
  return new Controller(req, res, next).editUserProfile();
});


profileRoute
  .route("/family/create")
  .post(isAuth, travelMode, (req, res, next) => {
    return new Controller(req, res, next).createFamilyMember();
  });

  

//  profileRoute
//   .route("/family/edit/:userId")
//   .put(isAuth, travelMode, (req, res, next) => {
//     return new Controller(req, res, next).editFamilyMember();
//   });



 profileRoute
  .route("/family/:userId")
  .delete(isAuth, travelMode, (req, res, next) => {
    return new Controller(req, res, next).deleteFamilyMember();
  });
  
   profileRoute
    .route("/family")
    .get(isAuth, travelMode, (req, res, next) => {
      return new Controller(req, res, next).getEstateFamilyMember();
    });

module.exports = { profileRoute };
