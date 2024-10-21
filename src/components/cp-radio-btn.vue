<script setup lang="ts">
import {defineProps,ref,defineEmits} from 'vue'

defineProps<{ options:{
  label: string,
  value: string | number
  }[]
  modelValue?: string | number}>()

//声明emit类型
type EmitType = {
  (e:'update:modelValue',value:string|number):void
}

const emit = defineEmits<EmitType>()

const toggleItem = (value:string | number) =>{
  //自定义事件触发父组件
  emit('update:modelValue',value)
  console.log(value)
}
</script>

<template>
  <div class="cp-radio-btn">
    <!--选择根据特定对象渲染,包括值和label-->
    <a class="item" href="javascript:;" v-for="item in options" :key="item.value"  :class="{ active: modelValue === item.value }"
    @click="toggleItem(item.value)"
    >
      {{ item.label }}
    </a>
  </div>
</template>

<style lang="scss" scoped>
.cp-radio-btn {
  display: flex;
  flex-wrap: wrap;
  .item {
    height: 32px;
    min-width: 60px;
    line-height: 30px;
    padding: 0 14px;
    text-align: center;
    border: 1px solid var(--cp-bg);
    background-color: var(--cp-bg);
    margin-right: 10px;
    box-sizing: border-box;
    color: var(--cp-text2);
    margin-bottom: 10px;
    border-radius: 4px;
    transition: all 0.3s;
    &.active {
      border-color: var(--cp-primary);
      background-color: var(--cp-plain);
    }
  }
}
</style>