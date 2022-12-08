const bcrypt = require("bcryptjs");
const { isHashedString, formatPhonenumber } = require("../../helpers/tools");
const {
  isValidFullName,
  isValidMongoObject,
  isEmail,
  isValidatePhoneneumber,
  isValidMongoObjectId,
  stringIsEqual,
  isValidPhonenumber,
  isValidArrayOfMongoObject,
  isValidPassword,
} = require("../../helpers/validators");
const Admin = require("../../model/admin");
const Email = require("../../model/email");
const HouseAddressName = require("../../model/house-address");
const Name = require("../../model/name");
const Password = require("../../model/password");
const PhoneNumber = require("../../model/phone-number");
const RegisteredEstate = require("../../model/registered-estate");
const User = require("../../model/user");
const crypto = require("crypto");
const Security = require("../../model/security");
const UserEstate = require("../../model/user-estate");
const UserMode = require("../../model/user-mode");
const UserFamily = require("../../model/user-family");
const UserNotifications = require("../../model/user-notifications");
const NotificationScheama = require("../../model/notification");
const UserNotificationLinking = require("../../model/user-notification-linking");
const FoodEstateLinking = require("../../model/food-estate-linking");
const GoodEstateLinking = require("../../model/good-estate-linking");
const ServiceEstateLinking = require("../../model/service-estate-linking");
const BusinessEstateLinking = require("../../model/business-estate-linking");
const PropertyEstateLinking = require("../../model/property-estate-linking");
const QpayWallet = require("../QpayWallet/QpayWallet");
const EmanagerWallet = require("../EmanagerWallet/EmanagerWallet");
const EmailVerify = require("../../model/email-verify");
const { adminScheama } = require("../../helpers/projections");
const AdminOfficeName = require("../../model/admin-office-name");
const AdminOfficeAddress = require("../../model/admin-office-address");
const AdminOfficePhoneNumber = require("../../model/admin-office-phonenumber");
const AdminOfficeEmail = require("../../model/admin-office-email");
const AdminGuarantorsName = require("../../model/admin-guarantor-name");
const AdminGuarantorsPhoneNumber = require("../../model/admin-guarantor-phonenumber");
const AdminGuarantorsEmail = require("../../model/admin-guarantor-name-email");
const {
  generateToken,
  generateTokenAdmin,
  generateTokenSecurity,
} = require("../../utils/tokenGenerator");
const responseBody = require("../../helpers/responseBody");
const Estate = require("../Estate/Estate");
const scheamaTools = require("../../helpers/scheamaTools");
class Authentication extends Estate {
  constructor(req, res, next) {
    super();
    this.req = req;
    this.res = res;
    this.next = next;
    this.emanagerWallet = new EmanagerWallet(this.req, this.res);
  }

  async __createName(name, type, isAdmin) {
    const createdOn = new Date();

    const newUserName = await scheamaTools.createName({
      status: 1, //0:inactive,1:active
      value: name,
      ownerType: type,
      createdOn,
      isAdmin: !!isAdmin && !isNaN(isAdmin) ? isAdmin : 0,
    });

    return newUserName;
  }
  async __createAdmin(isTopmost, estateId, userId, adminId) {
    const createdOn = new Date();
    if (
      !isValidMongoObjectId(estateId) ||
      !isValidMongoObjectId(userId) ||
      !isValidMongoObjectId(adminId)
    ) {
      return responseBody.noMethodAllowedResponse(
        this.res,
        "You need to provide a valid id"
      );
    }
    if (isNaN(isTopmost)) {
      return responseBody.noMethodAllowedResponse(
        this.res,
        "Invalid topmost specifier"
      );
    }

    const newAdmin = await scheamaTools.createAdmin({
      status: 1, //0:deleted,1:active
      userId: userId,
      isTopmost,
      estateId,
      createdBy: adminId, // admin ID of the admin who created this entry
      createdOn,
    });

    if (!newAdmin) {
      return responseBody.ErrorResponse(this.res, "Error while creating admin");
    }

    const userEstate = await this.__createUserEstate(newAdmin._id, estateId, 1);

    if (!isValidMongoObject(userEstate)) {
      return  userEstate
    }
    const userMode = await this.__createUserMode(newAdmin._id, estateId, 1);

    if (!isValidMongoObject(userMode)) {
      return userMode;
    }
    return newAdmin;
  }
  async __createSecurity(estateId, adminId) {
    const createdOn = new Date();
    if (!isValidMongoObjectId(estateId) || !isValidMongoObjectId(adminId)) {
      return responseBody.noMethodAllowedResponse(
        this.res,
        "You need to provide a valid id"
      );
    }

    const name = await this.__createName(this.req.body.name, 2);

    if (!isValidMongoObject(name)) {
      return name;
    }
    const email = await this.__createEmail(this.req.body.email, 2, 1, 0);
    if (!isValidMongoObject(email)) {
      return email;
    }
    const phone = await this.__createPhonenumber(this.req.body.phone, 2, 1, 0);

    if (!isValidMongoObject(phone)) {
      return phone;
    }

    const password = await this.__createPassword(this.req.body.password, 2);

    if (!isValidMongoObject(password)) {
      return password;
    }

    const houseAddress = await this.__createHouseAddress(
      this.req.body.houseAddress || "security house",
      2,
      estateId,
      "",
      ""
    );

    if (!isValidMongoObject(houseAddress)) {
      return houseAddress;
    }

    const newSecurity = await new Security({
      status: 1, //0:deleted,1:active
      ownerType: 2,
      estateId,
      createdBy: adminId, // admin ID of the admin who created this entry
      createdOn,
    });

    if (!isValidMongoObject(newSecurity)) {
      this.res.statusCode = 500;
      
      return responseBody.ErrorResponse( this.res ,  "Error while creating security") 
    } 
    const userEstate = await this.__createUserEstate(
      newSecurity._id,
      estateId,
      2
    );

    if (!userEstate) {
      return userEstate
    
    }

    const userMode = await this.__createUserMode(newSecurity._id, estateId, 2);

    if (!isValidMongoObject(userMode)) {
      return userMode;
    }
    name.ownerId = newSecurity._id;
    email.ownerId = newSecurity._id;
    phone.ownerId = newSecurity._id;
    houseAddress.ownerId = newSecurity._id;
    password.ownerId = newSecurity._id;
    await name.save();
    await email.save();
    await phone.save();
    await houseAddress.save();
    await password.save();
    await userEstate.save();
    await userMode.save();
    newSecurity.name = name;
    newSecurity.emails = email;
    newSecurity.phoneNumbers = phone;
    newSecurity.houseAddress = houseAddress;

    await newSecurity.save();

    return newSecurity;
  }

