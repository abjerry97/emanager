const { isHashedString } = require("../../helpers/tools");
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
const BillAmount = require("../../model/bill-amount");
const BillDate = require("../../model/bill-date");
const Bills = require("../../model/bills");
const UserBillLinking = require("../../model/user-bill-linking");
const EmergencyScheama = require("../../model/emergency");
const { generateToken } = require("../../utils");
const Authentication = require("../Authentication/auth");

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
          message: "Emergency mood not created",
        });
      }

      await newUserEmergency.save();


    return this.res.json({
      success: true,
      message:
        "Emergency mood activated, Messages have been sent to Estate Admins, It will be automatically disabled after 1hour",
    });
  }

//   async __userActivateEmergency() {
//     const createdOn = new Date();
//     // validate request

//     const user = this.res.user || {};
//     const { _id: userId } = user || "";
//     const { _id: estateId } = this.res.estate || "";

//     const mode  = this.req.query["mode"] || "";
//     const userEmergency = await EmergencyScheama.findOne({
//       status: 1,
//       ownerId: userId,
//     });

//     if (!isValidMongoObject(userEmergency)) {
//       const newUserEmergency = await new EmergencyScheama({
//         status: 1,
//         ownerId: userId,
//         ownerType: 0,
//         mode: stringIsEqual(mode, "on") ? 1 : 0,
//         createdOn,
//         estateId,
//       });
// console.log(111)
//       if (!isValidMongoObject(newUserEmergency)) {
//         return this.res.json({
//           success: false,
//           message: "Emergency mood not created",
//         });
//       }

//       await newUserEmergency.save();

//       return this.res.json({
//         success: true,
//         message: stringIsEqual(mode, "on")
//           ? "Emergency mood activated, Messages have been sent to Estate Admins, It will be automatically disabled after 1hour"
//           : "Emergency mood activated",
//       });
//     }

//     if (stringIsEqual(mode, "on") && !stringIsEqual(userEmergency.mode, "1")) {
//       try {
//         const userEmergency = await EmergencyScheama.updateOne(
//           {
//             status: 1,
//             ownerId: userId,
//           },
//           {
//             $set: { mode: 1 },
//           }
//         );
//       } catch (error) {
//         console.log(error);
//       }
//     }

//     if (stringIsEqual(mode, "off") && !stringIsEqual(userEmergency.mode, "0")) {
//       try {
//         const userEmergency = await EmergencyScheama.updateOne(
//           {
//             status: 1,
//             ownerId: userId,
//           },
//           {
//             $set: { mode: 0 },
//           }
//         );
//       } catch (error) {
//         console.log(error);
//       }
//     }

//     if (!stringIsEqual(mode, "on") && !stringIsEqual(mode, "off")) {
//       return this.res.json({
//         success: false,
//         message: 'Opps!...invalid param specifer, expecting "on" or "off"',
//       });
//     }

//     return this.res.json({
//       success: true,
//       message:
//         "Emergency mood activated, Messages have been sent to Estate Admins, It will be automatically disabled after 1hour",
//     });
//   }
//   async __getUserEmergencyMode() {
//     const createdOn = new Date();
//     // validate request

//     const user = this.res.user || {};
//     const { _id: userId } = user || "";
//     const { _id: estateId } = this.res.estate || "";
//     const userEmergency = await EmergencyScheama.findOne({
//       status: 1,
//       ownerId: userId,
//       estateId,
//     });

//     if (!isValidMongoObject(userEmergency)) {
//       const newUserEmergency = await new EmergencyScheama ({
//         status: 1,
//         ownerId: userId,
//         ownerType: 0,
//         mode: 0,
//         createdOn,
//         estateId,
//       });

//       if (!isValidMongoObject(newUserEmergency)) {
//         return this.res.json({
//           success: false,
//           message: "Emergency mood not created",
//           mode: {},
//         });
//       }

//       await newUserEmergency.save();

//       return this.res.json({
//         success: true,
//         message: "Emergency gotten succesfully",
//         mode: newUserEmergency,
//       });
//     }

//     return this.res.json({
//       success: true,
//       message: "Emergency gotten successfully",
//       mode: userEmergency,
//     });
//   }

  // admin
}
module.exports = Emergency;
