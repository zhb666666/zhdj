# 智慧党建系统 - 前后端连接配置指南

## 项目概述

本项目已完成前后端连接和登录鉴权功能的实现：

- **后端**: Spring Boot + MySQL + JPA
- **前端**: uni-app (支持H5、小程序、App)
- **认证**: Token-based 认证机制

## 快速启动

### 1. 数据库配置

#### 创建数据库和表结构

```bash
# 连接MySQL
mysql -u root -p

# 执行建表脚本
source database/create_tables.sql

# 初始化测试数据
source database/init_test_data.sql
```

#### 测试账号

系统已创建以下测试账号（密码均为: `password123`）：

| 用户名 | 角色 | 说明 |
|--------|------|------|
| admin | 系统管理员 | 拥有全部权限 |
| park_manager | 园区管理员 | 管理园区相关功能 |
| enterprise_manager | 企业管理员 | 管理企业党建工作 |
| member | 普通党员 | 基础党员权限 |

### 2. 后端启动

#### 配置数据库连接

编辑 `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/smart_party_building?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
    username: root  # 修改为你的MySQL用户名
    password: your_password  # 修改为你的MySQL密码
```

#### 启动Spring Boot应用

```bash
cd backend

# 使用Maven启动
./mvnw spring-boot:run

# 或者使用Maven包装器（Windows）
mvnw.cmd spring-boot:run
```

后端将在 `http://localhost:8080` 启动

### 3. 前端配置

#### 配置后端API地址

前端已配置为连接本地后端: `http://localhost:8080`

如需修改，编辑 `uni-app/utils/api/request.js`:

```javascript
class Request {
  constructor(config = {}) {
    this.baseURL = config.baseURL || 'http://localhost:8080'
    // ...
  }
}
```

#### 启动uni-app（开发环境）

使用HBuilderX打开 `uni-app` 目录，或使用命令行：

```bash
cd uni-app

# 运行到H5
npm run dev:h5

# 运行到微信小程序
npm run dev:mp-weixin
```

## 登录鉴权机制

### 认证流程

1. **用户登录**
   - 前端: 用户输入用户名和密码
   - 前端: 密码使用SHA256哈希加密
   - 前端: 发送登录请求到 `POST /auth/login`
   - 后端: 验证用户名和密码哈希
   - 后端: 生成Token并返回用户信息
   - 前端: 保存Token到本地存储

2. **请求认证**
   - 前端: 在请求头中添加 `Authorization: Bearer <token>`
   - 后端: AuthInterceptor拦截请求，验证Token
   - 后端: 如果Token有效，将用户信息注入请求
   - 后端: 如果Token无效，返回401错误

3. **Token刷新**
   - Token有效期: 2小时（7200秒）
   - 前端: 检测Token即将过期时自动刷新
   - 端点: `POST /auth/refresh-token`

4. **退出登录**
   - 前端: 调用 `POST /auth/logout`
   - 前端: 清除本地Token和用户信息
   - 后端: 清理服务器端Token记录

### API端点

#### 认证相关

- `POST /auth/login` - 用户登录
  - 请求体: `{ "username": "admin", "password": "hashedPassword" }`
  - 响应: `{ "success": true, "data": { "token": "...", "refreshToken": "...", "userInfo": {...}, "expiresIn": 7200 } }`

- `GET /auth/user-info` - 获取当前用户信息
  - 请求头: `Authorization: Bearer <token>`
  - 响应: `{ "id": 1, "name": "管理员", "role": "admin", "organizationId": 1 }`

- `POST /auth/refresh-token` - 刷新Token
  - 请求头: `Authorization: Bearer <token>`
  - 响应: `{ "token": "newToken" }`

- `POST /auth/logout` - 退出登录
  - 请求头: `Authorization: Bearer <token>`
  - 响应: `{ "success": true }`

### 权限角色

系统支持四种用户角色，每种角色有不同的权限：

1. **admin (系统管理员)**
   - 系统管理、用户管理、组织管理
   - 党员管理、意见稿管理
   - 新闻管理、通知管理

2. **park_manager (园区管理员)**
   - 组织查看、党员查看
   - 意见稿查看和管理
   - 新闻和通知管理
   - 统计数据查看

3. **enterprise_manager (企业管理员)**
   - 党员查看和管理
   - 意见稿创建和查看
   - 新闻和通知查看

4. **member (普通党员)**
   - 意见稿创建和查看
   - 新闻和通知查看
   - 个人信息查看和编辑

## 数据加密

### 前端加密

前端实现了以下安全机制：

1. **密码加密**: 使用SHA256对密码进行哈希
2. **数据脱敏**: 敏感信息（身份证、手机号）自动脱敏显示
3. **XSS防护**: 输入数据清理和验证
4. **审计日志**: 记录登录成功/失败等关键操作

### 后端安全

1. **Token认证**: 基于Token的无状态认证
2. **拦截器**: AuthInterceptor统一处理认证
3. **CORS配置**: 跨域请求安全配置
4. **输入验证**: 使用Jakarta Validation验证输入

## 测试登录

### 使用浏览器测试

1. 启动后端服务
2. 启动前端H5版本
3. 在浏览器中打开 `http://localhost:8080` (前端端口可能不同)
4. 输入测试账号（例如：admin / password123）
5. 点击登录按钮

### 使用API测试工具（如Postman）

```bash
# 登录请求
POST http://localhost:8080/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f"
}

# 获取用户信息
GET http://localhost:8080/auth/user-info
Authorization: Bearer <your_token_here>
```

## 故障排查

### 数据库连接失败

- 检查MySQL服务是否启动
- 确认数据库配置正确（用户名、密码、端口）
- 确认数据库已创建

### 登录失败

- 检查用户名和密码是否正确
- 查看后端日志确认请求是否到达
- 确认密码哈希算法一致

### Token验证失败

- 检查Token是否过期
- 确认请求头格式: `Authorization: Bearer <token>`
- 查看user_tokens表确认Token存在

### CORS错误

- 检查 `application.yml` 中的CORS配置
- 确认前端请求的域名在允许列表中

## 开发建议

### 生产环境配置

1. **修改数据加密密钥**: 更换默认的XOR加密密钥
2. **启用HTTPS**: 配置SSL证书
3. **限制CORS**: 仅允许特定域名访问
4. **Token有效期**: 根据安全需求调整
5. **密码策略**: 要求更强的密码复杂度
6. **日志记录**: 启用详细的审计日志

### 扩展功能

- [ ] 实现刷新Token的完整逻辑
- [ ] 添加验证码功能
- [ ] 实现微信登录
- [ ] 添加短信验证
- [ ] 实现忘记密码功能
- [ ] 添加单点登录(SSO)

## 技术栈版本

- Java: 17
- Spring Boot: 3.4.0
- MySQL: 8.0+
- Node.js: 14+
- uni-app: 最新版本

## 联系支持

如遇到问题，请查看：
- 后端日志: `backend/logs/`
- 浏览器控制台日志
- 数据库连接状态
- 网络请求详情

## 更新日志

### 2024-12-19
- ✅ 完成前后端API连接
- ✅ 实现登录认证功能
- ✅ 配置Token-based鉴权
- ✅ 添加CORS配置
- ✅ 创建测试数据
- ✅ 修复实体类字段映射
- ✅ 统一响应格式
