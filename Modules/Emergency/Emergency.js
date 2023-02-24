const { isHashedString, formatPhonenumber } = require("../../helpers/tools");
const {
  stringIsEqual,
  isValidMongoObject,
  isValidArrayOfMongoObject,
  isValidMongoObjectId,
  isValidPhonenumber,
  isEmail,
  isValidFullName,
  isValidPassword,
} = require("../../helpers/validators");
const EmergencyScheama = require("../../model/emergency");
const Authentication = require("../Authentication/auth");
const EmergencyPhoneNumber = require("../../model/emergency-phone-number");
const EmergencyDetails = require("../../model/emergency-details");

const responseBody = require("../../helpers/responseBody");
class Emergency extends Authentication {
  constructor(req, res, next) {
    super();
    this.req = req;
    this.res = res;
    this.next = next;
  }

  async __userActivateEmergency() {
    const createdOn = new Date();
    // validate request

    const user = this.res.user || {};
    const { _id: userId } = user || "";
    const { _id: estateId } = this.res.estate || "";

    const newUserEmergency = await new EmergencyScheama({
      status: 1,
      ownerId: userId,
      ownerType: 0,
      mode: 1,
      createdOn,
      estateId,
    });
    if (!isValidMongoObject(newUserEmergency)) {
      return this.res.json({
        success: false,
        message: "Emergency mode not created",
      });
    }

    await newUserEmergency.save();

    return this.res.json({
      success: true,
      message:
        "Emergency mode activated, Messages have been sent to Estate Admins, It will be automatically disabled after 1hour",
    });
  }

