<template>
  <div>
    <q-dialog v-model="active" persistent>
      <q-card class="gateway-edit-wrapper">
        <q-btn
          flat
          round
          size="sm"
          icon="close"
          class="absolute-top-right q-ma-sm"
          @click="closeGatewayEdit"
        />
        <q-card-section>
          <q-input
            dense
            dark
            borderless
            autofocus
            v-model="newGatewayName"
            :placeholder="gatewayName"
            style="font-size: 2rem"
            :hint="gatewayAdress"
            @keypress.enter="updateGateway"
          >
            <template v-slot:before>
              <q-icon name="edit" size="60%" />
            </template>
            <q-tooltip
              anchor="top middle"
              self="bottom middle"
              :offset="[0, 2]"
              transition-show="scale"
              transition-hide="scale"
              content-style="background-color: #222; opacity: .5"
            >
              <small>Changing name may take a while.</small>
            </q-tooltip>
          </q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Save" color="positive" @click="updateGateway" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "GatewayConfig",
  props: ["edit-gateway"],
  data() {
    return {
      active: false,
      address: "",
      newGatewayName: ""
    };
  },
  watch: {
    editGateway() {
      this.active = this.editGateway;
    }
  },
  computed: {
    ...mapGetters(["gatewayAdress", "gatewayName"])
  },
  methods: {
    ...mapActions(["changeGatewayName"]),
    updateGateway() {
      if (this.newGatewayName !== "") {
        this.changeGatewayName({ name: this.newGatewayName });
      }
      this.$emit("closeGatewayEdit");
    },
    closeGatewayEdit() {
      this.$emit("closeGatewayEdit");
    }
  }
};
</script>

<style lang="scss" scoped>
.q-card {
  padding: 2.5rem;
  background: #222;
  color: white;
  width: 30rem;
  display: flex;
  flex-direction: column;
}
</style>