  async __createTopmostAdmin() {
    const { _id: userId } = this.res.user || "";
    const { _id: estateId } = this.res.estate || "";
    const createdOn = new Date();
    if (!isValidMongoObjectId(estateId) || !isValidMongoObjectId(userId)) {
     return responseBody.ErrorResponse(this.res, "You didn't provide a valid id");
    } 
if(!this.res.user.isVerified){
  return responseBody.ErrorResponse(this.res, "Account not yet verified");
}
    const existingTopmostAdmin = await this.__findTopmostAdmin();
    if (existingTopmostAdmin) {
      return responseBody.noMethodAllowedResponse(
        this.res,
        "Topmost Admin already exist"
      );
    }
    const foundUserPhonenumber = await scheamaTools.findPhoneNumber({
      status: 1,
      isPrimary: 1,
      ownerId: userId,
    });

    if (!foundUserPhonenumber) {
      return responseBody.notFoundResponse(this.res, "phone number not found");
    }
    const foundUserEmail = await scheamaTools.findEmail({
      status: 1,
      isPrimary: 1,
      ownerId: userId,
    });

    if (!foundUserEmail) {
      this.res.statusCode = 404;
      return responseBody.notFoundResponse(this.res, "Email not found");
    }
    const foundUserfullName = await scheamaTools.findName({
      status: 1,
      ownerId: userId,
    });

    if (!foundUserfullName) {
      return responseBody.notFoundResponse(this.res, "Name not found ");
    }
    const newAdmin = await scheamaTools.createAdmin({
      status: 1, //0:deleted,1:active
      userId,
      isTopmost: 1,
      estateId,
      role: "Supreme Admin",
      createdOn,
    });

    if (!newAdmin) {
      return responseBody.ErrorResponse(this.res, "Error while creating admin");
    }
    const userEstate = await this.__createUserEstate(newAdmin._id, estateId, 1);

    if (!userEstate) {
      return userEstate;
    }

    const userMode = await this.__createUserMode(newAdmin._id, estateId, 1);

    if (!userMode) {
      return userMode;
    }
    newAdmin.adminId = newAdmin._id;
    newAdmin.createdBy = newAdmin._id;
    const password = process.env.DEFAULT_TOPMOST_ADMIN_PASSWORD || "";

    if (!isValidPassword(password)) {
      return responseBody.ErrorResponse(this.res, "Invalid Default password");
    }
    const adminPassword = await this.__createPassword(password, 1);
    if (!adminPassword) {
      return adminPassword;
    }

    adminPassword.ownerId = newAdmin._id;
    const adminUpdates = {};
    try {
      const updateEmail = await Email.findOneAndUpdate(
        {
          status: 1,
          isAdmin: 0,
          ownerType: 0,
          isPrimary: 1,
          ownerId: userId,
        },
        {
          $set: { isAdmin: "1", adminId: newAdmin._id },
        },
        { new: true }
      );

      adminUpdates.emails = updateEmail;
    } catch (err) {
      console.log(err);
    }
    try {
      const updatePhoneNumber = await PhoneNumber.findOneAndUpdate(
        {
          status: 1,
          // isAdmin: 0,
          ownerType: 0,
          isPrimary: 1,
          ownerId: userId,
        },
        {
          $set: { isAdmin: "1", adminId: newAdmin._id },
        },
        { new: true }
      );
      adminUpdates.phoneNumbers = updatePhoneNumber;
    } catch (err) {
      console.log(err);
    }

    try {
      const updateName = await Name.findOneAndUpdate(
        {
          status: 1,
          isAdmin: 0,
          ownerType: 0,
          ownerId: userId,
        },
        {
          $set: { isAdmin: "1", adminId: newAdmin._id },
        },
        { new: true }
      );
      adminUpdates.name = updateName;
    } catch (err) {
      console.log(err);
    }

    const foundAdminPhonenumber = await scheamaTools.findPhoneNumber({
      status: 1,
      ownerId: userId,
    });

    if (!foundAdminPhonenumber) {
      return responseBody.notFoundResponse(
        this.res,
        "Admin phone number not found"
      );
    }
    const foundAdminEmail = await scheamaTools.findEmails({
      status: 1,
      ownerId: userId,
    });

    if (!foundAdminEmail) {
      return responseBody.notFoundResponse(this.res, "Admin Email not found");
    }
    const foundAdminfullName = await scheamaTools.findName({
      status: 1,
      ownerId: userId,
    });

    if (!foundAdminfullName) {
      return responseBody.findName(this.res, "Admin Name not found");
    }
    const userUpdatableSet = {};
    const userUpdatablePush = {};
    newAdmin.name = foundAdminfullName;
    newAdmin.emails = foundAdminEmail;
    newAdmin.phoneNumbers = foundAdminPhonenumber;
    userUpdatableSet.name = foundAdminfullName;
    userUpdatableSet.emails = foundAdminEmail;
    userUpdatableSet.phoneNumbers = foundAdminPhonenumber;
    (userUpdatableSet.isAdmin = 1),
      (userUpdatableSet.adminId = newAdmin._id),
      (userUpdatablePush.admin = newAdmin);
    await adminPassword.save();
    await newAdmin.save();
    await userEstate.save();
    await userMode.save();

    try {
      const updatedUser = await User.findOneAndUpdate(
        {
          status: "1",
          _id: userId,
        },
        {
          $set: userUpdatableSet,
          $push: userUpdatablePush,
        },
        { new: true }
      );
    } catch (error) {
      console.log(error);
    }

    return this.res.json({
      success: true,
      message: "Topmost admin created succesfully",
    });
  }
  async __checkExistingPhoneNumber(phone, type) {
    const formattedPhonenumber = formatPhonenumber(phone);
    const query = {
      status: 1,
      value: formattedPhonenumber[1] || "",
      countryCode: formattedPhonenumber[0] || "",
    };
    if (!isNaN(type) || type?.length > 0) {
      query.ownerType = type;
    }
    const existingPhoneneumber = await scheamaTools.findPhoneNumber(query);
    return existingPhoneneumber;
  }
  async __createPhonenumber(phone, type, isPrimary, isAdmin) {
    const createdOn = new Date();
    const phonenumber = phone;

    const formattedPhonenumber = formatPhonenumber(phonenumber);
    const existingPhoneneumber = await this.__checkExistingPhoneNumber(
      phone,
      type
    ); 
    if (existingPhoneneumber) {
      return responseBody.noMethodAllowedResponse(
        this.res,
        "phonenumber already exist"
      );
    }

    const newPhonenumber = await scheamaTools.createPhoneNumber({
      status: 1, //0:inactive,1:active
      value: formattedPhonenumber[1] || "",
      countryCode: formattedPhonenumber[0] || "",
      isPrimary,
      isAdmin,
      isVerified: false,
      ownerType: type,
      createdOn,
    });

    if (!newPhonenumber) {
      return responseBody.ErrorResponse(
        this.res,
        "Error while creating phonenumber"
      );
    }

    return newPhonenumber;
  }
  async __checkExistingEmail(email, type) {
    const query = {
      status: 1,
      value: email,
    };
    if (!isNaN(type) || type?.length > 0) {
      query.ownerType = type;
    }
    const existingEmail = await scheamaTools.findEmail(query);
    return existingEmail;
  }
  async __createEmail(email, type, isPrimary, isAdmin) {
    const createdOn = new Date();

    const existingEmail = await this.__checkExistingEmail(email, type);

    if (!!existingEmail) {
      return responseBody.noMethodAllowedResponse(
        this.res,
        `Email ${email} Already Exist, try again with a new email`
      );
    }

    const newUserEmail = await scheamaTools.createEmail({
      status: 1, //0:inactive,1:active
      value: email,
      isPrimary,
      isAdmin,
      isVerified: false,
      ownerType: type,
      createdOn,
    });

    if (!newUserEmail) {
      return responseBody.ErrorResponse(
        this.res,
        "Error creating email, please try again"
      );
    }

    return newUserEmail;
  }

