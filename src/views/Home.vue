<template lang="html">
  <div class="home">
    <div v-if="!$store.getters.isAuthenticated">
      You are not logged in!
    </div>
  </div>
</template>

<script>

export default {
  name: 'Home',
  async mounted() {
  },
  data: () => {
    return {}
  },
  methods: {},
  computed: {
  }
}
</script>

<style lang="scss">
#viewer {
  min-height: 500px;
}
</style>