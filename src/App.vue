<template>
  <div class="main">
    <Main />
  </div>
</template>

<script>
import Main from './views/Main'

export default {
  components: {
    Main
  },

  data() {
    return {
      gameLibrary: []
    }
  },

  created() {
    // If the gameLibrary is empty, dispatch the action to set the gameLibrary
    if (!this.$store.getters.gameLibrary.length) {
      this.$store.dispatch('setGameLibrary')
    }
  }
}
</script>

<style lang="scss">
// Import Fonts
@import url('https://fonts.googleapis.com/css?family=Big+Shoulders+Display:400,700&display=swap');
// Import Bulma's core
@import '~bulma/sass/utilities/_all';

// Color Palette Variables
$sq-background-dark: #0b0c10;
$sq-background: #1f2833;
$sq-text: #c5c6c7;
$sq-primary: #66fcf1;
$sq-accent: #45a29e;

// Override Bulma colors
$primary: $sq-primary;
$primary-invert: findColorInvert($sq-primary);
$twitter: #4099ff;
$twitter-invert: findColorInvert($twitter);

// Table customization
$table-color: $sq-text;
$table-head-cell-color: $sq-text;
$table-background-color: $sq-background;
$table-striped-row-even-background-color: #1a212b;
$table-row-hover-background-color: #263241;
$table-striped-row-even-hover-background-color: #263241;

// Setup $colors to use as bulma classes (e.g. 'is-twitter')
$colors: (
  'white': (
    $white,
    $black
  ),
  'black': (
    $black,
    $white
  ),
  'light': (
    $light,
    $light-invert
  ),
  'dark': (
    $dark,
    $dark-invert
  ),
  'primary': (
    $primary,
    $primary-invert
  ),
  'info': (
    $info,
    $info-invert
  ),
  'success': (
    $success,
    $success-invert
  ),
  'warning': (
    $warning,
    $warning-invert
  ),
  'danger': (
    $danger,
    $danger-invert
  ),
  'twitter': (
    $twitter,
    $twitter-invert
  )
);

// Links
$link: $sq-text;
$link-hover: $sq-primary;
$link-visited: $sq-accent;

// Import Bulma and Buefy styles
@import '~bulma';
@import '~buefy/src/scss/buefy';

.main {
  background: $sq-background-dark;
}
</style>
