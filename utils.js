// import jwt from "jsonwebtoken"
const { doResearchFromHost } = require("./helpers/tools");
const {
  stringIsEqual,
  isValidMongoObject,
  isValidMongoObjectId,
  isValidArrayOfMongoObject,
} = require("./helpers/validators");
const crypto = require("crypto");

const jwt = require("jsonwebtoken");
const User = require("./model/user");
const { json } = require("express");
const Admin = require("./model/admin");
const Security = require("./model/security");
const RegisteredEstate = require("./model/registered-estate");
const UserMode = require("./model/user-mode");
const UserFamily = require("./model/user-family");
const HouseAddressName = require("./model/house-address");
const UserNotificationLinking = require("./model/user-notification-linking");
const FoodEstateLinking = require("./model/food-estate-linking");
const GoodEstateLinking = require("./model/good-estate-linking");
const ServiceEstateLinking = require("./model/service-estate-linking");
const BusinessEstateLinking = require("./model/business-estate-linking");
const PropertyEstateLinking = require("./model/property-estate-linking");
const Notification = require("./model/notification");
const UserNotifications = require("./model/user-notifications");
const UserEstate = require("./model/user-estate");
const { Novu } = require("@novu/node");
const EmanagerUserWalletSession = require("./model/emanager-user-wallet-session");
const { adminScheama } = require("./helpers/projections");
const novu = new Novu("2b2b16662812303733804185a284b971");
require("dotenv").config();

const generateToken = (user, estateId) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name.value,
      email: user.emails.filter((x) => {
        return stringIsEqual(x.isPrimary, 1) && stringIsEqual(x.status, 1);
      })[0],
      isAdmin: !!user.ownerType && stringIsEqual(user.ownerType, 1),
      estateId,
    },
    process.env.JWT_SECRET || "qapitapay1",
    {
      expiresIn: "1d",
    }
  );
};

