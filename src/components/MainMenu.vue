<template>
	<div class="main_menu" v-on:click="clicked({id: -1})">
		<div class="main_menu_container" v-on:click.stop>
		<main-menu-item
			v-on:clicked="clicked"
			:item="item"
			v-for="item in menuItems"
			v-if="item.type === 0"
			:key="item.id"
		></main-menu-item>
		<div class="main_menu_container_info">
			<div class="room_info">Connected to room: {{ connection.roomId }}</div>
		</div>
		</div>
	</div>
</template>

<script lang="ts">
import MainMenuItem from "./MainMenuItem.vue";

import { mapGetters } from "vuex";
import { saveRoomData } from "../IDBHandler";

import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {
    MainMenuItem
  },
  computed: {
    ...mapGetters({
      connection: "connection"
    })
  }
})
export default class MainMenu extends Vue {
  /**
   * Types:
   * 0: show for all
   * 1: show for collab
   */
  menuItems = [
    { id: 0, label: "Add song", icon: "fas fa-plus", type: 0 },
    { id: 1, label: "Invite friends", icon: "fas fa-user-plus", type: 0 },
    { id: 2, label: "Join party", icon: "fas fa-sign-in-alt", type: 1 },
    { id: 3, label: "Leave party", icon: "fas fa-sign-out-alt", type: 0 }
  ];

  public clicked(item: { id: number }) {
    switch (item.id) {
      case -1:
        this.$emit("close", { case: "" });
        break;
      case 0:
        this.$emit("close", { case: "addSong" });
        break;
      case 1:
        this.$emit("close", { case: "addUser" });
        break;
      case 2:
        this.$emit("close", { case: "joinCollab" });
        break;
      case 3:
        saveRoomData({ roomId: -1, type: -1, admin: false });
        // Remove all listeners so teher wont be any duplicates.
        this.$socket.removeAllListeners("isPlaying");
        this.$socket.removeAllListeners("seekTo");
        this.$socket.removeAllListeners("addSong");
        this.$socket.removeAllListeners("nowPlaying");
        this.$socket.removeAllListeners("voted");
        this.$store.commit("reset_state");
        this.$router.replace({ name: "frontpage" });
        break;
      default:
        break;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.main_menu {
  position: absolute;
  z-index: 3;
  height: 100vh;
  width: 100%;
  top: 0;
  left: 0;
}

.main_menu_container {
  height: calc(100vh - 6vh);
  width: 70%;
  background: linear-gradient(to right, #9da5fdf2, #cdd4eef2);
  position: fixed;
  top: 6vh;
  z-index: 4;
  border-right: 1px solid lightgray;
  box-shadow: 5px 10px 18px #a8b3da;
  padding-top: 10px;
}

.main_menu_container_info {
  margin-top: 20px;
}

@media only screen and (min-width: 600px) {
  .main_menu_container {
    width: 40%;
    max-width: 250px;
  }
}

@media only screen and (min-device-width: 320px) and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: landscape) {
  .main_menu_container {
    height: calc(100vh - 42px);
    top: 42px;
  }
}
</style>