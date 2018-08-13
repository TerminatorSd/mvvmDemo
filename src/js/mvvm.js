/**
 * @author shaoDong
 * @email scut_sd@163.com
 * @create date 2018-07-28 10:45:40
 * @modify date 2018-07-28 10:45:40
 * @desc mvvm
*/
import Compiler from './compiler.js';
import { observe } from './observe.js';

class MVVM {
  constructor(options) {
    const a = new Map();
    const b = {key: 'b'};
    const c = {key: 'c'};

    let arr = [1, 3];
    this.$options = options;
    let data = this._data = this.$options.data;
    // 数据代理
    // 实现 vm.xxx -> vm._data.xxx
    Object.keys(data).forEach((key) => {
      this._proxyData(key);
    });
    observe(data, this);
    this.$compile = new Compiler(options.el || document.body, this);
  }

  _proxyData(key) {
    let me = this;
    Object.defineProperty(me, key, {
      configurable: false,
      enumerable: true,
      get: () => {
        return me._data[key];
      },
      set: (newVal) => {
        me._data[key] = newVal;
      }
    });
  }
}

export default MVVM;
