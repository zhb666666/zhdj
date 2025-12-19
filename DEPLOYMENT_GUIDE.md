# 智慧党建微信小程序 - 部署指南

## 目录

1. [前期准备](#前期准备)
2. [环境配置](#环境配置)
3. [代码配置](#代码配置)
4. [服务器部署](#服务器部署)
5. [小程序发布](#小程序发布)
6. [安全配置](#安全配置)
7. [监控与维护](#监控与维护)
8. [故障处理](#故障处理)

## 前期准备

### 1. 注册微信小程序

1. 访问 [微信公众平台](https://mp.weixin.qq.com/)
2. 点击"立即注册" -> 选择"小程序"
3. 填写注册信息并完成邮箱验证
4. 完成主体信息登记（需要营业执照）
5. 完成管理员身份验证
6. 获取 AppID 和 AppSecret

### 2. 开发者工具

下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

支持的平台：
- Windows 7 及以上
- macOS 10.11 及以上

### 3. 服务器准备

#### 最低配置
- CPU: 2核
- 内存: 4GB
- 硬盘: 50GB
- 带宽: 5Mbps

#### 推荐配置
- CPU: 4核
- 内存: 8GB
- 硬盘: 100GB SSD
- 带宽: 10Mbps

#### 软件环境
- 操作系统: Ubuntu 20.04 LTS / CentOS 7+
- Node.js: 14.x 或更高
- 数据库: MySQL 8.0 / PostgreSQL 12+
- Web服务器: Nginx 1.18+
- SSL证书: Let's Encrypt 或商业证书

## 环境配置

### 1. 域名配置

#### 购买域名
- 建议使用 .com 或 .cn 域名
- 必须完成ICP备案（中国大陆服务器）

#### DNS配置
```
类型    主机记录    记录值
A       api         服务器IP地址
CNAME   www         主域名
```

#### SSL证书申请

使用 Let's Encrypt（免费）:
```bash
sudo apt-get update
sudo apt-get install certbot
sudo certbot certonly --standalone -d api.yourdomain.com
```

或购买商业SSL证书（推荐）:
- DigiCert
- GlobalSign
- Sectigo

### 2. 服务器环境搭建

#### 更新系统
```bash
sudo apt-get update
sudo apt-get upgrade -y
```

#### 安装 Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
npm --version
```

#### 安装数据库 (MySQL)
```bash
sudo apt-get install mysql-server -y
sudo mysql_secure_installation

# 创建数据库
mysql -u root -p
CREATE DATABASE smart_party_building CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'partybuilding'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON smart_party_building.* TO 'partybuilding'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 安装 Nginx
```bash
sudo apt-get install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 3. 微信小程序后台配置

登录 [微信公众平台](https://mp.weixin.qq.com/)

#### 配置服务器域名

开发 -> 开发管理 -> 开发设置 -> 服务器域名

添加以下域名：
- **request合法域名**: `https://api.yourdomain.com`
- **uploadFile合法域名**: `https://api.yourdomain.com`
- **downloadFile合法域名**: `https://api.yourdomain.com`

⚠️ 注意：
- 必须使用 HTTPS
- 域名必须已备案
- 每月只能修改5次

#### 配置业务域名

开发 -> 开发管理 -> 开发设置 -> 业务域名

添加：`https://www.yourdomain.com`

需要下载校验文件并上传到服务器根目录。

## 代码配置

### 1. 修改 AppID

编辑 `project.config.json`:
```json
{
  "appid": "你的AppID"
}
```

### 2. 配置 API 地址

编辑 `miniprogram/services/api.service.js`:
```javascript
const BASE_URL = 'https://api.yourdomain.com';
```

### 3. 安全配置调整

编辑 `miniprogram/config/security.config.js`:

```javascript
export const SecurityConfig = {
  // 根据实际需求调整配置
  session: {
    timeout: 7200000,  // 会话超时时间
  },
  
  apiSecurity: {
    rateLimiting: {
      enabled: true,
      maxRequests: 100,  // 根据实际情况调整
      windowMs: 60000
    }
  },
  
  // 生产环境关闭调试
  audit: {
    enabled: true,
    logLevel: 'info'  // 生产环境使用 'warn' 或 'error'
  }
};
```

### 4. 环境变量配置

创建 `.env.production`:
```bash
# API配置
API_BASE_URL=https://api.yourdomain.com
API_TIMEOUT=30000

# 加密配置
ENCRYPTION_ALGORITHM=AES-256-CBC
ENCRYPTION_KEY=your-secure-encryption-key-32-chars

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=smart_party_building
DB_USER=partybuilding
DB_PASSWORD=strong_password_here

# Redis配置（可选）
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# 会话配置
SESSION_SECRET=your-session-secret-key
SESSION_TIMEOUT=7200000

# 日志配置
LOG_LEVEL=info
LOG_PATH=/var/log/smart-party-building

# 文件上传配置
UPLOAD_MAX_SIZE=10485760
UPLOAD_PATH=/var/www/uploads

# 邮件配置（用于通知）
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=smtp_password
```

⚠️ **重要**: 不要将 `.env.production` 提交到代码仓库！

## 服务器部署

### 1. 部署后端API

#### 上传代码
```bash
# 在本地
git clone https://github.com/your-repo/smart-party-building-api.git
cd smart-party-building-api

# 使用 rsync 上传
rsync -avz --exclude 'node_modules' . user@server:/var/www/smart-party-building-api/
```

#### 安装依赖
```bash
# 在服务器上
cd /var/www/smart-party-building-api
npm install --production
```

#### 数据库迁移
```bash
# 运行数据库迁移脚本
npm run migrate

# 或手动执行SQL
mysql -u partybuilding -p smart_party_building < database/schema.sql
```

#### 配置 PM2（进程管理）
```bash
# 安装 PM2
sudo npm install -g pm2

# 启动应用
pm2 start app.js --name smart-party-building-api

# 设置开机自启
pm2 startup
pm2 save

# 查看日志
pm2 logs smart-party-building-api

# 监控
pm2 monit
```

### 2. 配置 Nginx

创建 Nginx 配置文件:
```bash
sudo nano /etc/nginx/sites-available/smart-party-building
```

添加以下内容:
```nginx
# API服务器配置
upstream api_backend {
    server 127.0.0.1:3000;
    keepalive 64;
}

# HTTPS重定向
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS配置
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;
    
    # SSL证书配置
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    
    # SSL安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # 安全头部
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # 日志配置
    access_log /var/log/nginx/api.yourdomain.com.access.log;
    error_log /var/log/nginx/api.yourdomain.com.error.log;
    
    # 文件上传大小限制
    client_max_body_size 10M;
    
    # API代理
    location / {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
    
    # 健康检查
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

启用配置:
```bash
sudo ln -s /etc/nginx/sites-available/smart-party-building /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. 防火墙配置

```bash
# 安装 UFW
sudo apt-get install ufw

# 配置规则
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS

# 启用防火墙
sudo ufw enable
sudo ufw status
```

### 4. 配置自动备份

创建备份脚本 `/usr/local/bin/backup-party-building.sh`:
```bash
#!/bin/bash

# 配置
BACKUP_DIR="/var/backups/smart-party-building"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="smart_party_building"
DB_USER="partybuilding"
DB_PASS="your_password"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
mysqldump -u$DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# 备份文件
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/uploads

# 删除30天前的备份
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete

# 记录日志
echo "Backup completed at $DATE" >> /var/log/backup-party-building.log
```

设置权限和定时任务:
```bash
sudo chmod +x /usr/local/bin/backup-party-building.sh

# 添加到 crontab (每天凌晨2点备份)
sudo crontab -e
# 添加以下行:
0 2 * * * /usr/local/bin/backup-party-building.sh
```

## 小程序发布

### 1. 本地测试

1. 使用微信开发者工具打开项目
2. 填入 AppID
3. 勾选"不校验合法域名"（仅开发时）
4. 全面测试所有功能

### 2. 真机调试

1. 点击工具栏"预览"按钮
2. 使用手机微信扫描二维码
3. 在真机上测试所有功能
4. 检查性能和兼容性

### 3. 上传代码

1. 点击工具栏"上传"按钮
2. 填写版本号（如：1.0.0）
3. 填写项目备注
4. 点击"上传"

### 4. 提交审核

登录微信公众平台:

1. 版本管理 -> 开发版本
2. 选择刚上传的版本
3. 点击"提交审核"
4. 填写审核信息：
   - 功能页面截图
   - 功能描述
   - 测试账号（如需要）
   - 隐私政策链接
   - 用户协议链接

### 5. 发布

审核通过后：

1. 版本管理 -> 审核版本
2. 点击"发布"
3. 选择发布方式：
   - 全量发布
   - 分阶段发布（推荐）

### 6. 版本回退（如需要）

如果发现问题：

1. 版本管理 -> 线上版本
2. 点击"版本回退"
3. 选择要回退到的版本

## 安全配置

### 1. 数据库安全

```bash
# 修改 MySQL 配置
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# 添加以下配置
[mysqld]
# 只允许本地连接
bind-address = 127.0.0.1

# 禁用远程root登录
# 删除匿名用户
# 删除test数据库
sudo mysql_secure_installation
```

### 2. 文件权限

```bash
# 设置正确的文件权限
sudo chown -R www-data:www-data /var/www/smart-party-building-api
sudo find /var/www/smart-party-building-api -type d -exec chmod 755 {} \;
sudo find /var/www/smart-party-building-api -type f -exec chmod 644 {} \;

# 上传目录需要写权限
sudo chmod 775 /var/www/uploads
```

### 3. 配置 Fail2Ban（防暴力破解）

```bash
# 安装 Fail2Ban
sudo apt-get install fail2ban -y

# 配置
sudo nano /etc/fail2ban/jail.local

# 添加以下内容
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/*error.log

# 启动服务
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

### 4. 启用日志审计

```bash
# 安装审计工具
sudo apt-get install auditd -y

# 配置审计规则
sudo nano /etc/audit/rules.d/audit.rules

# 添加以下规则
-w /var/www/smart-party-building-api -p wa -k app_changes
-w /etc/nginx -p wa -k nginx_config
-w /var/log -p wa -k log_changes

# 重启服务
sudo systemctl restart auditd
```

## 监控与维护

### 1. 配置监控

#### 服务器监控
```bash
# 安装监控工具
sudo apt-get install htop iotop nethogs -y

# 查看系统资源
htop

# 查看磁盘IO
iotop

# 查看网络流量
nethogs
```

#### 应用监控
```bash
# PM2 监控
pm2 monit

# 查看应用日志
pm2 logs smart-party-building-api --lines 100

# 查看错误日志
pm2 logs smart-party-building-api --err --lines 100
```

#### Nginx 日志分析
```bash
# 实时查看访问日志
tail -f /var/log/nginx/api.yourdomain.com.access.log

# 分析错误日志
tail -f /var/log/nginx/api.yourdomain.com.error.log

# 统计访问次数最多的IP
awk '{print $1}' /var/log/nginx/api.yourdomain.com.access.log | sort | uniq -c | sort -rn | head -10
```

### 2. 定期维护任务

#### 每日
- 检查服务器资源使用情况
- 查看应用错误日志
- 检查数据库备份

#### 每周
- 审查审计日志
- 检查安全更新
- 性能分析

#### 每月
- 清理旧日志文件
- 数据库优化
- 安全审计

#### 每季度
- 更新依赖包
- 渗透测试
- 灾难恢复演练

### 3. 日志轮转

配置 logrotate:
```bash
sudo nano /etc/logrotate.d/smart-party-building

# 添加以下内容
/var/log/smart-party-building/*.log {
    daily
    rotate 90
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

## 故障处理

### 常见问题

#### 1. 小程序无法连接服务器

**症状**: 提示"服务器错误"或"网络请求失败"

**检查步骤**:
```bash
# 1. 检查服务器是否运行
pm2 status

# 2. 检查 Nginx 是否运行
sudo systemctl status nginx

# 3. 检查端口是否监听
sudo netstat -tlnp | grep 3000

# 4. 检查 SSL 证书
openssl s_client -connect api.yourdomain.com:443

# 5. 查看错误日志
pm2 logs smart-party-building-api --err
tail -f /var/log/nginx/api.yourdomain.com.error.log
```

**解决方法**:
```bash
# 重启应用
pm2 restart smart-party-building-api

# 重启 Nginx
sudo systemctl restart nginx

# 检查域名配置
# 登录微信公众平台，确认服务器域名配置正确
```

#### 2. 数据加密错误

**症状**: "数据解密失败"

**解决方法**:
1. 清除小程序缓存
2. 重新登录
3. 检查服务器端加密配置
4. 确认密钥一致性

#### 3. 性能问题

**症状**: 响应慢或超时

**检查步骤**:
```bash
# 查看服务器负载
uptime
top

# 查看数据库性能
mysql -u root -p -e "SHOW PROCESSLIST;"

# 查看慢查询
mysql -u root -p -e "SHOW VARIABLES LIKE 'slow_query%';"
```

**优化方法**:
1. 添加数据库索引
2. 启用缓存（Redis）
3. 优化查询语句
4. 升级服务器配置

#### 4. 数据库连接错误

**症状**: "数据库连接失败"

**解决方法**:
```bash
# 检查 MySQL 状态
sudo systemctl status mysql

# 重启 MySQL
sudo systemctl restart mysql

# 检查连接数
mysql -u root -p -e "SHOW PROCESSLIST;"

# 增加最大连接数
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
# 修改: max_connections = 200
sudo systemctl restart mysql
```

### 紧急联系方式

- **技术支持**: support@example.com
- **安全事件**: security@example.com
- **紧急电话**: 400-xxx-xxxx（24小时）

## 附录

### A. 检查清单

部署前检查:
- [ ] AppID 已配置
- [ ] 服务器域名已配置
- [ ] SSL 证书已安装
- [ ] 数据库已创建
- [ ] 环境变量已配置
- [ ] API 地址已更新
- [ ] 安全配置已调整
- [ ] 备份脚本已设置
- [ ] 监控已配置
- [ ] 防火墙已配置

### B. 命令速查

```bash
# 应用管理
pm2 start app.js
pm2 stop app.js
pm2 restart app.js
pm2 logs app.js

# Nginx 管理
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo nginx -t

# MySQL 管理
sudo systemctl start mysql
sudo systemctl stop mysql
sudo systemctl restart mysql

# 查看日志
tail -f /var/log/nginx/error.log
pm2 logs --lines 100

# 系统监控
htop
df -h
free -m
```

### C. 资源链接

- [微信小程序文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [Nginx 文档](https://nginx.org/en/docs/)
- [PM2 文档](https://pm2.keymetrics.io/)
- [MySQL 文档](https://dev.mysql.com/doc/)

---

**版本**: 1.0.0  
**最后更新**: 2024-01-15  
**维护者**: 智慧党建开发团队
