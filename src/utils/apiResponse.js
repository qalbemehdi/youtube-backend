class ApiResponse {
    constructor(statusCode, data, message = "Success") {
      this.statusCode = statusCode;
      this.data = data;
      this.message = message;
    }
  
    static send(res, statusCode = 200, data = null, message = "Success") {
      const apiResponse = new ApiResponse(statusCode, data, message);
      res.status(apiResponse.statusCode).json(apiResponse);
    }
  }
  
  export default ApiResponse;
  