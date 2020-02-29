<template>
  <div class="btn-wrapper">
    <q-btn
      flat
      icon="power_settings_new"
      class="btn"
      size="80%"
      round
      :color="stateColor"
      @click="toggle"
      v-model="lightState"
    />
    <div class="light-name">
      <h6>{{ lightName }}</h6>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "LightSwitch",

  props: ["btn-id", "is-on"],

  data() {
    return {
      id: this.btnId,
      lightState: "",
      stateColor: ""
    };
  },
  watch: {
    isOn() {
      if (this.isOn) this.stateColor = "positive";
      else this.stateColor = "dark";
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

      if (this.lightState) this.stateColor = "positive";
      else this.stateColor = "dark";
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
@import url("https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap");
.btn-wrapper {
  left: -50%;
  transform: translate(34%, -215%);
  pointer-events: none;

  .light-name {
    position: absolute;
    text-align: center;
    pointer-events: none;
    width: 100%;
    left: -34%;
    top: 130%;

    h6 {
      font-family: "Roboto Mono";
      font-size: 70%;
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