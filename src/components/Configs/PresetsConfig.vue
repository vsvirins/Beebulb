<template>
  <div>
    <q-dialog v-model="editPresets" persistent @keydown.esc="closePresetsEdit">
      <q-card class="presets-edit-wrapper">
        <q-btn
          flat
          round
          size="sm"
          icon="close"
          class="absolute-top-right q-ma-sm"
          @click="closePresetsEdit"
        />

        <q-card-section class="presets-edit" v-if="presets.length !== 0">
          <div class="presets-list" v-for="preset in presets" :key="preset.key">
            <q-btn
              flat
              class="full-width"
              align="between"
              :ripple="false"
              :style="{ background: preset[1].bg, color: preset[1].color }"
              :icon="preset[1].icon"
              :icon-right="removePreset"
              :label="preset[1].name"
              @click="deletePreset({preset: preset})"
            ></q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { mdiClose } from "@mdi/js";
export default {
  name: "PresetConfig",
  props: ["edit-presets"],
  data() {
    return {
      removePreset: mdiClose
    };
  },
  computed: {
    ...mapGetters(["presets"])
  },
  methods: {
    ...mapActions(["deletePreset"]),
    closePresetsEdit() {
      this.$emit("closePresetsEdit");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/swatch";

.presets-edit-wrapper {
  ::-webkit-scrollbar {
    display: none;
  }
  padding: 2rem;
  background: #222;
  color: white;
  width: 30rem;
  display: flex;

  .presets-edit {
    width: 100%;
  }
}
</style>