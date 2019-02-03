<template>
	<div id="frontpage">
		<div class="navbar">
		<div class="logo-container">
			<img href="./index.html" class="logo" src="../assets/partybox-logo.svg" alt="Partybox logo">
			<div class="top-right">beta</div>
		</div>
		<div class="party-tab active">
			<div class="tab-content">Party</div>
		</div>
		</div>
		<a href="./index.html" class="button"></a>
		<div class="content">
		<div class="host_container">
			<button v-on:click="createPartyPupShow = true" id="host" class="host_party">
			<div class="image_overlay">
				<div class="image_text">Host party?</div>
			</div>
			</button>
		</div>
		<div class="join_container" v-on:click.stop>
			<button class="join_party" v-on:click="joinPartyPupShow = true">
			<div class="image_overlay">
				<div class="image_text">Join party?</div>
			</div>
			</button>
		</div>
		<join-party
			v-on:connected="connected"
			v-on:close="joinPartyPupShow = false"
			v-if="joinPartyPupShow"
		></join-party>
		<create-party
			v-on:close="createPartyPupShow = false"
			v-on:create_room="hostParty"
			v-if="createPartyPupShow"
		></create-party>
		</div>
	</div>
</template>

<script lang="ts">
import JoinParty from "./JoinRoom.vue";
import CreateParty from "./CreateRoom.vue";
import { saveRoomData } from "../IDBHandler";

import { Component, Prop, Vue } from "vue-property-decorator";

declare module "vue/types/vue" {
  interface Vue {
    sockets: any;
    $socket: any;
  }
}

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    sockets?: any;
    $socket?: any;
  }
}

export type RoomSettings = {
  id: number;
  label: string;
  value: boolean;
};

@Component({
  components: {
    JoinParty,
    CreateParty
  },
  sockets: {
    connect: function(): void {
      console.info("Connected to server");
    },
    created: function(data: any): void {
      this.$store.commit("connection", {
        admin: true,
        roomId: data.roomId,
        songList: [],
        type: data.type
      });
      this.$router.replace({ name: "partybox" });
      saveRoomData({ roomId: data.roomId, type: data.type, admin: true });
    }
  }
})
export default class Frontpage extends Vue {
  public joinPartyPupShow = false;
  public createPartyPupShow = false;
  public host = false;

  public constructor() {
    super();
  }

  mounted() {
    this.setContentSize();
    let indexedDB =
      window.indexedDB ||
      (window as any).mozIndexedDB ||
      (window as any).webkitIndexedDB ||
      (window as any).msIndexedDB ||
      (window as any).shimIndexedDB;

    // Open (or create) the database
    let open = indexedDB.open("PartyboxDB", 4);
    let parentScope = this;
    open.onsuccess = function() {
      // Start a new transaction
      let db = open.result;
      let tx = db.transaction("PartyboxStore", "readwrite");
      let store = tx.objectStore("PartyboxStore");
      let index = store.index("NameIndex");

      // Query the data
      let getRoomData = store.get(1);

      getRoomData.onsuccess = function() {
        let roomData = getRoomData.result.data;
        parentScope.connectRoom(roomData.roomId);
        parentScope.host = roomData.admin;
      };

      // Close the db when the transaction is done
      tx.oncomplete = function() {
        db.close();
      };
    };
  }
  setContentSize() {
    let innerHeight = window.innerHeight;
    let contentEl = document.getElementsByClassName("content");
    contentEl[0].setAttribute(
      "style",
      `max-height: calc(${innerHeight}px - 80px);`
    );
  }

  connectRoom(roomId: any) {
    this.$socket.on("connected", this.connectionHandler);
    this.$socket.emit("connectRoom", { roomId: roomId });
  }
  connectionHandler(data: any) {
    this.$socket.removeAllListeners("room info");
    if (data.status.code === 200) {
      this.connected({
        status: data.status.code,
        data: {
          roomId: data.room.roomId,
          type: data.room.type,
          songs: data.room.songs,
          nowPlaying: data.room.nowPlaying
        }
      });
    } else {
      this.joinPartyPupShow = true;
    }
  }
  hostParty(settings: RoomSettings[]) {
    let item = settings.find(item => item.id === 0);
    let type = item!.value ? 1 : 0;
    this.$socket.emit("create room", type);
  }
  connected(data: any) {
    if (data.status === 200) {
      let admin = data.data.type === 1 ? true : this.host;
      this.$store.commit("connection", {
        admin: admin,
        roomId: data.data.roomId,
        songList: data.data.songs,
        type: data.data.type
      });
      this.$store.commit("nowPlaying", data.data.nowPlaying);
      saveRoomData({
        roomId: data.data.roomId,
        type: data.data.type,
        admin: admin
      });
      this.$router.replace({ name: "partybox" });
    }
  }
}
</script>

