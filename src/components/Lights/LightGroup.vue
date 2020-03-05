<template>
  <q-card class="light-group" :style="{ order: id }">
    <q-card-section class="light-group-header" horizontal @click="show = !show">
      <div
        class="text-h5 non-selectable q-mx-md q-my-sm"
        style="font-family: 'Source Code Pro'; font-size: 1.2rem; font-weight: 500"
      >
        {{ name }}
      </div>
      <q-icon
        class="minimize-icon"
        size="150%"
        :name="minimizeIcon"
        :class="!show ? 'rotate-minimize-icon' : 'rotate-back'"
      />
    </q-card-section>
    <transition name="show">
      <q-card-actions class="knobs" v-if="show">
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
import Knob from "./Knob.vue";
import { mdiChevronUp } from "@mdi/js";

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
      show: true,
      minimizeIcon: mdiChevronUp
    };
  },

  methods: {}
};
</script>

<style lang="scss" scoped>
@import "../../styles/swatch";
@import url("https://fonts.googleapis.com/css?family=Source+Code+Pro:900&display=swap");

.light-group {
  ::-webkit-scrollbar {
    display: none;
  }
  order: 0;
  box-shadow: none;
  border-radius: 0px;
  //border: 1px solid rgb(37, 37, 37);

  .light-group-header {
    background: rgb(46, 46, 46);
    color: rgb(196, 196, 196);

    .minimize-icon {
      position: absolute;
      right: 1%;
      top: 25%;
    }
    .rotate-minimize-icon {
      animation: rotate 0.2s;
      transform: rotate(180deg);
    }
    .rotate-back {
      transform: rotate(0deg);
      animation: rotate-back 0.2s;
    }

    @keyframes rotate {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(180deg);
      }
    }

    @keyframes rotate-back {
      0% {
        transform: rotate(-180deg);
      }
      100% {
        transform: rotate(0deg);
      }
    }
  }

  .knobs {
    background: rgb(59, 59, 59);
    color: rgb(235, 235, 235);
    padding: 0;
    padding-top: 2em;
    justify-content: flex-start;
    overflow-y: hidden;
    flex-wrap: nowrap;
    height: 12em;
  }

  .show-enter-active {
    animation: slide 0.2s ease-in-out;
  }
  .show-leave-active {
    animation: slide 0.2s reverse ease-in-out;
  }

  @keyframes slide {
    0% {
      padding: 0;
      overflow: hidden;
      max-height: 0vh;
    }
    100% {
      overflow: hidden;
      max-height: 23vh;
    }
  }
}
</style>
