const {
  isValidFullName,
  isValidPhonenumber,
  isValidMongoObject,
  isValidMongoObjectId,
  stringIsEqual,
  isEmail,
  isValidArrayOfMongoObject,
  isValidPassword,
} = require("../../helpers/validators");
const Email = require("../../model/email");
const AdminScheama = require("../../model/admin");
const PhoneNumber = require("../../model/phone-number");
const Authentication = require("../Authentication/auth");
const Name = require("../../model/name");
const Password = require("../../model/password");
const { isHashedString, formatPhonenumber } = require("../../helpers/tools");
const Poll = require("../../model/poll");
const Candidate = require("../../model/candidate");
const Votes = require("../../model/votes");
const RegisteredEstate = require("../../model/registered-estate");
const UserEstate = require("../../model/user-estate");
const User = require("../../model/user");
const Business = require("../../model/business");
const BusinessImage = require("../../model/business-image");
const BusinessDays = require("../../model/business-days");
const HouseAddressName = require("../../model/house-address");
const BusinessEstateLinking = require("../../model/business-estate-linking");
const Service = require("../../model/service");
const ServiceImage = require("../../model/service-image");
const ServiceEstateLinking = require("../../model/service-estate-linking");
const AdminOfficeAddress = require("../../model/admin-office-address");
const AdminOfficeName = require("../../model/admin-office-name");
const AdminOfficePhoneNumber = require("../../model/admin-office-phonenumber");
const AdminOfficeEmail = require("../../model/admin-office-email");
const AdminGuarantorsName = require("../../model/admin-guarantor-name");
const AdminGuarantorsPhoneNumber = require("../../model/admin-guarantor-phonenumber");
const { adminScheama } = require("../../helpers/projections");
const AdminGuarantorsEmail = require("../../model/admin-guarantor-name-email");
const scheamaTools = require("../../helpers/scheamaTools");
const responseBody = require("../../helpers/responseBody");
class Admin extends Authentication {
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
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid admin",
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

    const foundAdmins = await this.__findAllParticularEstateAdmins(estateId);
    // if(Array.isArray(foundAdmins)){
    //   return foundAdmins
    // }

