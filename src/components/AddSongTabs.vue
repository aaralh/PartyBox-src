<template>
  <div>
    <ul class="btn-group add_song_tabs" v-on:click.stop>
      <li role="group" id="toolBtns" v-for="tab in tabs" :key="tab.id">
        <button role="button" class="btn btn-lg btn-primary add_song_tabs_tab" v-on:click="clicked(tab)" :class="{'btn-active': tab.id === selected}"> {{ tab.label }} </button>
      </li>
    </ul>
    <div class="container">
      <!-- render the currently active component/page here -->
        <keep-alive>
          <component v-on:add="add" v-on:close="close" :is="currentView"></component>
        </keep-alive>
    </div>
  </div>
</template>

<script lang="ts">

  import Youtube from "./AddSongTabComponents/YoutubeComponent.vue";
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component({
    components: {
      Youtube
    },
  })
  export default class AddSongTabs extends Vue {
    public tabs = [{id: 0, label: "Youtube", component: Youtube}];
    public selected = 0;
    public currentView = Youtube;

      public clicked(tab) {
        this.selected = tab.id;
        this.currentView = tab.component;
      };

      public close() {
        this.$emit("close");
      };
      public add(song) {
        this.$emit("add", song);
      }
    
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.add_song_tabs {
  display: inline-flex;
  height: 35px;
  width: calc(100% - 10px);
  -webkit-overflow-scrolling: touch;
  overflow-y: hidden;
  overflow-x: auto;
  background-color: #bfc4ff5e;
  list-style: none;
  margin-top: 0px;
  margin-bottom: 0px;
  -webkit-padding-start: 10px;
  padding-left: 10px;
}

.add_song_tabs_tab {
  height: 30px;
  width: fit-content;
  padding: 5px;
  border-radius: 5px 5px 0px 0px;
  margin: 6px 5px 0px 5px;
  outline: none;
}

.add_song_tabs_left {
  position: absolute;
  float: left;
  left: 0;
  height: 40px;
  width: 10px;
  background-color: whitesmoke;
  box-shadow: 1px 1px 1px #888888;
  z-index: 2;
}

.add_song_tabs_right {
  position: absolute;
  right: 0px;
  float: right;
  height: 40px;
  width: 10px;
  background-color: whitesmoke;
  box-shadow: -1px 1px 1px #888888;
  z-index: 2;
}

.icon {
  margin-top: 20px;
  transform: translateY(-50%);
}

.btn-active {
  background-color: #808ae9;
  z-index: 3;
  border-bottom-color: #808ae900;
}

</style>