const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const candidateSchemaObject = {
  status: defaultString, //0:deleted,1:active
  name: defaultString,
  estateId: defaultString,
  role: defaultString,
  type: defaultString, //0:exco, 1:others
  electionId: defaultString, //0:exco, 1:others
  numberOfVotes: defaultString, 
  createdOn: defaultDate,
  expiredOn: defaultDate,
  updates: [
    {
      by: defaultString, // user ID of the user who made this update
      action: defaultString,
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // user ID of the user who created this entry
};
const CandidateSchema = new mongoose.Schema(candidateSchemaObject);

CandidateSchema.statics.getSchemaObject = () => candidateSchemaObject;
const Candidate = mongoose.model("Candidate", CandidateSchema);

module.exports = Candidate;
