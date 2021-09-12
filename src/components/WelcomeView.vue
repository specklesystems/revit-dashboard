<template lang="html">
  <v-container fill-height class="home flex-column justify-center align-center primary--text">
    <h1>Welcome to the Speckle Revit Dashboard App</h1>
    <h3>This app allows you to analyse the data sent from Revit to a Speckle server.</h3>
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
