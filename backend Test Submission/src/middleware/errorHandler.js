const errorHandler = (err, req, res, next) => {
  req.log('error', 'An unhandled error occurred', {
    errorMessage: err.message,
    stack: err.stack,
  });

  res.status(500).json({
    error: 'An internal server error occurred.',
    message: err.message, // Only for development; remove in production
  });
};

export default errorHandler;