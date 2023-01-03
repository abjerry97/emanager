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
const Name = require("../../model/name");
const Password = require("../../model/password");
const { isHashedString } = require("../../helpers/tools");
const PropertyDescription = require("../../model/property-description");
const PropertyPrice = require("../../model/property-price");
const PropertyImage = require("../../model/property-image");
const Property = require("../../model/property");
const PropertyOwnerDetails = require("../../model/property-owner-details");
const PropertyRating = require("../../model/property-rating");
const PropertyEstateLinking = require("../../model/property-estate-linking");
const PropertyFavourite = require("../../model/property-favourite");
const PropertyTitle = require("../../model/property-title");
const cloudinary = require("../../helpers/cloudinary");
const PropertyRatingLinking = require("../../model/food-rating-linking");
const configDoc = require("./../../config/config.json");
class Properties {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
  }

  async __addProperty() {
    const createdOn = new Date();
    // validate request

    const user = this.res.user || {};
    const userId = user._id;
    const { _id: estateId } = this.res.estate || "";
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

    const propertyTitle = this.req.body.title || "";
    const propertyDescription = this.req.body.description || "";
    const propertyPrice = this.req.body.price || "";
    const propertyStatus = this.req.body.status || "";
    const file = this.req.file;

    if (propertyTitle.length < 3) {
      return this.res.json({
        success: false,
        message: "oops!...invalid property title",
      });
    }
    if (propertyStatus.length < 1) {
      return this.res.json({
        success: false,
        message: "oops!...invalid property status",
      });
    }
    if (propertyDescription.length < 3) {
      return this.res.json({
        success: false,
        message: "oops!...invalid property description",
      });
    }
    if (propertyPrice.length < 3) {
      return this.res.json({
        success: false,
        message: "oops!...invalid property price",
      });
    }

    const newlyCreatedPropertyTitle = await new PropertyTitle({
      status: 1,
      value: propertyTitle,
      createdOn,
      createdBy: userId,
    });

    if (!isValidMongoObject(newlyCreatedPropertyTitle)) {
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Property Title",
      });
    }

    const newlyCreatedPropertyDescription = await new PropertyDescription({
      status: 1,
      value: propertyDescription,
      createdOn,
      createdBy: userId,
    });

    if (!isValidMongoObject(newlyCreatedPropertyDescription)) {
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Property Description",
      });
    }

    const newlyCreatedPropertyPrice = await new PropertyPrice({
      status: 1,
      value: propertyPrice,
      type: propertyStatus,
      createdOn,
      createdBy: userId,
    });

    if (!isValidMongoObject(newlyCreatedPropertyPrice)) {
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Property Price",
      });
    }
    const newlyCreatedPropertyRating = await new PropertyRating({
      status: 1,
      value: 0,
      createdOn,
      createdBy: userId,
    });

    if (!isValidMongoObject(newlyCreatedPropertyRating)) {
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Property Rating",
      });
    }

    const newlyCreatedPropertyEstateLinking = await new PropertyEstateLinking({
      status: 1,
      estateId,
      createdOn,
      createdBy: userId,
    });

    if (!isValidMongoObject(newlyCreatedPropertyEstateLinking)) {
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Property Estate Linking",
      });
    }
    if (!file || !file.filename) {
      return this.res.json({
        success: false,
        message: "Sorry!... Invalid Image file",
      });
    }
    const fileName = "image" + Date.now();
    let newlyCreatedPropertyImage = {};
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        //   resource_type: "image",
        public_id: `property/uploads/images/${fileName}`,
        overwrite: true,
      });

      newlyCreatedPropertyImage = await new PropertyImage({
        status: 1,
        url: result.secure_url,
        createdOn,
        createdBy: userId,
      });
    } catch (error) {
      console.log(error);
    }

    if (!isValidMongoObject(newlyCreatedPropertyImage)) {
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Property image",
      });
    }
    const newlyCreatedProperty = await new Property({
      status: 1,
      createdOn,
      isAvaliable: 1,
      category: propertyStatus,
      createdBy: userId,
    });

    if (!isValidMongoObject(newlyCreatedProperty)) {
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Property",
      });
    }

    const newlyCreatedPropertyOwnerDetails = await new PropertyOwnerDetails({
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

    if (!isValidMongoObject(newlyCreatedPropertyOwnerDetails)) {
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Property Owner Details",
      });
    }

    newlyCreatedPropertyTitle.propertyId = newlyCreatedProperty._id;
    newlyCreatedPropertyDescription.propertyId = newlyCreatedProperty._id;
    newlyCreatedPropertyPrice.propertyId = newlyCreatedProperty._id;
    newlyCreatedPropertyImage.propertyId = newlyCreatedProperty._id;
    newlyCreatedPropertyOwnerDetails.propertyId = newlyCreatedProperty._id;
    newlyCreatedPropertyEstateLinking.propertyId = newlyCreatedProperty._id;
    newlyCreatedPropertyRating.propertyId = newlyCreatedProperty._id;

    newlyCreatedProperty.title = newlyCreatedPropertyTitle.value;
    newlyCreatedProperty.description = newlyCreatedPropertyDescription;
    newlyCreatedProperty.price = newlyCreatedPropertyPrice;
    newlyCreatedProperty.image = newlyCreatedPropertyImage;
    newlyCreatedProperty.rating = newlyCreatedPropertyRating;

    (newlyCreatedProperty.ownerEmail =
      user.emails && Array.isArray(user.emails)
        ? user.emails.find((email) =>
            stringIsEqual(!!email.isPrimary && email.isPrimary, 1)
          ).value
        : ""),
      (newlyCreatedProperty.ownerPhone =
        user.phoneNumbers && Array.isArray(user.phoneNumbers)
          ? user.phoneNumbers.find((phoneNumbers) =>
              stringIsEqual(
                !!phoneNumbers.isPrimary && phoneNumbers.isPrimary,
                1
              )
            ).value
          : ""),
      await newlyCreatedPropertyTitle.save();
    await newlyCreatedPropertyDescription.save();
    await newlyCreatedPropertyPrice.save();
    await newlyCreatedPropertyImage.save();
    await newlyCreatedProperty.save();
    await newlyCreatedPropertyOwnerDetails.save();
    await newlyCreatedPropertyEstateLinking.save();
    await newlyCreatedPropertyRating.save();

    return this.res.json({
      success: true,
      message: "Property Created Succesfully",
      property: newlyCreatedProperty,
    });
  }

  async __rateProperty() {
    const createdOn = new Date();
    // validate request

    const user = this.res.user || {};
    const userId = user._id;
    const { _id: estateId } = this.res.estate || "";
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

    const propertyId = this.req.params.propertyId || "";
    const propertyRating = this.req.query.rating || "";

    if (!isValidMongoObjectId(propertyId)) {
      return this.res.json({
        success: false,
        message: "sorry!...Invalid selected property id",
      });
    }

    if (
      !propertyRating ||
      isNaN(propertyRating) ||
      propertyRating > 5 ||
      propertyRating < 0
    ) {
      return this.res.json({
        success: false,
        message: "invalid rating (hint 0-5)",
      });
    }

    let foundPropertyRating = await PropertyRating.findOne({
      status: 1,
      propertyId,
    });

    if (!isValidMongoObject(foundPropertyRating)) {
      const foundProperty = await Property.findOne({
        status: 1,
        _id: propertyId,
      });

      if (!isValidMongoObject(foundProperty)) {
        return this.res.json({
          success: false,
          message: "property not found",
        });
      }

      foundPropertyRating = await new PropertyRating({
        status: 1,
        propertyId,
        value: 0,
        totalRating: 0,
        totalNumberOfRating: 0,
      });

      await foundPropertyRating.save();
    }

    const foundPropertyRatingLinking = await PropertyRatingLinking.findOne({
      status: 1,
      propertyId,
      ownerId: user._id,
    });

    if (isValidMongoObject(foundPropertyRatingLinking)) {
      return this.res.json({
        success: false,
        message: "You have already rated this Property",
      });
    }

    const newlyCreatedPropertyRatingLinking = await new PropertyRatingLinking({
      status: 1,
      propertyId,
      value: propertyRating,
      estateId,
      ownerId: user._id,
      createdOn,
    });

    if (!isValidMongoObject(newlyCreatedPropertyRatingLinking)) {
      return this.res.json({
        success: false,
        message: "Property Rating not Succesful",
      });
    }
    await newlyCreatedPropertyRatingLinking.save();
    let updatedProperty = {};
    try {
      const updatedPropertyRating = await PropertyRating.findOneAndUpdate(
        {
          status: "1",
          propertyId,
          value: { $gte: 0 },
          totalRating: { $gte: 0 },
        },
        {
          $inc: { totalRating: Number(propertyRating), totalNumberOfRating: 1 },
          $set: {
            value:
              (Number(foundPropertyRating.totalRating) +
                Number(propertyRating)) /
                (foundPropertyRating.totalNumberOfRating + 1) ||
              foundPropertyRating.value,
          },
        },
        { new: true }
      );
      updatedProperty = await Property.findOneAndUpdate(
        {
          status: 1,
          _id: propertyId,
        },
        {
          $set: {
            rating: updatedPropertyRating,
          },
        },
        { new: true }
      );
    } catch (error) {
      console.log(error);
    }

    return this.res.json({
      success: true,
      message: "Property Rated Succesfully",
      property: updatedProperty,
    });
  }
  async __getProperty() {
    const createdOn = new Date();
    // if
    //   (isNaN(Number(this.req.query["limit"])))
    //  {
    //   return this.res.json({
    //     success: false,
    //     message: "Invalid Search params",
    //   });
    // }
    const pageSize = this.req.query["pageSize"] || "";
    const page = this.req.query["page"] || "";
    const category = this.req.query["status"] || "";

    // const categoryIndex = configDoc.propertyStatus.findIndex((status) =>
    //   stringIsEqual(status.toLowerCase(), category.toLowerCase())
    // );

    const query = {
      status: 1,
    };

    if (category.length > 0) {
      query.category = category;
    } 
    const foundProperty = await Property.find(query, {
      title: 1,
      category: 1,
      _id: 1,
      ownerName: 1,
      ownerPhone: 1,
      ownerEmail: 1,
      isAvaliable: 1,
      adType: 1,
      type: 1,
      createdOn: 1,
      isAvaliable: 1,
      isPublished: 1,
      isActive: 1, 
      "ads.isAvaliable": 1 ,
      "ads.isPublished": 1,
      "ads.isActive": 1,
      "description.value": 1,
      "price.value": 1,
      "image.url": 1,
      "rating.value": 1,
      "ads.status": 1,
      "ads.title": 1,
      "ads.category": 1,
      "ads.type": 1,
      "ads.group": 1,
      "ads.ownerPhone": 1,
      "ads.ownerEmail": 1,
      "ads.ownerName": 1,
      "ads.location": 1,
      "ads.bedroom": 1,
      "ads.furnishedStatus": 1,
      "ads.bathroom": 1,
      "ads.parkingSpace": 1,
      "ads.price.value": 1,
      "ads.details.value": 1,
      "ads.image.url": 1,
      "ads.description.value": 1,
      "ads.rating.value": 1,
    })
      .limit(pageSize)
      .skip(pageSize * page);
    // if (!isValidMongoObject(foundEstates)) {
    //   return this.res.json({
    //     success: false,
    //     message: "Estates not found",
    //   });
    // }
    if (!isValidArrayOfMongoObject(foundProperty)) {
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
  async __findProperty() {
    const createdOn = new Date();
    // validate request

    const user = this.res.user || {};
    const userId = user._id;
    const { _id: estateId } = this.res.estate || "";
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
    const name = this.req.query["name"] || "";
    if (name.length < 3) {
      return this.res.json({
        success: false,
        message: "Property not found",
        properties: [],
      });
    }

    // validate name
    const foundProperty = await Property.find(
      {
        status: 1,
        name: { $regex: new RegExp(`${name}`, "i") },
      },
      {
        title: 1,
        category: 1,
        _id: 1,
        ownerName: 1,
        ownerPhone: 1,
        ownerEmail: 1,
        isAvaliable: 1,
        adType: 1,
        type: 1,
        createdOn: 1,
         isAvaliable: 1,
        isPublished: 1,
        isActive: 1, 
        "ads.isAvaliable": 1 ,
        "ads.isPublished": 1,
        "ads.isActive": 1,
        "description.value": 1,
        "price.value": 1,
        "image.url": 1,
        "rating.value": 1,
        "ads.status": 1,
        "ads.title": 1,
        "ads.category": 1,
        "ads.type": 1,
        "ads.group": 1,
        "ads.ownerPhone": 1,
        "ads.ownerEmail": 1,
        "ads.ownerName": 1,
        "ads.location": 1,
        "ads.bedroom": 1,
        "ads.furnishedStatus": 1,
        "ads.bathroom": 1,
        "ads.parkingSpace": 1,
        "ads.price.value": 1,
        "ads.details.value": 1,
        "ads.image.url": 1,
        "ads.description.value": 1,
        "ads.rating.value": 1,
      }
    );

    return this.res.json({
      success: true,
      message: "Property found",
      properties: foundProperty,
    });
  }






  async __findPropertyByID() {
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
    const propertyId = this.req.params.propertyId || "";
    if (!isValidMongoObjectId(propertyId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Please provide a valid property id param", 
      });
    }

    // validate name
    const foundProperty  = await Property.findOne({
      status: 1,
      _id:propertyId,
    },
    {
      title: 1,
      category: 1,
      _id: 1,
      ownerName: 1,
      ownerPhone: 1,
      ownerEmail: 1,
      isAvaliable: 1,
      adType: 1,
      type: 1,
      createdOn: 1,
      isAvaliable: 1,
      isPublished: 1,
      isActive: 1, 
      "ads.isAvaliable": 1 ,
      "ads.isPublished": 1,
      "ads.isActive": 1,
      "description.value": 1,
      "price.value": 1,
      "image.url": 1,
      "rating.value": 1,
      "ads.status": 1,
      "ads.title": 1,
      "ads.category": 1,
      "ads.type": 1,
      "ads.group": 1,
      "ads.ownerPhone": 1,
      "ads.ownerEmail": 1,
      "ads.ownerName": 1,
      "ads.location": 1,
      "ads.bedroom": 1,
      "ads.furnishedStatus": 1,
      "ads.bathroom": 1,
      "ads.parkingSpace": 1,
      "ads.price.value": 1,
      "ads.details.value": 1,
      "ads.image.url": 1,
      "ads.description.value": 1,
      "ads.rating.value": 1,
    }
  );
    if (!isValidMongoObject(foundProperty)) {
      this.res.statusCode = 404
      return this.res.json({
        success: false,
        message: "Property not found", 
      });
    }

    return this.res.json({
      success: true,
      message: "Property found",
      property: foundProperty,
    });
  }
   























  async __updateProperty() {
    const createdOn = new Date();
    const userId = (this.res.user && this.res.user._id) || "";
    const { _id: estateId } = this.res.estate || "";

    if (!isValidMongoObjectId(userId)) {
      return this.res.json({
        success: false,
        message: "Invalid user",
      });
    }
    if (!isValidMongoObjectId(estateId)) {
      return this.res.json({
        success: false,
        message: "Invalid estate id",
      });
    }

    const foundProperty = await Property.find({});

    const pushfoundProperty = await Promise.all(
      foundProperty.map(async (property, index) => {
        const contextId = property.createdBy;
        const particularPropertyId = property._id;
        if (isValidMongoObjectId(contextId)) {
          const updates = {};
          const foundPropertyPhone = await PhoneNumber.findOne({
            ownerId: contextId,
            status: 1,
            isPrimary: 1,
          });
          if (isValidMongoObject(foundPropertyPhone)) {
            updates.ownerPhone =
              foundPropertyPhone?.countryCode + foundPropertyPhone?.value;
          }
          const foundPropertyEmail = await Email.findOne({
            ownerId: contextId,
            status: 1,
            isPrimary: 1,
          });

          if (isValidMongoObject(foundPropertyEmail)) {
            updates.ownerEmail = foundPropertyEmail?.value;
          }

          const foundPropertyRating = await PropertyRating.findOne({
            status: 1,
            propertyId: contextId,
            isPrimary: 1,
          });
          if (isValidMongoObject(foundPropertyRating)) {
            updates.rating = foundPropertyRating;
          }

          try {
            const updateProperty = await Property.updateOne(
              {
                _id: particularPropertyId,
              },
              {
                $set: updates,
              }
            );
          } catch (error) {
            console.log(error);
          }
        }
      })
    );

    return this.res.json({
      success: true,
      message: "Property Updated Successfully",
    });
  }

  async __addPropertyToFavourite() {
    const createdOn = new Date();
    // validate request

    const user = this.res.user || {};
    const userId = user._id;
    const { _id: estateId } = this.res.estate || "";
    const { propertyId } = this.req.params || "";

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
    if (!isValidMongoObjectId(propertyId)) {
      return this.res.json({
        success: false,
        message: "sorry!...Invalid property id",
      });
    }

    const foundPropertyFavourite = await PropertyFavourite.findOne({
      status: 1,
      propertyId,
      userId,
      estateId,
    });

    if (!isValidMongoObject(foundPropertyFavourite)) {
      const newPropertyFavourite = await new PropertyFavourite({
        status: 1,
        propertyId,
        userId,
        estateId,
        createdOn,
        createdBy: userId,
      });

      if (!isValidMongoObject(newPropertyFavourite)) {
        return this.res.json({
          success: false,
          message: "sorry!...Error creating Property Favourite",
        });
      }

      await newPropertyFavourite.save();
    }

    return this.res.json({
      success: true,
      message: "Property successfully added to favourite",
    });
  }

  async __removePropertyFromFavourite() {
    const createdOn = new Date();
    // validate request

    const user = this.res.user || {};
    const userId = user._id;
    const { _id: estateId } = this.res.estate || "";
    const { propertyId } = this.req.params || "";

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
    if (!isValidMongoObjectId(propertyId)) {
      return this.res.json({
        success: false,
        message: "sorry!...Invalid property id",
      });
    }
    try {
      const removePropertyFavourite = await PropertyFavourite.updateMany(
        {
          status: 1,
          estateId,
          userId,
          propertyId,
        },
        { $set: { status: 0 } }
      );
    } catch (err) {
      console.log(err);
    }

    return this.res.json({
      success: true,
      message: "Property successfully removed from favourite",
    });
  }

  async __getUserEstatePropertyFavourite() {
    const createdOn = new Date();
    // validate request

    const user = this.res.user || {};
    const userId = user._id;
    const { _id: estateId } = this.res.estate || "";

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

    const userEstatePropertyFavourite = await PropertyFavourite.find({
      status: 1,
      estateId,
      userId,
    });

    if (!isValidArrayOfMongoObject(userEstatePropertyFavourite)) {
      return this.res.json({
        success: true,
        message: "Property favourite gotten successfully",
        propertyFavourites: [],
      });
    }

    return this.res.json({
      success: true,
      message: "Property favourite gotten successfully",
      propertyFavourites: userEstatePropertyFavourite,
    });
  }

  async __getEstateProperty() {
    const createdOn = new Date();
    // validate request
    const user = this.res.user || {};
    const { _id: userId = "" } = user;
    if (!isValidMongoObject(user)) {
      return this.res.json({
        success: false,
        message: "Sorry!...user not found!!!",
      });
    }
    const { _id: estateId } = this.res.estate || "";
    let { estateId: selectedEstateId } = this.req.params || null;

    if (!isValidMongoObjectId(estateId)) {
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid estate id",
      });
    }
    if (!isValidMongoObjectId(userId)) {
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid user",
      });
    }
    if (!isValidMongoObjectId(selectedEstateId)) {
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid selected estate id",
      });
    }

    const foundEstateProperty = await PropertyEstateLinking.find({
      status: 1,
      estateId: selectedEstateId,
    });
    if (!isValidArrayOfMongoObject(foundEstateProperty)) {
      return this.res.json({
        success: true,
        message: "Property gotten Succesfully",
        properties: [],
      });
    }

    return this.res.json({
      success: true,
      message: "Property gotten Succesfully",
      properties: foundEstateProperty,
    });
  }

  async __deleteEstateProperty() {
    const createdOn = new Date();
    // validate request
    const admin = this.res.admin || {};
    const { _id: adminId = "" } = admin;
    if (!isValidMongoObject(admin)) {
      return this.res.json({
        success: false,
        message: "Sorry!...admin not found!!!",
      });
    }
    const { _id: estateId } = this.res.estate || "";

    if (!isValidMongoObjectId(estateId)) {
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid estate id",
      });
    }
    if (!isValidMongoObjectId(adminId)) {
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid admin",
      });
    }

    const contextId = this.req.body.propertyId || "";
    
    if (!isValidMongoObjectId(contextId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "you need to provide a valid property Id",
      });
    }

    
    let selectedProperty = await Property.findOne({
      status: 1,
      _id:contextId
    });

        
    if (!isValidMongoObject(selectedProperty)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "selected property not found or already deleted",
      });
    }
    // const propertyUpdates = await Promise.all(
      // (propertiesToUpdate || []).map(async (contextId, index) => {
        if (isValidMongoObjectId(contextId)) {
          // const estateProperty = await PropertyEstateLinking.findOne({
          //   status: 1,
          //   propertyId: contextId,
          //   estateId,
          // });
          const propertyUpdatableSet = {};
          //  if (isValidMongoObject(estateProperty)) {     
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
            console.log(propertyUpdatableSet);
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
         
         
         
            // }
        }
      // })
    
    
     
     
      // );


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
}
module.exports = Properties;
