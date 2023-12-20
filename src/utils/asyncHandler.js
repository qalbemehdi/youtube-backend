const asyncHandler = (fun) => {
    return async (req, res, next) => {
      try {
        await fun(req, res, next);
      } catch (error) {
        // Ensure error object has a valid HTTP status code
        const statusCode = typeof error.code === 'number' && error.code >= 400 && error.code < 600
          ? error.code
          : 500;
  
        res.status(statusCode).json({
          success: false,
          message: error.message,
        });
      }
    };
  };
  
  export default asyncHandler;
  