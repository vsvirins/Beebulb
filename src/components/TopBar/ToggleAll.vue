<template>
  <q-toggle
    icon="power_settings_new"
    color="positive"
    keep-color
    v-model="toggleState"
    v-if="gatewayFound"
    @click="toggleAllLights({ state: toggleState })"
  />
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "ToggleAll",

  data() {
    return {
      toggleState: true
    };
  },

  computed: {
    ...mapGetters(["groups", "gatewayFound"])
  },

  methods: {
    ...mapActions(["toggleAllLights"]),

    checkLightsStatus() {
      const lightsStates = this.groups.filter(state => state.on);
      lightsStates.length > 0
        ? (this.toggleState = true)
        : (this.toggleState = false);
    }
  },

  mounted() {
    this.checkLightsStatus();
  }
};
</script>
