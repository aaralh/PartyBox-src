<template>
<div class="add_user_container" v-on:click="close">
  <div class="add_user" v-on:click.stop>
    <div class="panel_header">Invite friends to party by sharing room code!
    </div>

    <div class="field_button_container">
      <input :value="connection.roomId" class="roomId_field" type="text" disabled="disabled">
      <button class="copy_to_clipboard" v-on:click="CopyTextToClipboard">Copy</button>
    </div>
    <button class="close_panel" v-on:click="close">Close</button>
  </div>
</div>
</template>

<script lang="ts">

import { mapGetters } from 'vuex'
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
    computed: {
    ...mapGetters({
      connection: 'connection',
    })
  },
})
export default class AddUser extends Vue {
    public close() {
      this.$emit("close");
    };

    public CopyTextToClipboard() {
      var textArea = document.createElement("textarea");
      textArea.value = (this as any).connection.roomId;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        var successful = document.execCommand("copy");
        var msg = successful ? "successful" : "unsuccessful";
      } catch (err) {
        console.error("Unable to copy", err);
      }

      document.body.removeChild(textArea);
    }

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.add_user_container {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
}

.add_user {
  position: absolute;
  height: 27vh;
  width: 80%;
  background-color:  #cccccc;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
  width: 150px;
  border-radius: 5px 0px 0px 5px;
  padding-top: 5px;
  font-size: 19px;
  border: none;
  border: 1px solid #e6e6e6;
}
.copy_to_clipboard {
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
}

.copy_to_clipboard:active {
  background-color:  #666666;
  color: whitesmoke;
}

.field_button_container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
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
  margin-top: 10px;
  margin-bottom: 25px;
}

@media only screen and (min-width: 600px) {
  .add_user {
    width: 50%;
    height: 17vh;
  }

  .close_panel {
    margin-top: 25px;
  }
}
</style>