const refreshUserUpdates = async (req, res, next) => {
  const user = res.user || {};
  const estate = res.estate || {};
  if (!isValidMongoObject(user)) {
    return res.json({
      success: false,
      message: "Sorry!!...You are not Authorized",
    });
  }
  if (!isValidMongoObject(estate)) {
    return res.json({
      success: false,
      message: "Sorry!!...Invalid Estate",
    });
  }

  const { _id: userId } = user;
  const { _id: estateId } = estate;

  if (!isValidMongoObjectId(userId)) {
    return res.json({
      success: false,
      message: "Sorry!!...Invalid User",
    });
  }

  if (!isValidMongoObjectId(estateId)) {
    return res.json({
      success: false,
      message: "Sorry!!...Invalid Estate",
    });
  }

  const currentUserNotificationLinkingCount =
    await UserNotificationLinking.countDocuments({
      status: "1",
      ownerId: userId,
      isRead: false,
      estateId,
    });

  if (isNaN(currentUserNotificationLinkingCount)) {
    return res.json({
      success: false,
      message: "Sorry!!...Notification count process error",
    });
  }

  res.notificationCount = currentUserNotificationLinkingCount;

  if (currentUserNotificationLinkingCount > 0) {
    const currentUserNotificationLinking = await UserNotificationLinking.find({
      status: "1",
      ownerId: userId,
      estateId,
    });

    if (!isValidArrayOfMongoObject(currentUserNotificationLinking)) {
      return res.json({
        success: false,
        message: "Sorry!!.. error getting user notifications",
      });
    }

    const userNotifications = [];

    const pushUserNotifications = await Promise.all(
      currentUserNotificationLinking.map(async (notificationLinking, index) => {
        const contextId = notificationLinking.contextId;
        if (isValidMongoObjectId(contextId)) {
          const notification = await Notification.findOne({
            status: 1,
            _id: notificationLinking.contextId,
          });
          if (isValidMongoObject(notification)) {
            userNotifications.push(notification);
          }
        }
      })
    );
    try {
      const updateUserNotifications = await UserNotifications.updateOne(
        {
          status: 1,
          ownerId: userId,
          estateId,
        },
        {
          $set: {
            total: currentUserNotificationLinking.length,
            unread: currentUserNotificationLinkingCount,
            notifications: userNotifications,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  const currentEstateFoodLinkingCount = await FoodEstateLinking.countDocuments({
    status: "1",
    estateId,
  });

  if (isNaN(currentEstateFoodLinkingCount)) {
    return res.json({
      success: false,
      message: "Sorry!!...Food count process error",
    });
  }

  res.foodsCount = currentEstateFoodLinkingCount;

  const currentEstateGoodLinkingCount = await GoodEstateLinking.countDocuments({
    status: "1",
    estateId,
  });

  if (isNaN(currentEstateGoodLinkingCount)) {
    return res.json({
      success: false,
      message: "Sorry!!...Goods count process error",
    });
  }

  res.goodsCount = currentEstateGoodLinkingCount;

  const currentEstateServiceLinkingCount =
    await ServiceEstateLinking.countDocuments({
      status: "1",
      estateId,
    });

  if (isNaN(currentEstateServiceLinkingCount)) {
    return res.json({
      success: false,
      message: "Sorry!!...Services count process error",
    });
  }

  res.servicesCount = currentEstateServiceLinkingCount;

  const currentEstateBusinessLinkingCount =
    await BusinessEstateLinking.countDocuments({
      status: "1",
      estateId,
    });

  if (isNaN(currentEstateBusinessLinkingCount)) {
    return res.json({
      success: false,
      message: "Sorry!!...Business count process error",
    });
  }

  res.businessCount = currentEstateBusinessLinkingCount;

  const currentEstatePropertyLinkingCount =
    await PropertyEstateLinking.countDocuments({
      status: "1",
      estateId,
    });

  if (isNaN(currentEstatePropertyLinkingCount)) {
    return res.json({
      success: false,
      message: "Sorry!!...Property count process error",
    });
  }

  res.propertyCount = currentEstatePropertyLinkingCount;
  next();
};
const generateTokenAdmin = (admin, estateId) => {
  return jwt.sign(
    {
      _id: admin._id,
      status: admin.status,
      name: admin.name.value,
      role: admin.role,
      userId: admin.userId,
      isTopmost: admin.isTopmost,
      estateId: admin.estateId,
      createdBy: admin.createdBy,
      estateId,
    },
    process.env.JWT_SECRET || "qapitapay1",
    {
      expiresIn: "1d",
    }
  );
};
const generateTokenSecurity = (security, estateId) => {
  return jwt.sign(
    {
      _id: security._id,
      status: security.status,
      name: security.name.value,
      estateId: security.estateId,
      createdBy: security.createdBy,
    },
    process.env.JWT_SECRET || "qapitapay1",
    {
      expiresIn: "1d",
    }
  );
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

          const existingUserWalletSession = await checkWalletSession(foundUser);
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
          const existingUserWalletSession = await checkWalletSession(foundUser);
          if (isValidMongoObject(existingUserWalletSession)) {
            res.userWalletSessionToken = existingUserWalletSession.sessionToken;
          }
          res.user = foundUser;
          next();
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

          const existingUserWalletSession = await checkWalletSession(
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

const generateCode = () => {
  const array = [];
  for (let index = 0; index < 6; index++) {
    array[index] = crypto.randomInt(9);
  }
  return array.join("");
};

function handlePass(fn, date) {
  return setTimeout(fn, Date.now() - date);
}
const CreateQpayCustomerObject = async function (user, estateId, password) {
  const formatedUser = {
    name: (user.name && user.name.value) || "",
    email:
      !!user && !!user.emails && Array.isArray(user.emails)
        ? user.emails.find((email) =>
            stringIsEqual(!!email.isPrimary && email.isPrimary, 1)
          )
        : "",
    phoneNumber:
      !!user && !!user.phoneNumbers && Array.isArray(user.phoneNumbers)
        ? user.phoneNumbers.find((phoneNumber) =>
            stringIsEqual(!!phoneNumber.isPrimary && phoneNumber.isPrimary, 1)
          )
        : "",
    houseAddress:
      !!user && !!user.houseAddress && Array.isArray(user.houseAddress)
        ? user.houseAddress.find((houseAddress) =>
            stringIsEqual(estateId, houseAddress.estateId)
          )?.value
        : "",
    _id: user._id,
  };

  // const userPassword = await Password.findOne({
  //   status:"1",
  //   ownerId: user._id
  // })

  // if (!isValidMongoObject(userPassword)) {
  //   return res.json({
  //     success: false,
  //     message: "Sorry!!...Invalid Password",
  //   });
  // }

  return {
    firstname: formatedUser.name.split(" ", 2)[0] || "",
    lastname: formatedUser.name.split(" ", 2)[1] || "",
    email: formatedUser.email.value,
    phone:
      `${formatedUser.phoneNumber.countryCode}` +
      `${formatedUser.phoneNumber.value}`,
    pin: password,
    location: `Latitude: 3.4555587,Longitude: 6.7534736`,
  };
};

const sendEmailNovuNotification = async (recipient, payload, triggerId) => {
  return sendNovuNotification("email", recipient, payload, triggerId);
};
const sendPhoneNovuNotification = async (recipient, payload, triggerId) => {
  return sendNovuNotification("email", recipient, payload, triggerId);
};
const sendNovuNotification = async (type, recipient, payload, triggerId) => {
  const toObj = {
    subscriberId: recipient,
  };
  toObj[`${type}`] = recipient;
  try {
    let response = await novu.trigger(triggerId, {
      to: toObj,
      payload: {
        data: payload,
      },
    });
    return response;
  } catch (err) {
    return err;
  }
};

const generateWalletToken = (walletSession) => {
  return jwt.sign(
    {
      status: walletSession.status,
      _id: walletSession._id,
      walletId: walletSession.walletId,
      userId: walletSession.userId,
    },
    process.env.JWT_SECRET || "qapitapay1",
    {
      expiresIn: "1d",
    }
  );
};

const verifyWalletToken = async () => {
  jwt.verify(
    token,
    process.env.JWT_SECRET || "qapitapay1",
    async (err, decode) => {
      if (err) {
        return res.status(401).send({ message: "Invalid Wallet Token" });
      } else {
        // _id: decode.estateId,

        res.userFamily = foundUserFamily;

        // next();
      }
    }
  );
};

const checkWalletSession = async (user) => {
  const userWalletSession = await EmanagerUserWalletSession.findOne({
    status: 1,
    userId: user._id,
  });
  if (!isValidMongoObject(userWalletSession)) {
    return { message: "Wallet Session not found" };
  }
  return userWalletSession;
};
const checkEstateWalletSession = async (estate) => {
  const userWalletSession = await EmanagerUserWalletSession.findOne({
    status: 1,
    userId: estate._id,
  });
  if (!isValidMongoObject(userWalletSession)) {
    return { message: "Wallet Session not found" };
  }
  return userWalletSession;
};

module.exports = {
  isAdmin,
  generateToken,
  isAuth,
  generateCode,
  handlePass,
  generateTokenAdmin,
  generateTokenSecurity,
  isSecurity,
  travelMode,
  refreshUserUpdates,
  CreateQpayCustomerObject,
  isPortalUser,
  sendEmailNovuNotification,
  sendPhoneNovuNotification,
  generateWalletToken,
  verifyWalletToken,
};
