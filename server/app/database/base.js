// server/app/database/base.js

export const HumanName = "Database";   
export const HizmetName = "DATABASE"; 
export const PrismaName = "database"; 
export const VarlıkKod = "DB";

// Desteklenen veritabanı konfigürasyonları
export const databaseConfigs = {
  'vida-main': {
    id: 'vida-main',
    name: 'VIDA Ana DB',
    database: 'vida',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    type: 'production',
    description: 'Ana üretim veritabanı',
    schema: 'public'
  },
  'vida-test': {
    id: 'vida-test',
    name: 'VIDA Test DB',
    database: 'vida-test',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    type: 'testing',
    description: 'Test ortamı veritabanı',
    schema: 'public'
  },
  'vida-backup': {
    id: 'vida-backup',
    name: 'VIDA Backup DB',
    database: 'vida-backup',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    type: 'backup',
    description: 'Yedek veritabanı',
    schema: 'public'
  }
};

// Connection string oluşturma
export const buildConnectionString = (config) => {
  return `postgresql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}?schema=${config.schema}`;
};

// Varsayılan veritabanı
export const DEFAULT_DATABASE = 'vida-main';