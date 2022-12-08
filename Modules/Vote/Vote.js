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
const Estate = require("../Estate/Estate");
class Vote extends Estate {
  constructor(req, res, next) {
    super();
    this.req = req;
    this.res = res;
    this.next = next;
  }

  async __getAdmins() {
    const createdOn = new Date();
    const adminId = (this.res.admin && this.res.admin._id) || "";
    const admin = this.res.admin || "";

    if (!isValidMongoObject(admin) || !isValidMongoObjectId(adminId)) {
      return this.res.json({
        success: false,
        message: "invalid admin",
      });
    }
    let estateId = admin.estateId || "";

    const foundEstate = await this.__findEstate(estateId);
    if (!isValidMongoObject(foundEstate)) {
      return foundEstate;
    }

    const foundAdmins = await this.__findAllParticularEstateAdmins(estateId);
    // if(Array.isArray(foundAdmins)){
    //   return foundAdmins
    // }

    if (!Array.isArray(foundAdmins) || foundAdmins.length < 1) {
      return foundAdmins;
    }
    return this.res.json({
      success: false,
      message: "Admins Found ",
      admins: foundAdmins,
    });
  }

}
module.exports = Vote;
