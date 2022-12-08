const { isValidObjectId } = require("mongoose");
const responseBody = require("../../helpers/responseBody");
const { isValidFullName, isEmail, isValidPhonenumber,isValidHouseAddress, isValidPassword, isValidMongoObject } = require("../../helpers/validators");

const validateEstateName = (req, res, next) => {
    const name = req?.body?.name;
    if (!name || name.length < 5) {
      return responseBody.validationErrorWithData(
        res,
        "Provide a valid name not less than 5 characters",
        "name",
        name
      );
    }
    next();
  };
  const validateEstateQueryParams = (req, res, next) => {
    const {name,page,pageSize} = req?.query || {};
    // if (name.length < 3) {
    //   return responseBody.validationErrorWithData(
    //     res,
    //     "Provide a valid estate name not less than 3 characters",
    //     "name",
    //     name
    //   );
    // }
    if (page && isNaN(page)) {
      return responseBody.validationErrorWithData(
        res,
        "Provide a valid page number, an integer",
        "page",
        page
      );
    }
    if (pageSize && isNaN(pageSize)) {
      return responseBody.validationErrorWithData(
        res,
        "Provide a valid page size, an integer",
        "pageSize",
        pageSize
      );
    }
    next();
  };
  const validateCreateUser = (req, res, next) => {
    if (isValidMongoObject(res.user)) { 
      return responseBody.ErrorResponse(res,"Already have an active session")  
    }
    const {name,email,phone,houseAddress,password,houseOwnerType,apartmentType} = req?.body || {};
    const {estateId} = req.query
    if(!isValidObjectId(estateId))  {
      return responseBody.validationErrorWithData(
        res,
        "Provide a valid estate id",
        "estateId",
        estateId
      );
    }
    if (!name || !isValidFullName(name)) {
      return responseBody.validationErrorWithData(
        res,
        "Provide a valid Full Name, i.e first name and last name",
        "name",
        name
      );
    }
    if (!email || !isEmail(email)) {
      return responseBody.validationErrorWithData(
        res,
        "Provide a valid email",
        "email",
        email
      );
    }
    if(!phone || !isValidPhonenumber(phone))  {
      return responseBody.validationErrorWithData(
        res,
        "Provide a valid phone number",
        "phone",
        phone
      );
    }
    if (!houseAddress || !isValidHouseAddress(houseAddress)) {
      return responseBody.validationErrorWithData(
        res,
        "Provide a valid house address, i.e magodo road",
        "houseAddress",
        houseAddress
      );
    }
    if (!password || !isValidPassword(password)) {
      return responseBody.validationErrorWithData(
        res,
        "Provide a valid password, numeric 4 digits",
        "password",
        password
      );
    }
    if (!isNaN(houseOwnerType) || houseOwnerType?.length < 3) {
      return responseBody.validationErrorWithData(
        res,
        "Provide a valid house owner type i.e Landlord, tenant...",
        "houseOwnerType",
        houseOwnerType
      );
    }
    if (!apartmentType || apartmentType?.length < 3) {
      return responseBody.validationErrorWithData(
        res,
        "Provide a valid house owner type i.e Duplex, Bungalow...",
        "apartmentType",
        apartmentType
      );
    }

   
    next();
  };
  const validateUserLogin = (req, res, next) => {
    if (isValidMongoObject(res.user)) { 
      return responseBody.ErrorResponse(res,"Already have an active session")  
    }
    const {email,phone,password} = req?.body || {};
    const {estateId} = req.query
    if(!isValidObjectId(estateId))  {
      return responseBody.validationErrorWithData(
        res,
        "Provide a valid estate id",
        "estateId",
        estateId
      );
    } 
    if(!email && !phone)  {
      return responseBody.validationErrorWithData(
        res,
        "Provide a valid email or phone number",
        "phone",
        phone
      );
    } 
    if (email && !isEmail(email)) {
      return responseBody.validationErrorWithData(
        res,
        "Provide a valid email",
        "email",
        email
      );
    }
    if(phone && !isValidPhonenumber(phone))  {
      return responseBody.validationErrorWithData(
        res,
        "Provide a valid phone number",
        "phone",
        phone
      );
    }  
    if(!password ||  !isValidPassword(password))  {
      return responseBody.validationErrorWithData(
        res,
        "Provide a valid password",
        "password",
     " ****"
      );
    }  
  

   
    next();
  };

module.exports = {
  validateEstateName,
  validateEstateQueryParams,
  validateCreateUser,
  validateUserLogin
};
