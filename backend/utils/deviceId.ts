import { Request } from "express";

export const generateDeviceId = (req: Request): string => {
  const deviceId = req.headers['x-device-id'] as string; // 1. Öncelik
  if (deviceId) {
    return deviceId;
  }
  const userAgent = req.headers['user-agent'] || 'unknown'; // 2. Öncelik
  const crypto = require('crypto');
  return crypto.createHash('md5').update(userAgent).digest('hex');
};