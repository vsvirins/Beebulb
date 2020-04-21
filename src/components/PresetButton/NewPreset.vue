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
            counter
            maxlength="22"
            placeholder="Name"
            :hint="hint"
            @keyup.enter="closeWindow"
            @input="hint = ''"
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
            :style="{ background: iconBg , color: '#222' }"
            class="q-ma-sm"
            :icon="presetIcon"
            @click="changeIconColor = true"
          />
          <q-btn
            flat
            round
            size="sm"
            :style="{ color: iconColor }"
            class="q-ma-sm"
            :icon="presetIcon"
            @click="changeIconColor = false"
          />
          <q-btn flat round size="sm" class="q-ma-sm" :icon="swapIcon" @click="swapColor" />
          <q-btn flat round size="sm" icon="add" class="q-ma-sm float-right" @click="addNewPreset" />
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
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="pickIcon">
      <q-card class="bg-dark">
        <q-card-section>
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
import {
  mdiAirballoon,
  mdiArch,
  mdiAtom,
  mdiAutorenew,
  mdiBeer,
  mdiBeehiveOutline,
  mdiBat,
  mdiAndroidStudio,
  mdiAppleIcloud,
  mdiAnchor,
  mdiAnvil,
  mdiApproximatelyEqual,
  mdiAppleSafari,
  mdiAt,
  mdiAttachment,
  mdiBaguette,
  mdiBalloon,
  mdiBarley,
  mdiBedKing,
  mdiBee,
  mdiBell,
  mdiBilliards,
  mdiBinoculars,
  mdiBlender,
  mdiBolt,
  mdiBomb,
  mdiBoombox,
  mdiBowlMix,
  mdiBowling,
  mdiBrain,
  mdiBriefcase,
  mdiBrightness3,
  mdiBroom,
  mdiBrush,
  mdiBullseye,
  mdiBugle,
  mdiCakeVariant,
  mdiCameraIris,
  mdiCamera,
  mdiCannabis,
  mdiCandycane,
  mdiCampfire,
  mdiCardsHeart,
  mdiCardsSpade,
  mdiCardsDiamond,
  mdiCardsClub,
  mdiCat,
  mdiChessKing,
  mdiChessQueen,
  mdiChiliMild,
  mdiCigar,
  mdiChristianity,
  mdiCityVariant,
  mdiClippy,
  mdiCoffee,
  mdiClover,
  mdiCodeTags,
  mdiCog,
  mdiCompassRose,
  mdiControllerClassic,
  mdiCookie
} from "@mdi/js";
import { mapActions, mapGetters } from "vuex";

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
      hint: "",
      pickIcon: false,
      presetIcon: "edit",
      swapIcon: mdiAutorenew,
      iconBg: "rgb(60,60,60)",
      iconColor: "rgb(247,188,40)",
      changeIconColor: true,
      icons: {
        mdiAirballoon: mdiAirballoon,
        mdiArch: mdiArch,
        mdiAtom: mdiAtom,
        mdiBeer: mdiBeer,
        mdiBeehiveOutline: mdiBeehiveOutline,
        mdiBat: mdiBat,
        mdiAndroidStudio: mdiAndroidStudio,
        mdiAppleIcloud: mdiAppleIcloud,
        mdiAnchor: mdiAnchor,
        mdiAnvil: mdiAnvil,
        mdiApproximatelyEqual: mdiApproximatelyEqual,
        mdiAppleSafari: mdiAppleSafari,
        mdiAt: mdiAt,
        mdiAttachment: mdiAttachment,
        mdiBaguette: mdiBaguette,
        mdiBalloon: mdiBalloon,
        mdiBarley: mdiBarley,
        mdiBedKing: mdiBedKing,
        mdiBee: mdiBee,
        mdiBell: mdiBell,
        mdiBilliards: mdiBilliards,
        mdiBinoculars: mdiBinoculars,
        mdiBlender: mdiBlender,
        mdiBolt: mdiBolt,
        mdiBomb: mdiBomb,
        mdiBoombox: mdiBoombox,
        mdiBowlMix: mdiBowlMix,
        mdiBowling: mdiBowling,
        mdiBrain: mdiBrain,
        mdiBriefcase: mdiBriefcase,
        mdiBrightness3: mdiBrightness3,
        mdiBroom: mdiBroom,
        mdiBrush: mdiBrush,
        mdiBullseye: mdiBullseye,
        mdiBugle: mdiBugle,
        mdiCakeVariant: mdiCakeVariant,
        mdiCameraIris: mdiCameraIris,
        mdiCamera: mdiCamera,
        mdiCannabis: mdiCannabis,
        mdiCandycane: mdiCandycane,
        mdiCampfire: mdiCampfire,
        mdiCardsHeart: mdiCardsHeart,
        mdiCardsSpade: mdiCardsSpade,
        mdiCardsDiamond: mdiCardsDiamond,
        mdiCardsClub: mdiCardsClub,
        mdiCat: mdiCat,
        mdiChessQueen: mdiChessQueen,
        mdiChessKing: mdiChessKing,
        mdiChiliMild: mdiChiliMild,
        mdiCigar: mdiCigar,
        mdiChristianity: mdiChristianity,
        mdiCityVariant: mdiCityVariant,
        mdiClippy: mdiClippy,
        mdiCoffee: mdiCoffee,
        mdiClover: mdiClover,
        mdiCodeTags: mdiCodeTags,
        mdiCog: mdiCog,
        mdiCompassRose: mdiCompassRose,
        mdiControllerClassic: mdiControllerClassic,
        mdiCookie: mdiCookie
      }
    };
  },
  methods: {
    ...mapActions(["createNewPreset"]),
    ...mapGetters(["presets"]),

    closeWindow() {
      this.hint = "";
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
      const createPreset = () => {
        this.createNewPreset({ preset: preset }),
          (this.iconBg = "rgb(60,60,60)"),
          (this.iconColor = "rgb(247,188,40)"),
          (this.name = ""),
          (this.presetIcon = "edit"),
          this.closeWindow();
      };
      const checkIfPresetExist = () => {
        for (let preset of this.presets()) {
          let index = Object.keys(preset)[0];
          if (preset[index].name === this.name) {
            return true;
          }
        }
      };

      this.presets().length !== 0
        ? checkIfPresetExist()
          ? (this.hint = "Name is occupied.")
          : createPreset()
        : createPreset();
    }
  }
};
</script>

<style lang="scss" scoped>
.mini {
  size: 50%;
}
</style>