const mongoose = require("mongoose");
const BillAmount = require("./bill-amount");
const BillDate = require("./bill-date");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const defaultNumber = {
  type: Number,
  default: 0,
};
const billsSchemaObject = {
  status: defaultString, //0:inactive,1:active
  type: defaultString,//0:Estate Levy,1:Water Bill,2:waste Bill,1:Project Fee
  amount: { _id: defaultString, ...BillAmount.getSchemaObject() },
  date: { _id: defaultString, ...BillDate.getSchemaObject() },
  ownerType: defaultString, //user:0,admin:1
  revenue: defaultNumber, //user:0,admin:1
  estateId: defaultString, //user:0,admin:1
  updates: [
    {
      by: defaultString, // user ID of the user who made this update
      action: defaultString,// 0 delete 3: change amount
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // user ID of the user who created this entry
  createdOn: defaultDate,
};
const BillsSchema = new mongoose.Schema(billsSchemaObject);

BillsSchema.statics.getSchemaObject = () => billsSchemaObject;
const Bills = mongoose.model("Bills", BillsSchema);

module.exports = Bills;
