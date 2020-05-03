<template>
  <q-toggle
    icon="power_settings_new"
    color="positive"
    keep-color
    v-model="toggleState"
    v-if="gatewayFound"
    @input="toggleAllLights({state: toggleState})"
  />
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "ToggleAll",

  data() {
    return {
      toggleState: this.lightStates
    };
  },

  computed: {
    ...mapGetters(["groups", "gatewayFound"]),
    lightStates() {
      let states = [];

      Object.keys(this.groups).forEach(group => {
        if (this.groups[group].lights.length) {
          states.push(this.groups[group].state.any_on);
        }
      });
      let anyOn = states.filter(on => on).length ? true : false;
      return anyOn;
    }
  },

  methods: {
    ...mapActions(["toggleAllLights"])
  },

  mounted() {
    this.$store.subscribeAction({
      after: action => {
        if (action.type === "getGroups") {
          //let state = this.lightStates;
          this.toggleState = this.lightStates;
        }
      }
    });
  }
};
</script>
