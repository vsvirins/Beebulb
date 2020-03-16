import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import store from "./store/store";
import "./quasar";

Vue.config.productionTip = false;

new Vue({
  store,
  //TODO: check if 'remember me' is checked.
  /*   created() {
    store.dispatch('autoLogin')
      .catch(false);
  }, */
  render: h => h(App)
}).$mount("#app");
