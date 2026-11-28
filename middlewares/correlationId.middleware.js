import { v4 as uuidv4 } from 'uuid';

export const correlationIdMiddleware = (req, res, next) => {
  // Use existing ID if forwarded from another service, else generate new
  const correlationId = req.headers['x-correlation-id'] || uuidv4();
  
  // Attach to request object so all handlers can access it
  req.correlationId = correlationId;
  
  // Send it back in response headers so client can reference it
  res.setHeader('X-Correlation-ID', correlationId);
  
  next();
};