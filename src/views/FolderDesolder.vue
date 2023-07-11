<template>
  <div class="FC JC AC home height100">
    <div v-if="!loading" class="C87 abs FC JC AC" style="top: 80px">
      <h2>폴더 내부에 있는 파일들의 이름이 폴더 구조가 포함된 이름으로!</h2>
    </div>
    <div v-if="loading" class="FC JC AC img-box">
      <img :src="require(`@/assets/loading.png`)" />
      <h1 class="C87">바꾸는 중!</h1>
      <h1 class="C87">프로그램 끄면 바뀌다 맙니다잉~</h1>
    </div>
    <div v-else-if="showResult && !result" class="FC JC AC img-box">
      <img :src="require(`@/assets/fail.png`)" />
      <h1 class="C87">실패했다우,,,</h1>
    </div>
    <div v-else-if="showResult && result" class="FC JC AC img-box">
      <img :src="require(`@/assets/success.png`)" />
      <h1 class="C87">성공했다우!</h1>
    </div>

    <div v-else class="FC AC JC">
      <div class="FR AC JC">
        <div class="FC AC JC drag pointer" id="drag-folder">
          <h3 class="C87">폴더 드래그 드랍!</h3>
          <h2 class="C87">Folder</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
const { ipcRenderer } = window.require("electron");
export default class FolderDesolder extends Vue {
  loading = false;
  showResult = false;
  result = true;

  dragFolderElement: any = null;
  dragFileElement: any = null;

  folderHandler() {
    this.dragFileElement = null;
    this.dragFolderElement = document.getElementById("drag-folder");
    this.dragFolderElement.ondragover = () => {
      return false;
    };
    this.dragFolderElement.ondragleave = () => {
      return false;
    };
    this.dragFolderElement.ondragend = () => {
      return false;
    };
    this.dragFolderElement.ondrop = async (e: any) => {
      e.preventDefault();
      this.loading = true;
      const rootFilePath = e.dataTransfer.files[0]?.path;
      this.result = await ipcRenderer.invoke("convertFolderImage", {
        path: rootFilePath,
      });
      this.showResult = true;
      this.loading = false;
      setTimeout(() => {
        this.showResult = false;
        setTimeout(() => {
          this.folderHandler();
        }, 0);
      }, 5000);
      return;
    };
  }

  mounted() {
    this.folderHandler();
  }
}
</script>

<style scoped>
.home {
  background: #c83001;
}
input[type="range"] {
  -webkit-appearance: none;
  margin-right: 15px;
  width: 200px;
  height: 7px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 5px;
  cursor: pointer;
  background-size: 70% 100%;
  background-repeat: no-repeat;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #ff4500;
  cursor: pointer;
  box-shadow: 0 0 2px 0 #555;
  transition: background 0.3s ease-in-out;
}
/* input[type="range"]::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  box-shadow: none;
  border: none;
  background: transparent;
} */
.img-box {
  height: 240px;
}
.drag {
  border: 2px dashed #fff;
  height: 150px;
  width: 350px;
  border-radius: 5px;
  margin-left: 10px;
  margin-right: 10px;
}
.drag.active {
  border: 2px solid #fff;
}
.drag .icon {
  font-size: 100px;
  color: #fff;
}
.drag header {
  font-size: 30px;
  font-weight: 500;
  color: #fff;
}
.drag span {
  font-size: 25px;
  font-weight: 500;
  color: #fff;
  margin: 10px 0 15px 0;
}
.drag button {
  padding: 10px 25px;
  font-size: 20px;
  font-weight: 500;
  border: none;
  outline: none;
  background: #fff;
  color: #5256ad;
  border-radius: 5px;
  cursor: pointer;
}
.drag img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 5px;
}
</style>
