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
const User = require("../../model/user"); 
const Security = require("../../model/security");
const UserEstate = require("../../model/user-estate"); 
const Wallet = require("../QpayWallet/QpayWallet"); 
const EmanagerWallet = require("../EmanagerWallet/EmanagerWallet");
const RegisteredEstate = require("../../model/registered-estate");
const { generateToken,generateTokenAdmin } = require("../../utils/tokenGenerator");
const scheamaTools = require("../../helpers/scheamaTools");
const responseBody = require("../../helpers/responseBody");
class PortalAuthentication {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.wallet = new Wallet(this.req, this.res);
    this.emanagerWallet = new EmanagerWallet(this.req, this.res);

  }

  async __createName(name, type, isAdmin) {
    const createdOn = new Date();
    if (!isValidFullName(name)) {
      this.res.statusCode = 400
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
      this.res.statusCode = 500
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
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "You didn't provide a valid id 1",
      });
    }
    if (isNaN(isTopmost)) {
      this.res.statusCode = 400
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
      this.res.statusCode = 500
      return this.res.json({
        success: false,
        message: "Error while creating admin",
      });
    }

    const userEstate = await this.__createUserEstate(newAdmin._id, estateId, 2);

    if (!isValidMongoObject(userEstate)) {
      this.res.statusCode = 500
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
 
  async __createPhonenumber(phone, type, isPrimary, isAdmin) {
    const createdOn = new Date();
    const phonenumber = phone;
    if (!isValidPhonenumber(phone)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "phonenumber not valid",
      });
    }

    if (isNaN(type) || isNaN(isPrimary)) {
      this.res.statusCode = 400
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
      this.res.statusCode = 406
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
      ownerType: type,
      createdOn,
    });

    if (!isValidMongoObject(newPhonenumber)) {
      this.res.statusCode = 500
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
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "You need to provide a valid email",
      });
    }
    if (isNaN(type) || isNaN(isPrimary)) {
      this.res.statusCode = 400
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
      this.res.statusCode = 406
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
      this.res.statusCode = 500
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
      this.res.statusCode = 400
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
      this.res.statusCode = 500
      return this.res.json({
        success: false,
        message: "Error while creating password",
      });
    }

    return newUserPassword;
  } 
  async __encryptPassword(password) {
    const createdOn = new Date();
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
  async __findPhonenumber(phone, type, isPrimary, isAdmin, ownerId, adminId) {
    const createdOn = new Date();
    if (!isValidPhonenumber(phone)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "phonenumber not valid",
      });
    }
    const formattedPhonenumber = formatPhonenumber(phone);
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
      this.res.statusCode = 404
      return this.res.json({
        success: false,
        message: "phonenumber not found",
      });
    }

    return existingPhoneneumber;
  } 
  async __initiatePortalUserLogin() {
   
    if (
      !!this.res.user &&
      isValidMongoObject(this.res.user) &&
      !!this.res.user._id &&
      isValidMongoObjectId(this.res.user._id) &&
      stringIsEqual(this.res.user.status, 1)
    ) {
      this.res.statusCode = 409
      return this.res.json({
        success: false,
        message: "You already have an active session",
      });
    }
    let ownerId = "";

    if (!!this.req.body.phone) {
      const phone = await this.__findPhonenumber(this.req.body.phone, "-", 1);
      if (!isValidMongoObject(phone)) {
        return phone;
      }
      ownerId = phone.ownerId;
      if (!isValidMongoObjectId(ownerId)) {
        return phone;
      }
    } else if (!!this.req.body.email) {
      const email = await this.__findEmail(this.req.body.email, "-", 1);
      if (!isValidMongoObject(email)) {
        return email;
      }
      ownerId = email.ownerId;
      if (!isValidMongoObjectId(ownerId)) {
        return email;
      }
    } else {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Invalid input",
      });
    }

    if (!isValidMongoObjectId(ownerId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "Invalid ownerId",
      });
    }

    const password = await this.__findPassword(
      this.req.body.password,
      "-",
      ownerId
    );

    if (!isValidMongoObject(password)) {
      return password;
    }
    if (!stringIsEqual(password.ownerId, ownerId)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "invalid user details",
      });
    }
    const user = await this.__findUser(ownerId, 0);

    if (!isValidMongoObject(user)) {
      return user;
    }
    
    return user;
  } 
  
  async __findEmail(email, type, isPrimary, isAdmin) {
    const createdOn = new Date();
    if (!isEmail(email)) {
      this.res.statusCode = 400
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
      this.res.statusCode = 400
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
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "invalid user details",
      });
    }
    const existingUser = await User.findOne({
      status: 1,
      _id: ownerId,
      // ownerType: type,
    },
    
    );
       
    const emanagerUserWalletlogin = await this.emanagerWallet.__walletLogin(
      existingUser, 
    );
    if (!isValidMongoObject(emanagerUserWalletlogin)) {
      return emanagerUserWalletlogin;
    }
    if (!isValidMongoObject(existingUser)) {
      this.res.statusCode = 406
      return this.res.json({
        success: false,
        message: "user not found",
      });
    }

    return existingUser;
  }  
  async __findPassword(password, type, ownerId) {
    const createdOn = new Date();
    if (!isValidPassword(password)) {
      this.res.statusCode = 400
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
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: "password not found",
      });
    }
    if (!isHashedString(password, existingPassword.hashedForm)) {
      this.res.statusCode = 400
      return this.res.json({
        success: false,
        message: `The password provided is wrong`,
      });
    }

    return existingPassword;
  }
  async __portalUserRegister() {
    const createdOn = new Date();
    // type 0: user
    //       1: admin
    //      2:guest
    const firstName = this.req.body.firstname|| ""
    const lastName = this.req.body.lastname|| ""

    if( firstName.length < 3) {
      return this.res.json({
        success:false,
        message: "provide a valid first name"
      })
    }
    if( lastName.length < 3) {
      return this.res.json({
        success:false,
        message: "provide a valid last name"
      })
    }
    const fullName = firstName+ " " + lastName
    const name = await this.__createName(fullName, 7);

    if (!isValidMongoObject(name)) {
      return name;
    }
    const email = await this.__createEmail(this.req.body.email, 7, 1, 0);
    if (!isValidMongoObject(email)) {
      return email;
    }
    const phone = await this.__createPhonenumber(this.req.body.phone, 7, 1, 0);

    if (!isValidMongoObject(phone)) {
      return phone;
    }

    const password = await this.__createPassword(this.req.body.password, 7);

    if (!isValidMongoObject(password)) {
      return password;
    }

    const newUser = await new User({
      status: 1,
      isAdmin:0,
      fromPortal: true,
      isVerified:false,
      type:"web-portal"
    });

    if (!isValidMongoObject(newUser)) {
      this.res.statusCode = 500
      return this.res.json({
        success: false,
        message: "Error while creating user",
      });
    }

    const newlyCreatedEmailVerify = await this.__verifyEmail(email, newUser);
    if (!isValidMongoObject(newlyCreatedEmailVerify)) {
      return newlyCreatedEmailVerify;
    }
    // const newUserMode = await new UserMode({})
    name.ownerId = newUser._id;
    email.ownerId = newUser._id;
    phone.ownerId = newUser._id; 
    password.ownerId = newUser._id;
    await newlyCreatedEmailVerify.save();
    await name.save();
    await email.save();
    await phone.save();
    await password.save();
    newUser.name = name;
    newUser.emails = email;
    newUser.phoneNumbers = phone;



   const formatOutputPhone =  
      !!newUser &&
      !!newUser.phoneNumbers &&
      Array.isArray(newUser.phoneNumbers)
        ? newUser.phoneNumbers.find((phoneNumber) =>
            stringIsEqual(!!phoneNumber.isPrimary && phoneNumber.isPrimary, 1)
          )
        : {}
    await newUser.save(); 
    const formatedUser = {
      name: (newUser.name && newUser.name.value) || "",
      apartmentType: newUser.apartmentType,
      houseOwnerType: newUser.houseOwnerType,
      isAdmin: newUser.isAdmin,
      admin: newUser.admin,
      email:
        !!newUser && !!newUser.emails && Array.isArray(newUser.emails)
          ? newUser.emails.find((email) =>
              stringIsEqual(!!email.isPrimary && email.isPrimary, 1)
            )?.value
          : "",
      phoneNumber:{
        value: formatOutputPhone?.value,
        countryCode: formatOutputPhone?.countryCode
      },
      _id: newUser._id,
    };
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
      token: generateToken(newUser),
    });
  }
  
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
  async __portalUserLogin() {
    const createdOn = new Date();
    if (isValidMongoObject(this.res.user)) {
      return this.res.json({
        success: true,
        message: "Already have an active session",
      });
    }
 
    const user = await this.__initiatePortalUserLogin();
    if (!isValidMongoObject(user)) {
      return user;
    }
    const formatedUser = {
      name: (user.name && user.name.value) || "", 
      isAdmin: user.isAdmin, 
      admin: user.admin,
      email:
        !!user && !!user.emails && Array.isArray(user.emails)
          ? user.emails.find((email) =>
              stringIsEqual(!!email.isPrimary && email.isPrimary, 1)
            )?.value
          : "",
      phoneNumber:
        !!user && !!user.phoneNumbers && Array.isArray(user.phoneNumbers)
          ? user.phoneNumbers.find((phoneNumber) =>
              stringIsEqual(!!phoneNumber.isPrimary && phoneNumber.isPrimary, 1)
            )?.value
          : "",
       
      //  user.houseAddress.value
      _id: user._id,
    }; 
    const emanagerUserWalletlogin = await this.emanagerWallet.__walletLogin(
      user, 
    );
    if (!isValidMongoObject(emanagerUserWalletlogin)) {
      return emanagerUserWalletlogin;
    }

if(stringIsEqual(user.isAdmin, "1")){ 
  const existingAdminUserEstate = await UserEstate.findOne({
    status: 1,
    ownerId: user.admin[0]?._id,
  });
  if (!isValidMongoObject(existingAdminUserEstate)) {
    this.res.statusCode = 404
    return this.res.json({
      success: false,
      message: "admin user estate not found",
    });
  }
  const existingRegisteredEstate = await RegisteredEstate.findOne({
    status: 1,
    _id: existingAdminUserEstate.estateId,
  });
  if (!isValidMongoObject(existingRegisteredEstate)) {
    this.res.statusCode = 404
    return this.res.json({
      success: false,
      message: " estate not found",
    });
  }

  


    const emanagerUserWalletlogin = await this.emanagerWallet.__estateWalletLogin(
      existingRegisteredEstate,user.admin[0] 
    );
    if (!isValidMongoObject(emanagerUserWalletlogin)) {
      return emanagerUserWalletlogin;
    }}
    console.log("emanagerUserWalletlogin",emanagerUserWalletlogin)
    return this.res.json({
      success: true,
      message: "User Login Successfully",
      user: formatedUser,
      token: generateToken(user),
    });
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
      ownerId: admin._id,
    });
    if (!isValidMongoObject(existingUserEstate)) {
      this.res.statusCode = 404
      return this.res.json({
        success: false,
        message: "user estate not found",
      });
    }

    const existingRegisteredEstate = await RegisteredEstate.findOne({
      status: 1,
      _id: existingUserEstate.estateId,
    });
    if (!isValidMongoObject(existingRegisteredEstate)) {
      this.res.statusCode = 404
      return this.res.json({
        success: false,
        message: " estate not found",
      });
    }

    const estateId = existingRegisteredEstate._id;


    const emanagerUserWalletlogin = await this.emanagerWallet.__estateWalletLogin(
      existingRegisteredEstate,admin 
    );
    if (!isValidMongoObject(emanagerUserWalletlogin)) {
      return emanagerUserWalletlogin;
    }
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
      this.res.statusCode = 406
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
module.exports = PortalAuthentication;