    if (!Array.isArray(foundAdmins) || foundAdmins.length < 1) {
      return foundAdmins;
    }
    return this.res.json({
      success: true,
      message: "Admins Found ",
      admins: foundAdmins,
    });
  }
  async __getAdminUpdateCount() {
    const createdOn = new Date();
    const adminId = (this.res.admin && this.res.admin._id) || "";
    const admin = this.res.admin || "";

    if (!isValidMongoObject(admin) || !isValidMongoObjectId(adminId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid admin",
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

    const updates = {};

    if (!!this.res.adminCount && !isNaN(this.res.adminCount)) {
      updates.adminCount = this.res.adminCount;
    }
    if (!!this.res.houseCount && !isNaN(this.res.houseCount)) {
      updates.houseCount = this.res.houseCount;
    }
    if (!!this.res.residentCount && !isNaN(this.res.residentCount)) {
      updates.residentCount = this.res.residentCount;
    }
    if (!!this.res.forumCount && !isNaN(this.res.forumCount)) {
      updates.forumCount = this.res.forumCount;
    }
    if (!!this.res.electionCount && !isNaN(this.res.electionCount)) {
      updates.electionCount = this.res.electionCount;
    }
 
    return this.res.json({
      success: true,
      updates,
    });
  }
  async __getAdmin() {
    const createdOn = new Date();
    const currentadminId = (this.res.admin && this.res.admin._id) || "";
    const { adminId } = (this.req.params && this.req.params) || "";

    const admin = this.res.admin || "";

    if (!isValidMongoObject(admin) || !isValidMongoObjectId(currentadminId)) {
      this.res.statusCode = 406;
      return this.res.json({
        success: false,
        message: "This request comes from an invalid admin",
      });
    }
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
        message: " estate id",
      });
    }

    const foundEstate = await this.__findEstate(estateId);
    if (!isValidMongoObject(foundEstate)) {
      return foundEstate;
    }

    const foundAdmin = await this.__findParticularEstateAdmin(
      adminId,
      estateId
    );

    // if(Array.isArray(foundAdmins)){
    //   return foundAdmins
    // }

    if (!isValidMongoObject(foundAdmin)) {
      return foundAdmin;
    }
    const existingAdmin = await AdminScheama.findOne(
      {
        status: 1,
        _id: foundAdmin.ownerId,
      },
      adminScheama
    );

    if (!isValidMongoObject(foundAdmin)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Admin not Found ",
      });
    }
    return this.res.json({
      success: true,
      message: "Admin Found ",
      admin: existingAdmin,
    });
  }

  async __getAdminDetails() {
    const createdOn = new Date();
    const currentadminId = (this.res.admin && this.res.admin._id) || "";
    const { adminId } = (this.req.params && this.req.params) || "";

    const admin = this.res.admin || "";

    if (!isValidMongoObject(admin) || !isValidMongoObjectId(currentadminId)) {
      this.res.statusCode = 402;
      return this.res.json({
        success: false,
        message: "This request comes from an invalid admin",
      });
    }
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

    const foundParticularAdmin = await this.__findAdmin(adminId, estateId);
    if (!isValidMongoObject(foundParticularAdmin)) {
      return foundParticularAdmin;
    }

    const foundAdmin = await this.__findParticularEstateAdmin(
      foundParticularAdmin._id,
      estateId
    );
    // if(Array.isArray(foundAdmins)){
    //   return foundAdmins
    // }

    if (!isValidMongoObject(foundAdmin)) {
      return foundAdmin;
    }
    if (!isValidMongoObjectId(foundAdmin._id)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid foundAdmin user id",
      });
    }

    const foundUser = await this.__findUser(foundParticularAdmin.userId, 0);

    if (!isValidMongoObject(foundUser)) {
      return foundUser;
    }
    return this.res.json({
      success: true,
      message: "Admin Found ",
      admin: foundParticularAdmin,
      user: foundUser,
    });
  }

  async __deleteAdmin() {
    const createdOn = new Date();
    const currentadminId = (this.res.admin && this.res.admin._id) || "";
    const { adminId } = (this.req.params && this.req.params) || "";

    const admin = this.res.admin || "";

    // if (
    //   !stringIsEqual(currentadminId, adminId) &&
    //   Number(admin.role) > 2 &&
    //   !stringIsEqual(admin.isTopmost, 1)
    // ) {
    //   return this.res.json({
    //     success: false,
    //     message: "you are not permitted to make this request",
    //   });
    // }

    if (!isValidMongoObject(admin) || !isValidMongoObjectId(currentadminId)) {
      this.res.statusCode = 402;
      return this.res.json({
        success: false,
        message: "This request comes from an invalid admin",
      });
    }
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

    const foundAdmin = await this.__findParticularEstateAdmin(
      adminId,
      estateId
    );

    if (!isValidMongoObject(foundAdmin)) {
      return foundAdmin;
    }
    // only the topmost admin can delete an admin not under his estate
    if (
      !stringIsEqual(estateId, foundAdmin.estateId) &&
      !stringIsEqual(admin.isTopmost, 1)
    ) {
      this.res.statusCode = 401;
      return this.res.json({
        success: false,
        message: "you are not permitted to make this request",
      });
    }

   const result =  await super.__deleteAdmin(adminId, currentadminId, 1, estateId);
    if( !stringIsEqual(result , true)){
      return result
    }
    return this.res.json({
      success: true,
      message: "Admin Deleted successfully ",
    });
  }

  async __getAllAdminEstates() {
    const createdOn = new Date();
    const adminId = (this.res.admin && this.res.admin._id) || "";
    const admin = this.res.admin || "";

    if (!isValidMongoObject(admin) || !isValidMongoObjectId(adminId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid admin",
      });
    }
    const { _id: estateId } = this.res.estate || "";

    if (!isValidMongoObjectId(estateId)) {
      return this.res.json({
        success: false,
        message: "invalid estate id",
      });
    }

    const existingRegisteredEstate = await RegisteredEstate.find({
      status: 1,
      ownerId: adminId,
    });

    if (!isValidArrayOfMongoObject(existingRegisteredEstate)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "error finding Registered Estates",
      });
    }

    return this.res.json({
      success: true,
      message: "Existing admin Registered Estate gotten Successfully",
      existingRegisteredEstate,
    });
  }

  async __createAdmin() {
    const createdOn = new Date();
    const adminId = (this.res.admin && this.res.admin._id) || "";
    const admin = this.res.admin || "";
    if (!isValidMongoObject(admin) || !isValidMongoObjectId(adminId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid admin",
      });
    }
    let { _id: estateId } = this.res.estate || "";
    if (stringIsEqual(admin.isTopmost, 1)) {
      let selectedEstateId = this.req.query["estateId"] || "";

      if (isValidMongoObjectId(selectedEstateId)) {
        estateId = selectedEstateId;
      }
    }

    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid estate id",
      });
    }

    // if (Number(admin.role) > 2) {
    //   return this.res.json({
    //     success: false,
    //     message: "you are not permitted to make this request",
    //   });
    // }
    let foundEstate = "";
    if (!stringIsEqual(admin.isTopmost, 1)) {
      foundEstate = await this.__findEstate(estateId);
      if (!isValidMongoObject(foundEstate)) {
        return foundEstate;
      }
    }
    const newAdminName = this.req.body.name || "";
    const newAdminPhonenumber = this.req.body.phone || "1111";
    const newAdminEmail = this.req.body.email || "";
    const newAdminExcoRole = this.req.body.excoRole;
    const newAdminPasscode = this.req.body.password || "";

    const {
      officeAddress = "",
      officeName = "",
      officePhoneNumber = "",
      address = "",
      officeEmail = "",
      guarantorName = "",
      guarantorEmail = "",
      guarantorPhoneNumber = "",
    } = this.req.body || {};
    // if (!isValidFullName(address)) {
    //   this.res.statusCode = 400;
    //   return this.res.json({
    //     success: true,
    //     message: "provide a valid Admin house address",
    //   });
    // }

    if (!isValidFullName(newAdminName)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: true,
        message: "provide a valid fullname",
      });
    }

    if (!isValidPhonenumber(newAdminPhonenumber)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: true,
        message: "provide a valid phonenumber",
      });
    }

    if (!isEmail(newAdminEmail)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: true,
        message: "provide a valid email",
      });
    }

    // if (!newAdminExcoRole || isNaN(newAdminExcoRole)) {
    //   return this.res.json({
    //     success: true,
    //     message: "provide a valid exco role",
    //   });
    // }
    if (!isNaN(newAdminExcoRole) || newAdminExcoRole.length < 3) {
      this.res.statusCode = 400;
      return this.res.json({
        success: true,
        message: "provide a valid exco role",
      });
    }

    if (!isValidPassword(newAdminPasscode)) {
      this.res.statusCode = 409;
      return this.res.json({
        success: true,
        message: "provide a valid password",
      });
    }

    const formattedPhonenumber = formatPhonenumber(newAdminPhonenumber);
    const foundUserEmail = await this.__findEmail(newAdminEmail, 0, "-", "-");
    if (!isValidMongoObject(foundUserEmail)) {
      return foundUserEmail;
    }

    if (stringIsEqual(foundUserEmail.isAdmin, 1)) {
      this.res.statusCode = 409;
      return this.res.json({
        success: false,
        message: " Email already belong to an admin ",
      });
    }
    const userId = (!!foundUserEmail && foundUserEmail.ownerId) || "";

    if (!isValidMongoObjectId(userId)) {
      this.res.statusCode = 409;
      return this.res.json({
        success: false,
        message: "invalid user id",
      });
    }
    const foundUser = await this.__findUser(userId, 0);
    if (!isValidMongoObject(foundUser)) {
      return foundUser;
    }

    // if(!foundUser.isVerified){
    //   return responseBody.ErrorResponse(this.res, "Account not yet verified");
    // }
    const foundUserEstate = await UserEstate.findOne({
      status: 1,
      estateId,
      ownerId: userId,
    });
    if (!isValidMongoObject(foundUserEstate)) {
      this.res.statusCode = 409;
      return this.res.json({
        success: false,
        message: "user does not belong to the selected estate",
      });
    }
    if (
      !stringIsEqual(foundUserEstate.estateId, estateId) &&
      !stringIsEqual(admin.isTopmost, 1)
    ) {
      this.res.statusCode = 406;
      return this.res.json({
        success: false,
        message: "User doesn't belong to your estate",
      });
    }

    const foundUserPhonenumber = await this.__findPhonenumber(
      newAdminPhonenumber,
      0,
      "-",
      "-"
    ); 
    if (!isValidMongoObject(foundUserPhonenumber)) {
      return foundUserPhonenumber;
    }
    if (stringIsEqual(foundUserPhonenumber.isAdmin, 1)) {
      this.res.statusCode = 409;
      return this.res.json({
        success: false,
        message: " phonenumber already belong to an admin ",
      });
    }
    if (!isValidMongoObjectId(foundUserEmail.ownerId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid Email owner ",
      });
    }
    if (!stringIsEqual(foundUserEmail.ownerId, foundUserPhonenumber.ownerId)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "email and phone number does not belong to the same user",
      });
    }

    if (!isNaN(newAdminExcoRole) || newAdminExcoRole.length < 3) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Invalid admin role",
      });
    }



    if (guarantorEmail.length > 0 && !isEmail(guarantorEmail)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Please provide a valid admin Guarantors Email",
      });
    }

  if (officeName.length > 0 && officeName.length < 3) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Please provide a valid admin office name",
      });
    }



  if (officeAddress.length > 0 && officeAddress.length < 3) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Please provide a valid admin office address",
      });
    }


  if (officePhoneNumber.length > 0 && !isValidPhonenumber(officePhoneNumber)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Please provide a valid admin office phone number",
      });
    }


  if (officeEmail.length > 0 && !isEmail(officeEmail)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Please provide a valid admin office Email",
      });
    }

  if (guarantorName.length > 0 && guarantorName.length < 3) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Please provide a valid admin Guarantors Name",
      });
    }


  if (guarantorPhoneNumber.length > 0 && !isValidPhonenumber(guarantorPhoneNumber)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Please provide a valid admin Guarantors phonenumber",
      });
    }



    const ownerId = foundUserEmail.ownerId;
    const existingAdmin = await this.__checkExistingAdmin(
      ownerId,
      estateId,
      newAdminExcoRole
    );

    if (isValidMongoObject(existingAdmin)) {
      this.res.statusCode = 409;
      return this.res.json({
        success: false,
        message: "admin already exist under this estate ",
      });
    }
    const existingAdminWithRole = await this.__checkExistingAdminWithRole(
      estateId,
      newAdminExcoRole
    );
    if (isValidMongoObject(existingAdminWithRole)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "admin already with specified role already exist ",
      });
    }

    const newlyCreatedAdminName = await this.__createName(newAdminName, 1, 1);

    if (!isValidMongoObject(newlyCreatedAdminName)) {
      return newlyCreatedAdminName;
    }

    const newlyCreatedAdmin = await super.__createAdmin(
      0,
      estateId,
      ownerId,
      adminId
    );
    if (!isValidMongoObject(newlyCreatedAdmin)) {
      return newlyCreatedAdmin;
    }
    let newlycreatedAdminHouseAddress = ""
    if (address.length < 3) {
      newlycreatedAdminHouseAddress = foundUser.houseAddress[0]?.value
    }
    if (address.length > 3) {
      
      newlycreatedAdminHouseAddress = address
      }
      const newlyCreatedHouseaddress = await new HouseAddressName({
        status: 1,
        value: newlycreatedAdminHouseAddress,
        ownerId: newlyCreatedAdmin._id,
        estateId,
      });
      if (!isValidMongoObject(newlyCreatedHouseaddress)) {
        this.res.statusCode = 500;
        return this.res.json({
          success: false,
          message: "error while creating admin house address",
        });
      }
      newlyCreatedAdmin.address = newlyCreatedHouseaddress;
      await newlyCreatedHouseaddress.save();
  
    if (officeName.length > 3) {
      const newlyCreatedAdminOfficeName = await new AdminOfficeName({
        status: 1,
        value: officeName,
        ownerId: newlyCreatedAdmin._id,
        estateId,
      });
      if (!isValidMongoObject(newlyCreatedAdminOfficeName)) {
        this.res.statusCode = 500;
        return this.res.json({
          success: false,
          message: "error while creating admin office name",
        });
      }
      newlyCreatedAdmin.officeName = newlyCreatedAdminOfficeName;
      await newlyCreatedAdminOfficeName.save();
    } 

    if (officeAddress.length > 3) {
      const newlyCreatedAdminOfficeAddress = await new AdminOfficeAddress({
        status: 1,
        value: officeAddress,
        ownerId: newlyCreatedAdmin._id,
        estateId,
      });
      if (!isValidMongoObject(newlyCreatedAdminOfficeAddress)) {
        this.res.statusCode = 500;
        return this.res.json({
          success: false,
          message: "error while creating admin office address",
        });
      }
      newlyCreatedAdmin.officeAddress = newlyCreatedAdminOfficeAddress;

      await newlyCreatedAdminOfficeAddress.save();
    } 

    if (isValidPhonenumber(officePhoneNumber)) {
      const adminOfficeFormattedPhonenumber =
        formatPhonenumber(officePhoneNumber);
      const newlyCreatedAdminOfficePhoneNumber =
        await new AdminOfficePhoneNumber({
          status: 1,
          countryCode: adminOfficeFormattedPhonenumber[0],
          value: adminOfficeFormattedPhonenumber[1],
          ownerId: newlyCreatedAdmin._id,
          estateId,
        });
      if (!isValidMongoObject(newlyCreatedAdminOfficePhoneNumber)) {
        this.res.statusCode = 500;
        return this.res.json({
          success: false,
          message: "error while creating admin office phonenumber",
        });
      }

      newlyCreatedAdmin.officePhonenumbers = newlyCreatedAdminOfficePhoneNumber;
      await newlyCreatedAdminOfficePhoneNumber.save();
    } 
    if (isEmail(officeEmail)) {
      const newlyCreatedAdminOfficeEmail = await new AdminOfficeEmail({
        status: 1,
        value: officeEmail,
        ownerId: newlyCreatedAdmin._id,
        estateId,
      });
      if (!isValidMongoObject(newlyCreatedAdminOfficeEmail)) {
        this.res.statusCode = 500;
        return this.res.json({
          success: false,
          message: "error while creating admin office Email",
        });
      }

      newlyCreatedAdmin.officeEmails = newlyCreatedAdminOfficeEmail;
      await newlyCreatedAdminOfficeEmail.save();
    } 

    if (isValidFullName(guarantorName)) {
      const newlyCreatedAdminGuarantorsName = await new AdminGuarantorsName({
        status: 1,
        value: guarantorName,
        ownerId: newlyCreatedAdmin._id,
        estateId,
      });
      if (!isValidMongoObject(newlyCreatedAdminGuarantorsName)) {
        this.res.statusCode = 500;
        return this.res.json({
          success: false,
          message: "error while creating admin Admin Guarantors Name",
        });
      }
      newlyCreatedAdmin.guarantorName = newlyCreatedAdminGuarantorsName;
      await newlyCreatedAdminGuarantorsName.save();
    } 
