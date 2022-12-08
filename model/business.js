const mongoose = require("mongoose");
const Name = require("./name");
const Email = require("./email");
const PhoneNumber = require("./phone-number");
const HouseAddressName = require("./house-address");
const BusinessImage = require("./business-image");
const BusinessDays = require("./business-days");
const BusinessAd = require("./business-ad");
const BusinessDetails = require("./business-details");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const businessSchemaObject = {
  status: defaultString, //0:deleted,1:active
  ownerId:defaultString,
  estateId:defaultString,
  adType:defaultString,
  image: [{ _id: defaultString, ...BusinessImage.getSchemaObject() }],
  ads:{ _id: defaultString, ...BusinessAd.getSchemaObject() },
  category:defaultString,
  name: { _id: defaultString, ...Name.getSchemaObject() },
  details: { _id: defaultString, ...BusinessDetails.getSchemaObject() },
  emails: [{ _id: defaultString, ...Email.getSchemaObject() }],
  phoneNumbers: [{ _id: defaultString, ...PhoneNumber.getSchemaObject() }],
  businessAddress: [{ _id: defaultString, ...HouseAddressName.getSchemaObject() }],
  operatingDays: [{ _id: defaultString, ...BusinessDays.getSchemaObject() }],
  isAvailiable: defaultString,//0:deleted,1:active
  createdOn: defaultDate,
  updates: [
    {
      by: defaultString, // admin ID of the admin who made this update
      action: defaultString,
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // admin ID of the admin who created this entry
};
const BusinessSchema = new mongoose.Schema(businessSchemaObject);

BusinessSchema.statics.getSchemaObject = () => businessSchemaObject;
const Business = mongoose.model("Business", BusinessSchema);

module.exports = Business;
