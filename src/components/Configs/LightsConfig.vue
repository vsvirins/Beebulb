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
            <draggable group="groups" v-model="newGroupLights[group.id]">
              <div
                class="list-item"
                v-for="light in groupLights[group.id]"
                :key="light.id"
              >
                <q-icon :name="icons['light']" class="text-white " />
                {{ lights[light].name }}
              </div>
            </draggable>
          </div>

          <div class="lights-group-unassigned">
            <h6>
              <small>
                Unassigned
              </small>
            </h6>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="text-positive">
          <q-btn flat label="Save" @click="submitNewLightOrder" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { mdiLightbulbOutline, mdiMinus } from "@mdi/js";
import draggable from "vuedraggable";
//import { mdiPlus, mdiMinus, mdiLightbulbGroupOutline } from "@mdi/js";
export default {
  name: "LightsConfig",

  props: ["edit-lights"],

  components: {
    draggable
  },

  computed: {
    ...mapGetters(["groups", "lights", "groupLights"])
  },
  data() {
    return {
      active: false,
      icons: { light: mdiLightbulbOutline, remove: mdiMinus },
      newGroupLights: {},
      unassigned: []
    };
  },
  watch: {
    editLights() {
      this.active = this.editLights;
      this.newGroupLights = this.$store.getters.groupLights;
    }
  },
  methods: {
    ...mapActions(["setNewLightOrder"]),
    closeLightsEdit() {
      this.$emit("closeLightsEdit");
    },

    submitNewLightOrder() {
      this.setNewLightOrder({ order: this.newGroupLights });
      this.newGroupLights = {};
      this.closeLightsEdit();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/swatch";

.lights-edit-wrapper {
  ::-webkit-scrollbar {
    display: none;
  }
  padding: 2rem;
  background: #222;
  color: white;
  width: 30rem;
  display: flex;
  flex-direction: column;
  .lights-edit {
    .lights-group {
      display: flex;
      flex-direction: column;
      user-select: none;
      background: #333;
      padding: 0.5rem;
      padding-bottom: 1.5rem;
      border: 1px solid #222;
      align-content: space-between;
      h6 {
        margin: 0;
      }
      .list-item {
        padding: 0.4rem;
        &:hover {
          background: #444;
        }
      }
      .remove-icon {
        align-content: flex-end;
      }
    }
    .lights-group-unassigned {
      height: 8rem;
      background: #333;
      padding: 0.5rem;
      border: 1px solid #222;
      h6 {
        margin: 0;
      }
    }
  }
}
</style>
