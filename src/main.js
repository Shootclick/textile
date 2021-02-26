import Vue from 'vue';
import store from './store';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import JsonExcel from 'vue-json-excel';
import VueLodash from 'vue-lodash'
import lodash from 'lodash';
 
Vue.component('downloadExcel', JsonExcel)
Vue.use(require('vue-moment'));
Vue.use(VueLodash, {lodash: lodash })
Vue.config.productionTip = false;
Vue.use(vuetify, {
  iconfont: 'mdiSvg' // 'md' || 'mdi' || 'fa' || 'fa4'
})

// export default new vuetify({
//   icons: {
//     iconfont: 'mdi', // default - only for display purposes
//   },
// });

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
