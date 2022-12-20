const {
  isValidFullName,
  isValidPhonenumber,
  isValidMongoObject,
  isValidMongoObjectId,
  isValidArrayOfMongoObject,
  isEmail,
} = require("../../helpers/validators");
const GuestCompanyName = require("../../model/guest-company-name");
const GuestName = require("../../model/guest-name");
const GuestPhoneNumber = require("../../model/guest-phone-number");
const GuestPlateNumber = require("../../model/guest-plate-number");

const Guest = require("../../model/guest");
const { generateToken, generateCode, handlePass } = require("../../utils");
const GatePass = require("../../model/gate-pass");
const HouseAddressName = require("../../model/house-address");
const { formatPhonenumber } = require("../../helpers/tools");
const GuestEmail = require("../../model/guest-email");
class Visitor {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
  }

  async __sendPass() {
    const { passId } = this.req.params;

    const foundPass = this.__getPass(passId);
    if (!isValidMongoObject(foundPass)) {
      return foundPass;
    }

    const foundGuest = this.__getGuest(foundPass.guestId);
    if (!isValidMongoObject(foundGuest)) {
      return foundGuest;
    }
  }

  async __createGuestName(guestName) {
    const createdOn = new Date();
    const userId = (this.res.user && this.res.user._id) || "";

    if (!isValidMongoObjectId(userId)) {
      return this.res.json({
        success: false,
        message: "Invalid user",
      });
    }
    if (!isValidFullName(guestName)) {
      return this.res.json({
        success: false,
        message: "You didn't provide a valid name",
      });
    }

    const newGuestName = await new GuestName({
      status: 1, //0:inactive,1:active
      value: guestName,
      createdBy: userId,
      createdOn,
    });

    if (!isValidMongoObject(newGuestName)) {
      return this.res.json({
        success: false,
        message: "Error while creating guest",
      });
    }

    return newGuestName;
  }

  async __createGuestCompanyName(guestCompanyName) {
    const createdOn = new Date();
    const userId = (this.res.user && this.res.user._id) || "";
    // if (!isValidFullName(guestCompanyName)) {
    //   return this.res.json({
    //     success: false,
    //     message: "Invalid CompanyName specified",
    //   });
    // }
    if (!isValidMongoObjectId(userId)) {
      return this.res.json({
        success: false,
        message: "Invalid user",
      });
    }
    const newGuestCompanyName = await new GuestCompanyName({
      status: 1, //0:inactive,1:active
      value: guestCompanyName,
      createdOn,
      createdBy: userId,
    });

    if (!isValidMongoObject(newGuestCompanyName)) {
      return this.res.json({
        success: false,
        message: "Error while creating Guest Company Name",
      });
    }

    return newGuestCompanyName;
  }

  async __createGuestPlateNumber(guestPlateNumber) {
    const createdOn = new Date();
    const userId = (this.res.user && this.res.user._id) || "";
    if (isValidFullName(guestPlateNumber)) {
      return this.res.json({
        success: false,
        message: "Invalid PlateNumber specified",
      });
    }
    if (!isValidMongoObjectId(userId)) {
      return this.res.json({
        success: false,
        message: "Invalid user",
      });
    }
    const newGuestPlateNumber = await new GuestPlateNumber({
      status: 1, //0:inactive,1:active
      value: guestPlateNumber,
      createdOn,
      createdBy: userId,
    });

    if (!isValidMongoObject(newGuestPlateNumber)) {
      return this.res.json({
        success: false,
        message: "Error while creating Guest Plate Number",
      });
    }

    return newGuestPlateNumber;
  }
  async __createGuestPhonenumber(phone) {
    const createdOn = new Date();
    const userId = (this.res.user && this.res.user._id) || "";
    if (!isValidMongoObjectId(userId)) {
      return this.res.json({
        success: false,
        message: "Invalid user",
      });
    }
    if (!isValidPhonenumber(phone)) {
      return this.res.json({
        success: false,
        message: "phonenumber not valid",
      });
    }
    const formattedPhone = formatPhonenumber(phone);
    const newPhonenumber = await new GuestPhoneNumber({
      status: 1, //0:inactive,1:active
      value: formattedPhone[1],
      countryCode: formattedPhone[0],
      createdOn,
      createdBy: userId,
    });

    if (!isValidMongoObject(newPhonenumber)) {
      return this.res.json({
        success: false,
        message: "Error while creating phonenumber",
      });
    }

    return newPhonenumber;
  }
  async __createGuestEmail(email) {
    const createdOn = new Date();
    const userId = (this.res.user && this.res.user._id) || "";
    if (!isValidMongoObjectId(userId)) {
      return this.res.json({
        success: false,
        message: "Invalid user",
      });
    }
    if (!isEmail(email)) {
      return this.res.json({
        success: false,
        message: "email not valid",
      });
    }
    const newPhonenumber = await new GuestEmail({
      status: 1, //0:inactive,1:active
      value: email,
      createdOn,
      createdBy: userId,
    });

    if (!isValidMongoObject(newPhonenumber)) {
      return this.res.json({
        success: false,
        message: "Error while creating phonenumber",
      });
    }

    return newPhonenumber;
  }
  async __invalidatePass() {
    const createdOn = new Date();
    // await GatePass({}, { $set: { status: '0' } } )

    await GatePass.bulkWrite([
      {
        updateMany: {
          filter: {
            expiresOn: { $gte: createdOn },
            // foodOptionId,
            // _id: { $ne: newlyCreatedFoodOptionPrice._id },
          },
          update: {
            $set: { status: "0" },
          }, // Changed in MongoDB 4.2
          upsert: false,
        },
      },
    ]);

    const foundPasses = await GatePass.find({});

    const pushUserPasses = await Promise.all(
      foundPasses.map(async (foundPass, index) => {
        const contextId = foundPass.guestId;

        if (isValidMongoObjectId(contextId)) {
          try {
            const updatePasses = await Guest.updateOne(
              {
                _id: contextId,
              },
              {
                $set: { pass: foundPass },
              }
            );
          } catch (error) {
            console.log(error);
          }
        }
      })
    );
  }
  async __createGuest(type) {
    const createdOn = new Date();
    const user = this.res.user
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

    const foundUserHouseAddress = await HouseAddressName.findOne({
      status: 1,
      ownerId: userId,
      estateId,
    });

    if (!isValidMongoObject(foundUserHouseAddress)) {
      return this.res.json({
        success: false,
        message: "House Address not found",
      });
    }

    if (
      isNaN(type) &&
      Number(type) < 0 &&
      Number(type) > 3 &&
      type.length !== 1
    ) {
      return this.res.json({
        success: false,
        message: "Invalid type specified",
      });
    }

    const newGuest = await new Guest({
      status: 1,
      ownerType: 2,
      estateId,
      ownerName:user.name.value,
      houseAddress: foundUserHouseAddress.value,
    });

    if (!isValidMongoObject(newGuest)) {
      return this.res.json({
        success: false,
        message: "Error while creating guest",
      });
    }
    if (!isValidMongoObjectId(newGuest._id)) {
      return this.res.json({
        success: false,
        message: "Error while creating guest",
      });
    }

    const name = await this.__createGuestName(this.req.body.name || "");

    if (!isValidMongoObject(name)) {
      return name;
    }
    const phoneNumber = await this.__createGuestPhonenumber(
      this.req.body.phone || ""
    );
    if (!isValidMongoObject(phoneNumber)) {
      return phoneNumber;
    }
    if (isEmail(this.req.body.email || "")) {
      const newlyCreatedGuestEmail = await this.__createGuestEmail(
        this.req.body.email
      );
      if (!isValidMongoObject(newlyCreatedGuestEmail)) {
        return newlyCreatedGuestEmail;
      }

      newlyCreatedGuestEmail.type = type;
      newlyCreatedGuestEmail.createdBy = newGuest._id;
      newlyCreatedGuestEmail.guestId = newGuest._id;
      await newlyCreatedGuestEmail.save();
      newGuest.email = newlyCreatedGuestEmail;
    }

    const plateNumber = await this.__createGuestPlateNumber(
      this.req.body.plateNumber || ""
    );

    if (!isValidMongoObject(plateNumber)) {
      return plateNumber;
    }

    name.type = type;
    name.guestId = newGuest._id;
    name.createdBy = userId;
    await name.save();
    newGuest.name = name;

    phoneNumber.type = type;
    userId;
    phoneNumber.guestId = newGuest._id;
    phoneNumber.createdBy = userId;
    await phoneNumber.save();
    newGuest.phoneNumber = phoneNumber;

    plateNumber.type = type;
    plateNumber.guestId = newGuest._id;
    plateNumber.createdBy = userId;
    await plateNumber.save();
    newGuest.plateNumber = plateNumber;

    const randomCode = await new GatePass({
      status: 1,
      value: generateCode(),
      guestId: newGuest._id,
      createdBy: userId,
      estateId,
    });
    switch (Number(type)) {
      case 0: {
        const companyName = await this.__createGuestCompanyName(
          this.req.body.companyName || ""
        );

        if (!isValidMongoObject(companyName)) {
          return companyName;
        }
        companyName.type = 0;
        companyName.createdBy = newGuest._id;
        await companyName.save();
        newGuest.companyName = companyName;
        newGuest.createdBy = userId;
        newGuest.type = 0;
        randomCode.type = 0;
        newGuest.pass = randomCode;
        await newGuest.save();
        break;
      }
      case 1: {
        const companyName = await this.__createGuestCompanyName(
          this.req.body.companyName || ""
        );

        if (!isValidMongoObject(companyName)) {
          return companyName;
        }
        companyName.type = 1;
        companyName.createdBy = newGuest._id;
        await companyName.save();
        newGuest.companyName = companyName;
        newGuest.createdBy = userId;
        newGuest.type = 1;
        randomCode.type = 1;
        newGuest.pass = randomCode;
        await newGuest.save();
        break;
      }
      case 2: {
        if (isNaN(this.req.body.numberOfGuests)) {
          return this.res.json({
            success: false,
            message: "Invalid number of guests",
          });
        }
        newGuest.numberOfGuests = this.req.body.numberOfGuests;
        newGuest.createdBy = userId;
        newGuest.type = 2;
        randomCode.type = 2;
        newGuest.pass = randomCode;
        await newGuest.save();
        break;
      }
      case 3: {
        if (isNaN(this.req.body.numberOfGuests)) {
          return this.res.json({
            success: false,
            message: "Invalid number of guests",
          });
        }
        newGuest.numberOfGuests = this.req.body.numberOfGuests;
        newGuest.createdBy = userId;
        newGuest.type = 3;
        randomCode.type = 3;
        newGuest.pass = randomCode;
        await newGuest.save();
        break;
      }
      default: {
        return this.res.json({
          success: false,
          message: "Error while creating guest",
        });
      }
    }
    randomCode.createdOn = createdOn;
    randomCode.expiresOn = new Date(createdOn.getTime() + 900000);
    // 900000
    randomCode.save();

    return this.res.json({
      success: true,
      message: "Guest Created Successfully",
      guest: {
        name: newGuest.name.value,
        numberOfGuests: newGuest.numberOfGuests || 1,
        plateNumber: newGuest.plateNumber.value || "",
        companyName: newGuest.companyName.value || "",
        houseAddress: newGuest.houseAddress.value || "",
        ownerName: newGuest.ownerName || "",
        createdOn: newGuest.createdOn,
        createdOn: newGuest.createdOn,
      },

      code: {
        value: randomCode.value,
        createdOn: randomCode.createdOn,
        expiresOn: randomCode.expiresOn,
      },
    });
  }
  async __updateGuest(type) {
    const createdOn = new Date();
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

    const foundPasses = await GatePass.find({});

    const pushUserPasses = await Promise.all(
      foundPasses.map(async (foundPass, index) => {
        const contextId = foundPass.guestId;

        if (isValidMongoObjectId(contextId)) {
          try {
            const updatePasses = await Guest.updateOne(
              {
                _id: contextId,
              },
              {
                $set: { pass: foundPass },
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
      message: "Guest Updated Successfully",
    });
  }

  async __getAllPasses() {
    const createdOn = new Date();
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

    const foundPasses = await GatePass.find({ createdBy: userId, estateId });

    if (!isValidArrayOfMongoObject(foundPasses)) {
      return this.res.json({
        success: false,
        message: "Passes not found",
      });
    }

    return this.res.json({
      success: true,
      message: "All passes",
      foundPasses,
    });
  }
  async __getPass(passId) {
    if (!isValidMongoObjectId(passId)) {
      return this.res.json({
        success: false,
        message: "Invalid pass id",
      });
    }

    const createdOn = new Date();
    const userId = (this.res.user && this.res.user._id) || "";
    const foundPass = await GatePass.findOne({
      createdBy: userId,
      _id: passId,
      status: 1,
    });

    if (!isValidMongoObject(foundPass)) {
      return this.res.json({
        success: false,
        message: "Pass not found",
      });
    }
    return foundPass;
  }
  async __getAllGuests() {
    const createdOn = new Date();
    const userId = (this.res.user && this.res.user._id) || "";
    const pageSize = this.req.query["pageSize"] || "";
    const page = this.req.query["page"] || "";
    const foundGuests = await Guest.find({ createdBy: userId })
      .sort({ createdOn: -1 })
      .limit(pageSize)
      .skip(pageSize * page);
    return this.res.json({
      success: true,
      message: "All Guests",
      foundGuests,
    });
  }
  async __getGuest(guestId) {
    if (!isValidMongoObjectId(guestId)) {
      return this.res.json({
        success: false,
        message: "Invalid guest id",
      });
    }
    const createdOn = new Date();
    const userId = (this.res.user && this.res.user._id) || "";
    const foundGuest = await Guest.findOne({ createdBy: userId, _id: guestId });
    if (!isValidMongoObject(foundGuests)) {
      return this.res.json({
        success: true,
        message: "Guest not found",
        foundGuests,
      });
    }

    return foundGuest;
  }
}
module.exports = Visitor;
