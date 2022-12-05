const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};

const gatePassSchemaObject = {
  status: defaultString, //0:deleted,1:active,2:checked
  value: defaultString,
  type: defaultString,
  guestId: defaultString,
  estateId: defaultString,
  createdBy: defaultString, // user ID of the user who created this entry
  createdOn: defaultDate,
  expiresOn: defaultDate,
  checkedOn: defaultDate,
};

const GatePassSchema = new mongoose.Schema(gatePassSchemaObject);

GatePassSchema.statics.getSchemaObject = () => gatePassSchemaObject;
const GatePass = mongoose.model("GatePass", GatePassSchema);

module.exports = GatePass;