  async __createPassword(password, type) {
    const createdOn = new Date();

    const encrytPassword = await this.__encryptPassword(password);
    const newUserPassword = await scheamaTools.createPassword({
      status: 1, //0:inactive,1:active
      hashedForm: encrytPassword,
      isPrimary: 1,
      ownerType: type,
      createdOn,
    });

    if (!newUserPassword) {
      return responseBody.ErrorResponse(
        this.res,
        "Error while creating password, please try again"
      );
    }
    return newUserPassword;
  }
  async __createHouseAddress(
    houseAddress,
    ownerType,
    estateId,
    houseOwnerType,
    apartmentType
  ) {
    const createdOn = new Date();

    const newHouseAddress = await scheamaTools.createHouseAddress({
      status: 1, //0:inactive,1:active
      value: houseAddress,
      ownerType,
      houseOwnerType,
      apartmentType,
      estateId,
      createdOn,
    });

    if (!newHouseAddress) {
      return responseBody.ErrorResponse(
        this.res,
        "Error while creating address, please try again"
      );
    }

    return newHouseAddress;
  }
  async __encryptPassword(password) {
    const createdOn = new Date();
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
  async __findPhonenumber(phone, type, isPrimary, isAdmin, ownerId, adminId) {
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
    };
    if (!isNaN(type)) {
      query.ownerType = type;
    }
    if (!isNaN(isPrimary)) {
      query.isPrimary = isPrimary;
    }
    if (!isNaN(isAdmin)) {
      query.isAdmin = isAdmin;
    }
    if (isValidMongoObjectId(ownerId)) {
      query.ownerId = ownerId;
    }
    if (isValidMongoObjectId(adminId)) {
      query.adminId = adminId;
    }
    const existingPhoneneumber = await scheamaTools.findPhoneNumber(query);

    if (!existingPhoneneumber) {
      return responseBody.notFoundResponse(this.res, "phonenumber not found");
    }

    return existingPhoneneumber;
  }

  async __initiateUserLogin(estateId) {
    const foundEstate = await this.__findEstate(estateId);
    if (!isValidMongoObject(foundEstate)) {
      return foundEstate;
    }

    let ownerId = "";

    if (!!this.req.body.phone) {
      const phone = await this.__findPhonenumber(this.req.body.phone, 0, 1);
      if (!isValidMongoObject(phone)) {
        return phone;
      }
      ownerId = phone.ownerId;
      if (!isValidMongoObjectId(ownerId)) {
        return phone;
      }
    } else if (!!this.req.body.email) {
      const email = await this.__findEmail(this.req.body.email, 0, 1);
      if (!isValidMongoObject(email)) {
        return email;
      }
      ownerId = email.ownerId;
      if (!isValidMongoObjectId(ownerId)) {
        return email;
      }
    } else {
      return responseBody.ErrorResponse(
        this.res,
        "Invalid input, try again with the correct details"
      );
    }
    const password = await this.__findPassword(
      this.req.body.password,
      0,
      ownerId
    );

    if (!isValidMongoObject(password)) {
      return password;
    }
    if (!stringIsEqual(password.ownerId, ownerId)) {
      return responseBody.forbiddenErrorResponse(
        this.res,
        "invalid user details, try again with the correct details"
      );
    }
    const user = await this.__findUser(ownerId, 0);

    if (!isValidMongoObject(user)) {
      return user;
    }
    const userEstate = await this.__findUserEstate(ownerId, estateId);
    if (!isValidMongoObject(userEstate)) {
      return userEstate;
    }
    if (!stringIsEqual(userEstate.ownerType, 0)) {
      return responseBody.forbiddenErrorResponse(
        this.res,
        "sorry you are not a user"
      );
    }

    const userFoundUserFamily = await scheamaTools.findUserFamily({
      status: 1,
      estateId,
      ownerId: user._id,
    });
    if (!userFoundUserFamily) {
      const userFoundUserHouseAddress = await scheamaTools.findHouseAddress({
        status: 1,
        estateId,
        ownerId: user._id,
      });
      if (!userFoundUserHouseAddress) {
        return responseBody.notFoundResponse(
          this.res,
          "house Address not found"
        );
      }
      const userFamily = await this.__createUserFamily(
        user._id,
        estateId,
        0,
        userFoundUserHouseAddress._id,
        true,
        "owner"
      );

      if (!isValidMongoObject(userFamily)) {
        return userFamily;
      }

      await userFamily.save();
    }

    const userFoundUserNotifications = await scheamaTools.findUserNotification({
      status: 1,
      estateId,
      ownerId: user._id,
    });

    if (!userFoundUserNotifications) {
      const userNotification = await this.__createUserNotification(
        user._id,
        estateId
      );

      if (!isValidMongoObject(userNotification)) {
        return userNotification;
      }

      await userNotification.save();
    }

    return user;
  }
  async __initiateSecurityLogin(estateId) {
 
    let ownerId = "";

    if (!!this.req.body.phone) {
      const phone = await this.__findPhonenumber(this.req.body.phone, 2, 1);
      if (!isValidMongoObject(phone)) {
        return phone;
      }
      ownerId = phone.ownerId;
      if (!isValidMongoObjectId(ownerId)) {
        return phone;
      }
    } else if (!!this.req.body.email) {
      const email = await this.__findEmail(this.req.body.email, 2, 1);
      if (!isValidMongoObject(email)) {
        return email;
      }
      ownerId = email.ownerId;
      if (!isValidMongoObjectId(ownerId)) {
        return email;
      }
    } else {
    return responseBody.forbiddenErrorResponse(this.res,"Provide a valid email or phonenumber")
 
    }

    if (!isValidMongoObjectId(ownerId)) { 
      return responseBody.forbiddenErrorResponse(this.res,"Invalid ownerId")
 
    }

    const password = await this.__findPassword(
      this.req.body.password,
      2,
      ownerId
    );

    if (!isValidMongoObject(password)) {
      return password;
    }
    if (!stringIsEqual(password.ownerId, ownerId)) {
      return responseBody.forbiddenErrorResponse(this.res,"Invalid security details") 
    }
    const security = await this.__findSecurity(ownerId, 2);
    if (!isValidMongoObject(security)) {

      return responseBody.forbiddenErrorResponse(this.res,"Invalid security")
    }
    // const userEstate = await this.__findUserEstate(ownerId, estateId);
    // if (!isValidMongoObject(userEstate)) {
    //   return userEstate;
    // }
    const userEstate = await scheamaTools.findUserEstate({
      status: 1,
      ownerId,
      ownerType: 2,
    });
    if (!userEstate) {
      return responseBody.ErrorResponse(this.res,"Invalid security details")
    }

    return security;
  }