// Email
    if (isEmail(guarantorEmail)) {
      const newlyCreatedAdminGuarantorsEmail = await new AdminGuarantorsEmail({
        status: 1,
        value: guarantorEmail,
        ownerId: newlyCreatedAdmin._id,
        estateId,
      });
      if (!isValidMongoObject(newlyCreatedAdminGuarantorsEmail)) {
        this.res.statusCode = 500;
        return this.res.json({
          success: false,
          message: "error while creating admin Admin Guarantors Email",
        });
      }
      newlyCreatedAdmin.guarantorEmail = newlyCreatedAdminGuarantorsEmail;
      await newlyCreatedAdminGuarantorsEmail.save();
    } 
// Name
    if (isValidPhonenumber(guarantorPhoneNumber)) {
      const adminGuarantorFormattedPhonenumber =
        formatPhonenumber(guarantorPhoneNumber);
      const newlyCreatedAdminGuarantorsPhoneNumber =
        await new AdminGuarantorsPhoneNumber({
          status: 1,
          countryCode: adminGuarantorFormattedPhonenumber[0],
          value: adminGuarantorFormattedPhonenumber[1],
          ownerId: newlyCreatedAdmin._id,
          estateId,
        });
      if (!isValidMongoObject(newlyCreatedAdminGuarantorsPhoneNumber)) {
        this.res.statusCode = 500;
        return this.res.json({
          success: false,
          message: "error while creating admin Admin Guarantors PhoneNumber",
        });
      }
      newlyCreatedAdmin.guarantorPhoneNumber =
        newlyCreatedAdminGuarantorsPhoneNumber;
      await newlyCreatedAdminGuarantorsPhoneNumber.save();
    } 
    const newlyCreateAdminPassword = await this.__createPassword(
      newAdminPasscode,
      1
    );
    if (!isValidMongoObject(newlyCreateAdminPassword)) {
      return newlyCreateAdminPassword;
    }

    const newlyCreatedAdminId = newlyCreatedAdmin._id;

    newlyCreatedAdminName.adminId = newlyCreatedAdminId;
    newlyCreatedAdminName.ownerId = userId;

    await newlyCreatedAdminName.save();
    newlyCreateAdminPassword.ownerId = newlyCreatedAdminId;

    await newlyCreateAdminPassword.save();

    try {
      const updateEmail = await Email.updateOne(
        {
          status: 1,
          value: newAdminEmail,
          isAdmin: 0,
          ownerType: 0,
          ownerId: userId,
        },
        {
          $set: { isAdmin: "1", adminId: newlyCreatedAdmin._id },
        }
      );
    } catch (err) {
      console.log(err);
    }

    try {
      const updatePhoneNumber = await PhoneNumber.updateOne(
        {
          status: 1,
          value: formattedPhonenumber[1],
          countryCode: formattedPhonenumber[0],
          isAdmin: 0,
          ownerType: 0,
          ownerId: userId,
        },
        {
          $set: { isAdmin: "1", adminId: newlyCreatedAdmin._id },
        }
      );
    } catch (err) {
      console.log(err);
    }

    const userEstate = await this.__createUserEstate(
      newlyCreatedAdmin._id,
      estateId,
      1,
      adminId
    );

    if (!isValidMongoObject(userEstate)) {
      return userEstate;
    }

    const userMode = await this.__createUserMode(
      newlyCreatedAdmin._id,
      estateId,
      1
    );

    if (!isValidMongoObject(userMode)) {
      return userMode;
    }

    newlyCreatedAdmin.name = newlyCreatedAdminName;
    newlyCreatedAdmin.role = newAdminExcoRole;

    try {
      const allUserEmail = await Email.find({
        status: 1,
        isAdmin: 1,
        ownerId: userId,
      });
      if (isValidArrayOfMongoObject(allUserEmail) && allUserEmail.length > 0) {
        newlyCreatedAdmin.emails = allUserEmail;
      }
      const allUserPhone = await PhoneNumber.find({
        status: 1,
        isAdmin: 1,
        ownerId: userId,
      });
      if (isValidArrayOfMongoObject(allUserPhone) && allUserPhone.length > 0) {
        newlyCreatedAdmin.phoneNumbers = allUserPhone;
      }
    } catch (error) {
      console.log(error);
    }

    await userMode.save();
    await userEstate.save();
    await newlyCreatedAdmin.save();

    try {
      const updatePhoneNumber = await User.updateOne(
        {
          status: 1,
          _id: userId,
        },
        {
          $set: { isAdmin: "1" },
          $push: { admin: newlyCreatedAdmin },
        }
      );
    } catch (err) {
      console.log(err);
    }
    return this.res.json({
      success: true,
      message: "Admin Created Successfully",
    });
  }
  async __editAdmin() {
    const createdOn = new Date();
    const adminId = (this.res.admin && this.res.admin._id) || "";
    const admin = this.res.admin || "";
    const { adminId: selectedAdminId } =
      (this.req.params && this.req.params) || "";
    if (!isValidMongoObjectId(selectedAdminId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid selected admin id",
      });
    }
    if (
      !stringIsEqual(selectedAdminId, adminId) &&
      Number(admin.role) > 2 &&
      !stringIsEqual(admin.isTopmost, 1)
    ) {
      this.res.statusCode = 406;
      return this.res.json({
        success: false,
        message: "you are not permitted to make this request",
      });
    }
    if (!isValidMongoObject(admin) || !isValidMongoObjectId(adminId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid admin",
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
    const foundSelectedAdmin = await AdminScheama.findOne(
      {
        status: 1,
        _id: selectedAdminId,
        estateId,
      },
      adminScheama
    );
    if (!isValidMongoObject(foundSelectedAdmin)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Admin not found!!!",
      });
    }
    // check if the selected admin belongs to the estate
    const foundSelectedAdminEstate = await UserEstate.findOne({
      status: 1,
      ownerType: 1,
      ownerId: selectedAdminId,
      estateId,
    });
    if (!isValidMongoObject(foundSelectedAdminEstate)) {
      this.res.statusCode = 409;
      return this.res.json({
        success: false,
        message: "Selected Admin not found under this estate",
      });
    }
    // if (!stringIsEqual(foundSelectedAdmin.estateId, estateId)) {
    //   return this.res.json({
    //     success: false,
    //     message: "you are not permitted to make this request",
    //   });
    // }
    const foundSelectedAdminUserId = foundSelectedAdmin.userId || "";

    if (!isValidMongoObjectId(foundSelectedAdminUserId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid admin user id",
      });
    }

    const newAdminName = this.req.body.name || "";
    const newAdminPhonenumber = this.req.body.phone || "";
    const newAdminEmail = this.req.body.email || "";
    const newAdminExcoRole = this.req.body.excoRole || "";
    const newAdminPasscode = this.req.body.password || "";

    const {
      officeAddress = "",
      officeName = "",
      address = "",
      officePhoneNumber = "",
      officeEmail = "",
      guarantorName = "",
      guarantorEmail = "",
      guarantorPhoneNumber = "",
    } = this.req.body || {};

    // if (!isEmail(newAdminEmail)) {
    //   this.res.statusCode = 400;
    //   return this.res.json({
    //     success: false,
    //     message: "invalid email",
    //   });
    // }
    if (!isValidFullName(newAdminName)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "You didn't provide a valid name",
      });
    }
     
    // if (!isValidPhonenumber(newAdminPhonenumber)) {
    //   this.res.statusCode = 400;
    //   return this.res.json({
    //     success: false,
    //     message: " provide a valid phonenumber",
    //   });
    // }
    if (!isValidPassword(newAdminPasscode) && newAdminPasscode.length >4) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: " provide a valid password",
      });
    }
    if (officeAddress > 1 && officeAddress < 3) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Provide a valid office address",
      });
    }

    if (address > 1 && address < 3) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Provide a valid admin address",
      });
    }
    if (officeName > 1 && officeName < 3) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Provide a valid office name",
      });
    }

    if (officePhoneNumber > 1 && !isValidPhonenumber(officePhoneNumber)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Provide a valid office phone number",
      });
    }

    if (officeEmail > 1 && !isEmail(officeEmail)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Provide a valid office Email",
      });
    }
    if (guarantorEmail > 1 && !isEmail(guarantorEmail)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Provide a valid guarantor Email",
      });
    }
    
    if (guarantorName > 1 && !isValidFullName(guarantorName)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Provide a valid guarantor name",
      });
    }

    if (guarantorPhoneNumber > 1 && !isValidPhonenumber(guarantorPhoneNumber)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Provide a valid guarantor PhoneNumber",
      });
    }
    const formattedPhonenumber = formatPhonenumber(newAdminPhonenumber);
    const foundEmail = await Email.findOne({
      value: newAdminEmail,
      status: 1,
      ownerType: { $lte: 1 },
    });

    // if (isValidMongoObject(foundEmail)) {
    //   const foundEmailOwnerId = foundEmail.ownerId || "";

    //   if (!stringIsEqual(foundEmailOwnerId, foundSelectedAdminUserId)) {
    //     this.res.statusCode = 409;
    //     return this.res.json({
    //       success: false,
    //       message: "email already belongs to another user",
    //     });
    //   }

    //   if (!stringIsEqual(foundEmail.isAdmin, 1)) {
    //     try {
    //       const updateEmail = await Email.updateOne(
    //         {
    //           status: 1,
    //           isAdmin: 0,
    //           ownerType: 0,
    //           ownerId: foundEmailOwnerId,
    //           value: foundEmail.value,
    //         },
    //         {
    //           $set: { isAdmin: "1", adminId: adminId, estateId: estateId },
    //         }
    //       );
    //     } catch (err) {
    //       console.log(err);
    //     }
    //     try {
    //       const updateExistingAdminEmail = await Email.updateMany(
    //         {
    //           status: 1,
    //           isAdmin: 1,
    //           ownerType: 0,
    //           ownerId: foundEmailOwnerId,
    //           estateId,
    //           value: { $ne: foundEmail.value },
    //         },
    //         {
    //           $set: { isAdmin: 0 },
    //         }
    //       );
    //     } catch (err) {
    //       console.log(err);
    //     }
    //     const allAdminEmails = await Email.find({
    //       status: 1,
    //       ownerType: 0,
    //       estateId,
    //       ownerId: foundSelectedAdminUserId,
    //       adminId: selectedAdminId,
    //     });

    //     if (!isValidArrayOfMongoObject(allAdminEmails)) {
    //       this.res.statusCode = 404;
    //       return this.res.json({
    //         success: true,
    //         message: "Admin Emails not found",
    //       });
    //     }

    //     try {
    //       const updateExistingAdmin = await AdminScheama.updateOne(
    //         {
    //           status: 1,
    //           userId: foundSelectedAdminUserId,
    //           estateId,
    //           _id: selectedAdminId,
    //         },
    //         {
    //           $set: { emails: allAdminEmails },
    //         }
    //       );
    //     } catch (err) {
    //       console.log(err);
    //     }
    //   }
    // } else {
    //   const newlyCreatedAdminEmail = await new Email({
    //     status: 1,
    //     value: newAdminEmail,
    //     isPrimary: 0,
    //     isAdmin: 1,
    //     isVerified: false,
    //     estateId,
    //     ownerId: foundSelectedAdminUserId,
    //     adminId: selectedAdminId,
    //     ownerType: 0,
    //     createdBy: adminId,
    //     createdOn,
    //   });
    //   try {
    //     const updateExistingAdminEmail = await Email.updateMany(
    //       {
    //         status: 1,
    //         isAdmin: 1,
    //         ownerType: 0,
    //         ownerId: foundSelectedAdminUserId,
    //         estateId,
    //         value: { $ne: newAdminEmail },
    //       },
    //       {
    //         $set: { isAdmin: 0 },
    //       }
    //     );
    //   } catch (err) {
    //     console.log(err);
    //   }
    //   await newlyCreatedAdminEmail.save();
    //   const allAdminEmails = await Email.find({
    //     status: 1,
    //     ownerType: 0,
    //     estateId,
    //     ownerId: foundSelectedAdminUserId,
    //     adminId: selectedAdminId,
    //   });

    //   if (!isValidArrayOfMongoObject(allAdminEmails)) {
    //     this.res.statusCode = 404;
    //     return this.res.json({
    //       success: true,
    //       message: "Admin Emails not found",
    //     });
    //   }

    //   try {
    //     const updateExistingAdmin = await AdminScheama.updateOne(
    //       {
    //         status: 1,
    //         userId: foundSelectedAdminUserId,
    //         estateId,
    //         _id: selectedAdminId,
    //       },
    //       {
    //         $set: { emails: allAdminEmails },
    //       }
    //     );
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }

    const foundPhonenumber = await PhoneNumber.findOne({
      status: 1,
      countryCode: formattedPhonenumber[0],
      value: formattedPhonenumber[1],
      ownerType: { $lte: 1 },
    });

    // if (isValidMongoObject(foundPhonenumber)) {
    //   const foundPhonenumberOwnerId = foundPhonenumber.ownerId || "";

    //   if (!stringIsEqual(foundPhonenumberOwnerId, foundSelectedAdminUserId)) {
    //     this.res.statusCode = 409;
    //     return this.res.json({
    //       success: false,
    //       message: "email already belongs to another user",
    //     });
    //   }

    //   if (!stringIsEqual(foundPhonenumber.isAdmin, 1)) {
    //     try {
    //       const updatePhoneNumber = await PhoneNumber.updateOne(
    //         {
    //           status: 1,
    //           isAdmin: 0,
    //           ownerType: 0,
    //           ownerId: foundPhonenumberOwnerId,
    //           value: foundPhonenumber.value,
    //           countryCode: foundPhonenumber.countryCode,
    //         },
    //         {
    //           $set: { isAdmin: "1", adminId: adminId, estateId: estateId },
    //         }
    //       );
    //     } catch (err) {
    //       console.log(err);
    //     }
    //     try {
    //       const updateExistingAdminPhonenumber = await PhoneNumber.updateMany(
    //         {
    //           status: 1,
    //           isAdmin: 1,
    //           ownerType: 0,
    //           ownerId: foundPhonenumberOwnerId,
    //           estateId,
    //           value: { $ne: foundPhonenumber.value },
    //           countryCode: foundPhonenumber.countryCode,
    //         },
    //         {
    //           $set: { isAdmin: 0 },
    //         }
    //       );
    //     } catch (err) {
    //       console.log(err);
    //     }
    //     const allAdminPhonenumbers = await PhoneNumber.find({
    //       status: 1,
    //       ownerType: 0,
    //       estateId,
    //       ownerId: foundSelectedAdminUserId,
    //       adminId: selectedAdminId,
    //     });

    //     if (!isValidArrayOfMongoObject(allAdminPhonenumbers)) {
    //       this.res.statusCode = 404;
    //       return this.res.json({
    //         success: false,
    //         message: "Admin Phonenumbers not found",
    //       });
    //     }

    //     try {
    //       const updateExistingAdmin = await AdminScheama.updateOne(
    //         {
    //           status: 1,
    //           userId: foundSelectedAdminUserId,
    //           estateId,
    //           _id: selectedAdminId,
    //         },
    //         {
    //           $set: { phoneNumbers: allAdminPhonenumbers },
    //         }
    //       );
    //     } catch (err) {
    //       console.log(err);
    //     }
    //   }
    // } else {
    //   const newlyCreatedAdminPhonenumber = await new PhoneNumber({
    //     status: 1,
    //     value: formattedPhonenumber[1],
    //     countryCode: formattedPhonenumber[0],
    //     isPrimary: 0,
    //     isAdmin: 1,
    //     estateId,
    //     isVerified: false,
    //     ownerId: foundSelectedAdminUserId,
    //     adminId: selectedAdminId,
    //     ownerType: 0,
    //     createdBy: adminId,
    //     createdOn,
    //   });
    //   try {
    //     const updateExistingAdminPhonenumber = await PhoneNumber.updateMany(
    //       {
    //         status: 1,
    //         isAdmin: 1,
    //         ownerType: 0,
    //         ownerId: foundSelectedAdminUserId,
    //         estateId,
    //         value: { $ne: formattedPhonenumber[1] },
    //         countryCode: formattedPhonenumber[0],
    //       },
    //       {
    //         $set: { isAdmin: 0 },
    //       }
    //     );
    //   } catch (err) {
    //     console.log(err);
    //   }
    //   await newlyCreatedAdminPhonenumber.save();
    //   const allAdminPhonenumber = await PhoneNumber.find({
    //     status: 1,
    //     ownerType: 0,
    //     estateId,
    //     ownerId: foundSelectedAdminUserId,
    //     adminId: selectedAdminId,
    //   });

    //   if (!isValidArrayOfMongoObject(allAdminPhonenumber)) {
    //     this.res.statusCode = 404;
    //     return this.res.json({
    //       success: false,
    //       message: "Admin Phonenumbers not found",
    //     });
    //   }

    //   try {
    //     const updateExistingAdmin = await AdminScheama.updateOne(
    //       {
    //         status: 1,
    //         userId: foundSelectedAdminUserId,
    //         estateId,
    //         _id: selectedAdminId,
    //       },
    //       {
    //         $set: { phoneNumbers: allAdminPhonenumber },
    //       }
    //     );
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }

    if (
      !stringIsEqual(
        newAdminName.trim(),
        (foundSelectedAdmin.name.value || "").trim()
      )
    ) {
      const foundName = await Name.findOne({
        value: newAdminName,
        status: 1,
      });

      if (isValidMongoObject(newAdminName)) {
        const foundNameOwnerId = foundName.ownerId || "";

        if (!stringIsEqual(foundName.isAdmin, 1)) {
          try {
            const updateName = await Name.updateOne(
              {
                status: 1,
                isAdmin: 0,
                ownerType: 0,
                ownerId: foundNameOwnerId,
                value: foundName.value,
              },
              {
                $set: { isAdmin: "1", adminId: adminId, estateId: estateId },
              }
            );
          } catch (err) {
            console.log(err);
          }
          try {
            const updateExistingAdminName = await Name.updateMany(
              {
                status: 1,
                isAdmin: 1,
                ownerType: 0,
                ownerId: foundNameOwnerId,
                estateId,
                value: { $ne: foundName.value },
              },
              {
                $set: { isAdmin: 0 },
              }
            );
          } catch (err) {
            console.log(err);
          }
          const foundAdminName = await Name.findOne({
            status: 1,
            ownerType: 0,
            estateId,
            isAdmin: 1,
            ownerId: foundSelectedAdminUserId,
            adminId: selectedAdminId,
          });

          if (!isValidArrayOfMongoObject(foundAdminName)) {
            this.res.statusCode = 404;
            return this.res.json({
              success: false,
              message: "Admin Name not found",
            });
          }

          try {
            const updateExistingAdmin = await AdminScheama.updateOne(
              {
                status: 1,
                userId: foundSelectedAdminUserId,
                estateId,
                _id: selectedAdminId,
              },
              {
                $set: { name: foundAdminName },
              }
            );
          } catch (err) {
            console.log(err);
          }
        }
      } else {
        const newlyCreatedAdminName = await new Name({
          status: 1,
          value: newAdminName,
          isAdmin: 1,
          estateId,
          ownerId: foundSelectedAdminUserId,
          adminId: selectedAdminId,
          ownerType: 0,
          createdBy: adminId,
          createdOn,
        });
        try {
          const updateExistingAdminName = await Name.updateMany(
            {
              status: 1,
              isAdmin: 1,
              ownerType: 0,
              ownerId: foundSelectedAdminUserId,
              estateId,
              value: { $ne: newAdminName },
            },
            {
              $set: { isAdmin: 0 },
            }
          );
        } catch (err) {
          console.log(err);
        }
        await newlyCreatedAdminName.save();
        const foundAdminName = await Name.findOne({
          status: 1,
          ownerType: 0,
          estateId,
          isAdmin: 1,
          ownerId: foundSelectedAdminUserId,
          adminId: selectedAdminId,
        });

        if (!isValidMongoObject(foundAdminName)) {
          this.res.statusCode = 404;
          return this.res.json({
            success: true,
            message: "Admin name not found",
          });
        }

        try {
          const updateExistingAdmin = await AdminScheama.updateOne(
            {
              status: 1,
              userId: foundSelectedAdminUserId,
              estateId,
              _id: selectedAdminId,
            },
            {
              $set: { name: foundAdminName },
            }
          );
        } catch (err) {
          console.log(err);
        }
      }
    }

    if (
      newAdminExcoRole.length > 1 &&
      !stringIsEqual(foundSelectedAdmin.role, newAdminExcoRole)
    ) {
      // if (Number(admin.role) > 2) {
      //   this.res.statusCode = 409;
      //   return this.res.json({
      //     success: false,
      //     message: "you are not permitted to make this request",
      //   });
      // }
      const foundAdminWithExcoRole = await AdminScheama.findOne(
        {
          status: 1,
          estateId,
          role: newAdminExcoRole,
        },
        adminScheama
      );

      if (isValidMongoObject(foundAdminWithExcoRole)) {
        this.res.statusCode = 406;
        return this.res.json({
          success: false,
          message: "Admin with specified role already exist",
        });
      }

      try {
        const updateExistingAdminExcoRole = await AdminScheama.updateOne(
          {
            status: 1,
            userId: foundSelectedAdminUserId,
            estateId,
            _id: selectedAdminId,
          },
          {
            $set: { role: newAdminExcoRole },
          }
        );
      } catch (err) {
        console.log(err);
      }
    }

    if (!isNaN(newAdminPasscode) && newAdminPasscode.length === 4) {
      const foundPassword = await Password.findOne({
        status: 1,
        ownerId: selectedAdminId,
        ownerType: 1,
      });
      if (isValidMongoObject(foundPassword)) {
        if (!isHashedString(newAdminPasscode, foundPassword.hashedForm)) {
          const newPassword = await this.__createPassword(newAdminPasscode, 1);

          newPassword.ownerId = selectedAdminId;

          newPassword.save();

          try {
            const updateExistingAdminExcoRole = await Password.updateMany(
              {
                status: 1,
                ownerId: selectedAdminId,
                _id: { $ne: newPassword._id },
              },
              {
                $set: { status: 0 },
              }
            );
          } catch (err) {
            console.log(err);
          }
        }
      } else {
        const newPassword = await this.__createPassword(newAdminPasscode, 1);

        newPassword.ownerId = selectedAdminId;

        newPassword.save();

        try {
          const updateExistingAdminExcoRole = await Password.updateMany(
            {
              status: 1,
              ownerId: selectedAdminId,
              _id: { $ne: newPassword._id },
            },
            {
              $set: { status: 0 },
            }
          );
        } catch (err) {
          console.log(err);
        }
      }
    }

    if (
      officeAddress.length >= 3 &&
      !stringIsEqual(foundSelectedAdmin?.officeAddress?.value, officeAddress)
    ) {
      const newlyCreatedAdminOfficeAddress = await new AdminOfficeAddress({
        status: 1,
        value: officeAddress,
        ownerId: selectedAdminId,
        estateId,
      });
      if (!isValidMongoObject(newlyCreatedAdminOfficeAddress)) {
        this.res.statusCode = 500;
        return this.res.json({
          success: false,
          message: "error while creating admin office address",
        });
      }
      try {
        const updateExistingAdminAdminOfficeAddress =
          await AdminOfficeAddress.updateOne(
            {
              status: 1,
              ownerId: selectedAdminId,
              _id: { $ne: newlyCreatedAdminOfficeAddress._id },
            },
            {
              $set: { status: 0 },
            }
          );
      } catch (err) {
        console.log(err);
      }

      await newlyCreatedAdminOfficeAddress.save();

      try {
        const updateExistingAdmin = await AdminScheama.updateOne(
          {
            status: 1,
            userId: foundSelectedAdminUserId,
            estateId,
            _id: selectedAdminId,
          },
          {
            $set: { officeAddress: newlyCreatedAdminOfficeAddress },
          }
        );
      } catch (err) {
        console.log(err);
      }
    }

    if (
      officeName.length >= 3 &&
      !stringIsEqual(foundSelectedAdmin?.officeName?.value, officeName)
    ) {
      const newlyCreatedAdminOfficeName = await new AdminOfficeName({
        status: 1,
        value: officeName,
        ownerId: selectedAdminId,
        estateId,
      });
      if (!isValidMongoObject(newlyCreatedAdminOfficeName)) {
        this.res.statusCode = 500;
        return this.res.json({
          success: false,
          message: "error while creating admin office name",
        });
      }
      try {
        const updateExistingAdminAdminOfficeNames =
          await AdminOfficeName.updateOne(
            {
              status: 1,
              ownerId: selectedAdminId,
              _id: { $ne: newlyCreatedAdminOfficeName._id },
            },
            {
              $set: { status: 0 },
            }
          );
      } catch (err) {
        console.log(err);
      }

      await newlyCreatedAdminOfficeName.save();

      try {
        const updateExistingAdmin = await AdminScheama.updateOne(
          {
            status: 1,
            userId: foundSelectedAdminUserId,
            estateId,
            _id: selectedAdminId,
          },
          {
            $set: { officeName: newlyCreatedAdminOfficeName },
          }
        );
      } catch (err) {
        console.log(err);
      }
    }

    if (
      address.length >= 3 &&
      !stringIsEqual(foundSelectedAdmin?.address?.value, address)
    ) {
      const newlyCreatedAdminAddress = await new HouseAddressName({
        status: 1,
        value: address,
        ownerId: selectedAdminId,
        estateId,
      });
      if (!isValidMongoObject(newlyCreatedAdminAddress)) {
        this.res.statusCode = 500;
        return this.res.json({
          success: false,
          message: "error while creating admin house",
        });
      }
      try {
        const updateExistingAdminAdminHouseAddress =
          await HouseAddressName.updateOne(
            {
              status: 1,
              ownerId: selectedAdminId,
              _id: { $ne: newlyCreatedAdminAddress._id },
            },
            {
              $set: { status: 0 },
            }
          );
      } catch (err) {
        console.log(err);
      }

      await newlyCreatedAdminAddress.save();

      try {
        const updateExistingAdmin = await AdminScheama.updateOne(
          {
            status: 1,
            userId: foundSelectedAdminUserId,
            estateId,
            _id: selectedAdminId,
          },
          {
            $set: { address: newlyCreatedAdminAddress },
          }
        );
      } catch (err) {
        console.log(err);
      }
    }

    if (isValidPhonenumber(officePhoneNumber)) {
      const formattedofficePhoneNumber = formatPhonenumber(officePhoneNumber);
      if (
        !stringIsEqual(
          foundSelectedAdmin?.officePhonenumbers?.value,
          formattedofficePhoneNumber[1]
        ) ||
        !stringIsEqual(
          foundSelectedAdmin?.officePhonenumbers?.countryCode,
          formattedofficePhoneNumber[0]
        )
      ) {
        const newlyCreatedAdminOfficePhoneNumber =
          await new AdminOfficePhoneNumber({
            status: 1,
            countryCode: formattedofficePhoneNumber[0],
            value: formattedofficePhoneNumber[1],
            ownerId: selectedAdminId,
            estateId,
          });
        if (!isValidMongoObject(newlyCreatedAdminOfficePhoneNumber)) {
          this.res.statusCode = 500;
          return this.res.json({
            success: false,
            message: "error while creating admin office phonenumber",
          });
        }
        try {
          const updateExistingAdminOfficePhoneNumber =
            await AdminOfficePhoneNumber.updateOne(
              {
                status: 1,
                ownerId: selectedAdminId,
                _id: { $ne: newlyCreatedAdminOfficePhoneNumber._id },
              },
              {
                $set: { status: 0 },
              }
            );
        } catch (err) {
          console.log(err);
        }

        await newlyCreatedAdminOfficePhoneNumber.save();

        try {
          const updateExistingAdmin = await AdminScheama.updateOne(
            {
              status: 1,
              userId: foundSelectedAdminUserId,
              estateId,
              _id: selectedAdminId,
            },
            {
              $set: { officePhonenumbers: newlyCreatedAdminOfficePhoneNumber },
            }
          );
        } catch (err) {
          console.log(err);
        }
      }
    }

    if (
      isEmail(officeEmail) &&
      !stringIsEqual(foundSelectedAdmin?.officeEmails?.value, officeEmail)
    ) {
      const newlyCreatedAdminOfficeEmail = await new AdminOfficeEmail({
        status: 1,
        value: officeEmail,
        ownerId: selectedAdminId,
        estateId,
      });
      if (!isValidMongoObject(newlyCreatedAdminOfficeEmail)) {
        this.res.statusCode = 500;
        return this.res.json({
          success: false,
          message: "error while creating admin office Email",
        });
      }
      try {
        const updateExistingCreatedAdminOfficeEmail =
          await AdminOfficeEmail.updateOne(
            {
              status: 1,
              ownerId: selectedAdminId,
              _id: { $ne: newlyCreatedAdminOfficeEmail._id },
            },
            {
              $set: { status: 0 },
            }
          );
      } catch (err) {
        console.log(err);
      }

      await newlyCreatedAdminOfficeEmail.save();

      try {
        const updateExistingAdmin = await AdminScheama.updateOne(
          {
            status: 1,
            userId: foundSelectedAdminUserId,
            estateId,
            _id: selectedAdminId,
          },
          {
            $set: { officeEmails: newlyCreatedAdminOfficeEmail },
          }
        );
      } catch (err) {
        console.log(err);
      }
    }

    if (
      isValidFullName(guarantorName) &&
      !stringIsEqual(foundSelectedAdmin?.guarantorName?.value, guarantorName)
    ) {
      const newlyCreatedAdminGuarantorsName = await new AdminGuarantorsName({
        status: 1,
        value: guarantorName,
        ownerId: selectedAdminId,
        estateId,
      });
      if (!isValidMongoObject(newlyCreatedAdminGuarantorsName)) {
        this.res.statusCode = 500;
        return this.res.json({
          success: false,
          message: "error while creating admin guarantor name",
        });
      }
      try {
        const updateExistingAdminAdminOfficeNames =
          await AdminGuarantorsName.updateOne(
            {
              status: 1,
              ownerId: selectedAdminId,
              _id: { $ne: newlyCreatedAdminGuarantorsName._id },
            },
            {
              $set: { status: 0 },
            }
          );
      } catch (err) {
        console.log(err);
      }

      await newlyCreatedAdminGuarantorsName.save();

      try {
        const updateExistingAdmin = await AdminScheama.updateOne(
          {
            status: 1,
            userId: foundSelectedAdminUserId,
            estateId,
            _id: selectedAdminId,
          },
          {
            $set: { guarantorName: newlyCreatedAdminGuarantorsName },
          }
        );
      } catch (err) {
        console.log(err);
      }
    }



