# 智慧党建微信小程序 - WeChat Mini Program for Smart Party Building

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![WeChat](https://img.shields.io/badge/WeChat-MiniProgram-green.svg)](https://developers.weixin.qq.com/miniprogram/dev/framework/)
[![Security](https://img.shields.io/badge/security-compliant-brightgreen.svg)]()

## 项目概述 | Project Overview

智慧党建微信小程序是一个基于微信小程序开发的党建管理平台，严格遵循中国数据安全法律法规，实现全方位的数据安全保障体系。

A WeChat mini-program for smart party building management, strictly compliant with Chinese data security laws and regulations, implementing comprehensive data security measures.

## 核心特性 | Key Features

- ✅ **数据安全合规** - 遵循《网络安全法》《数据安全法》《个人信息保护法》
- 🔐 **全程加密保护** - 数据采集、存储、传输全流程加密
- 📊 **完整审计日志** - 所有敏感操作全程记录可追溯
- 🛡️ **权限精细管控** - 基于角色的访问控制（RBAC）
- 🚀 **智能化管理** - 党务管理智能化、党员教育精准化
- 🏢 **多级组织支持** - 园区-企业-党员多层级架构

## 项目结构 | Project Structure

```
.
├── miniprogram/                    # 微信小程序源码
│   ├── app.js                      # 小程序入口
│   ├── app.json                    # 小程序配置
│   ├── config/                     # 配置文件
│   │   └── security.config.js      # 安全配置
│   ├── utils/security/             # 安全工具
│   │   ├── data-encryption.js      # 数据加密
│   │   ├── audit-logger.js         # 审计日志
│   │   └── security-manager.js     # 安全管理器
│   ├── services/                   # 业务服务层
│   │   ├── api.service.js          # API服务
│   │   ├── auth.service.js         # 认证服务
│   │   ├── opinion.service.js      # 意见稿服务
│   │   └── member.service.js       # 党员服务
│   ├── models/                     # 数据模型
│   │   ├── user.model.js           # 用户模型
│   │   └── member.model.js         # 党员模型
│   └── pages/                      # 页面目录
│       ├── index/                  # 首页
│       ├── login/                  # 登录页
│       ├── enterprise/             # 企业端
│       └── park/                   # 园区端
│
├── app/                            # Next.js应用（可选的后台管理）
├── DATA_SECURITY_DOCUMENTATION.md  # 数据安全文档
├── MINIPROGRAM_README.md           # 小程序详细文档
├── DEPLOYMENT_GUIDE.md             # 部署指南
└── project.config.json             # 微信开发者工具配置
```

## 快速开始 | Quick Start

### 1. 环境准备

- 下载 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 注册微信小程序账号
- 获取 AppID

### 2. 配置项目

```bash
# 克隆项目
git clone <repository-url>
cd project

# 修改 AppID
# 编辑 project.config.json，填入你的 AppID

# 修改 API 地址
# 编辑 miniprogram/services/api.service.js
const BASE_URL = 'https://your-api-domain.com';
```

### 3. 运行项目

1. 使用微信开发者工具打开项目
2. 选择 `miniprogram` 目录
3. 点击"编译"按钮
4. 在模拟器或真机上预览

## 数据安全实施 | Data Security Implementation

### 1. 数据加密

- 传输层加密: HTTPS
- 存储加密: XOR + Base64
- 敏感字段加密: 身份证、手机号、密码等

### 2. 数据脱敏

```javascript
// 身份证: 110101********1234
member.getMaskedIdCard()

// 手机号: 138****8000
member.getMaskedPhone()
```

### 3. 审计日志

所有敏感操作自动记录:
- 用户登录/登出
- 数据访问
- 数据修改
- 数据导出
- 权限变更

### 4. 权限控制

基于角色的访问控制 (RBAC):
- **admin**: 全部权限
- **park_manager**: 园区管理权限
- **enterprise_manager**: 企业管理权限
- **member**: 基础权限

### 5. 输入验证

- XSS攻击防护
- SQL注入防护
- 自动清理危险字符
- 长度限制验证

## 法律合规 | Legal Compliance

本项目严格遵循以下法律法规:

- 《中华人民共和国网络安全法》
- 《中华人民共和国数据安全法》
- 《中华人民共和国个人信息保护法》

详细的合规说明请查看 [DATA_SECURITY_DOCUMENTATION.md](DATA_SECURITY_DOCUMENTATION.md)

## 功能模块 | Features

### 企业用户系统

- 意见稿提交与管理
- 通知公告查看
- 党员信息维护

### 园区管理系统

- 首页数据概览
- 意见稿管理
- 党建资讯发布
- 组织架构维护
- 人员管理
- 党员管理
- 数据统计分析

## 文档 | Documentation

- [小程序详细文档](MINIPROGRAM_README.md)
- [数据安全文档](DATA_SECURITY_DOCUMENTATION.md)
- [部署指南](DEPLOYMENT_GUIDE.md)

## 技术支持 | Support

- 邮箱: support@example.com
- 电话: 400-xxx-xxxx
- 安全事件报告: security@example.com

## 许可证 | License

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情

## 贡献 | Contributing

欢迎提交 Issue 和 Pull Request！

## 致谢 | Acknowledgments

感谢所有为本项目做出贡献的开发者。

---

**版本**: 1.0.0  
**最后更新**: 2024-01-15
