const mongoose = require("mongoose");
const AdminGuarantorsName = require("./admin-guarantor-name");
const AdminGuarantorsEmail = require("./admin-guarantor-name-email");
const AdminGuarantorsPhoneNumber = require("./admin-guarantor-phonenumber");
const AdminOfficeAddress = require("./admin-office-address");
const AdminOfficeEmail = require("./admin-office-email");
const AdminOfficeName = require("./admin-office-name");
const AdminOfficePhoneNumber = require("./admin-office-phonenumber");
const Email = require("./email");
const HouseAddressName = require("./house-address");
const Name = require("./name");
const PhoneNumber = require("./phone-number");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const adminSchemaObject = {
  status: defaultString, //0:deleted,1:active
  name: { _id: defaultString, ...Name.getSchemaObject() },
  emails: { _id: defaultString, ...Email.getSchemaObject() },
  address: { _id: defaultString, ...HouseAddressName.getSchemaObject() },
  phoneNumbers: [{ _id: defaultString, ...PhoneNumber.getSchemaObject() }],
  officeName: { _id: defaultString, ...AdminOfficeName.getSchemaObject() },
  officeAddress: {
    _id: defaultString,
    ...AdminOfficeAddress.getSchemaObject(),
  },
  officePhonenumbers: {
    _id: defaultString,
    ...AdminOfficePhoneNumber.getSchemaObject(),
  },

  officeEmails: { _id: defaultString, ...AdminOfficeEmail.getSchemaObject() },
  guarantorName: {
    _id: defaultString,
    ...AdminGuarantorsName.getSchemaObject(),
  },
  guarantorPhoneNumber: {
    _id: defaultString,
    ...AdminGuarantorsPhoneNumber.getSchemaObject(),
  },

  guarantorEmail:{
    _id: defaultString,
    ...AdminGuarantorsEmail.getSchemaObject(),
  },
  userId: defaultString,
  estateId: defaultString,
  isTopmost: defaultString,
  role: defaultString, //0:Chairman,1:Vice Chairman
  updates: [
    {
      by: defaultString, // admin ID of the admin who made this update
      action: defaultString,
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // admin ID of the admin who created this entry
  createdOn: defaultDate,
};
const AdminSchema = new mongoose.Schema(adminSchemaObject);

AdminSchema.statics.getSchemaObject = () => adminSchemaObject;
const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
