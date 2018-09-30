<template>
  <div v-if="connection.roomId !== -1" id="partybox">
    <main>
      <navigation-bar v-on:event="event"></navigation-bar>
      <song-player v-if="connection.admin" ref="player" v-on:ended="playerEnd" v-on:seekTo="playerSeekTo"></song-player>
      <song-list :songlist="this.songlist"></song-list>
      <add-song v-on:add="addSong" v-on:close="closeSongPup" v-if="showAddSongPup"></add-song>
      <youtube-player ref="youtube" :song="nowPlaying" v-on:ended="end" v-on:close="closeYoutubePup" v-if="showYoutubePup && connection.admin" v-on:seekTo="seekTo"></youtube-player>
      <add-user v-on:close="closeUserAddPup" v-if="showAddUserPup"></add-user>
      <join-room v-on:connected="connected" v-on:close="showJoinCollabPup = false" v-if="showJoinCollabPup"></join-room>
    </main>
  </div>
</template>

<script lang="ts">

export type Song = {
    id: number,
    name: string,
    artist: string,
    points: number,
    data: { 
      source: number,
      url: string,
      thumbnailUrl: string,
      duration: number,
      currentTime: number,
      suggested: boolean,
    }
}

import SongList from "./SongList.vue";
import NavigationBar from "./NavigationBar.vue";
import AddSong from "./AddSong.vue";
import YoutubePlayer from "./YoutubePlayer.vue";
import SongPlayer from "./SongPlayer.vue";
import AddUser from "./AddUser.vue";
import JoinRoom from "./JoinRoom.vue";

import { mapGetters } from 'vuex'
import { Component, Prop, Vue } from 'vue-property-decorator';

declare module 'vue/types/vue' {
  interface Vue {
    sockets: any;
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    sockets?: any;
  }
}

@Component({
  components: {
    SongList,
    NavigationBar,
    AddSong,
    YoutubePlayer,
    SongPlayer,
    AddUser,
    JoinRoom
  },
  sockets:{
    addSong: function(song: Song) {
      (this as any).songlist.push(song);
      (this as any).songlist.reverse();
      if ((this as any).songlist.length === 1 && ((this as any).nowPlaying.id === -1 || !(this as any).playing)) {
        this.$store.commit('nowPlaying', (this as any).songlist[0]);
        (this as any).songlist.pop(0);
        this.$socket.emit("nowPlaying", {song: song, roomId: (this as any).connection.roomId});
      }
    },
    nowPlaying: function(nowPlaying: Song) {
      this.$store.commit('nowPlaying', nowPlaying);
      (this as any).songlist.forEach((song: Song, index: number) => {
        if (song.id === nowPlaying.id) {
          (this as any).songlist.splice(index, 1);
        }
      });
    },
    isPlaying: function(isPlaying: boolean) {
      this.$store.commit('playing', {status: isPlaying, fromServer: true});
    },
  },
  computed: {
    sortedList() {
      (this as any).songlist = (this as any).sortByDate;
      (this as any).songlist.sort(function(first: Song, second: Song) {
        let pointsFirst = first.points;
        let pointsSecond = second.points;
        return pointsFirst < pointsSecond ? -1 : pointsFirst > pointsSecond ? 1 : 0;
      });
      (this as any).songlist.reverse();
      return (this as any).songlist;
    },
    sortByDate() {
      (this as any).songlist.sort(function(first: Song, second: Song) {
        let pointsFirst = first.id;
        var pointsSecond = second.id;
        return pointsFirst < pointsSecond ? -1 : pointsFirst > pointsSecond ? 1 : 0;
      });
      (this as any).songlist.reverse();
      return (this as any).songlist;
    },
    ...mapGetters(['nowPlaying', 'connection', 'playing', 'currentTime']),
  },
  watch: {
    nowPlaying: function() {
      if((this as any).nowPlaying) {
        switch ((this as any).nowPlaying.data.source) {
          case 0:
            (this as any).showYoutubePup = true;
            break;
          default:
            break;
        }
      }
    },
    playing: function() {
      if(!(this as any).playing.fromServer) {
        this.$socket.emit('isPlaying', {roomId: (this as any).connection.roomId, isPlaying: (this as any).playing.status});
      }
      if((this as any).playing.status) {
        (this as any).playerPlay();
      } else {
        (this as any).playerPause();
      }
    }
  }
})
export default class Partybox extends Vue{

  public showAddSongPup = false;
  public showYoutubePup = false;
  public showAddUserPup = false;
  public showJoinCollabPup = false;
  public songlist: Song[] = [];
  public currentT = 0;