  async __initiateAdminLogin() {
    let adminId = "";
    let ownerId = "";

    if (!!this.req.body.phone) {
      const phone = await this.__findPhonenumber(
        this.req.body.phone,
        0,
        "-",
        1,
        1
      );
      if (!isValidMongoObject(phone)) {
        return phone;
      }
      adminId = phone.adminId;
      ownerId = phone.ownerId;
      if (!isValidMongoObjectId(adminId)) {
        return phone;
      }
    } else if (!!this.req.body.email) {
      const email = await this.__findEmail(this.req.body.email, 0, "-", 1, 1);
      if (!isValidMongoObject(email)) {
        return email;
      }
      adminId = email.adminId;
      ownerId = email.ownerId;
      if (!isValidMongoObjectId(adminId)) {
        return email;
      }
    } else {
      return responseBody.noMethodAllowedResponse(this.res, "Invalid input");
    }

    if (!isValidMongoObjectId(adminId)) {
      return responseBody.noMethodAllowedResponse(this.res, "Invalid adminId");
    }
    if (!isValidMongoObjectId(ownerId)) {
      return responseBody.noMethodAllowedResponse(this.res, "Invalid ownerId");
    }

    const admin = await scheamaTools.findAdmin({
      status: "1",
      userId: ownerId,
      _id: adminId,
    });

    if (!admin) {
      return responseBody.notFoundResponse(this.res, "Admin not found");
    }
    const password = await this.__findPassword(
      this.req.body.password,
      1,
      adminId
    );

    if (!isValidMongoObject(password)) {
      return password;
    }
    if (!stringIsEqual(password.ownerId, adminId)) {
      return responseBody.unauthorizedResponse(
        this.res,
        "invalid user details"
      );
    }
    if (!stringIsEqual(admin.isTopmost, 1)) {
      const userEstate = await this.__findUserEstate(adminId, estateId);
      if (!userEstate) {
        return userEstate;
      }
    }
    return admin;
  }

  async __findEmail(email, type, isPrimary, isAdmin) {
    const createdOn = new Date();

    const query = { status: 1, value: email };
    if (!isNaN(isAdmin)) {
      query.isAdmin = isAdmin;
    }
    if (!isNaN(isPrimary)) {
      query.isPrimary = isPrimary;
    }
    if (!isNaN(type)) {
      query.ownerType = type;
    }

    const existingEmail = await scheamaTools.findEmail(query);

    if (!existingEmail) {
      return responseBody.ErrorResponse(this.res, "email not found");
    }

    return existingEmail;
  }

  async __findUser(ownerId, type) {
    const createdOn = new Date();

    const existingUser = await scheamaTools.findUser({
      status: 1,
      _id: ownerId,
      // ownerType: type,
    });
    if (!existingUser) {
      return responseBody.notFoundResponse(this.res, "user not found");
    }

    return existingUser;
  }

  async __findUserEstate(userId, estateId) {
    const createdOn = new Date();
    const existingUserEstate = await scheamaTools.findUserEstate({
      status: 1,
      ownerId: userId,
      estateId,
    });

    if (!existingUserEstate) {
      return responseBody.forbiddenErrorResponse(
        this.res,
        "user not registered under this estate"
      );
    }

    return existingUserEstate;
  }
  async __findUserFamily(userId, estateId) {
    const createdOn = new Date();
    const existingUserFamily = await scheamaTools.findUserFamily({
      status: 1,
      ownerId: userId,
      estateId,
    });

    if (!existingUserFamily) {
      return responseBody.forbiddenErrorResponse(
        this.res,
        "user family not not found under this estate"
      );
    }

    return existingUserEstate;
  }

  async __findSecurity(ownerId, type) {
    const createdOn = new Date();
    if (!isValidMongoObjectId(ownerId)) { 
      return responseBody.ErrorResponse(
        this.res,
        "invalid Security details"
      );
    }
    const existingSecurity = await scheamaTools.findSecurity(
      {
        status: 1,
        _id: ownerId,
        ownerType: type,
      } );

    if (!existingSecurity) { 
      return responseBody.ErrorResponse(
        this.res,
        "invalid Security"
      );
    }

    return existingSecurity;
  }

  async __findPassword(password, type, ownerId) {
    const createdOn = new Date();

    const query = {
      status: 1,
      ownerId,
    };
    if (!isNaN(type)) {
      query.ownerType = type;
    }
    const existingPassword = await scheamaTools.findPassword(query);

    if (!existingPassword) {
      return responseBody.notFoundResponse(
        this.res,
        "password not found in the system, try again with the correct passeord"
      );
    }
    if (!isHashedString(password, existingPassword.hashedForm)) {
      return responseBody.notFoundResponse(
        this.res,
        "incorrect password, try again with the correct passeord"
      );
    }

    return existingPassword;
  }

