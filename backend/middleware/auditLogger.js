import AuditLog from '../models/AuditLog.js';

export const auditLogger = (actionDescription) => {
  return async (req, res, next) => {
    // We only log if req.user exists (is logged in) and the request is mutating state
    const originalJson = res.json;

    res.json = function (data) {
      res.json = originalJson;
      
      // Execute logging asynchronously in background
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const userId = req.user ? req.user._id : null;
        const userName = req.user ? req.user.name : 'System/Guest';
        
        let target = req.originalUrl;
        if (req.params.id) {
          target += ` (ID: ${req.params.id})`;
        } else if (req.body && req.body.title) {
          target += ` (Title: ${req.body.title})`;
        } else if (req.body && req.body.name) {
          target += ` (Name: ${req.body.name})`;
        }

        AuditLog.create({
          user: userId,
          userName: userName,
          action: actionDescription || `${req.method} ${req.baseUrl}`,
          target: target,
          details: {
            method: req.method,
            body: req.body ? { ...req.body, password: '[REDACTED]', resetPasswordToken: '[REDACTED]' } : {},
            status: res.statusCode,
          },
          ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
          userAgent: req.headers['user-agent'] || 'Unknown',
        }).catch((err) => console.error('Error logging audit activity:', err.message));
      }

      return originalJson.call(this, data);
    };

    next();
  };
};
