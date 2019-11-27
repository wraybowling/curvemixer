<template>
  <textarea v-on:change="update" v-on:keyup="update">
    {{svg}}
  </textarea>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: "TextEditor",
    computed: mapState ({
      svg: 'svg',
    }),
    methods: {
      update: function(e) {
        this.$store.commit('select', {svg: e.target.value})
        console.log(this.$store.state.svg)
      } 
    }
  }
</script>

<style>
  textarea {
    color:red;
    font-family:'Courier New', Courier, monospace;
  }
</style>