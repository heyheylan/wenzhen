<script setup lang="ts">
import ConsultList from '@/views/User/components/ConsultList.vue'
import {ConsultType} from "@/enums";
import {useRoute} from "vue-router";
const route = useRoute()
const query = route.query.fromuser //获取参数值

</script>



<template>
  <div class="consult-page">
    <cp-nav-bar :LeftTo=" query ? '/user' :  '/consult/fast'" :arrow="true" title="问诊记录" />
    <van-tabs sticky>
      <van-tab title="极速问诊"><consult-list :type="ConsultType.Fast" /></van-tab>
      <van-tab title="找医生"><consult-list :type="ConsultType.Doctor" /></van-tab>
      <van-tab title="开药问诊"><consult-list :type="ConsultType.Medication" /></van-tab>
    </van-tabs>
  </div>
</template>

<style lang="scss" scoped>
.consult-page {
  padding-top: 46px;
  background-color: var(--cp-bg);
  min-height: calc(100vh - 46px);
}
</style>