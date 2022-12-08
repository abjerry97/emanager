// import jwt from "jsonwebtoken" 
const {
  stringIsEqual,
  isValidMongoObject,
  isValidMongoObjectId,
  isValidArrayOfMongoObject,
} = require("../helpers/validators"); 
const HouseAddressName = require("../model/house-address");
const UserNotificationLinking = require("../model/user-notification-linking");
const FoodEstateLinking = require("../model/food-estate-linking");
const GoodEstateLinking = require("../model/good-estate-linking");
const ServiceEstateLinking = require("../model/service-estate-linking");
const BusinessEstateLinking = require("../model/business-estate-linking");
const PropertyEstateLinking = require("../model/property-estate-linking");
const Notification = require("../model/notification");
const UserNotifications = require("../model/user-notifications");   
require("dotenv").config();
 

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
  
module.exports = { 
  refreshUserUpdates, 
};
