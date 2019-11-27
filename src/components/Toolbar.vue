<template>
  <ul class="toolbar">
    <li v-for="tool in tools">
      {{tool}}
    </li>
  </ul>
</template>

<script>

export default {
  name: 'toolbar',
  data() {
    return {
      tools: [
        'translate',
        'rotate',
        'scale',
      ]
    }
  }
}
</script>

<style>
.toolbar {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
