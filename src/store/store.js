import Vue from "vue";
import Vuex from "vuex";
// TODO: Refactor store into separate modules
//import actions from './modules/actions'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authed: false,
    key: "",
    user: "",
    gateway: { 0: { name: "" } },
    groups: [],
    lights: [],
    unasignedDevices: [],
    presets: [],
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
      let configTool = Object.keys(lights).filter(
        (light) => lights[light].type === "Configuration tool"
      );
      if (configTool.length) {
        delete lights[configTool[0]];
      }
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
    },
    AUTH(state, authed) {
      state.authed = authed;
    },
    NEW_DEVICE(state, device) {
      state.unasignedDevices.push(device);
    },
  },
  actions: {
    async discoverGateway(task) {
      const url = "https://dresden-light.appspot.com/discover";
      try {
        const response = await fetch(url);
        const data = await response.json();
        response.status === 200 && Array.isArray(data) && data.length
          ? task.commit("SET_GATEWAY", data)
          : task.commit("SET_GATEWAY", false);
      } catch (err) {
        console.error(err);
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
        console.error(err);
      }
    },

    async getLights(task) {
      const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/lights`;
      try {
        if (this.getters.gatewayFound) {
          const respone = await fetch(url);
          const data = await respone.json();
          task.commit("SET_LIGHTS", data);
        }
      } catch (err) {
        console.error(err);
      }
    },

    async getLightState(task, { id }) {
      const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/lights/${id}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        return data.state.on;
      } catch (err) {
        console.error(err);
      }
    },

    async lightOnOff(task, { state, id }) {
      const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/lights/${id}/state`;
      const params = `{"on": ${!state}, "bri": 200, "ct": 300}`;
      try {
        await fetch(url, { method: "PUT", body: params });
      } catch (err) {
        console.error(err);
      }
    },

    async setDim(task, { input, id }) {
      const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/lights/${id}/state`;
      const params = `{"on": true, "bri": ${input}, "ct": ${500 - input}}`;
      try {
        await fetch(url, { method: "PUT", body: params });
      } catch (err) {
        console.error(err);
      }
    },

    async toggleAllLights(task, { state }) {
      const on = `{"on": true, "bri": 200, "ct": 300}`;
      const off = '{ "on": false, "bri": 0 }';
      const groups = Object.keys(this.getters.groups);

      const checkIfSuccess = () => {
        Object.keys(this.state.lights).forEach((light) => {
          if (
            this.state.lights[light].state.on != state &&
            typeof this.state.lights[light].state.on !== "undefined"
          ) {
            this.dispatch("lightOnOff", { id: light, state: !state });
          }
        });
      };
      for (let group in groups) {
        try {
          const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/groups/${groups[group]}/action`;
          (await state)
            ? fetch(url, { method: "PUT", body: on })
            : fetch(url, {
                method: "PUT",
                body: off,
              });
          await this.dispatch("getLights").then(
            setTimeout(checkIfSuccess(), 100)
          );
        } catch (err) {
          console.error(err);
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
        console.error(err);
      }
    },

    async addNewGroup(task, { name }) {
      const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/groups`;
      const params = `{"name": "${name}"}`;
      try {
        await fetch(url, { method: "POST", body: params });
        await this.dispatch("getGroups");
      } catch (err) {
        console.error(err);
      }
    },

    async removeGroup(task, { id }) {
      const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/groups/${id}`;
      try {
        await fetch(url, { method: "DELETE" });
        await this.dispatch("getGroups");
      } catch (err) {
        console.error(err);
      }
    },
    async changeGroupNames(task, { groupNames }) {
      try {
        Object.keys(groupNames)
          .forEach(async (group) => {
            if (/\S/.test(groupNames[group])) {
              const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/groups/${group}`;
              const params = `{"name": "${groupNames[group]}"}`;
              await fetch(url, { method: "PUT", body: params });
            }
          })
          .then(() => this.dispatch("getGroups"));
      } catch (err) {
        console.error(err);
      }
    },

    async setNewLightOrder(task, { order }) {
      try {
        this.dispatch("removeAllLights");
        for (let group in order) {
          const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/groups/${group}`;
          let lights = `["${Object.values(order[group]).join('","')}"]`;
          const params = `{"lights":${lights}}`;
          await fetch(url, { method: "PUT", body: params });
        }
        await this.dispatch("getGroups");
      } catch (err) {
        console.error(err);
      }
    },

    async removeLight(task, { light }) {
      const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/lights/${light}/groups`;
      // check if group has any lights
      try {
        await fetch(url, { method: "DELETE" });
      } catch (err) {
        console.error(err);
      }
    },

    removeAllLights() {
      Object.keys(this.state.lights).forEach(async (light) => {
        const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/lights/${light}/groups`;
        await fetch(url, { method: "DELETE" });
      });
    },

    async addNewLight(task, { light, group, name }) {
      //Remove light from all groups, Get lights in group, append new light, update group lights
      const delay = (v, t) => {
        new Promise(function(resolve) {
          setTimeout(resolve.bind(null, v), t);
        });
      };

      let lights = [];

      if (this.state.groups[group].lights.length) {
        lights = JSON.parse(JSON.stringify(this.state.groups[group].lights));
      }

      lights = [...lights, light];
      lights = lights.map((light) => `"${light}"`);

      try {
        //this.dispatch("removeLight", { light });
        const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/groups/${group}`;
        const params = `{"lights":[${lights}]}`;
        await this.dispatch("removeLight", { light });
        await fetch(url, { method: "PUT", body: params })
          .then(() => delay(250))
          .then(() => {
            if (name != "") this.dispatch("changeLightName", { light, name });
          })
          .then(() => delay(250))
          .then(() => this.dispatch("getGroups"))
          .then(() => delay(250))
          .then(() => this.dispatch("getLights"));
      } catch (err) {
        console.error(err);
      }
    },

    async changeLightName(task, { light, name }) {
      const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/lights/${light}`;
      const params = `{"name":"${name}"}`;

      try {
        await fetch(url, { method: "PUT", body: params });
      } catch (err) {
        console.error(err);
      }
    },

    async registerNewUser(task, { username, password }) {
      const url = "http://127.0.0.1:5000/register";
      const params = JSON.stringify({ username: username, password: password });

      try {
        const response = await fetch(url, {
          method: "POST",
          body: params,
          headers: {
            "Content-Type": "application/json",
          },
        });
        const recieved = await response.json();
        return recieved.msg;
      } catch (err) {
        console.error(err);
      }
    },

    async generateNewKey(task, { username }) {
      const url = "http://127.0.0.1:5000/generate_key";
      const params = JSON.stringify({
        username: username,
        address: this.getters.gatewayAdress,
      });

      try {
        const response = await fetch(url, {
          method: "POST",
          body: params,
          headers: {
            "Content-Type": "application/json",
          },
        });
        const key = await response.json();
        return key.msg === "Gateway is locked"
          ? false
          : (task.commit("SET_KEY", key.msg), true);
      } catch (err) {
        console.error(err);
      }
    },

    async loginUser(task, { username, password }) {
      const url = "http://127.0.0.1:5000/login";
      const params = JSON.stringify({ username: username, password: password });

      try {
        const response = await fetch(url, {
          method: "POST",
          body: params,
          headers: {
            "Content-Type": "application/json",
          },
        });
        const recieved = await response.json();
        return recieved.msg === true
          ? (task.commit("SET_KEY", recieved.key),
            task.commit("SET_USER", username),
            this.dispatch("discoverGateway")
              .then(() => this.dispatch("getLights"))
              .then(() => this.dispatch("getGroups"))
              .then(() => this.dispatch("getPresets"))
              .catch((err) => console.error(err)),
            recieved.msg)
          : recieved.msg;
      } catch (err) {
        console.error(err);
      }
    },

    async autoLogin() {
      const url = "http://127.0.0.1:5000/auto_login";
      let response = await fetch(url, { method: "GET" });
      return response.json();
    },

    async createNewPreset(task, { preset }) {
      let groupPreset = {};
      let newPreset = {};
      let id = 0;

      if (Object.keys(this.state.lights).length !== 0) {
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
              color: preset.color,
            };
            newPreset = { ...newPreset, [group]: groupPreset };
          } catch (err) {
            console.error(err);
          }
        }
        this.dispatch("storePreset", {
          id: id,
          preset: newPreset,
        }),
          task.commit("SET_PRESET", newPreset);
      }
    },

    async storePreset(task, { id, preset }) {
      const url = "http://127.0.0.1:5000/store_preset";
      const base64Preset = btoa(JSON.stringify(preset));
      const params = JSON.stringify({
        id: id,
        preset: base64Preset,
        username: this.state.user,
      });

      try {
        await fetch(url, {
          method: "POST",
          body: params,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (err) {
        console.error(err);
      }
    },

    async getPresets(task) {
      const url = "http://127.0.0.1:5000/get_presets";
      const params = JSON.stringify({
        username: this.state.user,
      });

      try {
        const response = await fetch(url, {
          method: "POST",
          body: params,
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        Object.keys(data).forEach((preset) => {
          let decodedPreset = JSON.parse(atob(data[preset]));
          if (Object.keys(decodedPreset).length !== 0) {
            task.commit("SET_PRESET", decodedPreset);
          }
          decodedPreset = {};
        });
      } catch (err) {
        console.error(err);
      }
    },

    async recallPreset(task, { groupid, id }) {
      const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/groups/${groupid}/scenes/${id}/recall`;

      try {
        await fetch(url, { method: "PUT" });
      } catch (err) {
        console.error(err);
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
          console.error(err);
        }
      }

      let userApiUrl = `http://127.0.0.1:5000/delete_preset/${presetId}`;
      try {
        if (removedFromGateway)
          await fetch(userApiUrl, { method: "DELETE" })
            .then(() => {
              task.commit("CLEAR_PRESETS");
            })
            .then(() => this.dispatch("getPresets"));
      } catch (err) {
        console.error(err);
      }
    },

    connectToWebSocket() {
      // For future sensor control
      const host = this.getters.gatewayIP;
      const port = 443; // shouldn't be hardcoded

      const ws = new WebSocket("ws://" + host + ":" + port);

      ws.onmessage = (msg) => console.log(JSON.parse(msg.data));
    },

    async scanForNewLights() {
      const url = ` http://${this.getters.gatewayAdress}/api/${this.state.key}/config`;
      const params = '{ "permitjoin": 60 }';

      try {
        await fetch(url, { method: "PUT", body: params });
      } catch (err) {
        console.error(err);
      }
    },

    async identifyLight(task, { light }) {
      const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/lights/${light}/state`;
      const params = '{ "alert":"select" }';
      try {
        await fetch(url, { method: "PUT", body: params });
      } catch (err) {
        console.error(err);
      }
    },

    async scanForNewDevices(task) {
      // Touchlink scan
      const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/touchlink/scan`;

      let scanResponse = await fetch(url, { method: "POST" });

      if (scanResponse.ok) {
        let scanning = true;

        const newScan = async () => {
          if (scanning) {
            let fetchResponse = await fetch(url, { method: "GET" });
            if (fetchResponse.ok) {
              let scan = await fetchResponse.json();
              if (scan.scanstate === "idle") {
                scanning = false;
              }
              if (Object.keys(scan.result).length !== 0) {
                // Rewrite so it saves the result in tmp, checks if tmp === results. if not, update tmp. compare with lights and lights in groups.
                Object.keys(scan.result).forEach((light) => {
                  if (
                    scan.result[light].factorynew &&
                    this.state.unasignedDevices.filter((id) => id === light)
                      .length === 0
                  ) {
                    //console.log("new device found!");
                    //console.log(light);
                    task.commit("NEW_DEVICE", light);
                  }
                });
              }
            }
            setTimeout(newScan, 1000);
          }
        };
        newScan();
      }
    },
  },

  getters: {
    gatewayFound: (state) => {
      return state.gateway[0].name === "" ? false : true;
    },
    gatewayIP: (state) => {
      return state.gateway === false
        ? "0.0.0.0"
        : state.gateway["0"].internalipaddress;
    },
    gatewayPort: (state) => {
      return state.gateway["0"].internalport;
    },
    gatewayAdress: (state) => {
      return state.gateway === false
        ? ""
        : `${state.gateway["0"].internalipaddress}:${state.gateway["0"].internalport}`;
    },
    gatewayName: (state) => {
      return state.gateway["0"].name;
    },
    groups: (state) => {
      return state.groups;
    },
    lights: (state) => {
      return state.lights;
    },
    unasignedDevices: (state) => {
      return state.unasignedDevices;
    },

    presets: (state) => {
      return state.presets;
    },

    authed: (state) => {
      return state.authed;
    },

    groupLights: (state) => {
      let groupLights = {};
      let index = Object.keys(state.groups);
      for (index in state.groups) {
        groupLights[index] = state.groups[index].lights;
      }
      return groupLights;
    },
  },
  modules: {},
});
