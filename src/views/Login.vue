<template>
  <div class="container login">
    <div class="form-container">
      <b-field label="Username" :type="messageType">
        <b-input v-model="username" @input="resetFormErrors"></b-input>
      </b-field>

      <b-field label="Password" :type="messageType" :message="message">
        <b-input v-model="password" type="password" @input="resetFormErrors"></b-input>
      </b-field>
      <div class="form-footer">
        <b-button type="is-primary" outlined @click="submitLogin">Login</b-button>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '../helpers/api-helpers'

export default {
  data() {
    return {
      username: '',
      password: '',
      messageType: null,
      message: ''
    }
  },

  methods: {
    resetFormErrors() {
      if (this.messageType) {
        (this.messageType = null), (this.message = '')
      }
    },
    async submitLogin() {
      if (this.username && this.password) {
        const loginRequest = await login(this.username, this.password)

        if (loginRequest.data.success) {
          this.$store.dispatch('setAuthenticated')
          this.$router.push('/dashboard')
        } else {
          this.messageType = 'is-danger'
          this.message = loginRequest.data.message
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// Color Palette Variables
$sq-background-dark: #0b0c10;
$sq-background: #1f2833;
$sq-text: #c5c6c7;
$sq-primary: #66fcf1;
$sq-accent: #45a29e;

.login {
  display: flex;
  justify-content: center;
  padding-top: 5em;
}

.form-container {
  background: $sq-background;
  border-radius: 5px;
  min-width: 300px;
  padding: 20px;
}

.form-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
}
</style>