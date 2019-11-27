<template>
  <svg width="100%" height="100%" v-on:wheel="wheel" v-html="svgData"/>
</template>

<script>
import { mapState } from 'vuex'

var parser = new DOMParser();

export default {
  name:'Viewport',
  computed: mapState ({
    svgData: state => state.svg,
  }),
  methods: {
    wheel: e => console.log(e)
  }
}
</script>

<style>
</style>
