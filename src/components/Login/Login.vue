<template>
  <q-dialog v-model="active" persistent>
    <q-card class="login-dialog">
      <q-card-section>
        <h4 class="text-amber text-center q-mt-sm" style="user-select: none;">Beebulb</h4>
        <q-input
          dense
          outlined
          dark
          autofocus
          class="q-mb-sm"
          v-model="username"
          placeholder="Username"
          style="font-size: 1rem"
          color="amber-10"
          @keypress.enter="login"
          @input="errorMsg = ''"
        />
        <q-input
          dense
          outlined
          dark
          type="password"
          v-model="password"
          placeholder="Password"
          style="font-size: 1rem"
          :hint="errorMsg"
          color="amber-3"
          @keypress.enter="login"
          @keyup.enter="$event.target.select()"
          @input="errorMsg = ''"
          @focus="$event.target.select()"
        />
        <q-checkbox
          dark
          dense
          class="text-grey q-mt-sm"
          v-model="rememberUser"
          label="Remember"
          color="positive"
        />
      </q-card-section>

      <q-card-actions align="center" class="text-grey">
        <q-btn flat label="Login" @click="login" />
        <q-btn flat label="Register" @click="register" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Login",
  props: ["logged-in"],

  data() {
    return {
      active: true,
      username: "",
      password: "",
      errorMsg: "",
      rememberUser: false
    };
  },
  watch: {
    loggedIn() {
      this.active = !this.loggedIn;
    }
  },
  methods: {
    ...mapActions([
      "registerNewUser",
      "discoverGateway",
      "generateNewKey",
      "loginUser",
      "getLights",
      "getGroups"
    ]),
    register() {
      const register = () =>
        this.registerNewUser({
          username: this.username,
          password: this.password
        });
      const newKey = () => this.generateNewKey({ username: this.username });

      this.checkUsername(this.username) && this.checkPassword(this.password)
        ? register().then(msg => {
            msg === "success"
              ? this.discoverGateway().then(() =>
                  newKey().then(gatewayUnlocked => {
                    gatewayUnlocked === false
                      ? (this.errorMsg = "Gateway is locked.")
                      : (this.getLights().then(() => this.getGroups()),
                        this.$emit("user-registred", true));
                  })
                )
              : (this.errorMsg = msg);
          })
        : this.errorMsg !== "Password to short."
        ? (this.errorMsg = "Invalid username or password")
        : null;
    },

    login() {
      const login = () =>
        this.loginUser({
          username: this.username,
          password: this.password
        });

      this.checkUsername(this.username) && this.checkPassword(this.password)
        ? login().then(valid => {
            valid === true
              ? this.$emit("user-registred", true)
              : (this.errorMsg = "Try again.");
          })
        : (this.errorMsg = "Invalid username or password");
    },

    checkUsername(username) {
      return /^[0-9a-zA-Z_.-]+$/.test(username);
    },

    checkPassword(password) {
      password.length > 3 ? "" : (this.errorMsg = "Password to short.");
      return password.length > 3;
    }
  }
};
</script>

<style lang="scss" scoped>
.login-dialog {
  background-color: #222;
  padding: 1rem;
}
</style>