const fs = require('fs');
const { WASM } = require('./wasm-loader');

async function main() {
  // 初始化 WASM
  const wasm = new WASM();
  await wasm.init('../../wasm/lighter.wasm');

  console.log('WASM loaded successfully!\n');

  // 示例 1: 生成 API Key
  console.log('=== Example 1: Generate API Key ===');
  const seed = process.env.SEED_PHRASE || 'REPLACE_WITH_YOUR_ACTUAL_SEED_PHRASE_HERE_DO_NOT_USE_THIS_DEFAULT';
  
  // 安全检查：防止使用默认的占位符种子短语
  if (seed.includes('REPLACE_WITH') || seed.includes('DO_NOT_USE')) {
    console.warn('\n⚠️  WARNING: You are using the default placeholder seed phrase!');
    console.warn('This is for demonstration purposes only.');
    console.warn('For actual use, set the SEED_PHRASE environment variable or modify the code.\n');
  }
  
  const apiKeyResult = GenerateAPIKey(seed);
  
  if (apiKeyResult.error) {
    console.error('Error:', apiKeyResult.error);
  } else {
    console.log('Private Key:', apiKeyResult.privateKey);
    console.log('Public Key:', apiKeyResult.publicKey);
  }

  // 示例 2: 创建客户端
  console.log('\n=== Example 2: Create Client ===');
  const clientConfig = {
    url: 'https://api.lighter.xyz',  // 替换为实际的 API URL
    privateKey: apiKeyResult.privateKey,
    chainId: 1,
    apiKeyIndex: 0,
    accountIndex: 0
  };

  const createResult = CreateClient(
    clientConfig.url,
    clientConfig.privateKey,
    clientConfig.chainId,
    clientConfig.apiKeyIndex,
    clientConfig.accountIndex
  );

  if (createResult.error) {
    console.error('Error:', createResult.error);
  } else {
    console.log('Client created successfully!');
  }

  // 示例 3: 检查客户端
  console.log('\n=== Example 3: Check Client ===');
  const checkResult = CheckClient(
    clientConfig.apiKeyIndex,
    clientConfig.accountIndex
  );

  if (checkResult.error) {
    console.error('Error:', checkResult.error);
  } else {
    console.log('Client check passed!');
  }

  // 示例 4: 创建认证令牌
  console.log('\n=== Example 4: Create Auth Token ===');
  const deadline = Math.floor(Date.now() / 1000) + 3600; // 1小时后过期
  const authResult = CreateAuthToken(
    deadline,
    clientConfig.apiKeyIndex,
    clientConfig.accountIndex
  );

  if (authResult.error) {
    console.error('Error:', authResult.error);
  } else {
    console.log('Auth Token:', authResult.authToken);
  }

  // 示例 5: 签名创建订单
  console.log('\n=== Example 5: Sign Create Order ===');
  const orderResult = SignCreateOrder(
    0,      // marketIndex
    1,      // clientOrderIndex
    1000,   // baseAmount
    50000,  // price
    0,      // isAsk (0=buy, 1=sell)
    0,      // orderType
    0,      // timeInForce
    0,      // reduceOnly
    0,      // triggerPrice
    -1,     // orderExpiry (-1 for default)
    -1,     // nonce (-1 for auto)
    clientConfig.apiKeyIndex,
    clientConfig.accountIndex
  );

  if (orderResult.error) {
    console.error('Error:', orderResult.error);
  } else {
    console.log('Transaction Type:', orderResult.txType);
    console.log('Transaction Hash:', orderResult.txHash);
    console.log('Transaction Info:', orderResult.txInfo);
  }

  // 示例 6: 签名取消订单
  console.log('\n=== Example 6: Sign Cancel Order ===');
  const cancelResult = SignCancelOrder(
    0,      // marketIndex
    1,      // orderIndex
    -1,     // nonce
    clientConfig.apiKeyIndex,
    clientConfig.accountIndex
  );

  if (cancelResult.error) {
    console.error('Error:', cancelResult.error);
  } else {
    console.log('Cancel Transaction Hash:', cancelResult.txHash);
  }

  // 示例 7: 签名提现
  console.log('\n=== Example 7: Sign Withdraw ===');
  const withdrawResult = SignWithdraw(
    100000, // usdcAmount
    -1,     // nonce
    clientConfig.apiKeyIndex,
    clientConfig.accountIndex
  );

  if (withdrawResult.error) {
    console.error('Error:', withdrawResult.error);
  } else {
    console.log('Withdraw Transaction Hash:', withdrawResult.txHash);
    if (withdrawResult.messageToSign) {
      console.log('Message to Sign:', withdrawResult.messageToSign);
    }
  }
}

main().catch(console.error);
