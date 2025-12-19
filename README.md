# 智慧党建微信小程序 - WeChat Mini Program for Smart Party Building

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![WeChat](https://img.shields.io/badge/WeChat-MiniProgram-green.svg)](https://developers.weixin.qq.com/miniprogram/dev/framework/)
[![Security](https://img.shields.io/badge/security-compliant-brightgreen.svg)]()

## 项目概述 | Project Overview

智慧党建管理系统是一个全栈党建管理平台，包含Spring Boot后端、uni-app前端（支持H5、小程序、App）和微信小程序，严格遵循中国数据安全法律法规，实现全方位的数据安全保障体系和完整的登录鉴权功能。

A full-stack smart party building management system with Spring Boot backend, uni-app frontend (H5/Mini-Program/App), and WeChat mini-program, strictly compliant with Chinese data security laws and regulations, implementing comprehensive data security measures and complete authentication system.

## 核心特性 | Key Features

- ✅ **前后端完整集成** - Spring Boot后端 + uni-app前端完全对接
- 🔑 **登录鉴权系统** - Token-based认证，支持自动刷新和权限控制
- ✅ **数据安全合规** - 遵循《网络安全法》《数据安全法》《个人信息保护法》
- 🔐 **全程加密保护** - 数据采集、存储、传输全流程加密
- 📊 **完整审计日志** - 所有敏感操作全程记录可追溯
- 🛡️ **权限精细管控** - 基于角色的访问控制（RBAC）
- 🚀 **智能化管理** - 党务管理智能化、党员教育精准化
- 🏢 **多级组织支持** - 园区-企业-党员多层级架构

## 项目结构 | Project Structure

```
.
├── backend/                        # Spring Boot后端
│   ├── src/main/java/             # Java源码
│   │   └── com/smartpartybuilding/backend/
│   │       ├── controller/        # 控制器层
│   │       ├── service/           # 服务层
│   │       ├── entity/            # 实体类
│   │       ├── dto/               # 数据传输对象
│   │       ├── repository/        # 数据访问层
│   │       └── config/            # 配置类
│   └── src/main/resources/        # 配置文件
│       └── application.yml        # 应用配置
│
├── uni-app/                        # uni-app前端（H5/小程序/App）
│   ├── pages/                      # 页面目录
│   │   ├── login/                 # 登录页
│   │   ├── index/                 # 首页
│   │   ├── members/               # 党员管理
│   │   └── opinions/              # 意见稿管理
│   ├── utils/                      # 工具类
│   │   ├── api/                   # API接口
│   │   │   ├── auth.js            # 认证服务
│   │   │   └── request.js         # 网络请求
│   │   └── security/              # 安全工具
│   │       ├── data-encryption.js # 数据加密
│   │       └── audit-logger.js    # 审计日志
│   ├── App.vue                     # 应用入口
│   ├── pages.json                  # 页面配置
│   └── manifest.json               # 应用配置
│
├── miniprogram/                    # 微信小程序源码
│   └── ...                         # 同上述结构
│
├── database/                       # 数据库脚本
│   ├── create_tables.sql          # 建表脚本
│   └── init_test_data.sql         # 测试数据
│
├── SETUP_GUIDE.md                  # 设置指南
├── INTEGRATION_TEST.md             # 集成测试文档
├── DATA_SECURITY_DOCUMENTATION.md  # 数据安全文档
├── DEPLOYMENT_GUIDE.md             # 部署指南
└── README.md                       # 本文件
```

## 快速开始 | Quick Start

### 1. 环境准备

**必需环境**:
- Java 17+
- MySQL 8.0+
- Maven 3.6+
- Node.js 14+ (可选，用于前端开发)

**可选工具**:
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- HBuilderX (uni-app开发)

### 2. 数据库初始化

```bash
# 创建数据库和表结构
mysql -u root -p < database/create_tables.sql

# 初始化测试数据
mysql -u root -p < database/init_test_data.sql
```

### 3. 后端配置和启动

```bash
# 修改数据库配置
# 编辑 backend/src/main/resources/application.yml
spring:
  datasource:
    username: root        # 你的MySQL用户名
    password: your_password  # 你的MySQL密码

# 启动后端服务
cd backend
./mvnw spring-boot:run
# 或使用启动脚本
./start-backend.sh
```

后端将在 `http://localhost:8080` 启动

### 4. 前端配置和启动

前端已配置连接本地后端，默认无需修改。如需修改API地址：

```javascript
// 编辑 uni-app/utils/api/request.js
this.baseURL = config.baseURL || 'http://localhost:8080'
```

使用HBuilderX打开 `uni-app` 目录运行，或使用命令行：

```bash
cd uni-app
npm install
npm run dev:h5  # 运行H5版本
```

### 5. 测试登录

访问前端应用，使用测试账号登录：

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | password123 | 系统管理员 |
| park_manager | password123 | 园区管理员 |
| enterprise_manager | password123 | 企业管理员 |
| member | password123 | 普通党员 |

### 详细文档

- [完整设置指南](SETUP_GUIDE.md) - 详细的配置和启动说明
- [集成测试指南](INTEGRATION_TEST.md) - 完整的测试流程和验证方法

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

## 登录鉴权系统 | Authentication System

### 认证流程

1. **用户登录**: 输入用户名和密码，密码经SHA256哈希后发送
2. **Token生成**: 后端验证成功后生成Token（有效期2小时）
3. **Token存储**: 前端将Token保存到本地存储
4. **请求认证**: 所有API请求在Header中携带 `Authorization: Bearer <token>`
5. **Token验证**: 后端拦截器验证Token有效性
6. **自动刷新**: Token即将过期时自动刷新

### API端点

- `POST /auth/login` - 用户登录
- `GET /auth/user-info` - 获取用户信息
- `POST /auth/refresh-token` - 刷新Token
- `POST /auth/logout` - 退出登录

### 权限角色

- **admin**: 系统管理员，拥有全部权限
- **park_manager**: 园区管理员，管理园区党建工作
- **enterprise_manager**: 企业管理员，管理企业党务
- **member**: 普通党员，基础权限

详细的API文档和测试方法请参考 [集成测试指南](INTEGRATION_TEST.md)

## 文档 | Documentation

- [设置指南](SETUP_GUIDE.md) - 详细的配置和启动说明
- [集成测试文档](INTEGRATION_TEST.md) - 完整的测试流程
- [小程序详细文档](MINIPROGRAM_README.md) - 微信小程序开发文档
- [数据安全文档](DATA_SECURITY_DOCUMENTATION.md) - 数据安全实施细节
- [部署指南](DEPLOYMENT_GUIDE.md) - 生产环境部署指南

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

## 技术栈 | Tech Stack

### 后端
- Java 17
- Spring Boot 3.4.0
- Spring Data JPA
- MySQL 8.0+
- Maven

### 前端
- uni-app (Vue.js)
- JavaScript ES6+
- SCSS
- 微信小程序

### 安全
- Token-based认证
- SHA256密码哈希
- XOR+Base64数据加密
- RBAC权限控制

---

**版本**: 2.0.0  
**最后更新**: 2024-12-19

## 更新日志 | Changelog

### v2.0.0 (2024-12-19)
- ✅ 完成前后端集成
- ✅ 实现登录鉴权系统
- ✅ 添加Token-based认证
- ✅ 配置CORS和拦截器
- ✅ 创建测试数据和文档
- ✅ 修复实体类字段映射
- ✅ 统一API响应格式

### v1.0.0 (2024-01-15)
- 初始版本发布
- 微信小程序基础功能
- 数据安全框架实现
