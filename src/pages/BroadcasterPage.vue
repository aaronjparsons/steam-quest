<template>
  <div>
    <p>Broadcaster</p>
    <b-button @click="userCreate">Create Test</b-button>
    <b-button @click="usersGet">Get Test</b-button>
  </div>
</template>

<script>
import { createUser, getAllUsers } from '../firebase/db/User'

export default {
  methods: {
    userCreate() {
      createUser({
        name: 'Name',
        age: 30
      })
    },
    usersGet() {
      getAllUsers()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>