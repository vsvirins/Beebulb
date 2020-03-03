<template>
  <div>
    <q-dialog v-model="active" persistent>
      <q-card class="group-edit-wrapper">
        <q-btn
          flat
          round
          size="sm"
          icon="close"
          class="absolute-top-right q-ma-sm"
          @click="active = false"
        />
        <q-card-section class="group-edit" v-for="group in groups" :key="group.id">
          <q-input
            class="group-edit-input"
            dark
            v-model="changeGroupName[group.id]"
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
          <q-input dark v-model="newGroupName" placeholder="New group.." @keypress.enter="addGroup">
            <template v-slot:prepend>
              <q-icon :name="icons['lightGroup']" />
            </template>
            <template v-slot:append>
              <q-btn flat round size="sm" :icon="icons['addGroup']" @click="addGroup" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="text-positive">
          <q-btn flat label="Save" @click="active = !active" />
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
      changeGroupName: {},
      newGroupName: "",
      icons: {
        addGroup: mdiPlus,
        removeGroup: mdiMinus,
        lightGroup: mdiLightbulbGroupOutline
      }
    };
  },
  watch: {
    editGroups() {
      this.active = this.editGroups;
    }
  },
  methods: {
    ...mapActions(["addNewGroup", "removeGroup"]),
    addGroup() {
      const groupName = this.newGroupName;
      this.addNewGroup({ name: groupName });
      this.newGroupName = "";
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
    }
  }
}
</style>