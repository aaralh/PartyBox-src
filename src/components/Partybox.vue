<template>
  <div v-if="connection.roomId !== -1" id="partybox">
    <main>
      <navigation-bar v-on:event="event"></navigation-bar>
      <song-player
        v-if="connection.admin"
        ref="player"
        v-on:ended="playerEnd"
        v-on:seekTo="playerSeekTo"
      ></song-player>
      <song-list :songlist="this.songlist"></song-list>
      <add-song v-on:add="addSong" v-on:close="closeSongPup" v-if="showAddSongPup"></add-song>
      <youtube-player
        ref="youtube"
        :song="nowPlaying"
        v-on:ended="end"
        v-on:close="closeYoutubePup"
        v-if="showYoutubePup && connection.admin"
        v-on:seekTo="seekTo"
      ></youtube-player>
      <add-user v-on:close="closeUserAddPup" v-if="showAddUserPup"></add-user>
      <join-room
        v-on:connected="connected"
        v-on:close="showJoinCollabPup = false"
        v-if="showJoinCollabPup"
      ></join-room>
    </main>
  </div>
</template>

<script lang="ts">
export type Song = {
  id: number;
  name: string;
  artist: string;
  points: number;
  data: {
    source: number;
    url: string;
    thumbnailUrl: string;
    duration: number;
    currentTime: number;
    suggested: boolean;
  };
};

export type Connection = {
  admin: boolean;
  roomId: number;
  songList: Song[];
  type: number;
};

export type Playing = {
  status: boolean;
  fromServer: boolean;
};

import SongList from "./SongList.vue";
import NavigationBar from "./NavigationBar.vue";
import AddSong from "./AddSong.vue";
import YoutubePlayer from "./YoutubePlayer.vue";
import SongPlayer from "./SongPlayer.vue";
import AddUser from "./AddUser.vue";
import JoinRoom from "./JoinRoom.vue";

import { mapGetters } from "vuex";
import { Component, Prop, Vue } from "vue-property-decorator";

declare module "vue/types/vue" {
  interface Vue {
    sockets: any;
  }
}

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    sockets?: any;
  }
}

@Component<Partybox>({
  components: {
    SongList,
    NavigationBar,
    AddSong,
    YoutubePlayer,
    SongPlayer,
    AddUser,
    JoinRoom
  },
  sockets: {
    addSong: function(song: Song) {
      this.songlist.push(song);
      this.songlist.reverse();
      if (
        this.songlist.length === 1 &&
        (this.nowPlaying.id === -1 || !this.playing)
      ) {
        this.$store.commit("nowPlaying", this.songlist[0]);
        this.songlist.pop();
        this.$socket.emit("nowPlaying", {
          song: song,
          roomId: this.connection.roomId
        });
      }
    },
    nowPlaying: function(nowPlaying: Song) {
      this.$store.commit("nowPlaying", nowPlaying);
      this.songlist.forEach((song: Song, index: number) => {
        if (song.id === nowPlaying.id) {
          this.songlist.splice(index, 1);
        }
      });
    },
    isPlaying: function(isPlaying: boolean) {
      this.$store.commit("playing", { status: isPlaying, fromServer: true });
    }
  },
  computed: {
    ...mapGetters(["nowPlaying", "connection", "playing", "currentTime"])
  },
  watch: {
    nowPlaying: function() {
      if (this.nowPlaying) {
        switch (this.nowPlaying.data.source) {
          case 0:
            this.showYoutubePup = true;
            break;
          default:
            break;
        }
      }
    },
    playing: function() {
      if (!this.playing.fromServer) {
        this.$socket.emit("isPlaying", {
          roomId: this.connection.roomId,
          isPlaying: this.playing.status
        });
      }
      if (this.playing.status) {
        this.playerPlay();
      } else {
        this.playerPause();
      }
    }
  }
})
export default class Partybox extends Vue {
  // Types for store.
  nowPlaying!: Song;
  connection!: Connection;
  playing!: Playing;
  currentTime!: number;

  public showAddSongPup = false;
  public showYoutubePup = false;
  public showAddUserPup = false;
  public showJoinCollabPup = false;
  public songlist: Song[] = [];
  public currentT = 0;

  private mounted() {
    this.songlist = this.connection.songList;
    if (
      this.nowPlaying.data.duration === 0 &&
      this.currentTime === 0 &&
      this.connection.type === 1
    ) {
      if (this.songlist.length > 0 && !this.playing) {
        let song = this.getSortedList()[0];
        this.$store.commit("nowPlaying", song);
        this.songlist.forEach((song, index) => {
          if (song.id === this.nowPlaying.id) {
            this.songlist.splice(index, 1);
          }
        });
        this.$socket.emit("nowPlaying", {
          song: song,
          roomId: this.connection.roomId
        });
      }
    }
  }

