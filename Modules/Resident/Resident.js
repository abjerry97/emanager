let moment = require('moment')
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
const Candidate = require("../../model/candidate");
const Email = require("../../model/email");
const HouseAddressName = require("../../model/house-address");
const Name = require("../../model/name");
const Password = require("../../model/password");
const PhoneNumber = require("../../model/phone-number");
const RegisteredEstate = require("../../model/registered-estate");
const User = require("../../model/user");
const UserEstate = require("../../model/user-estate");
const UserFamily = require("../../model/user-family");
const UserMode = require("../../model/user-mode");
const Votes = require("../../model/votes");
const { generateToken } = require("../../utils/tokenGenerator");

const Authentication = require("../Authentication/auth");

class Resident extends Authentication {
  constructor(req, res, next) {
    super();
    this.req = req;
    this.res = res;
    this.next = next;
  }
  async __toggleTravelMode() {
    const createdOn = new Date();
    // validate request
    const mode = this.req.query["mode"] || "";

    if (!stringIsEqual(mode, "off") && !stringIsEqual(mode, "on")) {
      return this.res.json({
        success: false,
        message: "Invalid mode specifier",
      });
    }
    const userId = (this.res.user && this.res.user._id) || "";
    const { _id: estateId } = this.res.estate || "";

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

    const foundUserMode = await UserMode.findOne({
      status: 1,
      userId,
      estateId,
    });
    if (!isValidMongoObject(foundUserMode)) {
      return this.res.json({
        success: false,
        message: "error getting mode",
      });
    }
    //0:avaliable,1:travel
    if (stringIsEqual(mode, "off") && stringIsEqual(foundUserMode.mode, 0)) {
      return this.res.json({
        success: true,
        message: "mode is already off",
      });
    } else if (
      stringIsEqual(mode, "off") &&
      stringIsEqual(foundUserMode.mode, 1)
    ) {
      try {
        const updateUserMode = await UserMode.updateOne(
          {
            status: 1,
            userId,
            estateId,
          },
          {
            $set: { mode: "0" },
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
    if (stringIsEqual(mode, "on") && stringIsEqual(foundUserMode.mode, 1)) {
      return this.res.json({
        success: true,
        message: "travel mode is already on",
      });
    } else if (
      stringIsEqual(mode, "on") &&
      stringIsEqual(foundUserMode.mode, 0)
    ) {
      try {
        const updateUserMode = await UserMode.updateOne(
          {
            status: 1,
            userId,
            estateId,
          },
          {
            $set: { mode: "1" },
          }
        );
      } catch (err) {
        console.log(err);
      }
    }

    return this.res.json({
      success: true,
      message: "Mode modified Succesfully",
    });
  }
  async __getTravelMode() {
    const createdOn = new Date();
    // validate request

    const userId = (this.res.user && this.res.user._id) || "";
    const { _id: estateId } = this.res.estate || "";
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

    const foundUserMode = await UserMode.findOne({
      status: 1,
      userId,
      estateId,
    });
    if (!isValidMongoObject(foundUserMode)) {
      return this.res.json({
        success: false,
        message: "error getting mode",
      });
    }
    //0:avaliable,1:travel

    return this.res.json({
      success: true,
      message: "Mode gotten Succesfully",
      mode: foundUserMode,
    });
  }
  async __getCurrentEstate() {
    const createdOn = new Date();
    // validate request

    const userId = (this.res.user && this.res.user._id) || "";
    const { _id: estateId } = this.res.estate || "";
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

    const foundEstate= await RegisteredEstate.findOne({
      status: 1, 
      id: estateId,
    });
    if (!isValidMongoObject(foundEstate)) {
      return this.res.json({
        success: false,
        message: "error getting Estate",
      });
    }
    //0:avaliable,1:travel

    return this.res.json({
      success: true,
      message: "Current Estate Gotten Succesfully",
      estate:foundEstate 
    });
  }

 
  async __editUserProfile() {
    const createdOn = new Date();
    // validate request
    const user = this.res.user || {};
    const { _id: userId = "" } = user;
    if (!isValidMongoObject(user)) {
      return this.res.json({
        success: false,
        message: "user not found!!!",
      });
    }
    const { _id: estateId } = this.res.estate || "";

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

    const newUserFullName = this.req.body.name || "";
    const newUserPhonenumber = this.req.body.phone || "";
    // const newApartmentType = this.req.body.apartmentType || "";
    // const newHouseOwnerType = this.req.body.houseOwnerType || "";
    const newUserEmail = this.req.body.email || "";
    // const newUserPasscode = this.req.body.password || "";

    // if (!newApartmentType || newApartmentType.length < 5) {
    //   return this.res.json({
    //     success: false,
    //     message: "Invalid house apartment Type",
    //   });
    // }
    // if (isNaN(newHouseOwnerType)) {
    //   return this.res.json({
    //     success: false,
    //     message: "Invalid house owner type",
    //   });
    // }

    // // if (newAddress.length < 5) {
    // //   return this.res.json({
    // //     success: false,
    // //     message: "Invalid house address",
    // //   });
    // // }

    // const userHouseAddress = Array.isArray(user.houseAddress)
    //   ? user.houseAddress.find((houseAddress) =>
    //       stringIsEqual(estateId, houseAddress.estateId)
    //     )
    //   : {};

    // if (isValidMongoObject(userHouseAddress)) {
    //   const updateHouseAddress = HouseAddressName.updateOne(
    //     {
    //       status: 1,
    //       _id: userHouseAddress?._id,
    //       ownerId: user._id,
    //       estateId,
    //     },
    //     {
    //       $set: {
    //         houseOwnerType: newHouseOwnerType, //tenant: 0 landlord:1
    //         apartmentType: newApartmentType,
    //       },
    //     }
    //   );
    // }

    const userUpdatableSet = {};
    if (!isEmail(newUserEmail)) {
      return this.res.json({
        success: false,
        message: "invalid email",
      });
    }
    if (newUserFullName.length < 3) {
      return this.res.json({
        success: false,
        message: "You need to provide a valid fullname",
      });
    }
    // if (!isValidPassword(newUserPasscode)) {
    //   return this.res.json({
    //     success: false,
    //     message: "You need to provide a valid password",
    //   });
    // }
    // if ( newUserPasscode.length<4 ) {
    //   return this.res.json({
    //     success: false,
    //     message: "You need to Provide a valid password or enter your current password",
    //   });
    // }
    if (!isValidPhonenumber(newUserPhonenumber)) {
      return this.res.json({
        success: false,
        message: "You need to provide a valid phonenumber",
      });
    }
    const formattedNewUserPhonenumber = formatPhonenumber(newUserPhonenumber);
    const foundEmail = await Email.findOne({
      value: newUserEmail,
      status: 1,
    });

    if (isValidMongoObject(foundEmail)) {
      const foundEmailOwnerId = foundEmail.ownerId || "";

      if (!stringIsEqual(foundEmailOwnerId, userId)) {
        return this.res.json({
          success: false,
          message: "email already belongs to another user",
        });
      }

      if (!stringIsEqual(foundEmail.isPrimary, 1)) {
        try {
          const updateEmail = await Email.updateOne(
            {
              status: 1,
              ownerId: foundEmailOwnerId,
              value: foundEmail.value,
            },
            {
              $set: { isPrimary: "1" },
            }
          );
        } catch (err) {
          console.log(err);
        }
        try {
          const updateExistingUserEmail = await Email.updateMany(
            {
              status: 1,
              ownerId: foundEmailOwnerId,
              value: { $ne: foundEmail.value },
              ownerType: user.ownerType,
            },
            {
              $set: { isPrimary: 0 },
            }
          );
        } catch (err) {
          console.log(err);
        }
      }

      const allUserEmails = await Email.find({
        status: 1,
        ownerId: foundEmailOwnerId,
      });

      if (!isValidArrayOfMongoObject(allUserEmails)) {
        return this.res.json({
          success: true,
          message: "user Emails not found",
        });
      }
      userUpdatableSet.emails = allUserEmails;
    } else {
      const newlyCreatedUserEmail = await new Email({
        status: 1,
        value: newUserEmail,
        isPrimary: 1,
        ownerId: userId,
        isAdmin: 0,
        ownerType: user.ownerType,
        createdBy: userId,
        createdOn,
      });
      try {
        const updateExistingUserEmail = await Email.updateMany(
          {
            status: 1,
            ownerType: user.ownerType,
            ownerId: userId,
            value: { $ne: newUserEmail },
          },
          {
            $set: { isPrimary: 0 },
          }
        );
      } catch (err) {
        console.log(err);
      }
      await newlyCreatedUserEmail.save();

      const allUserEmails = await Email.find({
        status: 1,
        ownerId: userId,
      });
      if (!isValidArrayOfMongoObject(allUserEmails)) {
        return this.res.json({
          success: true,
          message: "User Emails not found",
        });
      }
      userUpdatableSet.emails = allUserEmails;
    }

    const foundPhonenumber = await PhoneNumber.findOne({
      status: 1,
      countryCode: formattedNewUserPhonenumber[0],
      value: formattedNewUserPhonenumber[1],
    });

    if (isValidMongoObject(foundPhonenumber)) {
      const foundPhonenumberOwnerId = foundPhonenumber.ownerId || "";

      if (!stringIsEqual(foundPhonenumberOwnerId, userId)) {
        return this.res.json({
          success: false,
          message: "Phonenumber already belongs to another user",
        });
      }

      if (!stringIsEqual(foundPhonenumber.isPrimary, 1)) {
        try {
          const updatePhonenumber = await PhoneNumber.updateOne(
            {
              status: 1,
              ownerId: foundPhonenumberOwnerId,
              value: foundPhonenumber.value,
              countryCode: foundPhonenumber.countryCode,
            },
            {
              $set: { isPrimary: "1" },
            }
          );
        } catch (err) {
          console.log(err);
        }
        try {
          const updateExistingUserPhonenumber = await PhoneNumber.updateMany(
            {
              status: 1,
              ownerId: foundPhonenumberOwnerId,
              value: { $ne: foundPhonenumber.value },
              countryCode: foundPhonenumber.countryCode,
              ownerType: user.ownerType,
            },
            {
              $set: { isPrimary: 0 },
            }
          );
        } catch (err) {
          console.log(err);
        }
      }
      const allUserPhonenumbers = await PhoneNumber.find({
        status: 1,
        ownerId: foundPhonenumberOwnerId,
      });

      if (!isValidArrayOfMongoObject(allUserPhonenumbers)) {
        return this.res.json({
          success: true,
          message: "user Phonenumbers not found",
        });
      }

      userUpdatableSet.phoneNumbers = allUserPhonenumbers;
    } else {
      const newlyCreatedUserPhonenumber = await new PhoneNumber({
        status: 1,
        value: formattedNewUserPhonenumber[1],
        countryCode: formattedNewUserPhonenumber[0],
        isPrimary: 1,
        ownerId: userId,
        isAdmin: 0,
        ownerType: user.ownerType,
        createdBy: userId,
        createdOn,
      });
      try {
        const updateExistingUserPhonenumber = await PhoneNumber.updateMany(
          {
            status: 1,
            ownerType: user.ownerType,
            ownerId: userId,
            value: { $ne: formattedNewUserPhonenumber[1] },
            countryCode: formattedNewUserPhonenumber[0],
          },
          {
            $set: { isPrimary: 0 },
          }
        );
      } catch (err) {
        console.log(err);
      }
      await newlyCreatedUserPhonenumber.save();

      const allUserPhonenumbers = await PhoneNumber.find({
        status: 1,
        ownerId: userId,
      });

      if (!isValidArrayOfMongoObject(allUserPhonenumbers)) {
        return this.res.json({
          success: true,
          message: "User Phonenumbers not found",
        });
      }

      userUpdatableSet.phoneNumbers = allUserPhonenumbers;
    }

    // Phonenumber
    // PhoneNumber
    if (!stringIsEqual(user.name.value, newUserFullName)) {
      const newlyCreatedUserFullname = await new Name({
        status: 1,
        value: newUserFullName,
        ownerId: userId,
        ownerType: user.ownerType,
        createdBy: userId,
        createdOn,
      });
      try {
        const updateExistingUserFullname = await Name.updateMany(
          {
            status: 1,
            ownerType: user.ownerType,
            ownerId: userId,
            value: { $ne: newUserFullName },
          },
          {
            $set: { isPrimary: 0 },
          }
        );
      } catch (err) {
        console.log(err);
      }
      await newlyCreatedUserFullname.save();

      userUpdatableSet.name = newlyCreatedUserFullname;
    }

    try {
      const updateExistingAdmin = await User.updateOne(
        {
          status: 1,
          _id: userId,
        },
        {
          $set: userUpdatableSet,
        }
      );
    } catch (err) {
      console.log(err);
    }

    // const foundPassword = await Password.findOne({
    //   status: 1, //0:deleted,1:active,
    //   ownerId: userId,
    //   // ownerType: type,
    // });

    // if (!isHashedString(newUserPasscode, foundPassword.hashedForm)) {
    //   const newlyCreatedPassword = await this.__createPassword(
    //     newUserPasscode,
    //     user.ownerType
    //   );

    //   newlyCreatedPassword.ownerId = userId;

    //   newlyCreatedPassword.save();
    //   try {
    //     const updateExistingUserEmail = await Password.updateMany(
    //       {
    //         status: 1,
    //         ownerId: userId,
    //         _id: { $ne: newlyCreatedPassword._id },
    //       },
    //       {
    //         $set: { status: 0 },
    //       }
    //     );
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }

    const updatedUser = await User.findOne({ status: 1, _id: userId });

    if (!isValidMongoObject(updatedUser)) {
      return this.res.json({
        success: false,
        message: "updated user not found!!!",
      });
    }

    const formatedUser = {
      name: (updatedUser.name && updatedUser.name.value) || "",
      apartmentType: updatedUser.apartmentType,
      houseOwnerType: updatedUser.houseOwnerType,
      email:
        !!updatedUser &&
          !!updatedUser.emails &&
          Array.isArray(updatedUser.emails)
          ? updatedUser.emails.find((email) =>
            stringIsEqual(!!email.isPrimary && email.isPrimary, 1)
          )?.value
          : "",
      phoneNumber:
        !!updatedUser &&
          !!updatedUser.phoneNumbers &&
          Array.isArray(updatedUser.phoneNumbers)
          ? updatedUser.phoneNumbers.find((phoneNumber) =>
            stringIsEqual(!!phoneNumber.isPrimary && phoneNumber.isPrimary, 1)
          )?.value
          : "",
      houseAddress:
        !!updatedUser &&
          !!updatedUser.houseAddress &&
          Array.isArray(updatedUser.houseAddress)
          ? updatedUser.houseAddress.find((houseAddress) =>
            stringIsEqual(estateId, houseAddress.estateId)
          )?.value
          : "",

      //  user.houseAddress.value
      _id: updatedUser._id,
    };

    return this.res.json({
      success: true,
      message: "Profile updated Succesfully",
      user: formatedUser,
    });
  }
  async __createFamilyMember() {
    const createdOn = new Date();
    // validate request

    const userId = (this.res.user && this.res.user._id) || "";
    const user = this.res.user || {};

    const { _id: estateId } = this.res.estate || "";
    if (!isValidMongoObject(user)) {
      return this.res.json({
        success: false,
        message: "Invalid user",
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

    const newUserFamilyMemberFullName = this.req.body.name || "";
    const newUserFamilyMemberPhonenumber = this.req.body.phone || "";
    const newUserFamilyMemberEmail = this.req.body.email || "";
    const newUserFamilyMemberRelationship = this.req.body.relationship || "";
    const newUserFamilyMemberPasscode = this.req.body.password || "1111";
    const fromDate = (moment(this.req.body.from, 'YYYY-MM-DD', true).isValid()) ?new Date (this.req.body.from) : new Date()
    const toDate = (moment(this.req.body.to, 'YYYY-MM-DD', true).isValid()) ? new Date( this.req.body.to) : null; 

    const isTemporaryUser = !!toDate; 
     
    if (!isEmail(newUserFamilyMemberEmail)) {
      return this.res.json({
        success: false,
        message: "You need to provide a valid email",
      });
    }
    if (!isValidFullName(newUserFamilyMemberFullName)) {
      return this.res.json({
        success: false,
        message: "You need to provide a valid fullname",
      });
    }

    if (!isValidPhonenumber(newUserFamilyMemberPhonenumber)) {
      return this.res.json({
        success: false,
        message: "You need to provide a valid phonenumber",
      });
    }
    const formattedNewUserFamilyMemberPhonenumber = formatPhonenumber(
      newUserFamilyMemberPhonenumber
    );
    if (!isValidPassword(newUserFamilyMemberPasscode)) {
      return this.res.json({
        success: false,
        message: "You need to provide a valid password",
      });
    }
    if (
      !!!newUserFamilyMemberRelationship ||
      newUserFamilyMemberRelationship.length < 3
    ) {
      return this.res.json({
        success: false,
        message: "Invalid specified relationship",
      });
    }

    const foundOwnerHouseAddress = await HouseAddressName.findOne({
      status: 1,
      ownerId: userId,
      estateId,
    });

    if (!isValidMongoObject(foundOwnerHouseAddress)) {
      return this.res.json({
        success: false,
        message: "you dont have a house address",
      });
    }

    let familyMemberEmail = await Email.findOne({
      status: 1,
      value: newUserFamilyMemberEmail,
    });
    let newlyCreatedFamilyMemberEmail = {};
    if (isValidMongoObject(familyMemberEmail)) {
      const foundEmailOwnerHouseAddress = await UserFamily.findOne({
        status: 1,
        ownerId: familyMemberEmail.ownerId,
        houseAddressId: foundOwnerHouseAddress._id,
        estateId,
      });

      if (isValidMongoObject(foundEmailOwnerHouseAddress)) {
        return this.res.json({
          success: false,
          message: "This email already belongs to one of your family members",
        });
      }
    } else {
      newlyCreatedFamilyMemberEmail = await new Email({
        status: 1,
        value: newUserFamilyMemberEmail,
        isPrimary: 1,
        isAdmin: 0,
        ownerType: 0,
        createdBy: userId,
      });

      if (!isValidMongoObject(newlyCreatedFamilyMemberEmail)) {
        return this.res.json({
          success: false,
          message: "Failed to create Email",
        });
      }
    }

    let familyMemberPhoneNumber = await PhoneNumber.findOne({
      status: 1,
      countryCode: formattedNewUserFamilyMemberPhonenumber[0],
      value: formattedNewUserFamilyMemberPhonenumber[1],
    });
    let newlyCreatedFamilyMemberPhoneNumber = {};

    if (isValidMongoObject(familyMemberPhoneNumber)) {
      const foundPhoneNumberOwnerHouseAddress = await UserFamily.findOne({
        status: 1,
        ownerId: familyMemberPhoneNumber.ownerId,
        houseAddressId: foundOwnerHouseAddress._id,
        estateId,
      });

      if (isValidMongoObject(foundPhoneNumberOwnerHouseAddress)) {
        return this.res.json({
          success: false,
          message:
            "This phone number already belongs to one of your family members",
        });
      }
    } else {
      newlyCreatedFamilyMemberPhoneNumber = await new PhoneNumber({
        status: 1,
        value: formattedNewUserFamilyMemberPhonenumber[1],
        countryCode: formattedNewUserFamilyMemberPhonenumber[0],
        isPrimary: 1,
        ownerType: 0,
        isAdmin: 0,
        createdBy: userId,
      });
      if (!isValidMongoObject(newlyCreatedFamilyMemberPhoneNumber)) {
        return this.res.json({
          success: false,
          message: "Failed to create Phonenumber",
        });
      }
    }

    const newlyCreatedFamilyMemberName = await new Name({
      status: 1,
      value: newUserFamilyMemberFullName,
      ownerType: 0,
      createdBy: userId,
    });

    if (!isValidMongoObject(newlyCreatedFamilyMemberName)) {
      return this.res.json({
        success: false,
        message: "Failed to create Name",
      });
    }

    const newlyCreatedFamilyMemberPassword = await this.__createPassword(
      newUserFamilyMemberPasscode,
      0
    );

    if (!isValidMongoObject(newlyCreatedFamilyMemberPassword)) {
      return this.res.json({
        success: false,
        message: "Failed to create Password",
      });
    }

    // check if the email and phone number already belongs to a user and create a new
    // user and family

    if (
      isValidMongoObject(familyMemberPhoneNumber) &&
      isValidMongoObject(familyMemberEmail)
    ) {
      if (
        !stringIsEqual(
          familyMemberPhoneNumber.ownerId,
          familyMemberEmail.ownerId
        )
      ) {
        return this.res.json({
          success: false,
          message: "email and phonenumber does not belong to the same user",
        });
      }
      // if (!isValidMongoObjectId(familyMemberPhoneNumber.ownerId)) {
      //   return this.res.json({
      //     success: false,
      //     message: "invalid owner Id 1",
      //   });
      // }
    }

    // if (
    //   !isValidMongoObject(familyMemberPhoneNumber) &&
    //   isValidMongoObject(familyMemberEmail)
    // ) {
    //   newlyCreatedFamilyMemberEmail.ownerId = familyMemberEmail.ownerId;
    // }

    // if (
    //   isValidMongoObject(familyMemberPhoneNumber) &&
    //   !isValidMongoObject(familyMemberEmail)
    // ) {
    //   newlyCreatedFamilyMemberPhoneNumber.ownerId =
    //     familyMemberPhoneNumber.ownerId;
    // }

    if (
      !isValidMongoObject(familyMemberPhoneNumber) &&
      isValidMongoObject(newlyCreatedFamilyMemberPhoneNumber)
    ) {
      familyMemberPhoneNumber = newlyCreatedFamilyMemberPhoneNumber;
    }
    if (
      !isValidMongoObject(familyMemberEmail) &&
      isValidMongoObject(newlyCreatedFamilyMemberEmail)
    ) {
      familyMemberEmail = newlyCreatedFamilyMemberEmail;
    }

    if (
      !stringIsEqual(familyMemberPhoneNumber.ownerId, familyMemberEmail.ownerId)
    ) {
      return this.res.json({
        success: false,
        message: "email and phonenumber does not belong to the same user",
      });
    }

    let familyMemberUser = {};
    if (isValidMongoObjectId(familyMemberPhoneNumber.ownerId)) {
      familyMemberUser = await User.findOne({
        status: 1,
        _id: familyMemberPhoneNumber.ownerId,
      });
    }

    if (!isValidMongoObject(familyMemberUser)) {
      if (
        isValidMongoObject(familyMemberPhoneNumber) &&
        isValidMongoObject(familyMemberEmail)
      ) {
        const newlyCreatedFamilyMemberUser = await new User({
          status: 1,
          type: "e-manager",
          name: newlyCreatedFamilyMemberName,
          apartmentType: user.apartmentType,
          houseAddress: user.houseAddress,
          joinedOn: createdOn,
          isAdmin: 0,
          createdBy: userId,
          isVerified: "false",
          isFamilyMember: true,
          validTill: toDate,
          isTemporaryUser


        });

        familyMemberUser = newlyCreatedFamilyMemberUser;

        if (isValidMongoObject(newlyCreatedFamilyMemberEmail)) {
          newlyCreatedFamilyMemberEmail.ownerId =
            newlyCreatedFamilyMemberUser._id;

          await newlyCreatedFamilyMemberEmail.save();
        }

        if (isValidMongoObject(newlyCreatedFamilyMemberPhoneNumber)) {
          newlyCreatedFamilyMemberPhoneNumber.ownerId =
            newlyCreatedFamilyMemberUser._id;
          await newlyCreatedFamilyMemberPhoneNumber.save();
        }
        if (isValidMongoObject(newlyCreatedFamilyMemberName)) {
          newlyCreatedFamilyMemberName.ownerId =
            newlyCreatedFamilyMemberUser._id;
          await newlyCreatedFamilyMemberName.save();
        }

        (newlyCreatedFamilyMemberUser.emails = familyMemberEmail),
          (newlyCreatedFamilyMemberUser.phoneNumbers = familyMemberPhoneNumber),
          (newlyCreatedFamilyMemberPassword.ownerId =
            newlyCreatedFamilyMemberUser._id);
        await newlyCreatedFamilyMemberPassword.save();
        await newlyCreatedFamilyMemberUser.save();
      } else {
        return this.res.json({
          success: false,
          message: "Failed to create family member",
        });
      }
    }

    //  else {
    //   return this.res.json({
    //     success: false,
    //     message: "Failed to create family member",
    //   });
    // }

    const newlyCreatedFamilyMemberUserMode = await this.__createUserMode(
      familyMemberUser.id,
      estateId,
      0
    );
    if (!isValidMongoObject(newlyCreatedFamilyMemberUserMode)) {
      return newlyCreatedFamilyMemberUserMode;
    }

    const newlyCreatedFamilyMemberUserEstate = await new UserEstate({
      status: 1,
      ownerId: familyMemberUser.id,
      estateId,
      ownerType: 0, //user:0,admin:1,2:guest,3:security
      createdBy: userId, // user ID of the user who created this entry
      createdOn,
    });

    const newlyCreatedFamilyMemberUserFamily = await new UserFamily({
      status: 1,
      ownerId: familyMemberUser.id,
      estateId,
      ownerType: 0, //user:0,admin:1,2:guest,3:security
      createdBy: userId, // user ID of the user who created this entry
      createdOn,
      relationship: newUserFamilyMemberRelationship,
      houseAddressId: foundOwnerHouseAddress._id,
      fromDate,
      toDate,
      isTemporaryUser
    });

    await newlyCreatedFamilyMemberUserFamily.save();
    await newlyCreatedFamilyMemberUserEstate.save();
    await newlyCreatedFamilyMemberUserMode.save();
    return this.res.json({
      success: true,
      message: "Family Member created Succesfully",
    });
  }
  async __getEstateFamilyMember() {
    const createdOn = new Date();
    // validate request

    const userId = (this.res.user && this.res.user._id) || "";
    const user = this.res.user || {};

    const { _id: estateId } = this.res.estate || "";
    if (!isValidMongoObject(user)) {
      return this.res.json({
        success: false,
        message: "Invalid user",
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
    // const foundOwnerHouseAddress = await HouseAddressName.findOne({
    //   status: 1,
    //   ownerId: userId,
    //   estateId,
    // });

    const foundEstateUserFamily = await UserFamily.find({
      status: 1,
      createdBy: user._id,
      // houseAddressId: foundOwnerHouseAddress._id,
      estateId,
    });

    if (!isValidArrayOfMongoObject(foundEstateUserFamily)) {
      return this.res.json({
        success: true,
        message: "Family members gotten succesfully",
        familyMembers: [],
      });
    }

    const allEstateFamilyUser = await Promise.all(
      (foundEstateUserFamily || []).map(async (userFamily, count) => {
 
        const estateUser = await User.findOne({
          status: 1,
          _id: userFamily.ownerId || "",
        });

        if (isValidMongoObject(estateUser)) {
          
          return {relationship:userFamily.relationship,...estateUser.toObject()};
        }
      })
    );
    return this.res.json({
      success: true,
      message: "Family members gotten succesfully",
      familyMembers: Array.isArray(allEstateFamilyUser)
        ? allEstateFamilyUser
        : [],
    });
  }

  async __voteCandidate() {
    const createdOn = new Date();
    // validate request

    const userId = (this.res.user && this.res.user._id) || "";
    const user = this.res.user || {};

    if (!isValidMongoObject(user)) {
      return this.res.json({
        success: false,
        message: "Invalid user",
      });
    }
    const { _id: estateId } = this.res.estate || "";
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
    const candidateId = this.req.query["candidateId"] || "";
    if (!isValidMongoObjectId(candidateId)) {
      return this.res.json({
        success: false,
        message: "Invalid candidate id",
      });
    }

    const foundCandidate = await Candidate.findOne({
      status: 1,
      estateId,
      _id: candidateId,
    });
    if (!isValidMongoObject(foundCandidate)) {
      return this.res.json({
        success: false,
        message: "Candidate not found",
      });
    }
    const foundCandidateVote = await Votes.findOne({
      status: 1,
      estateId,
      electionId: foundCandidate.electionId,
    });

    if (isValidMongoObject(foundCandidateVote)) {
      return this.res.json({
        success: false,
        message: "You have already voted",
      });
    }

    const newVote = new Votes({
      status: 1,
      candidateName: foundCandidate.name,
      candidateId: foundCandidate._id,
      estateId,
      voterName: user.name.value,
      voterId: user._id,
      type: foundCandidate.type,
      electionId: foundCandidate.electionId,
      createdOn,
    });

    if (!isValidMongoObject(newVote)) {
      return this.res.json({
        success: false,
        message: " Error while creating Vote",
      });
    }

    await newVote.save();

    const allCandidateVotes = await Votes.countDocuments({
      status: "1",
      candidateId: candidateId,
    });

    try {
      const updateCandidate = await Candidate.updateOne(
        {
          status: 1,
          _id: foundCandidate._id,
          estateId,
        },
        {
          $set: { numberOfVotes: allCandidateVotes },
        }
      );
    } catch (err) {
      console.log(err);
    }

    return this.res.json({
      success: true,
      message: "Vote casted Succesfully",
    });
  }

  // not needed for now
  async __editFamilyMember() {
    const createdOn = new Date();
    // validate request
    let { userId: selectedUserId } =
      (this.req.params && this.req.params) || null;
    const userId = (this.res.user && this.res.user._id) || "";
    const user = this.res.user || {};
    if (!isValidMongoObject(user)) {
      return this.res.json({
        success: false,
        message: "user not found!!!",
      });
    }
    const { _id: estateId } = this.res.estate || "";
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

    if (!isValidMongoObjectId(selectedUserId)) {
      return this.res.json({
        success: false,
        message: "Invalid selected user",
      });
    }

    if (
      !stringIsEqual(user.ownerType, 0) ||
      stringIsEqual(userId, selectedUserId)
    ) {
      return this.res.json({
        success: false,
        message: "you are not permitted to make this request!!!",
      });
    }

    const foundSelectedUser = await User.findOne({
      status: 1,
      _id: selectedUserId,
    });

    if (!isValidMongoObject(foundSelectedUser)) {
      return this.res.json({
        success: false,
        message: "user not found!!!",
      });
    }
    const foundSelectedUserEstate = await UserEstate.findOne({
      status: 1,
      ownerId: selectedUserId,
      estateId,
    });

    if (!isValidMongoObject(foundSelectedUserEstate)) {
      return this.res.json({
        success: false,
        message: "you are not permitted to make this request under the estate",
      });
    }

    const newUserFullName = this.req.body.name || "";
    const newUserPhonenumber = this.req.body.phone || "";
    const newUserEmail = this.req.body.email || "";
    const newUserPasscode = this.req.body.passcode || "";

    const selectedUserUpdatableSet = {
      isAdmin: 0,
    };

    if (!isEmail(newUserEmail)) {
      return this.res.json({
        success: false,
        message: "you need to provide a valid email",
      });
    }
    if (!isValidFullName(newUserFullName)) {
      return this.res.json({
        success: false,
        message: "You need to provide a valid fullname",
      });
    }
    if (!isValidPhonenumber(newUserPhonenumber)) {
      return this.res.json({
        success: false,
        message: "You need to provide a valid phonenumber",
      });
    }

    const formattedNewUserPhonenumber = formatPhonenumber(newUserPhonenumber);

    if (!stringIsEqual(foundSelectedUser.name.value, newUserFullName)) {
      const newlyCreatedUserFullname = await new Name({
        status: 1,
        value: newUserFullName,
        ownerId: foundSelectedUser._id,
        ownerType: 0,
        createdBy: userId,
        createdOn,
      });

      selectedUserUpdatableSet.name = newlyCreatedUserFullname;
    }

    const foundEmail = await Email.findOne({
      value: newUserEmail,
      status: 1,
    });

    if (isValidMongoObject(foundEmail)) {
      const foundEmailOwnerId = foundEmail.ownerId || "";

      if (!stringIsEqual(foundEmailOwnerId, selectedUserId)) {
        return this.res.json({
          success: false,
          message: "email already belongs to another user",
        });
      }

      if (!stringIsEqual(foundEmail.isPrimary, 1)) {
        try {
          const updateEmail = await Email.updateOne(
            {
              status: 1,
              ownerId: foundEmailOwnerId,
              value: foundEmail.value,
            },
            {
              $set: { isPrimary: "1" },
            }
          );
        } catch (err) {
          console.log(err);
        }
        try {
          const updateExistingUserEmail = await Email.updateMany(
            {
              status: 1,
              ownerId: foundEmailOwnerId,
              value: { $ne: foundEmail.value },
              ownerType: foundSelectedUser.ownerType,
            },
            {
              $set: { isPrimary: 0 },
            }
          );
        } catch (err) {
          console.log(err);
        }
        const allSelectedUserEmails = await Email.find({
          status: 1,
          ownerId: selectedUserId,
        });

        if (!isValidArrayOfMongoObject(allSelectedUserEmails)) {
          return this.res.json({
            success: true,
            message: "user Emails not found",
          });
        }

        selectedUserUpdatableSet.emails = allSelectedUserEmails;
      }
    } else {
      const newlyCreatedUserEmail = await new Email({
        status: 1,
        value: newUserEmail,
        isPrimary: 1,
        ownerId: selectedUserId,
        ownerType: foundSelectedUser.ownerType,
        createdBy: userId,
        createdOn,
      });
      try {
        const updateExistingUserEmail = await Email.updateMany(
          {
            status: 1,
            ownerType: foundSelectedUser.ownerType,
            ownerId: selectedUserId,
            value: { $ne: newUserEmail },
          },
          {
            $set: { isPrimary: 0 },
          }
        );
      } catch (err) {
        console.log(err);
      }
      await newlyCreatedUserEmail.save();

      const allSelectedUserEmails = await Email.find({
        status: 1,
        ownerId: selectedUserId,
      });

      if (!isValidArrayOfMongoObject(allSelectedUserEmails)) {
        return this.res.json({
          success: true,
          message: "User Emails not found",
        });
      }
      selectedUserUpdatableSet.emails = allSelectedUserEmails;
    }

    const foundPhonenumber = await PhoneNumber.findOne({
      status: 1,
      countryCode: formattedNewUserPhonenumber[0],
      value: formattedNewUserPhonenumber[1],
    });
    if (isValidMongoObject(foundPhonenumber)) {
      const foundPhonenumberOwnerId = foundPhonenumber.ownerId || "";

      if (!stringIsEqual(foundPhonenumberOwnerId, selectedUserId)) {
        return this.res.json({
          success: false,
          message: "phone number  belongs to another user",
        });
      }

      if (!stringIsEqual(foundPhonenumber.isPrimary, 1)) {
        try {
          const updatePhonenumber = await PhoneNumber.updateOne(
            {
              status: 1,
              ownerId: foundPhonenumberOwnerId,
              value: foundPhonenumber.value,
              countryCode: foundPhonenumber.countryCode,
            },
            {
              $set: { isPrimary: "1" },
            }
          );
        } catch (err) {
          console.log(err);
        }
        try {
          const updateExistingUserPhonenumber = await PhoneNumber.updateMany(
            {
              status: 1,
              ownerId: foundPhonenumberOwnerId,
              value: { $ne: foundPhonenumber.value },
              countryCode: foundPhonenumber.countryCode,
              ownerType: foundSelectedUser.ownerType,
            },
            {
              $set: { isPrimary: 0 },
            }
          );
        } catch (err) {
          console.log(err);
        }
        const allSelectedUserPhoneNumbers = await PhoneNumber.find({
          status: 1,
          ownerId: selectedUserId,
        });

        if (!isValidArrayOfMongoObject(allSelectedUserPhoneNumbers)) {
          return this.res.json({
            success: true,
            message: "user Phonenumbers not found",
          });
        }
        selectedUserUpdatableSet.phoneNumbers = allSelectedUserPhoneNumbers;
      }
    } else {
      const newlyCreatedUserPhoneNumber = await new PhoneNumber({
        status: 1,
        value: formattedNewUserPhonenumber[1],
        countryCode: formattedNewUserPhonenumber[0],
        isPrimary: 1,
        ownerId: selectedUserId,
        ownerType: foundSelectedUser.ownerType,
        createdBy: userId,
        createdOn,
      });
      try {
        const updateExistingUserPhoneNumber = await PhoneNumber.updateMany(
          {
            status: 1,
            ownerType: foundSelectedUser.ownerType,
            ownerId: selectedUserId,
            value: { $ne: formattedNewUserPhonenumber[1] },
            countryCode: formattedNewUserPhonenumber[0],
          },
          {
            $set: { isPrimary: 0 },
          }
        );
      } catch (err) {
        console.log(err);
      }
      await newlyCreatedUserPhoneNumber.save();

      const allSelectedUserPhoneNumbers = await PhoneNumber.find({
        status: 1,
        ownerId: selectedUserId,
      });

      if (!isValidArrayOfMongoObject(allSelectedUserPhoneNumbers)) {
        return this.res.json({
          success: true,
          message: "User Phonenumbers not found",
        });
      }

      selectedUserUpdatableSet.phoneNumbers = allSelectedUserPhoneNumbers;
    }
    try {
      const updateExistingAdmin = await User.updateOne(
        {
          status: 1,
          _id: userId,
        },
        {
          $set: selectedUserUpdatableSet,
        }
      );
    } catch (err) {
      console.log(err);
    }

    const foundPassword = await this.__findPassword(
      newUserPasscode,
      user.ownerType,
      userId
    );
    if (!isValidMongoObject(foundPassword)) {
      const newlyCreatedPassword = await this.__createPassword(
        newUserPasscode,
        user.ownerType
      );

      newlyCreatedPassword.ownerId = userId;

      newlyCreatedPassword.save();

      try {
        const updateExistingUserEmail = await Password.updateMany(
          {
            status: 1,
            ownerType: user.ownerType,
            ownerId: userId,
          },
          {
            $set: { status: 0 },
          }
        );
      } catch (err) {
        console.log(err);
      }
    }

    return this.res.json({
      success: true,
      message: "Selected User Updated Succesfully",
      mode: foundUserMode,
    });
  }
  async __deleteFamilyMember() {
    const createdOn = new Date();
    // validate request

    const userId = (this.res.user && this.res.user._id) || "";
    let { userId: selectedUserId } =
      (this.req.params && this.req.params) || null;
    const { _id: estateId } = this.res.estate || "";
    if (!isValidMongoObjectId(userId)) {
      return this.res.json({
        success: false,
        message: "Invalid user",
      });
    }

    const userUpdatableSet = {
      status: 0,
    };
    const userUpdatablePush = {
      updates: {
        by: userId, // admin ID of the admin who made this update
        action: 0, //0:delete,
        timing: createdOn,
      },
    };
    if (!isValidMongoObjectId(estateId)) {
      return this.res.json({
        success: false,
        message: "Invalid estate id",
      });
    }

    if (!isValidMongoObjectId(selectedUserId)) {
      return this.res.json({
        success: false,
        message: "Invalid selected user id",
      });
    }
    const foundUserHouseAddress = await HouseAddressName.findOne({
      status: 1,
      ownerId: userId,
      estateId,
    });

    if (!isValidMongoObject(foundUserHouseAddress)) {
      return this.res.json({
        success: false,
        message: "house address not found",
      });
    }

    try {
      const updateUserFamily = await UserFamily.updateOne(
        {
          status: 1,
          ownerId: userId,
          estateId,
          houseAddressId: foundUserHouseAddress._id,
        },
        {
          $set: userUpdatableSet,
          $push: userUpdatablePush,
        }
      );
    } catch (err) {
      console.log(err);
    }

    try {
      const updateUserFamily = await UserFamily.updateOne(
        {
          status: 1,
          ownerId: userId,
          estateId,
          houseAddressId: foundUserHouseAddress._id,
        },
        {
          $set: userUpdatableSet,
          $push: userUpdatablePush,
        }
      );
    } catch (err) {
      console.log(err);
    }

    try {
      const updateUserFamily = await UserEstate.updateOne(
        {
          status: 1,
          ownerId: userId,
          estateId,
        },
        {
          $set: userUpdatableSet,
          $push: userUpdatablePush,
        }
      );
    } catch (err) {
      console.log(err);
    }

    const foundUserEstate = await UserEstate.findOne({
      status: 1,
      ownerId: userId,
    });

    if (!isValidMongoObject(foundUserEstate)) {
      try {
        const updateUser = await User.updateOne(
          {
            status: 1,
            _id: userId,
          },
          {
            $set: userUpdatableSet,
            $push: userUpdatablePush,
          }
        );
      } catch (err) {
        console.log(err);
      }
      try {
        const updateUserMode = await UserMode.updateOne(
          {
            status: 1,
            ownerId: userId,
            estateId,
          },
          {
            $set: userUpdatableSet,
            $push: userUpdatablePush,
          }
        );
      } catch (err) {
        console.log(err);
      }
      try {
        const updateUserHouseAddress = await HouseAddressName.updateOne(
          {
            status: 1,
            ownerId: userId,
            estateId,
          },
          {
            $set: userUpdatableSet,
            $push: userUpdatablePush,
          }
        );
      } catch (err) {
        console.log(err);
      }

      try {
        const updateUserHouseAddress = await Name.updateOne(
          {
            status: 1,
            ownerId: userId,
          },
          {
            $set: userUpdatableSet,
            $push: userUpdatablePush,
          }
        );
      } catch (err) {
        console.log(err);
      }

      try {
        const updateUserPhoneNumber = await PhoneNumber.updateMany(
          {
            status: 1,
            ownerId: userId,
          },
          {
            $set: userUpdatableSet,
            $push: userUpdatablePush,
          }
        );
      } catch (err) {
        console.log(err);
      }

      try {
        const updateUserEmail = await Email.updateMany(
          {
            status: 1,
            ownerId: userId,
          },
          {
            $set: userUpdatableSet,
            $push: userUpdatablePush,
          }
        );
      } catch (err) {
        console.log(err);
      }
    }

    return this.res.json({
      success: true,
      message: "Family member deleted successfully",
      mode: foundUserMode,
    });
  }
  async __getResidentUpdateCount() {
    const createdOn = new Date();
    // validate request

    const userId = (this.res.user && this.res.user._id) || "";
    const { _id: estateId } = this.res.estate || "";
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

    const updates = {};

    if (!!this.res.notificationCount && !isNaN(this.res.notificationCount)) {
      updates.notificationCount = this.res.notificationCount;
    }
    if (!!this.res.foodsCount && !isNaN(this.res.foodsCount)) {
      updates.foodsCount = this.res.foodsCount;
    }
    if (!!this.res.goodsCount && !isNaN(this.res.goodsCount)) {
      updates.goodsCount = this.res.goodsCount;
    }
    if (!!this.res.servicesCount && !isNaN(this.res.servicesCount)) {
      updates.servicesCount = this.res.servicesCount;
    }
    if (!!this.res.businessCount && !isNaN(this.res.businessCount)) {
      updates.businessCount = this.res.businessCount;
    }

    if (!!this.res.propertyCount && !isNaN(this.res.propertyCount)) {
      updates.propertyCount = this.res.propertyCount;
    }

    if (!!this.res.guestCount && !isNaN(this.res.guestCount)) {
      updates.guestCount = this.res.guestCount;
    }
    if (!!this.res.activeElectionCount && !isNaN(this.res.activeElectionCount)) {
      updates.activeElectionCount = this.res.activeElectionCount;
    }
    // if (!!this.res.walletBalance && !isNaN(this.res.walletBalance)) {
    //   updates.walletBalance = this.res.walletBalance;
    // }
    updates.walletBalance = this.res.walletBalance;

    return this.res.json({
      success: true,
      updates,
    });
  }
  async __getActiveCandidates() {
    const createdOn = new Date();
    const userId = (this.res.user && this.res.user._id) || "";
    const user = this.res.user || "";

    if (!isValidMongoObject(user) || !isValidMongoObjectId(userId)) {
      return this.res.json({
        success: false,
        message: "invalid user",
      });
    }
    const { _id: estateId } = this.res.estate || "";

    if (!isValidMongoObjectId(estateId)) {
      return this.res.json({
        success: false,
        message: "invalid estate id",
      });
    }
    const foundEstate = await super.__findEstate(estateId);
    if (!isValidMongoObject(foundEstate)) {
      return foundEstate;
    }
    const existingCandidates = await Candidate.find({
      status: 1,
      estateId,
    });

    if (!isValidArrayOfMongoObject(existingCandidates)) {
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
  async __getAllUserEstates() {
    const createdOn = new Date();
    const userId = (this.res.user && this.res.user._id) || "";
    const user = this.res.user || "";

    if (!isValidMongoObject(user) || !isValidMongoObjectId(userId)) {
      return this.res.json({
        success: false,
        message: "invalid user",
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
      ownerId: userId,
    });

    if (!isValidArrayOfMongoObject(existingRegisteredEstate)) {
      return this.res.json({
        success: false,
        message: "error finding Registered Estates",
      });
    }

    return this.res.json({
      success: true,
      message: "Existing User Registered Estate gotten Successfully",
      existingRegisteredEstate,
    });
  }
  async __addUserEstates() {
    const createdOn = new Date();
    const userId = (this.res.user && this.res.user._id) || "";
    const user = this.res.user || "";

    if (!isValidMongoObject(user) || !isValidMongoObjectId(userId)) {
      return this.res.json({
        success: false,
        message: "invalid user",
      });
    }
    const { _id: estateId } = this.res.estate || "";

    if (!isValidMongoObjectId(estateId)) {
      return this.res.json({
        success: false,
        message: "invalid estate id",
      });
    }

    const selectedEstateId = this.req.query["estateId"] || "";

    const existingRegisteredEstate = await RegisteredEstate.findOne({
      status: 1,
      _id: selectedEstateId,
    });

    if (!isValidMongoObject(existingRegisteredEstate)) {
      return this.res.json({
        success: false,
        message: "Selected Estate does not exist",
      });
    }

    const newUserAddress = this.req.body.address || "";
    const houseOwnerType = this.req.body.houseOwnerType;
    const apartmentType = this.req.body.apartmentType;
    if (!apartmentType || apartmentType.length < 5) {
      return this.res.json({
        success: false,
        message: "Invalid house apartment Type",
      });
    }
    if (!isNaN(houseOwnerType) || houseOwnerType.length < 3) {
      return this.res.json({
        success: false,
        message: "Provide a  valid house owner type e.g landlord, tenant",
      });
    }
    if (newUserAddress.length < 3) {
      return this.res.json({
        success: false,
        message: "Provide a valid Address",
      });
    }

    const newHouseAddress = await this.__createHouseAddress(
      newUserAddress,
      user.ownerType,
      selectedEstateId,
      houseOwnerType,
      apartmentType
    );

    if (!sValidMongoObject(newHouseAddress)) {
      return newHouseAddress;
    }

    newHouseAddress.ownerId = userId;
    const existingUserRegisteredEstate = await UserEstate.findOne({
      status: 1,
      estateId: selectedEstateId,
      ownerId: userId,
    });

    if (isValidMongoObject(existingUserRegisteredEstate)) {
      return this.res.json({
        success: false,
        message: "You are already a user under the selected estate",
      });
    }

    const newUserEstate = await this.__createUserEstate(
      userId,
      selectedEstateId,
      0
    );

    if (!sValidMongoObject(newUserEstate)) {
      return newUserEstate;
    }
    const newUserMode = await this.__createUserMode(
      userId,
      selectedEstateId,
      0
    );

    if (!sValidMongoObject(newUserMode)) {
      return newUserMode;
    }
    const newUserFamily = await this.__createUserFamily(
      userId,
      selectedEstateId,
      0,
      houseAddressId,
      false,
      owner
    );

    if (!sValidMongoObject(newUserFamily)) {
      return newUserFamily;
    }

    await newHouseAddress.save();
    await newUserFamily.save();
    await newUserMode.save();
    await newUserEstate.save();

    this.res.estate = existingUserRegisteredEstate;
    this.res.houseAddress = newHouseAddress;
    this.res.family = newUserFamily;
    return this.res.json({
      success: true,
      message: " Successfully registered under new Estate",
      existingRegisteredEstate,
      token: generateToken(user, existingUserRegisteredEstate._id),
    });
  }
  async __switchUserEstates() {
    const createdOn = new Date();
    const userId = (this.res.user && this.res.user._id) || "";
    const user = this.res.user || "";

    if (!isValidMongoObject(user) || !isValidMongoObjectId(userId)) {
      return this.res.json({
        success: false,
        message: "invalid user",
      });
    }
    const { _id: estateId } = this.res.estate || "";

    if (!isValidMongoObjectId(estateId)) {
      return this.res.json({
        success: false,
        message: "invalid estate id",
      });
    }

    const selectedEstateId = this.req.query["estateId"] || "";
if(!isValidMongoObjectId(selectedEstateId))
{
  return this.res.json({
    success: false,
    message: "Invalid Estate Id",
  });
}

if (stringIsEqual(selectedEstateId,estateId)){
  return this.res.json({
    success: false,
    message: "Already Logged in under this estate",
  });
}
    const existingRegisteredEstate = await RegisteredEstate.findOne({
      status: 1,
      _id: selectedEstateId,
    });

    if (!isValidMongoObject(existingRegisteredEstate)) {
      return this.res.json({
        success: false,
        message: "Selected Estate does not exist",
      });
    }
    const existingUserRegisteredEstate = await UserEstate.findOne({
      status: 1,
      estateId: selectedEstateId,
      ownerId: userId,
    });

    if (!isValidMongoObject(existingUserRegisteredEstate)) {
      return this.res.json({
        success: false,
        message: "You are not a user under the selected estate",
      });
    }
    const existingUserHouseAddress = await HouseAddressName.findOne({
      status: 1,
      estateId: selectedEstateId,
      ownerId: userId,
    });

    if (!isValidMongoObject(existingUserHouseAddress)) {
      return this.res.json({
        success: false,
        message: "house address not found",
      });
    }
    const existingUserFamily = await UserFamily.findOne({
      status: 1,
      estateId: selectedEstateId,
      ownerId: userId,
    });

    if (!isValidMongoObject(existingUserFamily)) {
      return this.res.json({
        success: false,
        message: "User Family data not found",
      });
    }
    this.res.estate = existingUserRegisteredEstate;
    this.res.houseAddress = existingUserHouseAddress;
    this.res.family = existingUserFamily;

    return this.res.json({
      success: true,
      message: " Successfully registered under new Estate",
      existingRegisteredEstate,
      token: generateToken(user, existingUserRegisteredEstate._id),
    });
  }
}
module.exports = Resident;
