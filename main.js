
import './src/scss/index.scss';
import MVVM from './src/js/mvvm.js';

const vm = new MVVM({
  el: '#mvvm',
  data: {
    word: 'hello world'
  },
  methods: {
    sayHi () {
      this.word = 'hi everybody';
    }
  }
})

