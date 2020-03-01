<template>
  <div class="knob-wrapper">
    <q-knob
      v-model="dimValue"
      @input="dimLight"
      :min="0"
      :max="255"
      size="100px"
      :thickness="thickness"
      :color="trackColor"
      track-color="grey-10"
      class="knob q-ma-sm"
      :step="5"
    />

    <light-switch
      :btn-id="id"
      :is-on="isOn"
      @lightsOff="turnOff"
      @lightsOn="turnOn"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import LightSwitch from './LightSwitch.vue';
export default {
  name: 'Knob',
  props: ['light'],
  components: {
    'light-switch': LightSwitch
  },
  computed: {
    ...mapGetters(['lightStates']),
    trackColor() {
      if (this.dimValue < 25) return 'amber-9';
      if (this.dimValue < 50) return 'amber-8';
      if (this.dimValue < 75) return 'amber-7';
      if (this.dimValue < 100) return 'amber-6';
      if (this.dimValue < 125) return 'amber-5';
      if (this.dimValue < 150) return 'amber-4';
      if (this.dimValue < 175) return 'amber-3';
      if (this.dimValue < 200) return 'amber-2';
      if (this.dimValue <= 225) return 'amber-1';
      if (this.dimValue > 225) return 'yellow-1';
      else return 'amber 10';
    }
  },
  data() {
    return {
      id: this.light,
      dimValue: 0,
      oldValue: 0,
      isOn: undefined,
      thickness: 0.3
    };
  },
  methods: {
    ...mapActions(['setDim', 'getLights']),
    dimLight(input) {
      const id = this.id;
      if (input != this.oldValue) {
        this.isOn = true;
        this.oldValue = input;
        this.setDim({ input, id });
      }
    },
    async setBrightness(callback) {
      await callback();
      const lightList = this.lightStates;
      const brightness = lightList[this.id].state.bri;
      const state = lightList[this.id].state.on;

      brightness < 5 ? (this.dimValue = 0) : (this.dimValue = brightness);
      this.isOn = state;
    },
    turnOff() {
      this.dimValue = 0;
      this.isOn = false;
    },
    turnOn() {
      this.dimValue = 200;
      this.isOn = true;
    }
  },
  mounted() {
    this.setBrightness(this.getLights);
    this.$store.subscribeAction({
      before: action => {
        if (action.type === 'toggleAllLights') {
          action.payload.state
            ? ((this.dimValue = 200), (this.isOn = true))
            : ((this.dimValue = 0), (this.isOn = false));
        }
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.knob {
  margin: 0.2em;
}
</style>
