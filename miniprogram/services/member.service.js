import ApiService from './api.service';

export class MemberService {
  static async getMemberList(filters = {}) {
    try {
      const app = getApp();
      const securityManager = app.globalData.securityManager;

      if (!securityManager.validatePermission(app.globalData.role, 'view_all_data')) {
        filters.organizationId = app.globalData.organizationId;
      }

      const queryParams = new URLSearchParams(filters).toString();
      const result = await ApiService.get(`/members?${queryParams}`);

      if (result.success) {
        result.data = result.data.map(member => 
          securityManager.maskSensitiveDataForDisplay(member)
        );

        if (app.globalData.auditLogger) {
          app.globalData.auditLogger.logDataAccess(
            'members',
            'list',
            null
          );
        }
      }

      return result;

    } catch (error) {
      console.error('获取党员列表失败:', error);
      return {
        success: false,
        error: error.message || '获取失败'
      };
    }
  }

  static async getMemberDetail(id) {
    try {
      const app = getApp();
      const securityManager = app.globalData.securityManager;
      
      const result = await ApiService.get(`/members/${id}`);

      if (result.success) {
        if (!securityManager.validatePermission(app.globalData.role, 'view_all_data')) {
          result.data = securityManager.maskSensitiveDataForDisplay(result.data);
        }

        if (app.globalData.auditLogger) {
          app.globalData.auditLogger.logDataAccess(
            'members',
            'detail',
            id
          );
        }
      }

      return result;

    } catch (error) {
      console.error('获取党员详情失败:', error);
      return {
        success: false,
        error: error.message || '获取失败'
      };
    }
  }

  static async createMember(memberData) {
    try {
      const app = getApp();
      const securityManager = app.globalData.securityManager;

      if (!securityManager.validatePermission(app.globalData.role, 'manage_users')) {
        throw new Error('无权创建党员');
      }

      const validationResults = {
        name: securityManager.validateInput(memberData.name, {
          required: true,
          minLength: 2,
          maxLength: 50
        }),
        idCard: securityManager.validateInput(memberData.idCard, {
          required: true,
          custom: (value) => {
            return securityManager.validateIdCard(value) ? null : '身份证号格式不正确';
          }
        }),
        phone: securityManager.validateInput(memberData.phone, {
          required: true,
          custom: (value) => {
            return securityManager.validatePhone(value) ? null : '手机号格式不正确';
          }
        })
      };

      const hasErrors = Object.values(validationResults).some(r => !r.valid);
      if (hasErrors) {
        const errors = Object.entries(validationResults)
          .filter(([_, result]) => !result.valid)
          .map(([field, result]) => result.errors.join(', '));
        
        throw new Error(errors.join('; '));
      }

      const sanitizedData = {
        name: validationResults.name.sanitized,
        gender: memberData.gender,
        nation: memberData.nation,
        idCard: validationResults.idCard.sanitized,
        phone: validationResults.phone.sanitized,
        organizationId: memberData.organizationId || app.globalData.organizationId,
        position: memberData.position,
        joinDate: memberData.joinDate
      };

      const encryptedData = securityManager.encryptSensitiveData(sanitizedData);

      const result = await ApiService.post('/members', encryptedData);

      if (result.success && app.globalData.auditLogger) {
        app.globalData.auditLogger.logDataModification(
          'members',
          'create',
          result.data.id,
          { name: sanitizedData.name }
        );
      }

      return result;

    } catch (error) {
      console.error('创建党员失败:', error);
      return {
        success: false,
        error: error.message || '创建失败'
      };
    }
  }

  static async updateMember(id, memberData) {
    try {
      const app = getApp();
      const securityManager = app.globalData.securityManager;

      if (!securityManager.validatePermission(app.globalData.role, 'manage_users')) {
        throw new Error('无权修改党员信息');
      }

      const result = await ApiService.put(`/members/${id}`, memberData);

      if (result.success && app.globalData.auditLogger) {
        app.globalData.auditLogger.logDataModification(
          'members',
          'update',
          id,
          memberData
        );
      }

      return result;

    } catch (error) {
      console.error('更新党员失败:', error);
      return {
        success: false,
        error: error.message || '更新失败'
      };
    }
  }

  static async deleteMember(id) {
    try {
      const app = getApp();
      const securityManager = app.globalData.securityManager;

      if (!securityManager.validatePermission(app.globalData.role, 'manage_users')) {
        throw new Error('无权删除党员');
      }

      const result = await ApiService.delete(`/members/${id}`);

      if (result.success && app.globalData.auditLogger) {
        app.globalData.auditLogger.logDataModification(
          'members',
          'delete',
          id
        );
      }

      return result;

    } catch (error) {
      console.error('删除党员失败:', error);
      return {
        success: false,
        error: error.message || '删除失败'
      };
    }
  }

  static async importMembers(filePath) {
    try {
      const app = getApp();
      const securityManager = app.globalData.securityManager;

      if (!securityManager.validatePermission(app.globalData.role, 'manage_users')) {
        throw new Error('无权导入党员');
      }

      const result = await ApiService.uploadFile(
        filePath,
        '/members/import',
        {
          organizationId: app.globalData.organizationId
        }
      );

      if (result.success && app.globalData.auditLogger) {
        app.globalData.auditLogger.logDataModification(
          'members',
          'import',
          null,
          { count: result.data.count }
        );
      }

      return result;

    } catch (error) {
      console.error('导入党员失败:', error);
      return {
        success: false,
        error: error.message || '导入失败'
      };
    }
  }

  static async exportMembers(filters = {}) {
    try {
      const app = getApp();
      const securityManager = app.globalData.securityManager;

      if (!securityManager.validatePermission(app.globalData.role, 'export_data')) {
        throw new Error('无权导出党员数据');
      }

      const queryParams = new URLSearchParams(filters).toString();
      const result = await ApiService.get(`/members/export?${queryParams}`);

      if (result.success && app.globalData.auditLogger) {
        app.globalData.auditLogger.logDataExport(
          'members',
          result.data.count,
          'excel'
        );
      }

      return result;

    } catch (error) {
      console.error('导出党员失败:', error);
      return {
        success: false,
        error: error.message || '导出失败'
      };
    }
  }
}

export default MemberService;
