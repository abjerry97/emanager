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
  router.route("/business/ads/post/price/create").post((req, res, next) => {
    return new Controller(req, res, next).createBusinessPostPrice();
  });
  router.route("/business/ads/post/price/update").put((req, res, next) => {
    return new Controller(req, res, next).updateBusinessPostPrice();
  });
  router.route("/service/ads/post/price/create").post((req, res, next) => {
    return new Controller(req, res, next).createServicePostPrice();
  });
  router.route("/service/ads/post/price/update").put((req, res, next) => {
    return new Controller(req, res, next).updateServicePostPrice();
  });
  router.route("/services").get(isPortalUser, (req, res, next) => {
    return new Controller(req, res, next).getServices();
  });

  router
    .route("/services/:serviceId/delete")
    .delete(isPortalUser, (req, res, next) => {
      return new Controller(req, res, next).deleteService();
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

  router.route("/property/ads/:propertyAdId").get((req, res, next) => {
    return new Controller(req, res, next).findPropertyAdsByID();
  });
  router.route("/property/ads/post/price/create").post((req, res, next) => {
    return new Controller(req, res, next).createPropertyPostPrice();
  });
  router.route("/property/ads/post/price/update").put((req, res, next) => {
    return new Controller(req, res, next).updatePropertyPostPrice();
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
  
    
    
  // ###################### to remove
  router
    .route("/properties/update/special")
    .put(isPortalUser, (req, res, next) => {
      return new Controller(req, res, next).updatePropertyAd();
    });

    router.route("/xxx").post(isPortalUser, async (req, res, next) => {
      const billHistory = await BillPaymentHistory.find({})
      if(!isValidArrayOfMongoObject(billHistory)){
        res.json({})
      }
    const billHistoryUpdates = await Promise.all(
      (billHistory || []).map(async (particularBillHistory, index) => {
        if (isValidMongoObject(particularBillHistory)) {
          const estateBill = await Bills.findOne({
            status: 1,
            _id: particularBillHistory.billId, 
          }); 
          if (isValidMongoObject(estateBill)) {
          
   
              const foundownerName = await Name.findOne({
                ownerId: particularBillHistory.createdBy
              })

              let ownerName = ""
              if (isValidMongoObject(foundownerName)) {
                ownerName = foundownerName.value
              }
            const newBillPaymentTransaction =  await new UserWalletTransaction({
              status:1, 
              type: estateBill.type,
              isEstate: 1,
              name: ownerName,
              estateId: estateBill.estateId,
              amount:particularBillHistory.amount,
              isDebit: true,
              ownerId: particularBillHistory.createdBy,
              message: "test test",    
              createdOn:particularBillHistory.createdOn,
            })
            if (!isValidMongoObject(newBillPaymentTransaction)) {
               res.statusCode = 500;
              return  res.json({
                success: false,
                message: "Error initiating transaction, try again",
              });
          
            }



              await newBillPaymentTransaction.save()










         
      
        
 
          }
        }
      })
    );


    return res.json({
      success:true
    });
  });
  router.route("/xxx1").post(isPortalUser, async (req, res, next) => {
      const billHistory = await Admin.find({})
      if(!isValidArrayOfMongoObject(billHistory)){
        res.json({})
      }
    const billHistoryUpdates = await Promise.all(
      (billHistory || []).map(async (particularBillHistory, index) => {
        if (isValidMongoObject(particularBillHistory)) {
          const estateBill = await UserEstate.findOne({
            status: 1,
            ownerId: particularBillHistory._id, 
          }); 
          if (isValidMongoObject(estateBill)) {


 






            try {
              const updateEmail = await Admin.updateOne(
                {
                  status: 1,   
                  _id: particularBillHistory._id,
                },
                {
                  $set: {   estateId: estateBill.estateId },
                }
              );
            } catch (err) {
              console.log(err);
            }
      
        
 
          }
        }
      })
    );


    return res.json({
      success:true
    });
  });
  
  // router.route("/asasasas").put(isPortalUser, async (req, res, next) => {
  //   try {
  //     const newBills = await UserBillLinking.updateMany(
  //       {
  //         status: 1,
  //         type: "1",
  //       }, {

  //         $set: { type: "estate levy"},
  //       $push: {
  //         updates: [
  //           {
  //             // by: adminId, // admin ID of the user who made this update
  //             action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
  //             timing: new Date(),
  //           },
  //         ],
  //       }
  //       }
  //     );
  //     console.log(newBills);
  //   } catch (err) {
  //     console.log(err);
  //   }

  //   return res.json({
  //     status: 1,
  //   });
  // });

  return router;
}
module.exports = { portalDefaultRoute };
