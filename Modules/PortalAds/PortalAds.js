const crypto = require("crypto");
const {
  stringIsEqual,
  isValidMongoObject,
  isValidArrayOfMongoObject,
  isValidMongoObjectId,
} = require("../../helpers/validators");
const cloudinary = require("../../helpers/cloudinary");
const AdDetails = require("../../model/ad-details");
const AdDescription = require("../../model/ad-description");
const PropertyAd = require("../../model/property-ad");
const AdImage = require("../../model/ad-image");
const PropertyTitle = require("../../model/property-title");
const PropertyDescription = require("../../model/property-description");
const PropertyPrice = require("../../model/property-price");
const PropertyRating = require("../../model/property-rating");
const PropertyEstateLinking = require("../../model/property-estate-linking");
const PropertyImage = require("../../model/property-image");
const Property = require("../../model/property");
const PropertyOwnerDetails = require("../../model/property-owner-details");
const portalConfig = require("../../config/portalConfig.json");
const PropertyAdPrice = require("../../model/property-ad-price");
const PhoneNumber = require("../../model/phone-number");
const Email = require("../../model/email");
const Name = require("../../model/name");
const PropertyAdPostPrice = require("../../model/property-ad-post-price");
const PropertyAdPayment = require("../../model/property-ad-payment");
const PropertyAdCheckout = require("../../model/property-ad-checkout");
const UserWalletTransaction = require("../../model/emanager-user-wallet-transaction");
const secret = process.env.PAYSTACK_SECRET || "qpay"
class PortalAds {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
  }
  async __createPostAd() {
    const createdOn = new Date();
    const user = this.res.user || {};
    const userId = user._id;
    if (!isValidMongoObjectId(userId)) {
      this.res.statusCode = 401;
      return this.res.json({
        success: false,
        message: "sorry!...Invalid user",
      });
    }
    const {
      adDescription = "",
      location = "",
      title = "",
      category = "",
      bedroom = "0",
      bathroom = "0",
      furnishedStatus = "",
      parkingSpace = "",
      price = "0",
    } = this.req.body || {};
    const files = this.req.files;
    const propertyConfig = portalConfig?.propertyCategory;
    if (adDescription.length < 3) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "oops!...invalid ad Description",
      });
    }

    if (location.length < 3) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "oops!...invalid location",
      });
    }
    if (isNaN(price)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message:
          "invalid price specified, please Provide a valid property price",
      });
    }
    if (title.length < 3) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "oops!...invalid title",
      });
    }

    if (furnishedStatus.length < 3) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "oops!...invalid specified funished Status ",
      });
    }

    if (parkingSpace.length < 3) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "oops!...invalid specified parking Space, hint(4 cars)  ",
      });
    }

    if (!files || !Array.isArray(files) || files.length < 1) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Sorry!... Invalid Image file",
      });
    }

    const newlyCreatedAdDescription = await new AdDescription({
      status: 1,
      value: adDescription,
      createdOn,
      createdBy: userId,
    });

    if (!isValidMongoObject(newlyCreatedAdDescription)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Ad Description",
      });
    }
    const newlyCreatedPropertyAdPrice = await new PropertyAdPrice({
      status: 1,
      value: price,
      type: category,
      createdOn,
      createdBy: userId,
    });

    if (!isValidMongoObject(newlyCreatedPropertyAdPrice)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Sorry! error while creating price",
      });
    }

    const newlyCreatedPropertyAd = await new PropertyAd({
      status: 1,
      title,
      type: propertyConfig[category.trim()]?.type,
      category: propertyConfig[category.trim()]?.category,
      group: category,
      location,
      bedroom,
      bathroom,
      ownerName: user?.name?.value,
      furnishedStatus,
      parkingSpace,
      createdOn,
      createdBy: userId,
    });

    if (!isValidMongoObject(newlyCreatedPropertyAd)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Property Ad ",
      });
    }

    let newlyCreatedPostAdImages = await this.__createAdImage(
      newlyCreatedPropertyAd._id,
      userId,
      files
    );

    if (!isValidArrayOfMongoObject(newlyCreatedPostAdImages)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Sorry! error while creating PostAd image",
      });
    }

    const addProperty = await this.__addProperty(
      title,
      adDescription,
      price,
      propertyConfig[category.trim()]?.category,
      newlyCreatedPostAdImages
    );

    if (!isValidMongoObject(addProperty)) {
      return addProperty;
    }
    try {
      const pushUserPasses = await Promise.all(
        newlyCreatedPostAdImages.map(async (newlyCreatedPostAdImage) => {
          try {
            await newlyCreatedPostAdImage.save();
          } catch (err) {
            console.log(err);
          }
        })
      );
    } catch (error) {
      console.log(error);
    }
    newlyCreatedAdDescription.ownerId = newlyCreatedPropertyAd._id;
    newlyCreatedPropertyAdPrice.propertyAdId = newlyCreatedPropertyAd._id;
    newlyCreatedPropertyAd.description = newlyCreatedAdDescription;
    newlyCreatedPropertyAd.image = newlyCreatedPostAdImages;
    newlyCreatedPropertyAd.ownerName = addProperty.ownerName;
    newlyCreatedPropertyAd.ownerPhone = addProperty.ownerPhone;
    newlyCreatedPropertyAd.ownerEmail = addProperty.ownerEmail;
    newlyCreatedPropertyAd.price = newlyCreatedPropertyAdPrice;

    newlyCreatedPropertyAd.propertyId = addProperty._id;
    addProperty.ads = newlyCreatedPropertyAd;
    addProperty.adType = "Real Estate";
    await newlyCreatedAdDescription.save();

    await newlyCreatedPropertyAd.save();
    await newlyCreatedPropertyAdPrice.save();
    await addProperty.save();
    return this.res.json({
      success: true,
      message: " Ad Created Succesfully",
      property: addProperty,
    });
  }

  async __confirmPostAdCheckout() {
    const createdOn = new Date(); 
    //validate event
    const hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(this.req.body))
      .digest("hex");
      // hash == this.req.headers["x-paystack-signature"]
      console.log(hash)
      console.log(this.req.headers["x-paystack-signature"])
    if (true) {
      // Retrieve the request's body
      const event = this.req.body;
      // Do something with event 
      const {phone,name,amount,months,propertyAdId,userId,referrer} = event?.data?.metadata || {}
      try {
        const newlyCreatedPropertyAdCheckout = await new PropertyAdCheckout({
          status: 1,
          event: event.event,
          phone,
          months,
          amount,
          propertyAdId,
          userId,
          referrer,
          paystackResponse: event,
          createdOn
        });
        if (isValidMongoObject(newlyCreatedPropertyAdCheckout)) {
          await newlyCreatedPropertyAdCheckout.save();
        } 
        const updateexistingPropertyAd = await PropertyAd.findOneAndUpdate(
          {
            status: 1,
            _id: propertyAdId,
          },
          {
            $set: {
              isPublished: true,
              isApproved: true,
              isActive: true,
            },
          },
          { new: true }
        );
 
        if (isValidMongoObject( updateexistingPropertyAd)) {
          const updateexistingProperty = await Property.findOneAndUpdate(
            {
              status: 1,
              _id: updateexistingPropertyAd.propertyId,
            },
            {
              $set: {
                ads: updateexistingPropertyAd,
                isPublished: true,
                isApproved: true,
                isActive: true,
              },
            },
            { new: true }
          );




          const newAdPaymentTransaction =  await new UserWalletTransaction({
            status:1, 
            type: "propertyAd", 
            name,
            amount,
            isDebit: false,
            ownerId: userId,
            message: `Add payment for + ${updateexistingPropertyAd.title}`,    
            createdOn,
          }) 


          await newAdPaymentTransaction.save()
        }
      } catch (error) {
        console.log(error);
      }
    }

    this.res.sendStatus(200);
  }

  async __createAdImage(PropertyAdId, userId, files) {
    const createdOn = new Date();
    let newlyCreatedPostAdImages = [];
    const pushImages = await Promise.all(
      (files || []).map(async (image, index) => {
        const fileName = "image" + Date.now() + index;
        try {
          const result = await cloudinary.uploader.upload(image.path, {
            //   resource_type: "image",
            public_id: `property/ads/uploads/images/${fileName}`,
            overwrite: true,
          });

          newlyCreatedPostAdImages[index] = await new AdImage({
            status: 1,
            url: result.secure_url,
            createdOn,
            ownerId: PropertyAdId,
            ownerType: "property",
            createdBy: userId,
          });
        } catch (error) {
          console.log(error);
        }
      })
    );

    return newlyCreatedPostAdImages;
  }

  async __addProperty(title, description, price, status, images) {
    const createdOn = new Date();
    // validate request

    const user = this.res.user || {};
    const userId = user._id;
    const { _id: estateId } = this.res.estate || "";
    if (!isValidMongoObjectId(userId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "sorry!...Invalid user",
      });
    }

    const propertyTitle = title || "";
    const propertyDescription = description || "";
    const propertyPrice = price || "0";
    const propertyStatus = status || "";
    // const file = this.req.file;

    if (propertyTitle.length < 3) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "oops!...invalid property title",
      });
    }
    if (propertyStatus.length < 1) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "oops!...invalid property status",
      });
    }
    if (propertyDescription.length < 3) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "oops!...invalid property description",
      });
    }

    const newlyCreatedPropertyTitle = await new PropertyTitle({
      status: 1,
      value: propertyTitle,
      createdOn,
      createdBy: userId,
    });

    if (!isValidMongoObject(newlyCreatedPropertyTitle)) {
      this.res.statusCode = 400;
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
      this.res.statusCode = 500;
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
      this.res.statusCode = 500;
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
      this.res.statusCode = 500;
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
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Property Estate Linking",
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
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Property",
      });
    }
    const unformattedownerPhone =
      user.phoneNumbers && Array.isArray(user.phoneNumbers)
        ? user.phoneNumbers.find((phoneNumbers) =>
            stringIsEqual(!!phoneNumbers.isPrimary && phoneNumbers.isPrimary, 1)
          )
        : {};

    const ownerPhone =
      `${unformattedownerPhone?.countryCode}` +
      `${unformattedownerPhone.value}`;
    const ownerEmail =
      user.emails && Array.isArray(user.emails)
        ? user.emails.find((email) =>
            stringIsEqual(!!email.isPrimary && email.isPrimary, 1)
          ).value
        : "";
    const newlyCreatedPropertyOwnerDetails = await new PropertyOwnerDetails({
      status: 1,
      name: user.name.value,
      estateId,
      email: ownerEmail,
      phonenumber: ownerPhone,
      createdOn,
      createdBy: userId,
    });

    if (!isValidMongoObject(newlyCreatedPropertyOwnerDetails)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Property Owner Details",
      });
    }

    newlyCreatedPropertyTitle.propertyId = newlyCreatedProperty._id;
    newlyCreatedPropertyDescription.propertyId = newlyCreatedProperty._id;
    newlyCreatedPropertyPrice.propertyId = newlyCreatedProperty._id;
    // newlyCreatedPropertyImage.propertyId = newlyCreatedProperty._id;
    newlyCreatedPropertyOwnerDetails.propertyId = newlyCreatedProperty._id;
    newlyCreatedPropertyEstateLinking.propertyId = newlyCreatedProperty._id;
    newlyCreatedPropertyRating.propertyId = newlyCreatedProperty._id;

    newlyCreatedProperty.title = newlyCreatedPropertyTitle.value;
    newlyCreatedProperty.description = newlyCreatedPropertyDescription;
    newlyCreatedProperty.price = newlyCreatedPropertyPrice;
    newlyCreatedProperty.image = images;
    newlyCreatedProperty.rating = newlyCreatedPropertyRating;

    newlyCreatedProperty.ownerName = user?.name?.value;
    newlyCreatedProperty.ownerEmail = ownerEmail;
    newlyCreatedProperty.ownerPhone = ownerPhone;
    await newlyCreatedPropertyTitle.save();
    await newlyCreatedPropertyDescription.save();
    await newlyCreatedPropertyPrice.save();
    // await newlyCreatedPropertyImage.save();
    // await newlyCreatedProperty.save();
    await newlyCreatedPropertyOwnerDetails.save();
    await newlyCreatedPropertyEstateLinking.save();
    await newlyCreatedPropertyRating.save();

    return newlyCreatedProperty;
  }
  async __getUserProperties() {
    const createdOn = new Date();
    // validate request

    const user = this.res.user || {};
    const userId = user._id;
    if (!isValidMongoObjectId(userId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "sorry!...Invalid user",
      });
    }

    const allUserProperties = await Property.find({
      status: 1,
      createdBy: userId,
    });

    if (!isValidArrayOfMongoObject(allUserProperties)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Properties not found",
      });
    }

    return this.res.json({
      success: true,
      message: "Properties gotrten succesfully",
      properties: allUserProperties,
    });
  }
  async __getUserParticularProperty() {
    const createdOn = new Date();
    // validate request

    const user = this.res.user || {};
    const { propertyId } = this.req.params;
    const userId = user._id;
    if (!isValidMongoObjectId(userId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "sorry!...Invalid user",
      });
    }

    if (!isValidMongoObjectId(propertyId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "provide a valid propertyId",
      });
    }

    const userProperty = await Property.findOne({
      status: 1,
      createdBy: userId,
      _id: propertyId,
    });

    if (!isValidMongoObject(userProperty)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Property not found",
      });
    }

    return this.res.json({
      success: true,
      message: "Property gotrten succesfully",
      property: userProperty,
    });
  }
  async __getUserPropertyAds() {
    const createdOn = new Date();
    // validate request

    const user = this.res.user || {};
    const userId = user._id;
    if (!isValidMongoObjectId(userId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "sorry!...Invalid user",
      });
    }

    const allUserPropertyAds = await PropertyAd.find({
      status: 1,
      createdBy: userId,
    });

    if (!isValidArrayOfMongoObject(allUserPropertyAds)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Property ads not found",
      });
    }

    return this.res.json({
      success: true,
      message: "Property ads gotrten succesfully",
      propertyAds: allUserPropertyAds,
    });
  }
  async __getUserParticularPropertyAd() {
    const createdOn = new Date();
    // validate request

    const user = this.res.user || {};
    const { propertyAdId } = this.req.params;
    const userId = user._id;
    if (!isValidMongoObjectId(userId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "sorry!...Invalid user",
      });
    }

    if (!isValidMongoObjectId(propertyAdId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "provide a valid propertyAdId",
      });
    }

    const userPropertyAd = await PropertyAd.findOne({
      status: 1,
      createdBy: userId,
      _id: propertyAdId,
    });

    if (!isValidMongoObject(userPropertyAd)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Property ad not found",
      });
    }

    return this.res.json({
      success: true,
      message: "Property ad gotrten succesfully",
      propertyAd: userPropertyAd,
    });
  }
  async __publishPropertyAd() {
    const createdOn = new Date();
    // validate request

    const user = this.res.user || {};
    const { propertyAdId } = this.req.params;
    const userId = user._id;
    if (!isValidMongoObjectId(userId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "sorry!...Invalid user",
      });
    }

    if (!isValidMongoObjectId(propertyAdId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "provide a valid propertyAdId",
      });
    }

    const userPropertyAd = await PropertyAd.findOne({
      status: 1,
      createdBy: userId,
      _id: propertyAdId,
    });

    if (!isValidMongoObject(userPropertyAd)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Property ad not found",
      });
    }

    if (userPropertyAd.isPublished) {
      this.res.statusCode = 405;
      return this.res.json({
        success: false,
        message: "Property Ad Already Published",
      });
    }

    const userProperty = await Property.findOne({
      status: 1,
      createdBy: userId,
      _id: userPropertyAd.propertyId,
    });

    if (!isValidMongoObject(userProperty)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Property  not found",
      });
    }

    if (!userProperty.isApproved) {
      this.res.statusCode = 405;
      return this.res.json({
        success: false,
        message: "Property  not yet approved",
      });
    }

    const newlyPropertyAdPayment = await new PropertyAdPayment({
      status: 1,
      createdBy: userId,
      propertyId: userPropertyAd.propertyId,
      propertyAdId: propertyAdId,
      isAdActive: true,
      amount: 0,
      noOfDays: 3,
      expiresOn: new Date(createdOn.getTime() + 2.592e8),
    });

    if (!isValidMongoObject(newlyPropertyAdPayment)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Property ad payment not successful",
      });
    }
    await newlyPropertyAdPayment.save();

    try {
      const userPropertyAd = await PropertyAd.updateOne(
        {
          status: 1,
          createdBy: userId,
          _id: propertyAdId,
        },
        {
          $set: { isPublished: true },
          $push: {
            by: userId, // admin ID of the user who made this update
            action: "Publish", //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
            timing: createdOn,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }

    return this.res.json({
      success: true,
      message:
        "Property ad published successfully, You have 3 days free trial after which your ad will be unpublished",
    });
  }

  async __findAllPostAd() {
    const createdOn = new Date();
    const query = {
      status: 1,
    };
    const pageSize = this.req.query["pageSize"] || "";
    const location = this.req.query["location"] || "";
    const Category = this.req.query["category"] || "";
    const type = this.req.query["type"] || "";

    if (location.length > 3) {
      query.location = { $regex: new RegExp(`${location}`, "i") };
    }
    if (Category.length > 3) {
      query.category = { $regex: new RegExp(`${Category}`, "i") };
    }
    if (type.length > 3) {
      query.type = { $regex: new RegExp(`${type}`, "i") };
    }

    const foundPostAds = await PropertyAd.find(query, {
      _id: 1,
      createdOn: 1,
      status: 1,
      title: 1,
      category: 1,
      type: 1,
      group: 1,
      ownerPhone: 1,
      ownerEmail: 1,
      ownerName: 1,
      location: 1,
      bedroom: 1,
      furnishedStatus: 1,
      bathroom: 1,
      parkingSpace: 1,
      isAvaliable: 1,
      isPublished: 1,
      isApproved: 1,
      isActive: 1,
      "price.value": 1,
      "description.value": 1,
      // " details.value": 1,
      "image.url": 1,
      "description.value": 1,
      "rating.value": 1,
    })
      .sort({ _id: -1 })
      .limit(pageSize);

    if (foundPostAds.length < 1) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "No Ads found",
      });
    }

    return this.res.json({
      success: true,
      message: "Ads found",
      postAds: foundPostAds,
    });
  }

  async __findPropertyAdsByID() {
    const createdOn = new Date();

    const propertyAdId = this.req.params.propertyAdId || "";
    if (!isValidMongoObjectId(propertyAdId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Please provide a valid property ads id param",
      });
    }

    // validate name
    const foundPropertyAd = await PropertyAd.findOne(
      {
        status: 1,
        _id: propertyAdId,
      },
      {
        _id: 1,
        createdOn: 1,
        status: 1,
        title: 1,
        category: 1,
        type: 1,
        group: 1,
        ownerPhone: 1,
        ownerEmail: 1,
        ownerName: 1,
        location: 1,
        bedroom: 1,
        furnishedStatus: 1,
        bathroom: 1,
        parkingSpace: 1,
        "price.value": 1,
        "description.value": 1,
        // " details.value": 1,
        "image.url": 1,
        "description.value": 1,
        "rating.value": 1,
      }
    );
    if (!isValidMongoObject(foundPropertyAd)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Property not found",
      });
    }

    return this.res.json({
      success: true,
      message: "Property ad found",
      propertyAd: foundPropertyAd,
    });
  }

  //   async __getPostAdsByLocation() {
  //     const createdOn = new Date();
  //     const location = this.req.query["location"] || "";

  //     const foundPostAds = await PostAd.find({
  //       status: 1,
  //       location: { $regex: new RegExp(`${location}`, "i") },
  //     }).limit(16);

  //     if (!isValidArrayOfMongoObject(foundPostAds)) {
  // this.res.statusCode = 400
  //       return this.res.json({
  //         success: false,
  //         message: "No Ads found",
  //       });
  //     }
  //     return this.res.json({
  //       success: true,
  //       message: "Ads found",
  //       postAds: foundPostAds,
  //     });
  //   }

  //   async __getPostAdsByCategory() {
  //     const createdOn = new Date();
  //     // validate name
  //     const Category = this.req.query["category"] || "";
  //     const type = this.req.query["type"] || "";

  //     const foundCategory = await PostAd.find({
  //       status: 1,
  //       category: { $regex: new RegExp(`${Category}`, "i") },
  //       type: { $regex: new RegExp(`${type}`, "i") },
  //     });

  //     if (!isValidArrayOfMongoObject(foundCategory)) {
  // this.res.statusCode = 404
  //       return this.res.json({
  //         success: false,
  //         message: "No Category found",
  //       });
  //     }

  //     return this.res.json({
  //       success: true,
  //       message: "Ads found",
  //       postAds: foundCategory,
  //     });
  //   }

  // async __findSearch() {
  //     const createdOn = new Date();

  //     const search = this.req.body.search || "";

  //     const foundSearch = await PostAds.find({
  //       status: 1,
  //       $text: { $search: search, $diacriticSensitive: true },
  //     });

  //     if (!isValidArrayOfMongoObject(foundSearch)) {
  // this.res.statusCode = 404
  //       return this.res.json({
  //         success: false,
  //         message: "No Category found",
  //       });
  //     }

  //     return this.res.json({
  //       success: true,
  //       message: "Ads found",
  //       postAds: foundSearch,
  //     });
  //   }

  async __getPropertyLocations() {
    const createdOn = new Date();

    const foundSearch = await PropertyAd.distinct("location");

    if (!isValidArrayOfMongoObject(foundSearch)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "No Location found",
      });
    }

    return this.res.json({
      success: true,
      message: "Locations found",
      locations: foundSearch,
    });
  }
  async __getPropertyCategory() {
    const createdOn = new Date();

    const foundSearch = await PropertyAd.distinct("group");

    if (!isValidArrayOfMongoObject(foundSearch)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "No Location found",
      });
    }

    return this.res.json({
      success: true,
      message: "Locations found",
      locations: foundSearch,
    });
  }

  //   async __findPostAdWithQueryString() {
  //     const createdOn = new Date();
  //     // if (!this.req.query["category"] || this.req.query["category"].length < 3) {
  //     //     return this.res.json([]);
  //     // }

  //     let foundPostAd = await this.__findSale(this.req.query);

  //     if (!isValidArrayOfMongoObject(foundPostAd)) {
  //       foundPostAd = [];
  //     } else
  //       foundPostAd = foundPostAd.map((foundPostAd) => {
  //         return {
  //           category: foundPostAd.category,
  //           location: foundPostAd.location,
  //           addDetails: foundPostAd.addDetails,
  //           carSpace: foundPostAd.carSpace,
  //           Title: foundPostAd.Title,
  //           bedroom: foundPostAd.bedroom,
  //           _id: foundPostAd._id,
  //         };
  //       });

  //     return this.res.json({
  //       success: true,
  //       message: "PostAd found",
  //       foundPostAd,
  //     });
  //   }

  async __updatePropertyAd() {
    const createdOn = new Date();
    const userId = (this.res.user && this.res.user._id) || "";
    const { _id: estateId } = this.res.estate || "";

    if (!isValidMongoObjectId(userId)) {
      return this.res.json({
        success: false,
        message: "Invalid user",
      });
    }
    // if (!isValidMongoObjectId(estateId)) {
    //   return this.res.json({
    //     success: false,
    //     message: "Invalid estate id",
    //   });
    // }

    const foundPropertyAd = await PropertyAd.find({});

    const pushfoundPropertyAd = await Promise.all(
      foundPropertyAd.map(async (propertyAd, index) => {
        const contextId = propertyAd.createdBy;
        const particularPropertyAdId = propertyAd._id;
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
          const foundPropertyName = await Name.findOne({
            ownerId: contextId,
            status: 1,
          });

          if (isValidMongoObject(foundPropertyName)) {
            updates.ownerName = foundPropertyName?.value;
          }

          const foundAdDescription = await AdDescription.findOne({
            status: 1,
            ownerId: particularPropertyAdId,
          });
          if (!isValidMongoObject(foundAdDescription)) {
            const newlyCreatedAdDescription = await new AdDescription({
              status: 1,
              ownerId: particularPropertyAdId,
              createdOn,
              value: "no description yet",
            });

            if (isValidMongoObject(newlyCreatedAdDescription)) {
              updates.description = newlyCreatedAdDescription;
              await newlyCreatedAdDescription.save();
            }
          }

          const foundPrice = await PropertyAdPrice.findOne({
            status: 1,
            propertyId: particularPropertyAdId,
          });
          if (!isValidMongoObject(foundPrice)) {
            const newlyCreatedAdDescription = await new PropertyAdPrice({
              status: 1,
              propertyAdId: particularPropertyAdId,
              createdOn,
              type: propertyAd.group,
            });

            if (isValidMongoObject(foundPrice)) {
              updates.price = foundPrice;
              await foundPrice.save();
            }
          }

          try {
            const updateProperty = await PropertyAd.updateOne(
              {
                _id: particularPropertyAdId,
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

  // async __createPropertyPostPrice() {
  //   const createdOn = new Date();
  //   // validate request

  //   const admin = this.res.admin || {};
  //   const { _id: adminId } = admin || "";

  //   if (!isValidMongoObject(admin)) {
  //     this.res.statusCode = 404;
  //     return this.res.json({
  //       success: false,
  //       message: "sorry, admin not found!!!",
  //     });
  //   }
  //   if (!isValidMongoObjectId(adminId)) {
  //     this.res.statusCode = 404;
  //     return this.res.json({
  //       success: false,
  //       message: "Invalid admin",
  //     });
  //   }

  //   // const rawbillType = this.req.params.billType || "";
  //   const amount = this.req.body.amount;
  //   // const billType = rawbillType.trim();
  //   if (isNaN(amount)) {
  //     this.res.statusCode = 400;
  //     return this.res.json({
  //       success: false,
  //       message: "Invalid Amount",
  //     });
  //   }

  //   const existingPropertyAdPostPrice = await PropertyAdPostPrice.findOne({
  //     status: 1,
  //   });

  //   if (isValidMongoObject(existingPropertyAdPostPrice)) {
  //     this.res.statusCode = 409;
  //     return this.res.json({
  //       success: false,
  //       message: "Property Ad Price already created",
  //     });
  //   }

  //   const newPropertyAdPostPrice = await new PropertyAdPostPrice({
  //     status: 1, //0:deleted,1:active
  //     currency: 0,
  //     value: amount,
  //     createdOn,
  //     createdBy: adminId,
  //   });
  //   if (!isValidMongoObject(newPropertyAdPostPrice)) {
  //     this.res.statusCode = 500;
  //     return this.res.json({
  //       success: false,
  //       message: "property ad price not created",
  //     });
  //   }
  //   await newPropertyAdPostPrice.save();

  //   return this.res.json({
  //     success: true,
  //     message: "Price created Succesfully",
  //     adPrice: newPropertyAdPostPrice,
  //   });
  // }

  async __getPropertyPostPrice() {
    const createdOn = new Date();

    const existingPropertyAdPostPrice = await PropertyAdPostPrice.findOne({
      status: 1,
    });

    if (!isValidMongoObject(existingPropertyAdPostPrice)) {
      this.res.statusCode = 409;
      return this.res.json({
        success: false,
        message: "Property Ad Price not yet created",
      });
    }

    return this.res.json({
      success: true,
      message: "Price gotten Succesfully",
      adPrice: existingPropertyAdPostPrice,
    });
  }
  async __updatePropertyPostPrice() {
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

    const existingPropertyAdPostPrice = await PropertyAdPostPrice.findOne({
      status: 1,
    });

    if (!isValidMongoObject(existingPropertyAdPostPrice)) {
      this.res.statusCode = 404;
      const newPropertyAdPostPrice = await new PropertyAdPostPrice({
        status: 1, //0:deleted,1:active
        currency: 0,
        value: newAmount,
        type: "property",
        createdOn,
        createdBy: adminId,
      });
      if (!isValidMongoObject(newPropertyAdPostPrice)) {
        this.res.statusCode = 500;
        return this.res.json({
          success: false,
          message: "property ad price not created",
        });
      }
      await newPropertyAdPostPrice.save();

      return this.res.json({
        success: true,
        message: "Price updated Succesfully",
        adPrice: newPropertyAdPostPrice,
      });
    }

    try {
      const existingPropertyAdPostPrice = await PropertyAdPostPrice.updateMany(
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

    const newPropertyAdPostPrice = await new PropertyAdPostPrice({
      status: 1, //0:deleted,1:active
      currency: 0,
      value: newAmount,
      type: "property",
      createdOn,
      createdBy: adminId,
    });
    if (!isValidMongoObject(newPropertyAdPostPrice)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "property ad price not created",
      });
    }
    await newPropertyAdPostPrice.save();

    return this.res.json({
      success: true,
      message: "Price updated Succesfully",
      adPrice: newPropertyAdPostPrice,
    });
  }
  async __adminApproveProperty() {
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

    const isApproved = this.req.query["approve"] || "";
    const propertyId = this.req.params.propertyId;
    // const billType = rawbillType.trim();
    if (!isValidMongoObjectId(propertyId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Invalid property Id",
      });
    }
    if (
      !stringIsEqual(isApproved, "true") &&
      !stringIsEqual(isApproved, "false")
    ) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Invalid approve query params",
      });
    }

    const existingProperty = await Property.findOne({
      status: 1,
      _id: propertyId,
    });

    if (!isValidMongoObject(existingProperty)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Property not found",
      });
    }
    if (stringIsEqual(isApproved, "true") && existingProperty.isApproved) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Property already approved",
      });
    }
    if (!stringIsEqual(isApproved, "true") && !existingProperty.isApproved) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Property not approved",
      });
    }

    try {
      const updateexistingPropertyAd = await PropertyAd.updateOne(
        {
          status: 1,
          propertyId: propertyId,
        },
        {
          $set: {
            isApproved: isApproved,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }

    const allPropertyAds = await PropertyAd.find({
      status: 1,
      propertyId: propertyId,
    });

    if (!isValidArrayOfMongoObject(allPropertyAds)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Property Ads not found",
      });
    }
    try {
      const updateexistingProperty = await Property.updateOne(
        {
          status: 1,
          _id: propertyId,
        },
        {
          $set: {
            isApproved: isApproved,
            ads: allPropertyAds,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }

    return this.res.json({
      success: true,
      message: `Property ${
        stringIsEqual(isApproved, "true") ? `approved` : `disapproved`
      }  Succesfully`,
    });
  }
}

module.exports = PortalAds;
