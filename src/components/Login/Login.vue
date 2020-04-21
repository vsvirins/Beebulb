<template>
  <q-dialog v-model="active" persistent>
    <q-card class="login-dialog">
      <q-card-section>
        <h4 class="text-amber text-center q-mt-sm" style="user-select: none;">Beebulb</h4>
        <q-input
          dense
          outlined
          dark
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
          class="text-grey text-caption q-mt-sm"
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
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  name: "Login",

  data() {
    return {
      active: true,
      username: "",
      password: "",
      errorMsg: "",
      rememberUser: false
    };
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

    ...mapMutations(["AUTH"]),

    ...mapGetters(["authed"]),

    register() {
      const register = () =>
        this.registerNewUser({
          username: this.username,
          password: this.password
        });

      this.checkUsername(this.username) && this.checkPassword(this.password)
        ? register().then(msg => {
            msg === "success"
              ? this.discoverGateway().then(() =>
                  this.generateNewKey({ username: this.username }).then(
                    gatewayUnlocked => {
                      gatewayUnlocked
                        ? (this.getLights().then(() => this.getGroups()),
                          this.AUTH(true),
                          (this.active = false))
                        : (this.errorMsg = "Gateway is locked.");
                    }
                  )
                )
              : typeof msg === "undefined"
              ? (this.errorMsg = "Connection problems.")
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
        ? login().then(response => {
            response === true
              ? (this.AUTH(true), (this.active = false))
              : typeof response === "undefined"
              ? (this.errorMsg = "Connection problems.")
              : (this.errorMsg = response);
          })
        : (this.errorMsg = "Invalid username or password");
    },

    checkUsername(username) {
      return /^[0-9a-zA-Z_.-]+$/.test(username);
    },

    checkPassword(password) {
      if (password.length <= 3) this.errorMsg = "Password too short.";
      return password.length > 3;
    }
  }
};
</script>

<style lang="scss" scoped>
.login-dialog {
  //opacity: 0;
  background-color: #222;
  padding: 1rem;
  animation: fade 1.5s;
  @keyframes fade {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
}
</style>