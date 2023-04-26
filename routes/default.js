const Controller = require("../controllers/controller");
const express = require("express");
const { guestRoute } = require("./guest");
const config = require("../config/config.json");
const { profileRoute } = require("./userProfile");
const router = express.Router();

const upload = require("../helpers/multer");
const path = require("path");
const fs = require("fs");
const { isAuth, travelMode } = require("../utils/Middleware/Middleware");
const scheamaTools = require("../helpers/scheamaTools");
const { validateEstateName,validateEstateQueryParams, validateCreateUser, validateUserLogin } = require("../utils/Validators/Validators");
const { verifyEmail } = require("../crons");

function defaultRoute() {
  
setInterval(verifyEmail, 1000);
  router
    .route("/")
    .all((req, res, next) => {
      next();
    })
    .get(async (req, res, next) => { 
      res.send("<h1> Welcome to E manager resident </h1>");
    });
    
    router.route("/info").get(isAuth, travelMode, (req, res, next) => {
      return new Controller(req, res, next).userInfo();
    });
 

  router.route("/estate").post(validateEstateName,(req, res, next) => {
    return new Controller(req, res, next).createEstate();
  });

  router.route("/estates").get(validateEstateQueryParams,(req, res, next) => {
    return new Controller(req, res, next).findEstates();
  });

  router.route("/register").post(validateCreateUser,(req, res, next) => {
    return new Controller(req, res, next).userRegister();
  });

  router.route("/login").post(validateUserLogin,(req, res, next) => {
    return new Controller(req, res, next).userLogin();
  });

  router
    .route("/topmost/onboard")
    .post(isAuth, travelMode, (req, res, next) => {
      return new Controller(req, res, next).createTopmostAdmin();
    });

  router.route("/travel").put(isAuth, (req, res, next) => {
    return new Controller(req, res, next).toggleTravelMode();
  });

  router.route("/travel").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).getTravelMode();
  });

  router.route("/config").get(isAuth, (req, res, next) => {
    return res.json(config);
  });

  router.route("/user/estates").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).getAllUserEstates();
  });
  router.route("/user/estates/delete").delete(isAuth, (req, res, next) => {
    return new Controller(req, res, next).__deleteUserEstates();
  });


  router.route("/user/estates/current").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).getCurrentEstate();
  });
  
  router.route("/user/estates/add").post(isAuth, (req, res, next) => {
    return new Controller(req, res, next).addUserEstates();
  });

  router.route("/user/estates/change").post(isAuth, (req, res, next) => {
    return new Controller(req, res, next).switchUserEstates();
  });
  router.route("/family/create").post(isAuth, (req, res, next) => {
    return new Controller(req, res, next).createFamilyMember();
  });



  
  router
    .route("/election/candidate")
    .get(isAuth, travelMode, (req, res, next) => {
      return new Controller(req, res, next).getAllUserCandidates();
    });

  router
    .route("/election/candidate/vote")
    .post(isAuth, travelMode, (req, res, next) => {
      return new Controller(req, res, next).voteCandidate();
    });

  router
    .route("/business/create")
    .post(isAuth, travelMode, (req, res, next) => {
      return new Controller(req, res, next).createBusiness();
    });

  router
    .route("/business/default/image")
    .post(isAuth, upload.single("image"), (rq, res, next) => {
      return new Controller(req, res, next).addDefaultBusinessImage();
    });

  router
    .route("/business/:businessId/address/add")
    .post(isAuth, travelMode, (req, res, next) => {
      return new Controller(req, res, next).addBusinessAddress();
    });
  router
    .route("/business/:businessId/days/edit")
    .post(isAuth, travelMode, (req, res, next) => {
      return new Controller(req, res, next).addBusinessAddress();
    });

  router
    .route("/business/:businessId/image")
    .post(isAuth, upload.single("image"), (req, res, next) => {
      return new Controller(req, res, next).addBusinessImage();
    });

  router.route("/business/estate/:estateId").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).getEstateBusiness();
  });

  router.route("/business/:businessId").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).getParticularBusiness();
  });

  router.route("/business").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).getBusiness();
  });

  router.route("/service/create").post(isAuth, travelMode, (req, res, next) => {
    return new Controller(req, res, next).createService();
  });

  router
    .route("/service/default/image")
    .post(isAuth, upload.single("image"), (req, res, next) => {
      return new Controller(req, res, next).addDefaultServiceImage();
    });

  router
    .route("/service/:serviceId/image")
    .post(isAuth, upload.single("image"), (req, res, next) => {
      return new Controller(req, res, next).addServiceImage();
    });

  router.route("/service/estate/:estateId/").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).getEstateServices();
  });

  router.route("/service/:serviceId/").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).getParticularService();
  });

  router.route("/services").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).getServices();
  });

  router
    .route("/food/create")
    .post(isAuth, upload.array("image", 14), (req, res, next) => {
      return new Controller(req, res, next).addFood();
    });

  router.route("/foods").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).getFoods();
  });

  router.route("/food/search").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).findFood();
  });

  router.route("/food/:foodId/favourite/add").put(isAuth, (req, res, next) => {
    return new Controller(req, res, next).addFoodToFavourite();
  });

  router
    .route("/food/:foodId/favourite/remove")
    .put(isAuth, (req, res, next) => {
      return new Controller(req, res, next).removeFoodFromFavourite();
    });

  router.route("/food/favourites").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).getUserEstateFoodFavourite();
  });

  router.route("/foods/estate/:estateId").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).getEstateFoods();
  });

  router.route("/foods/:foodId").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).findFoodByID();
  });

  router.route("/foods/:foodId/rate").post(isAuth, (req, res, next) => {
    return new Controller(req, res, next).rateFood();
  });

  router
    .route("/good/create")
    .post(isAuth, upload.array("image", 14), (req, res, next) => {
      return new Controller(req, res, next).addGood();
    });

  router.route("/goods").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).getGoods();
  });

  router.route("/good/search").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).findGood();
  });

  router.route("/good/:goodId/favourite/add").put(isAuth, (req, res, next) => {
    return new Controller(req, res, next).addGoodToFavourite();
  });

  router
    .route("/good/:goodId/favourite/remove")
    .put(isAuth, (req, res, next) => {
      return new Controller(req, res, next).removeGoodFromFavourite();
    });

  router.route("/good/favourites").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).getUserEstateGoodFavourite();
  });

  router.route("/goods/estate/:estateId").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).getEstateGoods();
  });

  router.route("/goods/:goodId/rate").post(isAuth, (req, res, next) => {
    return new Controller(req, res, next).rateGood();
  });

  router.route("/goods/:goodId").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).findGoodByID();
  });

  router
    .route("/property/create")
    .post(isAuth, upload.single("image"), (req, res, next) => {
      return new Controller(req, res, next).addProperty();
    });

  router.route("/properties").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).getProperty();
  });

  router.route("/property/search").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).findProperty();
  });

  router
    .route("/property/:propertyId/favourite/add")
    .put(isAuth, (req, res, next) => {
      return new Controller(req, res, next).addPropertyToFavourite();
    });

  router
    .route("/property/:propertyId/favourite/remove")
    .put(isAuth, (req, res, next) => {
      return new Controller(req, res, next).removePropertyFromFavourite();
    });

  router.route("/property/favourites").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).getUserEstatePropertyFavourite();
  });

  router.route("/property/ads").get((req, res, next) => {
    return new Controller(req, res, next).findAllPostAd();
  });

  router.route("/property/ads/:propertyAdId").get((req, res, next) => {
    return new Controller(req, res, next).findPropertyAdsByID();
  });

  router.route("/properties/estate/:estateId").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).getEstateProperty();
  });

  router
    .route("/properties/:propertyId/rate")
    .post(isAuth, (req, res, next) => {
      return new Controller(req, res, next).rateProperty();
    });

  router.route("/properties/:propertyId").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).findPropertyByID();
  });

  router.route("/property/update").post(isAuth, (req, res, next) => {
    return new Controller(req, res, next).updateProperty();
  });
  router.route("/updates").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).getResidentUpdateCount();
  });

  router.route("/notice").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).userGetNotication();
  });

  router.route("/notice/linking").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).userGetNoticationLinking();
  });

  router.route("/notice/:noticeId").put(isAuth, (req, res, next) => {
    return new Controller(req, res, next).userReadNotice();
  });

  router
    .route("/suggestion/create")
    .post(isAuth, travelMode, (req, res, next) => {
      return new Controller(req, res, next).userCreateSuggestion();
    });

  router.route("/bill").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).getUserBillsLinking();
  });

  router.route("/bill/linking").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).getUserBillsLinking();
  });

  router.route("/bill/upcoming").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).getUserUpcomingBills();
  });
  router.route("/bill/:billId/pay").post(isAuth, (req, res, next) => {
    return new Controller(req, res, next).userPayBills();
  });

  router.route("/emergency").put(isAuth, (req, res, next) => {
    return new Controller(req, res, next).userActivateEmergency();
  });

  router.route("/services/wallet/onboard").post(isAuth, (req, res, next) => {
    return new Controller(req, res, next).createWallet();
  });

  router.route("/services/wallet/balance").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).getWalletBalance();
  });

  router.route("/transactions").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).getUserWalletTransaction();
  });

  router.route("/services/airtime/provider").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).getAirtimeProvider();
  });

  router.route("/services/airtime/request").post(isAuth, (req, res, next) => {
    return new Controller(req, res, next).buyAirtime();
  });

  router.route("/services/data/provider").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).getDataProviders();
  });

  router
    .route("/services/data/bundle/:serviceType")
    .post(isAuth, (req, res, next) => {
      return new Controller(req, res, next).listDataBundles();
    });

  router.route("/services/data/request").post(isAuth, (req, res, next) => {
    return new Controller(req, res, next).buyData();
  });

  router
    .route("/services/electricity/provider")
    .get(isAuth, (req, res, next) => {
      return new Controller(req, res, next).getElectricityProvider();
    });

  router
    .route("/services/electricity/request")
    .post(isAuth, (req, res, next) => {
      return new Controller(req, res, next).buyElectricity();
    });

  router.route("/services/cabletv/provider").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).getServicesCabletvProviders();
  });

  router
    .route("/services/multichoice/list/:serviceType")
    .post(isAuth, (req, res, next) => {
      return new Controller(req, res, next).getServicesCableTvMultichoiceList();
    });

  router
    .route("/services/multichoice/request")
    .post(isAuth, (req, res, next) => {
      return new Controller(req, res, next).subscribeCableTV();
    });

  router.route("/services/epin/provider").get(isAuth, (req, res, next) => {
    return new Controller(req, res, next).getServicesEpinProviders();
  });

  router
    .route("/services/epin/bundles/:serviceType")
    .post(isAuth, (req, res, next) => {
      return new Controller(req, res, next).getServicesEpinMultichoiceList();
    });

  router.route("/services/epin/request").post(isAuth, (req, res, next) => {
    return new Controller(req, res, next).subscribeEpin();
  });

  router.route("/user/account/verify/:token").get((req, res, next) => {
    return new Controller(req, res, next).verifyEmail();
  });

  // ########################### to remove   #################
  router.route("/good/specialupdate").put(isAuth, (req, res, next) => {
    return new Controller(req, res, next).specialUpdateonGood();
  });
  router.route("/food/specialupdate").put(isAuth, (req, res, next) => {
    return new Controller(req, res, next).__specialUpdateonFood();
  });

  router.use("/guest", guestRoute);
  router.use("/profile", profileRoute);

  return router;
}
module.exports = { defaultRoute };
