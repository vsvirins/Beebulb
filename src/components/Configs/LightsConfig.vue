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
              <div class="list-item" v-for="light in groupLights[group.id]" :key="light.id">
                <q-icon :name="icons['light']" class="text-white" />
                {{ lights[light].name }}
              </div>
            </draggable>
          </div>

          <div class="lights-group-unassigned">
            <div class="unassigned-wrapper">
              <h6>Unassigned</h6>
              <q-btn round size="0.8rem" :icon="icons['scan']" class="scan" @click="newScan" />
              <q-spinner-tail v-if="scanning" color="white" size="2.5rem" class="spinner" />
            </div>

            <div class="list-item" v-for="light in unassignedLights" :key="light">
              <q-btn
                flat
                round
                size="sm"
                :icon="icons['add']"
                class="text-white"
                @click="newLightDialog(light)"
              />
              {{ lights[light].name }}
            </div>
            <q-dialog
              v-model="newLightDialogActive"
              persistent
              @keydown.esc="newLightDialog = false"
            >
              <q-card class="lights-edit-wrapper">
                <q-input dark v-model="newLightName" class="q-mb-sm" placeholder="Rename.." />
                <q-btn-dropdown dark color="green-8" :label="selectedGroupName">
                  <q-list class="bg-grey-8 text-white">
                    <q-item
                      v-for="group in groups"
                      :key="group.name"
                      clickable
                      v-ripple
                      v-close-popup
                      @click="selectGroup(group.id)"
                    >{{ group.name }}</q-item>
                  </q-list>
                </q-btn-dropdown>
                <q-card-actions align="right" class="text-positive">
                  <q-btn flat label="Submit" @click="assignNewLight" />
                </q-card-actions>
              </q-card>
            </q-dialog>
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
import { mdiLightbulbOutline, mdiMinus, mdiPlus, mdiWifi } from "@mdi/js";
import draggable from "vuedraggable";
//import { mdiPlus, mdiMinus, mdiLightbulbGroupOutline } from "@mdi/js";
export default {
  name: "LightsConfig",

  props: ["edit-lights"],

  components: {
    draggable
  },

  computed: {
    ...mapGetters(["groups", "lights", "groupLights"]),

    unassignedLights() {
      const groupsWithLights = Object.keys(this.groups).filter(
        group => this.groups[group].lights.length != 0
      );

      if (groupsWithLights.length) {
        let lights = Object.keys(this.lights);

        //If a light is a member of a group, change its value to "assigned"
        const findLights = i => {
          if (i < groupsWithLights.length) {
            this.groups[groupsWithLights[i]].lights.forEach(light => {
              if (lights.includes(light)) {
                lights[lights.indexOf(light)] = "assigned";
              }
            });
            findLights(++i);
          }
        };

        findLights(0);

        return lights.filter(light => light != "assigned");
      } else {
        return Object.keys(this.lights);
      }
    },

    selectedGroupName() {
      return this.selectedGroup === ""
        ? "Select a group.."
        : this.groups[this.selectedGroup].name;
    }
  },

  data() {
    return {
      active: false,
      icons: {
        light: mdiLightbulbOutline,
        remove: mdiMinus,
        add: mdiPlus,
        scan: mdiWifi
      },
      newGroupLights: {},
      newLightDialogActive: false,
      lightToAdd: "",
      newLightName: "",
      selectedGroup: "",
      scanning: false
    };
  },
  watch: {
    editLights() {
      this.active = this.editLights;
      this.newGroupLights = this.$store.getters.groupLights;
    }
  },
  methods: {
    ...mapActions([
      "setNewLightOrder",
      "addNewLight",
      "scanForNewLights",
      "identifyLight"
    ]),
    closeLightsEdit() {
      this.$emit("closeLightsEdit");
    },

    submitNewLightOrder() {
      this.setNewLightOrder({ order: this.newGroupLights });
      this.newGroupLights = {};
      this.closeLightsEdit();
    },

    assignNewLight() {
      if (this.selectedGroup != "") {
        this.addNewLight({
          light: this.lightToAdd,
          group: this.selectedGroup,
          name: this.newLightName
        });
        //this.newGroupLights[this.selectedGroup].push(this.lightToAdd);
        this.lightToAdd = "";
        this.selectedGroup = "";
        this.newLightName = "";
        this.newLightDialogActive = false;
      }
    },

    newLightDialog(light) {
      this.newLightDialogActive = true;
      this.lightToAdd = light;
      this.identifyLight({ light });
    },

    selectGroup(group) {
      this.selectedGroup = group;
    },
    newScan() {
      const scanDone = () => {
        this.scanning = false;
      };
      this.scanning = true;
      this.scanForNewLights;
      setTimeout(scanDone, 60000);
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
      padding-bottom: 1.5rem;
      border: 1px solid #222;
      align-content: space-between;
      white-space: nowrap;
      overflow: hidden !important;
      text-overflow: ellipsis;

      h6 {
        margin: 0;
      }
      .list-item {
        padding: 0.4rem;
        animation: fade-in 500ms ease-in-out;
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        &:hover {
          background: #444;
        }
      }
      .remove-icon {
        align-content: flex-end;
      }
    }
    .lights-group-unassigned {
      padding-top: 0.2rem;
      border-top: 1px solid #777;
      white-space: nowrap;
      overflow-x: hidden !important;
      text-overflow: ellipsis;
      h6 {
        margin: 0;
      }
      .unassigned-wrapper {
        display: flex;
        justify-content: space-between;
        .scan {
          position: relative;
        }
        .spinner {
          z-index: 10;
          position: absolute;
          right: 15px;
        }
      }
    }
  }
}
</style>
