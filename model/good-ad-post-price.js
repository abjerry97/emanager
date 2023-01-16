const mongoose = require("mongoose"); 
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const goodAdPostPriceSchemaObject = {
  status: defaultString, //0:inactive,1:active
  currency: defaultString, //0:Naira,1:USD
  value: defaultString, 
  type:defaultString,
  updates: [
    {
      by: defaultString, // admin ID of the user who made this update
      action: defaultString, 
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // user ID of the user who created this entry
  createdOn: defaultDate,
};
const GoodAdPostPriceSchema = new mongoose.Schema(goodAdPostPriceSchemaObject);

GoodAdPostPriceSchema.statics.getSchemaObject = () => goodAdPostPriceSchemaObject;
const GoodAdPostPrice = mongoose.model("GoodAdPostPrice", GoodAdPostPriceSchema);

module.exports = GoodAdPostPrice;
