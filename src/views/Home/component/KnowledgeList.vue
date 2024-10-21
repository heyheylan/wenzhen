<script setup lang="ts">
import KnowledgeCard from './KnowledgeCard.vue'
import {ref} from  'vue'
import type { KnowledgeList, KnowledgeParams,KnowledgeType} from '@/types/consult'
import {getKnowledgePage} from '@/apis/consult'



const list = ref<KnowledgeList>([])
const loading = ref(false)
const finished = ref(false)
//获取类型
const props = defineProps<{
  type: KnowledgeType
}>()
//请求参数
const params = ref<KnowledgeParams>({
  type: props.type,
  current: 1,
  pageSize: 10
})

//加载数据函数
const onLoad = async () =>{
  //加载数据
  // console.log('loading')

  const res = await getKnowledgePage(params.value)
  console.log(res.data.rows)
  list.value.push(...res.data.rows)
  //大于总数停止加载
  if(params.value.current * params.value.pageSize >= res.data.total){
    finished.value = true
    // console.log('finished')
  }else {
    params.value.current++
  }
  loading.value = false
}


</script>

<template>
  <div class="knowledge-list">
    <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
    >
    <knowledge-card v-for="item in list" :key="item.id" :item="item"></knowledge-card>
      <div v-if="finished" class="van-list__finished-text">没有更多了</div>
      <div v-if="list.length && finished === false" class="van-list__finished-text">
        <van-loading size="16px">加载中...</van-loading></div>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
  height: auto;
}
</style>