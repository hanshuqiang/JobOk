<template>

  <a-layout>
    <router-view></router-view>
  </a-layout>

</template>
<script setup lang="js">
import { Message  } from '@arco-design/web-vue';
// 监听来自主进程的消息
window?.ipcRenderer?.on('main-process-message', (event, data) => {
  Message[data.type](data.content.toString())
});

</script>

<style lang="less" scoped></style>
