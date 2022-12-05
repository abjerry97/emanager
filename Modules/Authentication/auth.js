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
const {
  generateToken,
  generateTokenAdmin,
  generateTokenSecurity,
  sendEmailNovuNotification,
} = require("../../utils");
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
class Authentication {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next; 
    this.emanagerWallet = new EmanagerWallet(this.req, this.res);

    
  }

  async __createName(name, type, isAdmin) {
    const createdOn = new Date();
    if (!isValidFullName(name)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "You need to provide a valid name",
      });
    }

    const newUserName = await new Name({
      status: 1, //0:inactive,1:active
      value: name,
      ownerType: type,
      createdOn,
      isAdmin: !!isAdmin && !isNaN(isAdmin) ? isAdmin : 0,
    });

    if (!isValidMongoObject(newUserName)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Error while creating name",
      });
    }

    return newUserName;
  }
  async __createAdmin(isTopmost, estateId, userId, adminId) {
    const createdOn = new Date();
    if (
      !isValidMongoObjectId(estateId) ||
      !isValidMongoObjectId(userId) ||
      !isValidMongoObjectId(adminId)
    ) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "You need to provide a valid id",
      });
    }
    if (isNaN(isTopmost)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Invalid topmost specifier",
      });
    }

    const newAdmin = await new Admin({
      status: 1, //0:deleted,1:active
      userId: userId,
      isTopmost,
      createdBy: adminId, // admin ID of the admin who created this entry
      createdOn,
    });

    if (!isValidMongoObject(newAdmin)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Error while creating admin",
      });
    }

    const userEstate = await this.__createUserEstate(newAdmin._id, estateId, 2);

    if (!isValidMongoObject(userEstate)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Error while creating user estate",
      });
    }
    const userMode = await this.__createUserMode(newAdmin._id, estateId, 2);

    if (!isValidMongoObject(userMode)) {
      return userMode;
    }
    return newAdmin;
  }
  async __createSecurity(estateId, adminId) {
    const createdOn = new Date();
    if (!isValidMongoObjectId(estateId) || !isValidMongoObjectId(adminId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "You need to provide a valid id",
      });
    }

    const name = await this.__createName(this.req.body.name, 3);

    if (!isValidMongoObject(name)) {
      return name;
    }
    const email = await this.__createEmail(this.req.body.email, 3, 1, 0);
    if (!isValidMongoObject(email)) {
      return email;
    }
    const phone = await this.__createPhonenumber(this.req.body.phone, 3, 1, 0);

    if (!isValidMongoObject(phone)) {
      return phone;
    }

    const password = await this.__createPassword(this.req.body.password, 3);

    if (!isValidMongoObject(password)) {
      return password;
    }

    const houseAddress = await this.__createHouseAddress(
      this.req.body.houseAddress || "security house",
      3,
      estateId,
      "",
      ""
    );

    if (!isValidMongoObject(houseAddress)) {
      return houseAddress;
    }

    const newSecurity = await new Security({
      status: 1, //0:deleted,1:active
      ownerType: 3,
      estateId,
      createdBy: adminId, // admin ID of the admin who created this entry
      createdOn,
    });

    if (!isValidMongoObject(newSecurity)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Error while creating security",
      });
    }
    if (!isValidMongoObjectId(newSecurity._id)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Error while creating security",
      });
    }
    const userEstate = await this.__createUserEstate(
      newSecurity._id,
      estateId,
      3
    );

    if (!isValidMongoObject(userEstate)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Error while creating user estate",
      });
    }

    const userMode = await this.__createUserMode(newSecurity._id, estateId, 3);

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
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "You didn't provide a valid id",
      });
    }

    const existingTopmostAdmin = await this.__findTopmostAdmin();
    if (isValidMongoObject(existingTopmostAdmin)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Topmost Admin already exist",
      });
    }
    const foundUserPhonenumber = await PhoneNumber.findOne({
      status: 1,
      isPrimary: 1,
      ownerId: userId,
    });

    if (!isValidMongoObject(foundUserPhonenumber)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "phone number not found",
      });
    }
    const foundUserEmail = await Email.findOne({
      status: 1,
      isPrimary: 1,
      ownerId: userId,
    });

    if (!isValidMongoObject(foundUserEmail)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Email not found",
      });
    }
    const foundUserfullName = await Name.findOne({
      status: 1,
      ownerId: userId,
    });

    if (!isValidMongoObject(foundUserfullName)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Name not found ",
      });
    }
    const newAdmin = await new Admin({
      status: 1, //0:deleted,1:active
      userId,
      isTopmost: 1,
      role: topmost,
      createdOn,
    });

    if (!isValidMongoObject(newAdmin)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Error while creating admin",
      });
    }
    const userEstate = await this.__createUserEstate(newAdmin._id, estateId, 1);

    if (!isValidMongoObject(userEstate)) {
      return userEstate;
    }

    const userMode = await this.__createUserMode(newAdmin._id, estateId, 1);

    if (!isValidMongoObject(userMode)) {
      return userMode;
    }
    newAdmin.adminId = newAdmin._id;
    newAdmin.createdBy = newAdmin._id;
    const password = process.env.DEFAULT_TOPMOST_ADMIN_PASSWORD || "";

    if (isNaN(password) || password.length < 4) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Invalid Default password",
      });
    }
    const adminPassword = await this.__createPassword(password, 1);
    if (!isValidMongoObject(adminPassword)) {
      return adminPassword;
    }

    adminPassword.ownerId = newAdmin._id;

    try {
      const updateEmail = await Email.updateOne(
        {
          status: 1,
          isAdmin: 0,
          ownerType: 0,
          isPrimary: 1,
          ownerId: userId,
        },
        {
          $set: { isAdmin: "1", adminId: newAdmin._id },
        }
      );
    } catch (err) {
      console.log(err);
    }
    try {
      const updatePhoneNumber = await PhoneNumber.updateOne(
        {
          status: 1,
          // isAdmin: 0,
          ownerType: 0,
          isPrimary: 1,
          ownerId: userId,
        },
        {
          $set: { isAdmin: "1", adminId: newAdmin._id },
        }
      );
    } catch (err) {
      console.log(err);
    }

    try {
      const updateName = await Name.updateOne(
        {
          status: 1,
          isAdmin: 0,
          ownerType: 0,
          ownerId: userId,
        },
        {
          $set: { isAdmin: "1", adminId: newAdmin._id },
        }
      );
    } catch (err) {
      console.log(err);
    }

    const foundAdminPhonenumber = await PhoneNumber.findOne({
      status: 1,
      isAdmin: 1,
      isPrimary: 1,
      ownerId: userId,
    });

    if (!isValidMongoObject(foundAdminPhonenumber)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Admin phone number not found",
      });
    }
    const foundAdminEmail = await Email.findOne({
      status: 1,
      isAdmin: 1,
      isPrimary: 1,
      ownerId: userId,
    });

    if (!isValidMongoObject(foundAdminEmail)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Admin Email not found",
      });
    }
    const foundAdminfullName = await Name.findOne({
      status: 1,
      ownerId: userId,
    });

    if (!isValidMongoObject(foundAdminfullName)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Admin Name not found",
      });
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

  async __createPhonenumber(phone, type, isPrimary, isAdmin) {
    const createdOn = new Date();
    const phonenumber = phone;
    if (!isValidPhonenumber(phone)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "phonenumber not valid",
      });
    }

    if (isNaN(type) || isNaN(isPrimary)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Invalid type specifier",
      });
    }

    const formattedPhonenumber = formatPhonenumber(phonenumber);
    const existingPhoneneumber = await PhoneNumber.findOne({
      value: formattedPhonenumber[1] || "",
      countryCode: formattedPhonenumber[0] || "",
      ownerType: type,
    });

    if (isValidMongoObject(existingPhoneneumber)) {
      this.res.statusCode = 409;
      return this.res.json({
        success: false,
        message: "phonenumber already exist",
      });
    }

    const newPhonenumber = await new PhoneNumber({
      status: 1, //0:inactive,1:active
      value: formattedPhonenumber[1] || "",
      countryCode: formattedPhonenumber[0] || "",
      isPrimary,
      isAdmin,
      isVerified: false,
      ownerType: type,
      createdOn,
    });

    if (!isValidMongoObject(newPhonenumber)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Error while creating phonenumber",
      });
    }

    return newPhonenumber;
  }
  async __createEmail(email, type, isPrimary, isAdmin) {
    const createdOn = new Date();
    if (!isEmail(email)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "You need to provide a valid email",
      });
    }
    if (isNaN(type) || isNaN(isPrimary)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Invalid type specifier",
      });
    }
    const existingEmail = await Email.findOne({
      value: email,
      ownerType: type,
    });

    if (isValidMongoObject(existingEmail)) {
      this.res.statusCode = 409;
      return this.res.json({
        success: false,
        message: "Email already exist",
      });
    }
    const newUserEmail = await new Email({
      status: 1, //0:inactive,1:active
      value: email,
      isPrimary,
      isAdmin,
      isVerified: false,
      ownerType: type,
      createdOn,
    });

    if (!isValidMongoObject(newUserEmail)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Error while creating email",
      });
    }

    return newUserEmail;
  }
  async __createPassword(password, type) {
    const createdOn = new Date();
    if (!isValidPassword(password)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "You didn't provide a valid password",
      });
    }
    const encrytPassword = await this.__encryptPassword(password);
    const newUserPassword = await new Password({
      status: 1, //0:inactive,1:active
      hashedForm: encrytPassword,
      isPrimary: 1,
      ownerType: type,
      createdOn,
    });

    if (!isValidMongoObject(newUserPassword)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Error while creating password",
      });
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
    if (!!!houseAddress || houseAddress.length < 10) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "You didn't provide a valid address",
      });
    }
    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "You didn't provide a valid estate id",
      });
    }

    const newHouseAddress = await new HouseAddressName({
      status: 1, //0:inactive,1:active
      value: houseAddress,
      ownerType,
      houseOwnerType,
      apartmentType,
      estateId,
      createdOn,
    });

    if (!isValidMongoObject(newHouseAddress)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Error while creating address",
      });
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
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "you need to provide a valid phonenumber",
      });
    }
    const formattedPhonenumber = formatPhonenumber(phone);
    console.log(formattedPhonenumber)
    const existingPhoneneumber = await PhoneNumber.findOne({
      value: formattedPhonenumber[1] || "",
      countryCode: formattedPhonenumber[0] || "",
      // ownerType: type,
      status: 1,
      [!isNaN(isPrimary) ? "isPrimary" : ""]: [
        !isNaN(isPrimary) ? isPrimary : "",
      ],
      [!isNaN(isAdmin) ? "isAdmin" : ""]: [!isNaN(isAdmin) ? isAdmin : ""],
      [!isNaN(ownerId) ? "ownerId" : ""]: [!isNaN(ownerId) ? ownerId : ""],
      [!isNaN(adminId) ? "adminId" : ""]: [!isNaN(adminId) ? adminId : ""],
      // isPrimary:!!isPrimary? isPrimary : "",
      // isAdmin:!!isAdmin? isAdmin : "",
    });

    if (!isValidMongoObject(existingPhoneneumber)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "phonenumber not found",
      });
    }

    return existingPhoneneumber;
  }
  async __initiateUserLogin(estateId) {
    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Invalid estate id",
      });
    }
    const foundEstate = await this.__findEstate(estateId);
    if (!isValidMongoObject(foundEstate)) {
      return foundEstate;
    }

    if (
      !!this.res.user &&
      isValidMongoObject(this.res.user) &&
      !!this.res.user._id &&
      isValidMongoObjectId(this.res.user._id) &&
      stringIsEqual(this.res.user.status, 1)
    ) {
      this.res.statusCode = 409;
      return this.res.json({
        success: false,
        message: "You already have an active session",
      });
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
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Invalid input",
      });
    }

    if (!isValidMongoObjectId(ownerId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Invalid ownerId",
      });
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
      this.res.statusCode = 406;
      return this.res.json({
        success: false,
        message: "invalid user details",
      });
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
      this.res.statusCode = 406;
      return this.res.json({
        success: false,
        message: "sorry you are not a user",
      });
    }

    const userFoundUserFamily = await UserFamily.findOne({
      status: 1,
      estateId,
      ownerId: user._id,
    });
    if (!isValidMongoObject(userFoundUserFamily)) {
      const userFoundUserHouseAddress = await HouseAddressName.findOne({
        status: 1,
        estateId,
        ownerId: user._id,
      });
      if (!isValidMongoObject(userFoundUserHouseAddress)) {
        this.res.statusCode = 404;
        return this.res.json({
          success: false,
          message: "house Address not found",
        });
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

    const userFoundUserNotifications = await UserNotifications.findOne({
      status: 1,
      estateId,
      ownerId: user._id,
    });

    if (!isValidMongoObject(userFoundUserNotifications)) {
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
    // if (!isValidMongoObjectId(estateId)) {
    // this.res.statusCode = 400
    //   return this.res.json({
    //     success: false,
    //     message: "Invalid estate id",
    //   });
    // }
    // const foundEstate = await this.__findEstate(estateId);
    // if (!isValidMongoObject(foundEstate)) {
    //   return foundEstate;
    // }

    if (
      !!this.res.security &&
      isValidMongoObject(this.res.security) &&
      !!this.res.security._id &&
      isValidMongoObjectId(this.res.security._id) &&
      stringIsEqual(this.res.security.status, 1)
    ) {
      this.res.statusCode = 409;
      return this.res.json({
        success: false,
        message: "You already have an active session",
      });
    }
    let ownerId = "";

    if (!!this.req.body.phone) {
      const phone = await this.__findPhonenumber(this.req.body.phone, 3, 1);
      if (!isValidMongoObject(phone)) {
        return phone;
      }
      ownerId = phone.ownerId;
      if (!isValidMongoObjectId(ownerId)) {
        return phone;
      }
    } else if (!!this.req.body.email) {
      const email = await this.__findEmail(this.req.body.email, 3, 1);
      if (!isValidMongoObject(email)) {
        return email;
      }
      ownerId = email.ownerId;
      if (!isValidMongoObjectId(ownerId)) {
        return email;
      }
    } else {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Provide a valid email or phonenumber",
      });
    }

    if (!isValidMongoObjectId(ownerId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Invalid ownerId",
      });
    }

    const password = await this.__findPassword(
      this.req.body.password,
      3,
      ownerId
    );

    if (!isValidMongoObject(password)) {
      return password;
    }
    if (!stringIsEqual(password.ownerId, ownerId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid security details",
      });
    }
    const security = await this.__findSecurity(ownerId, 3);
    if (!isValidMongoObject(security)) {
      this.res.statusCode = 406;
      return this.res.json({
        success: false,
        message: "Invalid security",
      });
    }
    // const userEstate = await this.__findUserEstate(ownerId, estateId);
    // if (!isValidMongoObject(userEstate)) {
    //   return userEstate;
    // }
    const userEstate = await UserEstate.findOne({
      status: 1,
      ownerId,
      ownerType: 3,
    });
    if (!stringIsEqual(userEstate.ownerType, 3)) {
      this.res.statusCode = 406;
      return this.res.json({
        success: false,
        message: "You are not registered under any estate",
      });
    }

    return security;
  }
  async __initiateAdminLogin() {
    // const estateId = this.req.query["estateId"] || "";
    // if (!isValidMongoObjectId(estateId)) {
    // this.res.statusCode = 400
    //   return this.res.json({
    //     success: false,
    //     message: "Invalid estate id",
    //   });
    // }
    // const foundEstate = await this.__findEstate(estateId);

    // if (!isValidMongoObject(foundEstate)) {
    //   return foundEstate;
    // }
    // if (!isValidMongoObjectId(estateId)) {
    // this.res.statusCode = 400
    //   return this.res.json({
    //     success: false,
    //     message: "Invalid estate id",
    //   });
    // }
    // const foundEstate = await this.__findEstate(estateId);
    // if (!isValidMongoObject(foundEstate)) {
    //   return foundEstate;
    // }

    if (
      !!this.res.admin &&
      isValidMongoObject(this.res.admin) &&
      !!this.res.admin._id &&
      isValidMongoObjectId(this.res.admin._id) &&
      stringIsEqual(this.res.admin.status, 1)
    ) {
      this.res.statusCode = 406;
      return this.res.json({
        success: false,
        message: "You already have an active session",
      });
    }
    let adminId = "";
    let ownerId = "";

    if (!!this.req.body.phone) {
      const phone = await this.__findPhonenumber(
        this.req.body.phone,
        0,
        "-",
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
      const email = await this.__findEmail(this.req.body.email, 0, "-", 1);
      if (!isValidMongoObject(email)) {
        return email;
      }
      adminId = email.adminId;
      ownerId = email.ownerId;
      if (!isValidMongoObjectId(adminId)) {
        return email;
      }
    } else {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Invalid input",
      });
    }

    if (!isValidMongoObjectId(adminId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Invalid adminId",
      });
    }
    if (!isValidMongoObjectId(ownerId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Invalid ownerId",
      });
    }

    const admin = await Admin.findOne({
      status: "1",
      userId: ownerId,
      _id: adminId,
    },adminScheama);

    if (!isValidMongoObject(admin)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Admin not found",
      });
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
      this.res.statusCode = 406;
      return this.res.json({
        success: false,
        message: "invalid user details",
      });
    }
    // const userEstate = await this.__findUserEstate(adminId, estateId);
    // if (!isValidMongoObject(userEstate)) {
    //   return userEstate;
    // }
    const existingUserEstate = await UserEstate.findOne({
      status: 1,
      ownerId: adminId,
    });
    if (!isValidMongoObject(existingUserEstate)) {
      this.res.statusCode = 406;
      return this.res.json({
        success: false,
        message: "You are not registered under any estate",
      });
    }
    if (!stringIsEqual(existingUserEstate.ownerType, 1)) {
      this.res.statusCode = 406;
      return this.res.json({
        success: false,
        message: "You are not registered under this estate",
      });
    }
    return admin;
  }

  async __findEstate(estateId) {
    const createdOn = new Date();
    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 400;
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
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Estate not Found ",
      });
    }

    return foundEstate;
  }
  async __findEmail(email, type, isPrimary, isAdmin) {
    const createdOn = new Date();
    if (!isEmail(email)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "You didn't provide a valid email",
      });
    }
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

    const existingEmail = await Email.findOne(
      //   {
      //   value: email,
      //   // ownerType: type,
      //   status: 1,
      //   [!isNaN(isPrimary) ? "isPrimary" : ""]: [
      //     !isNaN(isPrimary) ? isPrimary : "",
      //   ],
      //   [!isNaN(isAdmin) ? "isAdmin" : ""]: !isNaN(isAdmin) ? isAdmin : "",
      // }
      query
    );

    if (!isValidMongoObject(existingEmail)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "email not found",
      });
    }

    return existingEmail;
  }
  async __findUser(ownerId, type) {
    const createdOn = new Date();
    if (!isValidMongoObjectId(ownerId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid user details",
      });
    }
    const existingUser = await User.findOne({
      status: 1,
      _id: ownerId,
      // ownerType: type,
    });

    if (!isValidMongoObject(existingUser)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "user not found",
      });
    }

    return existingUser;
  }
  async __findUserEstate(userId, estateId) {
    const createdOn = new Date();
    if (!isValidMongoObjectId(userId) || !isValidMongoObjectId(estateId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid user details",
      });
    }
    const existingUserEstate = await UserEstate.findOne({
      status: 1,
      ownerId: userId,
      estateId,
    });

    if (!isValidMongoObject(existingUserEstate)) {
      this.res.statusCode = 406;
      return this.res.json({
        success: false,
        message: "user not registered under this estate",
      });
    }

    return existingUserEstate;
  }
  async __findSecurity(ownerId, type) {
    const createdOn = new Date();
    if (!isValidMongoObjectId(ownerId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid Security details",
      });
    }
    const existingSecurity = await Security.findOne({
      status: 1,
      _id: ownerId,
      ownerType: type,
    },{
      _id:1,
      status:1,
      estateId:1,
      "name.value":1,
      "emails.value":1,
      "phoneNumbers.value":1,
      "houseAddress.value":1,
      "phoneNumbers.countryCode":1,
    });

    if (!isValidMongoObject(existingSecurity)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "invalid Security",
      });
    }

    return existingSecurity;
  }
  async __findPassword(password, type, ownerId) {
    const createdOn = new Date();
    if (!isValidPassword(password)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "You didn't provide a valid password",
      });
    }

    const existingPassword = await Password.findOne({
      status: 1, //0:deleted,1:active,
      ownerId,
      // ownerType: type,
    });

    if (!isValidMongoObject(existingPassword)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "password not found",
      });
    }
    if (!isHashedString(password, existingPassword.hashedForm)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: `The password provided is wrong`,
      });
    }

    return existingPassword;
  }
  async __userRegister() {
    const createdOn = new Date();
    // type 0: user
    //       1: admin
    //      2:guest

    const estateId = this.req.query["estateId"] || "";
    const foundEstate = await this.__findEstate(estateId);

    if (!isValidMongoObject(foundEstate)) {
      return foundEstate;
    }

    const name = await this.__createName(this.req.body.name, 0);

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

    const houseOwnerType = this.req.body.houseOwnerType;
    if (!isNaN(houseOwnerType) || houseOwnerType.length < 3) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Invalid house owner type",
      });
    }
    const apartmentType = this.req.body.apartmentType;
    if (!apartmentType || apartmentType.length < 3) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Invalid house apartment Type",
      });
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

    const newUser = await new User({
      status: 1,
      isAdmin: 0,
      isVerified: false,
      type: "e-manager",
    });

    if (!isValidMongoObject(newUser)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Error while creating user",
      });
    }
    if (!isValidMongoObjectId(newUser._id)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Error while creating user",
      });
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

    const userEstateDefaultNotifications = await NotificationScheama.find({
      status: 1,
      estateId: estateId,
      isDefault: 1,
    });
    let userDefaultNotifications = []
    if (
      isValidArrayOfMongoObject(userEstateDefaultNotifications) &&
      userEstateDefaultNotifications.length > 0
    ) {
      userDefaultNotifications = userEstateDefaultNotifications
      userEstateDefaultNotifications.map(async (notification, index) => {
        const particularDefaultNotificationUserLinking =
          await UserNotificationLinking.findOne({
            status: 1,
            contextId: notification._id,
            estateId,
            ownerId: newUser._id,
          });

        if (!isValidMongoObject(particularDefaultNotificationUserLinking)) {
          try {
            const newUserNotificationLinking =
              await new UserNotificationLinking({
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
        }
      });
    }

    const userNotification = await this.__createUserNotification(
      newUser._id,
      estateId
    );

    if (!isValidMongoObject(userNotification)) {
      return userNotification;
    }
    userNotification.notifications =  userDefaultNotifications
    // const newUserMode = await new UserMode({})
    name.ownerId = newUser._id;
    email.ownerId = newUser._id;
    phone.ownerId = newUser._id;
    houseAddress.ownerId = newUser._id;
    password.ownerId = newUser._id;
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
    const formatuserphoneObject =
      !!newUser && !!newUser.phoneNumbers && Array.isArray(newUser.phoneNumbers)
        ? newUser.phoneNumbers.find((phoneNumber) =>
            stringIsEqual(!!phoneNumber.isPrimary && phoneNumber.isPrimary, 1)
          )
        : {};
    const formatuserphone =
      `${formatuserphoneObject.countryCode}` + `${formatuserphoneObject.value}`;

    const formatedUser = {
      name: (newUser.name && newUser.name.value) || "",
      apartmentType: newUser.apartmentType,
      houseOwnerType: newUser.houseOwnerType,
      email:
        !!newUser && !!newUser.emails && Array.isArray(newUser.emails)
          ? newUser.emails.find((email) =>
              stringIsEqual(!!email.isPrimary && email.isPrimary, 1)
            )?.value
          : "",
      phoneNumber: formatuserphone,
      houseAddress:
        !!newUser &&
        !!newUser.houseAddress &&
        Array.isArray(newUser.houseAddress)
          ? newUser.houseAddress.find((houseAddress) =>
              stringIsEqual(estateId, houseAddress.estateId)
            ).value
          : "",
      _id: newUser._id,
    };

    const userUpdates = await this.__refreshUserUpdates(newUser, estateId);

    if (stringIsEqual(typeof userUpdates, "object")) {
      return userUpdates;
    }

    
    const newlyCreatedEmailVerify = await new EmailVerify({
      status: 1,
      value: email.value,
      ownerId: email._id,
      userId: newUser._id,
      ownerType: 0,
      createdOn,
      createdBy: newUser._id,
      expiresOn: new Date(createdOn.getTime() + 900000),
      token: crypto.randomBytes(16).toString('hex')
    });
    if (!isValidMongoObject(newlyCreatedEmailVerify)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Error while creating Email Verification link",
      });
    }

    await newlyCreatedEmailVerify.save();
    const createEmanagerUserWallet = await this.emanagerWallet.__createWallet(
      newUser, 
    );

    if (!isValidMongoObject(createEmanagerUserWallet)) {
      return createEmanagerUserWallet;
    }

    return this.res.json({
      success: true,
      message: "User Created Successfully",
      user: formatedUser,
      token: generateToken(newUser, estateId),
    });
  }
  async __userLogin() {
    const createdOn = new Date();
    if (isValidMongoObject(this.res.user)) {
      this.res.statusCode = 409;
      return this.res.json({
        success: true,
        message: "Already have an active session",
      });
    }
    const estateId = this.req.query["estateId"] || "";
    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Invalid estate id",
      });
    }
    const user = await this.__initiateUserLogin(estateId);
    if (!isValidMongoObject(user)) {
      return user;
    }
    const formatuserphoneObject =
      !!user && !!user.phoneNumbers && Array.isArray(user.phoneNumbers)
        ? user.phoneNumbers.find((phoneNumber) =>
            stringIsEqual(!!phoneNumber.isPrimary && phoneNumber.isPrimary, 1)
          )
        : {};
    const formatuserphone =
      `${formatuserphoneObject.countryCode}` + `${formatuserphoneObject.value}`;
    const formatedUser = {
      name: (user.name && user.name.value) || "",
      apartmentType: user.apartmentType,
      houseOwnerType: user.houseOwnerType,
      email:
        !!user && !!user.emails && Array.isArray(user.emails)
          ? user.emails.find((email) =>
              stringIsEqual(!!email.isPrimary && email.isPrimary, 1)
            )?.value
          : "",
      phoneNumber: formatuserphone,
      houseAddress:
        !!user && !!user.houseAddress && Array.isArray(user.houseAddress)
          ? user.houseAddress.find((houseAddress) =>
              stringIsEqual(estateId, houseAddress.estateId)
            )?.value || ""
          : "", 
      _id: user._id,
    };
    const userUpdates = await this.__refreshUserUpdates(user, estateId);

    if (stringIsEqual(typeof userUpdates, "object")) {
      return userUpdates;
    }

   
      const emanagerUserWalletlogin = await this.emanagerWallet.__walletLogin(
        user, 
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

  async __refreshUserUpdates(user, estateId) {
    if (!isValidMongoObject(user)) {
      this.res.statusCode = 401;
      return this.res.json({
        success: false,
        message: "Sorry!!...You are not Authorized",
      });
    }
    const { _id: userId } = user;

    if (!isValidMongoObjectId(userId)) {
      this.res.statusCode = 406;
      return this.res.json({
        success: false,
        message: "Sorry!!...Invalid User",
      });
    }

    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 406;
      return this.res.json({
        success: false,
        message: "Sorry!!...Invalid Estate",
      });
    }

    const currentUserNotificationLinkingCount =
      await UserNotificationLinking.countDocuments({
        status: "1",
        ownerId: userId,
        isRead: false,
        estateId,
      });

    if (isNaN(currentUserNotificationLinkingCount)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Sorry!!...Notification count process error",
      });
    }

    this.res.notificationCount = currentUserNotificationLinkingCount;

    if (currentUserNotificationLinkingCount > 0) {
      const currentUserNotificationLinking = await UserNotificationLinking.find(
        {
          status: "1",
          ownerId: userId,
          estateId,
        }
      );

      if (!isValidArrayOfMongoObject(currentUserNotificationLinking)) {
        this.res.statusCode = 500;
        return this.res.json({
          success: false,
          message: "Sorry!!.. error getting user notifications",
        });
      }

      const userNotifications = [];

      const pushUserNotifications = await Promise.all(
        currentUserNotificationLinking.map(
          async (notificationLinking, index) => {
            const contextId = notificationLinking.contextId;
            if (isValidMongoObjectId(contextId)) {
              const notification = await NotificationScheama.findOne({
                status: 1,
                _id: notificationLinking.contextId,
              });
              if (isValidMongoObject(notification)) {
                userNotifications.push(notification);
              }
            }
          }
        )
      );
      try {
        const updateUserNotifications = await UserNotifications.updateOne(
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

    const currentEstateFoodLinkingCount =
      await FoodEstateLinking.countDocuments({
        status: "1",
        estateId,
      });

    if (isNaN(currentEstateFoodLinkingCount)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Sorry!!...Food count process error",
      });
    }

    this.res.foodsCount = currentEstateFoodLinkingCount;

    const currentEstateGoodLinkingCount =
      await GoodEstateLinking.countDocuments({
        status: "1",
        estateId,
      });

    if (isNaN(currentEstateGoodLinkingCount)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Sorry!!...Goods count process error",
      });
    }

    this.res.goodsCount = currentEstateGoodLinkingCount;

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
      await BusinessEstateLinking.countDocuments({
        status: "1",
        estateId,
      });

    if (isNaN(currentEstateBusinessLinkingCount)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Sorry!!...Business count process error",
      });
    }

    this.res.businessCount = currentEstateBusinessLinkingCount;

    const currentEstatePropertyLinkingCount =
      await PropertyEstateLinking.countDocuments({
        status: "1",
        estateId,
      });

    if (isNaN(currentEstatePropertyLinkingCount)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Sorry!!...Property count process error",
      });
    }

    this.res.propertyCount = currentEstatePropertyLinkingCount;

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
      return this.res.json({
        success: true,
        message: "Already have an active session",
      });
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
  async __findAdmin(adminId, estateId) {
    const createdOn = new Date();
    if (!isValidMongoObjectId(adminId) || !isValidMongoObjectId(adminId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid admin details",
      });
    }

    const existingAdmin = await Admin.findOne({
      status: 1,
      _id: adminId,
      estateId,
    },adminScheama);

    if (!isValidMongoObject(existingAdmin)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Admin not found!!!",
      });
    }

    return existingAdmin;
  }
  async __findParticularEstateAdmin(adminId, estateId) {
    const createdOn = new Date();
    if (!isValidMongoObjectId(adminId) || !isValidMongoObjectId(estateId)) {
      this.res.statusCode = 406;
      return this.res.json({
        success: false,
        message: "invalid admin details",
      });
    }

    const existingEstateAdmin = await UserEstate.findOne({
      status: 1,
      // estateId,
      ownerId: adminId,
      // ownerType: 1,
    });

    if (!isValidMongoObject(existingEstateAdmin)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Admin not found under this estate!!!",
      });
    }

    return existingEstateAdmin;
  }
  async __findAllParticularEstateAdmins(estateId) {
    const createdOn = new Date();
    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "invalid Estate Id",
      });
    }

    const existingAdmin = await Admin.find({
      status: 1,
      estateId,
    },adminScheama);

    // if (!isValidMongoObject(existingAdmin)) {
    // this.res.statusCode = 404
    //   return this.res.json({
    //     success: false,
    //     message: "Admin not found!!!",
    //   });
    // }
    if (!Array.isArray(existingAdmin) || existingAdmin.length < 1) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Admin not found!!!",
      });
    }
    return existingAdmin;
  }
  async __checkExistingAdmin(ownerId, estateId) {
    const createdOn = new Date();

    const existingAdmin = await Admin.findOne({
      status: 1,
      userId: ownerId,
      estateId,
    },adminScheama);

    return existingAdmin;
  }

  async __checkExistingAdminWithRole(estateId, role) {
    const createdOn = new Date();
    if (role.length<3) {
      return;
    }

    const existingAdmin = await Admin.findOne({
      status: 1,
      estateId,
      role,
    },adminScheama);

    return existingAdmin;
  }
  async __findTopmostAdmin() {
    const createdOn = new Date();

    const existingTopmostAdmin = await Admin.findOne({
      status: 1,
      isTopmost: 1,
    },adminScheama);

    if (!isValidMongoObject(existingTopmostAdmin)) {
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
        const updateAdminOfficeAddress = await AdminOfficeAddress.findOneAndUpdate(
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
        const updateAdminOfficePhoneNumber = await AdminOfficePhoneNumber.findOneAndUpdate(
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
        const updateAdminGuarantorsName = await AdminGuarantorsName.findOneAndUpdate(
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
        const updateAdminGuarantorsEmail = await AdminGuarantorsEmail.findOneAndUpdate(
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
        const updateAdminGuarantorsPhoneNumber = await AdminGuarantorsPhoneNumber.findOneAndUpdate(
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
    try {
      const updatableAdmin = await Admin.updateOne(
        {
          _id: ownerId,
          status: 1,
          ownerType: type,
        },
        {
          $set: adminDetails,
          $push: adminUpdatablePush,
        }
      );
    } catch (error) {
      console.log(error);
    }

    return true
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

    if (!isValidMongoObjectId(userId) || !isValidMongoObjectId(estateId)) {
      return this.res.json({
        success: true,
        message: "invalid id",
      });
    }
    if (isNaN(ownerType)) {
      return this.res.json({
        success: true,
        message: "invalid owner type",
      });
    }
    const query = { status: 1, ownerId: userId, estateId, ownerType };

    if (isValidMongoObjectId(createdBy)) {
      query.createdBy = createdBy;
    }
    const newUserEstate = await new UserEstate(query);

    if (!isValidMongoObject(newUserEstate)) {
      return this.res.json({
        success: true,
        message: "error while creating user estate",
      });
    }

    return newUserEstate;
  }
  async __createUserMode(userId, estateId, ownerType, createdBy) {
    const createdOn = new Date();

    if (!isValidMongoObjectId(userId) || !isValidMongoObjectId(estateId)) {
      return this.res.json({
        success: true,
        message: "invalid id",
      });
    }
    if (isNaN(ownerType)) {
      return this.res.json({
        success: true,
        message: "invalid owner type",
      });
    }

    const query = { status: 1, userId, estateId, mode: 0, ownerType };

    if (isValidMongoObjectId(createdBy)) {
      query.createdBy = createdBy;
    }
    const newUserMode = await new UserMode(query);

    if (!isValidMongoObject(newUserMode)) {
      return this.res.json({
        success: true,
        message: "error while creating user mode",
      });
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

    if (
      !isValidMongoObjectId(userId) ||
      !isValidMongoObjectId(estateId) ||
      !isValidMongoObjectId(houseAddressId)
    ) {
      return this.res.json({
        success: true,
        message: "invalid id",
      });
    }
    if (isNaN(ownerType)) {
      return this.res.json({
        success: true,
        message: "invalid owner type",
      });
    }
    // if (isNaN(isHouseOwner)) {
    //   return this.res.json({
    //     success: true,
    //     message: "invalid house owner type",
    //   });
    // }
    if (!relationship || relationship.length < 3) {
      return this.res.json({
        success: true,
        message: "invalid ouse owner relationship ",
      });
    }
    const newUserFamily = await new UserFamily({
      status: 1,
      ownerId: userId,
      estateId,
      mode: 0,
      ownerType,
      houseAddressId,
      isHouseOwner, //0:not house owner,1:house owner
      relationship,
    });

    if (!isValidMongoObject(newUserFamily)) {
      return this.res.json({
        success: true,
        message: "error while creating user Family",
      });
    }

    return newUserFamily;
  }

  async __createUserNotification(userId, estateId) {
    const createdOn = new Date();

    if (!isValidMongoObjectId(userId) || !isValidMongoObjectId(estateId)) {
      return this.res.json({
        success: true,
        message: "invalid id",
      });
    }

    const newUserNotification = await new UserNotifications({
      status: 1,
      ownerId: userId,
      estateId,
      unread: 0,
      total: 0,
      notifications: [],
      createdOn,
    });
    if (!isValidMongoObject(newUserNotification)) {
      return this.res.json({
        success: true,
        message: "error while creating User Notifications",
      });
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
