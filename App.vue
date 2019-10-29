<template>
	<div class="vueRoot">
		<Debug v-if="debug" />
		<!-- <router-view /> -->
		<Graph/>
	</div>
</template>

<script>
	import Debug from './components/Debug'
	import Face from './components/Face'
  import Graph from './components/Graph'
	export default {
		name: 'app',
		props: ['debug'],
		components: {Debug, Face, Graph}
  }
</script>

<style>
.vueRoot{
	display:flex;
	flex-direction: column;
	height:100%;
}
html{
	height:100%;
	background-color:black;
	font-size:18px;
}
body{
	height:100%;
	background-color: rgb(238, 243, 231);
	/* border:solid 20px black; */
	border-radius: 30px;
	margin:0;
	font-family: 'Berkshire Swash', cursive;
	font-size:calc(0.8rem + 1.75vmin);
}
</style>
