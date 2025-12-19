# 智慧党建管理系统 - uni-app前端

基于uni-app开发的智慧党建管理系统前端应用，支持多端编译（H5、小程序、App等），具有完善的数据安全保护机制。

## 项目特性

### 🔐 数据安全保护
- **端到端加密**: 使用XOR+Base64算法对敏感数据进行加密
- **数据脱敏**: 自动对身份证号、手机号、邮箱等敏感信息进行脱敏处理
- **安全存储**: 加密本地存储，支持数据过期管理和自动清理
- **审计日志**: 完整记录用户操作和系统事件，支持日志导出

### 👥 权限管理
- **角色分级**: 支持管理员、园区管理员、企业管理员、普通党员四种角色
- **权限控制**: 基于RBAC模型的细粒度权限控制
- **数据隔离**: 不同角色只能访问权限范围内的数据

### 🎨 用户体验
- **响应式设计**: 适配不同屏幕尺寸和设备
- **流畅交互**: 精心设计的动画效果和交互反馈
- **离线支持**: 支持网络异常时的基本功能
- **多端兼容**: 一套代码，支持H5、小程序、App等多个平台

## 技术栈

- **框架**: uni-app
- **语言**: JavaScript (ES6+)
- **样式**: SCSS
- **状态管理**: Vuex
- **网络请求**: uni.request (封装)
- **数据加密**: XOR + Base64
- **存储**: uni.setStorageSync (加密存储)
- **UI组件**: 自定义组件

## 项目结构

```
uni-app/
├── components/           # 公共组件
│   └── header/          # 导航栏组件
├── pages/               # 页面文件
│   ├── index/          # 首页
│   ├── login/          # 登录页
│   ├── members/        # 党员管理
│   ├── opinions/       # 意见稿
│   ├── news/           # 党建资讯
│   ├── notices/        # 通知公告
│   └── profile/        # 个人中心
├── static/             # 静态资源
│   ├── images/        # 图片资源
│   ├── css/           # 样式文件
│   └── js/            # JS工具
├── utils/              # 工具类
│   ├── api/           # API服务
│   ├── security/      # 安全工具
│   └── storage/       # 存储工具
├── store/              # 状态管理
├── App.vue             # 应用入口
├── manifest.json       # 应用配置
├── pages.json          # 页面配置
└── README.md           # 项目说明
```

## 核心模块说明

### 1. 安全模块 (utils/security/)

#### 数据加密 (data-encryption.js)
```javascript
// 加密数据
const encrypted = DataEncryption.encrypt({
  idCard: '110101198001011234',
  phone: '13800138000'
})

// 数据脱敏
const masked = DataEncryption.maskBatchData(userData, ['idCard', 'phone'])

// 验证数据
const isValid = DataEncryption.validateIdCard('110101198001011234')
```

#### 安全存储 (storage.js)
```javascript
// 安全存储
SecurityStorage.set('user_token', token, { expireTime: expireTime })

// 读取数据
const token = SecurityStorage.get('user_token')

// 数据清理
SecurityStorage.cleanup()
```

#### 审计日志 (audit-logger.js)
```javascript
// 记录用户操作
AuditLogger.log('LOGIN_SUCCESS', { userId: 123 })

// 记录数据访问
AuditLogger.logDataAccess('member', 'view', memberId)

// 导出日志
AuditLogger.exportLogs('json', 'INFO', 'AUTH')
```

### 2. API模块 (utils/api/)

#### 网络请求 (request.js)
```javascript
// GET请求
const response = await request.get('/api/users/list', { page: 1 })

// POST请求
const response = await request.post('/api/users/create', userData)

// 文件上传
const response = await request.upload('/api/files/upload', filePath)
```

#### 认证服务 (auth.js)
```javascript
// 用户登录
const result = await AuthService.login(username, password)

// 检查登录状态
const isLoggedIn = AuthService.isLoggedIn()

// 权限检查
const hasPermission = AuthService.hasPermission('member:manage')

// 获取用户信息
const userInfo = AuthService.getUserInfo()
```

### 3. 页面组件

#### 登录页面 (pages/login/)
- 用户名/密码登录
- 微信快捷登录
- 安全提示和隐私政策
- 登录失败锁定机制

#### 首页 (pages/index/)
- 用户信息展示
- 数据统计看板
- 快捷功能入口
- 党建资讯轮播

#### 党员管理 (pages/members/)
- 党员列表查看
- 搜索和筛选功能
- 敏感信息脱敏显示
- 权限控制（增删改查）

