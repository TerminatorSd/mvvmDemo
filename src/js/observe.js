/**
 * @author shaoDong
 * @email scut_sd@163.com
 * @create date 2018-07-28 09:57:20
 * @modify date 2018-07-28 09:57:20
 * @desc observe.js 该方法实现对data 中数据的属性劫持
*/

import Dep from './dep.js';

// 使用defineProperty 递归劫持对象中的每一个属性
function observe(value, vm) {
  if (!value || typeof value !== 'object') {
    return;
  }
  return new Observer(value);
}

class Observer {
  constructor(data) {
    this.data = data;
    this.walk(data);
  }

  walk(data) {
    Object.keys(data).forEach((key) => {
      this.convert(key, data[key]);
    });
  }

  convert(key, value) {
    this.defineReactive(this.data, key, value);
  }

  defineReactive(data, key, val) {
    let dep = new Dep();
    let childObj = observe(val);
  
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: false,
      get: () => {
        // 由于需要在闭包内添加watcher，所以通过Dep定义一个全局target属性，暂存watcher, 添加完移除
        if (Dep.target) {
          dep.depend();
        }
        return val;
      },
      set: (newVal) => {
        if (val === newVal) {
          return;
        }
        val = newVal;
        // 新的值是object的话，进行监听
        childObj = observe(newVal);
        // 通知订阅者
        dep.notify();
      }
    });
  }
}

export { observe };
