// server/app/database/service.js

import { PrismaClient } from '@prisma/client';
import { databaseConfigs, buildConnectionString, DEFAULT_DATABASE } from './base.js';

class DatabaseService {
  constructor() {
    this.currentDatabase = DEFAULT_DATABASE;
    this.connections = new Map();
    this.connectionStatuses = new Map();
    this.mainPrisma = null;
    this.initializeDefault();
  }

  // Varsayılan veritabanını başlat
  initializeDefault() {
    try {
      const defaultConfig = databaseConfigs[DEFAULT_DATABASE];
      if (defaultConfig) {
        this.currentDatabase = DEFAULT_DATABASE;
        this.setConnectionStatus(DEFAULT_DATABASE, 'connected', null);
      }
    } catch (error) {
      console.error('Varsayılan veritabanı başlatılamadı:', error);
      this.setConnectionStatus(DEFAULT_DATABASE, 'error', error.message);
    }
  }

  // Mevcut aktif veritabanını al
  getCurrentDatabase() {
    try {
      const config = databaseConfigs[this.currentDatabase];
      if (!config) {
        throw new Error(`Aktif veritabanı konfigürasyonu bulunamadı: ${this.currentDatabase}`);
      }

      return {
        success: true,
        database: config.database,
        databaseId: config.id,
        name: config.name,
        type: config.type,
        description: config.description,
        host: config.host,
        port: config.port,
        schema: config.schema,
        connectionString: buildConnectionString(config)
      };
    } catch (error) {
      console.error('Mevcut veritabanı bilgisi alınamadı:', error);
      return {
        success: false,
        error: error.message,
        database: null
      };
    }
  }

  // Veritabanı durumlarını al
  getDatabaseStatuses() {
    try {
      const statuses = {};
      
      Object.keys(databaseConfigs).forEach(dbId => {
        const config = databaseConfigs[dbId];
        const status = this.connectionStatuses.get(dbId) || {
          status: 'unknown',
          lastConnected: new Date().toISOString(),
          error: null
        };

        statuses[config.database] = {
          ...status,
          databaseId: dbId,
          name: config.name,
          type: config.type
        };
      });

      return {
        success: true,
        statuses
      };
    } catch (error) {
      console.error('Veritabanı durumları alınamadı:', error);
      return {
        success: false,
        error: error.message,
        statuses: {}
      };
    }
  }

  // Veritabanı bağlantısını test et
  async testConnection(connectionString) {
    let testPrisma = null;
    
    try {
      // Geçerli connection string kontrolü
      if (!connectionString || typeof connectionString !== 'string') {
        throw new Error('Geçersiz bağlantı dizesi');
      }

      // Test için yeni Prisma instance oluştur
      testPrisma = new PrismaClient({
        datasources: {
          db: {
            url: connectionString
          }
        },
        log: ['error']
      });

      // Bağlantıyı test et
      await testPrisma.$connect();
      
      // Basit bir sorgu ile veritabanının çalıştığını doğrula
      await testPrisma.$queryRaw`SELECT 1 as test`;

      return {
        success: true,
        message: 'Veritabanı bağlantısı başarılı',
        connectionString: connectionString
      };

    } catch (error) {
      console.error('Veritabanı bağlantı testi başarısız:', error);
      
      let errorMessage = 'Bilinmeyen hata';
      
      if (error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Veritabanı sunucusuna bağlanılamıyor';
      } else if (error.message.includes('authentication')) {
        errorMessage = 'Kimlik doğrulama hatası';
      } else if (error.message.includes('database') && error.message.includes('does not exist')) {
        errorMessage = 'Veritabanı bulunamadı';
      } else {
        errorMessage = error.message;
      }

      return {
        success: false,
        message: errorMessage,
        error: error.message,
        connectionString: connectionString
      };
    } finally {
      // Test bağlantısını kapat
      if (testPrisma) {
        try {
          await testPrisma.$disconnect();
        } catch (disconnectError) {
          console.error('Test bağlantısı kapatılamadı:', disconnectError);
        }
      }
    }
  }

  // Veritabanını değiştir
  async switchDatabase(databaseId) {
    try {
      // Konfigürasyon kontrolü
      const config = databaseConfigs[databaseId];
      if (!config) {
        throw new Error(`Geçersiz veritabanı ID'si: ${databaseId}`);
      }

      // Zaten aktif mi kontrol et
      if (this.currentDatabase === databaseId) {
        return {
          success: true,
          message: 'Bu veritabanı zaten aktif',
          database: config.database,
          databaseId: databaseId,
          warning: true
        };
      }

      const connectionString = buildConnectionString(config);

      // Önce bağlantıyı test et
      const testResult = await this.testConnection(connectionString);
      if (!testResult.success) {
        this.setConnectionStatus(databaseId, 'error', testResult.error);
        throw new Error(`Veritabanı bağlantısı başarısız: ${testResult.message}`);
      }

      // Eski bağlantıyı kapat (varsa)
      if (this.connections.has(this.currentDatabase)) {
        try {
          await this.connections.get(this.currentDatabase).$disconnect();
          this.connections.delete(this.currentDatabase);
        } catch (error) {
          console.error('Eski bağlantı kapatılamadı:', error);
        }
      }

      // Yeni veritabanını aktif yap
      this.currentDatabase = databaseId;
      this.setConnectionStatus(databaseId, 'connected', null);

      // Environment variable'ı güncelle (runtime için)
      process.env.DATABASE_URL = connectionString;

      return {
        success: true,
        message: `Veritabanı başarıyla değiştirildi: ${config.name}`,
        database: config.database,
        databaseId: databaseId,
        name: config.name,
        type: config.type,
        connectionString: connectionString
      };

    } catch (error) {
      console.error('Veritabanı değiştirme hatası:', error);
      
      if (databaseId) {
        this.setConnectionStatus(databaseId, 'error', error.message);
      }

      return {
        success: false,
        message: 'Veritabanı değiştirilemedi',
        error: error.message,
        databaseId: databaseId
      };
    }
  }

  // Bağlantı durumunu güncelle
  setConnectionStatus(databaseId, status, error = null) {
    this.connectionStatuses.set(databaseId, {
      status: status,
      lastConnected: new Date().toISOString(),
      error: error
    });
  }

  // Bağlantı durumunu al
  getConnectionStatus(databaseId) {
    return this.connectionStatuses.get(databaseId) || {
      status: 'unknown',
      lastConnected: new Date().toISOString(),
      error: null
    };
  }

  // Tüm bağlantıları kapat
  async disconnectAll() {
    const promises = [];
    
    for (const [dbId, connection] of this.connections) {
      promises.push(
        connection.$disconnect().catch(error => {
          console.error(`${dbId} bağlantısı kapatılamadı:`, error);
        })
      );
    }

    await Promise.all(promises);
    this.connections.clear();
  }

  // Veritabanı listesini al
  getDatabaseList() {
    return Object.keys(databaseConfigs).map(dbId => {
      const config = databaseConfigs[dbId];
      const status = this.getConnectionStatus(dbId);
      
      return {
        id: config.id,
        name: config.name,
        database: config.database,
        type: config.type,
        description: config.description,
        host: config.host,
        port: config.port,
        isActive: this.currentDatabase === dbId,
        ...status
      };
    });
  }
}

// Singleton instance
const databaseService = new DatabaseService();

export default databaseService;