import Vue from "vue";
import Vuex from "vuex";
//import actions from './modules/actions'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    gateway: { 0: { name: "" } },
    key: "", //A2D4D78CA0
    user: "",
    groups: [],
    lights: [],
    presets: []
  },
  mutations: {
    SET_GATEWAY(state, gateway) {
      state.gateway = gateway;
    },
    SET_KEY(state, key) {
      state.key = key;
    },
    SET_GROUPS(state, groups) {
      state.groups = groups;
    },
    SET_LIGHTS(state, lights) {
      state.lights = lights;
    },
    SET_PRESET(state, preset) {
      state.presets = [...state.presets, preset];
    },
    CLEAR_PRESETS(state) {
      state.presets = [];
    },
    SET_USER(state, user) {
      state.user = user;
    }
  },
  actions: {
    async discoverGateway(task) {
      // https://dresden-light.appspot.com/discover
      const url = "https://dresden-light.appspot.com/discover";
      try {
        const response = await fetch(url);
        const data = await response.json();
        Array.isArray(data) && data.length
          ? task.commit("SET_GATEWAY", data)
          : task.commit("SET_GATEWAY", false);
      } catch (err) {
        console.log(err);
        task.commit("SET_GATEWAY", false);
      }
    },

    async getGroups(task) {
      const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/groups`;
      try {
        if (this.getters.gatewayFound) {
          const response = await fetch(url);
          const data = await response.json();
          task.commit("SET_GROUPS", data);
        } else null;
      } catch (err) {
        console.log(err);
      }
    },

    async getLights(task) {
      const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/lights`;
      try {
        if (this.getters.gatewayFound) {
          const respone = await fetch(url);
          const data = await respone.json();
          return task.commit("SET_LIGHTS", data);
        } else null;
      } catch (err) {
        console.log(err);
      }
    },

    async getLightState(task, { id }) {
      const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/lights/${id}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        return data.state.on;
      } catch (err) {
        console.log(err);
      }
    },

    async lightOnOff(task, { state, id }) {
      const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/lights/${id}/state`;
      const params = `{"on": ${!state}, "bri": 200, "ct": 300}`;
      try {
        await fetch(url, { method: "PUT", body: params });
      } catch (err) {
        console.log(err);
      }
    },

    async setDim(task, { input, id }) {
      const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/lights/${id}/state`;
      const params = `{"on": true, "bri": ${input}, "ct": ${500 - input}}`;
      try {
        await fetch(url, { method: "PUT", body: params });
      } catch (err) {
        console.log(err);
      }
    },

    async toggleAllLights(task, { state }) {
      const params = `{"on": ${state}, "bri": 200, "ct": 300}`;
      const groups = Object.keys(this.getters.groups);
      for (let group in groups) {
        try {
          const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/groups/${groups[group]}/action`;
          (await state)
            ? fetch(url, { method: "PUT", body: params })
            : fetch(url, {
                method: "PUT",
                body: '{ "on": false, "bri": 0 }'
              });
        } catch (err) {
          console.log(err);
        }
      }
    },

    async changeGatewayName(task, { name }) {
      const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/config`;
      const params = `{"name": "${name}"}`;
      try {
        await fetch(url, { method: "PUT", body: params });
        this.dispatch("discoverGateway");
      } catch (err) {
        console.log(err);
      }
    },

    async addNewGroup(task, { name }) {
      const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/groups`;
      const params = `{"name": "${name}"}`;
      try {
        await fetch(url, { method: "POST", body: params });
        await this.dispatch("getGroups");
      } catch (err) {
        console.log(err);
      }
    },
    async removeGroup(task, { id }) {
      const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/groups/${id}`;
      try {
        await fetch(url, { method: "DELETE" });
        await this.dispatch("getGroups");
      } catch (err) {
        console.log(err);
      }
    },
    async changeGroupNames(task, { groupNames }) {
      try {
        Object.keys(groupNames).forEach(async group => {
          if (/\S/.test(groupNames[group])) {
            const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/groups/${group}`;
            const params = `{"name": "${groupNames[group]}"}`;
            await fetch(url, { method: "PUT", body: params });
          }
        });
      } catch (err) {
        console.log(err);
      }
    },

    async setNewLightOrder(task, { order }) {
      //const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/groups/${group}`;
      //const params = `{"lights":${lights}}`;
      try {
        this.dispatch("removeAllLights");
        for (let group in order) {
          const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/groups/${group}`;
          let lights = `["${Object.values(order[group]).join('","')}"]`;
          const params = `{"lights":${lights}}`;
          await fetch(url, { method: "PUT", body: params });
        }
      } catch (err) {
        console.log(err);
      }
    },

    removeAllLights() {
      Object.keys(this.state.lights).forEach(async light => {
        const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/lights/${light}/groups`;
        await fetch(url, { method: "DELETE" });
      });
    },

    async registerNewUser(task, { username, password }) {
      const url = "http://192.168.10.110:8080/register";
      const params = JSON.stringify({ username: username, password: password });

      try {
        const response = await fetch(url, {
          method: "POST",
          body: params,
          headers: {
            "Content-Type": "application/json"
          }
        });
        const recieved = await response.json();
        return recieved.msg;
      } catch (err) {
        console.log(err);
      }
    },

    async generateNewKey(task, { username }) {
      const url = "http://192.168.10.110:8080/generate_key";
      const params = JSON.stringify({
        username: username,
        address: this.getters.gatewayAdress
      });

      try {
        const response = await fetch(url, {
          method: "POST",
          body: params,
          headers: {
            "Content-Type": "application/json"
          }
        });
        const key = await response.json();
        return key.msg === "Gateway is locked"
          ? false
          : task.commit("SET_KEY", key.msg);
      } catch (err) {
        console.log(err);
      }
    },

    async loginUser(task, { username, password }) {
      const url = "http://192.168.10.110:8080/login";
      const params = JSON.stringify({ username: username, password: password });

      try {
        const response = await fetch(url, {
          method: "POST",
          body: params,
          headers: {
            "Content-Type": "application/json"
          }
        });
        const recieved = await response.json();
        return recieved.valid_login === true
          ? (task.commit("SET_KEY", recieved.key),
            task.commit("SET_USER", username),
            this.dispatch("discoverGateway")
              .then(() => this.dispatch("getLights"))
              .then(() => this.dispatch("getGroups"))
              .then(() => this.dispatch("getPresets"))
              .catch(false),
            recieved.valid_login)
          : recieved.valid_login;
      } catch (err) {
        console.log(err);
      }
    },

    async createNewPreset(task, { preset }) {
      let groupPreset = {};
      let newPreset = {};
      let id = 0;

      for (let group in this.getters.groups) {
        const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/groups/${group}/scenes`;
        const params = `{"name": "${preset.name}-${group}"}`;

        try {
          const response = await fetch(url, { method: "POST", body: params });

          const data = await response.json();
          id = data[0].success.id;
          groupPreset = {
            id: data[0].success.id,
            groupid: group,
            name: preset.name,
            icon: preset.icon,
            bg: preset.bg,
            color: preset.color
          };
          newPreset = { ...newPreset, [group]: groupPreset };
        } catch (err) {
          console.log(err);
        }
      }
      this.dispatch("storePreset", {
        id: id,
        preset: newPreset
      }),
        task.commit("SET_PRESET", newPreset);
    },

    async storePreset(task, { id, preset }) {
      const url = "http://192.168.10.110:8080/store_preset";
      const base64Preset = btoa(JSON.stringify(preset));
      const params = JSON.stringify({
        id: id,
        preset: base64Preset,
        username: this.state.user
      });

      try {
        await fetch(url, {
          method: "POST",
          body: params,
          headers: {
            "Content-Type": "application/json"
          }
        });
      } catch (err) {
        console.log(err);
      }
    },

    async getPresets(task) {
      const url = "http://192.168.10.110:8080/get_presets";
      const params = JSON.stringify({
        username: this.state.user
      });

      try {
        const response = await fetch(url, {
          method: "POST",
          body: params,
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data = await response.json();
        Object.keys(data).forEach(preset => {
          let decodedPreset = JSON.parse(atob(data[preset]));
          task.commit("SET_PRESET", decodedPreset);
          decodedPreset = {};
        });
      } catch (err) {
        console.log(err);
      }
    },

    async recallPreset(task, { groupid, id }) {
      const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/groups/${groupid}/scenes/${id}/recall`;

      try {
        await fetch(url, { method: "PUT" });
      } catch (err) {
        console.log(err);
      }
    },
    async deletePreset(task, { preset }) {
      let presetId = 0;
      let removedFromGateway = undefined;

      for (let group in preset) {
        presetId = preset[group].id;
        const gatewayUrl = `http://${this.getters.gatewayAdress}/api/${this.state.key}/groups/${preset[group].groupid}/scenes/${presetId}`;
        try {
          let response = await fetch(gatewayUrl, { method: "DELETE" });
          response.ok
            ? (removedFromGateway = true)
            : (removedFromGateway = false);
        } catch (err) {
          console.log(err);
        }
      }

      let userApiUrl = `http://192.168.10.110:8080/delete_preset/${presetId}`;
      try {
        if (removedFromGateway)
          await fetch(userApiUrl, { method: "DELETE" })
            .then(() => {
              task.commit("CLEAR_PRESETS");
            })
            .then(() => this.dispatch("getPresets"));
      } catch (err) {
        console.log(err);
      }
    }
  },

  getters: {
    gatewayFound: state => {
      return state.gateway === false ? false : true;
    },
    gatewayIP: state => {
      return state.gateway === false
        ? "0.0.0.0"
        : state.gateway["0"].internalipaddress;
    },
    gatewayPort: state => {
      return state.gateway["0"].internalport;
    },
    gatewayAdress: state => {
      return state.gateway === false
        ? ""
        : `${state.gateway["0"].internalipaddress}:${state.gateway["0"].internalport}`;
    },
    gatewayName: state => {
      return state.gateway["0"].name;
    },
    lightStates: state => {
      return state.lights;
    },
    groups: state => {
      return state.groups;
    },
    lights: state => {
      return state.lights;
    },

    presets: state => {
      return state.presets;
    },

    groupLights: state => {
      let groupLights = {};
      let index = Object.keys(state.groups);
      for (index in state.groups) {
        groupLights[index] = state.groups[index].lights;
      }
      return groupLights;
    }
  },
  modules: {}
});
//A2D4D78CA0
