# PayPal 支付问题诊断与解决方案

本指南帮助你诊断和解决 PayPal 支付集成中的 "Unable to create PayPal order" 错误。

## 🚀 快速诊断

### 方法 1：使用网页诊断工具
1. 启动开发服务器：`pnpm dev`
2. 访问：http://localhost:3000/paypal-test
3. 点击 "Check Configuration" 查看配置状态
4. 点击 "Test PayPal Order Creation" 测试支付功能

### 方法 2：使用命令行工具
```bash
pnpm paypal:test
```

## ⚙️ 环境变量配置

确保在 `.env` 文件中设置以下必需的环境变量：

```env
# PayPal 配置
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox  # 或 'live' 用于生产环境

# 数据库配置
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# NextAuth 配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# 其他 OAuth 提供商 (可选)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## 🔧 获取 PayPal 凭据

### 1. 创建 PayPal 开发者应用
1. 访问 [PayPal 开发者控制台](https://developer.paypal.com)
2. 登录你的 PayPal 账户
3. 转到 "My Apps & Credentials"
4. 点击 "Create App"
5. 选择应用类型为 "Merchant"
6. 选择 Sandbox 或 Live 环境

### 2. 获取凭据
- **Client ID**：在应用详情页面可以看到
- **Client Secret**：点击 "Show" 按钮查看
- 将这些值添加到你的 `.env` 文件中

### 3. 配置 Webhook (可选)
如果需要接收支付通知，在应用设置中配置 Webhook URL

## 🐛 常见错误及解决方案

### ❌ "PayPal credentials are not configured"
**原因**：缺少 PAYPAL_CLIENT_ID 或 PAYPAL_CLIENT_SECRET
**解决方案**：
```bash
# 检查 .env 文件是否存在这些变量
cat .env | grep PAYPAL
```

### ❌ "PayPal auth failed with status 401"
**原因**：PayPal 凭据无效或过期
**解决方案**：
1. 验证 PayPal 开发者控制台中的凭据
2. 确保使用的是正确环境的凭据 (sandbox vs live)
3. 重新生成 Client Secret

### ❌ "PayPal order creation failed: 400"
**原因**：请求参数无效
**解决方案**：
1. 检查金额格式（应为字符串，如 "2.90"）
2. 检查货币代码（应为 "USD"）
3. 验证 return_url 和 cancel_url 格式

### ❌ "Database error"
**原因**：数据库连接问题或 orders 表不存在
**解决方案**：
```bash
# 验证数据库连接
pnpm db:verify

# 如果表不存在，运行迁移
pnpm db:setup
```

### ❌ "Unauthorized"
**原因**：用户未登录
**解决方案**：
1. 确保用户已登录
2. 检查 NextAuth 配置
3. 验证 session 状态

## 🔍 详细诊断步骤

### 1. 检查环境配置
```bash
# 查看当前环境变量（不显示敏感值）
curl http://localhost:3000/api/paypal-diagnostics
```

### 2. 测试 PayPal 认证
访问诊断页面会自动测试：
- PayPal 凭据验证
- Access Token 获取
- 测试订单创建

### 3. 查看详细日志
启动开发服务器并查看控制台输出：
```bash
pnpm dev
```
尝试创建支付时，控制台会显示详细的调试信息。

## 📁 相关文件

### 核心文件
- `lib/paypal.ts` - PayPal API 集成
- `app/api/payments/paypal/create/route.ts` - 创建订单 API
- `app/api/payments/paypal/capture/route.ts` - 捕获支付 API

### 诊断工具
- `app/paypal-test/page.tsx` - 网页诊断界面
- `app/api/paypal-diagnostics/route.ts` - 配置诊断 API
- `scripts/paypal-diagnostic.ts` - 命令行诊断工具

### 支付页面
- `components/payment-page-content.tsx` - 支付页面组件
- `app/pricing/page.tsx` - 定价页面
- `app/payment-success/page.tsx` - 支付成功页面

## 🎯 支付流程

1. **用户选择计划** → 调用 `/api/payments/paypal/create`
2. **创建 PayPal 订单** → 返回 approval URL
3. **跳转到 PayPal** → 用户完成支付
4. **PayPal 重定向回应用** → 带有 token 参数
5. **捕获支付** → 调用 `/api/payments/paypal/capture`
6. **更新用户状态** → 跳转到成功页面

## 📊 监控和日志

### 开发环境
- 控制台日志包含详细的调试信息
- 错误会显示具体的失败原因

### 生产环境
建议添加：
- 错误监控（如 Sentry）
- 支付日志记录
- 健康检查端点

## 🆘 需要帮助？

如果问题仍然存在：

1. **检查网络连接**：确保可以访问 PayPal API
2. **验证环境**：确认使用的是正确的 sandbox/live 环境
3. **查看 PayPal 文档**：[PayPal Orders API](https://developer.paypal.com/docs/api/orders/v2/)
4. **联系支持**：提供诊断页面的输出结果

## 🔄 故障排除检查清单

- [ ] `.env` 文件存在且包含所有必需变量
- [ ] PayPal 凭据来自正确的环境 (sandbox/live)
- [ ] 数据库连接正常且 orders 表存在
- [ ] 用户已登录且有有效 session
- [ ] 网络可以访问 PayPal API
- [ ] 诊断页面显示所有检查都通过
- [ ] 控制台没有 JavaScript 错误