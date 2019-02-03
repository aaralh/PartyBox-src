<template>
  <div>
    <div class="menu-item" v-on:click="clicked(item)">
      <div class="menu-item-label">{{ item.label }}</div>
      <div class="menu-item-icon">
        <i :class="item.icon"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  props: {
    item: {}
  }
})
export default class MainMenuItem extends Vue {
  public clicked(item: { id: number; label: string; icon: string }) {
    this.$emit("clicked", item);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.menu-item {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  width: 95%;
  padding-left: 10px;
  padding-right: 5px;
  height: 4vh;
  cursor: pointer;
  font-size: 3vh;
  padding-bottom: 0.7vh;
  border-bottom: 1px solid #9c9c9c;
}

.menu-item:hover {
  background-color: #767ed1;
}

.menu-item-label {
  float: left;
  width: 90%;
  text-align: start;
  transform: translateY(15%);
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}

.menu-item-icon {
  float: right;
  margin-left: 5px;
  transform: translateY(15%);
}

@media only screen and (min-device-width: 320px) and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait) {
  .menu-item {
    padding-top: 1vh;
    padding-bottom: 1.5vh;
  }
}

@media only screen and (min-width: 600px) {
  .menu-item {
    font-size: 16px;
  }
}
</style>