<template>
  <div>
    <q-dialog v-model="editGroups" persistent @keydown.esc="closeGroupsEdit">
      <q-card class="group-edit-wrapper">
        <q-btn
          flat
          round
          size="sm"
          icon="close"
          class="absolute-top-right q-ma-sm"
          @click="closeGroupsEdit"
        />

        <q-card-section class="group-edit" v-for="group in groups" :key="group.id">
          <q-input
            class="group-edit-input"
            dark
            v-model="newGroupNames[group.id]"
            :placeholder="group.name"
          >
            <template v-slot:append>
              <q-btn
                flat
                round
                :icon="icons['removeGroup']"
                size="sm"
                @click="removeGroup({id: group.id})"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-card-section class="add-group">
          <q-input
            dark
            v-model="newGroupName"
            placeholder="New group.."
            @keydown.enter="addGroup"
            @keydown.esc="closeGroupsEdit"
          >
            <template v-slot:prepend>
              <q-icon :name="icons['lightGroup']" />
            </template>
            <template v-slot:append>
              <q-btn flat round size="sm" :icon="icons['addGroup']" @click="addGroup" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="text-positive">
          <q-btn flat label="Save" @click="updateGroupNames" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { mdiPlus, mdiMinus, mdiLightbulbGroupOutline } from "@mdi/js";
export default {
  name: "GroupsConfig",

  props: ["edit-groups"],

  computed: {
    ...mapGetters(["groups"])
  },
  data() {
    return {
      active: false,
      newGroupNames: {},
      newGroupName: "",
      icons: {
        addGroup: mdiPlus,
        removeGroup: mdiMinus,
        lightGroup: mdiLightbulbGroupOutline
      }
    };
  },
  methods: {
    ...mapActions(["addNewGroup", "removeGroup", "changeGroupNames"]),
    addGroup() {
      const groupName = this.newGroupName;
      if (groupName != "") {
        this.addNewGroup({ name: groupName });
        this.newGroupName = "";
      }

      /* 
            existingGroupNames.includes(groupName)
        ? (this.newGroupName = "")
        : (this.addNewGroup({ name: groupName }), (this.newGroupName = "")); */
    },
    updateGroupNames() {
      Object.entries(this.newGroupNames).length === 0 &&
      this.newGroupNames.constructor === Object
        ? this.closeGroupsEdit()
        : (this.changeGroupNames({ groupNames: this.newGroupNames }),
          (this.newGroupNames = {}),
          this.$emit("closeGroupsEdit"));
    },
    closeGroupsEdit() {
      this.$emit("closeGroupsEdit");
      this.newGroupNames = {};
    }
  }
};
</script>

<style lang="scss" scoped>
.group-edit-wrapper {
  padding: 2rem;
  background: #222;
  color: white;
  width: 30rem;
  display: flex;
  flex-direction: column;
  .group-edit {
    flex-direction: row;
    .group-edit-input {
      animation: fade-in 500ms ease-in-out;
      @keyframes fade-in {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
    }
  }
}
</style>