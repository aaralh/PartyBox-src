<template>
  <div class="youtube">
    <div class="video_inputs">
      <div class="video_url video_input">
        <div class="video_input_title">Url*:</div>
        <input class="video_url_input" v-model="url" placeholder="Url of the video">
      </div>
      <div class="error_message">{{ errorMsg }}</div>
      <div class="required_fields">*required field</div>
    </div>
      <div class="bottom_buttons" role="group" id="toolBtns">
        <button role="button" class="btn btn-lg btn-primary bottom_buttons_cancel" v-on:click="close"> Cancel </button>
        <div class="add_button_container">
          <button role="button" class="btn btn-lg btn-primary bottom_buttons_add" v-on:click="add"> <div v-if="!showLoader">Add</div> <div v-if="showLoader" class="lds-ring"><div></div><div></div><div></div><div></div></div> </button>       
        </div>
      </div>
  </div>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({

})
export default class YoutubeComponent extends Vue {
  public url = "";
  public errorMsg = "";
  public showLoader = false;

  public close() {
    this.errorMsg = "";
    this.$emit("close");
  };

  public add() {
    this.showLoader = true;
    this.errorMsg = "";
    let videoData = this.getVideoId(this.url);
    if(videoData.status === 200) {
      let videoId = videoData.videoId;
      this.$socket.on('videoInfo', this.addVideo);
    } else {
      this.errorMsg = videoData.msg!;
      this.showLoader = false;
    }
  };

  public getVideoId(url: string) {
    let regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = url.match(regExp);
    if (match && match[2].length == 11) {
      this.$socket.emit('getVideoInfo', match[2]);
      return {status: 200, videoId: match[2]};
    } else {
      return {status: 404, msg: "Url is not real video url!"};
    }
  };

  public getVideoThumbnail(videoId: string) {
    let url = `https://img.youtube.com/vi/${videoId}/default.jpg`
    return url;
  };

  public addVideo(data: {status: number, title: string, owner: string, videoId: string}) {
    this.$socket.removeAllListeners("videoInfo");
    this.showLoader = false;
    if(data.status === 200) {
      this.$emit("add", {
          id: -1,
          name: data.title,
          artist: data.owner,
          points: 0,
          data: { source: 0, url: data.videoId, thumbnailUrl: this.getVideoThumbnail(data.videoId), duration: 0, currentTime: 0 }
        });
    }
  }

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.lds-ring {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 17px;
  height: 17px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 22px;
  height: 22px;
  border: 6px solid #fff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fff transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}


.youtube {
  max-height: 55vh;
  width: 100%;
  background-color: inherit;
  padding-top: 20px;
}

.required_fields {
  text-align: start;
  width: 100%;
  margin-left: 10%;
  font-size: 13px;
}

.video_input_title {
  text-align: start;
  margin-left: 3%;
  font-size: 16px;
}

.video_inputs {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.video_url_input  {
  width: 95%;
  height: 50%;
  border-radius: 5px;
}

.video_input {
  width: 95%;
  height: 50px;
  margin-bottom: 10px;
}

.bottom_buttons {
  position: relative;
  top: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.add_button_container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.bottom_buttons_cancel {
  height: fit-content;
  padding: 10px;
  width: 80px;
  background-color: rgb(161, 160, 160);
  border: none;
  outline: none;
  cursor: pointer;
  border-radius: 15px;
  font-size: 16px;
}

.bottom_buttons_add {
  height: fit-content;
  width: 80px;
  padding: 10px;
  background-color: rgb(1, 168, 1);
  border: none;
  outline: none;
  cursor: pointer;
  border-radius: 15px;
  font-size: 16px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.error_message {
  color: red;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}
</style>