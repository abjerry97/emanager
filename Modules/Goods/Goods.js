const {
  isValidFullName,
  isValidPhonenumber,
  isValidMongoObject,
  isValidMongoObjectId,
  stringIsEqual,
  isEmail,
  isValidArrayOfMongoObject,
} = require("../../helpers/validators");
const Email = require("../../model/email");
const AdminScheama = require("../../model/admin");
const PhoneNumber = require("../../model/phone-number");
const Authentication = require("../Authentication/auth");
const User = require("../../model/user");
const Name = require("../../model/name");
const cloudinary = require("../../helpers/cloudinary");
const Password = require("../../model/password");
const { isHashedString } = require("../../helpers/tools");
const GoodName = require("../../model/good-name");
const GoodDescription = require("../../model/good-description");
const GoodPrice = require("../../model/good-price");
const GoodImage = require("../../model/good-image");
const Good = require("../../model/good");
const GoodOwnerDetails = require("../../model/good-owner-details");
const GoodRating = require("../../model/good-rating");
const GoodEstateLinking = require("../../model/good-estate-linking");
const GoodFavourite = require("../../model/good-favourite");
const GoodRatingLinking = require("../../model/good-rating-linking");

class Goods {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
  }

  async __addGood() {
    const createdOn = new Date();
    // validate request

    const user = this.res.user || {};
    const userId = user._id;
    const { _id: estateId } = this.res.estate || "";
    if (!isValidMongoObjectId(userId)) {
      this.res.statusCode = 406
      return this.res.json({
        success: false,
        message: "sorry!...Invalid user",
      });
    }
    // if (!isValidMongoObjectId(estateId)) {
    //   this.res.statusCode = 406
    //   return this.res.json({
    //     success: false,
    //     message: "sorry!...Invalid estate id",
    //   });
    // }

    const goodName = this.req.body.name || "";
    const goodDescription = this.req.body.description || "";
    const goodPrice = this.req.body.price || "";
    const files = this.req.files;

    if (goodName.length < 3) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "oops!...invalid good name",
      });
    }
    if (goodDescription.length < 3) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "oops!...invalid good description",
      });
    }
    if (goodPrice.length < 3) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "oops!...invalid good price",
      });
    }

    const newlyCreatedGoodName = await new GoodName({
      status: 1,
      value: goodName,
      createdOn,
      createdBy: userId,
    });

    if (!isValidMongoObject(newlyCreatedGoodName)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Good Name",
      });
    }

    const newlyCreatedGoodDescription = await new GoodDescription({
      status: 1,
      value: goodDescription,
      createdOn,
      createdBy: userId,
    });

    if (!isValidMongoObject(newlyCreatedGoodDescription)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Good Description",
      });
    }

    const newlyCreatedGoodPrice = await new GoodPrice({
      status: 1,
      value: goodPrice,
      createdOn,
      createdBy: userId,
    });

    if (!isValidMongoObject(newlyCreatedGoodPrice)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Good Price",
      });
    }
    const newlyCreatedGoodRating = await new GoodRating({
      status: 1,
      value: 0,
      totalRating: 0,
      totalNumberOfRating: 0,
      createdOn,
      createdBy: userId,
    });

    if (!isValidMongoObject(newlyCreatedGoodRating)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Good Rating",
      });
    }

    const newlyCreatedGoodEstateLinking = await new GoodEstateLinking({
      status: 1,
      estateId,
      createdOn,
      createdBy: userId,
    });

    if (!isValidMongoObject(newlyCreatedGoodEstateLinking)) {
      this.res.statusCode = 500
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Good Estate Linking",
      });
    }

   
   
    if (!files || !Array.isArray(files) || files.length < 1) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Sorry!... Invalid Image file",
      });
    }

    let newlyCreatedGoodImages = await this.__createGoodImage(userId,files)

    if (!isValidArrayOfMongoObject(newlyCreatedGoodImages)) {
      this.res.statusCode = 500
      return this.res.json({
        success: false,
        message: "error while creating Good image, please try again",
      });
    }
    const ownerEmail =
      user.emails && Array.isArray(user.emails)
        ? user.emails.find((email) =>
            stringIsEqual(!!email.isPrimary && email.isPrimary, 1)
          )?.value
        : "";

    const unformattedOwnerPhone =
      user.phoneNumbers && Array.isArray(user.phoneNumbers)
        ? user.phoneNumbers.find((phoneNumbers) =>
            stringIsEqual(!!phoneNumbers.isPrimary && phoneNumbers.isPrimary, 1)
          )
        : {};

    const ownerPhone =
      `${unformattedOwnerPhone?.countryCode}` +
      `${unformattedOwnerPhone?.value}`;
    const newlyCreatedGood = await new Good({
      status: 1,
      createdOn,
      ownerName: user.name.value,
      ownerPhone,
      ownerEmail,
      createdBy: userId,
    });

    if (!isValidMongoObject(newlyCreatedGood)) {
      this.res.statusCode = 500
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Good",
      });
    }

    const newlyCreatedGoodOwnerDetails = await new GoodOwnerDetails({
      status: 1,
      name: user.name.value,
      estateId,
      email:
        user.emails && Array.isArray(user.emails)
          ? user.emails.find((email) =>
              stringIsEqual(!!email.isPrimary && email.isPrimary, 1)
            ).value
          : "",
      phonenumber:
        user.phoneNumbers && Array.isArray(user.phoneNumbers)
          ? user.phoneNumbers.find((phoneNumbers) =>
              stringIsEqual(
                !!phoneNumbers.isPrimary && phoneNumbers.isPrimary,
                1
              )
            ).value
          : "",
      createdOn,
      createdBy: userId,
    });

    if (!isValidMongoObject(newlyCreatedGoodOwnerDetails)) {
      this.res.statusCode = 500
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Good Owner Details",
      });
    }

    newlyCreatedGoodName.goodId = newlyCreatedGood._id;
    newlyCreatedGoodDescription.goodId = newlyCreatedGood._id;
    newlyCreatedGoodPrice.goodId = newlyCreatedGood._id; 
    newlyCreatedGoodOwnerDetails.goodId = newlyCreatedGood._id;
    newlyCreatedGoodEstateLinking.goodId = newlyCreatedGood._id;
    newlyCreatedGoodRating.goodId = newlyCreatedGood._id;
    try {
      const pushnewlyCreatedGoodImages = await Promise.all(
        newlyCreatedGoodImages.map(async (newlyCreatedGoodImage) => {
          try {
            newlyCreatedGoodImage.goodId = newlyCreatedGood._id;
            await newlyCreatedGoodImage.save();
          } catch (err) {
            console.log(err);
          }
        })
      );
    } catch (error) {
      console.log(error);
    }
    newlyCreatedGood.name = newlyCreatedGoodName.value;
    newlyCreatedGood.description = newlyCreatedGoodDescription;
    newlyCreatedGood.price = newlyCreatedGoodPrice;
    newlyCreatedGood.image = newlyCreatedGoodImages;
    newlyCreatedGood.rating = newlyCreatedGoodRating;

    await newlyCreatedGoodName.save();
    await newlyCreatedGoodDescription.save();
    await newlyCreatedGoodPrice.save(); 
    await newlyCreatedGood.save();
    await newlyCreatedGoodOwnerDetails.save();
    await newlyCreatedGoodEstateLinking.save();
    await newlyCreatedGoodRating.save();

    return this.res.json({
      success: true,
      message: "Good Created Succesfully",
      good: newlyCreatedGood,
    });
  }


  async __createGoodImage(userId,files){
    const createdOn = new Date()
 


    let newlyCreatedGoodImages =[]
    const pushImages = await Promise.all(
      (files || []).map(async (image, index) => {
        const fileName = "image" + Date.now() + index;
        try {
          const result = await cloudinary.uploader.upload(image.path, {
            //   resource_type: "image",
            public_id: `goods/uploads/images/${fileName}`,
            overwrite: true,
          });
  
          newlyCreatedGoodImages[index] = await new GoodImage({
            status: 1,
            url: result.secure_url,
            createdOn,  
            createdBy: userId,
          });
        } catch (error) {
          console.log(error);
        }
      })
    );
  
    return newlyCreatedGoodImages
  }

  async __getGoods() {
    const createdOn = new Date();
    // if
    //   (isNaN(Number(this.req.query["limit"])))
    //  {
    //   return this.res.json({
    //     success: false,
    //     message: "Invalid Search params",
    //   });
    // }

    const foundGoods = await Good.find({status:1},{ name: 1, _id:1, ownerName:1, ownerPhone:1,
      ownerEmail:1,
       adType:1, 
        createdOn:1, 
        "description.value":1, 
        "price.value":1,
        "image.url":1,
        "rating.value":1,
        "ads.title":1,
        "ads.category":1,
        "ads.type":1,
        "ads.ownerPhone":1,
        "ads.ownerEmail":1,
        "ads.details.value":1,
        "ads.image.url":1,
        "ads.description.value":1,
        "ads.rating.value":1});
    // if (!isValidMongoObject(foundEstates)) {
    //   return this.res.json({
    //     success: false,
    //     message: "Estates not found",
    //   });
    // }
    if (!isValidArrayOfMongoObject(foundGoods)) {
      this.res.statusCode = 400
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
  async __findGood() {
    const createdOn = new Date();
    // validate request

    const user = this.res.user || {};
    const userId = user._id;
    const { _id: estateId } = this.res.estate || "";
    if (!isValidMongoObjectId(userId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "sorry!...Invalid user",
      });
    }
    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "sorry!...Invalid estate id",
      });
    }
    const name = this.req.query["name"] || "";
    if (name.length < 3) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Goods not found",
        goods: [],
      });
    }

    // validate name
    const foundGoods = await Good.find({
      status: 1,
      name: { $regex: new RegExp(`${name}`, "i") },
    });

    return this.res.json({
      success: true,
      message: "Goods found",
      goods: foundGoods,
    });
  }

  async __rateGood() {
    const createdOn = new Date();
    // validate request

    const user = this.res.user || {};
    const userId = user._id;
    const { _id: estateId } = this.res.estate || "";
    if (!isValidMongoObjectId(userId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "sorry!...Invalid user",
      });
    }
    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "sorry!...Invalid estate id",
      });
    }

    const goodId = this.req.params.goodId || "";
    const goodRating = this.req.query.rating || "";

    if (!isValidMongoObjectId(goodId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "sorry!...Invalid selected good id",
      });
    }

    if (!goodRating || isNaN(goodRating) || goodRating > 5 || goodRating < 0) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "invalid rating (hint 0-5)",
      });
    }

    let foundGoodRating = await GoodRating.findOne({
      status: 1,
      goodId,
    });

    if (!isValidMongoObject(foundGoodRating)) {
      const foundGood = await Good.findOne({
        status: 1,
        _id: goodId,
      });

      if (!isValidMongoObject(foundGood)) {
        this.res.statusCode = 404
        return this.res.json({
          success: false,
          message: "good not found",
        });
      }

      foundGoodRating = await new GoodRating({
        status: 1,
        goodId,
        value: 0,
        totalRating: 0,
        totalNumberOfRating: 0,
      });

      await foundGoodRating.save();
    }

    const foundGoodRatingLinking = await GoodRatingLinking.findOne({
      status: 1,
      goodId,
      ownerId: user._id,
    });

    if (isValidMongoObject(foundGoodRatingLinking)) {
      this.res.statusCode = 409
      return this.res.json({
        success: false,
        message: "You have already rated this Good",
      });
    }

    const newlyCreatedGoodRatingLinking = await new GoodRatingLinking({
      status: 1,
      goodId,
      value: goodRating,
      estateId,
      ownerId: user._id,
      createdOn,
    });

    if (!isValidMongoObject(newlyCreatedGoodRatingLinking)) {
      this.res.statusCode = 500
      return this.res.json({
        success: false,
        message: "Good Rating not Succesful",
      });
    }
    await newlyCreatedGoodRatingLinking.save();
    let updatedGood = {};
    try {
      const updatedGoodRating = await GoodRating.findOneAndUpdate(
        {
          status: "1",
          goodId,
          value: { $gte: 0 },
          totalRating: { $gte: 0 },
        },
        {
          $inc: { totalRating: Number(goodRating), totalNumberOfRating: 1 },
          $set: {
            value:
              (Number(foundGoodRating.totalRating) + Number(goodRating)) /
                (foundGoodRating.totalNumberOfRating + 1) ||
              foundGoodRating.value,
          },
        },
        { new: true }
      );

      updatedGood = await Good.findOneAndUpdate(
        {
          status: 1,
          _id: goodId,
        },
        {
          $set: {
            rating: updatedGoodRating,
          },
        },
        { new: true }
      );
    } catch (error) {
      console.log(error);
    }

    return this.res.json({
      success: true,
      message: "Good Rated Succesfully",
      good: updatedGood,
    });
  }

  async __addGoodToFavourite() {
    const createdOn = new Date();
    // validate request

    const user = this.res.user || {};
    const userId = user._id;
    const { _id: estateId } = this.res.estate || "";
    const { goodId } = this.req.params || "";

    if (!isValidMongoObjectId(userId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "sorry!...Invalid user",
      });
    }
    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "sorry!...Invalid estate id",
      });
    }
    if (!isValidMongoObjectId(goodId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "sorry!...Invalid good id",
      });
    }

    const foundGoodFavourite = await GoodFavourite.findOne({
      status: 1,
      goodId,
      userId,
      estateId,
    });

    if (!isValidMongoObject(foundGoodFavourite)) {
      const newGoodFavourite = await new GoodFavourite({
        status: 1,
        goodId,
        userId,
        estateId,
        createdOn,
        createdBy: userId,
      });

      if (!isValidMongoObject(newGoodFavourite)) {
        this.res.statusCode = 400
        return this.res.json({
          success: false,
          message: "sorry!...Error creating Good Favourite",
        });
      }

      await newGoodFavourite.save();
    }

    return this.res.json({
      success: true,
      message: "Goods successfully added to favourite",
    });
  }

  async __removeGoodFromFavourite() {
    const createdOn = new Date();
    // validate request

    const user = this.res.user || {};
    const userId = user._id;
    const { _id: estateId } = this.res.estate || "";
    const { goodId } = this.req.params || "";

    if (!isValidMongoObjectId(userId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "sorry!...Invalid user",
      });
    }
    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "sorry!...Invalid estate id",
      });
    }
    if (!isValidMongoObjectId(goodId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "sorry!...Invalid good id",
      });
    }
    try {
      const removeGoodFavourite = await GoodFavourite.updateMany(
        {
          status: 1,
          estateId,
          userId,
          goodId,
        },
        { $set: { status: 0 } }
      );
    } catch (err) {
      console.log(err);
    }

    return this.res.json({
      success: true,
      message: "Goods successfully removed from favourite",
    });
  }

  async __getUserEstateGoodFavourite() {
    const createdOn = new Date();
    // validate request

    const user = this.res.user || {};
    const userId = user._id;
    const { _id: estateId } = this.res.estate || "";

    if (!isValidMongoObjectId(userId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "sorry!...Invalid user",
      });
    }
    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "sorry!...Invalid estate id",
      });
    }

    const userEstateGoodFavourite = await GoodFavourite.find({
      status: 1,
      estateId,
      userId,
    });

    if (!isValidArrayOfMongoObject(userEstateGoodFavourite)) {
      return this.res.json({
        success: true,
        message: "Good favourite gotten successfully",
        goodFavourites: [],
      });
    }

    return this.res.json({
      success: true,
      message: "Good favourite gotten successfully",
      goodFavourites: userEstateGoodFavourite,
    });
  }

  async __getEstateGoods() {
    const createdOn = new Date();
    // validate request
    const user = this.res.user || {};
    const { _id: userId = "" } = user;
    if (!isValidMongoObject(user)) {
      this.res.statusCode = 404
      return this.res.json({
        success: false,
        message: "Sorry!...user not found!!!",
      });
    }
    const { _id: estateId } = this.res.estate || "";
    let { estateId: selectedEstateId } = this.req.params || null;

    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid estate id",
      });
    }
    if (!isValidMongoObjectId(userId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid user",
      });
    }
    if (!isValidMongoObjectId(selectedEstateId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid selected estate id",
      });
    }

    const foundEstateGoods = await GoodEstateLinking.find({
      status: 1,
      estateId: selectedEstateId,
    });
    if (!isValidArrayOfMongoObject(foundEstateGoods) ||foundEstateGoods.length <1 ) {
      this.res.statusCode = 404
      return this.res.json({
        success: true,
        message: "Goods gotten Succesfully",
        goods: [],
      });
    }

    return this.res.json({
      success: true,
      message: "Goods gotten Succesfully",
      goods: foundEstateGoods,
    });
  }

  async __findGoodByID() {
    const createdOn = new Date();
    // validate request

    const user = this.res.user || {};
    const userId = user._id;
    const { _id: estateId } = this.res.estate || "";
    if (!isValidMongoObjectId(userId)) {
      this.res.statusCode = 406
      return this.res.json({
        success: false,
        message: "sorry!...Invalid user",
      });
    } 
    const goodId = this.req.params.goodId || "";
    if (!isValidMongoObjectId(goodId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Please provide a valid good id param", 
      });
    }

    // validate name
    const foundGood  = await Good.findOne({
      status: 1,
      _id:goodId,
    },{ name: 1, _id:1, ownerName:1, ownerPhone:1,
      ownerEmail:1,
       adType:1, 
        createdOn:1, 
        "description.value":1, 
        "price.value":1,
        "image.url":1,
        "rating.value":1,
        "ads.title":1,
        "ads.category":1,
        "ads.type":1,
        "ads.ownerPhone":1,
        "ads.ownerEmail":1,
        "ads.details.value":1,
        "ads.image.url":1,
        "ads.description.value":1,
        "ads.rating.value":1});
    if (!isValidMongoObject(foundGood)) {
      this.res.statusCode = 404
      return this.res.json({
        success: false,
        message: "Good not found", 
      });
    }

    return this.res.json({
      success: true,
      message: "Good found",
      good: foundGood,
    });
  }
   
  async __deleteGood() {
    const createdOn = new Date();
    // validate request
    const admin = this.res.admin || {};
    const { _id: adminId = "" } = admin;
    if (!isValidMongoObject(admin)) {
      this.res.statusCode = 404
      return this.res.json({
        success: false,
        message: "Sorry!...admin not found!!!",
      });
    }
    const { _id: estateId } = this.res.estate || "";

    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid estate id",
      });
    }
    if (!isValidMongoObjectId(adminId)) {
      this.res.statusCode = 404
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid admin",
      });
    }

    const contextId = this.req.body.goodId || "";
    // const goodUpdates = await Promise.all(
      // (goodsToUpdate || []).map(async (contextId, index) => {
        if (!isValidMongoObjectId(contextId)) {
          this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid good id",
      }); 
        }


          const foundGood = await Good.findOne({
            status: 1,
            _id: contextId,
        
          });
            if (!isValidMongoObject(foundGood)) {
              this.res.statusCode = 400
              return this.res.json({
                success: false,
                message: "Good not found or already deleted",
              }); 
              
            }

          const goodUpdatableSet = {};
          
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
                await GoodImage.updateMany(
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

              // goodUpdatableSet.image = updateParticularGoodImage;
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
          // }
        
      // })
    // );

    let foundEstateGood = await Good.find({
      status: 1,
    },{ name: 1, _id:1, ownerName:1, ownerPhone:1,
      ownerEmail:1,
       adType:1, 
        createdOn:1, 
        "description.value":1, 
        "price.value":1,
        "image.url":1,
        "rating.value":1,
        "ads.title":1,
        "ads.category":1,
        "ads.type":1,
        "ads.ownerPhone":1,
        "ads.ownerEmail":1,
        "ads.details.value":1,
        "ads.image.url":1,
        "ads.description.value":1,
        "ads.rating.value":1});
    if (!isValidArrayOfMongoObject(foundEstateGood)) {
      foundEstateGood = [];
    }
    return this.res.json({
      success: true,
      message: "Good deleted Succesfully",
      goods: foundEstateGood,
    });
  } 


 

}
module.exports = Goods;
