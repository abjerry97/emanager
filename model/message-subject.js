const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const messageSubjectSchemaObject = {
  status: defaultString, //0:deleted,1:active 
  messageId: defaultString,
  value : defaultString, 
  createdOn: defaultDate, 
  updates: [
    {
      by: defaultString, // user ID of the user who made this update
      action: defaultString,
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // user ID of the user who created this entry
};
const MessageSubjectSchema = new mongoose.Schema(messageSubjectSchemaObject);

MessageSubjectSchema.statics.getSchemaObject = () => messageSubjectSchemaObject;
const MessageSubject = mongoose.model("MessageSubject", MessageSubjectSchema);

module.exports = MessageSubject;
