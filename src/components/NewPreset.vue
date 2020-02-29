<template>
  <div>
    <q-dialog v-model="active" persistent class="transparent">
      <q-card style="min-width: 350px" class="bg-dark text-white">
        <q-card-section horizontal>
          <q-btn
            round
            class="q-ma-md"
            :color="iconColor"
            size="lg"
            :icon="icon"
            @click="pickIcon = true"
          />
          <div class="text-h3 q-my-lg q-mr-md">{{ name }}</div>
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
          <q-btn round size="sm" color="amber-4" class="q-ma-sm" @click="iconColor = 'amber-4'" />
          <q-btn
            round
            size="sm"
            color="light-green-6"
            class="q-ma-sm"
            @click="iconColor = 'light-green-6'"
          />
          <q-btn
            round
            size="sm"
            color="deep-purple-8"
            class="q-ma-sm"
            @click="iconColor = 'deep-purple-8'"
          />
          <q-btn round size="sm" color="teal-3" class="q-ma-sm" @click="iconColor = 'teal-3'" />
          <q-btn round size="sm" color="pink-3" class="q-ma-sm" @click="iconColor = 'pink-3'" />
          <q-btn round size="sm" color="cyan-2" class="q-ma-sm" @click="iconColor = 'cyan-2'" />
          <q-btn round size="sm" color="orange-8" class="q-ma-sm" @click="iconColor = 'orange-8'" />
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
          <q-btn flat round icon="add" @click="closeWindow" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="pickIcon">
      <q-card class="bg-dark">
        <q-card-section class="q-pt-none">
          <q-btn
            round
            size="md"
            :color="iconColor"
            class="q-ma-md"
            icon="looks"
            @click="icon = 'looks'"
          />
          <q-btn
            round
            size="md"
            :color="iconColor"
            class="q-ma-md"
            icon="landscape"
            @click="icon = 'landscape'"
          />
          <q-btn
            round
            size="md"
            :color="iconColor"
            class="q-ma-md"
            icon="local_bar"
            @click="icon = 'local_bar'"
          />
          <q-btn
            round
            size="md"
            :color="iconColor"
            class="q-ma-md"
            icon="wb_sunny"
            @click="icon = 'wb_sunny'"
          />
          <q-btn
            round
            size="md"
            :color="iconColor"
            class="q-ma-md"
            icon="ac_unit"
            @click="icon = 'ac_unit'"
          />
          <q-btn
            round
            size="md"
            :color="iconColor"
            class="q-ma-md"
            icon="fitness_center"
            @click="icon = 'fitness_center'"
          />
          <q-btn
            round
            size="md"
            :color="iconColor"
            class="q-ma-md"
            icon="spa"
            @click="icon = 'spa'"
          />
          <q-btn
            round
            size="md"
            :color="iconColor"
            class="q-ma-md"
            icon="cake"
            @click="icon = 'cake'"
          />
          <q-btn
            round
            size="md"
            :color="iconColor"
            class="q-ma-md"
            icon="nights_stay"
            @click="icon = 'nights_stay'"
          />
          <q-btn
            round
            size="md"
            :color="iconColor"
            class="q-ma-md"
            icon="whatshot"
            @click="icon = 'whatshot'"
          />
          <q-btn
            round
            size="md"
            :color="iconColor"
            class="q-ma-md"
            icon="star_border"
            @click="icon = 'star_border'"
          />
          <q-btn
            round
            size="md"
            :color="iconColor"
            class="q-ma-md"
            icon="alarm"
            @click="icon = 'alarm'"
          />
          <q-btn
            round
            size="md"
            :color="iconColor"
            class="q-ma-md"
            icon="assessment"
            @click="icon = 'assessment'"
          />
          <q-btn
            round
            size="md"
            :color="iconColor"
            class="q-ma-md"
            icon="code"
            @click="icon = 'code'"
          />
          <q-btn
            round
            size="md"
            :color="iconColor"
            class="q-ma-md"
            icon="eco"
            @click="icon = 'eco'"
          />
          <q-btn
            round
            size="md"
            :color="iconColor"
            class="q-ma-md"
            icon="home"
            @click="icon = 'home'"
          />
          <q-btn
            round
            size="md"
            :color="iconColor"
            class="q-ma-md"
            icon="equalizer"
            @click="icon = 'equalizer'"
          />
          <q-btn
            round
            size="md"
            :color="iconColor"
            class="q-ma-md"
            icon="games"
            @click="icon = 'games'"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: "NewPreset",
  props: ["add-preset"],
  watch: {
    addPreset() {
      this.active = this.addPreset;
      console.log(this.addPreset);
    }
  },
  data() {
    return {
      active: false,
      name: "",
      pickIcon: false,
      icon: "edit",
      iconColor: "amber"
    };
  },
  methods: {
    closeWindow() {
      this.$emit("closeWindow");
    }
  }
};
</script>

<style lang="scss" scoped>
.mini {
  size: 50%;
}
</style>