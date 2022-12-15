const express = require("express");
const Controller = require("../controllers/controller");
const { isAuth, isAdmin, travelMode } = require("../utils");
const { guestRoute } = require("./guest");

// const swaggerJsDoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");
// const swaggerOptions = {
//   swaggerDefinition: {
//     info: {
//       title: "e-manager api",
//       description: "custom api information",
//       contact: {
//         name: "amazing developer",
//       },
//       servers: ["https://qpayestatemanagementapp.herokuapp.com/"],
//     },
//   },
//   // [".routes/*.js"]
//   apis: ["./routes/admin.js"],
// };

// const swaggerDocs = swaggerJsDoc(swaggerOptions);
// router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// const swaggerJsDoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");
// const swaggerOptions = {
//   swaggerDefinition: {
//     info: {
//       title: "e-manager api",
//       description: "custom api information",
//       contact: {
//         name: "amazing developer",
//       },
//       servers: ["https://qpayestatemanagementapp.herokuapp.com/"],
//     },
//   },
//   // [".routes/*.js"]
//   apis: ["./docs/admin/*.js"],
// };
// const swaggerDocs = swaggerJsDoc(swaggerOptions);

function adminRoute(reeee) {
  const router = express.Router();

  // router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
 
    router
      .route("/")
      .all((req, res, next) => {
        res.statusCode = 200;
        next();
      })
      .get((req, res, next) => {
        res.send(reeee);
      });

    router.route("/info").get(isAdmin, travelMode, (req, res, next) => {
      return new Controller(req, res, next).adminInfo();
    });

    router.route("/login").post((req, res, next) => {
      return new Controller(req, res, next).adminLogin();
    });

    router.route("/estate").get((req, res, next) => {
      return new Controller(req, res, next).findEstate();
    });

    router.route("/estate").post((req, res, next) => {
      return new Controller(req, res, next).createEstate();
    });

    router.route("/estates").get((req, res, next) => {
      return new Controller(req, res, next).findEstates();
    });

    router.route("/create").post(isAdmin, travelMode, (req, res, next) => {
      return new Controller(req, res, next).adminCreate();
    });

    router
      .route("/security/create/")
      .post(isAdmin, travelMode, (req, res, next) => {
        return new Controller(req, res, next).createSecurity();
      });

    router.route("/admins").get(isAdmin, travelMode, (req, res, next) => {
      return new Controller(req, res, next).getAdmins();
    });

    router
      .route("/admins/:adminId")
      .get(isAdmin, travelMode, (req, res, next) => {
        return new Controller(req, res, next).getAdmin();
      });

    router
      .route("/admins/:adminId/details")
      .get(isAdmin, travelMode, (req, res, next) => {
        return new Controller(req, res, next).getAdminDetails();
      });

    router
      .route("/admins/:adminId")
      .delete(isAdmin, travelMode, (req, res, next) => {
        return new Controller(req, res, next).deleteAdmin();
      });

    router
      .route("/admins/:adminId/edit")
      .put(isAdmin, travelMode, (req, res, next) => {
        return new Controller(req, res, next).editAdmin();
      });

    router
      .route("/election/create")
      .post(isAdmin, travelMode, (req, res, next) => {
        return new Controller(req, res, next).createElection();
      });

    router
      .route("/election/active")
      .get(isAdmin, travelMode, (req, res, next) => {
        return new Controller(req, res, next).getActiveElections();
      });

    router
      .route("/election/candidate/create")
      .post(isAdmin, travelMode, (req, res, next) => {
        return new Controller(req, res, next).createElectionCandidate();
      });

    router
      .route("/election/candidate/active")
      .get(isAdmin, travelMode, (req, res, next) => {
        return new Controller(req, res, next).getActiveCandidates();
      });

    router
      .route("/election/candidate")
      .get(isAdmin, travelMode, (req, res, next) => {
        return new Controller(req, res, next).getAllCandidates();
      });

    router.route("/election/end").get(isAdmin, travelMode, (req, res, next) => {
      return new Controller(req, res, next).endElection();
    });

    router
      .route("/admins/votes/result")
      .get(isAdmin, travelMode, (req, res, next) => {
        return new Controller(req, res, next).getElectionResult();
      });

    router.route("/forum/create").post(isAdmin, (req, res, next) => {
      return new Controller(req, res, next).adminCreateForum();
    });

    router.route("/bill/create").post(isAdmin, (req, res, next) => {
      return new Controller(req, res, next).createBills();
    });

    router.route("/bill").get(isAdmin, (req, res, next) => {
      return new Controller(req, res, next).getBill();
    });

    router
      .route("/bill/:billType/:billId/update")
      .put(isAdmin, (req, res, next) => {
        return new Controller(req, res, next).updateBill();
      });

      router.route("/properties/delete").delete(isAdmin, (req, res, next) => {
        return new Controller(req, res, next).deleteEstateProperty();
      });
      router.route("/properties").get(isAdmin, (req, res, next) => {
        return new Controller(req, res, next).getProperty();
      });

      router.route("/business").get(isAdmin, (req, res, next) => {
        return new Controller(req, res, next).getBusiness();
      });
      router.route("/business/:businessId/delete").delete(isAdmin, (req, res, next) => {
        return new Controller(req, res, next).deleteBusiness();
      });


      
      router.route("/services").get(isAdmin, (req, res, next) => {
        return new Controller(req, res, next).getServices();
      });

      router.route("/services/:serviceId/delete").delete(isAdmin, (req, res, next) => {
        return new Controller(req, res, next).deleteService();
      });
    router.route("/foods").get(isAdmin, (req, res, next) => {
      return new Controller(req, res, next).getFoods();
    });
    router.route("/foods/delete").delete(isAdmin, (req, res, next) => {
      return new Controller(req, res, next).deleteEstateFood();
    });

    router.route("/goods").get(isAdmin, (req, res, next) => {
      return new Controller(req, res, next).getGoods();
    });
    router.route("/goods/delete").delete(isAdmin, (req, res, next) => {
      return new Controller(req, res, next).deleteGood();
    });
    router.route("/house/add").post(isAdmin, (req, res, next) => {
      return new Controller(req, res, next).createHouse();
    });
    router.route("/houses").get(isAdmin, (req, res, next) => {
      return new Controller(req, res, next).getHouses();
    });
    router.route("/houses/:houseId/delete").delete(isAdmin, (req, res, next) => {
      return new Controller(req, res, next).deleteEstateHouse();
    });
    
    // special

    router.route("/admin/user/update").put(isAdmin, (req, res, next) => {
      return new Controller(req, res, next).updateAdminUser();
    });

    router.route("/user/user/update").put(isAdmin, (req, res, next) => {
      return new Controller(req, res, next).updateAllUser();
    });

    // router.use("/guest", guestRoute);
 
  return router;
}

module.exports = { adminRoute };
