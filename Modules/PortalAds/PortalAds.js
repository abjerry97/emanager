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
      // adDetails = "",
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

    // if (adDetails.length < 3) {
    //   this.res.statusCode = 400;
    //   return this.res.json({
    //     success: false,
    //     message: "oops!...invalid ad Details",
    //   });
    // }

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
    // if (category.length < 3 || !propertyConfig[category.trim()]) {
    //   this.res.statusCode = 400;
    //   return this.res.json({
    //     success: false,
    //     message: "oops!...invalid category",
    //   });
    // }

    // if (isNaN(bedroom) || bedroom < 0) {
    //   this.res.statusCode = 400;
    //   return this.res.json({
    //     success: false,
    //     message: "oops!...invalid number of bedrooms specified",
    //   });
    // }

    // if (isNaN(bathroom) || bathroom < 0) {
    //   this.res.statusCode = 400;
    //   return this.res.json({
    //     success: false,
    //     message: "oops!...invalid number of bathrooms specified",
    //   });
    // }

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

    if (!files || !Array.isArray(files) || files.length <1 ) {
        
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Sorry!... Invalid Image file",
      });
    }  
    // files.map((file)=>{ 
    //   if (!file || !file.filename) { 
    //     this.res.statusCode = 400;
    //     return this.res.json({
    //       success: false,
    //       message: "Sorry!... Invalid Image file",
    //     });
    //   }
    // })
 



  
    // const newlyCreatedAddDetails = await new AdDetails({
    //   status: 1,
    //   value: adDetails,
    //   createdOn,
    //   createdBy: userId,
    // });

    // if (!isValidMongoObject(newlyCreatedAddDetails)) {
    //   this.res.statusCode = 500;
    //   return this.res.json({
    //     success: false,
    //     message: "Sorry! error while creating Ad Details",
    //   });
    // }
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


    
    let newlyCreatedPostAdImages = []; 

    const pushImages = await Promise.all( 

    (files||[]).map(async(image,index)=> {

 
      console.log("newlyCreatedImage",image)

      const fileName = "image" + Date.now()+ index;
      try {
        const result = await cloudinary.uploader.upload(image.path, {
          //   resource_type: "image",
          public_id: `property/ads/uploads/images/${fileName}`,
          overwrite: true,
        });
  
        newlyCreatedPostAdImages[index]  = await new AdImage({
          status: 1,
          url: result.secure_url,
          createdOn,
          ownerId : newlyCreatedPropertyAd._id,
          ownerType: "property",
          createdBy: userId,
        });
      } catch (error) {
        console.log(error);
      } 
 
    })
    )
 


    if (!isValidArrayOfMongoObject(newlyCreatedPostAdImages)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Sorry! error while creating PostAd image",
      });
    }

    console.log("newlyCreatedPostAdImages2",newlyCreatedPostAdImages)

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

    const pushUserPasses = await Promise.all( 
          newlyCreatedPostAdImages.map(async(newlyCreatedPostAdImage)=>{
            try{
            await newlyCreatedPostAdImage.save();
            } catch (err){
                console.log(err)
            }

          }) 
    )

    newlyCreatedAdDescription.ownerId = newlyCreatedPropertyAd._id;
    newlyCreatedPropertyAdPrice.propertyAdId = newlyCreatedPropertyAd._id;
    // newlyCreatedAddDetails.ownerId = newlyCreatedPropertyAd._id;
    // newlyCreatedPostAdImage.ownerId = newlyCreatedPropertyAd._id;

    // newlyCreatedPropertyAd.details = newlyCreatedAddDetails;
    newlyCreatedPropertyAd.description = newlyCreatedAdDescription;
    newlyCreatedPropertyAd.image = newlyCreatedPostAdImages;
    newlyCreatedPropertyAd.ownerName = addProperty.ownerName;
    newlyCreatedPropertyAd.ownerPhone = addProperty.ownerPhone;
    newlyCreatedPropertyAd.ownerEmail = addProperty.ownerEmail;
    newlyCreatedPropertyAd.price = newlyCreatedPropertyAdPrice;

    newlyCreatedPropertyAd.propertyId = addProperty._id;
    addProperty.ads = newlyCreatedPropertyAd;
    addProperty.adType = "Real Estate";
    // await newlyCreatedAddDetails.save();
    await newlyCreatedAdDescription.save();

    await newlyCreatedPropertyAd.save();
    await newlyCreatedPropertyAdPrice.save();
    await addProperty.save();
    return this.res.json({
      success: true,
      message: " Ad Created Succesfully",
    });
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
    // if (!isValidMongoObjectId(estateId)) {
    //   this.res.statusCode = 400;
    //   return this.res.json({
    //     success: false,
    //     message: "sorry!...Invalid estate id",
    //   });
    // }

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
    // if (propertyPrice.length < 3) {
    // this.res.statusCode = 400;
    //   return this.res.json({
    //     success: false,
    //     message: "oops!...invalid property price",
    //   });
    // }

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
    // if (!file || !file.filename) {
    //   this.res.statusCode = 400;
    //   return this.res.json({
    //     success: false,
    //     message: "Sorry!... Invalid Image file",
    //   });
    // }
    // const fileName = "image" + Date.now();
    // let newlyCreatedPropertyImage = {};
    // try {
    //   const result = await cloudinary.uploader.upload(file.path, {
    //     //   resource_type: "image",
    //     public_id: `property/uploads/images/${fileName}`,
    //     overwrite: true,
    //   });

    //   newlyCreatedPropertyImage = await new PropertyImage({
    //     status: 1,
    //     url: result.secure_url,
    //     createdOn,
    //     createdBy: userId,
    //   });
    // } catch (error) {
    //   console.log(error);
    // }

    // if (!isValidMongoObject(newlyCreatedPropertyImage)) {
    //   this.res.statusCode = 500;
    //   return this.res.json({
    //     success: false,
    //     message: "Sorry! error while creating Property image",
    //   });
    // }
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
    // validate request

    // const user = this.res.user || {};
    // const userId = user._id;
    // const { _id: estateId } = this.res.estate || "";
    // if (!isValidMongoObjectId(userId)) {
    //   this.res.statusCode = 406
    //   return this.res.json({
    //     success: false,
    //     message: "sorry!...Invalid user",
    //   });
    // }
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
              await newlyCreatedAdDescription.save()
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
              await foundPrice.save()
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
}

module.exports = PortalAds;
