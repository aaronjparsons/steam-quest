<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Confirm Action</p>
    </header>
    <section class="modal-card-body">{{ message }}</section>
    <footer class="modal-card-foot right-align">
      <button class="button is-primary" @click="$parent.close()">No</button>
      <button class="button is-primary">Yes</button>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.right-align {
  display: flex;
  justify-content: flex-end;
}
</style>