<template>
  <div class="join_room_container" v-on:click="close">
    <div class="join_room" v-on:click.stop>
      <div class="panel_header">Join party!
      </div>

      <div class="field_button_container">
        <input @keydown.enter="connectRoom" v-model="roomId" placeholder="Input party code here!" class="roomId_field" type="text">
        <button class="join_to_room" v-on:click="connectRoom">Join</button>
      </div>
      <div class="error_message">{{ errorMsg }}</div>
      <button class="close_panel" v-on:click="close">Close</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class JoinRoom extends Vue {
  public roomId: string | number = "";
  public errorMsg = "";

  public close() {
    this.$emit("close");
  };

  public connectRoom() {
    this.$socket.on("connected", this.connectionHandler);
    this.$socket.emit("connectRoom", {roomId: this.roomId});
  };

  public connectionHandler(data: any) {
    this.errorMsg = "";
    this.$socket.removeAllListeners("room info");
    if(data.status.code === 200) {
      this.$emit("connected", {status: 200, data: data.room})
      this.$emit("close");
    } else {
      this.errorMsg = data.status.msg;
      this.$emit("connected", {status: 404})
    }
  };
  
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.join_room_container {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: black;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.join_room {
  position: absolute;
  height: 27vh;
  width: 80%;
  background-color:  #cccccc;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  max-height: 190px;
  min-height: 180px;
}

.roomId_field {
  height: 25px;
  width: 75%;
  border-radius: 5px 0px 0px 5px;
  padding-top: 5px;
  font-size: 19px;
  border: none;
  border: 1px solid #e6e6e6;
}
.join_to_room {
  height: 33px;
  border-radius: 0px 5px 5px 0px;
  background-color: #9c9c9c;
  transition: background-color 0.3s;
  text-align: center;
  padding-top: 3px;
  padding-left: 10px;
  padding-right: 10px;
  cursor: pointer;
  outline: none;
  border: none;
  font-size: 20px;
}

.join_to_room:active {
  background-color:  #666666;
  color: whitesmoke;
}

.field_button_container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 90%;
}

.close_panel {
  height: 30px;
  width: 80%;
  background-color: #66ff66;
  margin-top: 30px;
  text-align: center;
  padding-top: 4px;
  border-radius: 5px;
  border: 0;
  border: 1px solid #e6e6e6;
  cursor: pointer;
  transition: background-color 0.3s;
  outline: none;
}

.close_panel:active {
  background-color: #00ff00;
}


.panel_header {
  font-size: 24px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 25px;
}

.error_message {
  color: red;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}

@media only screen and (min-width: 600px) {
  .join_room {
    width: 50%;
    height: 17vh;
  }

  .close_panel {
    margin-top: 25px;
  }
}
</style>