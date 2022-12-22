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
const BillPayment = require("../../model/bill-payment");
const BillPaymentHistory = require("../../model/bill-payment-history");
const Bills = require("../../model/bills");
const UserWalletTransaction = require("../../model/emanager-user-wallet-transaction");
const UserBillLinking = require("../../model/user-bill-linking");
const UserEstate = require("../../model/user-estate"); 
const Authentication = require("../Authentication/auth");

class Bill extends Authentication {
  constructor(req, res, next) {
    super();
    this.req = req;
    this.res = res;
    this.next = next;
  }

  async __createBills() {
    const createdOn = new Date();
    // validate request

    const admin = this.res.admin || {};
    const { _id: adminId } = admin || "";
    const { _id: estateId } = this.res.estate || "";

    if (!isValidMongoObject(admin)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "sorry, admin not found!!!",
      });
    }
    if (!isValidMongoObjectId(adminId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Invalid admin",
      });
    }
    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Invalid estate id",
      });
    }

    const rawBillType = this.req.body.type || "";
    const billAmount = this.req.body.amount || "";
    const billDate = this.req.body.date || "";
    const billType = rawBillType.trim();
    if (billType.length < 3) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "oops!...enter a valid bill Type",
      });
    }
    if (isNaN(billAmount) || billAmount < 1) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "oops!...invalid bill amount",
      });
    }
    // var valid = new Date(billDate).getTime() > 0;
    // if (
    // !billDate.match(
    // /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
    // )
    //   !valid
    // ) {
    //   return this.res.json({
    //     success: false,
    //     message: "oops!...invalid bill date",
    //   });
    // }
    if (billDate < 1 || billDate > 31) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Enter a valid bill date",
      });
    }
    let billDueDate = billDate;

    // if (createdOn - billDueDate > 0) {
    //   return this.res.json({
    //     success: false,
    //     message: "oops!...invalid bill date, date already passed",
    //   });
    // }

    const existingBill = await Bills.findOne({
      status: 1,
      type: billType,
      estateId,
    });

    if (isValidMongoObject(existingBill)) {
      this.res.statusCode = 406;
      return this.res.json({
        success: false,
        message: "Bill with specified type already exist",
      });
    }

    const newBills = await new Bills({
      status: 1, //0:deleted,1:active
      createdOn,
      createdBy: adminId,
      estateId,
      type: billType, //0:Estate Levy,1:Water Bill,2:waste Bill,1:Project Fee
      ownerType: 0, //user:0,admin:1
    });
    if (!isValidMongoObject(newBills)) {
      this.res.statusCode = 405;
      return this.res.json({
        success: false,
        message: "oops!...error creating Bills",
      });
    }

    const newBillAmount = await new BillAmount({
      status: 1, //0:deleted,1:active
      currency: "Naira",
      value: billAmount,
      type: billType, //0:Estate Levy,1:Water Bill,2:waste Bill,1:Project Fee
      createdOn,
      createdBy: adminId,
    });
    if (!isValidMongoObject(newBillAmount)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "oops!...error creating Bill Amount",
      });
    }

    const newBillDate = await new BillDate({
      status: 1, //0:deleted,1:active
      value: billDate,
      type: billType, //0:Estate Levy,1:Water Bill,2:waste Bill,1:Project Fee
      createdOn,
      createdBy: adminId,
    });
    if (!isValidMongoObject(newBillDate)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "oops!...error creating Bill Date",
      });
    }

    newBillAmount.billId = newBills._id;
    newBillDate.billId = newBills._id;

    newBills.amount = newBillAmount;
    newBills.date = newBillDate;

    await newBillAmount.save();
    await newBillDate.save();
    await newBills.save();

    const allEstateUsers = await UserEstate.find({
      status: 1,
      estateId,
      ownerType: 0,
    });

    if (!isValidArrayOfMongoObject(allEstateUsers)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "oops!...Estate Users not found",
      });
    }
    (allEstateUsers || []).map(async (user, index) => {
      try {
        const newUserBillLinking = await new UserBillLinking({
          status: 1,
          ownerId: user.ownerId,
          billId: newBills._id,
          estateId,
          amount: billAmount,
          type: billType,
          month: createdOn.getMonth(),
          createdOn,
          dueOn: billDueDate,
          createdBy: adminId,
        });

        await newUserBillLinking.save();
      } catch (error) {
        console.log(error);
      }
    });

    const formatBill = {
      amount: newBills?.amount?.value,
      date: newBills?.date?.value,
      _id: newBills?._id,
      status: newBills?.status,
      type: newBills?.type,
      ownerType: newBills?.ownerType,
      estateId: newBills?.estateId,
    };
    return this.res.json({
      success: true,
      message: "Bill created Succesfully",
      bill: formatBill,
    });
  }
  async __getBill() {
    const createdOn = new Date();
    // validate request

    const admin = this.res.admin || {};
    const { _id: adminId } = admin || "";
    const { _id: estateId } = this.res.estate || "";

    if (!isValidMongoObject(admin)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "sorry, admin not found!!!",
      });
    }
    if (!isValidMongoObjectId(adminId)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Invalid admin",
      });
    }
    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Invalid estate id",
      });
    }

    const billId = this.req.params.billId || "";

    if (!isValidMongoObjectId(billId)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Invalid bill id",
      });
    }
    const existingBill = await Bills.findOne(
      {
        status: 1,
        _id: billId,
        // estateId,
      },
      {
        _id: 1,
        createdOn: 1,
        status: 1,
        type: 1,
        estateId: 1,
        "amount.value": 1,
        "date.value": 1,
      }
    ).sort({ _id: -1 });

    if (!isValidMongoObject(existingBill)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: `sorry ${billType} bill yet to be created, you can add a new payment type `,
      });
    }

    return this.res.json({
      success: true,
      message: "Bill gotten Succesfully",
      bill: existingBill,
    });
  }
  async __getBills() {
    const createdOn = new Date();
    // validate request

    const admin = this.res.admin || {};
    const { _id: adminId } = admin || "";
    const { _id: estateId } = this.res.estate || "";

    if (!isValidMongoObject(admin)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "sorry, admin not found!!!",
      });
    }
    if (!isValidMongoObjectId(adminId)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Invalid admin",
      });
    }
    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Invalid estate id",
      });
    }

    const billType = (this.req.query["type"] || "").trim();

    const existingBill = await Bills.find(
      {
        status: 1,
        // type: billType,
        // estateId,
      },
      {
        _id: 1,
        createdOn: 1,
        status: 1,
        type: 1,
        estateId: 1,
        "amount.value": 1,
        "date.value": 1,
      }
    ).sort({ _id: -1 });

    if (!isValidArrayOfMongoObject(existingBill)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: `sorry ${billType} bill yet to be created, you can add a new payment type `,
      });
    }

    // const formatBill = {
    //   amount: existingBill?.amount?.value,
    //   date: existingBill?.date?.value,
    //   _id: existingBill?._id,
    //   status: existingBill?.status,
    //   type: existingBill?.type,
    //   ownerType: existingBill?.ownerType,
    //   estateId: existingBill?.estateId,
    // };

    return this.res.json({
      success: true,
      message: "Bill gotten Succesfully",
      bill: existingBill,
    });
  }
  async __updateBill() {
    const createdOn = new Date();
    // validate request

    const admin = this.res.admin || {};
    const { _id: adminId } = admin || "";
    const { _id: estateId } = this.res.estate || "";

    if (!isValidMongoObject(admin)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "sorry, admin not found!!!",
      });
    }
    if (!isValidMongoObjectId(adminId)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Invalid admin",
      });
    }
    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Invalid estate id",
      });
    }

    // const rawbillType = this.req.params.billType || "";
    const billId = this.req.params.billId || "";
    const prevAmount = this.req.body.prevAmount;
    const newAmount = this.req.body.newAmount;
    // const billType = rawbillType.trim();
    if (isNaN(prevAmount)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Invalid Previous Amount",
      });
    }

    if (isNaN(newAmount)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Provide a valid new Amount",
      });
    }
    // if (billType.length < 3) {
    //   return this.res.json({
    //     success: false,
    //     message: "oops!...enter a valid bill Type",
    //   });
    // }
    const existingBill = await Bills.findOne({
      status: 1,
      _id: billId,
      // type: billType,
      estateId,
    });

    if (!isValidMongoObject(existingBill)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Bill with specified type not found",
      });
    }

    if (!stringIsEqual(existingBill?.amount?.value, prevAmount)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Incorrect Previous bill amount",
      });
    }

    const newBillAmount = await new BillAmount({
      status: 1, //0:deleted,1:active
      currency: 0,
      billId: existingBill._id,
      value: newAmount,
      // type: billType, //0:Estate Levy,1:Water Bill,2:waste Bill,1:Project Fee
      createdOn,
      createdBy: adminId,
    });
    if (!isValidMongoObject(newBillAmount)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "BillAmount not created",
      });
    }
    let updateExistingBill = {};
    try {
      updateExistingBill = await Bills.findOneAndUpdate(
        {
          status: 1,
          _id: existingBill._id,
        },
        {
          $set: { amount: newBillAmount },
          $push: {
            updates: {
              by: adminId, // user ID of the user who made this update
              action: 3,
              timing: createdOn,
            },
          },
        },
        { new: true }
      );
    } catch (error) {
      console.log(error);
    }
    try {
      const updateExistingBill = await BillAmount.updateOne(
        {
          status: 1,
          billId: existingBill._id,
        },
        {
          $set: { status: 0 },
          $push: {
            updates: {
              by: adminId, // user ID of the user who made this update
              action: 0,
              timing: createdOn,
            },
          },
        }
      );
    } catch (error) {
      console.log(error);
    }

    try {
      const updateExistingBill = await UserBillLinking.updateMany(
        {
          status: 1,
          billId: existingBill._id,
          estateId,
          month: createdOn.getMonth(),
        },
        {
          $set: { amount: newBillAmount.value },
          $push: {
            updates: {
              by: adminId, // user ID of the user who made this update
              action: 0,
              timing: createdOn,
            },
          },
        }
      );
    } catch (error) {
      console.log(error);
    }

    const formatBill = {
      amount: updateExistingBill?.amount?.value,
      date: updateExistingBill?.date?.value,
      _id: updateExistingBill?._id,
      status: updateExistingBill?.status,
      type: updateExistingBill?.type,
      ownerType: updateExistingBill?.ownerType,
      estateId: updateExistingBill?.estateId,
    };

    return this.res.json({
      success: true,
      message: "Bill gotten Succesfully",
      bill: formatBill,
    });
  }
  // admin
  async __getUserEstateBills() {
    const createdOn = new Date();
    // validate request

    const user = this.res.user || {};
    const { _id: userId } = user || "";
    const { _id: estateId } = this.res.estate || "";

    const gottenBills = await Bills.find({
      status: 1, //0:deleted,1:active
      estateId,
      ownerType: 0,
    });

    if (!isValidArrayOfMongoObject(gottenBills)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "oops!...Bills not gotten",
        bills: [],
      });
    }

    return this.res.json({
      success: true,
      message: "Bill gotten Succesfully",
      bills: gottenBills,
    });
  }

  async __getUserBillsLinking() {
    const createdOn = new Date();
    // validate request

    const user = this.res.user || {};
    const { _id: userId } = user || "";
    const { _id: estateId } = this.res.estate || "";

    const gottenBillsLinking = await UserBillLinking.find({
      status: 1, //0:deleted,1:active
      // estateId,
      ownerId: userId,
    });
    if (
      !isValidArrayOfMongoObject(gottenBillsLinking) ||
      gottenBillsLinking.length < 1
    ) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "oops!...Bills Linking not gotten",
      });
    }

    return this.res.json({
      success: true,
      message: "Bill Linking gotten Succesfully",
      billLinking: gottenBillsLinking,
    });
  }

  async __getUserUpcomingBills() {
    const createdOn = new Date();
    // validate request

    const user = this.res.user || {};
    const { _id: userId } = user || "";
    const { _id: estateId } = this.res.estate || "";

    const gottenUpcomingBillsLinking = await UserBillLinking.find({
      status: 1, //0:deleted,1:active
      estateId,
      ownerId: userId,
      dueOn: {
        $gte: createdOn,
      },
    });

    if (!isValidArrayOfMongoObject(gottenUpcomingBillsLinking)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "oops!...Upcoming Bills not found",
        upcomingBillLinking: [],
      });
    }

    return this.res.json({
      success: true,
      message: "Upcoming Bill found Succesfully",
      upcomingBillLinking: gottenUpcomingBillsLinking,
    });
  }
  async __userPayBills() {
    const createdOn = new Date();
    // validate request

    const user = this.res.user || {};
    const { _id: userId } = user || "";
    const { _id: estateId } = this.res.estate || "";
    const { billId } = this.req.params || "";
    const from = this.req.body.from || "";
    const to = this.req.body.to || "";
    const amount = this.req.body.amount || 0;
    const name = this.req.body.name;

    if (!isValidMongoObjectId(billId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Invalid bill Id",
      });
    }

    const existingBill = await Bills.findOne({
      status: 1,
      _id: billId,
    });
    if (!isValidMongoObject(existingBill)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "oops!...  Bill not found",
      });
    }

    const gottenUpcomingBillsLinking = await UserBillLinking.findOne({
      status: 1, //0:deleted,1:active
      // estateId,
      ownerId: userId,
      billId,
      // dueOn: {
      //   $gte: createdOn,
      // },
    });
    if (!isValidMongoObject(gottenUpcomingBillsLinking)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "oops!...User Bill not found",
      });
    }
    const billLinkingId = gottenUpcomingBillsLinking._id;
    let billPaymentId = "";
    let newuserBillPayment = {};
    const userBillPayment = await BillPayment.findOne({
      status: 1, //0:deleted,1:active
      estateId,
      ownerId: userId,
      billLinkingId: billLinkingId,
      billId: gottenUpcomingBillsLinking.billId,
    });

    if (isValidMongoObject(userBillPayment)) {
      billPaymentId = userBillPayment._id;
      newuserBillPayment = userBillPayment;
    }
    if (!isValidMongoObject(userBillPayment)) {
      const newlyCreatedUserBillPayment = await new BillPayment({
        status: 1,
        estateId,
        ownerId: userId,
        billLinkingId: billLinkingId,
        billId: gottenUpcomingBillsLinking.billId,
        createdOn,
        type: gottenUpcomingBillsLinking.type,
        ownerName: name || user.name.value,
        ownerAddress: user.houseAddress[0].value,
        to,
        from,
        createdBy: userId,
      });
      billPaymentId = newlyCreatedUserBillPayment._id;
      await newlyCreatedUserBillPayment.save();
      newuserBillPayment = newlyCreatedUserBillPayment;
    }


  const newBillPaymentTransaction =  await new UserWalletTransaction({
    status:1, 
    type: existingBill.type,
    isEstate: 1,
    estateId,
    name: user.name.value,
    amount,
    isDebit: true,
    ownerId: userId,
    message: "test test",    
    createdOn,
  })
  if (!isValidMongoObject(newBillPaymentTransaction)) {
    this.res.statusCode = 500;
    return this.res.json({
      success: false,
      message: "Error initiating transaction, try again",
    });

  }

 await newBillPaymentTransaction.save()

    const newlyCreatedBillPaymentHistory = await new BillPaymentHistory({
      status: 1,
      amount,
      billId: gottenUpcomingBillsLinking.billId,
      billPaymentId,
      from,
      type: gottenUpcomingBillsLinking.type,
      to,
      createdBy: userId,
    });

    await newlyCreatedBillPaymentHistory.save();

    try {
      const updateExistingBillPayment = await BillPayment.findOneAndUpdate(
        {
          status: 1,
          _id: billPaymentId,
        },
        {
          $set: { amount: Number(amount) + (Number(newuserBillPayment?.amount) || 0) },
          $push: {
            history: newlyCreatedBillPaymentHistory,
          },
        },
        { new: true }
      );
      if (isValidMongoObject(updateExistingBillPayment)) {
        const updateExistingBillLinking =
          await UserBillLinking.findOneAndUpdate(
            {
              status: 1,
              _id: updateExistingBillPayment.billLinkingId,
            },
            {
              $set: {
                payment: updateExistingBillPayment,
              },
            },
            { new: true }
          );

        const updateExistingBill = await Bills.findOneAndUpdate(
          {
            status: 1,
            _id: billId,
          },
          {
            $set: {
              revenue: (Number(existingBill.revenue) || 0) + Number(amount),
            },
          },
          { new: true }
        );
      }
    } catch (error) {
      console.log(error);
    }

    return this.res.json({
      success: true,
      message: "Bill payment succesful",
    });
  }
  async __adminGetUserBillPayments() {
    const createdOn = new Date();
    // validate request
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
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Invalid estate id",
      });
    }
    const userBillPayment = await BillPayment.find(
      {
        status: 1,
        // estateId
      },
      {
        _id: 1,
        createdOn: 1,
        status: 1,
        type: 1,
        billId: 1,
        estateId: 1,
        ownerName: 1,
        ownerAddress: 1,
        from: 1,
        to: 1,
        isSuccesful: 1,
        amount: 1,
        "history.isSuccesful": 1,
        "history.amount": 1,
        "history.from": 1,
        "history.to": 1,
        "history.createdOn": 1,
      }
    ).sort({ _id: -1 });

    if (
      !isValidArrayOfMongoObject(userBillPayment) &&
      userBillPayment.length < 1
    ) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "bill payment not found",
      });
    }

    return this.res.json({
      success: true,
      message: "Bill found succesful",
      payment: userBillPayment,
    });
  }
  async __adminGetUserParticularBillPayment() {
    const createdOn = new Date();
    // validate request
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
    const {   paymentId } = this.req.params || ""; 
    if (!isValidMongoObjectId(estateId)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Invalid estate id",
      });
    }
    if (!isValidMongoObjectId(paymentId)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Invalid payment id",
      });
    }
    const userBillPayment = await BillPayment.findOne(
      {
        status: 1,
        _id:paymentId
      },
      {
        _id: 1,
        createdOn: 1,
        status: 1,
        type: 1,
        billId: 1,
        estateId: 1,
        ownerName: 1,
        ownerAddress: 1,
        from: 1,
        to: 1,
        isSuccesful: 1,
        amount: 1,
        "history.isSuccesful": 1,
        "history.amount": 1,
        "history.from": 1,
        "history.to": 1,
        "history.createdOn": 1,
      }
    ).sort({ _id: -1 });

    if (
      !isValidMongoObject(userBillPayment) 
    ) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "bill payment not found",
      });
    }

    return this.res.json({
      success: true,
      message: "Bill found succesful",
      payment: userBillPayment,
    });
  }

  // admin
}
module.exports = Bill;
