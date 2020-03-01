<template>
  <div class="preset-wrapper">
    <q-fab outline color="amber-1" :icon="presetIcon" direction="up">
      <q-fab-action color="amber" text-color="black" icon="alarm" />
      <q-fab-action
        flat
        color="white"
        text-color="grey-2"
        icon="add"
        @click="newPreset = true"
      />
      <new-preset :add-preset="newPreset" @closeWindow="newPreset = false" />
    </q-fab>
  </div>
</template>

<script>
import NewPreset from './NewPreset.vue';
import { mdiPaletteOutline } from '@mdi/js';

export default {
  name: 'PresetButton',
  data() {
    return {
      newPreset: false,
      presetIcon: mdiPaletteOutline
    };
  },
  components: {
    'new-preset': NewPreset
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
