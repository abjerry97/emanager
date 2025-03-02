let Id = require("valid-objectid");

let isValidMongoObjectId = (str) => {
  let finalValue = false;
  if (str) {
    finalValue = Id.isValid(str);
    return finalValue;
  }
  return finalValue;
};
const isValidFullName = (name) => {
  const newName = name?.trim()
  let regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
  if (!regName.test(newName)) {
    return false;
  } else {
    return true;
  }
};
const isValidHouseAddress = (address) => {
   
  if (address.length < 6) {
    return false;
  } else {
    return true;
  }
};

const stringIsEqual = (firstString, secondString) => {
  return (
    new String(firstString).valueOf() == new String(secondString).valueOf()
  );
};

let isValidMongoObject = (mongoObject) => {
  let finalValue =
    mongoObject !== null &&
    mongoObject !== undefined &&
    mongoObject !== {} &&
    mongoObject._id !== null &&
    mongoObject._id !== undefined &&
    isValidMongoObjectId(mongoObject._id);
  return finalValue;
};

const isEmail = (email) => {
  let re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const isValidUsername = (username) => {
  if (typeof username == "string") {
    if (isValidMongoObjectId(username)) {
      return false;
    } else {
      return /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(
        username
      );
    }
  }
  return false;
};
const  isValidPhonenumber = (phone) =>{
  // var regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;

 phone = String(phone)
  if (isNaN(phone)) {
    return false;
  }
  if (phone.length == 14 && phone.charAt(0) == "+") { 
    return true;
  }
  if (phone.length == 13 && stringIsEqual( phone.substring(0,3), "234")) {
    return true;
  } else if (phone.charAt(0) == "0" && phone.length == 11) {
    return true;
  } else {
    return false;
  }
}
const  isValidPassword = (password) =>{
  if(!!password && password.length <15 &&  password.length >3){ 
    return true
  } 
  return false
}

const isValidArrayOfMongoObject = (array) => {
  if (Array.isArray(array)) {
    for (let vvv = 0; vvv < array.length; vvv++) {
      if (!isValidMongoObject(array[vvv])) {
        return false;
      }
    }
  } else {
    return false;
  }
  return true;
};
module.exports = {
  isValidUsername,
  isEmail,
  isValidMongoObjectId,
  stringIsEqual,
  isValidMongoObject,
  isValidFullName,
  isValidPhonenumber,
  isValidArrayOfMongoObject,
  isValidPassword,
  isValidHouseAddress
};
