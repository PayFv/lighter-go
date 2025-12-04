const fs = require('fs');
const path = require('path');

// 加载 Go 的 wasm_exec.js
require(path.join(__dirname, '../../wasm/wasm_exec.js'));

class WASM {
  constructor(options = {}) {
    this.go = null;
    this.instance = null;
    // 可配置的初始化延迟时间（毫秒），默认 100ms
    this.initDelay = options.initDelay || 100;
  }

  async init(wasmPath) {
    // 创建 Go 实例
    this.go = new Go();
    
    // 读取 WASM 文件
    const wasmBuffer = fs.readFileSync(wasmPath);
    
    // 编译和实例化 WASM
    const result = await WebAssembly.instantiate(wasmBuffer, this.go.importObject);
    this.instance = result.instance;
    
    // 运行 Go 程序 (异步执行，不等待完成因为 Go 程序会一直运行)
    // Go 的 main() 函数会注册所有全局函数，然后通过 select{} 保持运行
    this.go.run(this.instance);
    
    // 等待一小段时间确保 Go 的 main() 函数已经执行并注册了所有函数
    // 默认 100ms 通常足够，但可以通过构造函数配置调整
    await new Promise(resolve => setTimeout(resolve, this.initDelay));
    
    return this;
  }
}

module.exports = { WASM };
