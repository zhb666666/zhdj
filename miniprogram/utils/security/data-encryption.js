import { SecurityConfig } from '../../config/security.config';

export class DataEncryption {
  static getEncryptionKey() {
    let key = wx.getStorageSync('encryption_key');
    if (!key) {
      key = this.generateKey();
      wx.setStorageSync('encryption_key', key);
    }
    return key;
  }

  static generateKey(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let key = '';
    for (let i = 0; i < length; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  }

  static encrypt(data) {
    if (!data) return '';
    
    try {
      const jsonData = typeof data === 'string' ? data : JSON.stringify(data);
      const key = this.getEncryptionKey();
      
      const encrypted = this.simpleEncrypt(jsonData, key);
      return btoa(encrypted);
    } catch (error) {
      console.error('加密失败:', error);
      throw new Error('数据加密失败');
    }
  }

  static decrypt(encryptedData) {
    if (!encryptedData) return null;
    
    try {
      const key = this.getEncryptionKey();
      const decoded = atob(encryptedData);
      const decrypted = this.simpleDecrypt(decoded, key);
      
      try {
        return JSON.parse(decrypted);
      } catch {
        return decrypted;
      }
    } catch (error) {
      console.error('解密失败:', error);
      throw new Error('数据解密失败');
    }
  }

  static simpleEncrypt(text, key) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  }

  static simpleDecrypt(encryptedText, key) {
    return this.simpleEncrypt(encryptedText, key);
  }

  static hashData(data) {
    const str = typeof data === 'string' ? data : JSON.stringify(data);
    let hash = 0;
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return Math.abs(hash).toString(36);
  }

  static maskSensitiveData(data, fieldName) {
    if (!data) return data;
    
    const pattern = SecurityConfig.dataProtection.maskPatterns[fieldName];
    if (!pattern) return data;
    
    const str = String(data);
    const { start, end, mask } = pattern;
    const endPos = end < 0 ? str.length + end : end;
    
    if (start >= str.length || endPos <= start) return str;
    
    const beforeMask = str.substring(0, start);
    const afterMask = str.substring(endPos);
    const maskLength = endPos - start;
    const masked = mask.repeat(maskLength);
    
    return beforeMask + masked + afterMask;
  }

  static sanitizeInput(input) {
    if (!input) return input;
    
    let sanitized = String(input);
    
    SecurityConfig.validation.input.blacklistPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    sanitized = sanitized
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
    
    if (sanitized.length > SecurityConfig.validation.input.maxLength) {
      sanitized = sanitized.substring(0, SecurityConfig.validation.input.maxLength);
    }
    
    return sanitized;
  }

  static generateToken(userId, role) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    const data = `${userId}:${role}:${timestamp}:${random}`;
    
    return this.encrypt(data);
  }

  static validateToken(token) {
    try {
      const decrypted = this.decrypt(token);
      const parts = decrypted.split(':');
      
      if (parts.length !== 4) return null;
      
      const [userId, role, timestamp] = parts;
      const now = Date.now();
      const tokenAge = now - parseInt(timestamp);
      
      if (tokenAge > SecurityConfig.session.timeout) {
        return null;
      }
      
      return { userId, role, timestamp: parseInt(timestamp) };
    } catch (error) {
      console.error('Token验证失败:', error);
      return null;
    }
  }

  static secureStorage = {
    set(key, value) {
      try {
        const encrypted = DataEncryption.encrypt(value);
        wx.setStorageSync(key, encrypted);
        return true;
      } catch (error) {
        console.error('安全存储失败:', error);
        return false;
      }
    },

    get(key) {
      try {
        const encrypted = wx.getStorageSync(key);
        if (!encrypted) return null;
        return DataEncryption.decrypt(encrypted);
      } catch (error) {
        console.error('安全读取失败:', error);
        return null;
      }
    },

    remove(key) {
      try {
        wx.removeStorageSync(key);
        return true;
      } catch (error) {
        console.error('删除存储失败:', error);
        return false;
      }
    },

    clear() {
      try {
        wx.clearStorageSync();
        return true;
      } catch (error) {
        console.error('清空存储失败:', error);
        return false;
      }
    }
  };
}

export default DataEncryption;
