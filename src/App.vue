<template>
  <div id="app">
    <TextEditor/>
    <Toolbar/>
    <Viewport/>
  </div>
</template>

<script>

import TextEditor from './components/TextEditor'
import Toolbar from './components/Toolbar.vue'
import Viewport from './components/Viewport'

import Path from './models/Path'

export default {
  name: 'app',
  components: {
    TextEditor,
    Toolbar,
    Viewport,
  },
  methods: {
    mousewheel: e => { console.log(e.deltaY, e) },
  }
}

// window.addEventListener('keydown', e => {
//   console.log(e);
// })

// window.addEventListener('keyup', e => {
//   console.log(e);
// })

// window.addEventListener('mousemove', e => {
//   console.log(e);
// })

// window.addEventListener('mousedown', e => {
//   console.log(e);
// })

// window.addEventListener('mouseup', e => {
//   console.log(e);
// })

// window.addEventListener('mousewheel', e => {
//   console.log(e);
// })
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