// Name

    if (
      isEmail(guarantorEmail) &&
      !stringIsEqual(foundSelectedAdmin?.guarantorEmail?.value, guarantorEmail)
    ) {
      const newlyCreatedAdminGuarantorsEmail = await new AdminGuarantorsEmail({
        status: 1,
        value: guarantorEmail,
        ownerId: selectedAdminId,
        estateId,
      });
      if (!isValidMongoObject(newlyCreatedAdminGuarantorsEmail)) {
        this.res.statusCode = 500;
        return this.res.json({
          success: false,
          message: "error while creating admin guarantor name",
        });
      }
      try {
        const updateExistingAdminAdminOfficeEmails =
          await AdminGuarantorsEmail.updateOne(
            {
              status: 1,
              ownerId: selectedAdminId,
              _id: { $ne: newlyCreatedAdminGuarantorsEmail._id },
            },
            {
              $set: { status: 0 },
            }
          );
      } catch (err) {
        console.log(err);
      }

      await newlyCreatedAdminGuarantorsEmail.save();

      try {
        const updateExistingAdmin = await AdminScheama.updateOne(
          {
            status: 1,
            userId: foundSelectedAdminUserId,
            estateId,
            _id: selectedAdminId,
          },
          {
            $set: { guarantorEmail: newlyCreatedAdminGuarantorsEmail },
          }
        );
      } catch (err) {
        console.log(err);
      }
    }