  async __addEmergencyDetails() {
    const createdOn = new Date();
    const adminId = (this.res.admin && this.res.admin._id) || "";
    const admin = this.res.admin || "";

    if (!isValidMongoObject(admin) || !isValidMongoObjectId(adminId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: " invalid admin",
      });
    }
    const { _id: estateId } = this.res.estate || "";
    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid estate id",
      });
    }

    const foundEstate = await this.__findEstate(estateId);
    if (!isValidMongoObject(foundEstate)) {
      return foundEstate;
    }
    const name = this.req.body.name || "";
    const phone = this.req.body.phone || "";
    const excoRole = this.req.body.excoRole || "";
    if (!isValidFullName(name)) {
      return responseBody.ErrorResponse(this.res, "Provide a valid full name");
    }
    if (excoRole.length < 3) {
      return responseBody.ErrorResponse(this.res, "Provide a valid exco role");
    }
    const newlyCreatedPhonenumber = await this.__createEmergencyPhonenumber(
      phone,
      estateId
    );
    if (!isValidMongoObject(newlyCreatedPhonenumber)) {
      return newlyCreatedPhonenumber;
    }
    const newEmergencyDetails = await new EmergencyDetails({
      status: "1",
      name,
      createdOn,
      excoRole,
      estateId,
    });

    if (!isValidMongoObject(newEmergencyDetails)) {
      return responseBody.ErrorResponse(
        this.res,
        "Error adding Emergency Details"
      );
    }

    newlyCreatedPhonenumber.emergencyDetailsId = newEmergencyDetails._id;
    newEmergencyDetails.phonenumber = newlyCreatedPhonenumber;

    await newlyCreatedPhonenumber.save();
    await newEmergencyDetails.save();
    return this.res.json({
      success: true,
      message: "Emergency Details Created Succesfully",
    });
  }
  async __deleteEmergencyDetails() {
    const createdOn = new Date();
    const adminId = (this.res.admin && this.res.admin._id) || "";
    const admin = this.res.admin || "";

    if (!isValidMongoObject(admin) || !isValidMongoObjectId(adminId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: " invalid admin",
      });
    }
    const { _id: estateId } = this.res.estate || "";
    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid estate id",
      });
    }

    const foundEstate = await this.__findEstate(estateId);
    if (!isValidMongoObject(foundEstate)) {
      return foundEstate;
    }
    const detailsId = this.req.params["detailsId"] || "";
    if (!isValidMongoObjectId(detailsId)) {
      return responseBody.ErrorResponse(this.res, "Provide a valid detailsId");
    }

    const existingEmergencyDetails = await EmergencyDetails.findOne({
      status: "1",
      _id: detailsId,
    });

    if (!isValidMongoObject(existingEmergencyDetails)) {
      return responseBody.notFoundResponse(
        this.res,
        "Emergency Details not found or already deleted"
      );
    }

    const deleteExistingEmergencyPhoneNumber =
      await this.__deleteEmergencyPhonenumber(
        existingEmergencyDetails._id,
        adminId
      );

    const query = {
      status: 1,
      _id: existingEmergencyDetails._id,
    };

    const updatableSet = {
      status: 0,
    };
    if (isValidMongoObject(deleteExistingEmergencyPhoneNumber)) {
      updatableSet.phonenumber = deleteExistingEmergencyPhoneNumber;
    }
    const deleteEmergencyPhonenumber = await EmergencyDetails.updateOne(
      {
        ...query,
      },
      {
        $set: updatableSet,
        $push: {
          updates: {
            by: adminId, // admin ID of the admin who made this update
            action: "Delete", //0:delete,
            timing: createdOn,
          },
        },
      },
      { new: true }
    );

    return this.res.json({
      success: true,
      message: "Emergency Details Deleted Succesfully",
    });
  }
  async __getEmergencyDetails() {
    const createdOn = new Date();
    const adminId = (this.res.admin && this.res.admin._id) || "";
    const admin = this.res.admin || "";

    if (!isValidMongoObject(admin) || !isValidMongoObjectId(adminId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: " invalid admin",
      });
    }
    const { _id: estateId } = this.res.estate || "";
    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid estate id",
      });
    }

    const foundEstate = await this.__findEstate(estateId);
    if (!isValidMongoObject(foundEstate)) {
      return foundEstate;
    }

    const existingEmergencyDetails = await EmergencyDetails.find({
      status: "1",
      estateId,
    });

    if (
      !isValidArrayOfMongoObject(existingEmergencyDetails) ||
      existingEmergencyDetails.length < 1
    ) {
      return responseBody.notFoundResponse(
        this.res,
        "Emergency Details Not found"
      );
    }

    return this.res.json({
      success: true,
      message: "Emergency Details Created Succesfully",
      emergengyDetails: existingEmergencyDetails,
    });
  }
  async __getUserEmergencyMode() {
    const createdOn = new Date();
    // validate request

    const user = this.res.user || {};
    const { _id: userId } = user || "";
    const { _id: estateId } = this.res.estate || "";
    const userEmergency = await EmergencyScheama.findOne({
      status: 1,
      ownerId: userId,
      estateId,
    });

    if (!isValidMongoObject(userEmergency)) {
      const newUserEmergency = await new EmergencyScheama({
        status: 1,
        ownerId: userId,
        ownerType: 0,
        mode: 0,
        createdOn,
        estateId,
      });

      if (!isValidMongoObject(newUserEmergency)) {
        return this.res.json({
          success: false,
          message: "Emergency mode not created",
          mode: {},
        });
      }

      await newUserEmergency.save();

      return this.res.json({
        success: true,
        message: "Emergency gotten succesfully",
        mode: newUserEmergency,
      });
    }

    return this.res.json({
      success: true,
      message: "Emergency gotten successfully",
      mode: userEmergency,
    });
  }
  async __findExistingEmergencyPhonenumber(phone, estateId) {
    const createdOn = new Date();
    if (!isValidPhonenumber(phone)) {
      return responseBody.validationErrorWithData(
        this.res,
        "you need to provide a valid phonenumber",
        "phone",
        phone
      );
    }
    const formattedPhonenumber = formatPhonenumber(phone);
    const query = {
      value: formattedPhonenumber[1] || "",
      countryCode: formattedPhonenumber[0] || "",
      status: 1,
      estateId,
    };

    const existingPhoneneumber = await EmergencyPhoneNumber.findOne(query);

    if (!isValidMongoObject(existingPhoneneumber)) {
      return false;
    }

    return existingPhoneneumber;
  }
  async __createEmergencyPhonenumber(phone, estateId) {
    const createdOn = new Date();
    if (!isValidPhonenumber(phone)) {
      return responseBody.validationErrorWithData(
        this.res,
        "you need to provide a valid phonenumber",
        "phone",
        phone
      );
    }
    const formattedPhonenumber = formatPhonenumber(phone);
    const query = {
      value: formattedPhonenumber[1] || "",
      countryCode: formattedPhonenumber[0] || "",
      status: 1,
      estateId,
    };

    const existingPhonenumber = await this.__findExistingEmergencyPhonenumber(
      phone,
      estateId
    );
    if (isValidMongoObject(existingPhonenumber)) {
      return responseBody.ErrorResponse(this.res, "Phone number already exist");
    }

    const newlyCreatedEmergencyPhonenumber = await new EmergencyPhoneNumber({
      ...query,
      createdOn,
    });
    if (!isValidMongoObject(newlyCreatedEmergencyPhonenumber)) {
      return responseBody.ErrorResponse(
        this.res,
        "Error Creating phone number"
      );
    }
    return newlyCreatedEmergencyPhonenumber;
  }
  async __deleteEmergencyPhonenumber(emergencyDetailsId, adminId) {
    const createdOn = new Date();

    const query = {
      // status: 1,
      emergencyDetailsId,
    }; 

    const deleteEmergencyPhonenumber =
      await EmergencyPhoneNumber.findOneAndUpdate(
        {
          ...query,
        },
        {
          $set: { status: 0 },
          $push: {
            updates: {
              by: adminId, // admin ID of the admin who made this update
              action: "Delete", //0:delete,
              timing: createdOn,
            },
          },
        },
        { new: true }
      ); 
    return deleteEmergencyPhonenumber;
  }

  // admin
}
module.exports = Emergency;
