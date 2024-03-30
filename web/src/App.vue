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
// import $ from 'jquery'

export default {
  components: {
    NavBar
  },
  setup() {
/*
    $.ajax({
      url: "http://127.0.0.1:3000/user/account/register/",
      type: "post",
      data: {
        username: "xinyi1272",
        password: "123",
        confirmedPassword: "123",
      },
      success(resp) {
        console.log(resp);
      },
      error(resp) {
        console.log(resp);
      }
    })*/
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
