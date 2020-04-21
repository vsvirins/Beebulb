<template>
  <div class="btn-wrapper">
    <q-btn
      flat
      :icon="hexagon"
      class="btn"
      size="125%"
      round
      :color="stateColor"
      @click="toggle"
      v-model="lightState"
      style="weight: 900; color: green"
      :disable="!reachable"
    />
    <div class="light-name">
      <h6>{{ lightName }}</h6>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { mdiHexagonOutline } from "@mdi/js";

export default {
  name: "LightSwitch",
  props: ["btn-id", "is-on", "reachable"],
  data() {
    return {
      id: this.btnId,
      lightState: "",
      stateColor: "",
      hexagon: mdiHexagonOutline
    };
  },
  watch: {
    isOn() {
      !this.reachable
        ? (this.stateColor = "dark")
        : this.isOn
        ? (this.stateColor = "positive")
        : (this.stateColor = "dark");
    }
  },
  computed: {
    lightName() {
      return this.$store.state.lights[this.id].name;
    }
  },
  methods: {
    ...mapActions(["lightOnOff", "getLightState"]),
    async toggle() {
      const state = await this.getLightState({ id: this.id });
      this.lightOnOff({ state, id: this.id });
      this.switchColor(state);
      if (!state) this.$emit("lightsOn", 200);
    },

    switchColor(state) {
      if (!state) this.stateColor = "positive";
      else
        (this.stateColor = "dark"),
          this.$emit("lightsOff"),
          (this.lightState = !state);
    },

    async checkLight() {
      this.lightState = await this.getLightState({ id: this.id });
      !this.reachable
        ? (this.stateColor = "dark")
        : this.lightState
        ? (this.stateColor = "positive")
        : (this.stateColor = "dark");
    },
    lightStatus() {
      if (this.isOn) return (this.stateColor = "positive");
      else return (this.stateColor = "dark");
    }
  },
  mounted() {
    this.checkLight();
  }
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Source+Code+Pro&display=swap");
.btn-wrapper {
  left: -50%;
  transform: translate(31.3%, -182%);
  pointer-events: none;
  .light-name {
    position: absolute;
    text-align: center;
    pointer-events: none;
    width: 100%;
    left: -31%;
    top: 110%;
    h6 {
      font-family: "Source Code Pro";
      font-size: 80%;
      color: rgba(243, 243, 243, 0.61);
      pointer-events: none;
      user-select: none;
    }
  }
  .btn {
    pointer-events: auto;
  }
}
</style>
