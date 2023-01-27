const express = require("express");
const Controller = require("../controllers/controller");
const { guestRoute } = require("./guest");

const { isAdmin, travelMode } = require("../utils/Middleware/Middleware");

function adminRoute(isAdminStatus) {
  const router = express.Router();
  if (isAdminStatus) {
    router
      .route("/")
      .all((req, res, next) => {
        res.statusCode = 200;
        next();
      })
      .get((req, res, next) => {
        res.send("<h1> Welcome to Admin App  </h1>");
      });

    router.route("/info").get(isAdmin, travelMode, (req, res, next) => {
      return new Controller(req, res, next).adminInfo();
    });

    router.route("/login").post((req, res, next) => {
      return new Controller(req, res, next).adminLogin();
    });

    router.route("/estate").post((req, res, next) => {
      return new Controller(req, res, next).createEstate();
    });

    router.route("/estates").get((req, res, next) => {
      return new Controller(req, res, next).findEstates();
    });

    router
      .route("/admins/create")
      .post(isAdmin, travelMode, (req, res, next) => {
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

    router.route("/bills").get(isAdmin, (req, res, next) => {
      return new Controller(req, res, next).getBills();
    });
    router.route("/bills/create").post(isAdmin, (req, res, next) => {
      return new Controller(req, res, next).createBills();
    });

    router.route("/bills/payment").get(isAdmin, (req, res, next) => {
      return new Controller(req, res, next).adminGetUserBillPayments();
    });
    router.route("/bills/payment/:paymentId").get(isAdmin, (req, res, next) => {
      return new Controller(req, res, next).adminGetUserParticularBillPayment();
    });

    router.route("/bills/:billId").get(isAdmin, (req, res, next) => {
      return new Controller(req, res, next).getBill();
    });
    router.route("/bills/:billId/update").put(isAdmin, (req, res, next) => {
      return new Controller(req, res, next).updateBill();
    });
    router.route("/bills/:billId/pay").post(isAdmin, (req, res, next) => {
      return new Controller(req, res, next).userPayBills();
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
    router
      .route("/business/:businessId/delete")
      .delete(isAdmin, (req, res, next) => {
        return new Controller(req, res, next).deleteBusiness();
      });
    router.route("/business/:businessId").get(isAdmin, (req, res, next) => {
      return new Controller(req, res, next).getParticularBusiness();
    });

    router.route("/business/ads/post/price").get((req, res, next) => {
      return new Controller(req, res, next).getBusinessPostPrice();
    });
    router
      .route("/business/ads/post/price/update")
      .put(isAdmin, (req, res, next) => {
        return new Controller(req, res, next).updateBusinessPostPrice();
      });

    router.route("/services").get(isAdmin, (req, res, next) => {
      return new Controller(req, res, next).getServices();
    });

    router
      .route("/services/:serviceId/delete")
      .delete(isAdmin, (req, res, next) => {
        return new Controller(req, res, next).deleteService();
      });

    router.route("/service/ads/post/price").get((req, res, next) => {
      return new Controller(req, res, next).getServicePostPrice();
    });
    router
      .route("/service/ads/post/price/update")
      .put(isAdmin, (req, res, next) => {
        return new Controller(req, res, next).updateServicePostPrice();
      });
    router.route("/service/:serviceId/").get(isAdmin, (req, res, next) => {
      return new Controller(req, res, next).getParticularService();
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
    router
      .route("/houses/:houseId/delete")
      .delete(isAdmin, (req, res, next) => {
        return new Controller(req, res, next).deleteEstateHouse();
      });
    router.route("/wallet/balance").get(isAdmin, (req, res, next) => {
      return new Controller(req, res, next).getWalletBalance();
    });
    router
      .route("/estate/wallet/transaction")
      .get(isAdmin, (req, res, next) => {
        return new Controller(req, res, next).viewEmanagerEstateTransaction();
      });

    router
      .route("/estate/wallet/transaction/:transactionId")
      .get(isAdmin, (req, res, next) => {
        return new Controller(
          req,
          res,
          next
        ).viewParticularEmanagerEstateTransaction();
      });

    router
      .route("/estate/wallet/transaction")
      .get(isAdmin, (req, res, next) => {
        return new Controller(req, res, next).viewEmanagerEstateTransaction();
      });

    router.route("/banks").get(isAdmin, (req, res, next) => {
      return new Controller(req, res, next).getBanks();
    });
    router
      .route("/transaction/account/verify")
      .post(isAdmin, (req, res, next) => {
        return new Controller(req, res, next).verifyBankAccount();
      });

    router
      .route("/transaction/account/transfer")
      .post(isAdmin, (req, res, next) => {
        return new Controller(
          req,
          res,
          next
        ).__transferFundsFromEstateWalletToBankAccount();
      });
  }
  return router;
}

module.exports = { adminRoute };
