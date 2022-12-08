const {
  stringIsEqual,
  isValidMongoObject,
  isValidArrayOfMongoObject,
} = require("../../helpers/validators");
const RegisteredEstate = require("../../model/registered-estate");

class Estate {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
  }
  async __createEstate() {
    const createdOn = new Date();
    // validate request
    if (!this.req.body.name || this.req.body.name.length < 5) {
      return this.res.json({
        success: false,
        message: "Invalid name",
      });
    }
    const newEstate = await new RegisteredEstate({
      status: 1,
      name: !!this.req.body.name.split(",")[0] ? this.req.body.name.split(",")[0].trim() : "",
      location: !!this.req.body.name.split(",")[1] ? this.req.body.name.split(",")[1].trim() : ""
    });
    if (!isValidMongoObject(newEstate)) {
      return this.res.json({
        success: false,
        message: "Error while creating Estate",
      });
    }

    newEstate.save();
    return this.res.json({
      success: true,
      message: "Created Estate Succesfully",
      estate: {
        name: newEstate.name,
        location: newEstate.location,
        _id: newEstate._id,
      },
    });
  }
  async __findAllEstates() {
    const createdOn = new Date();
    // if
    //   (isNaN(Number(this.req.query["limit"])))
    //  {
    //   return this.res.json({
    //     success: false,
    //     message: "Invalid Search params",
    //   });
    // }

    const foundEstates = await RegisteredEstate.find({});
    // if (!isValidMongoObject(foundEstates)) {
    //   return this.res.json({
    //     success: false,
    //     message: "Estates not found",
    //   });
    // }
    if(foundEstates.length <1){
      return this.res.json({
            success: false,
            message: "No Estate found",
          });
    }
    return this.res.json({
      success: true,
      message: "Estates found",
      estates: foundEstates.reduce((sum, estate) => {
        sum.push({
          name: estate.name,
          location: estate.location,
          _id: estate._id,
        });
        return sum;
      }, []),
    });
  }
  async __findEstate(name) {
    const createdOn = new Date();
    // validate name
    const foundEstate = await RegisteredEstate.find({
      status: 1,
      $or: [
        { name: { $regex: new RegExp(`${name}`, "i") } },
        { location: { $regex: new RegExp(`${name}`, "i") } },
      ],
    });

    // if (!isValidMongoObject(foundEstate)) {
    //   return this.res.json({
    //     success: false,
    //     message: "Estate not found",
    //   });
    // }

    return foundEstate;
  }
  async __findEstateWithQueryString() {
    const createdOn = new Date();
    if (!this.req.query["name"] || this.req.query["name"].length < 3) {
      this.res.status(404);
      return this.res.json({
        success: false,
        message: "Estate Not found",
        foundEstate :[],
      });
    }

    let foundEstate = await this.__findEstate(this.req.query["name"]);

    // if (!isValidMongoObject(foundEstate)) {
    //   return foundEstate;
    // }
 
  

    if (isValidArrayOfMongoObject(foundEstate) && foundEstate.length > 0) {
      foundEstate = foundEstate.map(
      (foundEstate)=>{return ({
        name: foundEstate.name,
        location: foundEstate.location,
        _id: foundEstate._id,
      })
    })
    this.res.status(200);
      return this.res.json({
        success: true,
        message: "Estate found",
        foundEstate,
      });
    } else {
      foundEstate = [];
      this.res.status(404);
      return this.res.json({
        success: false,
        message: "Estate Not found",
        foundEstate,
      });
    }

  }
}
module.exports = Estate;
