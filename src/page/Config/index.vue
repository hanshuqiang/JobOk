<template>
    <div style="margin: 10px;">
        <a-form :model="form">
            <a-form-item label="mpt">
                <a-input v-model.trim="form.mpt" />
            </a-form-item>

            <a-form-item label="wt2">
                <a-input v-model.trim="form.wt2" />
            </a-form-item>

            <a-form-item label="zp_product_id">
                <a-input v-model.trim="form.zp_product_id" />
            </a-form-item>




            <a-form-item>
                <a-space>
                    <a-button @click="handleSave">保存</a-button>
                    <a-button @click="handleClose('')">关闭</a-button>
                </a-space>

            </a-form-item>
        </a-form>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { ref } from 'vue'
const form = ref<any>({})
async function handleClose(msg:String) {
    let params = {
        type: 'success',
        content: msg || ''
    }
    await window.ipcRenderer.invoke('close-modal', msg ? JSON.stringify(params) : '')


    window.close()
}
async function handleSave() {
    let res = await window.ipcRenderer.invoke('account-save', JSON.stringify(form.value));
    console.log('res', res);
    handleClose('操作成功')
}
async function handleGet() {
    let res = await window.ipcRenderer.invoke('account-get', '');
    console.log('获取数据', res);
    return res
}
onMounted(async () => {
    let res = await handleGet()
    form.value = res
})
</script>