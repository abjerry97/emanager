const mongoose = require("mongoose"); 
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const serviceAdPostPriceSchemaObject = {
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
const ServiceAdPostPriceSchema = new mongoose.Schema(serviceAdPostPriceSchemaObject);

ServiceAdPostPriceSchema.statics.getSchemaObject = () => serviceAdPostPriceSchemaObject;
const ServiceAdPostPrice = mongoose.model("ServiceAdPostPrice", ServiceAdPostPriceSchema);

module.exports = ServiceAdPostPrice;
