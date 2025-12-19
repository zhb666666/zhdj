# 前后端集成测试指南

本文档提供详细的前后端集成测试步骤和验证方法。

## 前置条件

### 1. 环境要求

- ✅ Java 17+
- ✅ MySQL 8.0+
- ✅ Maven 3.6+
- ✅ Node.js 14+ (前端开发)
- ✅ HBuilderX (可选，用于uni-app开发)

### 2. 数据库准备

```bash
# 1. 启动MySQL服务
sudo systemctl start mysql
# 或
brew services start mysql

# 2. 创建数据库和表
mysql -u root -p < database/create_tables.sql

# 3. 初始化测试数据
mysql -u root -p < database/init_test_data.sql
```

### 3. 配置验证

检查 `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/smart_party_building?...
    username: root
    password: your_password  # 修改为实际密码
```

## 测试步骤

### 阶段1: 后端单独测试

#### 1.1 启动后端服务

```bash
cd backend
./mvnw spring-boot:run
```

等待启动日志显示:
```
Started PartyPlatformBackendApplication in X.XXX seconds
```

#### 1.2 测试登录API

使用curl或Postman测试:

```bash
# 测试登录接口
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f"
  }'
```

预期响应:
```json
{
  "success": true,
  "data": {
    "token": "abc123...",
    "refreshToken": "def456...",
    "userInfo": {
      "id": 1,
      "name": "系统管理员",
      "role": "admin",
      "organizationId": 1
    },
    "expiresIn": 7200
  }
}
```

#### 1.3 测试认证保护的API

```bash
# 获取用户信息（需要Token）
curl -X GET http://localhost:8080/auth/user-info \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

预期响应:
```json
{
  "id": 1,
  "name": "系统管理员",
  "role": "admin",
  "organizationId": 1
}
```

#### 1.4 测试未授权访问

```bash
# 不带Token访问
curl -X GET http://localhost:8080/auth/user-info
```

预期响应:
```json
{
  "message": "Unauthorized"
}
```
状态码: 401

### 阶段2: 前端单独测试

#### 2.1 检查前端配置

确认 `uni-app/utils/api/request.js`:

```javascript
this.baseURL = config.baseURL || 'http://localhost:8080'
```

#### 2.2 启动前端（H5模式）

```bash
cd uni-app

# 如果有package.json
npm install
npm run dev:h5

# 或者使用HBuilderX直接运行
```

#### 2.3 浏览器访问

打开浏览器访问: `http://localhost:8080` (端口可能不同)

### 阶段3: 前后端集成测试

#### 3.1 登录功能测试

**测试用例1: 成功登录**

1. 在登录页面输入:
   - 用户名: `admin`
   - 密码: `password123`
2. 点击"登录"按钮
3. 验证:
   - ✅ 显示"登录成功"提示
   - ✅ 跳转到首页
   - ✅ 本地存储中保存了token
   - ✅ 本地存储中保存了userInfo

**测试用例2: 密码错误**

1. 输入:
   - 用户名: `admin`
   - 密码: `wrongpassword`
2. 点击"登录"按钮
3. 验证:
   - ✅ 显示"用户名或密码错误"
   - ✅ 不跳转页面
   - ✅ 登录失败次数增加

**测试用例3: 用户名不存在**

1. 输入:
   - 用户名: `nonexistent`
   - 密码: `password123`
2. 点击"登录"按钮
3. 验证:
   - ✅ 显示"用户名或密码错误"

**测试用例4: 多次失败锁定**

1. 连续输入错误密码5次
2. 验证:
   - ✅ 显示账户锁定提示
   - ✅ 10分钟内无法登录

#### 3.2 认证状态测试

**测试用例5: 已登录状态访问**

1. 登录成功后
2. 访问需要认证的页面（如党员管理）
3. 验证:
   - ✅ 页面正常显示
   - ✅ 可以加载数据

**测试用例6: 未登录状态访问**

1. 清除本地存储中的token
2. 访问需要认证的页面
3. 验证:
   - ✅ 自动跳转到登录页
   - ✅ 显示"请先登录"提示

**测试用例7: Token过期**

1. 修改本地存储中的token为过期值
2. 访问需要认证的页面
3. 验证:
   - ✅ 自动跳转到登录页
   - ✅ 清除了本地的认证信息

#### 3.3 权限控制测试

**测试用例8: 管理员权限**

1. 使用admin账号登录
2. 访问各个功能模块
3. 验证:
   - ✅ 可以访问所有页面
   - ✅ 可以执行所有操作

**测试用例9: 普通党员权限**

1. 使用member账号登录
2. 尝试访问管理功能
3. 验证:
   - ✅ 只能访问允许的页面
   - ✅ 管理功能按钮不显示或禁用

#### 3.4 Token刷新测试

**测试用例10: 自动刷新Token**

1. 登录后等待接近过期时间
2. 继续使用应用
3. 验证:
   - ✅ Token自动刷新
   - ✅ 用户无感知
   - ✅ 不需要重新登录

