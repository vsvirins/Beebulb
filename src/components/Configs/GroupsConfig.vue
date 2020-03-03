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
            borderless
            v-model="address"
            :placeholder="group.name"
          />
          <q-btn class="remove-group-btn" outline round icon="remove" size="38%" />
        </q-card-section>
        <q-card-section class="add-group">
          <q-input dark v-model="newGroupName" placeholder="New group..">
            <template v-slot:prepend>
              <q-icon :name="icons['lightGroup']" />
            </template>
          </q-input>
          <q-btn flat round :icon="icons['newGroupIcon']" @click="addGroup" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Save" @click="active = !active" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { mdiPlus, mdiLightbulbGroupOutline } from "@mdi/js";
export default {
  name: "GroupsConfig",

  props: ["edit-groups"],

  computed: {
    ...mapGetters(["groups"])
  },
  data() {
    return {
      active: false,
      address: "",
      newGroupName: "",
      icons: { newGroupIcon: mdiPlus, lightGroup: mdiLightbulbGroupOutline }
    };
  },
  watch: {
    editGroups() {
      this.active = this.editGroups;
    }
  },
  methods: {
    ...mapActions(["addNewGroup"]),
    addGroup() {
      const groupName = this.newGroupName;
      this.addNewGroup({ name: groupName });
    }
  }
};
</script>

<style lang="scss" scoped>
.group-edit-wrapper {
  padding: 2.5rem;
  background: #222;
  color: white;
  width: 30rem;
  display: flex;
  flex-direction: column;
  .group-edit {
    flex-direction: row;
    .group-edit-input {
    }

    .remove-group-btn {
      position: absolute;
      right: 10%;
      top: 43%;
    }
  }
}
</style>