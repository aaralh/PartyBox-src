<template>
  <div class="create_room_container" v-on:click="close">
    <div class="create_room" v-on:click.stop>
      <div class="create_room__label">Create Room</div>
      <div v-if="false" class="create_room__content_providers">
        <div class="select_item" v-for="item in supportedProviders" :key="item.id">
          <input type="checkbox" :id="item.id" :value="item" v-model="selectedProviders">
          <label :for="item.id">{{ item.label }}</label>
        </div>
      </div>
      <div class="create_room_settings">
        <div class="settings_item" v-for="item in settings" :key="item.id">
          <div class="settings_label">{{ item.label }}</div>
          <label class="switch">
            <input type="checkbox" :id="item.id" :value="item.value" v-model="item.value">
            <span class="slider round"></span>
          </label>
        </div>
      </div>
      <div class="bottom_buttons" role="group" id="toolBtns">
        <button
          role="button"
          class="btn btn-lg btn-primary bottom_buttons_cancel"
          v-on:click="close"
        >Cancel</button>
        <div class="create_button_container">
          <button
            role="button"
            class="btn btn-lg btn-primary bottom_buttons_create"
            v-on:click="create"
          >Create</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { RoomSettings } from "@/components/Frontpage.vue";

@Component
export default class CreateRoom extends Vue {
  public supportedProviders = [{ id: 1, label: "YouTube" }];
  public settings: RoomSettings[] = [
    {
      id: 0,
      label: "Collaboration mode",
      value: false
    } /*, {id: 1, label: "Song recommendations", value: true}*/
  ];
  public selectedProviders = [];

  public constructor() {
    super();
  }

  public close() {
    this.$emit("close");
  }

  public create() {
    this.$emit("create_room", this.settings);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.create_room_container {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.create_room {
  position: absolute;
  height: 50vh;
  width: 80%;
  background-color: #cccccc;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  max-height: 200px;
  min-height: 180px;
  max-width: 400px;
}

.create_room__label {
  font-size: 25px;
  font-weight: bold;
}

.select_item {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.create_room_settings {
  width: 90%;
}

.settings_item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0;
}

.settings_label {
  font-size: large;
}

/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  display: none;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e2e1e1;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 24px;
  width: 24px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
  height: 32px;
}

.slider.round:before {
  border-radius: 50%;
}

.bottom_buttons {
  position: relative;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 100%;
}

.create_button_container {
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

.bottom_buttons_create {
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
</style>