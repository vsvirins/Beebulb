<template>
  <div>
    <q-dialog v-model="active" persistent class="transparent">
      <q-card style="min-width: 350px" class="bg-dark text-white">
        <q-card-section horizontal>
          <q-btn
            round
            class="q-ma-md"
            :style="{ background: iconBg, color: iconColor }"
            size="lg"
            :icon="presetIcon"
            @click="pickIcon = true"
          />
          <div class="text-h5 q-my-lg q-mr-md">{{ name }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model="name"
            color="amber"
            dark
            autofocus
            counter
            maxlength="22"
            placeholder="Name"
            @keyup.enter="closeWindow"
          />
        </q-card-section>

        <q-card-section>
          <q-color
            @input="changeIconColor ? iconBg = $event : iconColor = $event "
            :value="changeIconColor ? iconBg: iconColor "
            flat
            no-header
            no-footer
            dark
          />
          <q-btn
            round
            size="sm"
            :style="{ background: 'white', color: '#333' }"
            class="q-ma-sm"
            :icon="presetIcon"
            @click="changeIconColor = true"
          />
          <q-btn
            flat
            round
            size="sm"
            class="q-ma-sm"
            :icon="presetIcon"
            @click="changeIconColor = false"
          />
          <q-btn flat round size="sm" class="q-ma-sm" :icon="swapIcon" @click="swapColor" />
        </q-card-section>

        <q-card-actions align="right" class="text-white">
          <q-btn
            flat
            round
            size="sm"
            icon="close"
            class="absolute-top-right q-ma-sm"
            @click="closeWindow"
          />
          <q-btn flat round icon="add" @click="addNewPreset" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="pickIcon">
      <q-card class="bg-dark">
        <q-card-section class="q-ma-sm">
          <q-btn
            round
            :style="{ background: iconBg, color: iconColor }"
            v-for="icon in icons"
            :key="icon"
            :icon="icon"
            @click="presetIcon = icon, pickIcon = false"
            class="q-ma-sm"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mdiAirballoon, mdiArch, mdiAtom, mdiAutorenew } from "@mdi/js";
import { mapActions } from "vuex";

export default {
  name: "NewPreset",
  props: ["add-preset"],
  watch: {
    addPreset() {
      this.active = this.addPreset;
    }
  },
  data() {
    return {
      active: false,
      name: "",
      pickIcon: false,
      presetIcon: "edit",
      swapIcon: mdiAutorenew,
      iconBg: "rgb(247,188,40)",
      iconColor: "rgb(20,20,20)",
      changeIconColor: true,
      icons: {
        mdiAirballoon: mdiAirballoon,
        mdiArch: mdiArch,
        mdiAtom: mdiAtom
      }
    };
  },
  methods: {
    ...mapActions(["createNewPreset"]),

    closeWindow() {
      this.$emit("closeWindow");
    },
    swapColor() {
      const tempColor = this.iconBg;
      this.iconBg = this.iconColor;
      this.iconColor = tempColor;
    },
    addNewPreset() {
      const preset = {
        name: this.name,
        icon: this.presetIcon,
        bg: this.iconBg,
        color: this.iconColor
      };
      this.createNewPreset({ preset: preset });
      this.closeWindow();
    }
  }
};
</script>

<style lang="scss" scoped>
.mini {
  size: 50%;
}
</style>