  mounted() {
    this.songlist = (this as any).connection.songList;
    if((this as any).nowPlaying.data.duration === 0 && (this as any).currentTime === 0 && (this as any).connection.type === 1) {
      if (this.songlist.length > 0 && !(this as any).playing) {
        let song = (this as any).sortedList[0];
        this.$store.commit('nowPlaying', song);
        this.songlist.forEach((song, index) => {
          if (song.id === (this as any).nowPlaying.id) {
            this.songlist.splice(index, 1);
          }
        });
        this.$socket.emit("nowPlaying", {song: song, roomId: (this as any).connection.roomId});
      }
    }
  };

  event(event: string) {
    switch (event) {
      case "addSong":
        this.showAddSongPup = true;
        break;
      case "addUser":
        this.showAddUserPup = true;
        break;
      case "joinCollab":
        this.showJoinCollabPup = true;
        break;
      default:
        break;
    }
  };

  closeSongPup() {
    this.showAddSongPup = false;
  };

  closeYoutubePup() {
    this.showYoutubePup = false;
    this.$refs.player.ended();
  };

  closeUserAddPup() {
    this.showAddUserPup = false;
  };

  addSong(song: Song) {
    this.showAddSongPup = false;
    song.data.suggested = false;
    song.id = Date.now();
    this.$socket.emit("addSong", {song: song, roomId: (this as any).connection.roomId});
    this.songlist.push(song);
    this.songlist.reverse();
    if (this.songlist.length === 1 && ((this as any).nowPlaying.id === -1 || !(this as any).playing) && (this as any).connection.admin) {
      this.$store.commit('nowPlaying', this.songlist[0]);
      this.songlist.pop(0);
      this.$socket.emit("nowPlaying", {song: song, roomId: (this as any).connection.roomId});
    }
  };

  pause() {
    this.$refs.player.paused();
  };

  end() {
    this.$refs.player.ended();
    this.showYoutubePup = false;
    if (this.songlist.length > 0) {
      switch ((this as any).sortedList[0].data.source) {
        case 0:
          this.$store.commit('nowPlaying', (this as any).sortedList[0]);
          if((this as any).connection.type === 1) {
            this.$socket.emit('nowPlaying', {roomId: (this as any).connection.roomId, song: (this as any).nowPlaying});
          }
          this.showYoutubePup = true;
          break;
        default:
          break;
      }
      this.songlist.forEach((song, index) => {
        if (song.id === (this as any).nowPlaying.id) {
          this.songlist.splice(index, 1);
        }
      });
    } else {
      let nowPlaying = (this as any).nowPlaying;
      nowPlaying.data.duration = 0;
      nowPlaying.data.currentTime = 0;
      this.$store.commit('nowPlaying', nowPlaying);
    }
  };

  seekTo(newPos: number) {
    if((this as any).connection.data.type !== 1) {
      this.$refs.player.setPosition(newPos);
    }
  };

  time(time: number) {
    this.currentT = time;
  };

  playerPlay() {
    switch ((this as any).nowPlaying.data.source) {
      case 0:
        this.showYoutubePup = true;
        if(this.$refs.youtube){
          this.$refs.youtube.playVideo();
        }
        break;
      default:
        break;
    }
  };

  playerPause() {
    switch ((this as any).nowPlaying.data.source) {
      case 0:
        if(this.$refs.youtube){
          this.$refs.youtube.pauseVideo();
        }
        break;
      default:
        break;
    }
  };

  playerEnd() {
    switch ((this as any).nowPlaying.data.source) {
      case 0:
        if(this.$refs.youtube){
          this.$refs.youtube.stopVideo();
        }
        this.end();
        break;
      default:
        break;
    }
  };

  playerSeekTo(position: number) {
    switch ((this as any).nowPlaying.data.source) {
      case 0:
        if((this as any).connection.data.type !== 1) {
          this.$refs.youtube.seekTo(position);
        }
        break;
      default:
        break;
    }
  };

  //Experiemental collab mode
  connected(response: {status: number, data: {isPlaying: boolean, nowPlaying: Song, roomId: string, songs: Song[], type: number}}){
    if(response.status === 200) {
        this.$store.commit('connection', {admin: true, roomId: response.data.roomId, songList: response.data.songs, type: response.data.type})
        this.$store.commit('nowPlaying', response.data.nowPlaying);
        this.songlist = response.data.songs.reverse();
    }
  };
};
</script>

<style>
html {
  height: 100%;
}
body {
  margin: 0px;
  background-color: lavender;
  background-image: url("../assets/background-party-compressed.jpg");
  background-size: cover;
  background-attachment: fixed;
  height: calc(100vh - 40px - 13vh);
  max-height: 100vh;
}
</style>