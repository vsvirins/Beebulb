import Vue from 'vue';
import Vuex from 'vuex';
//import actions from './modules/actions'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    gateway: { 0: { name: '' } },
    key: 'A2D4D78CA0',
    groups: [],
    lights: []
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
    }
  },
  actions: {
    async discoverGateway(task) {
      // https://dresden-light.appspot.com/discover
      const url = 'https://dresden-light.appspot.com/discover';
      try {
        const response = await fetch(url);
        const data = await response.json();
        Array.isArray(data) && data.length
          ? task.commit('SET_GATEWAY', data)
          : task.commit('SET_GATEWAY', false);
      } catch (err) {
        console.log(err);
        task.commit('SET_GATEWAY', false);
      }
    },

    async acquireKey(task) {
      const url = `http://$${this.getters.gatewayAdress}/api`;
      const params = '{"devicetype": "PWA"}';
      try {
        const response = await fetch(url, { method: 'POST', body: params });
        const data = await response.json();
        return task.commit('SET_KEY', data);
      } catch (err) {
        console.log(err);
      }
    },
    async getGroups(task) {
      const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/groups`;
      try {
        if (this.getters.gatewayFound) {
          const response = await fetch(url);
          const data = await response.json();
          task.commit('SET_GROUPS', data);
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
          return task.commit('SET_LIGHTS', data);
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
        await fetch(url, { method: 'PUT', body: params });
      } catch (err) {
        console.log(err);
      }
    },

    async setDim(task, { input, id }) {
      const url = `http://${this.getters.gatewayAdress}/api/${this.state.key}/lights/${id}/state`;
      const params = `{"on": true, "bri": ${input}, "ct": ${500 - input}}`;
      try {
        await fetch(url, { method: 'PUT', body: params });
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
            ? fetch(url, { method: 'PUT', body: params })
            : fetch(url, {
                method: 'PUT',
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
        await fetch(url, { method: 'PUT', body: params });
        this.dispatch('discoverGateway');
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
        ? '0.0.0.0'
        : state.gateway['0'].internalipaddress;
    },
    gatewayPort: state => {
      return state.gateway['0'].internalport;
    },
    gatewayAdress: state => {
      return state.gateway === false
        ? ''
        : `${state.gateway['0'].internalipaddress}:${state.gateway['0'].internalport}`;
    },
    gatewayName: state => {
      return state.gateway['0'].name;
    },
    lightStates: state => {
      return state.lights;
    },
    groups: state => {
      return state.groups;
    }
  },
  modules: {}
});
//A2D4D78CA0
