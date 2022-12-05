const cloudinary = require("cloudinary").v2;

cloudinary.config({ 
    cloud_name: 'qlab', 
    api_key: '749422311556775', 
    api_secret: 'KhjEuggX6OwEGfvtO24qQfnsBdA' 
  });
  
  module.exports = cloudinary