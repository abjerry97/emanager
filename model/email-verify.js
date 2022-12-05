const mongoose = require("mongoose");
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
const emailVerifySchemaObject = {
  status: defaultString, //0:deleted,1:is verified,2:not verified
  value: defaultString,
  ownerId: defaultString,
  userId: defaultString,
  isVerified: defaultBoolean,
  isMailSent: defaultBoolean,
  ownerType: defaultString, //user:0,admin:1,2:guest,3:security
  token: defaultString,
  updates: [
    {
      by: defaultString, //user ID of the user who made this update
      action: defaultString,
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // user ID of the user who created this entry
  createdOn: defaultDate,
  expiresOn: defaultDate,
  checkedOn: defaultDate,
};
const EmailVerifySchema = new mongoose.Schema(emailVerifySchemaObject);

EmailVerifySchema.statics.getSchemaObject = () => emailVerifySchemaObject;
const EmailVerify = mongoose.model("EmailVerify", EmailVerifySchema);

module.exports = EmailVerify;
