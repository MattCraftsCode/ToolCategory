# Auth.js 故障排除指南

## 问题: OAuthAccountNotLinked 错误

### 症状
当尝试使用 GitHub 登录时，页面重定向到：
```
http://localhost:3000/?error=OAuthAccountNotLinked
```

### 原因
这个错误发生在以下情况：
1. 你已经用 Google 账号登录过（使用邮箱 hexiaobai555@gmail.com）
2. 你的 GitHub 账号也使用同一个邮箱
3. Auth.js 默认不允许自动链接不同 OAuth provider 的账户（安全考虑）

### 解决方案

#### 方案 1: 启用自动账户链接（已实施）
在 `lib/auth.ts` 中为每个 provider 添加 `allowDangerousEmailAccountLinking: true`：

```typescript
providers: [
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    allowDangerousEmailAccountLinking: true, // ✅ 允许自动链接
  }),
  GitHub({
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    allowDangerousEmailAccountLinking: true, // ✅ 允许自动链接
  }),
]
```

**注意**: 这个选项名为 "dangerous" 是因为在某些场景下可能存在安全风险。只在以下情况使用：
- 开发环境
- 信任的 OAuth providers (Google, GitHub 等)
- 用户邮箱已经过 OAuth provider 验证

#### 方案 2: 清空数据库重新开始
如果你想重新开始，可以清空用户表：

```sql
DELETE FROM "session";
DELETE FROM "account";
DELETE FROM "user";
```

或使用脚本创建清理工具。

### 验证修复

重启开发服务器后：
1. 使用 GitHub 登录
2. 应该能成功登录
3. 运行 `pnpm db:check-users` 查看账户链接情况

你应该看到同一个用户关联了两个账户：
- google (oidc)
- github (oauth)

## 实用命令

```bash
# 查看所有用户和关联账户
pnpm db:check-users

# 验证数据库表结构
pnpm db:verify

# 重新创建 Auth.js 表（如果需要）
pnpm db:setup
```

## 生产环境建议

对于生产环境，建议：
1. **不要**使用 `allowDangerousEmailAccountLinking`
2. 实现手动账户链接流程
3. 在用户尝试用不同 provider 登录时，显示友好的错误消息
4. 允许用户在设置中手动链接/取消链接账户
