
const logger = (level, message, details) => {
  console.log(JSON.stringify({
    level,
    message,
    timestamp: new Date().toISOString(),
    context: 'WebApp',
    ...details
  }));
};

export default logger;