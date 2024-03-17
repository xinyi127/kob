<!-- HTML -->
<template>
  <NavBar />
  <router-view></router-view>
</template>


<!-- JS -->
<script>
import NavBar from '@/components/NavBar.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap"

export default {
  components: {
    NavBar
  }
}
</script>


<!-- CSS -->
<style>
body {
  background-image: url("@/assets/images/background.png");
  background-size: cover;
}
</style>
