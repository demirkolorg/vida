// server/app/database/controller.js
import dotenv from 'dotenv';
dotenv.config();


export const currentDb = async (req, res) => {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return res.status(500).json({ error: 'DATABASE_URL sunucuda tanımlanmamış.' });
  try {
    const url = new URL(dbUrl);
    const databaseName = url.pathname.substring(1);
    res.json({ databaseName: databaseName });
  } catch (error) {
    res.status(500).json({ error: 'DATABASE_URL ayrıştırılamadı.' });
  }
};

export const health = async (req, res) => {
  try {
    const client = databaseManager.getClient();
    await client.$queryRaw`SELECT 1`;

    const currentInfo = databaseManager.getCurrentInfo();

    res.status(200).json({
      success: true,
      message: 'Database health check successful',
      data: {
        healthy: true,
        database: currentInfo?.database || 'unknown',
        name: currentInfo?.name || 'Unknown Database',
        connectedAt: currentInfo?.connectedAt,
        status: currentInfo?.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database health check failed',
      error: error.message,
      data: {
        healthy: false,
      },
    });
  }
};

export const getCurrentDatabase = async (req, res) => {
  try {
    const currentInfo = databaseManager.getCurrentInfo();

    if (!currentInfo) {
      return res.status(404).json({
        success: false,
        message: 'No current database information available',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Current database info retrieved',
      data: currentInfo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get current database info',
      error: error.message,
    });
  }
};

export const getDatabaseStatuses = async (req, res) => {
  try {
    const statuses = await databaseManager.getAllStatuses();

    res.status(200).json({
      success: true,
      message: 'Database statuses retrieved',
      data: statuses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get database statuses',
      error: error.message,
    });
  }
};

export const getDatabaseList = async (req, res) => {
  try {
    const databases = databaseManager.getDatabaseList();

    res.status(200).json({
      success: true,
      message: 'Database list retrieved',
      data: databases,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get database list',
      error: error.message,
    });
  }
};

export const testConnection = async (req, res) => {
  try {
    const { connectionString, databaseId } = req.body;

    let urlToTest;

    if (databaseId && databaseConfigs[databaseId]) {
      urlToTest = databaseConfigs[databaseId].url;
    } else if (connectionString) {
      urlToTest = connectionString;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Connection string or valid database ID required',
      });
    }

    const result = await databaseManager.testConnection(urlToTest);

    res.status(result.success ? 200 : 500).json({
      success: result.success,
      message: result.message,
      data: {
        connectionString: urlToTest,
        tested: true,
        testTime: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection test failed',
      error: error.message,
    });
  }
};

export const switchDatabase = async (req, res) => {
  try {
    const { databaseId, connectionString, database, name } = req.body;

    let targetConfig;

    // Determine target configuration
    if (databaseId && databaseConfigs[databaseId]) {
      targetConfig = databaseConfigs[databaseId];
    } else if (connectionString) {
      // Custom database configuration
      targetConfig = {
        url: connectionString,
        name: name || 'Custom Database',
        database: database || 'custom',
        type: 'custom',
      };
    } else {
      return res.status(400).json({
        success: false,
        message: 'Database ID or connection string required',
      });
    }

    // Perform the switch
    await databaseManager.switchDatabase(targetConfig);

    const currentInfo = databaseManager.getCurrentInfo();

    res.status(200).json({
      success: true,
      message: `Database successfully switched to ${targetConfig.name}`,
      data: {
        database: currentInfo.database,
        name: currentInfo.name,
        type: currentInfo.type,
        connectedAt: currentInfo.connectedAt,
        switchedBy: req.user?.id || 'unknown',
        previousDatabase: req.body.previousDatabase || null,
      },
    });
  } catch (error) {
    console.error('Database switch error:', error);
    res.status(500).json({
      success: false,
      message: 'Database switch failed',
      error: error.message,
    });
  }
};

export const refreshAllConnections = async (req, res) => {
  try {
    // Refresh current connection
    await databaseManager.refreshConnection();

    // Get updated status
    const currentInfo = databaseManager.getCurrentInfo();
    const allStatuses = await databaseManager.getAllStatuses();

    res.status(200).json({
      success: true,
      message: 'All database connections refreshed',
      data: {
        refreshedAt: new Date().toISOString(),
        currentDatabase: currentInfo,
        allStatuses: allStatuses,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to refresh connections',
      error: error.message,
    });
  }
};