  async __userRegister() {
    const createdOn = new Date();
    // type 0: user
    //       1: admin
    //      2:guest

    const estateId = this.req.query["estateId"] || "";
    const houseOwnerType = this.req.body.houseOwnerType || "";
    const apartmentType = this.req.body.apartmentType;
    const foundEstate = await this.__findEstate(estateId);
    if (!isValidMongoObject(foundEstate)) {
      return foundEstate;
    }
    const name = await this.__createName(this.req.body.name, 0, 0);
    if (!isValidMongoObject(name)) {
      return name;
    }
    const email = await this.__createEmail(this.req.body.email, 0, 1, 0);
    if (!isValidMongoObject(email)) {
      return email;
    }
    const phone = await this.__createPhonenumber(this.req.body.phone, 0, 1, 0);

    if (!isValidMongoObject(phone)) {
      return phone;
    }

    const password = await this.__createPassword(this.req.body.password, 0);

    if (!isValidMongoObject(password)) {
      return password;
    }

    const houseAddress = await this.__createHouseAddress(
      this.req.body.houseAddress,
      0,
      estateId,
      houseOwnerType,
      apartmentType
    );

    if (!isValidMongoObject(houseAddress)) {
      return houseAddress;
    }

    const newUser = await scheamaTools.createUser({
      status: 1,
      isAdmin: 0,
      isVerified: false,
      type: "e-manager",
    });

    if (!isValidMongoObject(newUser)) {
      return responseBody.ErrorResponse(
        this.res,
        "Error while creating user, please try again"
      );
    }

    const userEstate = await this.__createUserEstate(newUser._id, estateId, 0);
    if (!isValidMongoObject(userEstate)) {
      return userEstate;
    }
    const userMode = await this.__createUserMode(newUser._id, estateId, 0);

    if (!isValidMongoObject(userMode)) {
      return userMode;
    }

    const userFamily = await this.__createUserFamily(
      newUser._id,
      estateId,
      0,
      houseAddress._id,
      true,
      "owner"
    );

    if (!isValidMongoObject(userFamily)) {
      return userFamily;
    }

    const userNotification =
      await this.__createNewUserEstateDefaultNotification(newUser, estateId);

    if (!isValidMongoObject(userNotification)) {
      return userNotification;
    }
     
    const newlyCreatedEmailVerify = await this.__verifyEmail(email, newUser);
 
    if (!isValidMongoObject(newlyCreatedEmailVerify)) {
      return newlyCreatedEmailVerify;
    }
 
    const createEmanagerUserWallet = await this.emanagerWallet.__createWallet(
      newUser
    );
 
    if (!isValidMongoObject(createEmanagerUserWallet)) {
      return createEmanagerUserWallet;
    }
 
    // const newUserMode = await new UserMode({})
    name.ownerId = newUser._id;
    email.ownerId = newUser._id;
    phone.ownerId = newUser._id;
    houseAddress.ownerId = newUser._id;
    password.ownerId = newUser._id;

    await newlyCreatedEmailVerify.save();
    await name.save();
    await email.save();
    await phone.save();
    await houseAddress.save();
    await password.save();
    await userEstate.save();
    await userMode.save();
    await userFamily.save();
    await userNotification.save();
    newUser.name = name;
    newUser.emails = email;
    newUser.phoneNumbers = phone;
    newUser.houseAddress = houseAddress;

    await newUser.save();

    const userUpdates = await this.__refreshUserUpdates(newUser, estateId);

    if (stringIsEqual(typeof userUpdates, "object")) {
      return userUpdates;
    }
    const formatedUser = await this.__formatUserBody(newUser, estateId);

    return this.res.json({
      success: true,
      message: "User Created Successfully",
      user: formatedUser,
      token: generateToken(newUser, estateId),
    });
  }
  // newUser
  async __verifyEmail(email, newUser) {
    const createdOn = new Date()
    const newlyCreatedEmailVerify = await scheamaTools.createEmailVerify({
      status: 1,
      value: email.value,
      ownerId: email._id,
      userId: newUser._id,
      ownerType: 0,
      createdOn,
      createdBy: newUser._id,
      expiresOn: new Date(createdOn.getTime() + 86400000),
      token: crypto.randomBytes(16).toString("hex"),
    });
    if (!newlyCreatedEmailVerify) {
      return responseBody.ErrorResponse(
        this.res,
        "Error while creating Email Verification link"
      );
    }
    return newlyCreatedEmailVerify
  }
  async __formatUserBody(user, estateId) {
    const formatuserphoneObject = Array.isArray(user?.phoneNumbers)
      ? user.phoneNumbers.find((phoneNumber) =>
          stringIsEqual(phoneNumber?.isPrimary, 1)
        )
      : {};
    const formatuserphone =
      `${formatuserphoneObject?.countryCode}` +
      `${formatuserphoneObject?.value}`;

    const formatedUser = {
      name: user?.name?.value || "",
      apartmentType: user?.apartmentType,
      houseOwnerType: user?.houseOwnerType,
      email: Array.isArray(user?.emails)
        ? user.emails.find((email) => stringIsEqual(email?.isPrimary, 1))?.value
        : "",
      phoneNumber: formatuserphone,
      houseAddress: Array.isArray(user?.houseAddress)
        ? user.houseAddress.find((houseAddress) =>
            stringIsEqual(estateId, houseAddress.estateId)
          )?.value
        : "",
      _id: user._id,
    }; 
    return formatedUser;
  }
  // newUser
  async __userLogin() {
    const createdOn = new Date();
    const estateId = this.req.query["estateId"] || "";
    const user = await this.__initiateUserLogin(estateId);
    if (!isValidMongoObject(user)) {
      return user;
    }
    const formatedUser = await this.__formatUserBody(user, estateId);
    const userUpdates = await this.__refreshUserUpdates(user, estateId);

    if (stringIsEqual(typeof userUpdates, "object")) {
      return userUpdates;
    }

    const emanagerUserWalletlogin = await this.emanagerWallet.__walletLogin(
      user
    );
    if (!isValidMongoObject(emanagerUserWalletlogin)) {
      return emanagerUserWalletlogin;
    }
    return this.res.json({
      success: true,
      message: "User Login Successfully",
      user: formatedUser,
      token: generateToken(user, estateId),
    });
  }

  async __createNewUserEstateDefaultNotification(newUser, estateId) {
    const userEstateDefaultNotifications = await scheamaTools.findNotifications(
      {
        status: 1,
        estateId: estateId,
        isDefault: 1,
      }
    );
    let userDefaultNotifications = [];
    if (userEstateDefaultNotifications?.length > 0) {
      userDefaultNotifications = userEstateDefaultNotifications;
      userEstateDefaultNotifications.map(async (notification, index) => {
        try {
          const newUserNotificationLinking = await new UserNotificationLinking({
            status: 1,
            ownerId: newUser._id,
            contextId: notification._id,
            isRead: false,
            kind: notification.kind, //0:notice,1: suggestion,2: forum
            createdOn,
            createdBy: newUser._id,
          });

          await newUserNotificationLinking.save();
        } catch (error) {
          console.log(error);
        }
      });
    }

    const userNotification = await this.__createUserNotification(
      newUser._id,
      estateId
    );

    if (!userNotification) {
      return userNotification
    }
    userNotification.notifications = userDefaultNotifications;
    return userNotification;
  }

