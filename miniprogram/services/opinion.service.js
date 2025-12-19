import ApiService from './api.service';

export class OpinionService {
  static async getOpinionList(filters = {}) {
    try {
      const app = getApp();
      const queryParams = new URLSearchParams(filters).toString();
      const result = await ApiService.get(`/opinions?${queryParams}`);

      if (result.success && app.globalData.auditLogger) {
        app.globalData.auditLogger.logDataAccess(
          'opinions',
          'list',
          null
        );
      }

      return result;

    } catch (error) {
      console.error('获取意见稿列表失败:', error);
      return {
        success: false,
        error: error.message || '获取失败'
      };
    }
  }

  static async getOpinionDetail(id) {
    try {
      const app = getApp();
      const result = await ApiService.get(`/opinions/${id}`);

      if (result.success && app.globalData.auditLogger) {
        app.globalData.auditLogger.logDataAccess(
          'opinions',
          'detail',
          id
        );
      }

      return result;

    } catch (error) {
      console.error('获取意见稿详情失败:', error);
      return {
        success: false,
        error: error.message || '获取失败'
      };
    }
  }

  static async submitOpinion(opinionData) {
    try {
      const app = getApp();
      const securityManager = app.globalData.securityManager;

      const validationResults = {
        subject: securityManager.validateInput(opinionData.subject, {
          required: true,
          minLength: 2,
          maxLength: 100
        }),
        content: securityManager.validateInput(opinionData.content, {
          required: true,
          minLength: 10,
          maxLength: 5000
        }),
        phone: securityManager.validateInput(opinionData.phone, {
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
        subject: validationResults.subject.sanitized,
        content: validationResults.content.sanitized,
        phone: validationResults.phone.sanitized,
        organizationId: app.globalData.organizationId,
        submitTime: new Date().toISOString(),
        submitterId: app.globalData.userInfo?.id,
        submitterName: app.globalData.userInfo?.name
      };

      if (opinionData.attachments) {
        sanitizedData.attachments = opinionData.attachments;
      }

      const result = await ApiService.post('/opinions', sanitizedData);

      if (result.success && app.globalData.auditLogger) {
        app.globalData.auditLogger.logDataModification(
          'opinions',
          'create',
          result.data.id,
          { subject: sanitizedData.subject }
        );
      }

      return result;

    } catch (error) {
      console.error('提交意见稿失败:', error);
      return {
        success: false,
        error: error.message || '提交失败'
      };
    }
  }

  static async updateOpinion(id, opinionData) {
    try {
      const app = getApp();
      const securityManager = app.globalData.securityManager;

      if (!securityManager.validatePermission(app.globalData.role, 'manage_own_members')) {
        throw new Error('无权修改意见稿');
      }

      const result = await ApiService.put(`/opinions/${id}`, opinionData);

      if (result.success && app.globalData.auditLogger) {
        app.globalData.auditLogger.logDataModification(
          'opinions',
          'update',
          id,
          opinionData
        );
      }

      return result;

    } catch (error) {
      console.error('更新意见稿失败:', error);
      return {
        success: false,
        error: error.message || '更新失败'
      };
    }
  }

  static async deleteOpinion(id) {
    try {
      const app = getApp();
      const securityManager = app.globalData.securityManager;

      if (!securityManager.validatePermission(app.globalData.role, 'manage_own_members')) {
        throw new Error('无权删除意见稿');
      }

      const result = await ApiService.delete(`/opinions/${id}`);

      if (result.success && app.globalData.auditLogger) {
        app.globalData.auditLogger.logDataModification(
          'opinions',
          'delete',
          id
        );
      }

      return result;

    } catch (error) {
      console.error('删除意见稿失败:', error);
      return {
        success: false,
        error: error.message || '删除失败'
      };
    }
  }

  static async uploadAttachment(filePath) {
    try {
      const app = getApp();
      const result = await ApiService.uploadFile(
        filePath,
        '/opinions/attachments',
        {
          userId: app.globalData.userInfo?.id
        }
      );

      return result;

    } catch (error) {
      console.error('上传附件失败:', error);
      return {
        success: false,
        error: error.message || '上传失败'
      };
    }
  }
}

export default OpinionService;
