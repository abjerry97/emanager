const {
  isValidFullName,
  isValidPhonenumber,
  isValidMongoObject,
  isValidMongoObjectId,
  stringIsEqual,
} = require("../../helpers/validators");
const GatePass = require("../../model/gate-pass");
const Guest = require("../../model/guest");
const HouseAddressName = require("../../model/house-address");
const RegisteredEstate = require("../../model/registered-estate");
const Authentication = require("../Authentication/auth");
const Visitor = require("../Visitor/Visitor");
class Security {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
  }

  async __checkPass() {
    const createdOn = new Date();
    const estateId = (!!this.res.security && this.res.security.estateId) || "";
    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Invalid estate id",
      });
    }
    const foundEstate = await this.__findEstate(estateId);

    if (!isValidMongoObject(foundEstate)) {
      return foundEstate;
    }

    const pass = this.req.body.pass || "";

    if (isNaN(pass) || pass.length < 6) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "invalid pass",
      });
    }
    const foundPass = await this.__findPass(pass);

    if (!isValidMongoObject(foundPass)) {
      return foundPass;
    }
    // await this.__invalidateCheckedPass(foundPass._id);
    const guestId = foundPass.guestId || "";

    const ownerId = foundPass.createdBy || "";
    if (!isValidMongoObjectId(guestId)) {
      this.res.statusCode = 406
      return this.res.json({
        success: false,
        message: "Invalid guest id",
      });
    }
    if (!isValidMongoObjectId(ownerId)) {
      this.res.statusCode = 406
      return this.res.json({
        success: false,
        message: "Invalid owner id",
      });
    }
    const foundGuest = await this.__findGuest(estateId, guestId);

    if (!isValidMongoObject(foundGuest)) {
      return foundGuest;
    }

    const foundHouseAddress = await this.__findHouseAddress(ownerId, estateId);
    if (!isValidMongoObject(foundHouseAddress)) {
      return foundHouseAddress;
    }
    return this.res.json({
      success: true,
      message: "Pass check complete",
      guest: foundGuest,
      destination: foundHouseAddress,
    });
  }

  async __findHouseAddress(ownerId, estateId) {
    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Invalid Estate id ",
      });
    }
    if (!isValidMongoObjectId(ownerId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Invalid owner id ",
      });
    }
    const createdOn = new Date();
    const foundhouse = await HouseAddressName.findOne({ ownerId, estateId });
    if (!isValidMongoObject(foundhouse)) {
      this.res.statusCode = 404
      return this.res.json({
        success: false,
        message: "house not found",
      });
    }

    return foundhouse;
  }
  async __findPass(value, passId) {
    const query = {};
    if (!isNaN(value) && value.length > 2) {
      query.value = value;
    }
    if (isValidMongoObjectId(passId)) {
      query._id = passId;
    }
    const createdOn = new Date();
    const foundPass = await GatePass.findOne(query);
    if (!isValidMongoObject(foundPass)) {
      this.res.statusCode = 404
      return this.res.json({
        success: false,
        message: "pass not found",
      });
    }

    if (
      stringIsEqual(foundPass.status, 0) ||
      foundPass.expiresOn <= createdOn
    ) {
      this.res.statusCode = 409
      return this.res.json({
        success: false,
        message: "pass already expired",
      });
    }

    if (!stringIsEqual(foundPass.status, 1)) {
      this.res.statusCode = 409
      return this.res.json({
        success: false,
        message: "pass not active",
      });
    }

    return foundPass;
  }
  async __findGuest(estateId, guestId) {
    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 409
      return this.res.json({
        success: false,
        message: "Invalid Estate id ",
      });
    }
    if (!isValidMongoObjectId(guestId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Invalid guest id ",
      });
    }
    const createdOn = new Date();
    const foundGuest = await Guest.findOne({
      status: 1,
      _id: guestId,
      estateId,
    });
    if (!isValidMongoObject(foundGuest)) {
      this.res.statusCode = 404
      return this.res.json({
        success: false,
        message: "Guest not found",
      });
    }

    return foundGuest;
  }

  async __findEstate(estateId) {
    const createdOn = new Date();
    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Invalid EstateId ",
      });
    }

    const foundEstate = await RegisteredEstate.findOne({
      status: 1,
      _id: estateId,
    });

    if (!isValidMongoObject(foundEstate)) {
      this.res.statusCode = 404
      return this.res.json({
        success: false,
        message: "Estate not Found ",
      });
    }

    return foundEstate;
  }
  async __invalidateCheckedPass(passId) {
    const createdOn = new Date();

    const updatePass = await GatePass.updateOne(
      {
        _id: passId,
      },
      {
        $set: { status: "2", checkedOn: createdOn },
      }
    );
  }

  async __confirmPass() {
    const createdOn = new Date();
    const estateId = (!!this.res.security && this.res.security.estateId) || "";
    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Invalid estate id",
      });
    }
    const foundEstate = await this.__findEstate(estateId);

    if (!isValidMongoObject(foundEstate)) {
      return foundEstate;
    }

    const passId = this.req.params.passId || "";

    if (!isValidMongoObjectId(passId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Invalid pass id",
      });
    }
    const foundPass = await this.__findPass("", passId);

    if (!isValidMongoObject(foundPass)) {
      return foundPass;
    }

    await this.__invalidateCheckedPass(passId);
    return this.res.json({
      success: true,
      message: "Granted Entry",
    });
  }
}
module.exports = Security;