// Name







    if (isValidPhonenumber(guarantorPhoneNumber)) {
      const formattedguarantorPhoneNumber =
        formatPhonenumber(guarantorPhoneNumber);
      if (
        !stringIsEqual(
          foundSelectedAdmin?.guarantorPhoneNumber?.value,
          formattedguarantorPhoneNumber[1]
        ) ||
        !stringIsEqual(
          foundSelectedAdmin?.guarantorPhoneNumber?.countryCode,
          formattedguarantorPhoneNumber[0]
        )
      ) {
        const newlyCreatedAdminGuarantorPhoneNumber =
          await new AdminOfficePhoneNumber({
            status: 1,
            countryCode: formattedguarantorPhoneNumber[0],
            value: formattedguarantorPhoneNumber[1],
            ownerId: selectedAdminId,
            estateId,
          });
        if (!isValidMongoObject(newlyCreatedAdminGuarantorPhoneNumber)) {
          this.res.statusCode = 500;
          return this.res.json({
            success: false,
            message: "error while creating admin guarantor phonenumber",
          });
        }
        try {
          const updateExistingAdminOfficePhoneNumber =
            await AdminGuarantorsPhoneNumber.updateOne(
              {
                status: 1,
                ownerId: selectedAdminId,
                _id: { $ne: newlyCreatedAdminGuarantorPhoneNumber._id },
              },
              {
                $set: { status: 0 },
              }
            );
        } catch (err) {
          console.log(err);
        }

        await newlyCreatedAdminGuarantorPhoneNumber.save();

        try {
          const updateExistingAdmin = await AdminScheama.updateOne(
            {
              status: 1,
              userId: foundSelectedAdminUserId,
              estateId,
              _id: selectedAdminId,
            },
            {
              $set: {
                guarantorPhoneNumber: newlyCreatedAdminGuarantorPhoneNumber,
              },
            }
          );
        } catch (err) {
          console.log(err);
        }
      }
    }

    let newlyUpdatedAdmin = await AdminScheama.findOne(
      {
        status: 1,
        _id: selectedAdminId,
      },
      adminScheama
    );

    if (!isValidMongoObject(newlyUpdatedAdmin)) {
      newlyUpdatedAdmin = {};
    }



    try {
      const updateExistingUser = await User.updateOne(
        {
          status: 1,
          _id: foundSelectedAdminUserId, 
          adminId: selectedAdminId,
        },
        {
          $set: { admin: newlyUpdatedAdmin },
        }
      );
    } catch (err) {
      console.log(err);
    }
  
    return this.res.json({
      success: true,
      message: "Admin updated Successfully",
      admin: newlyUpdatedAdmin,
    });
  }

  async __getActiveElections() {
    const createdOn = new Date();
    const adminId = (this.res.admin && this.res.admin._id) || "";
    const admin = this.res.admin || "";

    if (!isValidMongoObject(admin) || !isValidMongoObjectId(adminId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid admin",
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

    const existingElections = await Poll.find({
      status: 1,
      estateId,
    });
    if (!isValidArrayOfMongoObject(existingElections)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "error finding existing Elections",
      });
    }

    return this.res.json({
      success: true,
      message: "Existing Elections Successfully",
      existingElections,
    });
  }
  async __createElection() {
    const createdOn = new Date();
    const adminId = (this.res.admin && this.res.admin._id) || "";
    const admin = this.res.admin || "";

    // if (Number(admin.role) > 2 && !stringIsEqual(admin.isTopmost, 1)) {
    //   this.res.statusCode = 400;
    //   return this.res.json({
    //     success: false,
    //     message: "you are not permitted to make this request",
    //   });
    // }

    if (!isValidMongoObject(admin) || !isValidMongoObjectId(adminId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid admin",
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

    // const electionName = this.req.body.name || "";
    let electionRole = this.req.body.role || "";
    // const electionType = this.req.body.type || "";
    // if (electionName.length < 3) {
    //   this.res.statusCode = 400;
    //   return this.res.json({
    //     success: false,
    //     message: "You didn't provide a valid election name  ",
    //   });
    // }

    if (!electionRole || electionRole.length < 3) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid  election Role",
      });
    }
    // if (isNaN(electionType)) {
    //   this.res.statusCode = 400;
    //   return this.res.json({
    //     success: false,
    //     message: "invalid  election type",
    //   });
    // }
    electionRole = electionRole.toLowerCase().trim();
    // electionRole = electionRole.split(" ").join("_");

    const existingPoll = await Poll.findOne({
      status: 1,
      estateId,
      role: electionRole,
      // type: electionType,
    });

    if (isValidMongoObject(existingPoll)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Specified  election Role and type still active",
      });
    }

    const newlyCreatedElectionPoll = await new Poll({
      status: 1, //0:deleted,1:active
      // value: electionName,
      estateId,
      // type: electionType, //0:exco, 1:others
      role: electionRole,
      createdOn,
      createdBy: adminId,
    });

    if (!isValidMongoObject(newlyCreatedElectionPoll)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "error while creating election",
      });
    }
    await newlyCreatedElectionPoll.save();
    return this.res.json({
      success: true,
      message: "Election Created Successfully",
      role:newlyCreatedElectionPoll
    });
  }

  async __createElectionCandidate() {
    const createdOn = new Date();
    const adminId = (this.res.admin && this.res.admin._id) || "";
    const admin = this.res.admin || "";

    // if (Number(admin.role) > 2 && !stringIsEqual(admin.isTopmost, 1)) {
    //   this.res.statusCode = 400;
    //   return this.res.json({
    //     success: false,
    //     message: "you are not permitted to make this request",
    //   });
    // }

    if (!isValidMongoObject(admin) || !isValidMongoObjectId(adminId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid admin",
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

    const electionId = this.req.params["electionId"] || "";
    if (!isValidMongoObjectId(electionId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid election Id",
      });
    }
    const candidateName = this.req.body.name || "";

    if (!isValidFullName(candidateName)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "You didn't provide a valid name",
      });
    }

    const existingElection = await Poll.findOne({
      status: 1,
      estateId,
      _id: electionId,
    });

    if (!isValidMongoObject(existingElection)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "specified role not found",
      });
    }

    const newlyCreatedCandidate = await new Candidate({
      status: 1,
      name: candidateName,
      estateId,
      // type: existingElection.type,
      role: existingElection.role,
      electionId: existingElection._id,
      createdOn,
      createdBy: adminId,
    });

    if (!isValidMongoObject(newlyCreatedCandidate)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "failed to create candidate",
      });
    }

    await newlyCreatedCandidate.save();

    return this.res.json({
      success: true,
      message: "Candidate created Successfully",
    });
  }

  async __getActiveCandidates() {
    const createdOn = new Date();
    const adminId = (this.res.admin && this.res.admin._id) || "";
    const admin = this.res.admin || "";

    if (!isValidMongoObject(admin) || !isValidMongoObjectId(adminId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid admin",
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

    const existingCandidates = await Candidate.find({
      status: 1,
      estateId,
    });

    if (!isValidArrayOfMongoObject(existingCandidates)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "error finding existing Candidates",
      });
    }

    return this.res.json({
      success: true,
      message: "Existing Candidates gotten Successfully",
      existingCandidates,
    });
  }
  async __getAllCandidates() {
    const createdOn = new Date();
    const adminId = (this.res.admin && this.res.admin._id) || "";
    const admin = this.res.admin || "";

    if (!isValidMongoObject(admin) || !isValidMongoObjectId(adminId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid admin",
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

    const existingCandidates = await Candidate.find({
      estateId,
    });

    if (!isValidArrayOfMongoObject(existingCandidates)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "error finding existing Candidates",
      });
    }

    return this.res.json({
      success: true,
      message: "Existing Candidates gotten Successfully",
      existingCandidates,
    });
  }
  // async __getElectionResult() {
  //   const createdOn = new Date();
  //   const adminId = (this.res.admin && this.res.admin._id) || "";
  //   const admin = this.res.admin || "";

  //   if (!isValidMongoObject(admin) || !isValidMongoObjectId(adminId)) {
  //     return this.res.json({
  //       success: false,
  //       message: "invalid admin",
  //     });
  //   }
  //   const { _id: estateId } = this.res.estate || "";
  //   if (!isValidMongoObjectId(estateId)) {
  //     return this.res.json({
  //       success: false,
  //       message: "invalid estate id",
  //     });
  //   }
  //   const foundEstate = await this.__findEstate(estateId);
  //   if (!isValidMongoObject(foundEstate)) {
  //     return foundEstate;
  //   }

  //   const existingPoll = await Poll.find({
  //     status: 1,
  //     estateId,
  //   });

  //   if (!isValidArrayOfMongoObject(estateId)) {
  //     return this.res.json({
  //       success: false,
  //       message: "election  not found",
  //     });
  //   }

  //   (existingPoll || []).forEach(() => {});

  //   const activeCandidate = await Candidate.find({
  //     status: 1,
  //     estateId,
  //   });

  //   if (!isValidArrayOfMongoObject(existingCandidate)) {
  //     return this.res.json({
  //       success: false,
  //       message: "election  not found",
  //     });
  //   }

  //   (existingCandidate || []).forEach(() => {});

  //   const existingVotes = await Votes.find({
  //     status: 1,
  //     estateId,
  //   });

  //   if (!isValidArrayOfMongoObject(existingVotes)) {
  //     return this.res.json({
  //       success: false,
  //       message: "election not found",
  //     });
  //   }

  //   const eachCandidateVoteMap = {}(existingCandidate || []).forEach(
  //     (candidate) => {
  //       eachCandidateVote[candidate._id] = existingVotes.reduce(
  //         (total, vote) => {
  //           if (stringIsEqual(candidate._id, vote._id)) {
  //             total++;
  //           }
  //         },
  //         0
  //       );
  //     }
  //   );

  //   return this.res.json({
  //     success: true,
  //     message: "Admin updated Successfully",
  //   });
  // }
  async __endElection() {
    const createdOn = new Date();
    const adminId = (this.res.admin && this.res.admin._id) || "";
    const admin = this.res.admin || "";

    if (!isValidMongoObject(admin) || !isValidMongoObjectId(adminId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid admin",
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

    const electionId = this.req.params["electionId"] || "";
    if (!isValidMongoObjectId(electionId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid election id",
      });
    }
    const foundEstate = await this.__findEstate(estateId);
    if (!isValidMongoObject(foundEstate)) {
      return foundEstate;
    }

    const updatableSet = {
      status: 0,
    };
    const updatablePush = {
      updates: {
        by: adminId, // admin ID of the admin who made this update
        action: 0, //0:delete,
        timing: createdOn,
      },
    };
    try {
      const updateExistingPoll = await Poll.updateMany(
        {
          status: 1,
          estateId,
          _id: electionId,
        },
        {
          $set: updatableSet,
          $push: updatablePush,
        }
      );
    } catch (err) {
      console.log(err);
    }
 

    try {
      const updateExistingPoll = await Candidate.updateMany(
        {
          status: 1,
          estateId,
          electionId,
        },
        {
          $set: updatableSet,
          $push: updatablePush,
        }
      );
    } catch (err) {
      console.log(err);
    }
 

    try {
      const updateExistingPoll = await Votes.updateMany(
        {
          status: 1,
          estateId,
          electionId,
        },
        {
          $set: updatableSet,
          $push: updatablePush,
        }
      );
    } catch (err) {
      console.log(err);
    }

    return this.res.json({
      success: true,
      message: "Election Deleted Successfully",
    });
  }

  async __createSecurity() {
    const createdOn = new Date();
    const adminId = (this.res.admin && this.res.admin._id) || "";
    const admin = this.res.admin || "";
    if (!isValidMongoObject(admin) || !isValidMongoObjectId(adminId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid admin",
      });
    }
    if (Number(admin.role) > 2) {
      this.res.statusCode = 406;
      return this.res.json({
        success: false,
        message: "you are not permitted to make this request",
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

    let foundEstate = "";
    if (!stringIsEqual(admin.isTopmost, 1)) {
      foundEstate = await this.__findEstate(estateId);
      if (!isValidMongoObject(foundEstate)) {
        return foundEstate;
      }
    }

    const newlyCreatedSecurity = await super.__createSecurity(
      estateId,
      adminId
    );

    if (!isValidMongoObject(newlyCreatedSecurity)) {
      return newlyCreatedSecurity;
    }
    return this.res.json({
      success: true,
      message: "security Created Successfully",
      security: newlyCreatedSecurity,
    });
  }

  async __updateAllUser() {
    const createdOn = new Date();
    const adminId = (this.res.admin && this.res.admin._id) || "";
    const admin = this.res.admin || "";
    if (!isValidMongoObject(admin) || !isValidMongoObjectId(adminId)) {
      return this.res.json({
        success: false,
        message: "invalid admin",
      });
    }
    
    const allUsers =await scheamaTools.findUsers({status: 1}) 
    
    if (!isValidArrayOfMongoObject(allUsers)) {
      return this.res.json({
        success: false,
        message: " users not found",
      });
    }

    const pushfoundUser = await Promise.all(
      allUsers.map(async (particularUser, index) => {
        const contextId = particularUser._id;
        if (isValidMongoObjectId(contextId)) {
          const updates = {};
          const updatespush = {};

          const userAdmin = await AdminScheama.find(
            {
              status: 1,
              userId: contextId,
            },
            adminScheama
          );
          if (isValidArrayOfMongoObject(userAdmin) && userAdmin.length > 0) {
            updates.isAdmin = 1;
            updates.adminId = userAdmin[0]?.adminId;
            updatespush.admin = userAdmin;
          } else {
            updates.isAdmin = 0;
            updates.adminId = "";
            updatespush.admin = [];
          }

          try {
            const updateUser = await User.updateOne(
              {
                _id: contextId,
              },
              {
                $set: updates,
                $push: updatespush,
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
      message: "User Updated succesfully",
    });
  }
  async __updateAdminUser() {
    const createdOn = new Date();
    const adminId = (this.res.admin && this.res.admin._id) || "";
    const admin = this.res.admin || "";
    if (!isValidMongoObject(admin) || !isValidMongoObjectId(adminId)) {
      return this.res.json({
        success: false,
        message: "invalid admin",
      });
    }

    const allAdmins = await AdminScheama.find(
      {
        status: 1,
      },
      adminScheama
    );
    if (!isValidArrayOfMongoObject(allAdmins) && allAdmins.length > 0) {
      return this.res.json({
        success: false,
        message: " admins not found",
      });
    }

    const userUpdates = {};
    userUpdates.isAdmin = 0;
    try {
      const updateUser = await User.updateMany(
        {
          status: 1,
        },
        {
          $set: userUpdates,
        }
      );
    } catch (error) {
      console.log(error);
    }
    admin = [];
    const pushfoundProperty = await Promise.all(
      allAdmins.map(async (particularAdmin, index) => {
        const contextId = particularAdmin.userId;
        if (isValidMongoObjectId(contextId)) {
          const updates = {};
          updates.isAdmin = 1;
          updates.adminId = particularAdmin._id;
          try {
            const updateUser = await User.updateOne(
              {
                _id: contextId,
              },
              {
                $set: updates,
                $push: {
                  admin: particularAdmin,
                },
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
      message: "User Updated succesfully",
    });
  }

  async __deleteBusiness() {
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

    const businessToUpdate = this.req.params.businessId || [];
    if (!isValidMongoObjectId(businessToUpdate)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: " Invalid business id",
      });
    }

    if (isValidMongoObjectId(businessToUpdate)) {
      const foundBusiness = await Business.findOne({
        status: 1,
        _id: businessToUpdate,
      });
      if (!isValidMongoObject(foundBusiness)) {
        this.res.statusCode = 400;
        return this.res.json({
          success: false,
          message: "Business not found",
        });
      }

      const businessUpdatableSet = {};

      try {
        const updateParticulaBusinessName = await Name.findOneAndUpdate(
          {
            status: 1,
            ownerId: businessToUpdate,
            ownerType: 5,
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
        businessUpdatableSet.name = updateParticulaBusinessName;
      } catch (error) {
        console.log(error);
      }

      try {
        const updateParticulaBusinessPhonenumber = await PhoneNumber.updateMany(
          {
            status: 1,
            ownerId: businessToUpdate,
            ownerType: 5,
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
      } catch (error) {
        console.log(error);
      }

      try {
        const updateParticulaBusinessEmail = await Email.updateMany(
          {
            status: 1,
            ownerId: businessToUpdate,
            ownerType: 5,
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
      } catch (error) {
        console.log(error);
      }

      try {
        const updateParticulaBusinessImage =
          await BusinessImage.findOneAndUpdate(
            {
              status: 1,
              businessId: businessToUpdate,
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
        if (isValidMongoObject(updateParticulaBusinessImage)) {
          businessUpdatableSet.image = updateParticulaBusinessImage;
        }
      } catch (error) {
        console.log(error);
      }

      try {
        const updateParticularBusinessDays = await BusinessDays.updateMany(
          {
            status: 1,
            businessId: businessToUpdate,
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
      } catch (error) {
        console.log(error);
      }

      try {
        const updateParticularBusinessAddress =
          await HouseAddressName.updateMany(
            {
              status: 1,
              ownerId: businessToUpdate,
              ownerType: 5,
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
      } catch (error) {
        console.log(error);
      }

      try {
        const updateParticularBusinessEstateLinking =
          await BusinessEstateLinking.updateMany(
            {
              status: 1,
              businessId: businessToUpdate,
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
      } catch (error) {
        console.log(error);
      }

      const allBusinessPhoneNumbers = await PhoneNumber.find({
        ownerId: businessToUpdate,
        ownerType: 5,
      });
      if (
        isValidArrayOfMongoObject(allBusinessPhoneNumbers) &&
        allBusinessPhoneNumbers.length > 0
      ) {
        businessUpdatableSet.phoneNumbers = allBusinessPhoneNumbers;
      }
      const allBusinessEmails = await Email.find({
        ownerId: businessToUpdate,
        ownerType: 5,
      });
      if (
        isValidArrayOfMongoObject(allBusinessEmails) &&
        allBusinessEmails.length > 0
      ) {
        businessUpdatableSet.emails = allBusinessEmails;
      }

      const allBusinessDays = await BusinessDays.find({
        businessId: businessToUpdate,
      });
      if (
        isValidArrayOfMongoObject(allBusinessDays) &&
        allBusinessDays.length > 0
      ) {
        businessUpdatableSet.operatingDays = allBusinessDays;
      }

      const allBusinessAddress = await HouseAddressName.find({
        ownerId: businessToUpdate,
        ownerType: 5,
      });
      if (isValidMongoObject(allBusinessAddress)) {
        businessUpdatableSet.businessAddress = allBusinessAddress;
      }

      try {
        businessUpdatableSet.status = 0;
        businessUpdatableSet.isAvailiable = 0;

        const updateParticularHouse = await Business.findOneAndUpdate(
          {
            status: 1,
            _id: businessToUpdate,
          },
          {
            $set: businessUpdatableSet,
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

    // let foundEstateHouse = await House.find({
    //   status: 1,
    // });
    // if (!isValidArrayOfMongoObject(foundEstateHouse)) {
    //   foundEstateHouse = [];
    // }
    return this.res.json({
      success: true,
      message: "Business deleted Succesfully",
      // houses: foundEstateHouse,
    });
  }
  // businessToUpdate
  async __deleteService() {
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

    const serviceToUpdate = this.req.params.serviceId || [];
    if (!isValidMongoObjectId(serviceToUpdate)) {
      this.res.statusCode = 406;
      return this.res.json({
        success: false,
        message: " Invalid service id",
      });
    }

    if (isValidMongoObjectId(serviceToUpdate)) {
      const foundService = await Service.findOne({
        status: 1,
        _id: serviceToUpdate,
      });
      if (!isValidMongoObject(foundService)) {
        this.res.statusCode = 404;
        return this.res.json({
          success: false,
          message: "Service not found",
        });
      }

      const serviceUpdatableSet = {};

      try {
        const updateParticularServiceName = await Name.findOneAndUpdate(
          {
            status: 1,
            ownerId: serviceToUpdate,
            ownerType: 6,
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
        serviceUpdatableSet.name = updateParticularServiceName;
      } catch (error) {
        console.log(error);
      }

      try {
        const updateParticularServicePhonenumber = await PhoneNumber.updateMany(
          {
            status: 1,
            ownerId: serviceToUpdate,
            ownerType: 6,
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
      } catch (error) {
        console.log(error);
      }

      try {
        const updateParticularServiceEmail = await Email.updateMany(
          {
            status: 1,
            ownerId: serviceToUpdate,
            ownerType: 6,
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
      } catch (error) {
        console.log(error);
      }

      // serviceId

      try {
        const updateParticularServicemage = await ServiceImage.findOneAndUpdate(
          {
            status: 1,
            serviceId: serviceToUpdate,
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
        if (isValidMongoObject(updateParticularServicemage)) {
          serviceUpdatableSet.image = updateParticularServicemage;
        }
      } catch (error) {
        console.log(error);
      }

      try {
        const updateParticularServiceAddress =
          await HouseAddressName.updateMany(
            {
              status: 1,
              ownerId: serviceToUpdate,
              ownerType: 6,
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
      } catch (error) {
        console.log(error);
      }

      try {
        const updateParticularServiceEstateLinking =
          await ServiceEstateLinking.updateMany(
            {
              status: 1,
              serviceId: serviceToUpdate,
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
      } catch (error) {
        console.log(error);
      }

      const allServicePhoneNumbers = await PhoneNumber.find({
        ownerId: serviceToUpdate,
        ownerType: 6,
      });
      if (
        isValidArrayOfMongoObject(allServicePhoneNumbers) &&
        allServicePhoneNumbers.length > 0
      ) {
        serviceUpdatableSet.phoneNumbers = allServicePhoneNumbers;
      }
      const allServiceEmails = await Email.find({
        ownerId: serviceToUpdate,
        ownerType: 6,
      });
      if (
        isValidArrayOfMongoObject(allServiceEmails) &&
        allServiceEmails.length > 0
      ) {
        serviceUpdatableSet.emails = allServiceEmails;
      }

      const allServiceAddress = await HouseAddressName.find({
        ownerId: serviceToUpdate,
        ownerType: 6,
      });
      if (isValidMongoObject(allServiceAddress)) {
        serviceUpdatableSet.businessAddress = allServiceAddress;
      }

      try {
        serviceUpdatableSet.status = 0;
        serviceUpdatableSet.isAvailiable = 0;

        const updateParticularHouse = await Service.findOneAndUpdate(
          {
            status: 1,
            _id: serviceToUpdate,
          },
          {
            $set: serviceUpdatableSet,
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
    return this.res.json({
      success: true,
      message: "Service deleted Succesfully",
      // houses: foundEstateHouse,
    });
  }
}
module.exports = Admin;
