/**
 * @author shaoDong
 * @email scut_sd@163.com
 * @create date 2018-07-28 10:37:35
 * @modify date 2018-07-28 10:37:35
 * @desc compile
*/

import Watcher from './watcher.js';

class Compiler {
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = this.isElementNode(el) ? el : document.querySelector(el);

    if (this.$el) {
      this.$fragment = this.node2Fragment(this.$el);
      this.init();
      this.$el.appendChild(this.$fragment);
    }
  }

  init() {
    this.compileElement(this.$fragment);
  }

  node2Fragment(el) {
    let child;
    let fragment = document.createDocumentFragment();
    // 将原生节点拷贝到fragment
    while (child = el.firstChild) {
      // 从el 剪切到fragment
      fragment.appendChild(child);
    }
    return fragment;
  }

  compileElement(el) {
    let childNodes = el.childNodes;
    let reg = /\{\{(.*)\}\}/;
    Array.from(childNodes).forEach((node) => {
      let text = node.textContent;
      // 按元素节点方式编译
      if (this.isElementNode(node)) {
        this.compile(node);
      } else if (this.isTextNode(node) && reg.test(text)) {
        // RegExp.$1 为匹配的 {{}} 内的值
        this.compileText(node, RegExp.$1);
      }
      // 遍历编译子节点
      if (node.childNodes && node.childNodes.length) {
        this.compileElement(node);
      }
    });
  }

  compile(node) {
    let nodeAttrs = node.attributes;
    Array.from(nodeAttrs).forEach((attr) => {
      // 规定：指令以 v-xxx 命名
      // 如 <span v-text="content"></span> 中指令为 v-text
      let attrName = attr.name;
      let exp = attr.value;
      if (this.isDirective(attrName)) {
        // difference: toDir
        let dir = attrName.substring(2);
        if (this.isEventDirective(dir)) {
          compileUtil.eventHandler(node, this.$vm, exp, dir);
        } else {
          // 少个参数attrName
          compileUtil[dir] && compileUtil[dir](node, this.$vm, exp, attrName);
        }
        // 少了这句
        node.removeAttribute(attrName);
      }
    });
  }

  compileText(node, exp) {
    // exp 表示正则表达式匹配的值，此处为 {{}} 内包含的值
    compileUtil.text(node, this.$vm, exp);
  }

  isElementNode(node) {
    return node.nodeType == 1;
  }

  isTextNode(node) {
    return node.nodeType == 3;
  }

  isDirective(attr) {
    return attr.indexOf('v-') == 0;
    // another method
    // var reg = /^(v-)|(\:)|(\@)/;
		// return reg.test(val.trim());
  }

  isEventDirective(dir) {
    return dir.indexOf('on') == 0;
  }
}

const compileUtil = {
  text: function(node, vm, exp) {
    console.log(exp);
    this.bind(node, vm, exp, 'text');
  },
  // 一开始没加，运行后不行作用！！！
  // 两个github 具体实现不太一样
  model: function(node, vm, exp) {
    this.bind(node, vm, exp, 'model');
    let val = this._getVMVal(vm, exp);
    node.addEventListener('input', (e) => {
      let newVal = e.target.value;
      if (val === newVal) {
        return;
      }
      this._setVMVal(vm, exp, newVal);
      // 多此一举？？？
      val = newVal;
    })
  },
  bind: function(node, vm, exp, dir) {
    let updaterFn = updater[dir + 'Updater'];
    // 第一次初始化视图
    if (updaterFn) {
      updaterFn(node, this._getVMVal(vm, exp));
    }
    // 实例化订阅者，此操作会在对应的属性消息订阅器中添加了该订阅者watcher
    new Watcher(vm, exp, (value, oldValue) => {
      // 一旦属性值有变化，会收到通知执行此更新函数，更新视图
      // 每次发布消息的时候执行以下操作
      if (updaterFn) {
        updaterFn(node, value, oldValue);
      }
    });
  },
  _getVMVal: function(vm, exp) {
    // 假设一个变量是a.b.c.d，当前操作可以保证取到最终的d
    let val = vm;
    exp = exp.split('.');
    exp.forEach((k) => {
      val = val[k];
    })
    return val;
  },
  _setVMVal: function(vm, exp, value) {
    let val = vm;
    exp = exp.split('.');
    exp.forEach(((k, i) => {
      if (i < exp.length - 1) {
        val = val[k];
      } else {
        val[k] = value;
      }
    }))
  },
  eventHandler(node, vm, exp, dir) {
    let eventType = dir.split(':')[1];
    let fn = vm.$options.methods && vm.$options.methods[exp];

    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm), false);
    }
  }
};

const updater = {
  textUpdater: (node, value) => {
    node.textContent = typeof value === 'undefined' ? '' : value;
  },
  modelUpdater: (node, value, oldValue) => {
    node.value = typeof value === 'undefined' ? '' : value;
  }
};

export default Compiler;
