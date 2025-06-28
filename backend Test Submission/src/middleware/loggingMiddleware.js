// This is a placeholder for the logging middleware you created in the Pre-Test Setup.
// You should replace this with your actual middleware file.

const logger = (level, message, details) => {
  // In a real scenario, this would send logs to a centralized logging service.
  // For this example, we'll just log to the console with structured JSON.
  console.log(JSON.stringify({
    level,
    message,
    timestamp: new Date().toISOString(),
    ...details
  }));
};

const loggingMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl, ip } = req;
    const { statusCode } = res;

    const logDetails = {
      message: `HTTP Request`,
      details: {
        method,
        url: originalUrl,
        statusCode,
        durationMs: duration,
        ip,
        userAgent: req.get('User-Agent')
      }
    };
    
    if (statusCode >= 400) {
      logger('error', logDetails.message, logDetails.details);
    } else {
      logger('info', logDetails.message, logDetails.details);
    }
  });

  req.log = logger; // Attach logger to the request object for use in controllers
  next();
};

export default loggingMiddleware;