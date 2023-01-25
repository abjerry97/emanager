const Controller = require("../controllers/controller");
const express = require("express");  
const portalConfig = require("../config/portalConfig.json"); 
const router = express.Router(); 
const upload = require("../helpers/multer");
const path = require("path");
const fs = require("fs");
const UserWalletTransaction = require("../model/emanager-user-wallet-transaction");
const  Bills = require("../model/bills");
const  Name = require("../model/name");
const BillPaymentHistory = require("../model/bill-payment-history");
const UserEstate = require("../model/user-estate");
const Admin = require("../model/admin");
const {isPortalUser} = require("../utils/Middleware/Middleware");
const { 
  isValidMongoObject,
  isValidMongoObjectId, 
  isValidArrayOfMongoObject, 
} = require("../helpers/validators");
function portalDefaultRoute() {
  router
    .route("/")
    .all((req, res, next) => {
      next();
    })
    .get((req, res, next) => {
      res.send(`<h1> Welcome emanager web portal</h1>`);
    });

  router.route("/register").post((req, res, next) => {
    return new Controller(req, res, next).portalUserRegister();
  });

  router.route("/login").post((req, res, next) => {
    return new Controller(req, res, next).portalUserLogin();
  });

  router.route("/config").get((req, res, next) => {
    return res.json(portalConfig);
  });

  router.route("/overview").get(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).portalOverview();
  }); 
  router.route("/estate").post((req, res, next) => {
    return new Controller(req, res, next).createEstate();
  });

  router.route("/estates").get((req, res, next) => {
    return new Controller(req, res, next).findEstates();
  });

  router.route("/admins/create").post(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).adminCreate();
  });

  router.route("/admins").get(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).getAdmins();
  });

  router.route("/admins/:adminId").get(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).getAdmin();
  });

  router
    .route("/admins/:adminId/details")
    .get(isPortalUser, (req, res, next) => {
      return new Controller(req, res, next).getAdminDetails();
    });

  router.route("/admins/:adminId").delete(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).deleteAdmin();
  });

  router.route("/admins/:adminId/edit").put(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).editAdmin();
  });

  router.route("/election/create").post(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).createElection();
  });

  router.route("/election/active").get(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).getActiveElections();
  });

  router
    .route("/election/candidate/create")
    .post(isPortalUser, (req, res, next) => {
      return new Controller(req, res, next).createElectionCandidate();
    });

  router
    .route("/election/candidate/active")
    .get(isPortalUser, (req, res, next) => {
      return new Controller(req, res, next).getActiveCandidates();
    });

  router.route("/election/candidate").get(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).getAllCandidates();
  });

  router.route("/election/end").get(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).endElection();
  });

  router.route("/admins/votes/result").get(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).getElectionResult();
  });

  router.route("/forum/create").post(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).adminCreateForum();
  });

  router.route("/bills").get(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).getBills();
  });
  router.route("/bills/create").post(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).createBills();
  });

  router.route("/bills/payment").get(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).adminGetUserBillPayments();
  });
  router.route("/bills/payment/:paymentId").get(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).adminGetUserParticularBillPayment();
  }); 

  router.route("/bills/:billId").get(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).getBill();
  });
  router.route("/bills/:billId/update").put(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).updateBill();
  });
  router.route("/bills/:billId/pay").post(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).userPayBills();
  });
  router.route("/properties/delete").delete(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).deleteEstateProperty();
  });
  router.route("/properties").get(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).getProperty();
  });

  router.route("/business").get(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).getBusiness();
  });
  router
    .route("/business/:businessId/delete")
    .delete(isPortalUser, (req, res, next) => {
      return new Controller(req, res, next).deleteBusiness();
    });
  router.route("/business/:businessId").get(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).getParticularBusiness();
  });
   
  
  router.route("/business/ads/post/price").get((req, res, next) => {
    return new Controller(req, res, next).getBusinessPostPrice();
  }); 
  router.route("/business/ads/post/price/update").put(isPortalUser,(req, res, next) => {
    return new Controller(req, res, next).updateBusinessPostPrice();
  });
  router.route("/services").get(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).getServices();
  });

  router
    .route("/services/:serviceId/delete")
    .delete(isPortalUser, (req, res, next) => {
      return new Controller(req, res, next).deleteService();
    });

    router.route("/service/ads/post/price").get((req, res, next) => {
      return new Controller(req, res, next).getServicePostPrice();
    }); 
    router.route("/service/ads/post/price/update").put(isPortalUser,(req, res, next) => {
      return new Controller(req, res, next).updateServicePostPrice();
    });
  router.route("/service/:serviceId/").get(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).getParticularService();
  });
  router.route("/foods").get(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).getFoods();
  });
  router.route("/foods/delete").delete(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).deleteFood();
  });
  
  router.route("/food/ads/post/price").get((req, res, next) => {
    return new Controller(req, res, next).getFoodPostPrice();
  }); 
  router.route("/food/ads/post/price/update").put(isPortalUser,(req, res, next) => {
    return new Controller(req, res, next).updateFoodPostPrice();
  });
  router.route("/foods/:foodId").get(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).findFoodByID();
  });
  router.route("/goods").get(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).getGoods();
  });
  router.route("/goods/delete").delete(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).deleteGood();
  });
  router.route("/goods/goodId").delete(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).findGoodByID();
  });

  router.route("/goods/:goodId").get(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).findGoodByID();
  });

  router.route("/good/ads/post/price").get((req, res, next) => {
    return new Controller(req, res, next).getGoodPostPrice();
  }); 
  router.route("/good/ads/post/price/update").put(isPortalUser,(req, res, next) => {
    return new Controller(req, res, next).updateGoodPostPrice();
  }); 
  router.route("/house/add").post(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).createHouse();
  });
  router.route("/houses").get(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).getHouses();
  });
  router
    .route("/houses/:houseId/delete")
    .delete(isPortalUser, (req, res, next) => {
      return new Controller(req, res, next).deleteEstateHouse();
    });

  router
    .route("/property/ads/create")
    .post(isPortalUser, upload.array("image", 14), (req, res, next) => {
      return new Controller(req, res, next).createPostAd();
    });
    router.route("/property/ads").get((req, res, next) => {
      return new Controller(req, res, next).findAllPostAd();
    });
    router.route("/property/ads/:propertyId/approve").put(isPortalUser,(req, res, next) => {
      return new Controller(req, res, next).adminApproveProperty();
    });
  
  router.route("/property/ads/:propertyAdId").get((req, res, next) => {
    return new Controller(req, res, next).findPropertyAdsByID();
  });


  
  router.route("/property/ads/post/price").get((req, res, next) => {
    return new Controller(req, res, next).getPropertyPostPrice();
  }); 
  router.route("/property/ads/post/price/update").put(isPortalUser,(req, res, next) => {
    return new Controller(req, res, next).updatePropertyPostPrice();
  });

  
  router.route("/property/checkout").post(isPortalUser,(req, res, next) => {
    return new Controller(req, res, next).confirmPostAdCheckout();
  }); 
  
  
  router.route("/user/properties").get(isPortalUser,(req, res, next) => {
    return new Controller(req, res, next).getUserProperties();
  });

  router.route("/user/property/ads").get(isPortalUser,(req, res, next) => {
    return new Controller(req, res, next).getUserPropertyAds();
  });

  router.route("/user/property/:propertyId").get(isPortalUser,(req, res, next) => {
    return new Controller(req, res, next).getUserParticularProperty();
  });

  router.route("/user/property/ads/:propertyAdId").get(isPortalUser,(req, res, next) => {
    return new Controller(req, res, next).getUserParticularPropertyAd();
  });

  router.route("/user/property/ads/:propertyAdId/publish").put(isPortalUser,(req, res, next) => {
    return new Controller(req, res, next).publishPropertyAd();
  });



  router.route("/properties").get(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).getProperty();
  });

  router
    .route("/properties/:propertyId")
    .get(isPortalUser, (req, res, next) => {
      return new Controller(req, res, next).findPropertyByID();
    });

  router.route("/bills").get(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).getBill();
  });

  router.route("/bill/create").post(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).createBills();
  });

  router
    .route("/bill/:billType/:billId/update")
    .put(isPortalUser, (req, res, next) => {
      return new Controller(req, res, next).updateBill();
    });


    router
    .route("/wallet/balance")
    .get(isPortalUser, (req, res, next) => {
      return new Controller(req, res, next).getWalletBalance();
    });
    router
    .route("/estate/wallet/balance")
    .get(isPortalUser, (req, res, next) => {
      return new Controller(req, res, next).getEstateWalletBalance();
    });

    router.route("/estate/wallet/transaction").get(isPortalUser, (req, res, next) => {
      return new Controller(req, res, next).viewEmanagerEstateTransaction();
    });
  
    router.route("/estate/wallet/transaction/:transactionId").get(isPortalUser, (req, res, next) => {
      return new Controller(req, res, next).viewParticularEmanagerEstateTransaction();
    });
  
     
    router.route("/estate/wallet/transaction").get(isPortalUser, (req, res, next) => {
      return new Controller(req, res, next).viewEmanagerEstateTransaction();
    });
  
    router.route("/banks").get(isPortalUser, (req, res, next) => {
      return new Controller(req, res, next).getBanks();
    });
    router.route("/transaction/account/verify").post(isPortalUser, (req, res, next) => {
      return new Controller(req, res, next).verifyBankAccount();
    });
  
    router.route("/transaction/account/transfer").post(isPortalUser, (req, res, next) => {
      return new Controller(req, res, next).__transferFundsFromEstateWalletToBankAccount();
    });
  
     
   
  return router;
}
module.exports = { portalDefaultRoute };