  private event(event: string) {
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
  }

  private closeSongPup() {
    this.showAddSongPup = false;
  }

  private closeYoutubePup() {
    this.showYoutubePup = false;
    this.$refs.player.ended();
  }

  private closeUserAddPup() {
    this.showAddUserPup = false;
  }

  private addSong(song: Song) {
    this.showAddSongPup = false;
    song.data.suggested = false;
    song.id = Date.now();
    this.$socket.emit("addSong", {
      song: song,
      roomId: this.connection.roomId
    });
    this.songlist.push(song);
    this.songlist.reverse();
    if (
      this.songlist.length === 1 &&
      (this.nowPlaying.id === -1 || !this.playing) &&
      this.connection.admin
    ) {
      this.$store.commit("nowPlaying", this.songlist[0]);
      this.songlist.pop();
      this.$socket.emit("nowPlaying", {
        song: song,
        roomId: this.connection.roomId
      });
    }
  }

  private pause() {
    this.$refs.player.paused();
  }

  private end() {
    this.$refs.player.ended();
    this.showYoutubePup = false;
    if (this.songlist.length > 0) {
      switch (this.getSortedList()[0].data.source) {
        case 0:
          this.$store.commit("nowPlaying", this.getSortedList()[0]);
          if (this.connection.type === 1) {
            this.$socket.emit("nowPlaying", {
              roomId: this.connection.roomId,
              song: this.nowPlaying
            });
          }
          this.showYoutubePup = true;
          break;
        default:
          break;
      }
      this.songlist.forEach((song, index) => {
        if (song.id === this.nowPlaying.id) {
          this.songlist.splice(index, 1);
        }
      });
    } else {
      let nowPlaying = this.nowPlaying;
      nowPlaying.data.duration = 0;
      nowPlaying.data.currentTime = 0;
      this.$store.commit("nowPlaying", nowPlaying);
    }
  }

  private seekTo(newPos: number) {
    if (this.connection.data.type !== 1) {
      this.$refs.player.setPosition(newPos);
    }
  }

  private time(time: number) {
    this.currentT = time;
  }

  private playerPlay() {
    switch (this.nowPlaying.data.source) {
      case 0:
        this.showYoutubePup = true;
        if (this.$refs.youtube) {
          this.$refs.youtube.playVideo();
        }
        break;
      default:
        break;
    }
  }

  private playerPause() {
    switch (this.nowPlaying.data.source) {
      case 0:
        if (this.$refs.youtube) {
          this.$refs.youtube.pauseVideo();
        }
        break;
      default:
        break;
    }
  }

  private playerEnd() {
    switch (this.nowPlaying.data.source) {
      case 0:
        if (this.$refs.youtube) {
          this.$refs.youtube.stopVideo();
        }
        this.end();
        break;
      default:
        break;
    }
  }

  private playerSeekTo(position: number) {
    switch (this.nowPlaying.data.source) {
      case 0:
        if (this.connection.data.type !== 1) {
          this.$refs.youtube.seekTo(position);
        }
        break;
      default:
        break;
    }
  }

  //Experiemental collab mode
  private connected(response: {
    status: number;
    data: {
      isPlaying: boolean;
      nowPlaying: Song;
      roomId: string;
      songs: Song[];
      type: number;
    };
  }) {
    if (response.status === 200) {
      this.$store.commit("connection", {
        admin: true,
        roomId: response.data.roomId,
        songList: response.data.songs,
        type: response.data.type
      });
      this.$store.commit("nowPlaying", response.data.nowPlaying);
      this.songlist = response.data.songs.reverse();
    }
  }

  private getSortedList(): Song[] {
    this.songlist = this.getSongListSortedByDate();
    this.songlist.sort(function(first: Song, second: Song) {
      let pointsFirst = first.points;
      let pointsSecond = second.points;
      return pointsFirst < pointsSecond
        ? -1
        : pointsFirst > pointsSecond
        ? 1
        : 0;
    });
    this.songlist.reverse();
    return this.songlist;
  }

  private getSongListSortedByDate(): Song[] {
    this.songlist.sort(function(first: Song, second: Song) {
      let pointsFirst = first.id;
      var pointsSecond = second.id;
      return pointsFirst < pointsSecond
        ? -1
        : pointsFirst > pointsSecond
        ? 1
        : 0;
    });
    this.songlist.reverse();
    return this.songlist;
  }
}
</script>

<style>
html {
  height: 100%;
  overflow-x: hidden;
}
body {
  margin: 0px;
  background-color: lavender;
  background-image: url("../assets/background-party-compressed.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  height: calc(100vh - 40px - 13vh);
  max-height: 100vh;
  max-width: 100vw;
}
</style>