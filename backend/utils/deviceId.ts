import { Request } from "express";

export const generateDeviceId = (req: Request): string => {
    // İstemciden gelen özel başlığı kullan
    const deviceId = req.headers['x-device-id'] as string;
    
    // Eğer istemci bir deviceId göndermemişse, user-agent'ı kullanmaya devam et
    if (deviceId) {
        return deviceId;
    }

    const userAgent = req.headers['user-agent'] || '';
    const acceptLanguage = req.headers['accept-language'] || '';
    
    const deviceString = `${userAgent}-${acceptLanguage}`;
    
    const crypto = require('crypto');
    return crypto.createHash('md5').update(deviceString).digest('hex');
};