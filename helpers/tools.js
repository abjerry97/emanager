

const bcrypt = require("bcrypt"), requestIp = require("request-ip"), assert = require("assert");
const { stringIsEqual, isValidPhonenumber } = require("./validators");
const doResearchFromHost = (host, cb) => {
  let defaultResponse = {
    success: true,
    message: "host is not specified",
  };

  if (!host) {
    //host is not specified
    cb(defaultResponse);
  } else if (host.split(appData.domainName).length <= 1) {
    //host doesn't contain neccesary domain name
    defaultResponse.message = "host doesn't contain neccesary domain name";
    cb(defaultResponse);
  } else if (host.split(appData.domainName)[0].split(".").length <= 1) {
    //no subdomain specified
    defaultResponse.message = "no subdomain specified";
    cb(defaultResponse);
  } else {
    let subdomainArray = host
      .split(appData.domainName)[0]
      .split(".")
      .filter((currentString) => {
        return !stringIsEqual(currentString, "");
      });
    if (subdomainArray.length > 0) {
      let lastSubdomain = subdomainArray[subdomainArray.length - 1];
      defaultResponse.lastSubdomain = lastSubdomain;
      defaultResponse.message = "subdomain specified";
      cb(defaultResponse);
    } else {
      //no company specified
      defaultResponse.message = "no subdomain specified";
      cb(defaultResponse);
    }
  }
};
function isHashedString(password, hashedString) {
  return bcrypt.compareSync(password, hashedString);
}

function formatPhonenumber(phone) {
  if( isValidPhonenumber(phone)){
    if(phone.charAt(0) =="+"){
      return [ phone.slice(0,4), phone.slice(4)]
    }
    else if(stringIsEqual( phone.substring(0,3), "234")){
      return [ "+"+phone.slice(0,3), phone.slice(3)]
    }
   else {
     return [ "+234", phone.slice(1)]
   }
  }
  return Array(2).fill(0)
 }



 function QpayWalletHeader(jwt) {
 return { Authorization: "Bearer " +  jwt,
 "Content-Type": "application/json"}

}
module.exports = {
  doResearchFromHost,
  isHashedString,
  formatPhonenumber,
  QpayWalletHeader
};