#### 意见稿管理 (pages/opinions/)
- 意见稿提交
- 状态管理
- 附件支持
- 权限分离

## 权限设计

### 角色权限

| 权限项 | 管理员 | 园区管理员 | 企业管理员 | 普通党员 |
|--------|--------|------------|------------|----------|
| 系统管理 | ✅ | ❌ | ❌ | ❌ |
| 党员管理 | ✅ | ✅ | ✅ (本企业) | ❌ |
| 意见稿管理 | ✅ | ✅ | ✅ (查看) | ✅ (创建) |
| 党建资讯 | ✅ | ✅ | ✅ | ✅ |
| 统计查看 | ✅ | ✅ | ❌ | ❌ |

### 数据安全策略

1. **数据分级**:
   - 个人数据: 姓名、联系方式 (脱敏显示)
   - 敏感数据: 身份证号 (严格脱敏)
   - 组织数据: 根据权限范围显示

2. **访问控制**:
   - 前端权限验证
   - 后端权限验证
   - 数据传输加密

3. **审计追踪**:
   - 登录/登出记录
   - 数据访问记录
   - 操作变更记录

## 部署说明

### 1. 开发环境

```bash
# 安装HBuilderX
# 下载地址: https://www.dcloud.io/hbuilderx.html

# 克隆项目
git clone <repository-url>
cd uni-app

# 用HBuilderX打开项目
# 运行到浏览器: Ctrl+R
# 运行到小程序: 发行 -> 小程序
```

### 2. 配置修改

#### API地址配置
编辑 `utils/api/request.js`:
```javascript
this.baseURL = 'https://your-api-domain.com'
```

#### 小程序配置
编辑 `manifest.json`:
```json
{
  "mp-weixin": {
    "appid": "your-miniprogram-appid"
  }
}
```

### 3. 编译发布

#### H5发布
```bash
# 发行 -> 网站-H5手机版
# 选择输出目录
# 上传到服务器
```

#### 小程序发布
```bash
# 发行 -> 微信小程序
# 上传代码到微信开发者工具
# 提交审核发布
```

#### App发布
```bash
# 发行 -> 原生App云打包
# 或 发行 -> 原生App本地打包
# 生成APK/IPA文件
```

## 开发规范

### 1. 代码规范
- 使用ES6+语法
- 遵循Vue.js风格指南
- 组件使用PascalCase命名
- 文件使用kebab-case命名

### 2. 安全规范
- 所有敏感数据必须加密存储
- 网络请求必须使用封装的网络模块
- 用户输入必须进行验证和过滤
- 重要操作必须记录审计日志

### 3. 性能规范
- 图片资源必须压缩优化
- 页面加载时间不超过3秒
- 网络请求添加loading状态
- 大数据列表使用分页或虚拟滚动

## 测试指南

### 1. 功能测试
- [ ] 登录功能正常
- [ ] 权限控制有效
- [ ] 数据加密存储
- [ ] 审计日志记录
- [ ] 各页面功能正常

### 2. 安全测试
- [ ] 敏感信息脱敏显示
- [ ] 未授权访问被拒绝
- [ ] 网络请求加密传输
- [ ] 本地数据加密存储
- [ ] SQL注入和XSS防护

### 3. 兼容性测试
- [ ] iOS设备兼容性
- [ ] Android设备兼容性
- [ ] 不同屏幕尺寸适配
- [ ] 微信小程序环境
- [ ] H5浏览器环境

## 常见问题

### Q1: 如何修改API地址？
A: 编辑 `utils/api/request.js` 文件，修改 `this.baseURL` 为实际的API地址。

### Q2: 如何添加新的页面？
A: 
1. 在 `pages/` 目录下创建页面文件夹
2. 在 `pages.json` 中注册页面
3. 在 `utils/api/` 中添加对应的API服务

### Q3: 如何处理网络异常？
A: 网络请求模块已经内置了错误处理机制，会自动显示提示信息并记录日志。

### Q4: 如何调试审计日志？
A: 可以在 `utils/security/audit-logger.js` 中设置 `enableLogging = true` 来启用详细日志。

## 更新日志

### v1.0.0 (2024-12-19)
- ✨ 初始版本发布
- ✨ 完整的用户认证和权限系统
- ✨ 数据加密和安全存储
- ✨ 党员管理功能
- ✨ 意见稿管理系统
- ✨ 审计日志功能
- ✨ 多端兼容性支持

## 联系方式

- 邮箱: support@example.com
- 电话: 400-xxx-xxxx
- 技术支持: tech@example.com

## 许可证

MIT License - 详见 [LICENSE](../LICENSE) 文件
