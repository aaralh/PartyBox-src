<template>
  <div>
    <div class="navigation_bar">
      <div class="navigation_bar_menu">
        <button
          role="button"
          class="btn btn-lg btn-primary menu_button"
          v-on:mousedown="showMainMenu = !showMainMenu"
        >
          <i class="fas fa-bars"></i>
        </button>
        <div v-if="false" class="add_song_button">
          <i class="fas fa-plus add_icon"></i>
          <div class="add_song_label">Add Song</div>
        </div>
      </div>
      <div class="now_playing" v-if="playing.status">
        <div class="song_info">
          <div class="label">Now playing:</div>
          <div class="info">
            <marquee behavior="scroll" direction="left">
              <div class="title">{{ nowPlaying.name }}</div>
              <div class="artist">{{ nowPlaying.artist }}</div>
            </marquee>
          </div>
        </div>
      </div>
      <div v-if="false" class="navigation_bar_chat">
        <button
          role="button"
          class="btn btn-lg btn-primary chat_button"
          v-on:mousedown="showChat = !showChat"
        >
          <i class="far fa-comments"></i>
        </button>
      </div>
    </div>
    <transition name="main_menu_transition">
      <main-menu v-on:close="close" v-if="showMainMenu" :key="'main-menu'"></main-menu>
    </transition>
  </div>
</template>

<script lang="ts">
import MainMenu from "./MainMenu.vue";
import { mapGetters } from "vuex";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {
    MainMenu
  },
  computed: {
    ...mapGetters({
      nowPlaying: "nowPlaying",
      playing: "playing"
    })
  }
})
export default class NavigationBar extends Vue {
  public showMainMenu = false;
  public showChat = true;

  public close(object) {
    this.showMainMenu = false;
    this.$emit("event", object.case);
  }
  public closeChat() {
    this.showChat = false;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navigation_bar {
  position: fixed;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  top: 0px;
  height: 6vh;
  width: 100%;
  background-color: #969ffd91;
  min-height: 42px;
  z-index: 2;
}
.navigation_bar_menu {
  background-color: #969ffd91;
  display: flex;
  justify-content: start;
  align-items: center;
  max-width: 5.8vh;
  width: 20vw;
  flex-direction: row;
}

.navigation_bar_chat {
  background-color: #5874d180;
  display: flex;
  justify-content: start;
  align-items: center;
  max-width: 5.8vh;
}

.menu_button {
  font-size: 5.8vh;
  float: left;
  margin-left: -3px;
  cursor: pointer;
  background-color: #b6bffe00;
  outline: none;
  box-shadow: none;
  border: none;
  padding: 0;
}

.chat_button {
  font-size: 5.8vh;
  float: right;
  margin-left: -3px;
  cursor: pointer;
  background-color: #b6bffe00;
  outline: none;
  box-shadow: none;
  border: none;
  padding: 0;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

@media only screen and (max-height: 600px) {
  #app {
    margin-top: 125px;
  }
}

.main_menu_transition-enter-active,
.main_menu_transition-leave-active {
  position: fixed;
  transition: all 0.3s;
}
.main_menu_transition-enter,
.main_menu_transition-leave-to {
  position: fixed;
  opacity: 0;
  transform: translateX(-50%);
}

.chat_transition-enter-active,
.chat_transition-leave-active {
  position: fixed;
  transition: all 0.4s;
}
.chat_transition-enter,
.chat_transition-leave-to {
  position: fixed;
  opacity: 0;
  transform: translateX(50%);
}

.info {
  display: flex;
  flex-direction: column;
  justify-items: start;
  align-items: start;
  margin-left: 2px;
  font-size: 2vh;
  font-weight: normal;
  max-width: 43vw;
  overflow-x: hidden;
  flex: 3;
}

.song_info {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  width: fit-content;
  padding-left: 20px;
  padding-right: 23px;
  border-radius: 20px;
  background-color: #f5f5f5bd;
  font-size: 2.5vh;
  white-space: nowrap;
  width: 50vw;
}

.now_playing {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}

.label {
  flex: 1;
  text-align: right;
}

.add_song_label {
  white-space: nowrap;
  margin-right: 9px;
}
.add_icon {
  margin: 0 9px;
}

.add_song_button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: rgb(1, 168, 1);
  margin-left: 50px;
  height: 3.8vh;
  min-height: 30px;
  border-radius: 15px;
}

@media only screen and (min-device-width: 320px) and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: landscape) {
  .menu_button {
    font-size: 42px;
  }

  .info {
    width: 75vw;
  }
}

@media only screen and (min-device-width: 320px) and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait) {
  .info {
    width: 75vw;
  }
}
</style>