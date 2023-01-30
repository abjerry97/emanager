const bcrypt = require("bcryptjs");
const { isHashedString, formatPhonenumber } = require("../../helpers/tools");
const {
  isValidFullName,
  isValidMongoObject,
  isEmail,
  isValidatePhoneneumber,
  isValidMongoObjectId,
  stringIsEqual,
  isValidPhonenumber,
  isValidArrayOfMongoObject,
  isValidPassword,
} = require("../../helpers/validators");
const UserEstate = require("../../model/user-estate");
const FoodEstateLinking = require("../../model/food-estate-linking");
const GoodEstateLinking = require("../../model/good-estate-linking");
const ServiceEstateLinking = require("../../model/service-estate-linking");
const BusinessEstateLinking = require("../../model/business-estate-linking");
const PropertyEstateLinking = require("../../model/property-estate-linking");
const Property = require("../../model/property");
const House = require("../../model/house");
const Food = require("../../model/food");
const PropertyDescription = require("../../model/property-description");
const PropertyPrice = require("../../model/property-price");
const PropertyImage = require("../../model/property-image");
const PropertyOwnerDetails = require("../../model/property-owner-details");
const PropertyRating = require("../../model/property-rating");
const PropertyFavourite = require("../../model/property-favourite");
const PropertyTitle = require("../../model/property-title");
const PropertyRatingLinking = require("../../model/food-rating-linking");
const FoodDescription = require("../../model/food-description");
const FoodPrice = require("../../model/food-price");
const FoodImage = require("../../model/food-image");
const FoodOwnerDetails = require("../../model/food-owner-details");
const FoodRating = require("../../model/food-rating");
const FoodFavourite = require("../../model/food-favourite");
const FoodName = require("../../model/food-name");
const FoodRatingLinking = require("../../model/food-rating-linking");
const Good = require("../../model/good");
const GoodDescription = require("../../model/good-description");
const GoodPrice = require("../../model/good-price");
const GoodImage = require("../../model/good-image");
const GoodOwnerDetails = require("../../model/good-owner-details");
const GoodRating = require("../../model/good-rating");
const GoodFavourite = require("../../model/good-favourite");
const GoodName = require("../../model/good-name");
const GoodRatingLinking = require("../../model/good-rating-linking");
const QpayWallet = require("../QpayWallet/QpayWallet");
const EmanagerWallet = require("../EmanagerWallet/EmanagerWallet");
const Bill = require("../Bill/Bill");
const Bills = require("../../model/bills");
const UserWalletTransaction = require("../../model/emanager-user-wallet-transaction");
class PortalAdmin {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.emanagerWallet = new EmanagerWallet(this.req, this.res);
    this.estateBills = new Bill(this.req, this.res);
  }

  async __portalOverview() {
    const createdOn = new Date();
    const adminId = (this.res.admin && this.res.admin._id) || "";
    const admin = this.res.admin || "";
    const estate = this.res.estate || "";
    const estateId = this.res.estate._id || "";

    if (!isValidMongoObject(admin) || !isValidMongoObjectId(adminId)) {
      this.res.statusCode = 406;
      return this.res.json({
        success: false,
        message: "invalid admin",
      });
    }
    if (!isValidMongoObject(estate)) {
      this.res.statusCode = 406;
      return this.res.json({
        success: false,
        message: "invalid estate",
      });
    }

    const estateBills = await Bills.find(
      {
        status: 1,
        // estateId,
      },
      {
        _id: 1,
        type: 1,
        estateId: 1,
        revenue: 1,
      }
    ).sort({ _id: -1 });

    const overview = {
      walletBalance: 0,
      estateRevenue: [],
    };

    if (Array.isArray(estateBills)) {
      const estateRevenue = estateBills.map((estateBill, index) => {
        const newObj = {};
        newObj.type = `revenue from ${estateBill.type}`;
        newObj.value = estateBill.revenue;
        return newObj;
      });
      overview.estateRevenue = estateRevenue;
    }
    const walletBalance = await this.emanagerWallet.__generateEstateBalance();
    if (isValidMongoObject(walletBalance)) {
      overview.walletBalance = walletBalance.value;
    }

    // Resdience

    const currentEstateUsers = await UserEstate.countDocuments({
      status: "1",
      // estateId,
      ownerType: "0",
    });

    if (isNaN(currentEstateUsers)) {
      overview.residentCount = 0;
    } else overview.residentCount = currentEstateUsers;

    const currentEstateHouses = await House.countDocuments({
      status: "1",
      // estateId,
    });

    if (isNaN(currentEstateHouses)) {
      overview.houseCount = 0;
    } else overview.houseCount = currentEstateHouses;

    const propertyAdTransaction = await UserWalletTransaction.aggregate([
      {
        $match: {
          type: "propertyAd",
          // success: true,
        },
      },
      {
        $group: { _id: "$estateId", amount: { $sum: "$amount" } },
      },
    ]);

    const propertyAdRevenue = {
      type: "Revenue From Property Ad",
      value: propertyAdTransaction[0]?.amount || 0,
    };
    overview.estateRevenue.push(propertyAdRevenue)

    return this.res.json({ overview });
  }

  async __getPortalProperty() {
    const createdOn = new Date();
    const pageSize = this.req.query["pageSize"] || "";
    const page = this.req.query["page"] || "";
    const category = this.req.query["status"] || "";

    const categoryIndex = configDoc.propertyStatus.findIndex((status) =>
      stringIsEqual(status.toLowerCase(), category.toLowerCase())
    );

    const query = {
      status: 1,
    };

    if (!isNaN(categoryIndex) && categoryIndex >= 0) {
      query.category = categoryIndex;
    }
    const foundProperty = await Property.find(query)
      .limit(pageSize)
      .skip(pageSize * page);
    if (!isValidArrayOfMongoObject(foundProperty)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "No Property found",
      });
    }
    return this.res.json({
      success: true,
      message: "Property found",
      properties: foundProperty,
    });
  }

  async __deletePortalEstateProperty() {
    const createdOn = new Date();
    // validate request
    const admin = this.res.admin || {};
    const { _id: adminId = "" } = admin;
    if (!isValidMongoObject(admin)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Sorry!...admin not found!!!",
      });
    }
    const { _id: estateId } = this.res.estate || "";

    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid estate id",
      });
    }
    if (!isValidMongoObjectId(adminId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid admin",
      });
    }

    const propertiesToUpdate = this.req.body.properties || [];
    const propertyUpdates = await Promise.all(
      (propertiesToUpdate || []).map(async (contextId, index) => {
        if (isValidMongoObjectId(contextId)) {
          const estateProperty = await PropertyEstateLinking.findOne({
            status: 1,
            propertyId: contextId,
            estateId,
          });
          const propertyUpdatableSet = {};
          if (isValidMongoObject(estateProperty)) {
            try {
              const updateParticularPropertyDescription =
                await PropertyDescription.findOneAndUpdate(
                  {
                    status: 1,
                    propertyId: contextId,
                  },
                  {
                    $set: { status: "0" },
                    $push: {
                      updates: [
                        {
                          by: adminId, // admin ID of the user who made this update
                          action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                          timing: createdOn,
                        },
                      ],
                    },
                  }
                );
              propertyUpdatableSet.description =
                updateParticularPropertyDescription;
            } catch (error) {
              console.log(error);
            }

            try {
              const updateParticularPropertyPrice =
                await PropertyPrice.findOneAndUpdate(
                  {
                    status: 1,
                    propertyId: contextId,
                  },
                  {
                    $set: { status: "0" },
                    $push: {
                      updates: [
                        {
                          by: adminId, // admin ID of the user who made this update
                          action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                          timing: createdOn,
                        },
                      ],
                    },
                  },
                  { new: true }
                );

              propertyUpdatableSet.price = updateParticularPropertyPrice;
            } catch (error) {
              console.log(error);
            }

            try {
              const updateParticularPropertyImage =
                await PropertyImage.findOneAndUpdate(
                  {
                    status: 1,
                    propertyId: contextId,
                  },
                  {
                    $set: { status: "0" },
                    $push: {
                      updates: [
                        {
                          by: adminId, // admin ID of the user who made this update
                          action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                          timing: createdOn,
                        },
                      ],
                    },
                  },
                  { new: true }
                );

              propertyUpdatableSet.image = updateParticularPropertyImage;
            } catch (error) {
              console.log(error);
            }

            try {
              const updateParticularPropertyOwnerDetails =
                await PropertyOwnerDetails.findOneAndUpdate(
                  {
                    status: 1,
                    propertyId: contextId,
                  },
                  {
                    $set: { status: "0" },
                    $push: {
                      updates: [
                        {
                          by: adminId, // admin ID of the user who made this update
                          action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                          timing: createdOn,
                        },
                      ],
                    },
                  },
                  { new: true }
                );
              propertyUpdatableSet.rating =
                updateParticularPropertyOwnerDetails;
            } catch (error) {
              console.log(error);
            }

            try {
              const updateParticularPropertyRating =
                await PropertyRating.findOneAndUpdate(
                  {
                    status: 1,
                    propertyId: contextId,
                  },
                  {
                    $set: { status: "0" },
                    $push: {
                      updates: [
                        {
                          by: adminId, // admin ID of the user who made this update
                          action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                          timing: createdOn,
                        },
                      ],
                    },
                  },
                  { new: true }
                );
            } catch (error) {
              console.log(error);
            }

            try {
              const updateParticularPass =
                await PropertyEstateLinking.findOneAndUpdate(
                  {
                    status: 1,
                    propertyId: contextId,
                  },
                  {
                    $set: { status: "0" },
                    $push: {
                      updates: [
                        {
                          by: adminId, // admin ID of the user who made this update
                          action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                          timing: createdOn,
                        },
                      ],
                    },
                  },
                  { new: true }
                );
            } catch (error) {
              console.log(error);
            }

            try {
              const updateParticularPropertyFavourite =
                await PropertyFavourite.updateMany(
                  {
                    status: 1,
                    propertyId: contextId,
                  },
                  {
                    $set: { status: "0" },
                    $push: {
                      updates: [
                        {
                          by: adminId, // admin ID of the user who made this update
                          action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                          timing: createdOn,
                        },
                      ],
                    },
                  },
                  { new: true }
                );
            } catch (error) {
              console.log(error);
            }

            try {
              const updateParticularPropertyTitle =
                await PropertyTitle.findOneAndUpdate(
                  {
                    status: 1,
                    propertyId: contextId,
                  },
                  {
                    $set: { status: "0" },
                    $push: {
                      updates: [
                        {
                          by: adminId, // admin ID of the user who made this update
                          action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                          timing: createdOn,
                        },
                      ],
                    },
                  },
                  { new: true }
                );
            } catch (error) {
              console.log(error);
            }

            try {
              const updateParticularPropertyRatingLinking =
                await PropertyRatingLinking.updateMany(
                  {
                    status: 1,
                    propertyId: contextId,
                  },
                  {
                    $set: { status: "0" },
                    $push: {
                      updates: [
                        {
                          by: adminId, // admin ID of the user who made this update
                          action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                          timing: createdOn,
                        },
                      ],
                    },
                  },
                  { new: true }
                );
            } catch (error) {
              console.log(error);
            }
            try {
              propertyUpdatableSet.status = 0;

              const updateParticularProperty = await Property.findOneAndUpdate(
                {
                  status: 1,
                  _id: contextId,
                },
                {
                  $set: propertyUpdatableSet,
                  $push: {
                    updates: [
                      {
                        by: adminId, // admin ID of the user who made this update
                        action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                        timing: createdOn,
                      },
                    ],
                  },
                },
                { new: true }
              );
            } catch (error) {
              console.log(error);
            }
          }
        }
      })
    );

    let foundEstateProperty = await Property.find({
      status: 1,
    });
    if (!isValidArrayOfMongoObject(foundEstateProperty)) {
      foundEstateProperty = [];
    }
    return this.res.json({
      success: true,
      message: "Property deleted Succesfully",
      properties: foundEstateProperty,
    });
  }

  async __getPortalFoods() {
    const createdOn = new Date();
    const pageSize = this.req.query["pageSize"] || "";
    const page = this.req.query["page"] || "";
    const category = this.req.query["status"] || "";

    const query = {
      status: 1,
    };
    const foundFoods = await Food.find(query)
      .limit(pageSize)
      .skip(pageSize * page);
    if (!isValidArrayOfMongoObject(foundFoods)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "No Food found",
      });
    }
    return this.res.json({
      success: true,
      message: "Food found",
      foods: foundFoods,
    });
  }

  async __deletePortalEstateFood() {
    const createdOn = new Date();
    // validate request
    const admin = this.res.admin || {};
    const { _id: adminId = "" } = admin;
    if (!isValidMongoObject(admin)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Sorry!...admin not found!!!",
      });
    }
    const { _id: estateId } = this.res.estate || "";

    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid estate id",
      });
    }
    if (!isValidMongoObjectId(adminId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid admin",
      });
    }

    const foodsToUpdate = this.req.body.foods || [];
    const foodUpdates = await Promise.all(
      (foodsToUpdate || []).map(async (contextId, index) => {
        if (isValidMongoObjectId(contextId)) {
          const estateFood = await FoodEstateLinking.findOne({
            status: 1,
            foodId: contextId,
            estateId,
          });
          const foodUpdatableSet = {};
          if (isValidMongoObject(estateFood)) {
            try {
              const updateParticularFoodDescription =
                await FoodDescription.findOneAndUpdate(
                  {
                    status: 1,
                    foodId: contextId,
                  },
                  {
                    $set: { status: "0" },
                    $push: {
                      updates: [
                        {
                          by: adminId, // admin ID of the user who made this update
                          action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                          timing: createdOn,
                        },
                      ],
                    },
                  }
                );
              foodUpdatableSet.description = updateParticularFoodDescription;
            } catch (error) {
              console.log(error);
            }

            try {
              const updateParticularFoodPrice =
                await FoodPrice.findOneAndUpdate(
                  {
                    status: 1,
                    foodId: contextId,
                  },
                  {
                    $set: { status: "0" },
                    $push: {
                      updates: [
                        {
                          by: adminId, // admin ID of the user who made this update
                          action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                          timing: createdOn,
                        },
                      ],
                    },
                  },
                  { new: true }
                );

              foodUpdatableSet.price = updateParticularFoodPrice;
            } catch (error) {
              console.log(error);
            }

            try {
              const updateParticularFoodImage =
                await FoodImage.findOneAndUpdate(
                  {
                    status: 1,
                    foodId: contextId,
                  },
                  {
                    $set: { status: "0" },
                    $push: {
                      updates: [
                        {
                          by: adminId, // admin ID of the user who made this update
                          action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                          timing: createdOn,
                        },
                      ],
                    },
                  },
                  { new: true }
                );

              foodUpdatableSet.image = updateParticularFoodImage;
            } catch (error) {
              console.log(error);
            }

            try {
              const updateParticularFoodOwnerDetails =
                await FoodOwnerDetails.findOneAndUpdate(
                  {
                    status: 1,
                    foodId: contextId,
                  },
                  {
                    $set: { status: "0" },
                    $push: {
                      updates: [
                        {
                          by: adminId, // admin ID of the user who made this update
                          action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                          timing: createdOn,
                        },
                      ],
                    },
                  },
                  { new: true }
                );
              foodUpdatableSet.rating = updateParticularFoodOwnerDetails;
            } catch (error) {
              console.log(error);
            }

            try {
              const updateParticularFoodRating =
                await FoodRating.findOneAndUpdate(
                  {
                    status: 1,
                    foodId: contextId,
                  },
                  {
                    $set: { status: "0" },
                    $push: {
                      updates: [
                        {
                          by: adminId, // admin ID of the user who made this update
                          action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                          timing: createdOn,
                        },
                      ],
                    },
                  },
                  { new: true }
                );
            } catch (error) {
              console.log(error);
            }

            try {
              const updateParticularPass =
                await FoodEstateLinking.findOneAndUpdate(
                  {
                    status: 1,
                    foodId: contextId,
                  },
                  {
                    $set: { status: "0" },
                    $push: {
                      updates: [
                        {
                          by: adminId, // admin ID of the user who made this update
                          action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                          timing: createdOn,
                        },
                      ],
                    },
                  },
                  { new: true }
                );
            } catch (error) {
              console.log(error);
            }

            try {
              const updateParticularFoodFavourite =
                await FoodFavourite.updateMany(
                  {
                    status: 1,
                    foodId: contextId,
                  },
                  {
                    $set: { status: "0" },
                    $push: {
                      updates: [
                        {
                          by: adminId, // admin ID of the user who made this update
                          action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                          timing: createdOn,
                        },
                      ],
                    },
                  },
                  { new: true }
                );
            } catch (error) {
              console.log(error);
            }

            try {
              const updateParticularFoodName = await FoodName.findOneAndUpdate(
                {
                  status: 1,
                  foodId: contextId,
                },
                {
                  $set: { status: "0" },
                  $push: {
                    updates: [
                      {
                        by: adminId, // admin ID of the user who made this update
                        action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                        timing: createdOn,
                      },
                    ],
                  },
                },
                { new: true }
              );

              // foodUpdatableSet.name = updateParticularFoodName
            } catch (error) {
              console.log(error);
            }

            try {
              const updateParticularFoodRatingLinking =
                await FoodRatingLinking.updateMany(
                  {
                    status: 1,
                    foodId: contextId,
                  },
                  {
                    $set: { status: "0" },
                    $push: {
                      updates: [
                        {
                          by: adminId, // admin ID of the user who made this update
                          action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                          timing: createdOn,
                        },
                      ],
                    },
                  },
                  { new: true }
                );
            } catch (error) {
              console.log(error);
            }
            try {
              foodUpdatableSet.status = 0;

              const updateParticularFood = await Food.findOneAndUpdate(
                {
                  status: 1,
                  _id: contextId,
                },
                {
                  $set: foodUpdatableSet,
                  $push: {
                    updates: [
                      {
                        by: adminId, // admin ID of the user who made this update
                        action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                        timing: createdOn,
                      },
                    ],
                  },
                },
                { new: true }
              );
            } catch (error) {
              console.log(error);
            }
          }
        }
      })
    );

    let foundEstateFood = await Food.find({
      status: 1,
    });
    if (!isValidArrayOfMongoObject(foundEstateFood)) {
      foundEstateFood = [];
    }
    return this.res.json({
      success: true,
      message: "Food deleted Succesfully",
      foods: foundEstateFood,
    });
  }

  async __getPortalGoods() {
    const createdOn = new Date();
    const pageSize = this.req.query["pageSize"] || "";
    const page = this.req.query["page"] || "";

    const query = {
      status: 1,
    };

    const foundGoods = await Good.find(query)
      .limit(pageSize)
      .skip(pageSize * page);
    if (!isValidArrayOfMongoObject(foundGoods)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "No Good found",
      });
    }
    return this.res.json({
      success: true,
      message: "Good found",
      goods: foundGoods,
    });
  }

  async __deletePortalEstateGood() {
    const createdOn = new Date();
    // validate request
    const admin = this.res.admin || {};
    const { _id: adminId = "" } = admin;
    if (!isValidMongoObject(admin)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Sorry!...admin not found!!!",
      });
    }
    const { _id: estateId } = this.res.estate || "";

    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid estate id",
      });
    }
    if (!isValidMongoObjectId(adminId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid admin",
      });
    }

    const goodsToUpdate = this.req.body.goods || [];
    const goodUpdates = await Promise.all(
      (goodsToUpdate || []).map(async (contextId, index) => {
        if (isValidMongoObjectId(contextId)) {
          const estateGood = await GoodEstateLinking.findOne({
            status: 1,
            goodId: contextId,
            estateId,
          });
          const goodUpdatableSet = {};
          if (isValidMongoObject(estateGood)) {
            try {
              const updateParticularGoodDescription =
                await GoodDescription.findOneAndUpdate(
                  {
                    status: 1,
                    goodId: contextId,
                  },
                  {
                    $set: { status: "0" },
                    $push: {
                      updates: [
                        {
                          by: adminId, // admin ID of the user who made this update
                          action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                          timing: createdOn,
                        },
                      ],
                    },
                  }
                );
              goodUpdatableSet.description = updateParticularGoodDescription;
            } catch (error) {
              console.log(error);
            }

            try {
              const updateParticularGoodPrice =
                await GoodPrice.findOneAndUpdate(
                  {
                    status: 1,
                    goodId: contextId,
                  },
                  {
                    $set: { status: "0" },
                    $push: {
                      updates: [
                        {
                          by: adminId, // admin ID of the user who made this update
                          action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                          timing: createdOn,
                        },
                      ],
                    },
                  },
                  { new: true }
                );

              goodUpdatableSet.price = updateParticularGoodPrice;
            } catch (error) {
              console.log(error);
            }

            try {
              const updateParticularGoodImage =
                await GoodImage.findOneAndUpdate(
                  {
                    status: 1,
                    goodId: contextId,
                  },
                  {
                    $set: { status: "0" },
                    $push: {
                      updates: [
                        {
                          by: adminId, // admin ID of the user who made this update
                          action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                          timing: createdOn,
                        },
                      ],
                    },
                  },
                  { new: true }
                );

              goodUpdatableSet.image = updateParticularGoodImage;
            } catch (error) {
              console.log(error);
            }

            try {
              const updateParticularGoodOwnerDetails =
                await GoodOwnerDetails.findOneAndUpdate(
                  {
                    status: 1,
                    goodId: contextId,
                  },
                  {
                    $set: { status: "0" },
                    $push: {
                      updates: [
                        {
                          by: adminId, // admin ID of the user who made this update
                          action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                          timing: createdOn,
                        },
                      ],
                    },
                  },
                  { new: true }
                );
              goodUpdatableSet.rating = updateParticularGoodOwnerDetails;
            } catch (error) {
              console.log(error);
            }

            try {
              const updateParticularGoodRating =
                await GoodRating.findOneAndUpdate(
                  {
                    status: 1,
                    goodId: contextId,
                  },
                  {
                    $set: { status: "0" },
                    $push: {
                      updates: [
                        {
                          by: adminId, // admin ID of the user who made this update
                          action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                          timing: createdOn,
                        },
                      ],
                    },
                  },
                  { new: true }
                );
            } catch (error) {
              console.log(error);
            }

            try {
              const updateParticularPass =
                await GoodEstateLinking.findOneAndUpdate(
                  {
                    status: 1,
                    goodId: contextId,
                  },
                  {
                    $set: { status: "0" },
                    $push: {
                      updates: [
                        {
                          by: adminId, // admin ID of the user who made this update
                          action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                          timing: createdOn,
                        },
                      ],
                    },
                  },
                  { new: true }
                );
            } catch (error) {
              console.log(error);
            }

            try {
              const updateParticularGoodFavourite =
                await GoodFavourite.updateMany(
                  {
                    status: 1,
                    goodId: contextId,
                  },
                  {
                    $set: { status: "0" },
                    $push: {
                      updates: [
                        {
                          by: adminId, // admin ID of the user who made this update
                          action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                          timing: createdOn,
                        },
                      ],
                    },
                  },
                  { new: true }
                );
            } catch (error) {
              console.log(error);
            }

            try {
              const updateParticularGoodName = await GoodName.findOneAndUpdate(
                {
                  status: 1,
                  goodId: contextId,
                },
                {
                  $set: { status: "0" },
                  $push: {
                    updates: [
                      {
                        by: adminId, // admin ID of the user who made this update
                        action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                        timing: createdOn,
                      },
                    ],
                  },
                },
                { new: true }
              );

              // goodUpdatableSet.name = updateParticularGoodName
            } catch (error) {
              console.log(error);
            }

            try {
              const updateParticularGoodRatingLinking =
                await GoodRatingLinking.updateMany(
                  {
                    status: 1,
                    goodId: contextId,
                  },
                  {
                    $set: { status: "0" },
                    $push: {
                      updates: [
                        {
                          by: adminId, // admin ID of the user who made this update
                          action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                          timing: createdOn,
                        },
                      ],
                    },
                  },
                  { new: true }
                );
            } catch (error) {
              console.log(error);
            }
            try {
              goodUpdatableSet.status = 0;

              const updateParticularGood = await Good.findOneAndUpdate(
                {
                  status: 1,
                  _id: contextId,
                },
                {
                  $set: goodUpdatableSet,
                  $push: {
                    updates: [
                      {
                        by: adminId, // admin ID of the user who made this update
                        action: 0, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
                        timing: createdOn,
                      },
                    ],
                  },
                },
                { new: true }
              );
            } catch (error) {
              console.log(error);
            }
          }
        }
      })
    );

    let foundEstateGood = await Good.find({
      status: 1,
    });
    if (!isValidArrayOfMongoObject(foundEstateGood)) {
      foundEstateGood = [];
    }
    return this.res.json({
      success: true,
      message: "Good deleted Succesfully",
      goods: foundEstateGood,
    });
  }

  async __getPortalBusiness() {
    const createdOn = new Date();
    // validate request
    const { _id: estateId } = this.res.estate || "";

    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid estate id",
      });
    }

    const pageSize = this.req.query["pageSize"] || "";
    const page = this.req.query["page"] || "";

    const query = {
      status: 1,
    };

    const foundBusiness = await Business.find(query)
      .limit(pageSize)
      .skip(pageSize * page);

    return this.res.json({
      success: true,
      message: "Business gotten Succesfully",
      business: foundBusiness,
    });
  }

  async __getPortalServices() {
    const createdOn = new Date();
    // validate request
    const { _id: estateId } = this.res.estate || "";

    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid estate id",
      });
    }

    const pageSize = this.req.query["pageSize"] || "";
    const page = this.req.query["page"] || "";

    const query = {
      status: 1,
    };
    const foundService = await Service.find(query)
      .limit(pageSize)
      .skip(pageSize * page);

    return this.res.json({
      success: true,
      message: "Service gotten Succesfully",
      service: foundService,
    });
  }
}
module.exports = PortalAdmin;
