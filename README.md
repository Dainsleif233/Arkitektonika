# Arkitektonika

本项目基于 Next.js。重写自[Arkitektonika](https://github.com/Alsace-Technology-Department/Arkitektonika)。

## 功能特性

- 📦 文件自动去重（基于 SHA1 哈希）
- 🔒 可选的密码保护访问
- 🗄️ 支持多种数据库：SQLite、PostgreSQL、MySQL
- ☁️ S3 兼容的对象存储支持
- 🚀 自动过期清理机制
- 📊 文件大小限制和下载速率控制
- 🔗 预签名 URL 下载

## API 端点

### 基础路由格式

- **无密码模式**: `/{endpoint}`
- **密码保护模式**: `/{password}/{endpoint}`

### 上传建筑文件

```http
POST /upload
Content-Type: multipart/form-data

# 表单字段:
# schematic: 建筑文件 (.schematic 或 .schem)
```

**响应示例:**
```json
{
  "download_key": "uuid-download-key",
  "delete_key": "uuid-delete-key"
}
```

### 下载建筑文件

```http
GET /download/{download_key}
```

**响应**: 302 重定向到预签名下载 URL

### 检查下载状态

```http
HEAD /download/{download_key}
```

**响应状态码:**
- `200`: 文件存在且可下载
- `404`: 文件不存在于数据库
- `410`: 文件不存在于存储

### 删除建筑文件

```http
DELETE /delete/{delete_key}
```

**响应状态码:**
- `200`: 删除成功
- `404`: 文件不存在于数据库
- `410`: 文件不存在于存储

### 检查删除状态

```http
HEAD /delete/{delete_key}
```

### 清理过期文件（管理员）

```http
HEAD /clean/{clean_password}
```

自动清理超过 30 天的过期文件。

## 环境变量配置

### 基础配置

| 变量名 | 描述 | 默认值 | 必需 |
|--------|------|--------|------|
| `PASSWORD` | API 访问密码（可选） | - | ❌ |
| `ALLOW_ORIGIN` | CORS 允许的源 | `*` | ❌ |
| `CLEAN_PWD` | 清理功能密码 | - | ✅ |

### 文件上传配置

| 变量名 | 描述 | 默认值 | 必需 |
|--------|------|--------|------|
| `MAX_SCHEMATIC_SIZE` | 最大文件大小（字节） | `0`（无限制） | ❌ |

### 数据库配置

| 变量名 | 描述 | 默认值 | 必需 |
|--------|------|--------|------|
| `DB_TYPE` | 数据库类型 (`sqlite`/`postgres`/`mysql`) | `sqlite` | ❌ |
| `DB_NAME` | 数据库名称 | `arkitektonika.db` | ❌ |
| `DB_TABLE` | 数据表名称 | `Arkitektonika` | ❌ |
| `DB_HOST` | 数据库主机 | `localhost` | ❌* |
| `DB_PORT` | 数据库端口 | `5432`/`3306` | ❌* |
| `DB_USERNAME` | 数据库用户名 | `root` | ❌* |
| `DB_PASSWORD` | 数据库密码 | - | ❌* |

*仅在使用 PostgreSQL 或 MySQL 时需要

### S3 存储配置

| 变量名 | 描述 | 默认值 | 必需 |
|--------|------|--------|------|
| `REGION` | S3 区域 | - | ✅ |
| `STORAGE_API` | S3 API 端点 | - | ✅ |
| `ACCESS_KEY` | S3 访问密钥 | - | ✅ |
| `SECRET_KEY` | S3 秘密密钥 | - | ✅ |
| `BUCKET_NAME` | S3 存储桶名称 | - | ✅ |
| `DOWNLOAD_RATE_LIMIT` | 下载速率限制（字节/秒） | `0`（无限制） | ❌ |

### 运行时配置

| 变量名 | 描述 | 默认值 | 必需 |
|--------|------|--------|------|
| `NODE_ENV` | 运行环境 | `development` | ❌ |

## 云函数部署

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Dainsleif233/Arkitektonika)

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Dainsleif233/Arkitektonika)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Dainsleif233/Arkitektonika)

## 技术栈

- **框架**: Next.js 15.4.6
- **数据库 ORM**: TypeORM 0.3.25
- **对象存储**: AWS SDK for JavaScript v3
- **数据库支持**: SQLite3, PostgreSQL, MySQL2
- **语言**: TypeScript

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 贡献

欢迎提交 Issue 和 Pull Request！

## 支持

如果您在使用过程中遇到问题，请创建 Issue 或联系维护者。