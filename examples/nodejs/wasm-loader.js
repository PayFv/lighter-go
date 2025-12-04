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
    
    // 运行 Go 程序
    this.go.run(this.instance);
    
    return this;
  }
}

module.exports = { WASM };
