<script setup lang="ts">
import ConsultItem from './ConsultItem.vue'
import {ConsultType} from "@/enums";
import {getConsultOrderListAPI} from "@/apis/consult";
import type{ ConsultOrderListParams, ConsultOrderPage,ConsultOrderItem} from "@/types/consult";
import {ref} from "vue";
import {idCardRules} from "@/utils/rules";

const props = defineProps<{
  type: ConsultType
}>()
//参数
const params = ref<ConsultOrderListParams>({
  current: 1,
  pageSize: 5,
  type: props.type
})

const loading = ref(false)
const finished = ref(false)
const list = ref<ConsultOrderItem[]>([])
const onLoad = async ()=>{
  const res = await getConsultOrderListAPI(params.value)
  console.log('加载：' ,res)
  list.value.push(...res.data.rows)
  if(params.value.current < res.data.pageTotal){
    params.value.current++
  }else{
    finished.value = true
  }
  loading.value = false
}
//emit事件删除订单
const onDelete = (id:string) =>{
  list.value = list.value.filter((item)=> item.id !== id)
  if(!list.value.length) onLoad()
}
</script>

<template>
  <div class="consult-list">
    <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad">
      <consult-item @on-delete="onDelete" v-for="item in list" :key="item.id" :item="item" />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.consult-list {
  padding: 10px 15px;
}
</style>