<template>
  <div>
    <q-dialog v-model="active" persistent @keydown.esc="closeLightsEdit">
      <q-card class="lights-edit-wrapper">
        <q-btn
          flat
          round
          size="sm"
          icon="close"
          class="absolute-top-right q-ma-sm"
          @click="closeLightsEdit"
        />
        <q-card-section class="lights-edit">
          <div class="lights-group" v-for="group in groups" :key="group.id">
            <h6>{{ group.name }}</h6>
            <ul>
              <li v-for="light in group.lights" :key="light.value">
                <q-icon :name="icons['light']" class="text-white" />
                {{ lights[light].name }}
              </li>
            </ul>
          </div>
          <div class="lights-group-unassigned">
            <h6>
              <small>
                <i>Unassigned</i>
              </small>
            </h6>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="text-positive">
          <q-btn flat label="Save" @click="closeLightsEdit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mdiLightbulbOutline } from "@mdi/js";
//import { mdiPlus, mdiMinus, mdiLightbulbGroupOutline } from "@mdi/js";
export default {
  name: "LightsConfig",

  props: ["edit-lights"],

  computed: {
    ...mapGetters(["groups", "lights"])
  },
  data() {
    return {
      active: false,
      icons: { light: mdiLightbulbOutline }
    };
  },
  watch: {
    editLights() {
      this.active = this.editLights;
    }
  },
  methods: {
    closeLightsEdit() {
      this.$emit("closeLightsEdit");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/swatch";

.lights-edit-wrapper {
  padding: 2rem;
  background: #222;
  color: white;
  width: 30rem;
  display: flex;
  flex-direction: column;
  .lights-edit {
    .lights-group {
      h6 {
        margin: 0;
      }
      ul {
        list-style-type: none;
        li {
          color: $accent;
        }
      }
      background: #333;
      border-radius: 0.25rem;
      padding: 0.5rem;
      margin: 0.5rem;
    }
    .lights-group-unassigned {
      height: 8rem;
      background: #333;
      border-radius: 0.25rem;
      padding: 0.5rem;
      margin: 0.5rem;
      h6 {
        margin: 0;
      }
    }
  }
}
</style>