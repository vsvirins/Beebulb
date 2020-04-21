<template>
<body :class="{ 'light-mode': !darkMode }">
  <login v-if="!authed" />
  <q-layout view="hHh Lpr lff" v-if="authed">
    <q-header class="top-bar">
      <q-toolbar>
        <q-btn
          dense
          round
          flat
          class="config-btn"
          @click="drawerOpen = !drawerOpen"
          aria-label="Menu"
          icon="img:https://image.flaticon.com/icons/svg/175/175098.svg"
        />

        <q-toolbar-title class="top-bar-title non-selectable">{{ topBarTitle }}</q-toolbar-title>
        <q-space />
        <q-toggle
          icon="power_settings_new"
          v-model="toggleAll"
          color="positive"
          v-if="gatewayFound"
        />
        <toggle-all />
      </q-toolbar>
    </q-header>
    <config
      :drawer-open="drawerOpen"
      @view-mode="darkMode = $event"
      @drawer-close="drawerOpen = $event"
    />

    <q-page-container @click="drawerOpen = false" class="flex-center">
      <div class="group-wrapper" v-if="gatewayFound">
        <light-group
          v-for="group in groups"
          :key="group.name"
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
import Config from "./components/Configs/Config.vue";
import LightGroup from "./components/Lights/LightGroup.vue";
import PresetButton from "./components/PresetButton/PresetButton.vue";
import toggleAll from "./components/TopBar/ToggleAll.vue";
import Login from "./components/Login/Login.vue";

export default {
  name: "LayoutDefault",

  components: {
    "light-group": LightGroup,
    config: Config,
    "preset-button": PresetButton,
    "toggle-all": toggleAll,
    login: Login
  },

  data() {
    return {
      drawerOpen: false,
      toggleAll: true,
      darkMode: true
    };
  },

  computed: {
    ...mapGetters([
      "gatewayFound",
      "gatewayName",
      "groups",
      "lights",
      "authed"
    ]),

    topBarTitle: {
      get() {
        return this.gatewayFound ? this.gatewayName : "Beebulb";
      },
      set(topBarTitle) {
        return topBarTitle;
      }
    }
  },
  watch: {
    toggleAll() {
      this.$store.dispatch("toggleAllLights", { state: this.toggleAll });
    }
  }
};
</script>

<style lang="scss">
@import "./styles/swatch";
@import url("https://fonts.googleapis.com/css?family=Source+Code+Pro:700&display=swap");

html {
  min-height: 100%;
  ::-webkit-scrollbar {
    display: none;
  }

  body {
    font-family: "Source Code Pro";
    background-color: #222;
    background-size: 150%;
    //background-image: $bee-bg-dark;
    backface-visibility: hidden;

    .top-bar {
      background: $primary-dark;
      .top-bar-title {
        overflow: visible;
      }
      .config-btn {
        background: $accent;
      }
    }
    .group-wrapper {
      display: flex;
      flex-direction: column;
      animation: fade 1s;
      @keyframes fade {
        0% {
          opacity: 0;
        }
        50% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
    }
    .no-gateway {
      animation: fade 2s;
      display: flex;
      min-height: 100%;
      width: 100%;
      align-content: center;
      justify-content: center;
      pointer-events: none;

      @keyframes fade {
        0% {
          opacity: 0;
        }
        50% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
    }
  }

  .light-mode {
    html {
      --q-color-dark: white;
      body {
        background-image: $bee-bg-light;
      }
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
      background: rgb(255, 255, 255);
    }

    .q-circular-progress__track {
      color: whitesmoke !important;
      background: whitesmoke !important;
    }
    .text-dark {
      color: $primary-light !important;
    }

    .light-name {
      h6 {
        color: $secondary-dark !important;
      }
    }

    .config-drawer {
      background: rgb(235, 235, 235);
      color: $primary-dark;
    }
  }
}
</style>
