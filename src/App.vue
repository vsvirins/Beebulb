<template>
<body :class="{'light-mode': !darkMode}">
  <q-layout view="hHh Lpr lff">
    <q-header class="top-bar">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="drawerOpen = !drawerOpen"
          aria-label="Menu"
          icon="settings"
        />
        <q-toolbar-title class="non-selectable">{{ topBarTitle }}</q-toolbar-title>
        <q-space />
        <q-toggle
          icon="power_settings_new"
          v-model="toggleAll"
          color="positive"
          v-if="gatewayFound"
        />
      </q-toolbar>
    </q-header>
    <config :drawer-open="drawerOpen" @view-mode="darkMode = $event" />

    <q-page-container @click="drawerOpen = false" class="flex-center">
      <div class="group-wrapper" v-if="gatewayFound">
        <light-group
          v-for="group in groups"
          :key="group.id"
          :group-lights="group.lights"
          :group-name="group.name"
          :group-id="group.id"
        />
      </div>
      <div class="no-gateway" v-else>
        <q-btn
          outline
          icon="error_outline"
          label="Gateway not found :("
          text-color="white"
          class="q-my-lg"
        />
      </div>
      <preset-button v-if="gatewayFound" />
    </q-page-container>
  </q-layout>
</body>
</template>

<script>
import { mapGetters } from "vuex";
import Config from "./components/Config.vue";
import LightGroup from "./components/LightGroup.vue";
import PresetButton from "./components/PresetButton.vue";

export default {
  name: "LayoutDefault",

  components: {
    "light-group": LightGroup,
    config: Config,
    "preset-button": PresetButton
  },

  data() {
    return {
      drawerOpen: false,
      toggleAll: true,
      darkMode: true,
      topBarTitle: ""
    };
  },

  computed: {
    ...mapGetters(["gatewayFound", "gatewayName", "groups"])
  },
  watch: {
    gatewayFound() {
      !this.gatewayFound
        ? (this.topBarTitle = "JamGlow")
        : (this.topBarTitle = this.gatewayName);
    }
  }
};
</script>

<style lang="scss">
@import "./styles/swatch";

html {
  min-height: 100%;

  body {
    background-image: $sunset;
    backface-visibility: hidden;
    background-size: 400% 400%;
    //animation: gradient 15s ease infinite;
    @keyframes gradient {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }

    .top-bar {
      background: $primary-dark;
    }
    .group-wrapper {
      display: flex;
      flex-direction: column;
    }
    .no-gateway {
      display: flex;
      min-height: 100%;
      width: 100%;
      align-content: center;
      justify-content: center;
      pointer-events: none;
    }
  }

  .light-mode {
    html {
      --q-color-dark: white;
    }
    .top-bar {
      background: $secondary-light;
      color: $primary-dark;
    }
    .light-group .light-group-header {
      background: $primary-light;
      color: $secondary-dark;
    }
    .light-group .knobs {
      background: whitesmoke;
    }

    .q-circular-progress__track {
      color: white !important;
      background: white !important;
    }
    .text-dark {
      color: $primary-light !important;
    }

    .light-name {
      h6 {
        color: $primary-dark !important;
      }
    }

    .drawer {
      background: rgb(235, 235, 235);
      color: $primary-dark;
    }

    // filter: hue-rotate(180deg) invert(1);
    // .group-wrapper {
    //   background: #999;
    //   .knobs {
    //     filter: invert(1) hue-rotate(180deg);
    //   }
    // }
  }
}
</style>