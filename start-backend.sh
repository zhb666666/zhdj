#!/bin/bash

# 智慧党建系统 - 后端启动脚本

echo "=========================================="
echo "智慧党建管理系统 - 后端服务启动"
echo "=========================================="
echo ""

# 检查Java环境
if ! command -v java &> /dev/null; then
    echo "❌ 错误: 未找到Java环境"
    echo "请安装 Java 17 或更高版本"
    exit 1
fi

JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt 17 ]; then
    echo "❌ 错误: Java版本过低 (当前: $JAVA_VERSION, 需要: 17+)"
    exit 1
fi

echo "✓ Java环境检查通过 (版本: $JAVA_VERSION)"
echo ""

# 检查MySQL连接
echo "检查数据库连接..."
if command -v mysql &> /dev/null; then
    DB_HOST=${DB_HOST:-localhost}
    DB_PORT=${DB_PORT:-3306}
    DB_NAME=${DB_NAME:-smart_party_building}
    DB_USER=${DB_USER:-root}
    
    # 注意: 这里不检查实际连接，只是提示
    echo "✓ MySQL客户端已安装"
    echo "  数据库地址: $DB_HOST:$DB_PORT"
    echo "  数据库名称: $DB_NAME"
    echo ""
else
    echo "⚠ 警告: 未找到MySQL客户端"
    echo ""
fi

# 进入后端目录
cd "$(dirname "$0")/backend" || exit 1

# 检查Maven环境
if [ -f "mvnw" ]; then
    echo "使用项目自带的Maven Wrapper"
    MAVEN_CMD="./mvnw"
elif command -v mvn &> /dev/null; then
    echo "使用系统Maven"
    MAVEN_CMD="mvn"
else
    echo "❌ 错误: 未找到Maven环境"
    echo "请安装Maven或使用Maven Wrapper"
    exit 1
fi

echo ""
echo "=========================================="
echo "开始启动Spring Boot应用..."
echo "=========================================="
echo ""

# 启动应用
$MAVEN_CMD spring-boot:run

# 如果启动失败
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ 后端服务启动失败"
    echo ""
    echo "故障排查步骤："
    echo "1. 检查MySQL服务是否运行"
    echo "2. 检查数据库配置 (application.yml)"
    echo "3. 确认数据库已创建和初始化"
    echo "4. 查看错误日志获取详细信息"
    exit 1
fi
