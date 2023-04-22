const { adminScheama } = require("../../helpers/projections");
const { isValidMongoObject, isValidMongoObjectId, stringIsEqual } = require("../../helpers/validators");
const Admin = require("../../model/admin");
const HouseAddressName = require("../../model/house-address");
const RegisteredEstate = require("../../model/registered-estate");
const Security = require("../../model/security");
const User = require("../../model/user");
const UserEstate = require("../../model/user-estate");
const UserFamily = require("../../model/user-family");
const UserMode = require("../../model/user-mode"); 
const { refreshUserUpdates, refreshAdminUpdates } = require("../utils");
const { checkWalletUserSession, checkEstateWalletSession } = require("../WalletTools/WalletTools");
const jwt = require("jsonwebtoken");

const isAdmin = async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization) {
      const token = authorization.slice(7, authorization.length);
      jwt.verify(
        token,
        process.env.JWT_SECRET || "qapitapay1",
        async (err, decode) => {
          if (err) {
            return res.status(401).send({ message: "Invalid Token" });
          } else {
            const foundEstate = await RegisteredEstate.findOne({
              _id: decode.estateId,
              status: 1,
              //  name: decode.name.value
            });
  
            if (!isValidMongoObject(foundEstate)) {
              return res.status(401).send({ message: "Incorrect estate" });
            }
  
            res.estate = foundEstate;
            const foundAdmin = await Admin.findOne(
              {
                _id: decode._id,
                status: 1,
                //  name: decode.name.value
              },
              adminScheama
            );
            if (!isValidMongoObject(foundAdmin)) {
              return res.status(401).send({ message: "Incorrect details" });
            }
            res.admin = foundAdmin;
            const foundUser = await User.findOne({
              _id: decode.userId,
              status: 1,
              //  name: decode.name.value
            });
            if (!isValidMongoObject(foundUser)) {
              return res.status(401).send({ message: "Incorrect details " });
            }
            const existingUserWalletSession = await checkWalletUserSession(foundUser);
            if (isValidMongoObject(existingUserWalletSession)) {
              res.userWalletSessionToken = existingUserWalletSession.sessionToken;
            }
            res.user = foundUser;
            // next();

            refreshAdminUpdates(req, res, next)
          }
        }
      );
    } else {
      return res.status(401).send({ message: "No Token" });
    }
  };
  const isSecurity = async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization) {
      const token = authorization.slice(7, authorization.length);
      jwt.verify(
        token,
        process.env.JWT_SECRET || "qapitapay1",
        async (err, decode) => {
          if (err) {
            return res.status(401).send({ message: "Invalid Token" });
          } else {
            const foundEstate = await RegisteredEstate.findOne({
              _id: decode.estateId,
              status: 1,
              //  name: decode.name.value
            });
  
            if (!isValidMongoObject(foundEstate)) {
              return res.status(401).send({ message: "Incorrect estate" });
            }
  
            res.estate = foundEstate;
            const foundSecurity = await Security.findOne({
              _id: decode._id,
              status: 1,
              //  name: decode.name.value
            });
            if (!isValidMongoObject(foundSecurity)) {
              return res.status(401).send({ message: "Incorrect details" });
            }
            res.security = foundSecurity;
  
            next();
          }
        }
      );
    } else {
      return res.status(401).send({ message: "No Token" });
    }
  };
  
  const isPortalUser = async (req, res, next) => { 
    const authorization = req.headers.authorization;
    if (authorization) {
      const token = authorization.slice(7, authorization.length);
      jwt.verify(
        token,
        process.env.JWT_SECRET || "qapitapay1",
        async (err, decode) => {
          if (err) {
            return res.status(401).send({ message: "Invalid Token" });
          } else {
            const foundPortalUser = await User.findOne({
              _id: decode._id,
              status: 1,
              //  name: decode.name.value
            });
            if (!isValidMongoObject(foundPortalUser)) {
              return res.status(401).send({ message: "Incorrect details" });
            }
  
            const existingUserWalletSession = await checkWalletUserSession(
              foundPortalUser
            );
            if (isValidMongoObject(existingUserWalletSession)) {
              res.userWalletSessionToken = existingUserWalletSession.sessionToken;
            }
            res.user = foundPortalUser; 
            const foundAdmin = await Admin.findOne(
              {
                userId: decode._id,
                status: 1,
                //  name: decode.name.value
              },
              adminScheama
            ); 
            if (isValidMongoObject(foundAdmin)) {
              res.admin = foundAdmin;
  
              const foundAdminEstate = await UserEstate.findOne({
                ownerId: foundAdmin._id,
                // ownerType:1,
                status: 1,
                //  name: decode.name.value
              });
              if (isValidMongoObject(foundAdminEstate)) {
                const foundAdminRegisteredEstate = await RegisteredEstate.findOne(
                  {
                    _id: foundAdminEstate.estateId,
                    status: 1,
                    //  name: decode.name.value
                  }
                );
  
                if (isValidMongoObject(foundAdminRegisteredEstate)) {
                  res.estate = foundAdminRegisteredEstate;
  
                  const existingEstateWalletSession =
                    await checkEstateWalletSession(foundAdminRegisteredEstate);
                  if (isValidMongoObject(existingEstateWalletSession)) {
                    res.estateWalletSessionToken =
                      existingEstateWalletSession.sessionToken;
                  }
                }
              }
            }
            next();
          }
        }
      );
    } else {
      return res.status(401).send({ message: "No Token" });
    }
  };

  