  async __updateUserNotification(user, estateId) {
    const { _id: userId } = user;

    const currentUserNotificationLinking =
      await scheamaTools.findUserNotificationLinkings({
        status: "1",
        ownerId: userId,
        estateId,
      });

    if (!currentUserNotificationLinking) {
      return;
    }
    const currentUserNotificationLinkingCount =
      await scheamaTools.userNotificationLinkingCount({
        status: "1",
        ownerId: userId,
        isRead: false,
        estateId,
      });
    const userNotifications = [];

    const pushUserNotifications = await Promise.all(
      currentUserNotificationLinking.map(async (notificationLinking, index) => {
        const contextId = notificationLinking.contextId;
        if (isValidMongoObjectId(contextId)) {
          const notification = await scheamaTools.findNotification({
            status: 1,
            _id: notificationLinking.contextId,
          });
          if (notification) {
            userNotifications.push(notification);
          }
        }
      })
    );
    try {
      const updateUserNotifications = await scheamaTools.updateNotification(
        {
          status: 1,
          ownerId: userId,
          estateId,
        },
        {
          $set: {
            total: currentUserNotificationLinking.length,
            unread: currentUserNotificationLinkingCount,
            notifications: userNotifications,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  async __refreshUserUpdates(user, estateId) {
    const { _id: userId } = user;

    const currentUserNotificationLinkingCount =
      await scheamaTools.userNotificationLinkingCount({
        status: "1",
        ownerId: userId,
        isRead: false,
        estateId,
      });

    this.res.notificationCount = currentUserNotificationLinkingCount || 0;

    try {
      const updateNotification = await this.__updateUserNotification(
        user,
        estateId
      );
    } catch (error) {
      console.log(error);
    }
    const currentEstateFoodLinkingCount = await scheamaTools.estateFoodCount({
      status: "1",
      estateId,
    });

    this.res.estateFoodsCount = currentEstateFoodLinkingCount || 0;
    const currentFoodCount = await scheamaTools.foodCount({
      status: "1",
      estateId,
    });

    this.res.foodsCount = currentFoodCount || 0;

    const currentEstateGoodLinkingCount = await scheamaTools.estateGoodCount({
      status: "1",
      estateId,
    });

    this.res.estateGoodsCount = currentEstateGoodLinkingCount || 0;

    const currentGoodCount = await scheamaTools.goodCount({
      status: "1",
      estateId,
    });

    this.res.goodsCount = currentGoodCount || 0;

    const currentEstateServiceLinkingCount =
      await ServiceEstateLinking.countDocuments({
        status: "1",
        estateId,
      });

    if (isNaN(currentEstateServiceLinkingCount)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Sorry!!...Services count process error",
      });
    }

    this.res.servicesCount = currentEstateServiceLinkingCount;

    const currentEstateBusinessLinkingCount =
      await scheamaTools.estateBusinessCount({
        status: "1",
        estateId,
      });

    this.res.estateBusinessCount = currentEstateBusinessLinkingCount || 0;

    const currentBusinessCount = await scheamaTools.businessCount({
      status: "1",
      estateId,
    });

    this.res.businessCount = currentBusinessCount || 0;

    const currentEstatePropertyLinkingCount =
      await scheamaTools.estatePropertyCount({
        status: "1",
        estateId,
      });
    this.res.estatePropertyCount = currentEstatePropertyLinkingCount || 0;

    const currentPropertyCount = await scheamaTools.propertyCount({
      status: "1",
      estateId,
    });
    this.res.propertyCount = currentPropertyCount || 0;

    return true;
  }

  async __securityLogin() {
    const createdOn = new Date();
    const estateId = this.req.query["estateId"] || "";
    // if (!isValidMongoObjectId(estateId)) {
    // this.res.statusCode = 400
    //   return this.res.json({
    //     success: false,
    //     message: "Invalid estate id",
    //   });
    // }
    if (isValidMongoObject(this.res.security)) {
     return responseBody.forbiddenErrorResponse(this.res,"Already have an active session") 
    }
    const security = await this.__initiateSecurityLogin(estateId);
    if (!isValidMongoObject(security)) {
      return security;
    }
    return this.res.json({
      success: true,
      message: "Security Login Successfully",
      security,
      token: generateTokenSecurity(security),
    });
  }

  async __findAdmin(adminId) {
    const createdOn = new Date();
    if (!isValidMongoObjectId(adminId)) {
      this.res.statusCode = 400;
      return responseBody.noMethodAllowedResponse(
        this.res,
        "invalid admin details"
      );
    }

    const existingAdmin = await scheamaTools.findAdmin({
      status: 1,
      _id: adminId,
    });

    if (!existingAdmin) {
      this.res.statusCode = 404;

      return responseBody.notFoundResponse(this.res, "Admin not found!!!");
    }

    return existingAdmin;
  }

  async __findParticularEstateAdmin(adminId, estateId) {
    const createdOn = new Date();
    if (!isValidMongoObjectId(adminId) || !isValidMongoObjectId(estateId)) {
      return responseBody.ErrorResponse(this.res, "invalid admin details");
    }

    const existingEstateAdmin = await scheamaTools.findUserEstate({
      status: 1,
      // estateId,
      ownerId: adminId,
      // ownerType: 1,
    });

    if (!existingEstateAdmin) {
      return responseBody.notFoundResponse(
        this.res,
        "Admin not found under this estate!!!"
      );
    }

    return existingEstateAdmin;
  }

  async __findAllParticularEstateAdmins(estateId) {
    const createdOn = new Date();
    const existingAdmin = await scheamaTools.findAdmins({
      status: 1,
      estateId,
    }); 
    if (!Array.isArray(existingAdmin) || existingAdmin.length < 1) {
      return responseBody.notFoundResponse(this.res, "Admin not found!!!");
    }
    return existingAdmin;
  }

  async __checkExistingAdmin(ownerId, estateId) {
    const createdOn = new Date();

    
    const query = {
      status: 1,
      userId: ownerId, 
    }

    if(isValidMongoObjectId(estateId)){
      query.estateId = estateId
    }

    const existingAdmin = await scheamaTools.findAdmin(
     query);

    return existingAdmin;
  }

  async __checkExistingAdminWithRole(estateId, role) {
    const createdOn = new Date();
    if (role.length < 2) {
      return;
    }

    const existingAdmin = await scheamaTools.findAdmin({
      status: 1,
      role,
      estateId
    });

    return existingAdmin;
  }

  async __findTopmostAdmin() {
    const createdOn = new Date();

    const existingTopmostAdmin = await scheamaTools.findAdmin({
      status: 1,
      isTopmost: 1,
    });

    if (!existingTopmostAdmin) {
      return;
    }

    return existingTopmostAdmin;
  }

  async __deletePassword(ownerId, updatedBy, type) {
    const createdOn = new Date();
    if (
      !isValidMongoObjectId(ownerId) ||
      !isValidMongoObjectId(updatedBy) ||
      isNaN(type)
    ) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid details",
      });
    }

    const passwordUpdatableSet = {
      status: 0,
    };
    const passwordUpdatablePush = {
      updates: {
        by: updatedBy, // admin ID of the admin who made this update
        action: 0, //0:delete,
        timing: createdOn,
      },
    };
    await Password.updateOne(
      {
        ownerId,
        status: 1,
        ownerType: type,
      },
      {
        $set: passwordUpdatableSet,
        $push: passwordUpdatablePush,
      }
    );
  }

