<template>
  <div class="song_player">
    <div class="time_line">
      <div class="current_position">{{ positionTime() }}</div>
      <input
        id="tl1"
        value="currentTime"
        v-model="position"
        type="range"
        class="range"
        step="1"
        min="0"
        :max="songDuration"
        @change="change"
        :disabled="connection.type === 1"
      >
      <div class="duration">{{ duration() }}</div>
    </div>
    <div class="controls">
      <div class="controls_previous control" :class="{ 'disabled': connection.type === 1 }">
        <button role="button" class="media_button" v-on:click="previous">
          <i class="fas fa-step-backward"></i>
        </button>
      </div>
      <div class="controls_pause control">
        <button role="button" class="media_button pause" v-on:click="playPause">
          <i v-if="!playing.status" class="fas fa-play"></i>
          <i v-if="playing.status" class="fas fa-pause"></i>
        </button>
      </div>
      <div class="controls_next control" :class="{ 'disabled': connection.type === 1 }">
        <button role="button" class="media_button" v-on:click="next">
          <i class="fas fa-step-forward"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters(["nowPlaying", "currentTime", "playing", "connection"])
  },
  watch: {
    songDuration: function() {
      (this as any).position = 0;
    },
    currentTime: function() {
      (this as any).position = (this as any).currentTime;
    }
  }
})
export default class SongPlayer extends Vue {
  public position = 0;
  public songDuration = 0;
  public durationString = "";
  public prevPosition = 0;

  public setPosition(data) {
    this.position = +data.position;
    this.playPause();
  }

  public getPosition() {
    return this.position;
  }

  public change() {
    if ((this as any).connection.type !== 1) {
      this.playPause();
      this.$emit("seekTo", this.position);
    }
  }

  public playPause() {
    if ((this as any).playing.status) {
      this.$store.commit("playing", { status: false, fromServer: false });
    } else {
      this.$store.commit("playing", { status: true, fromServer: false });
    }
  }

  public stop() {
    this.$emit("ended");
  }

  public ended() {
    this.$store.commit("playing", { status: false, fromServer: false });
    this.$store.commit("currentTime", 0);
  }

  public previous() {
    if ((this as any).connection.type !== 1) {
      this.position = 0;
      this.$emit("seekTo", this.position);
    }
  }

  public next() {
    if ((this as any).connection.type !== 1) {
      this.position = (this as any).nowPlaying.data.duration;
      this.$store.commit("playing", { status: false, fromServer: false });
      this.$emit("seekTo", this.position);
    }
  }

  public duration() {
    let time = (this as any).nowPlaying.data.duration;
    this.songDuration = time;
    let minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;
    if (!seconds) {
      seconds = 0;
    }
    let minutesString = "";
    if (minutes < 10) {
      minutesString = "0" + minutes;
    } else {
      minutesString = "" + minutes;
    }
    let secondsString = "";
    if (seconds < 10) {
      secondsString = "0" + Math.round(seconds);
    } else {
      secondsString = "" + Math.round(seconds);
    }
    let duration = `${minutesString}:${secondsString}`;
    return duration;
  }

  public positionTime() {
    let time = (this as any).currentTime;
    let minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;
    if (!seconds) {
      seconds = 0;
    }
    let minutesString = "";
    if (minutes < 10) {
      minutesString = "0" + minutes;
    } else {
      minutesString = "" + minutes;
    }
    let secondsString = "";
    if (seconds < 10) {
      secondsString = "0" + Math.round(seconds);
    } else {
      secondsString = "" + Math.round(seconds);
    }
    let duration = `${minutesString}:${secondsString}`;
    this.durationString = duration;
    if (
      this.position === (this as any).nowPlaying.data.duration &&
      this.songDuration > 1
    ) {
      this.ended();
    }
    return duration;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.song_player {
  height: 12vh;
  width: 100%;
  background: linear-gradient(to right, #cdd4eed4, #9da5fdf2);
  position: fixed;
  z-index: 2;
  top: 6vh;
  border-radius: 0px 0px 250px 250px;
  box-shadow: 1px 2px 2px #a8b3da;
  min-height: 83px;
  max-height: 90px;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}

.controls_previous {
  margin-left: 30%;
}

.controls_next {
  margin-right: 30%;
}

.controls_pause {
  margin-left: calc(20% - 75px);
  margin-right: calc(20% - 75px);
}

.current_position {
  margin-top: 5px;
  margin-left: 30px;
}

.duration {
  margin-top: 5px;
  margin-right: 30px;
}

.time_line {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.controls {
  display: inline-flex;
  position: relative;
  width: 100%;
}

.control {
  border: 1px solid black;
  border-radius: 50px;
  height: 47px;
  width: 47px;
  text-align: center;
  cursor: pointer;
  box-shadow: none;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.media_button {
  position: relative;
  font-size: 20px;
  border: none;
  outline: none;
  cursor: inherit;
  background-color: inherit;
  color: inherit;
}

.media_button.pause {
  margin-left: 0;
}

input[type="number"] {
  min-width: 15%;
  display: inline-block;
  position: absolute;
  top: 10px;
  margin-left: 5%;
  background: transparent;
  box-shadow: none;
  border: none;
  font-size: 18px;
  color: black;
  text-align: center;
}
input[type="number"] :focus,
:active {
  outline: none;
}
input[type="range"] {
  -webkit-appearance: none;
  margin-top: 2px;
  margin-left: 5px;
  margin-right: 5px;
  width: 100%;
  background: transparent;
  outline: none;
}
input[type="range"] :focus,
:active {
  outline: none;
}

input[type="range"]::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  background-color: #868686;
  height: 3px;
  position: relative;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  background: #f0f0f0;
  border: 1px solid #9e9e9f;
  outline: none;
  height: 15px;
  width: 15px;
  position: relative;
  top: -5px;
  border-radius: 50%;
}

.disabled {
  color: gray;
  border: 1px solid gray;
  cursor: auto;
}

@media only screen and (max-width: 800px) {
  .controls_previous {
    margin-left: 20%;
  }

  .controls_next {
    margin-right: 20%;
  }

  .controls_pause {
    margin-left: calc(30% - 71px);
    margin-right: calc(30% - 71px);
  }
}
</style>