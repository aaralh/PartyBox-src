<template>
  <div>
    <div id="youtube_player_container" class="player_container" v-on:click.stop>
      <youtube
        class="youtube_player"
        :video-id="videoId"
        ref="youtube"
        @playing="playing"
        :player-vars="playerVars"
        @paused="paused"
        @ended="ended"
      ></youtube>
      <div class="close_button" v-on:click.stop="close">
        <i class="fas fa-times"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component<YoutubePlayer>({
  props: {
    song: Object
  },
  data() {
    return {
      videoId: this.$props.song.data.url,
      playerVars: {
        playsinline: 1,
        controls: 0,
        autoplay: 0
      }
    };
  },
  computed: {
    ...mapGetters({
      nowPlaying: "nowPlaying",
      isPlaying: "playing",
      connection: "connection"
    }),
    player() {
      return this.$refs.youtube.player;
    }
  },
  watch: {
    nowPlaying: function() {
      if ((this as any).nowPlaying.data.source === 0) {
        (this as any).videoId = (this as any).nowPlaying.data.url;
        this.$refs.youtube.updatePlayer((this as any).nowPlaying.data.url);
        (this as any).playVideo();
      }
    },
    isPlaying: function() {
      if ((this as any).isPlaying.status) {
        (this as any).playVideo();
      } else {
        (this as any).pauseVideo();
      }
    }
  }
})
export default class YoutubePlayer extends Vue {
  public intervalKey: number | null = null;
  public checkSeekPeriod = 1000;
  public checkSeekMargin = 2000;
  public prevCurrentTime = 0;

  mounted() {
    this.playVideo();
    this.dragElement(document.getElementById("youtube_player_container")!);
  }

  public playVideo() {
    (this as any).player.playVideo();
    (this as any).player.getDuration().then((duration: number) => {
      (this as any).player.getCurrentTime().then((current: number) => {
        let nowPlaying = (this as any).nowPlaying;
        nowPlaying.data.duration = duration;
        nowPlaying.data.currentTime = current;
        nowPlaying.data.source = 0;
        this.$store.commit("nowPlaying", nowPlaying);
        if (!(this as any).isPlaying.status) {
          this.$store.commit("playing", { status: true, fromServer: false });
        }
      });
    });
    this.checkSeek();
  }

  public stopVideo() {
    (this as any).player.stopVideo();
    if (this.intervalKey !== null) {
      clearInterval(this.intervalKey);
    }
  }
  public pauseVideo() {
    (this as any).player.pauseVideo();
    if (this.intervalKey !== null) {
      clearInterval(this.intervalKey);
    }
  }
  public playing() {
    if (!(this as any).isPlaying.status) {
      this.$store.commit("playing", { status: true, fromServer: false });
    }
    (this as any).player.getDuration().then((duration: number) => {
      (this as any).player.getCurrentTime().then((current: number) => {
        let nowPlaying = (this as any).nowPlaying;
        nowPlaying.data.duration = duration;
        nowPlaying.data.currentTime = current;
        nowPlaying.data.source = 0;
        this.$store.commit("nowPlaying", nowPlaying);
        if (!(this as any).isPlaying.fromServer) {
          if (!(this as any).isPlaying.status) {
            this.$store.commit("playing", { status: true, fromServer: false });
          }
        }
      });
    });
    this.checkSeek();
    if ((this as any).isPlaying.status) {
      this.currentUpdate();
    }
  }
  public currentUpdate() {
	  if (this.intervalKey !== null) {
		  clearInterval(this.intervalKey);
	  }
    let parentScope = this as any;
    this.intervalKey = setInterval(() => {
      parentScope.player.getCurrentTime().then((current: number) => {
        this.$store.commit("currentTime", current);
      });
    }, 1000);
  }
  public seekTo(position: number) {
    if ((this as any).connection.type !== 1) {
      (this as any).player.seekTo(position);
      let parentScope = this as any;
      setTimeout(() => {
        parentScope.player.getCurrentTime().then((current: number) => {
          parentScope.onPlayerSeekTo(current);
        }, 100);
      });
    }
  }

  public paused() {

	//TODO: Find solution for this issue when video buffering causes ws war.
	/*
	if (!(this as any).isPlaying.fromServer) {
      this.$store.commit("playing", { status: false, fromServer: false });
    } */
    if (this.intervalKey !== null) {
      clearInterval(this.intervalKey);
    }
  }

  public ended() {
    this.$store.commit("playing", { status: false, fromServer: false });
    if (this.intervalKey !== null) {
      clearInterval(this.intervalKey);
    }
    this.$emit("ended");
  }
  public close() {
    this.$emit("close");
    if (this.intervalKey !== null) {
      clearInterval(this.intervalKey);
    }
    this.$emit("ended");
    this.$store.commit("playing", { status: false, fromServer: false });
  }
  public checkSeek() {
    if ((this as any).connection.type !== 1) {
      (this as any).player.getCurrentTime().then((currentTime: number) => {
        if (this.prevCurrentTime > 0) {
          let diff = (currentTime - this.prevCurrentTime) * 1000;
          if (diff > this.checkSeekMargin) {
            this.onPlayerSeekTo(currentTime);
          }
        }
        this.prevCurrentTime = currentTime;
        let parentScope = this;
        setTimeout(function() {
          return parentScope.checkSeek();
        }, this.checkSeekPeriod);
      });
    }
  }

  public onPlayerSeekTo(current: number) {
    if ((this as any).connection.type !== 1) {
      this.$emit("seekTo", {
        position: current,
        playing: (this as any).isPlaying.status
      });
    }
  }

  public reload() {
    this.$forceUpdate();
  }

  public dragElement(elmnt: HTMLElement) {
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
      document.getElementById(elmnt.id + "header")!.onmousedown = dragMouseDown;
    } else {
      elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(event: MouseEvent) {
      event = event || window.event;
      event.preventDefault();
      pos3 = event.clientX;
      pos4 = event.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(event: MouseEvent) {
      event = event || window.event;
      event.preventDefault();
      pos1 = pos3 - event.clientX;
      pos2 = pos4 - event.clientY;
      pos3 = event.clientX;
      pos4 = event.clientY;
      elmnt.style.top = elmnt.offsetTop - pos2 + "px";
      elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
}
</script>

<style>
.close_button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  height: 40px;
  width: 40px;
  background: gray;
  border-radius: 50%;
  bottom: 3%;
  right: 3%;
  cursor: pointer;
}
.player_container {
  height: fit-content;
  max-height: 25vw;
  width: 30%;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 14%;
  left: 1%;
  cursor: pointer;
}

.youtube_player {
  pointer-events: none;
}

iframe {
  width: 100%;
  height: 100%;
}

@media only screen and (max-width: 650px) {
  .player_container {
    bottom: 3%;
  }
}

@media only screen and (min-device-width: 320px) and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait) {
  .youtube_player {
    pointer-events: initial;
  }
}
</style>