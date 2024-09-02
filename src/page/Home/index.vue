<template>
  <div style="margin: 10px;">

    <a-space >
      <a-input v-model="tableCtx.search.keyword" :style="{ width: '320px' }" :disabled="tableCtx.loading"  @press-enter="tableCtx.reload()"  placeholder="关键词" search-button />
        <a-button @click.stop="tableCtx.reload()" :disabled="tableCtx.loading">查询</a-button>
        <a-button @click="handleConfig">设置</a-button>
    </a-space>

    <a-table :loading="tableCtx.loading" :columns="tableCtx.columns" :data="tableCtx.data" style="margin-top: 10px"
      :pagination="tableCtx.pagination" @page-change="tableCtx.pageChange">
      <template #Action="{ record }">
        <a-space >
          <a-button @click="handleSendMsg(record)">chat</a-button>
        <a-button @click="handleView(record)">view</a-button>
        <a :href="`https://www.zhipin.com/job_detail/${record.jobId}.html`">go</a>
        </a-space>
       
      </template>
    </a-table>


  </div>
</template>

<script setup>
import { Message } from '@arco-design/web-vue';
import { ref } from 'vue';
async function handleSearch() {
  let params = JSON.parse(JSON.stringify(tableCtx.value.search))
  console.log('参数：', params);
  params.pageNo = tableCtx.value.pagination.pageNo.toString();
  params.pageSize = tableCtx.value.pagination.pageSize.toString();
  tableCtx.value.loading = true
  let res = await window.ipcRenderer.invoke('get-boss-list', JSON.stringify(params));
  tableCtx.value.loading = false
  console.log('返回：', res);
  if (res.bossData.code !== 0) {
    Message.error(res.bossData.message)
  } else {
    let tableData = res.bossData.zpData.list
    if (res.bossData.zpData.hasMore) {
      let total = tableCtx.value.pagination.pageNo * tableCtx.value.pagination.pageSize + 1
      tableCtx.value.pagination.total = total
    } else {
      tableCtx.value.pagination.total = tableData.length
    }
    tableCtx.value.data = tableData
  }

}
async function handlePageChange(page) {
  console.log(page);
  tableCtx.value.pagination.pageNo = page
  tableCtx.value.reload()
}

async function handleSendMsg(record) {
  console.log('record',record);
  let res = await window.ipcRenderer.invoke('send-msg-toboss', JSON.stringify({
    "jobId": record.encryptJobId,
    "lid": record.lid,
    "securityId":record.securityId,
    "entrance": "10",
    "applyJobDirectly": "0",
    "appId": "10002"
  }));
  if (res.bossData.code !== 0) {
    let message = res.bossData.message + " " + res.bossData?.zpData?.bizData?.chatRemindDialog?.content ||''

    Message.error(message)
  } 
  console.log('返回',res);
}

async function handleView(record){
  let res = await window.ipcRenderer.invoke('send-view-toboss', JSON.stringify({
    "jobId": record.encryptJobId,
    "lid": record.lid,
    "securityId":record.securityId,
    "entrance": "10",
    "applyJobDirectly": "0",
    "appId": "10002"
  }));
}

async function handleConfig(){
  // await window.ipcRenderer.invoke('account-manager');
  await window.ipcRenderer.invoke('open-win','/config');
}
const tableCtx = ref({
  columns: [

    {
      title: 'jobName',
      dataIndex: 'jobName',
    },
    {
      title: '学历',
      dataIndex: 'jobDegree',
    },
    {
      title: '工资',
      dataIndex: 'salaryDesc',
    },
    {
      title: '公司大小',
      dataIndex: 'brandScale',
    },
    {
      title: 'Boss',
      dataIndex: 'bossName',
    },

    {
      title: 'BossOnline',
      dataIndex: 'bossOnline',
    },
    {
      title: '操作',
      dataIndex: 'Action',
      slotName: 'Action'
    },
  ],
  loading:false,
  search: {},
  data: [],
  pagination: {
    total: 0,
    pageNo: 1,
    pageSize: 15,
  },
  reload: handleSearch,
  pageChange: handlePageChange,
})
</script>