#### 3.5 退出登录测试

**测试用例11: 正常退出**

1. 登录后点击退出按钮
2. 验证:
   - ✅ 清除本地token
   - ✅ 跳转到登录页
   - ✅ 后端删除token记录

## 网络请求验证

### 浏览器开发者工具验证

1. 打开浏览器开发者工具 (F12)
2. 切换到 Network 标签
3. 执行登录操作
4. 检查请求:

#### 登录请求

```
POST http://localhost:8080/auth/login
Request Headers:
  Content-Type: application/json
Request Body:
  {
    "username": "admin",
    "password": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f"
  }

Response: 200 OK
Response Body:
  {
    "success": true,
    "data": {
      "token": "...",
      "refreshToken": "...",
      "userInfo": {...},
      "expiresIn": 7200
    }
  }
```

#### 认证请求

```
GET http://localhost:8080/auth/user-info
Request Headers:
  Authorization: Bearer abc123...

Response: 200 OK
Response Body:
  {
    "id": 1,
    "name": "系统管理员",
    "role": "admin",
    "organizationId": 1
  }
```

## 数据库验证

### 检查Token存储

```sql
-- 查看token记录
SELECT * FROM user_tokens WHERE user_id = 1;

-- 应该看到类似的记录
+----+---------+----------------------------------+-------------------------+-------------------------+
| id | user_id | token                            | expire_time             | created_at              |
+----+---------+----------------------------------+-------------------------+-------------------------+
|  1 |       1 | abc123def456...                  | 2024-12-19 14:00:00     | 2024-12-19 12:00:00     |
+----+---------+----------------------------------+-------------------------+-------------------------+
```

### 检查用户记录

```sql
-- 验证用户数据
SELECT id, username, name, role, organization_id FROM users WHERE username = 'admin';
```

## 性能测试

### 并发登录测试

使用Apache Bench或类似工具:

```bash
# 100个并发请求
ab -n 100 -c 10 -p login.json -T application/json http://localhost:8080/auth/login
```

预期结果:
- ✅ 所有请求成功
- ✅ 平均响应时间 < 200ms
- ✅ 无错误

## 安全性测试

### SQL注入测试

尝试输入:
```
用户名: admin' OR '1'='1
密码: anything
```

预期:
- ✅ 登录失败
- ✅ 参数绑定防止SQL注入

### XSS测试

尝试输入:
```
用户名: <script>alert('xss')</script>
密码: anything
```

预期:
- ✅ 输入被清理或拒绝
- ✅ 不执行脚本

### CSRF测试

尝试从其他域发起请求:

预期:
- ✅ CORS策略阻止
- ✅ 或需要CSRF Token

## 常见问题排查

### 问题1: 登录请求返回404

**原因**: 后端未启动或地址错误

**解决**:
```bash
# 检查后端是否运行
netstat -an | grep 8080

# 检查前端配置的baseURL
```

### 问题2: 登录返回401

**原因**: 密码哈希不匹配

**解决**:
```sql
-- 检查数据库中的密码哈希
SELECT username, password_hash FROM users WHERE username = 'admin';

-- 确认前端使用相同的哈希算法
```

### 问题3: CORS错误

**原因**: 跨域配置问题

**解决**:
检查 `application.yml`:
```yaml
app:
  cors:
    allowedOrigins: "*"  # 开发环境允许所有源
```

### 问题4: Token验证失败

**原因**: Token格式或存储问题

**解决**:
```javascript
// 检查本地存储
console.log(uni.getStorageSync('auth_token'));

// 检查请求头
console.log(headers.Authorization); // 应该是 "Bearer xxx"
```

## 测试清单

前后端集成测试完成清单:

- [ ] 后端服务成功启动
- [ ] 数据库连接正常
- [ ] 测试数据已初始化
- [ ] 登录API正常工作
- [ ] Token生成和验证正常
- [ ] 前端可以成功登录
- [ ] 认证拦截器正常工作
- [ ] 权限控制正确
- [ ] Token刷新机制正常
- [ ] 退出登录功能正常
- [ ] 所有用户角色测试通过
- [ ] CORS配置正确
- [ ] 错误处理正常
- [ ] 安全机制有效

## 性能基准

| 指标 | 目标值 | 测试结果 |
|------|--------|----------|
| 登录响应时间 | < 200ms | ___ ms |
| Token验证时间 | < 50ms | ___ ms |
| 并发登录(100) | 成功率 > 95% | ___% |
| Token刷新时间 | < 100ms | ___ ms |

## 下一步

集成测试完成后:

1. ✅ 前后端连接成功
2. ✅ 登录鉴权正常工作
3. [ ] 实现其他业务API
4. [ ] 完善错误处理
5. [ ] 添加日志记录
6. [ ] 性能优化
7. [ ] 安全加固
8. [ ] 准备上线部署
