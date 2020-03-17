<template>
  <div class="preset-wrapper">
    <q-fab
      outline
      unelevated
      class="fixed-bottom-right q-ma-md"
      color="amber-1"
      :icon="presetIcon"
      direction="up"
      vertical-actions-align="right"
    >
      <div v-if="presets.length !== 0">
        <q-fab-action
          v-for="preset in presets"
          :key="presets[preset]"
          :style="{ background: preset[1].bg, color: preset[1].color }"
          :icon="preset[1].icon"
          :label="preset[1].name"
          label-position="left"
        />
      </div>
      <q-fab-action flat color="white" text-color="grey-2" icon="add" @click="newPreset = true" />
      <new-preset :add-preset="newPreset" @closeWindow="newPreset = false" />
    </q-fab>
  </div>
</template>

<script>
import NewPreset from "./NewPreset.vue";
import { mdiPaletteOutline, mdiAirballoon, mdiArch, mdiAtom } from "@mdi/js";
import { mapGetters } from "vuex";

export default {
  name: "PresetButton",
  data() {
    return {
      newPreset: false,
      presetIcon: mdiPaletteOutline,
      icons: {
        mdiAirballoon: mdiAirballoon,
        mdiArch: mdiArch,
        mdiAtom: mdiAtom
      }
    };
  },
  components: {
    "new-preset": NewPreset
  },

  computed: {
    ...mapGetters(["presets"])
  }
};
</script>

<style lang="scss" scopep>
.preset-wrapper {
  display: flex;
  align-content: flex-end;
  justify-content: flex-end;
  position: absolute;
  margin: 20px;
  right: 0;
  bottom: 0;
}
</style>
