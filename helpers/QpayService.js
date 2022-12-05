const axios = require("axios");
require("dotenv").config();  

class QpayService {
  constructor(url, payload, header) {
    this.url = url;
    this.payload = payload;
    this.header = header;
  }

  async apiPostRequest(url, payload, header) {
    try {
      return await axios(!this.url ? url : this.url, {
        method: "POST",
        data: !this.payload ? payload : this.payload,
        headers: !this.header ? header : this.header,
      }, setTimeout(() => {}, 3000));
    } catch (error) {
      return error;
    }
  }

  async apiGetRequest(url, header) {
    try {
      return await axios(!this.url ? url : this.url, {
        method: "GET",
        headers: !this.header ? header : this.header,
      });
    } catch (error) {
      return error;
    }
  }
  async apiPutRequest(url, payload, header) {
    try {
      return await axios(!this.url ? url : this.url, {
        method: "PUT",
        data: !this.payload ? payload : this.payload,
        headers: !this.header ? header : this.header,
      });
    } catch (error) {
      return error;
    }
  }
  async apiDeleteRequest(url, header) {
    try {
      return await axios(!this.url ? url : this.url, {
        method: "DELETE",
        headers: !this.header ? header : this.header,
      });
    } catch (error) {
      return error;
    }
  }


}

module.exports = QpayService;