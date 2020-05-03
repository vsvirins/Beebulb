import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import store from "./store/store";
import "./quasar";

Vue.config.productionTip = false;

new Vue({
  store,
  created() {
    store
      .dispatch("autoLogin")
      .then((response) => {
        if (response.enabled) {
          store.commit("AUTH", true);
          store.commit("SET_KEY", response.key);
          store.commit("SET_USER", response.username);
          store
            .dispatch("discoverGateway")
            .then(() => store.dispatch("getLights"))
            .then(() => store.dispatch("getGroups"))
            .then(() => store.dispatch("getPresets"))
            //.then(() => store.dispatch("connectToWebSocket"))
            .catch((err) => console.error(err));
        }
      })
      .catch((err) => console.error(err));
  },
  render: (h) => h(App),
}).$mount("#app");
