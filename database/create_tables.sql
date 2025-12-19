-- 智慧党建管理系统数据库建表脚本
-- 创建时间: 2024-12-19
-- 字符集: utf8mb4
-- 排序规则: utf8mb4_unicode_ci

-- 创建数据库
CREATE DATABASE IF NOT EXISTS `smart_party_building` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `smart_party_building`;

-- 1. 组织机构表 (organizations)
CREATE TABLE `organizations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(100) NOT NULL COMMENT '组织名称',
  `code` varchar(50) NOT NULL COMMENT '组织代码',
  `category` varchar(50) NOT NULL COMMENT '组织类别',
  `parent_id` bigint(20) DEFAULT NULL COMMENT '父级组织ID',
  `created_at` datetime(6) NOT NULL COMMENT '创建时间',
  `updated_at` datetime(6) NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_org_code` (`code`),
  KEY `idx_org_parent` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='组织机构表';

-- 2. 用户表 (users)
CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password_hash` varchar(64) NOT NULL COMMENT '密码哈希',
  `name` varchar(50) NOT NULL COMMENT '真实姓名',
  `role` varchar(30) NOT NULL COMMENT '用户角色',
  `organization_id` bigint(20) DEFAULT NULL COMMENT '所属组织ID',
  `created_at` datetime(6) NOT NULL COMMENT '创建时间',
  `updated_at` datetime(6) NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_users_username` (`username`),
  KEY `idx_users_org` (`organization_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 3. 用户Token表 (user_tokens)
CREATE TABLE `user_tokens` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `token` varchar(255) NOT NULL COMMENT '访问令牌',
  `expire_time` datetime(6) NOT NULL COMMENT '过期时间',
  `created_at` datetime(6) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user_token` (`token`),
  KEY `idx_token_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户Token表';

-- 4. 党员表 (party_members)
CREATE TABLE `party_members` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(50) NOT NULL COMMENT '党员姓名',
  `gender` varchar(10) DEFAULT NULL COMMENT '性别',
  `ethnic` varchar(20) DEFAULT NULL COMMENT '民族',
  `id_card` varchar(20) NOT NULL COMMENT '身份证号',
  `phone` varchar(20) DEFAULT NULL COMMENT '联系电话',
  `organization_id` bigint(20) DEFAULT NULL COMMENT '所属组织ID',
  `position` varchar(50) DEFAULT NULL COMMENT '职务',
  `guide_enterprise` varchar(100) DEFAULT NULL COMMENT '指导企业',
  `member_type` varchar(50) DEFAULT NULL COMMENT '党员类型',
  `created_at` datetime(6) NOT NULL COMMENT '创建时间',
  `updated_at` datetime(6) NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_member_org` (`organization_id`),
  KEY `idx_member_id_card` (`id_card`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='党员表';

-- 5. 意见稿表 (opinions)
CREATE TABLE `opinions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `subject` varchar(100) NOT NULL COMMENT '意见主题',
  `content` text NOT NULL COMMENT '意见内容',
  `organization_id` bigint(20) DEFAULT NULL COMMENT '所属组织ID',
  `submitter_id` bigint(20) DEFAULT NULL COMMENT '提交者ID',
  `submitter_name` varchar(50) NOT NULL COMMENT '提交者姓名',
  `phone` varchar(20) NOT NULL COMMENT '联系电话',
  `submit_time` datetime(6) NOT NULL COMMENT '提交时间',
  `created_at` datetime(6) NOT NULL COMMENT '创建时间',
  `updated_at` datetime(6) NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_opinion_org` (`organization_id`),
  KEY `idx_opinion_submit_time` (`submit_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='意见稿表';

-- 6. 新闻资讯表 (news)
CREATE TABLE `news` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `title` varchar(100) NOT NULL COMMENT '新闻标题',
  `content` text NOT NULL COMMENT '新闻内容',
  `publish_time` datetime(6) NOT NULL COMMENT '发布时间',
  `icon_url` varchar(255) DEFAULT NULL COMMENT '图标URL',
  `carousel` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否轮播',
  `created_at` datetime(6) NOT NULL COMMENT '创建时间',
  `updated_at` datetime(6) NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_news_publish_time` (`publish_time`),
  KEY `idx_news_carousel` (`carousel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='新闻资讯表';

-- 7. 通知公告表 (notices)
CREATE TABLE `notices` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `title` varchar(100) NOT NULL COMMENT '公告标题',
  `content` text NOT NULL COMMENT '公告内容',
  `type` varchar(50) NOT NULL COMMENT '公告类型',
  `organization_id` bigint(20) DEFAULT NULL COMMENT '所属组织ID',
  `created_at` datetime(6) NOT NULL COMMENT '创建时间',
  `updated_at` datetime(6) NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_notice_org` (`organization_id`),
  KEY `idx_notice_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通知公告表';

-- 8. 人员表 (personnel)
CREATE TABLE `personnel` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(50) NOT NULL COMMENT '人员姓名',
  `type` varchar(50) NOT NULL COMMENT '人员类型',
  `organization_id` bigint(20) DEFAULT NULL COMMENT '所属组织ID',
  `contact` varchar(50) DEFAULT NULL COMMENT '联系方式',
  `description` varchar(500) DEFAULT NULL COMMENT '描述信息',
  `created_at` datetime(6) NOT NULL COMMENT '创建时间',
  `updated_at` datetime(6) NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_personnel_org` (`organization_id`),
  KEY `idx_personnel_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='人员表';

-- 9. 附件表 (attachments)
CREATE TABLE `attachments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `business_type` varchar(20) NOT NULL COMMENT '业务类型',
  `business_id` bigint(20) DEFAULT NULL COMMENT '业务ID',
  `original_name` varchar(255) NOT NULL COMMENT '原始文件名',
  `stored_name` varchar(255) NOT NULL COMMENT '存储文件名',
  `url` varchar(500) NOT NULL COMMENT '文件URL',
  `size` bigint(20) NOT NULL COMMENT '文件大小(字节)',
  `content_type` varchar(100) DEFAULT NULL COMMENT '文件类型',
  `created_at` datetime(6) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_attachment_business` (`business_type`,`business_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='附件表';

-- 10. 基本情况表 (basic_situations)
CREATE TABLE `basic_situations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `organization_id` bigint(20) NOT NULL COMMENT '组织ID',
  `party_member_count` int(11) NOT NULL DEFAULT 0 COMMENT '党员总数',
  `enterprise_count` int(11) NOT NULL DEFAULT 0 COMMENT '企业数量',
  `employee_count` int(11) NOT NULL DEFAULT 0 COMMENT '员工总数',
  `party_organization_count` int(11) NOT NULL DEFAULT 0 COMMENT '党组织数量',
  `female_member_count` int(11) NOT NULL DEFAULT 0 COMMENT '女党员数量',
  `young_member_count` int(11) NOT NULL DEFAULT 0 COMMENT '35岁以下党员数量',
  `education_stats` json DEFAULT NULL COMMENT '学历统计',
  `age_stats` json DEFAULT NULL COMMENT '年龄统计',
  `created_at` datetime(6) NOT NULL COMMENT '创建时间',
  `updated_at` datetime(6) NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_basic_situation_org` (`organization_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='基本情况表';

-- 插入基础数据

-- 插入组织机构数据
INSERT INTO `organizations` (`id`, `name`, `code`, `category`, `parent_id`, `created_at`, `updated_at`) VALUES
(1, '智慧党建园区', 'HQ', '园区', NULL, NOW(), NOW()),
(2, '科技创新企业', 'TECH_001', '企业', 1, NOW(), NOW()),
(3, '绿色制造企业', 'MANU_001', '企业', 1, NOW(), NOW()),
(4, '现代服务业企业', 'SERVICE_001', '企业', 1, NOW(), NOW());

-- 插入用户数据 (默认密码为: admin123, 123456 等，已做密码哈希处理)
INSERT INTO `users` (`id`, `username`, `password_hash`, `name`, `role`, `organization_id`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'e10adc3949ba59abbe56e057f20f883e', '系统管理员', 'admin', NULL, NOW(), NOW()),
(2, 'park_manager', 'e10adc3949ba59abbe56e057f20f883e', '园区管理员', 'park_manager', 1, NOW(), NOW()),
(3, 'enterprise_manager', 'e10adc3949ba59abbe56e057f20f883e', '企业管理', 'enterprise_manager', 2, NOW(), NOW()),
(4, 'user001', 'e10adc3949ba59abbe56e057f20f883e', '普通用户', 'member', 2, NOW(), NOW());

-- 插入党员数据
INSERT INTO `party_members` (`id`, `name`, `gender`, `ethnic`, `id_card`, `phone`, `organization_id`, `position`, `guide_enterprise`, `member_type`, `created_at`, `updated_at`) VALUES
(1, '张三', '男', '汉族', '110101198001011234', '13800138001', 2, '党支部书记', '科技创新企业', '正式党员', NOW(), NOW()),
(2, '李四', '女', '汉族', '110101198502022345', '13800138002', 2, '组织委员', '科技创新企业', '正式党员', NOW(), NOW()),
(3, '王五', '男', '汉族', '110101199003033456', '13800138003', 3, '党委书记', '绿色制造企业', '正式党员', NOW(), NOW()),
(4, '赵六', '女', '汉族', '110101198808084567', '13800138004', 4, '党务工作者', '现代服务业企业', '正式党员', NOW(), NOW());

-- 插入新闻资讯数据
INSERT INTO `news` (`id`, `title`, `content`, `publish_time`, `icon_url`, `carousel`, `created_at`, `updated_at`) VALUES
(1, '智慧党建平台正式上线', '经过两个月的开发和测试，智慧党建平台正式上线运行。本平台集成了党员管理、组织建设、学习教育等多项功能，将有效提升党建工作信息化水平。', NOW(), '/static/images/news1.jpg', 1, NOW(), NOW()),
(2, '园区召开党建工作会议', '昨日下午，智慧党建园区召开第一季度党建工作会议，总结回顾上季度党建工作成果，部署下阶段重点任务。', NOW(), '/static/images/news2.jpg', 1, NOW(), NOW()),
(3, '党员先锋模范作用发挥显著', '近期，园区广大党员积极发挥先锋模范作用，在科技创新、企业发展、社会服务等方面取得显著成效。', NOW(), '/static/images/news3.jpg', 0, NOW(), NOW());

-- 插入通知公告数据
INSERT INTO `notices` (`id`, `title`, `content`, `type`, `organization_id`, `created_at`, `updated_at`) VALUES
(1, '关于开展党史学习教育的通知', '为深入推进党史学习教育常态化制度化，现决定在园区范围内开展党史学习教育活动，请各党组织认真组织实施。', '活动通知', NULL, NOW(), NOW()),
(2, '党建经费使用管理办法', '为规范园区党建经费使用管理，提高资金使用效益，特制定本办法，请各相关单位遵照执行。', '管理规定', NULL, NOW(), NOW());

-- 插入人员数据
INSERT INTO `personnel` (`id`, `name`, `type`, `organization_id`, `contact`, `description`, `created_at`, `updated_at`) VALUES
(1, '陈指导', '党建工作指导员', 1, '13900139001', '负责园区党建工作指导', NOW(), NOW()),
(2, '刘网格员', '企业网格员', 1, '13900139002', '负责园区企业服务工作', NOW(), NOW()),
(3, '孙专员', '党建专员', 2, '13900139003', '负责企业党务工作', NOW(), NOW());

-- 插入基本情况数据
INSERT INTO `basic_situations` (`id`, `organization_id`, `party_member_count`, `enterprise_count`, `employee_count`, `party_organization_count`, `female_member_count`, `young_member_count`, `education_stats`, `age_stats`, `created_at`, `updated_at`) VALUES
(1, 1, 25, 15, 1200, 3, 12, 8, '{"博士": 2, "硕士": 8, "本科": 12, "专科": 3}', '{"30岁以下": 5, "31-40岁": 10, "41-50岁": 7, "51岁以上": 3}', NOW(), NOW()),
(2, 2, 8, 1, 300, 1, 4, 3, '{"硕士": 3, "本科": 4, "专科": 1}', '{"30岁以下": 3, "31-40岁": 3, "41-50岁": 2}', NOW(), NOW());

-- 创建视图
CREATE VIEW v_party_member_stats AS
SELECT 
  o.id as organization_id,
  o.name as organization_name,
  COUNT(pm.id) as member_count,
  COUNT(CASE WHEN pm.gender = '女' THEN 1 END) as female_count,
  COUNT(CASE WHEN TIMESTAMPDIFF(YEAR, STR_TO_DATE(CONCAT('19', SUBSTRING(pm.id_card, 7, 6)), '%Y%m%d'), CURDATE()) < 35 THEN 1 END) as young_count
FROM organizations o
LEFT JOIN party_members pm ON o.id = pm.organization_id
GROUP BY o.id, o.name;

-- 初始化完成提示
SELECT '数据库初始化完成！' as message;
SELECT '默认管理员账号: admin/admin123' as admin_account;
SELECT '默认园区管理员: park_manager/123456' as park_account;