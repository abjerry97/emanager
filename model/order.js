const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const orderSchemaObject = {
  status: defaultString, //0:inactive,1:active
  type: defaultString,//0:food,1:etc
  prouctId: defaultString,
  numberOfMonths: defaultString,
  isRecurring: defaultString,//0:false,1:true
  ownerType: defaultString, //user:0,admin:1
  updates: [
    {
      by: defaultString, // user ID of the user who made this update
      action: defaultString,
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // user ID of the user who created this entry 
  dueOn: defaultDate,
  createdOn: defaultDate,
};
const OrderSchema = new mongoose.Schema(orderSchemaObject);

OrderSchema.statics.getSchemaObject = () => orderSchemaObject;
const Order  = mongoose.model("Order", OrderSchema);

module.exports = Order ;
