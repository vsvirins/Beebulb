<template>
  <q-drawer v-model="drawerState" content-class="config-drawer" dark :width="200">
    <q-list>
      <q-item>
        <q-toggle
          class="absolute-top q-ma-sm"
          :icon="icons['dark']"
          color="grey-8"
          v-model="darkMode"
        />
      </q-item>
      <q-space />
      <q-item
        clickable
        tag="a"
        target="_blank"
        href="https://chat.quasar.dev"
        :class="{ 'no-gateway': !gatewayFound }"
      >
        <q-item-section avatar>
          <q-icon :name="icons['light']" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Lights</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable @click="editGroups = true" :class="{ 'no-gateway': !gatewayFound }">
        <q-item-section avatar>
          <q-icon :name="icons['lightgroup']" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Groups</q-item-label>
          <groups-config :edit-groups="editGroups" @closeGroupsEdit="closeGroupsEdit" />
        </q-item-section>
      </q-item>

      <q-item
        clickable
        tag="a"
        target="_blank"
        href="https://forum.quasar.dev"
        :class="{ 'no-gateway': !gatewayFound }"
      >
        <q-item-section avatar>
          <q-icon :name="icons['presets']" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Presets</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable @click="editGateway = true" :class="{ 'no-gateway': !gatewayFound }">
        <q-item-section avatar>
          <q-icon :name="icons['gateway']" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Gateway</q-item-label>
          <gateway-config
            v-if="gatewayFound"
            :edit-gateway="editGateway"
            @closeGatewayEdit="closeGatewayEdit"
          />
        </q-item-section>
      </q-item>

      <q-item clickable tag="a" target="_blank" href="https://github.com/vsvirins/Beebulb">
        <q-item-section avatar>
          <q-icon :name="icons['github']" />
        </q-item-section>
        <q-item-section>
          <q-item-label>About</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script>
import GroupsConfig from "./GroupsConfig.vue";
import GatewayConfig from "./GatewayConfig.vue";
import {
  mdiGithubCircle,
  mdiLightbulbOutline,
  mdiLightbulbGroupOutline,
  mdiAccessPoint,
  mdiPowerSleep,
  mdiPaletteOutline
} from "@mdi/js";
import { mapGetters } from "vuex";

export default {
  name: "Config",

  props: ["drawer-open"],

  components: {
    "groups-config": GroupsConfig,
    "gateway-config": GatewayConfig
  },

  watch: {
    drawerOpen() {
      if (this.drawerOpen) this.drawerState = true;
      else this.drawerState = false;
    },
    drawerState() {
      if (!this.drawerState) this.$emit("drawer-close", this.drawerState);
    },
    darkMode() {
      this.$emit("view-mode", this.darkMode);
    }
  },

  data() {
    return {
      drawerState: false,
      darkMode: true,
      editGroups: false,
      editGateway: false,
      icons: {
        github: mdiGithubCircle,
        light: mdiLightbulbOutline,
        lightgroup: mdiLightbulbGroupOutline,
        gateway: mdiAccessPoint,
        dark: mdiPowerSleep,
        presets: mdiPaletteOutline
      }
    };
  },

  computed: {
    ...mapGetters(["gatewayFound"])
  },

  methods: {
    closeGatewayEdit() {
      this.editGateway = false;
    },
    closeGroupsEdit() {
      this.editGroups = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/swatch";

.config-drawer {
  background: $secondary-dark;

  .no-gateway {
    opacity: 0.5;
    pointer-events: none;
    user-select: none;
  }
}
</style>
