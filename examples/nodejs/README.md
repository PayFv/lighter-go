# Lighter WASM Node.js Demo

这个示例演示了如何在 Node.js 中使用 lighter-go 编译的 WASM 模块。

## 前置要求

- Node.js >= 16.0.0
- 已编译的 `lighter.wasm` 和 `wasm_exec.js` 文件

## 构建 WASM

```bash
cd wasm
GOOS=js GOARCH=wasm go build -o lighter.wasm main.go
cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" .
```

## 运行示例

```bash
cd examples/nodejs
npm install
npm run demo
```

## 可用的函数

### 1. GenerateAPIKey(seed)
生成 API 密钥对。

**参数:**
- `seed` (string): 种子短语

**返回:**
- `privateKey` (string): 私钥
- `publicKey` (string): 公钥

### 2. CreateClient(url, privateKey, chainId, apiKeyIndex, accountIndex)
创建客户端实例。

### 3. CheckClient(apiKeyIndex, accountIndex)
检查客户端状态。

### 4. CreateAuthToken(deadline, apiKeyIndex, accountIndex)
创建认证令牌。

### 5. SignCreateOrder(...)
签名创建订单交易。

### 6. SignCancelOrder(...)
签名取消订单交易。

### 7. SignWithdraw(...)
签名提现交易。

### 8. SignTransfer(...)
签名转账交易。

更多函数请参考 `wasm/main.go` 源代码。

## 注意事项

- WASM 模块初始化是异步的，必须等待 `wasm.init()` 完成后再调用函数
- 所有 WASM 导出的函数调用本身是同步的，并返回包含 `error` 字段的对象
- 如果操作成功，`error` 字段为 `undefined`
- 如果操作失败，`error` 字段包含错误信息
- 请确保在实际使用时替换示例中的种子短语和 API URL

## 主要功能

### 密钥管理
- 生成 API 密钥对
- 创建和管理客户端

### 交易签名
- 创建订单
- 取消订单
- 修改订单
- 创建分组订单

### 账户操作
- 转账
- 提现
- 更新杠杆
- 更新保证金

### 子账户和流动性池
- 创建子账户
- 创建公共池
- 更新公共池
- 铸造和销毁份额

## 示例输出

```
WASM loaded successfully!

=== Example 1: Generate API Key ===
Private Key: 0x...
Public Key: 0x...

=== Example 2: Create Client ===
Client created successfully!

=== Example 3: Check Client ===
Client check passed!

...
```
