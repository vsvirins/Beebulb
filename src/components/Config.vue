<template>
  <q-drawer v-model="drawerState" content-class="drawer" dark :width="200">
    <q-list>
      <q-item>
        <q-toggle
          class="fixed-top-right q-ma-sm"
          icon="nights_stay"
          color="grey-8"
          v-model="darkMode"
        />
      </q-item>
      <q-space />
      <q-item clickable tag="a" target="_blank" href="https://chat.quasar.dev">
        <q-item-section avatar>
          <q-icon name="wb_incandescent" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Lights</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable tag="a" target="_blank" href="#">
        <q-item-section avatar>
          <q-icon name="apps" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Groups</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable tag="a" target="_blank" href="https://forum.quasar.dev">
        <q-item-section avatar>
          <q-icon name="camera" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Presets</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable tag="a" target="_blank" href="https://twitter.com/quasarframework">
        <q-item-section avatar>
          <q-icon name="rss_feed" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Gateway</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable tag="a" target="_blank" href="https://github.com/quasarframework/">
        <q-item-section avatar>
          <q-icon name="code" />
        </q-item-section>
        <q-item-section>
          <q-item-label>About</q-item-label>
        </q-item-section>
      </q-item>
      <q-item-section>
        <p class="q-mx-sm" style="font-size: 8pt">{{ gatewayIP }}</p>
      </q-item-section>
    </q-list>
  </q-drawer>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Config",

  props: ["drawer-open"],

  watch: {
    drawerOpen() {
      if (this.drawerOpen) this.drawerState = true;
      else this.drawerState = false;
    },
    darkMode() {
      this.$emit("view-mode", this.darkMode);
    }
  },
  data() {
    return {
      drawerState: false,
      darkMode: true
    };
  },
  computed: {
    ...mapGetters(["gatewayIP"])
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/swatch";

.drawer {
  background: $secondary-dark;
}
</style>