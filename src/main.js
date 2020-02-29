import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import store from './store/store';
import './quasar';

Vue.config.productionTip = false;

new Vue({
  store,
  created() {
    store
      .dispatch('discoverGateway')
      .then(() => store.dispatch('getLights'))
      .then(() => store.dispatch('getGroups'))
      .catch(false);
  },
  render: h => h(App)
}).$mount('#app');
