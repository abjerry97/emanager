const {
  stringIsEqual,
  isValidMongoObject,
  isValidArrayOfMongoObject,
  isValidMongoObjectId,
  isValidPhonenumber,
  isEmail,
  isValidFullName,
} = require("../../helpers/validators");
const Business = require("../../model/business");
const BusinessEstateLinking = require("../../model/business-estate-linking");
const BusinessImage = require("../../model/business-image");
const Email = require("../../model/email");
const cloudinary = require("../../helpers/cloudinary");
const HouseAddressName = require("../../model/house-address");
const Name = require("../../model/name");
const PhoneNumber = require("../../model/phone-number");
const Service = require("../../model/service");
const ServiceEstateLinking = require("../../model/service-estate-linking");
const ServiceImage = require("../../model/service-image");
const Authentication = require("../Authentication/auth");
const { formatPhonenumber } = require("../../helpers/tools");
const configDoc = require("./../../config/config.json");
const BusinessDetails = require("../../model/business-details");
const ServiceDetails = require("../../model/service-details");

class Services extends Authentication {
  constructor(req, res, next) {
    super();
    this.req = req;
    this.res = res;
    this.next = next;
  }

  async __createBusiness() {
    const createdOn = new Date();
    // validate request
    const user = this.res.user || {};
    const { _id: userId = "" } = user;
    if (!isValidMongoObject(user)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "user not found!!!",
      });
    }
    const { _id: estateId } = this.res.estate || "";

    if (!isValidMongoObjectId(userId)) {
      this.res.statusCode = 406;
      return this.res.json({
        success: false,
        message: "Invalid user",
      });
    }
    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 406;
      return this.res.json({
        success: false,
        message: "Invalid estate id",
      });
    }

    const newBusinessName = this.req.body.name || "";
    const newBusinessPhonenumber = this.req.body.phone || "";
    const newBusinessEmail = this.req.body.email || "";
    const newBusinessCategory = this.req.body.category || "";
    const newBusinessDetails = this.req.body.details || "";
    const newBusinessAddress = this.req.body.address || "";
    if (!isEmail(newBusinessEmail)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid email",
      });
    }
    if (newBusinessName.length < 3) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "You didn't provide a valid name",
      });
    }
    if (!isValidPhonenumber(newBusinessPhonenumber)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "phonenumber not valid",
      });
    }
    const formattedNewBusinessPhonenumber = formatPhonenumber(
      newBusinessPhonenumber
    );
     if (
      !isNaN(newBusinessCategory) &&
      !configDoc.BusinessType[newBusinessCategory]
    ) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "category not valid",
      });
    }

    if (isNaN(newBusinessCategory) && newBusinessCategory.length < 3) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "category not valid",
      });
    }
    const newlyCreatedBusiness = await new Business({
      status: 1,
      createdOn,
      createdBy: userId,
      ownerId: userId,
      isAvailiable: 1,
      category:configDoc.BusinessType[newBusinessCategory] || newBusinessCategory,
    });
    if (!isValidMongoObject(newlyCreatedBusiness)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Sorry....error while creating Business ",
      });
    }

    const newlyCreatedBusinesssEstateLinking = await new BusinessEstateLinking({
      status: 1,
      estateId,
      businessId: newlyCreatedBusiness._id,
      createdBy: userId,
      createdOn,
    });

    if (!isValidMongoObject(newlyCreatedBusinesssEstateLinking)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Sorry....error while creating Business Estate Linking ",
      });
    }

    let foundEmail = await Email.findOne({
      value: newBusinessEmail,
      status: 1,
    });

    let newlyCreatedBusinesssEmail;

    if (isValidMongoObject(foundEmail)) {
      const foundEmailOwnerId = foundEmail.ownerId || "";
      let foundBusiness = await Business.findOne({
        _id: foundEmailOwnerId,
        ownerId: { $ne: userId },
        status: 1,
      });
      if (
        !stringIsEqual(foundEmailOwnerId, userId) &&
        isValidMongoObject(foundBusiness)
      ) {
        this.res.statusCode = 409;
        return this.res.json({
          success: false,
          message: "email already belongs to another user",
        });
      }
    } else {
      newlyCreatedBusinesssEmail = await new Email({
        status: 1,
        value: newBusinessEmail,
        isPrimary: 0,
        ownerId: newlyCreatedBusiness._id,
        ownerType: 5,
        createdBy: userId,
        createdOn,
      });
    }

    let foundPhonenumber = await PhoneNumber.findOne({
      status: 1,
      value: formattedNewBusinessPhonenumber[1],
      countryCode: formattedNewBusinessPhonenumber[0],
    });
    let newlyCreatedBusinesssPhonenumber;

    if (isValidMongoObject(foundPhonenumber)) {
      const foundPhonenumberOwnerId = foundPhonenumber.ownerId || "";
      let foundBusiness = await Business.findOne({
        _id: foundPhonenumberOwnerId,
        ownerId: { $ne: userId },
        status: 1,
      });
      if (
        !stringIsEqual(foundPhonenumberOwnerId, userId) &&
        isValidMongoObject(foundBusiness)
      ) {
        this.res.statusCode = 409;
        return this.res.json({
          success: false,
          message: "phonenumber already belongs to another user",
        });
      }
    } else {
      newlyCreatedBusinesssPhonenumber = await new PhoneNumber({
        status: 1,
        value: formattedNewBusinessPhonenumber[1],
        countryCode: formattedNewBusinessPhonenumber[0],
        isPrimary: 0,
        ownerId: newlyCreatedBusiness._id,
        ownerType: 5,
        createdBy: userId,
        createdOn,
      });
    }

    const newlyCreatedBusinesssName = await new Name({
      status: 1,
      value: newBusinessName,
      ownerId: newlyCreatedBusiness._id,
      ownerType: 5,
      createdBy: userId,
      createdOn,
    });

    if (!isValidMongoObject(newlyCreatedBusinesssName)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Sorry....error while creating Business name ",
      });
    }

    const newlyCreatedBusinessDetails = await new BusinessDetails({
      status: 1,
      value: newBusinessDetails,
      ownerId: newlyCreatedBusiness._id,
      ownerType: 5,
      createdBy: userId,
      createdOn,
    });

    if (!isValidMongoObject(newlyCreatedBusinessDetails)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Sorry....error while creating Business Details ",
      });
    }

    newlyCreatedBusiness.emails = isValidMongoObject(foundEmail)
      ? foundEmail
      : newlyCreatedBusinesssEmail;
    newlyCreatedBusiness.phoneNumbers = isValidMongoObject(foundPhonenumber)
      ? foundPhonenumber
      : newlyCreatedBusinesssPhonenumber;
    newlyCreatedBusiness.name = newlyCreatedBusinesssName;

    if (
      !isValidMongoObject(foundEmail) &&
      isValidMongoObject(newlyCreatedBusinesssEmail)
    ) {
      await newlyCreatedBusinesssEmail.save();
    }

    if (
      !isValidMongoObject(foundPhonenumber) &&
      isValidMongoObject(newlyCreatedBusinesssPhonenumber)
    ) {
      await newlyCreatedBusinesssPhonenumber.save();
    }

    let defaultBusinessImage = await BusinessImage.findOne({
      status: 1,
      default: 1,
    });
    if (!isValidMongoObject(defaultBusinessImage)) {
      defaultBusinessImage = await new BusinessImage({
        status: 1,
        url: "",
        createdBy: userId,
        default: 1,
        createdOn,
      });

      await defaultBusinessImage.save();
    }

    if (newBusinessAddress.length > 3) {
      const newlyBusinessAddress = await new HouseAddressName({
        status: 1,
        value: newBusinessAddress,
        ownerId: newlyCreatedBusiness._id,
        ownerType: 5,
        createdBy: userId,
        createdOn,
      });

      if (!isValidMongoObject(newlyBusinessAddress)) {
        this.res.statusCode = 500;
        return this.res.json({
          success: false,
          message: "Sorry....error while creating Business Address ",
        });
      }

      newlyCreatedBusiness.businessAddress = newlyBusinessAddress;
      await newlyBusinessAddress.save();
    }

    newlyCreatedBusiness.image = defaultBusinessImage;
    newlyCreatedBusiness.details = newlyCreatedBusinessDetails;
    await newlyCreatedBusinesssEstateLinking.save();
    await newlyCreatedBusinessDetails.save();

    await newlyCreatedBusinesssName.save();

    await newlyCreatedBusiness.save();

    return this.res.json({
      success: true,
      message: "Business created  Succesfully",
    });
  }
  async __addBusinessAddress() {
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
    let { businessId } = this.req.params || null;

    if (!isValidMongoObjectId(businessId)) {
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid business id",
      });
    }

    const existingBusiness = await Business.findOne({
      status: 1,
      _id: businessId,
    });

    if (!isValidMongoObject(existingBusiness)) {
      return this.res.json({
        success: false,
        message: "Sorry!...existing Business not found",
      });
    }

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

    const newBusinessAddress1 = this.req.body.address1 || "";
    const newBusinessAddress2 = this.req.body.address2 || "";

    if (!isValidFullName(newBusinessAddress1)) {
      return this.res.json({
        success: false,
        message: "You didn't provide a valid address",
      });
    }

    if (
      newBusinessAddress2.length > 0 &&
      !isValidFullName(newBusinessAddress2)
    ) {
      return this.res.json({
        success: false,
        message: "You didn't provide a valid address",
      });
    }

    const newlyBusinessServicesAddress1 = await new HouseAddressName({
      status: 1,
      value: newBusinessAddress1,
      ownerId: businessId,
      ownerType: 5,
      createdBy: userId,
      createdOn,
    });

    await newlyBusinessServicesAddress1.save();
    if (
      newBusinessAddress2.length > 0 &&
      isValidFullName(newBusinessAddress2)
    ) {
      const newlyBusinessServicesAddress2 = await new HouseAddressName({
        status: 1,
        value: newBusinessAddress2,
        ownerId: businessId,
        ownerType: 5,
        createdBy: userId,
        createdOn,
      });

      await newlyBusinessServicesAddress2.save();
    }
    const allBusinessAddresses = await HouseAddressName.find({
      status: 1,
      ownerId: businessId,
    });

    if (!isValidArrayOfMongoObject(allBusinessAddresses)) {
      return this.res.json({
        success: false,
        message: "Address not found",
      });
    }
    try {
      const updateExistingBusiness = await Business.updateOne(
        {
          status: 1,
          _id: businessId,
        },
        {
          $set: { businessAddress: allBusinessAddresses },
        }
      );
    } catch (error) {
      console.log(error);
    }

    return this.res.json({
      success: true,
      message: "Business address added Succesfully",
    });
  }
  async __addBusinessImage() {
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
    let { businessId } = this.req.params || null;

    if (!isValidMongoObjectId(businessId)) {
      return this.res.json({
        success: false,
        message: "Sorry!... Invalid business id",
      });
    }
    if (!isValidMongoObjectId(userId)) {
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid user",
      });
    }
    if (!isValidMongoObjectId(estateId)) {
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid estate id",
      });
    }
    const existingBusiness = await Business.findOne({
      status: 1,
      _id: businessId,
    });

    if (!isValidMongoObject(existingBusiness)) {
      return this.res.json({
        success: false,
        message: "Sorry!...existing Business not found",
      });
    }
    const file = this.req.file;
    if (!file || !file.filename) {
      return this.res.json({
        success: false,
        message: "Sorry!... Invalid Image file",
      });
    }
    const fileName = "image" + Date.now();
    let newlyCreatedBusinessImage = {};
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        //   resource_type: "image",
        public_id: `business/uploads/images/${fileName}`,
        overwrite: true,
      });

      newlyCreatedBusinessImage = await new BusinessImage({
        status: 1,
        url: result.secure_url,
        createdOn,
        createdBy: userId,
      });
    } catch (error) {
      console.log(error);
    }

    if (!isValidMongoObject(newlyCreatedBusinessImage)) {
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Business image",
      });
    }

    await newlyCreatedBusinessImage.save();
    try {
      const updateExistingBusiness = await Business.updateOne(
        {
          status: 1,
          _id: businessId,
        },
        {
          $set: { image: newlyCreatedBusinessImage },
        }
      );
    } catch (error) {
      console.log(error);
    }
    try {
      const updateExistingBusinessImage = await BusinessImage.updateMany(
        {
          status: 1,
          _id: { $ne: newlyCreatedBusinessImage._id },
          businessId,
        },
        {
          $set: { status: 0 },
        }
      );
    } catch (error) {
      console.log(error);
    }

    return this.res.json({
      success: true,
      message: "Business Image added Succesfully",
    });
  }
  async __addDefaultBusinessImage() {
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
    if (!isValidMongoObjectId(userId)) {
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid user",
      });
    }
    if (!isValidMongoObjectId(estateId)) {
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid estate id",
      });
    }

    const file = this.req.file;
    if (!file || !file.filename) {
      return this.res.json({
        success: false,
        message: "Sorry!... Invalid Image file",
      });
    }
    const fileName = "image" + Date.now();
    let newlyCreatedBusinessImage = {};
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        //   resource_type: "image",
        public_id: `business/uploads/images/${fileName}`,
        overwrite: true,
      });

      newlyCreatedBusinessImage = await new BusinessImage({
        status: 1,
        url: result.secure_url,
        createdOn,
        createdBy: userId,
        default: 1,
      });
    } catch (error) {
      console.log(error);
    }

    if (!isValidMongoObject(newlyCreatedBusinessImage)) {
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Business image",
      });
    }
    await newlyCreatedBusinessImage.save();

    return this.res.json({
      success: true,
      message: "Default Business Image added Succesfully",
    });
  }
  async __getEstateBusiness() {
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

    const foundEstateBusiness = await BusinessEstateLinking.find({
      status: 1,
      estateId: selectedEstateId,
    });

    return this.res.json({
      success: true,
      message: "Estate Business gotten Succesfully",
      business: foundEstateBusiness,
    });
  }
  async __getBusiness() {
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

    const foundBusiness = await Business.find(
      {
        status: 1,
      },
      {
        _id: 1,
        "name.value": 1,
        "emails.value": 1,
        "phoneNumbers.value": 1,
        "phoneNumbers.countryCode": 1,
        category: 1,
        adType: 1,
        createdOn: 1,
        "details.value": 1,
        "image.url": 1,
        "businessAddress.value": 1,
        "operatingDays.value": 1,
        isAvailiable: 1,
        "ads.title": 1,
        "ads.category": 1,
        "ads.type": 1,
        "ads.ownerPhone": 1,
        "ads.ownerEmail": 1,
        "ads.details.value": 1,
        "ads.image.url": 1,
        "ads.description.value": 1,
        "ads.rating.value": 1,
      }
    );

    return this.res.json({
      success: true,
      message: "Business gotten Succesfully",
      business: foundBusiness,
    });
  }
  async __getParticularBusiness() {
    const createdOn = new Date();
    // validate request
    const user = this.res.user || {};
    const { _id: userId = "" } = user;
    if (!isValidMongoObject(user)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Sorry!...user not found!!!",
      });
    }
    const { businessId } = this.req.params || {};

    if (!isValidMongoObjectId(businessId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "provide a valid business id",
      });
    }
    if (!isValidMongoObjectId(userId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid user",
      });
    }

    const foundBusiness = await Business.findOne(
      {
        status: 1,
        _id: businessId,
      },
      {
        _id: 1,
        "name.value": 1,
        "emails.value": 1,
        "phoneNumbers.value": 1,
        "phoneNumbers.countryCode": 1,
        category: 1,
        adType: 1,
        "details.value": 1,
        createdOn: 1,
        "image.url": 1,
        "businessAddress.value": 1,
        "operatingDays.value": 1,
        isAvailiable: 1,
        "ads.title": 1,
        "ads.category": 1,
        "ads.type": 1,
        "ads.ownerPhone": 1,
        "ads.ownerEmail": 1,
        "ads.details.value": 1,
        "ads.image.url": 1,
        "ads.description.value": 1,
        "ads.rating.value": 1,
      }
    );

    if (!isValidMongoObject(foundBusiness)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Business not found",
      });
    }

    return this.res.json({
      success: true,
      message: "Business gotten Succesfully",
      business: foundBusiness,
    });
  }
  async __createService() {
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

    if (!isValidMongoObjectId(userId)) {
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid user",
      });
    }
    if (!isValidMongoObjectId(estateId)) {
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid estate id",
      });
    }

    const newServiceName = this.req.body.name || "";
    const newServicePhonenumber = this.req.body.phone || "";
    const newServiceEmail = this.req.body.email || "";
    const newServiceAddress = this.req.body.address || "";
    const newServiceCategory = this.req.body.category || "";
    const newServiceDetails = this.req.body.details || "";

    if (!isEmail(newServiceEmail)) {
      return this.res.json({
        success: false,
        message: "Sorry!...invalid email",
      });
    }
    if (newServiceName.length < 3) {
      return this.res.json({
        success: false,
        message: "Sorry!...You didn't provide a valid name",
      });
    }
    if (!isValidPhonenumber(newServicePhonenumber)) {
      return this.res.json({
        success: false,
        message: "Sorry!...phonenumber not valid",
      });
    }
    const formattedNewServicePhonenumber = formatPhonenumber(
      newServicePhonenumber
    );
    if (newServiceAddress.length < 3) {
      return this.res.json({
        success: false,
        message: "Sorry!...address not valid",
      });
    }
 

    if (
      !isNaN(newServiceCategory) &&
      !configDoc.serviceCategory[newServiceCategory]
    ) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "category not valid",
      });
    }

    if (isNaN(newServiceCategory) && newServiceCategory.length < 3) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "category not valid",
      });
    }



    const newlyCreatedService = await new Service({
      status: 1,
      createdOn,
      createdBy: userId,
      ownerId: userId,
      isAvailiable: 1,
      type: 0, //0:service,1:company
      category:configDoc.serviceCategory[newServiceCategory] || newServiceCategory,
    });

    const newlyCreatedServiceEstateLinking = await new ServiceEstateLinking({
      status: 1,
      estateId,
      businessId: newlyCreatedService._id,
      createdBy: userId,
      createdOn,
    });

    if (!isValidMongoObject(newlyCreatedServiceEstateLinking)) {
      return this.res.json({
        success: false,
        message: "Sorry....error while creating Service Estate Linking ",
      });
    }

    let foundEmail = await Email.findOne({
      value: newServiceEmail,
      status: 1,
    });

    let newlyCreatedServicesEmail;

    if (isValidMongoObject(foundEmail)) {
      const foundEmailOwnerId = foundEmail.ownerId || "";
      let foundService = await Service.findOne({
        _id: foundEmailOwnerId,
        ownerId: { $ne: userId },
        status: 1,
      });
      if (
        !stringIsEqual(foundEmailOwnerId, userId) &&
        isValidMongoObject(foundService)
      ) {
        return this.res.json({
          success: false,
          message: "Oops!...email already belongs to another user",
        });
      }
    } else {
      newlyCreatedServicesEmail = await new Email({
        status: 1,
        value: newServiceEmail,
        isPrimary: 0,
        ownerId: newlyCreatedService._id,
        ownerType: 6,
        createdBy: userId,
        createdOn,
      });
    }

    let foundPhonenumber = await PhoneNumber.findOne({
      status: 1,
      value: formattedNewServicePhonenumber[1],
      countryCode: formattedNewServicePhonenumber[0],
    });
    let newlyCreatedServicesPhonenumber;

    if (isValidMongoObject(foundPhonenumber)) {
      const foundPhonenumberOwnerId = foundPhonenumber.ownerId || "";
      let foundService = await Service.findOne({
        _id: foundPhonenumberOwnerId,
        ownerId: { $ne: userId },
        status: 1,
      });
      if (
        !stringIsEqual(foundPhonenumberOwnerId, userId) &&
        isValidMongoObject(foundService)
      ) {
        return this.res.json({
          success: false,
          message: "Ooops!...phonenumber already belongs to another user",
        });
      }
    } else {
      newlyCreatedServicesPhonenumber = await new PhoneNumber({
        status: 1,
        value: formattedNewServicePhonenumber[1],
        countryCode: formattedNewServicePhonenumber[0],
        isPrimary: 0,
        ownerId: newlyCreatedService._id,
        ownerType: 6,
        createdBy: userId,
        createdOn,
      });
    }
    const newlyCreatedServicesName = await new Name({
      status: 1,
      value: newServiceName,
      ownerId: newlyCreatedService._id,
      ownerType: 6,
      createdBy: userId,
      createdOn,
    });

    const newlyCreatedServicesAddress = await new HouseAddressName({
      status: 1,
      value: newServiceAddress,
      ownerId: newlyCreatedService._id,
      ownerType: 5,
      createdBy: userId,
      createdOn,
    });
    newlyCreatedService.emails = isValidMongoObject(foundEmail)
      ? foundEmail
      : newlyCreatedServicesEmail;
    newlyCreatedService.phoneNumbers = isValidMongoObject(foundPhonenumber)
      ? foundPhonenumber
      : newlyCreatedServicesPhonenumber;
    newlyCreatedService.name = newlyCreatedServicesName;
    newlyCreatedService.businessAddress = newlyCreatedServicesAddress;

    if (
      !isValidMongoObject(foundEmail) &&
      isValidMongoObject(newlyCreatedServicesEmail)
    ) {
      await newlyCreatedServicesEmail.save();
    }

    if (
      !isValidMongoObject(foundPhonenumber) &&
      isValidMongoObject(newlyCreatedServicesPhonenumber)
    ) {
      await newlyCreatedServicesPhonenumber.save();
    }

    let defaultServiceImage = await ServiceImage.findOne({
      status: 1,
      default: 1,
    });
    if (!isValidMongoObject(defaultServiceImage)) {
      defaultServiceImage = await new ServiceImage({
        status: 1,
        url: "",
        createdBy: userId,
        default: 1,
        createdOn,
      });

      await defaultServiceImage.save();
    }
    if (newServiceDetails.length > 3) {
      const newlyCreatedServiceDetails = await new ServiceDetails({
        status: 1,
        value: newServiceDetails,
        ownerId: newlyCreatedService._id,
        ownerType: 5,
        createdBy: userId,
        createdOn,
      });

      newlyCreatedService.details = newlyCreatedServiceDetails;
      await newlyCreatedServiceDetails.save();
    }
    await newlyCreatedServiceEstateLinking.save();
    newlyCreatedService.image = defaultServiceImage;
    await newlyCreatedServicesName.save();
    await newlyCreatedServicesAddress.save();

    await newlyCreatedService.save();

    return this.res.json({
      success: true,
      message: "Service created  Succesfully",
    });
  }
  async __addServiceImage() {
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
    let { serviceId } = this.req.params || null;

    if (!isValidMongoObjectId(serviceId)) {
      return this.res.json({
        success: false,
        message: "Sorry!... Invalid service id",
      });
    }
    if (!isValidMongoObjectId(userId)) {
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid user",
      });
    }
    if (!isValidMongoObjectId(estateId)) {
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid estate id",
      });
    }
    const existingService = await Service.findOne({
      status: 1,
      _id: serviceId,
    });

    if (!isValidMongoObject(existingService)) {
      return this.res.json({
        success: false,
        message: "Sorry!...existing Service not found",
      });
    }
    const file = this.req.file;
    if (!file || !file.filename) {
      return this.res.json({
        success: false,
        message: "Sorry!... Invalid Image file",
      });
    }
    const fileName = "image" + Date.now();
    let newlyCreatedServiceImage = {};
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        //   resource_type: "image",
        public_id: `service/uploads/images/${fileName}`,
        overwrite: true,
      });

      newlyCreatedServiceImage = await new ServiceImage({
        status: 1,
        url: result.secure_url,
        createdOn,
        createdBy: userId,
      });
    } catch (error) {
      console.log(error);
    }

    if (!isValidMongoObject(newlyCreatedServiceImage)) {
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Service image",
      });
    }

    await newlyCreatedServiceImage.save();
    try {
      const updateExistingService = await Service.updateOne(
        {
          status: 1,
          _id: serviceId,
        },
        {
          $set: { image: newlyCreatedServiceImage },
        }
      );
    } catch (error) {
      console.log(error);
    }
    try {
      const updateExistingServiceImage = await ServiceImage.updateMany(
        {
          status: 1,
          _id: { $ne: newlyCreatedServiceImage._id },
          serviceId,
        },
        {
          $set: { status: 0 },
        }
      );
    } catch (error) {
      console.log(error);
    }

    return this.res.json({
      success: true,
      message: "Service Image added Succesfully",
    });
  }
  async __addDefaultServiceImage() {
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

    if (!isValidMongoObjectId(userId)) {
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid user",
      });
    }
    if (!isValidMongoObjectId(estateId)) {
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid estate id",
      });
    }

    const file = this.req.file;
    if (!file || !file.filename) {
      return this.res.json({
        success: false,
        message: "Sorry!... Invalid Image file",
      });
    }
    const fileName = "image" + Date.now();
    let newlyCreatedServiceImage = {};
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        //   resource_type: "image",
        public_id: `service/uploads/images/${fileName}`,
        overwrite: true,
      });

      newlyCreatedServiceImage = await new ServiceImage({
        status: 1,
        url: result.secure_url,
        createdOn,
        createdBy: userId,
        default: 1,
      });
    } catch (error) {
      console.log(error);
    }

    if (!isValidMongoObject(newlyCreatedServiceImage)) {
      return this.res.json({
        success: false,
        message: "Sorry! error while creating Service image",
      });
    }
    await newlyCreatedServiceImage.save();

    return this.res.json({
      success: true,
      message: "Default Service Image added Succesfully",
    });
  }

  async __getEstateServices() {
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

    const foundEstateService = await ServiceEstateLinking.find({
      status: 1,
      estateId: selectedEstateId,
    });

    return this.res.json({
      success: true,
      message: "Services gotten Succesfully",
      service: foundEstateService,
    });
  }

  async __getServices() {
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

    const foundService = await Service.find({
      status: 1,
    },
    {
      _id: 1,
      "name.value": 1,
      "emails.value": 1,
      "phoneNumbers.value": 1,
      "phoneNumbers.countryCode": 1,
      category: 1,
      adType: 1,
      createdOn: 1,
      "details.value": 1,
      "image.url": 1,
      "serviceAddress.value": 1,
      "operatingDays.value": 1,
      isAvailiable: 1,
      "ads.title": 1,
      "ads.category": 1,
      "ads.type": 1,
      "ads.ownerPhone": 1,
      "ads.ownerEmail": 1,
      "ads.details.value": 1,
      "ads.image.url": 1,
      "ads.description.value": 1,
      "ads.rating.value": 1,
    });

    return this.res.json({
      success: true,
      message: "Service gotten Succesfully",
      service: foundService,
    });
  }
  
  async __getParticularService() {
    const createdOn = new Date();
    // validate request
    const user = this.res.user || {};
    const { _id: userId = "" } = user;
    if (!isValidMongoObject(user)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Sorry!...user not found!!!",
      });
    }
    const { serviceId } = this.req.params || {};

    if (!isValidMongoObjectId(serviceId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "provide a valid service id",
      });
    }
    if (!isValidMongoObjectId(userId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid user",
      });
    }

    const newlyCreatedService = await Service.findOne(
      {
        status: 1,
        _id: serviceId,
      },
      {
        _id: 1,
        "name.value": 1,
        "emails.value": 1,
        "phoneNumbers.value": 1,
        "phoneNumbers.countryCode": 1,
        category: 1,
        adType: 1,
        "details.value": 1,
        createdOn: 1,
        "image.url": 1,
        "businessAddress.value": 1,
        "operatingDays.value": 1,
        isAvailiable: 1,
        "ads.title": 1,
        "ads.category": 1,
        "ads.type": 1,
        "ads.ownerPhone": 1,
        "ads.ownerEmail": 1,
        "ads.details.value": 1,
        "ads.image.url": 1,
        "ads.description.value": 1,
        "ads.rating.value": 1,
      }
    );

    if (!isValidMongoObject(newlyCreatedService)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "ServiceId not found",
      });
    }

    return this.res.json({
      success: true,
      message: "Business gotten Succesfully",
      service: newlyCreatedService,
    });
  }
}
module.exports = Services;