const isAuth = async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization) {
      const token = authorization.slice(7, authorization.length);
      jwt.verify(
        token,
        process.env.JWT_SECRET || "qapitapay1",
        async (err, decode) => {
          if (err) {
            return res.status(401).send({ message: "Invalid Token" });
          } else {
            const foundEstate = await RegisteredEstate.findOne({
              _id: decode.estateId,
              status: 1,
              //  name: decode.name.value
            });
  
            if (!isValidMongoObject(foundEstate)) {
              return res.status(401).send({ message: "Incorrect estate" });
            }
  
            res.estate = foundEstate;
            const foundUser = await User.findOne({
              _id: decode._id,
              status: 1,
              //  name: decode.name.value
            });
            if (!isValidMongoObject(foundUser)) {
              return res.status(401).send({ message: "Incorrect details " });
            }
  
            const existingUserWalletSession = await checkWalletUserSession(foundUser);
            if (isValidMongoObject(existingUserWalletSession)) {
              res.userWalletSessionToken = existingUserWalletSession.sessionToken;
            }
            res.user = foundUser;
  
            const foundUserFamily = await UserFamily.findOne({
              status: 1,
              ownerId: foundUser._id,
              estateId: decode.estateId,
              //  name: decode.name.value
            });
  
            if (!isValidMongoObject(foundUserFamily)) {
              return res
                .status(401)
                .send({ message: "Incorrect User Family data " });
            }
            res.userFamily = foundUserFamily;
            let foundHouseAddressName = await HouseAddressName.findOne({
              status: 1,
              ownerId: foundUser._id,
              estateId: decode.estateId,
              //  name: decode.name.value
            });
  
            if (!isValidMongoObject(foundHouseAddressName)) {
              foundHouseAddressName = await HouseAddressName.findOne({
                status: 1,
                ownerId: foundUserFamily.createdBy,
                estateId: decode.estateId,
                //  name: decode.name.value
              });
  
              if (!isValidMongoObject(foundHouseAddressName)) {
                return res
                  .status(401)
                  .send({ message: "Incorrect User House Address " });
              }
            }
  
            res.houseAddress = foundHouseAddressName;
  
            if (
              !!foundUser.admin ||
              !!foundUser.admin.userId ||
              !!isValidMongoObjectId(foundUser.admin.userId) ||
              stringIsEqual(foundUser.admin.userId, foundUser._id)
            ) {
              const foundAdmin = await Admin.findOne(
                {
                  _id: foundUser._id,
                  status: 1,
                  //  name: decode.name.value
                },
                adminScheama
              );
  
              if (isValidMongoObject(foundAdmin)) {
                res.admin = foundAdmin;
              }
            }
  
            refreshUserUpdates(req, res, next);
            // next();
          }
        }
      );
    } else {
      return res.status(401).send({ message: "No Token" });
    }
  };
  const travelMode = async (req, res, next) => {
    if (
      !isValidMongoObject(res.user) ||
      !isValidMongoObjectId(res.user._id) ||
      !isValidMongoObject(res.estate) ||
      !isValidMongoObjectId(res.estate._id)
    ) {
      return res.status(401).send({ message: "Not authorized " });
    } else {
      const foundUserMode = await UserMode.findOne({
        userId: res.user._id,
        estateId: res.estate._id,
        status: 1,
        //  name: decode.name.value
      });
  
      if (!isValidMongoObject(foundUserMode)) {
        return res.status(401).send({ message: "Incorrect user mode" });
      }
  
      res.mode = foundUserMode;
      if (!stringIsEqual(foundUserMode.mode, 0)) {
        return res.status(401).send({ message: "Travel mode active" });
      }
  
      next();
    }
  };
  
  module.exports = {
    isAdmin,
    isSecurity,
    isPortalUser,
    isAuth,
    travelMode,  
  }