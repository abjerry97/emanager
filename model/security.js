const mongoose = require("mongoose");
const Name = require("./name");
const Admin = require("./admin");
const Email = require("./email");
const PhoneNumber = require("./phone-number");
const HouseAddressName = require("./house-address");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const securitySchemaObject = {
  status: defaultString, //0:deleted,1:active
  ownerType: defaultString, //user:0,admin:1,2:guest,3:security
  estateId: defaultString, 
  name: { _id: defaultString, ...Name.getSchemaObject() },
  emails: [{ _id: defaultString, ...Email.getSchemaObject() }],
  phoneNumbers: [{ _id: defaultString, ...PhoneNumber.getSchemaObject() }],
  houseAddress: { _id: defaultString, ...HouseAddressName.getSchemaObject() },
  joinedOn: defaultDate,
  updates: [
    {
      by: defaultString, // admin ID of the admin who made this update
      action: defaultString,
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // admin ID of the admin who created this entry
  createdOn: defaultString, // admin ID of the admin who created this entry
};
const SecuritySchema = new mongoose.Schema(securitySchemaObject);

SecuritySchema.statics.getSchemaObject = () => securitySchemaObject;
const Security = mongoose.model("Security", SecuritySchema);

module.exports = Security;
