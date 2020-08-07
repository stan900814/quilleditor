import Vue from 'vue'
import App from './App.vue'
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'highlight.js/styles/monokai-sublime.css'
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
