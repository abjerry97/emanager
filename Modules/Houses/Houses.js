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
const Email = require("../../model/email");
const House = require("../../model/house");
const HouseAddressName = require("../../model/house-address");
const HouseDescription = require("../../model/house-description");
const HouseEmail = require("../../model/house-email");
const HouseOwnerName = require("../../model/house-owner-name");
const HousePhonenumber = require("../../model/house-phonenumber");
 
const Authentication = require("../Authentication/auth");

class Houses extends Authentication {
  constructor(req, res, next) {
    super();
    this.req = req;
    this.res = res;
    this.next = next;
  }

  async __createHouse() {
    const createdOn = new Date();
    // validate request
    const admin = this.res.admin || {};
    const { _id: adminId = "" } = admin;
    if (!isValidMongoObject(admin)) {
      return this.res.json({
        success: false,
        message: "admin not found!!!",
      });
    }
    const { _id: estateId } = this.res.estate || "";

    if (!isValidMongoObjectId(adminId)) {
      return this.res.json({
        success: false,
        message: "Invalid admin",
      });
    }
    if (!isValidMongoObjectId(estateId)) {
      return this.res.json({
        success: false,
        message: "Invalid estate id",
      });
    }

    const newHouseAddress = this.req.body.address || "";
    const newHousebuildingType = this.req.body.buildingType || "";
    const newHouseDescription = this.req.body.description || "";
    const newHouseOwnerName = this.req.body.ownerName || "";
    const newHouseOwnerPhonenumber = this.req.body.ownerPhonenumber || "";
    const newHouseOwnerEmail = this.req.body.ownerEmail || "";
    const newHouseAgentName = this.req.body.agentName || "";
    const newHouseAgentPhonenumber = this.req.body.agentPhonenumber || "";

    if (newHouseAddress.length < 5) {
      return this.res.json({
        success: false,
        message: "Invalid house address",
      });
    }
    if (newHousebuildingType.length < 3) {
      return this.res.json({
        success: false,
        message: "Invalid House building Type",
      });
    }
    if (newHouseDescription.length < 3) {
      return this.res.json({
        success: false,
        message: "Invalid House Description",
      });
    }
    if (newHouseOwnerName.length < 3) {
      return this.res.json({
        success: false,
        message: "Invalid House owner name",
      });
    }

    if (!isValidPhonenumber(newHouseOwnerPhonenumber)) {
      return this.res.json({
        success: false,
        message: "Invalid House owner phonenumber",
      });
    }

    if (!isEmail(newHouseOwnerEmail)) {
      return this.res.json({
        success: false,
        message: "Invalid House owner email",
      });
    }

    if (newHouseAgentName.length < 3) {
      return this.res.json({
        success: false,
        message: "Invalid House agent name",
      });
    }

    if (!isValidPhonenumber(newHouseAgentPhonenumber)) {
      return this.res.json({
        success: false,
        message: "Invalid House agent phonenumber",
      });
    }

    const formattedNewHouseOwnerPhonenumber = formatPhonenumber(
      newHouseOwnerPhonenumber
    );
    const newlyCreatedHouseAddressName = await new HouseAddressName({
      status: 1,
      value: newHouseAddress,
      createdBy: adminId,
      createdOn,
    });

    if (!isValidMongoObject(newlyCreatedHouseAddressName)) {
      return this.res.json({
        success: false,
        message: "Error creating  House Address",
      });
    }
    const newlyCreatedHouseDescription = await new HouseDescription({
      status: 1,
      value: newHouseDescription,
      createdBy: adminId,
      createdOn,
    });

    if (!isValidMongoObject(newlyCreatedHouseDescription)) {
      return this.res.json({
        success: false,
        message: "Error creating  House Description",
      });
    }
    const newlyCreatedHouseOwnerName = await new HouseOwnerName({
      status: 1,
      value: newHouseOwnerName,
      ownerType: 0,
      createdBy: adminId,
      createdOn,
    });
    if (!isValidMongoObject(newlyCreatedHouseOwnerName)) {
      return this.res.json({
        success: false,
        message: "Error creating  House Owner Name",
      });
    }
    const newlyCreatedHouseOwnerPhonenumber = await new HousePhonenumber({
      status: 1,
      value: formattedNewHouseOwnerPhonenumber[1],
      countryCode: formattedNewHouseOwnerPhonenumber[0],
      ownerType: 0,
      createdBy: adminId,
      createdOn,
    });

    if (!isValidMongoObject(newlyCreatedHouseOwnerPhonenumber)) {
      return this.res.json({
        success: false,
        message: "Error creating  House Owner phonenumber",
      });
    }
    const newlyCreatedHouseOwnerEmail = await new HouseEmail({
      status: 1,
      value: newHouseOwnerEmail,
      createdBy: adminId,
      ownerType: 0,
      createdOn,
    });

    if (!isValidMongoObject(newlyCreatedHouseOwnerEmail)) {
      return this.res.json({
        success: false,
        message: "Error creating  House Owner Email",
      });
    }

    const newlyCreatedHouseAgentName = await new HouseOwnerName({
      status: 1,
      value: newHouseAgentName,
      ownerType: 1,
      createdBy: adminId,
      createdOn,
    });

    if (!isValidMongoObject(newlyCreatedHouseAgentName)) {
      return this.res.json({
        success: false,
        message: "Error creating  House Agent Name",
      });
    }
    const formattedNewHouseAgentPhonenumber = formatPhonenumber(
      newHouseAgentPhonenumber
    );
    const newlyCreatedHouseAgentPhonenumber = await new HousePhonenumber({
      status: 1,
      value: formattedNewHouseAgentPhonenumber[1],
      countryCode: formattedNewHouseAgentPhonenumber[0],
      createdBy: adminId,
      ownerType: 1,
      createdOn,
    });

    if (!isValidMongoObject(newlyCreatedHouseAgentPhonenumber)) {
      return this.res.json({
        success: false,
        message: "Error creating  House Agent Phonenumber",
      });
    }

    const newlyCreatedHouse = await new House({
      status: 1, //0:deleted,1:active
      estateId,
      buildingType: newHousebuildingType,
      createdOn,
    });

    if (!isValidMongoObject(newlyCreatedHouse)) {
      return this.res.json({
        success: false,
        message: "Error creating  House",
      });
    }

    newlyCreatedHouseAddressName.houseId = newlyCreatedHouse._id;
    newlyCreatedHouseDescription.houseId = newlyCreatedHouse._id;
    newlyCreatedHouseOwnerName.houseId = newlyCreatedHouse._id;
    newlyCreatedHouseOwnerPhonenumber.houseId = newlyCreatedHouse._id;
    newlyCreatedHouseOwnerEmail.houseId = newlyCreatedHouse._id;
    newlyCreatedHouseAgentName.houseId = newlyCreatedHouse._id;
    newlyCreatedHouseAgentPhonenumber.houseId = newlyCreatedHouse._id;

    newlyCreatedHouse.houseAddress = newlyCreatedHouseAddressName;
    newlyCreatedHouse.description = newlyCreatedHouseDescription;
    newlyCreatedHouse.ownerName = newlyCreatedHouseOwnerName;
    newlyCreatedHouse.ownerPhonenumber = newlyCreatedHouseOwnerPhonenumber;
    newlyCreatedHouse.ownerEmail = newlyCreatedHouseOwnerEmail;
    newlyCreatedHouse.agentName = newlyCreatedHouseAgentName;
    newlyCreatedHouse.agentPhonenumber = newlyCreatedHouseAgentPhonenumber;

    await newlyCreatedHouseAddressName.save();
    await newlyCreatedHouseDescription.save();
    await newlyCreatedHouseOwnerName.save();
    await newlyCreatedHouseOwnerPhonenumber.save();
    await newlyCreatedHouseOwnerEmail.save();
    await newlyCreatedHouseAgentName.save();
    await newlyCreatedHouseAgentPhonenumber.save();
    await newlyCreatedHouse.save();

    return this.res.json({
      success: true,
      message: "House created Succesfully",
      house: newlyCreatedHouse,
    });
  }
  async __getHouses() {
    const createdOn = new Date();
    // validate request
    const admin = this.res.admin || {};
    const { _id: adminId = "" } = admin;
    if (!isValidMongoObject(admin)) {
      return this.res.json({
        success: false,
        message: "admin not found!!!",
      });
    }
    const { _id: estateId } = this.res.estate || "";

    if (!isValidMongoObjectId(adminId)) {
      return this.res.json({
        success: false,
        message: "Invalid admin",
      });
    }
    if (!isValidMongoObjectId(estateId)) {
      return this.res.json({
        success: false,
        message: "Invalid estate id",
      });
    }

    const foundHouses = await House.find({
      status: 1, //0:deleted,1:active
    });
    if (isValidArrayOfMongoObject(foundHouses) && foundHouses.length > 0) {
      return this.res.json({
        success: true,
        message: "houses found",
        foundHouses: foundHouses,
      });
    } else {
      this.res.status(404);
      return this.res.json({
        success: false,
        message: "houses not found",
        foundHouses: [],
      });
    }
  }
  async __deleteEstateHouse() {
    const createdOn = new Date();
    // validate request
    const admin = this.res.admin || {};
    const { _id: adminId = "" } = admin;
    if (!isValidMongoObject(admin)) {
      return this.res.json({
        success: false,
        message: "Sorry!...admin not found!!!",
      });
    }
    const { _id: estateId } = this.res.estate || "";

    if (!isValidMongoObjectId(estateId)) {
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid estate id",
      });
    }
    if (!isValidMongoObjectId(adminId)) {
      return this.res.json({
        success: false,
        message: "Sorry!...Invalid admin",
      });
    }

    const houseToUpdate = this.req.params.houseId ||"" ;
    if (!isValidMongoObjectId(houseToUpdate)) {
      this.res.status(404);
      return this.res.json({
        success: false,
        message: " Invalid house id",
      });
    }

    if (isValidMongoObjectId(houseToUpdate)) {
      const foundHouse = await House.findOne({
        status: 1,
        _id: houseToUpdate,
      });
      if (!isValidMongoObject(foundHouse)) {
        this.res.status(404);
        return this.res.json({
          success: false,
          message: "house not found",
        });
      }

      const houseUpdatableSet = {};

    

      try {
        const updateParticularHouseOwnerName =
          await HouseOwnerName.findOneAndUpdate(
            {
              status: 1,
              houseId: houseToUpdate,
              ownerType: 0,
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
        houseUpdatableSet.ownerName = updateParticularHouseOwnerName;
      } catch (error) {
        console.log(error);
      }
      try {
        const updateParticularHouseDescription =
          await HouseDescription.findOneAndUpdate(
            {
              status: 1,
              houseId: houseToUpdate, 
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
        houseUpdatableSet.description = updateParticularHouseDescription;
      } catch (error) {
        console.log(error);
      }

      try {
        const updateParticularHousePhonenumber =
          await HousePhonenumber.findOneAndUpdate(
            {
              status: 1,
              houseId: houseToUpdate,
              ownerType: 0,
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
        houseUpdatableSet.ownerPhonenumber = updateParticularHousePhonenumber;
      } catch (error) {
        console.log(error);
      }

      try {
        const updateParticularHouseEmail = await HouseEmail.findOneAndUpdate(
          {
            status: 1,
            houseId: houseToUpdate,
            ownerType: 0,
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
        houseUpdatableSet.ownerEmail = updateParticularHouseEmail;
      } catch (error) {
        console.log(error);
      }




      try {
        const updateParticularHouseAgentName =
          await HouseOwnerName.findOneAndUpdate(
            {
              status: 1,
              houseId: houseToUpdate,
              ownerType: 1,
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
        houseUpdatableSet.agentName = updateParticularHouseAgentName;
      } catch (error) {
        console.log(error);
      }






      try {
        const updateParticularHouseAgentPhonenumber =
          await HousePhonenumber.findOneAndUpdate(
            {
              status: 1,
              houseId: houseToUpdate,
              ownerType: 1,
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
        houseUpdatableSet.agentPhonenumber = updateParticularHouseAgentPhonenumber;
      } catch (error) {
        console.log(error);
      }






      try {
        const updateParticularHouseAddressName =
          await HouseAddressName.findOneAndUpdate(
            {
              status: 1,
              houseId: houseToUpdate, 
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
        houseUpdatableSet.houseAddress = updateParticularHouseAddressName;
      } catch (error) {
        console.log(error);
      }




 

      try {
        houseUpdatableSet.status = 0;

        const updateParticularHouse = await House.findOneAndUpdate(
          {
            status: 1,
            _id: houseToUpdate,
          },
          {
            $set: houseUpdatableSet,
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
      message: "House deleted Succesfully",
      // houses: foundEstateHouse,
    });
  }
}
module.exports = Houses;
