// server/app/database/middleware.js

import databaseService from './service.js';

/**
 * Database connection middleware
 * Her request'te mevcut veritabanı bilgisini req.database'e ekler
 */
export const databaseMiddleware = (req, res, next) => {
  try {
    const currentDb = databaseService.getCurrentDatabase();
    
    if (currentDb.success) {
      req.database = {
        id: currentDb.databaseId,
        name: currentDb.database,
        type: currentDb.type,
        connectionString: currentDb.connectionString
      };
    } else {
      req.database = {
        id: null,
        name: null,
        type: 'unknown',
        connectionString: null,
        error: currentDb.error
      };
    }
    
    next();
  } catch (error) {
    console.error('Database middleware error:', error);
    req.database = {
      id: null,
      name: null,
      type: 'error',
      connectionString: null,
      error: error.message
    };
    next();
  }
};

/**
 * Database health check middleware
 * Kritik endpoint'ler için veritabanı bağlantısını kontrol eder
 */
export const requireDatabaseConnection = async (req, res, next) => {
  try {
    const currentDb = databaseService.getCurrentDatabase();
    
    if (!currentDb.success) {
      return res.status(503).json({
        success: false,
        message: 'Veritabanı bağlantısı mevcut değil',
        error: currentDb.error,
        code: 'DATABASE_UNAVAILABLE'
      });
    }

    // Bağlantıyı test et
    const testResult = await databaseService.testConnection(currentDb.connectionString);
    
    if (!testResult.success) {
      return res.status(503).json({
        success: false,
        message: 'Veritabanı bağlantısı başarısız',
        error: testResult.error,
        code: 'DATABASE_CONNECTION_FAILED'
      });
    }

    next();
  } catch (error) {
    console.error('Database connection check failed:', error);
    return res.status(503).json({
      success: false,
      message: 'Veritabanı bağlantı kontrolü başarısız',
      error: error.message,
      code: 'DATABASE_CHECK_FAILED'
    });
  }
};

/**
 * Production database protection middleware
 * Production veritabanında tehlikeli işlemleri engeller
 */
export const protectProductionDatabase = (req, res, next) => {
  try {
    const currentDb = databaseService.getCurrentDatabase();
    
    if (currentDb.success && currentDb.type === 'production') {
      // Tehlikeli HTTP metodlarını kontrol et
      const dangerousMethods = ['DELETE'];
      const dangerousRoutes = ['/delete', '/truncate', '/drop', '/reset'];
      
      if (dangerousMethods.includes(req.method) || 
          dangerousRoutes.some(route => req.path.includes(route))) {
        
        return res.status(403).json({
          success: false,
          message: 'Production veritabanında bu işlem yasaktır',
          database: currentDb.name,
          operation: `${req.method} ${req.path}`,
          code: 'PRODUCTION_OPERATION_FORBIDDEN'
        });
      }
    }
    
    next();
  } catch (error) {
    console.error('Production protection middleware error:', error);
    next(); // Hata durumunda işleme devam et
  }
};

export default {
  databaseMiddleware,
  requireDatabaseConnection,
  protectProductionDatabase
};