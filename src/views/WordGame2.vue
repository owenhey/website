<template>
    <div class="center-main-content">
        <canvas 
            id="unity-canvas" 
            width="960" 
            height="600" 
            tabindex="-1" 
            style="width: 960px; height: 600px; background: #231F20"
        ></canvas>
    </div>
</template>
  
<script>
import '@/assets/base.css';

export default {
 name: 'WordGame2',
 mounted() {
   const script = document.createElement('script');
   script.src = 'WordGame/Builds.loader.js';
   script.onload = () => {
     this.initUnity();
   };
   document.head.appendChild(script);
 },
 
 methods: {
   initUnity() {
     if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
       const canvas = document.querySelector("#unity-canvas");
       canvas.style.width = "100%";
       canvas.style.height = "100%";
       canvas.style.position = "fixed";
     }

     createUnityInstance(document.querySelector("#unity-canvas"), {
       arguments: [],
       dataUrl: "WordGame/Builds.data.gz",
       frameworkUrl: "WordGame/Builds.framework.js.gz",
       codeUrl: "WordGame/Builds.wasm.gz",
       streamingAssetsUrl: "StreamingAssets",
       companyName: "DefaultCompany",
       productName: "word-game-mp",
       productVersion: "1.0",
     });
   }
 }
}
</script>