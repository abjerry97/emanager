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
const Password = require("../../model/password");
const cloudinary = require("../../helpers/cloudinary");
const { isHashedString } = require("../../helpers/tools");
const FoodName = require("../../model/food-name");
const FoodDescription = require("../../model/food-description");
const FoodPrice = require("../../model/food-price");
const FoodImage = require("../../model/food-image");
const Food = require("../../model/food");
const FoodOwnerDetails = require("../../model/food-owner-details");
const FoodRating = require("../../model/food-rating");
const FoodEstateLinking = require("../../model/food-estate-linking");
const FoodFavourite = require("../../model/food-favourite");
const FoodRatingLinking = require("../../model/food-rating-linking");
const FoodAdPostPrice = require("../../model/food-ad-post-price");

class Foods {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
  }

  async __addFood() {
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
    // if (!isValidMongoObjectId(estateId)) {
    //   this.res.statusCode = 400
    //   return this.res.json({
    //     success: false,
    //     message: "sorry!...Invalid estate id",
    //   });
    // }

    const foodName = this.req.body.name || "";
    const foodDescription = this.req.body.description || "";
    const foodPrice = this.req.body.price || "";
    const files = this.req.files;

    if (foodName.length < 3) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "oops!...invalid food name",
      });
    }
    if (foodDescription.length < 3) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "oops!...invalid food description",
      });
    }
    if (foodPrice.length < 3) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "oops!...invalid food price",
      });
    }

    const newlyCreatedFoodName = await new FoodName({
      status: 1,
      value: foodName,
      createdOn,
      createdBy: userId,
    });

    if (!isValidMongoObject(newlyCreatedFoodName)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Food Name",
      });
    }

    const newlyCreatedFoodDescription = await new FoodDescription({
      status: 1,
      value: foodDescription,
      createdOn,
      createdBy: userId,
    });

    if (!isValidMongoObject(newlyCreatedFoodDescription)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Food Description",
      });
    }

    const newlyCreatedFoodPrice = await new FoodPrice({
      status: 1,
      value: foodPrice,
      createdOn,
      createdBy: userId,
    });

    if (!isValidMongoObject(newlyCreatedFoodPrice)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Food Price",
      });
    }
    const newlyCreatedFoodRating = await new FoodRating({
      status: 1,
      value: 0,
      totalRating: 0,
      totalNumberOfRating: 0,
      createdOn,
      createdBy: userId,
    });

    if (!isValidMongoObject(newlyCreatedFoodRating)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Food Rating",
      });
    }

    const newlyCreatedFoodEstateLinking = await new FoodEstateLinking({
      status: 1,
      estateId,
      createdOn,
      createdBy: userId,
    });

    if (!isValidMongoObject(newlyCreatedFoodEstateLinking)) {
      this.res.statusCode = 500
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Food Estate Linking",
      });
    }
 
    if (!files || !Array.isArray(files) || files.length < 1) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Sorry!... Invalid Image file",
      });
    }

    let newlyCreatedFoodImages = await this.__createFoodImage(userId,files)

    if (!isValidArrayOfMongoObject(newlyCreatedFoodImages)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "error while creating Food image please try again",
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
          stringIsEqual(
            !!phoneNumbers.isPrimary && phoneNumbers.isPrimary,
            1
          )
        )
      : {};

      const ownerPhone = `${unformattedOwnerPhone?.countryCode}` + `${unformattedOwnerPhone?.value}`
    const newlyCreatedFood = await new Food({
      status: 1,
      ownerPhone,
      ownerEmail,
      ownerName:  user?.name?.value,
      createdOn,
      createdBy: userId,
    });

    if (!isValidMongoObject(newlyCreatedFood)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Food",
      });
    }

    const newlyCreatedFoodOwnerDetails = await new FoodOwnerDetails({
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

    if (!isValidMongoObject(newlyCreatedFoodOwnerDetails)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Food Owner Details",
      });
    }

    newlyCreatedFoodName.foodId = newlyCreatedFood._id;
    newlyCreatedFoodDescription.foodId = newlyCreatedFood._id;
    newlyCreatedFoodPrice.foodId = newlyCreatedFood._id;
    newlyCreatedFoodOwnerDetails.foodId = newlyCreatedFood._id;
    newlyCreatedFoodEstateLinking.foodId = newlyCreatedFood._id;
    newlyCreatedFoodRating.foodId = newlyCreatedFood._id;
    try {
      const pushnewlyCreatedFoodImages = await Promise.all(
        newlyCreatedFoodImages.map(async (newlyCreatedFoodImage) => {
          try {
            newlyCreatedFoodImage.foodId = newlyCreatedFood._id;
            await newlyCreatedFoodImage.save();
          } catch (err) {
            console.log(err);
          }
        })
      );
    } catch (error) {
      console.log(error);
    }
    newlyCreatedFood.name = newlyCreatedFoodName.value;
    newlyCreatedFood.description = newlyCreatedFoodDescription;
    newlyCreatedFood.price = newlyCreatedFoodPrice;
    newlyCreatedFood.image = newlyCreatedFoodImages;
    newlyCreatedFood.rating = newlyCreatedFoodRating;

    await newlyCreatedFoodName.save();
    await newlyCreatedFoodDescription.save();
    await newlyCreatedFoodPrice.save(); 
    await newlyCreatedFood.save();
    await newlyCreatedFoodOwnerDetails.save();
    await newlyCreatedFoodEstateLinking.save();
    await newlyCreatedFoodRating.save();

    return this.res.json({
      success: true,
      message: "Food Created Succesfully",
      food: newlyCreatedFood,
    });
  }
  async __createFoodImage(userId,files){
    const createdOn = new Date()
 


    let newlyCreatedFoodAdImages =[]
    const pushImages = await Promise.all(
      (files || []).map(async (image, index) => {
        const fileName = "image" + Date.now() + index;
        try {
          const result = await cloudinary.uploader.upload(image.path, {
            //   resource_type: "image",
            public_id: `foods/uploads/images/${fileName}`,
            overwrite: true,
          });
  
          newlyCreatedFoodAdImages[index] = await new FoodImage({
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
  
    return newlyCreatedFoodAdImages
  }
  
  async __rateFood() {
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

    const foodId = this.req.params.foodId || "";
    const foodRating = this.req.query.rating || "";

    if (!isValidMongoObjectId(foodId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "sorry!...Invalid selected food id",
      });
    }

    if (!foodRating || isNaN(foodRating) || foodRating > 5 || foodRating < 0) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "invalid rating (hint 0-5)",
      });
    }

    let foundFoodRating = await FoodRating.findOne({
      status: 1,
      foodId,
    });

    if (!isValidMongoObject(foundFoodRating)) {

      const foundFood = await Food.findOne({
        status: 1,
        _id:foodId, 
      });


      if (!isValidMongoObject(foundFood)) {
        this.res.statusCode = 400
        return this.res.json({
          success: false,
          message: "food not found",
        });
      }

      foundFoodRating = await new FoodRating({
        status: 1,
        foodId,
        value: 0,
        totalRating: 0,
        totalNumberOfRating: 0,
      });

      await foundFoodRating.save();
    }

    const foundFoodRatingLinking = await FoodRatingLinking.findOne({
      status: 1,
      foodId,
      ownerId: user._id,
    });

    if (isValidMongoObject(foundFoodRatingLinking)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "You have already rated this Food",
      });
    }

    const newlyCreatedFoodRatingLinking = await new FoodRatingLinking({
      status: 1,
      foodId,
      value: foodRating,
      estateId,
      ownerId: user._id,
      createdOn,
    });

    if (!isValidMongoObject(newlyCreatedFoodRatingLinking)) {
      this.res.statusCode = 500
      return this.res.json({
        success: false,
        message: "Food Rating not Succesful",
      });
    }
    await newlyCreatedFoodRatingLinking.save();
    let updatedFood= {}
    try {
      const updatedFoodRating = await FoodRating.findOneAndUpdate(
        {
          status: "1",
          foodId,
          value: { $gte: 0 },
          totalRating: { $gte: 0 },
        },
        {
          $inc: { totalRating: Number(foodRating), totalNumberOfRating: 1 },
          $set: {
            value:
              (Number(foundFoodRating.totalRating) + Number(foodRating)) /
                (foundFoodRating.totalNumberOfRating + 1) ||
              foundFoodRating.value,
          },
        },
        { new: true }
      ); 
       updatedFood = await Food.findOneAndUpdate(
        {
          status: 1,
          _id: foodId,
        },
        {
          $set: {
            rating: updatedFoodRating,
          },
        },
        { new: true }
      );
    } catch (error) {
      console.log(error);
    }

 
    return this.res.json({
      success: true,
      message: "Food Rated Succesfully", 
      food: updatedFood
    });
  }

  async __getFoods() {
    const createdOn = new Date();
    // if
    //   (isNaN(Number(this.req.query["limit"])))
    //  {
    //   return this.res.json({
    //     success: false,
    //     message: "Invalid Search params",
    //   });
    // }

    const foundFoods = await Food.find({status:1}
      ,{ name: 1, _id:1, ownerName:1, ownerPhone:1,
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
        "ads.rating.value":1}
        );
    // if (!isValidMongoObject(foundEstates)) {
    //   return this.res.json({
    //     success: false,
    //     message: "Estates not found",
    //   });
    // }
    if (!isValidArrayOfMongoObject(foundFoods)) {
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
  async __findFood() {
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
    // if (!isValidMongoObjectId(estateId)) {
    //   return this.res.json({
    //     success: false,
    //     message: "sorry!...Invalid estate id",
    //   });
    // }
    const name = this.req.query["name"] || "";
    if (name.length < 3) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Foods not found",
        foods: [],
      });
    }

    // validate name
    const foundFoods = await Food.find({
      status: 1,
      name: { $regex: new RegExp(`${name}`, "i") },
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

    return this.res.json({
      success: true,
      message: "Foods found",
      foods: foundFoods,
    });
  }
  async __findFoodByID() {
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
    const foodId = this.req.params.foodId || "";
    if (!isValidMongoObjectId(foodId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Please provide a valid food id param", 
      });
    }

    // validate name
    const foundFood  = await Food.findOne({
      status: 1,
      _id:foodId,
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

         
 
    if (!isValidMongoObject(foundFood)) {
      this.res.statusCode = 404
      return this.res.json({
        success: false,
        message: "Food not found", 
      });
    }
    foundFood
    return this.res.json({
      success: true,
      message: "Food found",
      food: foundFood,
    });
  }
  async __addFoodToFavourite() {
    const createdOn = new Date();
    // validate request

    const user = this.res.user || {};
    const userId = user._id;
    const { _id: estateId } = this.res.estate || "";
    const { foodId } = this.req.params || "";

    if (!isValidMongoObjectId(userId)) {
      this.res.statusCode = 409
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
    if (!isValidMongoObjectId(foodId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "sorry!...Invalid food id",
      });
    }


    const foundFood = await Food.findOne({
      status: 1,
      _id:foodId, 
    });

    if (!isValidMongoObject(foundFood)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "food not found or already deleted",
      });
    }


    const foundFoodFavourite = await FoodFavourite.findOne({
      status: 1,
      foodId,
      userId,
      estateId,
    });

    if (!isValidMongoObject(foundFoodFavourite)) {
      const newFoodFavourite = await new FoodFavourite({
        status: 1,
        foodId,
        userId,
        estateId,
        createdOn,
        createdBy: userId,
      });

      if (!isValidMongoObject(newFoodFavourite)) {
        this.res.statusCode = 400
        return this.res.json({
          success: false,
          message: "sorry!...Error creating Food Favourite",
        });
      }

      await newFoodFavourite.save();
    }

    return this.res.json({
      success: true,
      message: "Foods successfully added to favourite",
    });
  }

  async __removeFoodFromFavourite() {
    const createdOn = new Date();
    // validate request

    const user = this.res.user || {};
    const userId = user._id;
    const { _id: estateId } = this.res.estate || "";
    const { foodId } = this.req.params || "";

    if (!isValidMongoObjectId(userId)) {
      return this.res.json({
        success: false,
        message: "sorry!...Invalid user",
      });
    }
    if (!isValidMongoObjectId(estateId)) {
      return this.res.json({
        success: false,
        message: "sorry!...Invalid estate id",
      });
    }
    if (!isValidMongoObjectId(foodId)) {
      return this.res.json({
        success: false,
        message: "sorry!...Invalid food id",
      });
    }
    try {
      const removeFoodFavourite = await FoodFavourite.updateMany(
        {
          status: 1,
          estateId,
          userId,
          foodId,
        },
        { $set: { status: 0 } }
      );
    } catch (err) {
      console.log(err);
    }

    return this.res.json({
      success: true,
      message: "Foods successfully removed from favourite",
    });
  }

  async __getUserEstateFoodFavourite() {
    const createdOn = new Date();
    // validate request

    const user = this.res.user || {};
    const userId = user._id;
    const { _id: estateId } = this.res.estate || "";

    if (!isValidMongoObjectId(userId)) {
      this.res.statusCode = 409
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

    const userEstateFoodFavourite = await FoodFavourite.find({
      status: 1,
      estateId,
      userId,
    },{status:1,foodId:1,estateId:1});

    if (!isValidArrayOfMongoObject(userEstateFoodFavourite)) {
      return this.res.json({
        success: true,
        message: "Food favourite gotten successfully",
        foodFavourites: [],
      });
    }

    return this.res.json({
      success: true,
      message: "Food favourite gotten successfully",
      foodFavourites: userEstateFoodFavourite,
    });
  }

  async __getEstateFoods() {
    const createdOn = new Date();
    // validate request
    const user = this.res.user || {};
    const { _id: userId = "" } = user;
    if (!isValidMongoObject(user)) {
      this.res.statusCode = 400
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

    const foundEstateFoods = await FoodEstateLinking.find({
      status: 1,
      estateId: selectedEstateId,
    });
    if (!isValidArrayOfMongoObject(foundEstateFoods)) {
      return this.res.json({
        success: true,
        message: "Foods gotten Succesfully",
        foods: [],
      });
    }

    return this.res.json({
      success: true,
      message: "Foods gotten Succesfully",
      foods: foundEstateFoods,
    });
  }
  async __adminGetEstateFoods() {
    const createdOn = new Date();
    // validate request
    const admin = this.res.admin || {};
    const { _id: adminId = "" } = admin;
    if (!isValidMongoObject(user)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Sorry!...admin not found!!!",
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
    if (!isValidMongoObjectId(adminId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid admin",
      });
    }
    if (!isValidMongoObjectId(selectedEstateId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid selected estate id",
      });
    }

    const foundEstateFoods = await FoodEstateLinking.find({
      status: 1,
      estateId: selectedEstateId,
    });
    if (!isValidArrayOfMongoObject(foundEstateFoods)) {
      return this.res.json({
        success: true,
        message: "Foods gotten Succesfully",
        foods: [],
      });
    }

    return this.res.json({
      success: true,
      message: "Foods gotten Succesfully",
      foods: foundEstateFoods,
    });
  }


  async __deleteFood() {
    const createdOn = new Date();
    // validate request
    const admin = this.res.admin || {};
    const { _id: adminId = "" } = admin;
    if (!isValidMongoObject(admin)) {
      this.res.statusCode = 400
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
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid admin",
      });
    }

    const contextId = this.req.body.foodId || "";

    if (!isValidMongoObjectId(contextId)) {
      this.res.statusCode = 400
  return this.res.json({
    success: false,
    message: "Sorry!...Invalid food id",
  }); 
    }


      const foundFood = await Food.findOne({
        status: 1,
        _id: contextId,
    
      });
        if (!isValidMongoObject(foundFood)) {
          this.res.statusCode = 400
          return this.res.json({
            success: false,
            message: "Food not found or already deleted",
          }); 
          
        }

    
    // const foodUpdates = await Promise.all(
    //   (foodsToUpdate || []).map(async (contextId, index) => {

        //  if (isValidMongoObjectId(contextId)) {
        //   const estateFood = await FoodEstateLinking.findOne({
        //     status: 1,
        //     foodId: contextId,
        //     estateId,
        //   });
          const foodUpdatableSet = {};
          // if (isValidMongoObject(estateFood)) {
          

        

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
                foodUpdatableSet.description = updateParticularFoodDescription
            } catch (error) {
              console.log(error);
            }

            try {
              const updateParticularFoodPrice = await FoodPrice.findOneAndUpdate(
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
              
              foodUpdatableSet.price = updateParticularFoodPrice
            } catch (error) {
              console.log(error);
            }

            try {
              const updateParticularFoodImage = await FoodImage.updateMany(
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
              
              // foodUpdatableSet.image = updateParticularFoodImage
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
                 foodUpdatableSet.rating = updateParticularFoodOwnerDetails
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
              foodUpdatableSet.status = 0
         
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
          // }
        
        
        
         

    let foundEstateFood = await Food.find({
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
    if (!isValidArrayOfMongoObject(foundEstateFood)) {
      foundEstateFood = [];
    }
    return this.res.json({
      success: true,
      message: "Food deleted Succesfully",
      foods: foundEstateFood,
    });
  }

 

 











 
 
  async __getFoodPostPrice() {
    const createdOn = new Date();
 
    const existingFoodAdPostPrice = await FoodAdPostPrice.findOne({
      status: 1,
    });

    if (!isValidMongoObject(existingFoodAdPostPrice)) {
      this.res.statusCode = 409;
      return this.res.json({
        success: false,
        message: "Food Ad Price not yet created",
      });
    }

   

    return this.res.json({
      success: true,
      message: "Price gotten Succesfully",
      adPrice: existingFoodAdPostPrice,
    });
  }
  async __updateFoodPostPrice() {
    const createdOn = new Date();
    // validate request

    const admin = this.res.admin || {};
    const { _id: adminId } = admin || "";

    if (!isValidMongoObject(admin)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "sorry, admin not found!!!",
      });
    }
    if (!isValidMongoObjectId(adminId)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Invalid admin",
      });
    }

 
    const newAmount = this.req.body.amount; 
 
    if (isNaN(newAmount)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Provide a valid new Amount",
      });
    }
 
    const existingFoodAdPostPrice = await FoodAdPostPrice.findOne({
      status: 1,
    });

    if (!isValidMongoObject(existingFoodAdPostPrice)) {
      this.res.statusCode = 404;
      const newFoodAdPostPrice = await new FoodAdPostPrice({
        status: 1, //0:deleted,1:active
        currency: 0,
        value: newAmount,
        type: "food",
        createdOn,
        createdBy: adminId,
      });
      if (!isValidMongoObject(newFoodAdPostPrice)) {
        this.res.statusCode = 500;
        return this.res.json({
          success: false,
          message: "property ad price not created",
        });
      }
      await newFoodAdPostPrice.save();

      return this.res.json({
        success: true,
        message: "Price updated Succesfully",
        adPrice: newFoodAdPostPrice,
      });
    }
 
    try {
      const existingFoodAdPostPrice = await FoodAdPostPrice.updateMany(
        {
          status: 1,
        },
        {
          $set: {
            status: 0,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
   

    const newFoodAdPostPrice = await new FoodAdPostPrice({
      status: 1, //0:deleted,1:active
      currency: 0,
      value: newAmount,
      type: "food",
      createdOn,
      createdBy: adminId,
    });
    if (!isValidMongoObject(newFoodAdPostPrice)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "property ad price not created",
      });
    }
    await newFoodAdPostPrice.save();

    return this.res.json({
      success: true,
      message: "Price updated Succesfully",
      adPrice: newFoodAdPostPrice,
    });
  } 
}
module.exports = Foods;
