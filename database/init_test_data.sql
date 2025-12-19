-- 初始化测试数据
-- 创建时间: 2024-12-19

USE `smart_party_building`;

-- 清空现有数据（可选）
-- TRUNCATE TABLE user_tokens;
-- TRUNCATE TABLE users;
-- TRUNCATE TABLE organizations;

-- 插入组织数据
INSERT INTO `organizations` (`id`, `name`, `code`, `category`, `parent_id`, `created_at`, `updated_at`) VALUES
(1, '智慧党建总部', 'ORG001', 'headquarters', NULL, NOW(6), NOW(6)),
(2, '科技园区党委', 'ORG002', 'park', 1, NOW(6), NOW(6)),
(3, '创新企业支部', 'ORG003', 'enterprise', 2, NOW(6), NOW(6));

-- 插入测试用户
-- 注意：密码为 'password123' 的SHA256哈希值（前端会用同样的算法加密）
-- 前端使用的是自定义的XOR+Base64加密，这里暂时用明文存储供测试
INSERT INTO `users` (`id`, `username`, `password_hash`, `name`, `role`, `organization_id`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', '系统管理员', 'admin', 1, NOW(6), NOW(6)),
(2, 'park_manager', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', '园区管理员', 'park_manager', 2, NOW(6), NOW(6)),
(3, 'enterprise_manager', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', '企业管理员', 'enterprise_manager', 3, NOW(6), NOW(6)),
(4, 'member', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', '普通党员', 'member', 3, NOW(6), NOW(6));

-- 插入党员数据
INSERT INTO `party_members` (`id`, `name`, `gender`, `ethnic`, `id_card`, `phone`, `organization_id`, `position`, `guide_enterprise`, `member_type`, `created_at`, `updated_at`) VALUES
(1, '张三', '男', '汉族', '110101199001011234', '13800138000', 3, '党支部书记', '科技有限公司', '正式党员', NOW(6), NOW(6)),
(2, '李四', '女', '汉族', '110101199002021234', '13800138001', 3, '组织委员', '创新科技公司', '正式党员', NOW(6), NOW(6)),
(3, '王五', '男', '汉族', '110101199003031234', '13800138002', 3, NULL, '软件开发公司', '预备党员', NOW(6), NOW(6));

-- 插入新闻数据
INSERT INTO `news` (`id`, `title`, `content`, `publish_time`, `icon_url`, `carousel`, `created_at`, `updated_at`) VALUES
(1, '欢迎使用智慧党建管理系统', '智慧党建管理系统正式上线，为党组织管理提供全方位支持。', NOW(6), NULL, 1, NOW(6), NOW(6)),
(2, '党建工作新要求', '深入学习贯彻党的二十大精神，加强基层党组织建设。', NOW(6), NULL, 0, NOW(6), NOW(6));

-- 插入通知公告
INSERT INTO `notices` (`id`, `title`, `content`, `publish_time`, `created_at`, `updated_at`) VALUES
(1, '关于开展党员学习活动的通知', '定于本月20日组织全体党员学习活动，请各支部积极参加。', NOW(6), NOW(6), NOW(6)),
(2, '党费缴纳提醒', '请各位党员按时缴纳本季度党费，截止日期为本月底。', NOW(6), NOW(6), NOW(6));

COMMIT;
