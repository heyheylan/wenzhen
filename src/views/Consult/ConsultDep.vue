<script setup lang="ts">
import { ref,onMounted,computed } from 'vue'
import {getAllDepAPI} from "@/apis/consult";
import type {TopDep} from "@/types/consult";
import {useConsultStore} from "@/stores";

const store = useConsultStore()

const DepList = ref<TopDep[]>([])
const SubDepList = computed(()=>{
  //根据active获取对应的数据,按需获取
  return  DepList.value[active.value]?.child
})
const getAllDep = async () => {
  const res = await getAllDepAPI()
  console.log(res)
  DepList.value = res.data
}

onMounted(()=>{
  getAllDep()
})


const active = ref(0)
</script>

<template>
  <div class="consult-dep-page">
    <cp-nav-bar :LeftTo="'/consult/fast'" :arrow="true" title="选择科室" />
    <div class="wrapper">
      <van-sidebar v-model="active">
        <van-sidebar-item :title="item.name"
         v-for="item in DepList"
         :key="item.id"
         :name="item.id"
        />
      </van-sidebar>
      <div class="sub-dep">
        <router-link to="/consult/illness"
         v-for="item in SubDepList"
         :key="item.id"
         @click="store.setDep(item.id)">{{ item.name }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.van-sidebar {
  width: 114px;
  &-item {
    padding: 14px;
    color: var(--cp-tag);
    &--select {
      color: var(--cp-main);
      font-weight: normal;
      &::before {
        display: none;
      }
    }
  }
}
.consult-dep-page {
  padding-top: 46px;
  .wrapper {
    height: calc(100vh - 46px);
    overflow: hidden;
    display: flex;
    .sub-dep {
      flex: 1;
      height: 100%;
      overflow-y: auto;
      > a {
        display: block;
        padding: 14px 30px;
        color: var(--cp-dark);
      }
    }
  }
}
</style>