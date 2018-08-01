/**
 * @author shaoDong
 * @email scut_sd@163.com
 * @create date 2018-07-28 10:40:09
 * @modify date 2018-07-28 10:40:09
 * @desc watcher.js 是订阅者，通过dep 添加到订阅器中
*/

import Dep from './dep.js';

class Watcher {
  constructor(vm, expOrFn, cb) {
    // console.log(expOrFn);
    this.cb = cb;
    this.vm = vm;
    this.expOrFn = expOrFn;
    this.depIds = {};

    // 此处为了触发属性的getter，从而在dep添加自己，结合Observer更易理解
    // if (typeof expOrFn === 'function') {
    //   this.getter = expOrFn;
    // } else {
    //   this.getter = this.parseGetter(expOrFn);
    // }
    let val = this.get();
    let tampVal;

    // 如果当前订阅的值是数组或者对象对其进行深度复制
    if(typeof val === 'object' && val !== null){
      if(Array.isArray(val)){
        tampVal = [];
        for(var i = 0,len = val.length;i<len;i++){
          tampVal.push(val[i]);
        }
      }else{
        tampVal = {};
        for(var j in val){
          tampVal[j] = val[j];
        }
      }
      this.value = tampVal;
    }else{
      this.value = val;
    }
  }

  update() {
    this.run();
  }

  run() {
    let value = this.get();
    let oldVal = this.value;
    if (value !== oldVal) {
      this.value = value;
      // console.log('36', this.cb);
      this.cb.call(this.vm, value, oldVal);
    }
  }

  // 这个函数到底是把什么添加到什么里面去
  addDep(dep) {
    if (!this.depIds.hasOwnProperty(dep.id)) {
      dep.addSub(this);
      this.depIds[dep.id] = dep;
    }
  }

  get() {
    // 为什么要设置target 的值
    Dep.target = this;
    // 为啥传两个值？
    // console.log('51', this.getter);
    // let value = this.getter.call(this.vm, this.vm);
    let value = this.vm[this.expOrFn];
    Dep.target = null;
    return value;
  }

  parseGetter(exp) {
    // 这个正则是什么意思？
    if (/[^\w.$]/.test(exp)) {
      return; 
    }
    let exps = exp.split('.');
    return function(obj) {
      for (let i = 0, len = exps.length; i < len; i++) {
        if (!obj) return;
        obj = obj[exps[i]];
      }
      return obj;
    };
  }
}

export default Watcher;
