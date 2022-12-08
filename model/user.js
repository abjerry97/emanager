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
const defaultBoolean = {
  type: Boolean,
  default: false,
};
const userSchemaObject = {
  status: defaultString, //0:deleted,1:active
  type: defaultString,  
  isVerified: defaultString,
  name: { _id: defaultString, ...Name.getSchemaObject() },
  emails: [{ _id: defaultString, ...Email.getSchemaObject() }],
  phoneNumbers: [{ _id: defaultString, ...PhoneNumber.getSchemaObject() }],
  admin: [{ _id: defaultString, ...Admin.getSchemaObject() }],
  isAdmin:defaultString,
  fromPortal:defaultBoolean,
  houseAddress: [{ _id: defaultString, ...HouseAddressName.getSchemaObject() }],
  joinedOn: defaultDate,
  updates: [
    {
      by: defaultString, // admin ID of the admin who made this update
      action: defaultString,
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // admin ID of the admin who created this entry
};
const UserSchema = new mongoose.Schema(userSchemaObject);

UserSchema.statics.getSchemaObject = () => userSchemaObject;
const User = mongoose.model("User", UserSchema);

module.exports = User;