  async __deleteAdmin(ownerId, updatedBy, type, estateId) {
    const createdOn = new Date();
    if (
      !isValidMongoObjectId(ownerId) ||
      !isValidMongoObjectId(updatedBy) ||
      isNaN(type) ||
      !isValidMongoObjectId(estateId)
    ) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid details",
      });
    }

    const adminScheamaUpdatableSet = {
      status: 0,
    };

    const adminUpdatableSet = {
      isAdmin: 0,
    };

    const adminUpdatablePush = {
      updates: {
        by: updatedBy, // admin ID of the admin who made this update
        action: "Delete", //0:delete,
        timing: createdOn,
      },
    };
    // delete admin's particular estate linking
    try {
      await UserEstate.updateOne(
        {
          ownerId: ownerId,
          status: 1,
          ownerType: type,
          estateId,
        },
        {
          $set: adminScheamaUpdatableSet,
          $push: adminUpdatablePush,
        }
      );
    } catch (err) {
      console.log(err);
    }

    const existingAdminEstate = await UserEstate.findOne({
      ownerId: ownerId,
      status: 1,
      ownerType: type,
    });
    const adminDetails = {
      status: 0,
    };
    // if the admin  isn't doesn't belong to another estate delete his details
    if (!isValidMongoObject(existingAdminEstate)) {
      try {
        const passwordUpdatableSet = {
          status: 0,
        };
        const updatePassword = await Password.updateMany(
          {
            status: 1,
            ownerId,
          },
          {
            $set: passwordUpdatableSet,
            $push: adminUpdatablePush,
          }
        );
      } catch (err) {
        console.log(err);
      }

      try {
        const updateName = await Name.findOneAndUpdate(
          {
            adminId: ownerId,
            status: 1,
          },
          {
            $set: adminUpdatableSet,
            $push: adminUpdatablePush,
          },
          { new: true }
        );
      } catch (err) {
        console.log(err);
      }
      try {
        const updateHouseAddressName = await HouseAddressName.findOneAndUpdate(
          {
            adminId: ownerId,
            status: 1,
          },
          {
            $set: adminUpdatableSet,
            $push: adminUpdatablePush,
          },
          { new: true }
        );
        adminDetails.address = updateHouseAddressName;
      } catch (err) {
        console.log(err);
      }
      try {
        const updateAdminOfficeName = await AdminOfficeName.findOneAndUpdate(
          {
            adminId: ownerId,
            status: 1,
          },
          {
            $set: adminUpdatableSet,
            $push: adminUpdatablePush,
          },
          { new: true }
        );
        adminDetails.officeName = updateAdminOfficeName;
      } catch (err) {
        console.log(err);
      }
      try {
        const updateAdminOfficeAddress =
          await AdminOfficeAddress.findOneAndUpdate(
            {
              adminId: ownerId,
              status: 1,
            },
            {
              $set: adminUpdatableSet,
              $push: adminUpdatablePush,
            },
            { new: true }
          );
        adminDetails.officeAddress = updateAdminOfficeAddress;
      } catch (err) {
        console.log(err);
      }
      try {
        const updateAdminOfficePhoneNumber =
          await AdminOfficePhoneNumber.findOneAndUpdate(
            {
              adminId: ownerId,
              status: 1,
            },
            {
              $set: adminUpdatableSet,
              $push: adminUpdatablePush,
            },
            { new: true }
          );
        adminDetails.officePhonenumbers = updateAdminOfficePhoneNumber;
      } catch (err) {
        console.log(err);
      }
      try {
        const updateAdminOfficeEmail = await AdminOfficeEmail.findOneAndUpdate(
          {
            adminId: ownerId,
            status: 1,
          },
          {
            $set: adminUpdatableSet,
            $push: adminUpdatablePush,
          },
          { new: true }
        );
        adminDetails.officeEmails = updateAdminOfficeEmail;
      } catch (err) {
        console.log(err);
      }
      try {
        const updateAdminGuarantorsName =
          await AdminGuarantorsName.findOneAndUpdate(
            {
              adminId: ownerId,
              status: 1,
            },
            {
              $set: adminUpdatableSet,
              $push: adminUpdatablePush,
            },
            { new: true }
          );
        adminDetails.guarantorName = updateAdminGuarantorsName;
      } catch (err) {
        console.log(err);
      }
      // Email

      try {
        const updateAdminGuarantorsEmail =
          await AdminGuarantorsEmail.findOneAndUpdate(
            {
              adminId: ownerId,
              status: 1,
            },
            {
              $set: adminUpdatableSet,
              $push: adminUpdatablePush,
            },
            { new: true }
          );
        adminDetails.guarantorEmail = updateAdminGuarantorsEmail;
      } catch (err) {
        console.log(err);
      }
      // Name

      try {
        const updateAdminGuarantorsPhoneNumber =
          await AdminGuarantorsPhoneNumber.findOneAndUpdate(
            {
              adminId: ownerId,
              status: 1,
            },
            {
              $set: adminUpdatableSet,
              $push: adminUpdatablePush,
            },
            { new: true }
          );
        adminDetails.guarantorPhoneNumber = updateAdminGuarantorsPhoneNumber;
      } catch (err) {
        console.log(err);
      }
      try {
        const updateEmail = await Email.updateMany(
          {
            adminId: ownerId,
            status: 1,
          },
          {
            $set: adminUpdatableSet,
            $push: adminUpdatablePush,
          }
        );
      } catch (err) {
        console.log(err);
      }
      try {
        const updatePhoneNumber = await PhoneNumber.updateMany(
          {
            adminId: ownerId,
            status: 1,
          },
          {
            $set: adminUpdatableSet,
            $push: adminUpdatablePush,
          }
        );
      } catch (err) {
        console.log(err);
      }

      const allAdminNames = await Name.find({
        adminId: ownerId,
        status: 1,
      });

      if (
        isValidArrayOfMongoObject(allAdminNames) &&
        allAdminNames.length > 0
      ) {
        adminDetails.name = allAdminNames;
      }

      const allAdminEmails = await Email.find({
        adminId: ownerId,
        status: 1,
      });

      if (
        isValidArrayOfMongoObject(allAdminEmails) &&
        allAdminEmails.length > 0
      ) {
        adminDetails.emails = allAdminEmails;
      }

      const allAdminPhoneNumbers = await PhoneNumber.find({
        adminId: ownerId,
        status: 1,
      });

      if (
        isValidArrayOfMongoObject(allAdminPhoneNumbers) &&
        allAdminPhoneNumbers.length > 0
      ) {
        adminDetails.phoneNumbers = allAdminPhoneNumbers;
      }
    }
    let userId = ""
    try {
      const updatableAdmin = await Admin.findOneAndUpdate(
        {
          _id: ownerId,
          status: 1, 
        },
        {
          $set: adminDetails,
          $push: adminUpdatablePush,
        },
        {new: true}
      ); 
    userId = updatableAdmin.userId
    } catch (error) {
      console.log(error);
    }
    console.log(userId)
    try {
      const updatableAdmin = await User.updateOne(
        {
          _id: userId,
          status: 1, 
        },
        {
          $set: {isAdmin:0,admin:[]},
          $push: adminUpdatablePush,
        }
      );
    } catch (error) {
      console.log(error);
    }

    return true;
  }

  async __deleteName(ownerId, updatedBy, type) {
    const createdOn = new Date();
    if (
      !isValidMongoObjectId(ownerId) ||
      !isValidMongoObjectId(updatedBy) ||
      isNaN(type)
    ) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid details",
      });
    }

    const nameUpdatableSet = {
      status: 0,
    };
    const nameUpdatablePush = {
      updates: {
        by: updatedBy, // admin ID of the admin who made this update
        action: 0, //0:delete,
        timing: createdOn,
      },
    };
    await Name.updateOne(
      {
        ownerId,
        status: 1,
        ownerType: type,
        estateId,
      },
      {
        $set: nameUpdatableSet,
        $push: nameUpdatablePush,
      }
    );
  }

  async __deleteEmail(ownerId, updatedBy, type) {
    const createdOn = new Date();
    if (
      !isValidMongoObjectId(ownerId) ||
      !isValidMongoObjectId(updatedBy) ||
      isNaN(type)
    ) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid details",
      });
    }

    const emailUpdatableSet = {
      status: 0,
    };
    const emailUpdatablePush = {
      updates: {
        by: updatedBy, // admin ID of the admin who made this update
        action: 0, //0:delete,
        timing: createdOn,
      },
    };
    await Email.updateOne(
      {
        ownerId,
        status: 1,
        ownerType: type,
        estateId,
      },
      {
        $set: emailUpdatableSet,
        $push: emailUpdatablePush,
      }
    );
  }

  async __createUserEstate(userId, estateId, ownerType, createdBy) {
    const createdOn = new Date();

    const query = { status: 1, ownerId: userId, estateId, ownerType };

    if (isValidMongoObjectId(createdBy)) {
      query.createdBy = createdBy;
    }
    const newUserEstate = await scheamaTools.createUserEstate(query);

    if (!newUserEstate) {
      return responseBody.ErrorResponse(
        this.res,
        "Error while creating user estate, please try again"
      );
    }

    return newUserEstate;
  }

  async __createUserMode(userId, estateId, ownerType, createdBy) {
    const createdOn = new Date();

    const query = { status: 1, userId, estateId, mode: 0, ownerType };

    if (isValidMongoObjectId(createdBy)) {
      query.createdBy = createdBy;
    }
    const newUserMode = await scheamaTools.createUserMode(query);
    if (!newUserMode) {
      return responseBody.ErrorResponse(
        this.res,
        "Error while creating user mode, please try again"
      );
    }

    return newUserMode;
  }

  async __createUserFamily(
    userId,
    estateId,
    ownerType,
    houseAddressId,
    isHouseOwner,
    relationship
  ) {
    const createdOn = new Date();

    const newUserFamily = await scheamaTools.createUserFamily({
      status: 1,
      ownerId: userId,
      estateId,
      mode: 0,
      ownerType,
      houseAddressId,
      isHouseOwner, //0:not house owner,1:house owner
      relationship,
    });
    if (!newUserFamily) {
      return responseBody.ErrorResponse(
        this.res,
        "Error while creating user family, please try again"
      );
    }

    return newUserFamily;
  }

  async __createUserNotification(userId, estateId) {
    const createdOn = new Date();

    const newUserNotification = await scheamaTools.createUserNotifications({
      status: 1,
      ownerId: userId,
      estateId,
      unread: 0,
      total: 0,
      notifications: [],
      createdOn,
    });
    if (!newUserNotification) {
      return responseBody.ErrorResponse(
        this.res,
        "Error while creating user notification, please try again"
      );
    }

    return newUserNotification;
  }

  async __adminLogin() {
    const createdOn = new Date();
    if (isValidMongoObject(this.res.admin)) {
      return this.res.json({
        success: true,
        message: "Already have an active session",
      });
    }

    // const estateId = this.req.query["estateId"] || "";
    // if (!isValidMongoObjectId(estateId)) {
    // this.res.statusCode = 400
    //   return this.res.json({
    //     success: false,
    //     message: "Invalid estate id",
    //   });
    // }
    const admin = await this.__initiateAdminLogin();
    if (!isValidMongoObject(admin)) {
      return admin;
    }

    const existingUserEstate = await UserEstate.findOne({
      status: 1,
      ownerType: "1",
      ownerId: admin._id,
    });
    if (!isValidMongoObject(existingUserEstate)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "user estate not found",
      });
    }

    const estateId = existingUserEstate.estateId;
    return this.res.json({
      success: true,
      message: "Admin Login Successfully",
      admin,
      token: generateTokenAdmin(admin, estateId),
    });
  }

  async __userInfo() {
    const createdOn = new Date();
    this.res.send("<h1>User Info</h1>");
    const currentUser = !!this.res.user && this.res.user;
    if (!isValidMongoObject(currentUser)) {
      this.res.statusCode = 406;
      return this.res.json({
        success: false,
        message: "invalid user",
      });
    }

    return this.res.json({
      success: true,
      message: " user gotten succesfully",
      user: currentUser,
    });
  }
  async __adminInfo() {
    const createdOn = new Date();
  }
  async __logout() {
    const createdOn = new Date();
  }
}
module.exports = Authentication;
