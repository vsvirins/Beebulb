<template>
  <q-card class="light-group" :style="{ top: position + 'px', order: id }">
    <q-card-section class="light-group-header" horizontal @click="show = !show">
      <div
        class="text-h5 non-selectable q-mx-md q-my-sm"
        style="font-family: 'Source Code Pro'; font-size: 1.4rem; font-weight: 700"
      >
        {{ name }}
      </div>
      <q-btn
        flat
        class="absolute-right"
        size="80%"
        icon="drag_handle"
        v-touch-pan.vertical.prevent.mouse="setPosition"
      />
    </q-card-section>
    <transition name="show">
      <q-card-actions class="knobs" align="around" v-if="show">
        <knob
          v-for="light in lights"
          :key="light"
          :light="light"
          :show="show"
        />
      </q-card-actions>
    </transition>
  </q-card>
</template>

<script>
import Knob from './Knob.vue';

//:style="{top: position + 'px'}"

export default {
  name: 'LightGroup',

  components: {
    knob: Knob
  },

  props: ['group-lights', 'group-name', 'group-id'],

  data() {
    return {
      lights: this.groupLights,
      name: this.groupName,
      id: this.groupId,
      position: 0,
      show: true
    };
  },

  methods: {
    setPosition(e) {
      // const valueLimit = (val, min, max) => {
      //   return val < min ? min : val > max ? max : val;
      // };
      const selected = this.$el;
      this.position = e.offset.y;
      if (e.offset.y > 20) {
        selected.style.order;
        selected.style.top = 0;
      }
      if (e.offset.y < 100) {
        selected.style.order--;
        selected.style.top = 0;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/swatch';
@import url('https://fonts.googleapis.com/css?family=Source+Code+Pro:900&display=swap');

.light-group {
  position: relative;
  order: 0;
  box-shadow: none;
  border-radius: 0px;
  border: 1px solid rgb(37, 37, 37);

  .light-group-header {
    background: rgb(46, 46, 46);
    color: rgb(196, 196, 196);
  }

  .knobs {
    background: rgb(59, 59, 59);
    color: rgb(235, 235, 235);
    align-self: stretch;
    padding: 0;
    justify-content: space-evenly;
    overflow-x: scroll;
    overflow-y: hidden;
    flex-wrap: nowrap;
    //bg-grey-9 text-white
  }

  .show-enter-active {
    animation: slide 0.2s;
  }
  .show-leave-active {
    animation: slide 0.2s reverse;
  }

  @keyframes slide {
    0% {
      max-height: 0vh;
    }
    100% {
      max-height: 20vh;
    }
  }
}
</style>
