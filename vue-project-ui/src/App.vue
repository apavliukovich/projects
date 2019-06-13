<template>
  <div id="app">
    <navigation class="nav"/>
    <router-view/>
  </div>
</template>

<script>
import Navigation from './components/Nav.vue'

export default {
  components: {
    Navigation
  }
}
</script>
<style lang="scss">
  body {
    margin: 0;
  }
#app {
  background: rgba(242,246,248,1);
  background: -moz-linear-gradient(45deg, rgba(242,246,248,1) 0%, rgba(216,225,231,1) 38%, rgba(181,198,208,1) 63%, rgba(224,239,249,1) 100%);
  background: -webkit-gradient(left bottom, right top, color-stop(0%, rgba(242,246,248,1)), color-stop(38%, rgba(216,225,231,1)), color-stop(63%, rgba(181,198,208,1)), color-stop(100%, rgba(224,239,249,1)));
  background: -webkit-linear-gradient(45deg, rgba(242,246,248,1) 0%, rgba(216,225,231,1) 38%, rgba(181,198,208,1) 63%, rgba(224,239,249,1) 100%);
  background: -o-linear-gradient(45deg, rgba(242,246,248,1) 0%, rgba(216,225,231,1) 38%, rgba(181,198,208,1) 63%, rgba(224,239,249,1) 100%);
  background: -ms-linear-gradient(45deg, rgba(242,246,248,1) 0%, rgba(216,225,231,1) 38%, rgba(181,198,208,1) 63%, rgba(224,239,249,1) 100%);
  background: linear-gradient(45deg, rgba(242,246,248,1) 0%, rgba(216,225,231,1) 38%, rgba(181,198,208,1) 63%, rgba(224,239,249,1) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f2f6f8', endColorstr='#e0eff9', GradientType=1 );
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height:100vh;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
  .nav{
    padding:30px;
  }
}
</style>