<style scoped>
#fronpage {
  max-height: 100vh;
}

.join_container,
.host_container {
  height: 50%;
}

.front {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #673ab7;
  color: white;
}

.back {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffc107;
  color: white;
}

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

button {
  padding: 0;
  border: 0;
}

.navbar {
  position: relative;
  top: 0;
  left: 0;
  height: 4vh;
  min-height: 80px;
  width: 100%;
  background-color: whitesmoke;
  z-index: 1;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
}

.party-tab {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  transition: background-color 0.3s;
  color: #333333;
}

.party-tab.active {
  border-bottom: 3px solid orange;
  height: calc(100% - 3px);
}

.party-tab:hover {
  background-color: #d9d9d9;
  color: black;
  cursor: pointer;
}

.tab-content {
  padding: 10px 20px;
}

.content {
  position: relative;
  display: flex;
  flex-basis: 50%;
  height: calc(100vh - 80px);
  width: 100%;
  background: whitesmoke;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.party_button {
  position: relative;
  height: 40px;
  margin: 6px 0 6px 0;
  width: 80px;
  transition: background-color 0.2;
  background-color: #737373;
}

.party_button:hover {
  background-color: #595959;
}

.logo {
  height: 100%;
}

.logo-container {
  height: 100%;
}

.top-right {
  position: absolute;
  left: 188px;
  top: 15px;
  color: #4d4d4d;
}

.logo:hover {
  cursor: pointer;
}

.party_buttons {
  display: flex;
  width: 20%;
  float: right;
  height: 50px;
  flex-direction: row;
  justify-content: center;
}

.host_party {
  flex: 1;
  width: 100%;
  height: 100%;
  background-color: whitesmoke;
  background-image: url(../assets/host_party_compressed.jpeg);
  background-size: cover;
  background-repeat: no-repeat;
  transition: transform 0.3s, height 0.2s;
}

.host_party:hover {
  transform: scale(1.01);
  -moz-transform: scale(1.01);
  -webkit-transform: scale(1.01);
}

.party_info {
  width: 100%;
  height: 300px;
  background-color: white;
}

.join_party {
  flex: 1;
  width: 100%;
  height: 100%;
  background-color: whitesmoke;
  background-image: url(../assets/join_party_compressed.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  transition: transform 0.3s, height 0.2s;
}

.join_party:hover {
  transform: scale(1.01);
  -moz-transform: scale(1.01);
  -webkit-transform: scale(1.01);
}

.image_overlay {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #0003;
}

.image_text {
  font-size: 5em;
  font-family: "Open Sans", sans-serif;
  color: #fafafa;
  text-shadow: 0 0 1rem black;
}

.label {
  margin-top: 14px;
  font-family: sans-serif;
  color: #bfbfbf;
}

#join,
#host {
  width: 100%;
}

.join_container,
.host_container {
  flex: 1;
  height: 100%;
  width: 100%;
}

@media only screen and (min-width: 800px) {
  .content {
    flex-direction: row;
    flex-basis: 100%;
  }

  .host_container {
    height: 100%;
  }

  .join_container {
    height: 100%;
  }
}
@media only screen and (max-width: 800px) {
  .content {
    flex-direction: column;
    flex-basis: 100%;
  }

  .host_container {
    height: 50%;
  }

  .join_container {
    height: 50%;
  }
}
/* Landscape for iphones*/
@media only screen and (min-device-width: 320px) and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: landscape) {
  .content {
    flex-direction: row;
    flex-basis: 100%;
  }

  .host_container {
    height: 100%;
  }

  .join_container {
    height: 100%;
  }
  .host_party:hover {
    transform: scale(1);
    -moz-transform: scale(1);
    -webkit-transform: scale(1);
  }
  .join_party:hover {
    transform: scale(1);
    -moz-transform: scale(1);
    -webkit-transform: scale(1);
  }
}

/* Portrait for iphones*/
@media only screen and (min-device-width: 320px) and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait) {
  .content {
    flex-direction: column;
    flex-basis: 50%;
  }

  .host_container {
    height: 50%;
  }

  .join_container {
    height: 50%;
  }
  .host_party:hover {
    transform: scale(1);
  }
  .join_party:hover {
    transform: scale(1);
    -moz-transform: scale(1);
    -webkit-transform: scale(1);
  }
}
</style>