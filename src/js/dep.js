/**
 * @author shaoDong
 * @email scut_sd@163.com
 * @create date 2018-07-29 11:58:02
 * @modify date 2018-07-29 11:58:02
 * @desc dep.js 这是一个订阅器，但是不知道为什么叫dep
*/

let uid = 0;

// 通过Dep 来添加订阅者
class Dep {
  constructor () {
    this.id = uid++;
    this.subs = [];
  }

  addSub(sub) {
    this.subs.push(sub);
  }

  removeSub(sub) {
    let index = this.subs.indexOf(sub);
    if (index != -1) {
      this.subs.splice(index, 1);
    }
  }

  notify() {
    this.subs.forEach((sub) => {
      sub.update();
    });
  }

  // 将当前Dep.target 指向的Watcher 实例添加到当前Dep 的实例中
  depend() {
    Dep.target.addDep(this);
  }
}

Dep.target = null;

export default Dep;
