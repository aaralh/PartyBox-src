<template>
	<div>
		<div class="add_song" v-on:click="close">
		<div class="add_song_container" v-on:click.stop>
			<div class="add_song_container_header">
			<div class="add_song_container_header_title">
				Add Song
			</div>
			</div>
			<add-song-tabs v-on:add="add" v-on:close="close"></add-song-tabs>
		</div>
		</div>
	</div>
</template>

<script lang="ts">

import AddSongTabs from "./AddSongTabs.vue";
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {
    AddSongTabs
  },
})
export default class AddSong extends Vue {
    public close() {
      this.$emit("close");
    };

    public add(song) {
      this.$emit("add", song);
    };
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.add_song {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: black;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
}

.add_song_container {
  top: 50%;
  left: 50%;
  height: 21%;
  min-height: 200px;
  width: 90%;
  position: absolute;
  background-color: #9099ffe3;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  padding-bottom: 4vh;
}

.add_song_container_header {
  height: 10%;
  width: 100%;
  background-color: #9099ffe3;
  border-radius: 8px 8px 0px 0px;
  display: inline-flex;
  border-bottom: 1px solid grey;
  box-shadow: 1px 1px 1px #888888;
}

.add_song_container_header_title {
  text-align: center;
  padding-top: 1.5%;
  font-size: 100%;
  margin-left: 50%;
  margin-right: 10%;
  transform: translateX(-50%);
}

@media only screen and (min-width: 600px) {
  .add_song_container {
    width: 50%;
  }
  .add_song_container_header_title {
    padding-top: 0.25%;
  }
}
</style>