export const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
};

export const SERVICES = {
  restaurant: 'https://restaurant-service-ilaj.onrender.com',
  user: 'https://user-service-f124.onrender.com',
  order: 'https://order-service-96vx.onrender.com',
};

export const ERROR_MESSAGES = {
  INVALID_SERVICE: 'Invalid service specified',
  MISSING_FIELDS: 'Missing required fields',
  RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later',
  SERVICE_ERROR: 'Service error occurred',
  INTERNAL_ERROR: 'Internal server error',
}; 