<template lang="html">
  <v-container fill-height class="home flex-column justify-center align-center primary--text">
    <h1>Welcome to the Speckle Demo App!</h1>
    <h3>This app part of our developer guide on how to create your very own Speckle App.</h3>
    <v-alert type="info" text color="primary" class="my-5 dark">
      Check out <a href="https://speckle.guide/dev/apps" target="_blank">the tutorial</a>!
    </v-alert>
    <p>Please log in to access you Speckle data.</p>
  </v-container>
</template>
<script>
export default {
  name: 'WelcomeView'
}
</script>
