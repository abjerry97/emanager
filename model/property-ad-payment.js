const mongoose = require("mongoose"); 
const defaultString = {
  type: String,
  default: "",
};
const defaultNumber = {
  type: Number,
  default: 0,
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const defaultBoolean = {
  type: Boolean,
  default: false,
};
const propertyAdPaymentSchemaObject = {
  status: defaultString, //0:deleted,1:published,2:unpublished
  propertyId:defaultString,
  propertyAdId:defaultString,
  isAdActive:defaultBoolean,
  amount: defaultNumber, 
  noOfDays: defaultNumber, 
  updates: [
    {
      by: defaultString, // admin ID of the user who made this update
      action: defaultString, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // user ID of the user who created this entry
  createdOn: defaultDate,
  expiresOn: defaultDate,
};
const PropertyAdPaymentSchema = new mongoose.Schema(propertyAdPaymentSchemaObject);

PropertyAdPaymentSchema.statics.getSchemaObject = () => propertyAdPaymentSchemaObject;
const PropertyAdPayment = mongoose.model("PropertyAdPayment", PropertyAdPaymentSchema);

module.exports = PropertyAdPayment;
