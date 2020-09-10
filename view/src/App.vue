<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
html,body,#app{
  height: 100%;
  width: 100%;
}
#app{
  background:url('../static/53560.jpg') no-repeat;
  background-size: 100%;
}
</style>
