const vault = require('node-vault');
const logger = require('../utils/logger');

class VaultService {
  constructor() {
    this.client = null;
    this.initialized = false;
  }

  async initialize() {
    try {
      this.client = vault({
        apiVersion: 'v1',
        endpoint: process.env.VAULT_ADDR || 'http://localhost:8200',
        token: process.env.VAULT_TOKEN || 'myroot'
      });

      // Test connection
      await this.client.read('sys/health');
      
      // Initialize secrets if they don't exist
      await this.initializeSecrets();
      
      this.initialized = true;
      logger.info('Vault service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Vault service:', error);
      throw error;
    }
  }

  async initializeSecrets() {
    const secrets = {
      'jwt-secret': this.generateSecureSecret(64),
      'refresh-token-secret': this.generateSecureSecret(64),
      'encryption-key': this.generateSecureSecret(32),
      'api-key': this.generateSecureSecret(32)
    };

    for (const [key, value] of Object.entries(secrets)) {
      try {
        // Check if secret already exists
        await this.client.read(`secret/data/${key}`);
        logger.info(`Secret ${key} already exists`);
      } catch (error) {
        if (error.response && error.response.statusCode === 404) {
          // Secret doesn't exist, create it
          await this.client.write(`secret/data/${key}`, {
            data: { value }
          });
          logger.info(`Created secret: ${key}`);
        } else {
          logger.error(`Error checking secret ${key}:`, error);
        }
      }
    }
  }

  async getSecret(secretName) {
    if (!this.initialized) {
      throw new Error('Vault service not initialized');
    }

    try {
      const result = await this.client.read(`secret/data/${secretName}`);
      return result.data.data.value;
    } catch (error) {
      logger.error(`Failed to get secret ${secretName}:`, error);
      throw error;
    }
  }

  async setSecret(secretName, secretValue) {
    if (!this.initialized) {
      throw new Error('Vault service not initialized');
    }

    try {
      await this.client.write(`secret/data/${secretName}`, {
        data: { value: secretValue }
      });
      logger.info(`Secret ${secretName} updated successfully`);
    } catch (error) {
      logger.error(`Failed to set secret ${secretName}:`, error);
      throw error;
    }
  }

  async deleteSecret(secretName) {
    if (!this.initialized) {
      throw new Error('Vault service not initialized');
    }

    try {
      await this.client.delete(`secret/data/${secretName}`);
      logger.info(`Secret ${secretName} deleted successfully`);
    } catch (error) {
      logger.error(`Failed to delete secret ${secretName}:`, error);
      throw error;
    }
  }

  generateSecureSecret(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Database credentials management
  async getDatabaseCredentials(dbName) {
    try {
      const credentials = await this.client.read(`secret/data/db-${dbName}`);
      return credentials.data.data;
    } catch (error) {
      logger.error(`Failed to get database credentials for ${dbName}:`, error);
      throw error;
    }
  }

  async setDatabaseCredentials(dbName, username, password) {
    try {
      await this.client.write(`secret/data/db-${dbName}`, {
        data: { username, password }
      });
      logger.info(`Database credentials for ${dbName} updated successfully`);
    } catch (error) {
      logger.error(`Failed to set database credentials for ${dbName}:`, error);
      throw error;
    }
  }

  // API keys management
  async getApiKey(serviceName) {
    try {
      const result = await this.client.read(`secret/data/api-key-${serviceName}`);
      return result.data.data.key;
    } catch (error) {
      logger.error(`Failed to get API key for ${serviceName}:`, error);
      throw error;
    }
  }

  async rotateSecret(secretName) {
    try {
      const newSecret = this.generateSecureSecret(64);
      await this.setSecret(secretName, newSecret);
      logger.info(`Secret ${secretName} rotated successfully`);
      return newSecret;
    } catch (error) {
      logger.error(`Failed to rotate secret ${secretName}:`, error);
      throw error;
    }
  }
}

module.exports = new VaultService();
