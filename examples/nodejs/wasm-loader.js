const fs = require('fs');
const path = require('path');

// 加载 Go 的 wasm_exec.js
require(path.join(__dirname, '../../wasm/wasm_exec.js'));

class WASM {
  constructor() {
    this.go = null;
    this.instance = null;
  }

  async init(wasmPath) {
    // 创建 Go 实例
    this.go = new Go();
    
    // 读取 WASM 文件
    const wasmBuffer = fs.readFileSync(wasmPath);
    
    // 编译和实例化 WASM
    const result = await WebAssembly.instantiate(wasmBuffer, this.go.importObject);
    this.instance = result.instance;
    
    // 运行 Go 程序 (异步执行)
    // 注意: go.run() 是异步的，但通常 Go 的 main 函数会立即设置全局函数
    // 如果遇到时序问题，可以在调用 WASM 函数前添加短暂延迟
    this.go.run(this.instance);
    
    return this;
  }
}

module.exports = { WASM };
