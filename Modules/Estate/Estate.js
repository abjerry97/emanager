const responseBody = require("../../helpers/responseBody");
const scheamaTools = require("../../helpers/scheamaTools"); 

class Estate {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
  }
  async __createEstate() {
    const createdOn = new Date();
    const name = this.req.body.name || "";

    const newEstate = await scheamaTools.createEstate({
      status: 1,
      name: name.split(",")[0].trim() || "",
      location: name.split(",")[1].trim() || "",
      createdOn,
    });
    if (!newEstate) {
      return responseBody.ErrorResponse(
        this.res,
        "Error while creating Estate"
      );
    }
    newEstate.save();

    return responseBody.successResponseWithData(
      this.res,
      "Estate created Succesfully",
      "estate",
      {
        name: newEstate.name,
        location: newEstate.location,
        _id: newEstate._id,
      }
    );
  }
  async __findAllEstates() {
    const createdOn = new Date();
    scheamaTools.findEstates();
    const { name, page, pageSize } = this.req.query || {};
    const query = { status: 1 };
    if (name?.length >= 3) {
      query["$or"] = [
        { name: { $regex: new RegExp(`${name}`, "i") } },
        { location: { $regex: new RegExp(`${name}`, "i") } },
      ];
    }
    const foundEstates = await scheamaTools.findEstates(query, pageSize, page);

    if (!foundEstates) {
      return responseBody.notFoundResponse(this.res, "No Estate found");
    }
    return responseBody.successResponseWithData(
      this.res,
      "Estates found",
      "estate",
      foundEstates
    );
  }
  async __findEstate(estateId) {
    const createdOn = new Date(); 
    const foundEstate = await scheamaTools.findEstate({
      status: 1,
      _id:estateId,
    });  
    if (!foundEstate) {
      return responseBody.notFoundResponse(this.res, "Estate not found");
    }
     
    return foundEstate;
  } 
}
module.exports = Estate;
