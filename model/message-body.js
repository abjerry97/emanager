const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const messageBodySchemaObject = {
  status: defaultString, //0:deleted,1:active
  messageId: defaultString,
  subjectId: defaultString,
  value: defaultString,
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
const MessageBodySchema = new mongoose.Schema(messageBodySchemaObject);

MessageBodySchema.statics.getSchemaObject = () => messageBodySchemaObject;
const MessageBody = mongoose.model("MessageBody", MessageBodySchema);

module.exports = MessageBody;
