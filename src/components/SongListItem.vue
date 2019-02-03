<template>
	<div class="container">
		<div class="song" v-bind:class="{'hover': showMenu}">
		<div class="song__left_side">
			<div
			class="song_image"
			v-bind:style="{ backgroundImage: 'url(' + song.data.thumbnailUrl + ')' }"
			></div>
			<div class="song_info">
				<div class="label">{{ song.name }}</div>
				<div class="artist">{{ song.artist }}</div>
				<div v-if="song.data.suggested" class="added_by">[Suggested by PartyBox]</div>
			</div>
		</div>
		<div class="song__rigt_side">
			<div class="song_options">
			<div class="up_container">
				<input
				class="radio_vote_up"
				:name="'radio-group' + song.id"
				type="radio"
				:id="'up' + song.id"
				value="up"
				v-on:change="voteUp('up')"
				>
				<label :for="'up' + song.id" class="radio-custom-label up"></label>
			</div>
			<div
				v-if="connection.admin && connection.type !== 1"
				class="menu_container"
				v-on:click="openMenu"
			>
				<i class="fas fa-ellipsis-h menu"></i>
			</div>
			<div class="down_container">
				<input
				class="radio_vote_down"
				:name="'radio-group' + song.id"
				type="radio"
				:id="'down' + song.id"
				value="down"
				v-on:change="voteDown('down')"
				>
				<label :for="'down' + song.id" class="radio-custom-label down"></label>
			</div>
			</div>
		</div>
		</div>
		<div class="song_menu" v-if="showMenu" v-on:click.stop>
			<div class="song_menu_list">
				<div class="list_item">Remove</div>
				<div class="list_line"></div>
				<div class="list_item" v-on:click="showMenu = false">Close</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";

import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  props: ["song"],
  computed: {
    ...mapGetters({
      connection: "connection"
    })
  }
})
export default class SongListItem extends Vue {
  public checked = "";
  public points = 0;
  public showMenu = false;

  public voteUp(value: string) {
    let change = 0;
    if (this.checked === "down") {
      change = 2;
    } else {
      change = 1;
    }
    this.points = this.points + change;
    this.checked = value;
    this.$emit("voted", { id: this.$props.song.id, change: change });
  }
  public voteDown(value: string) {
    let change = 0;
    if (this.checked === "up") {
      change = -2;
    } else {
      change = -1;
    }
    this.points = this.points + change;
    this.checked = value;
    this.$emit("voted", { id: this.$props.song.id, change: change });
  }
  public openMenu() {
    this.showMenu = !this.showMenu;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.song {
  position: relative;
  display: inline-flex;
  width: 100%;
  height: 12vh;
  background-color: whitesmoke;
  border-radius: 5px;
  transition: transform 0.3s;
  margin-bottom: 4px;
  min-height: 77px;
}

.song:hover {
  transform: scale(1.01);
}

.hover {
  transform: scale(1.01);
  z-index: 4;
}

.song_menu_container {
  position: absolute;
  height: 100vh;
  width: 100%;
  top: 0px;
  left: 0px;
  background-color: red;
  z-index: 0;
}

.container {
  height: 12vh;
  max-height: calc(12vh + 4px);
  margin-bottom: 4px;
  width: 100%;
}

.song_menu {
  position: relative;
  display: flex;
  height: fit-content;
  height: 8vh;
  width: fit-content;
  border-radius: 3px;
  bottom: 10vh;
  left: 86%;
  z-index: 4;
}

.song_menu_list {
  display: inherit;
  height: fit-content;
  list-style-type: none;
  flex-direction: column;
  align-items: flex-start;
  background-color: azure;
  border: 1px solid lightgray;
}

.list_item {
  padding: 3px 3px 3px 3px;
  width: calc(100% - 6px);
  text-align: start;
}

.list_line {
  width: 100%;
  border-bottom: solid 1px #ccc;
}

.list_item:hover {
  background-color: rgb(254, 181, 10);
}

.song_image {
  width: 12vh;
  height: 94%;
  min-width: 77px;
  background-color: whitesmoke;
  margin-right: 10px;
  background-size: cover;
  margin: 2px;
  border-radius: 5px;
}

.song__left_side {
  text-align: start;
  width: 95%;
  display: inline-flex;
}

.song__right_side {
  text-align: end;
  position: relative;
  width: fit-content;
  height: 98%;
  margin-top: 2px;
  margin-bottom: 2px;
}

.song_options {
  margin-right: 7px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.menu {
  margin-top: auto;
  margin-bottom: auto;
}

.radio_vote_up {
  display: none;
}

.radio-custom-label.up {
  margin-top: calc(0.75vh * 0.9);
}

.radio-custom-label.down {
  margin-bottom: 0.75vh;
}

.radio_vote_down {
  display: none;
}

.radio_vote_up:checked + .radio-custom-label:before {
  content: "\f164";
  font-family: "FontAwesome";
  background: whitesmoke;
  color: black;
}

.radio_vote_up + .radio-custom-label:before {
  content: "\f087";
  font-family: "FontAwesome";
  background: whitesmoke;
  color: black;
}

.radio_vote_down:checked + .radio-custom-label:before {
  content: "\f165";
  font-family: "FontAwesome";
  background: whitesmoke;
  color: black;
}

.radio_vote_down + .radio-custom-label:before {
  content: "\f088";
  font-family: "FontAwesome";
  background: whitesmoke;
  color: black;
}

.radio-custom-label {
  cursor: pointer;
}

@media only screen and (min-height: 600px) {
  /*.song_options {
    font-size: 20px;
  }*/
}
</style>
