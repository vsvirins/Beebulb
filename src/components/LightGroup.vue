<template>
  <q-card class="light-group" :style="{top: position + 'px' , order: id}">
    <q-card-section class="light-group-header" horizontal @click="show = !show">
      <div class="text-h5 non-selectable q-ma-sm" style="font-family: 'Lobster'">{{ name }}</div>
      <q-btn
        flat
        class="absolute-center"
        size="80%"
        icon="drag_handle"
        v-touch-pan.vertical.prevent.mouse="setPosition"
      />
    </q-card-section>
    <transition name="show">
      <q-card-actions class="knobs" align="around" v-if="show">
        <knob v-for="light in lights" :key="light" :light="light" />
      </q-card-actions>
    </transition>
  </q-card>
</template>

<script>
import Knob from "./Knob.vue";

//:style="{top: position + 'px'}"

export default {
  name: "LightGroup",

  components: {
    knob: Knob
  },

  props: ["group-lights", "group-name", "group-id"],

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
@import "../styles/swatch";
@import url("https://fonts.googleapis.com/css?family=Lobster&display=swap");
.light-group {
  position: relative;
  order: 0;
  box-shadow: none;
  border-radius: 0px;
  border: 1px solid rgb(117, 116, 116);

  .light-group-header {
    background: rgb(112, 112, 112);
    color: rgb(235, 235, 235);
    //bg-grey-8 text-grey-4
  }

  .knobs {
    background: #444;
    color: rgb(235, 235, 235);
    align-self: stretch;
    padding: 0;
    justify-content: flex-start;
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