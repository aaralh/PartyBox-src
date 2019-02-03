<template>
	<div class="song_list">
		<transition-group class="song_list_list" name="song_list_transition">
			<song-list-item :song="song" v-on:voted="votingEvent" v-for="song in sortedList" :key="song.id"></song-list-item>
		</transition-group>
	</div>
</template>

<script lang="ts">

import SongListItem from "./SongListItem.vue";
import { mapGetters } from 'vuex'
import { Song } from '@/components/Partybox.vue';

import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {
    SongListItem
  },
  props: {
    songlist: Array
  },
  computed: {
    sortedList() {
      this.songlist = this.sortByDate;
      this.songlist.sort(function(first: Song, second: Song) {
        let pointsFirst = first.points;
        let pointsSecond = second.points;
        return pointsFirst < pointsSecond ? -1 : pointsFirst > pointsSecond ? 1 : 0;
      });
      this.songlist.reverse();
      return this.songlist;
    },
    sortByDate() {
      this.songlist.sort(function(first: Song, second: Song) {
        let idFirst = first.id;
        let ifSecond = second.id;
        return idFirst < ifSecond ? -1 : idFirst > ifSecond ? 1 : 0;
      });
      this.songlist.reverse();
      return this.songlist;
    },
    ...mapGetters(['connection'])
  },
  sockets:{
    voted: function(data) {
      let songId = data.songId;
      let change = data.change;
      for (let song of this.$props.songlist) {
        if (song.id === songId) {
          song.points = song.points + change;
        }
      }
    }
  },
})
export default class SongList extends Vue{
  
  mounted() {
    if(this.$props.songlist.length > 1) {
      this.$props.songlist = this.sortedList();
    }
  };

  votingEvent(msg) {
    let song: Song | undefined = undefined;
    for (let songo of this.$props.songlist) {
      if (songo.id === msg.id) {
        song = songo;
      }
    }
    if (song !== undefined) {
      song.points = song.points + msg.change;
      this.$socket.emit("vote", {songId: msg.id, roomId: (this as any).connection.roomId, change: msg.change})
    }
  };
};
</script>

<style lang="scss">
.song_list_transition-enter-active, .song_list_transition-leave-active {
  transition: all 1s;
}
.song_list_transition-enter, .song_list_transition-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.song_list_transition-move {
  transition: transform 1s;
}

.song_list {
  -webkit-overflow-scrolling: touch;
  margin-top: calc(13vh + 40px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &_list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 95%;
  }
}

</style>