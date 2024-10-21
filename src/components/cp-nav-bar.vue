<script setup lang="ts">
import { useRouter,useRoute } from 'vue-router'
import {defineProps} from 'vue'

const route = useRoute()
// 2. 使用组件时候才能确定的功能：标题，右侧文字，点击右侧文字行为（props传入）
const props = defineProps<{
  title?: string
  rightText?: string
  back?: () => void
  arrow?: boolean
  LeftTo?: string
  RightTo?: string
}>()


//1. 一定有的功能：返回图标，返回效果，固定定位（组件内部实现）
const router = useRouter()
const onClickLeft = () => {
  console.log('onClickLeft')
  //直接返回用于添加患者抽屉
  if (props.back) {
    if(route.path.includes('/login')){
      console.log(1)
      return router.push('/')
    }else{
      console.log(2)
      return props.back()
    }
  }
  //确定要返回的页面，以防参数bug
  if(props.LeftTo){
    if(route.path.includes('/login')){
      console.log(3)
      return router.push('/')
    }else{
      console.log(4)
      return router.push(props.LeftTo)
    }
  }

// 判断历史记录中是否有回退
  if (history.state?.back) {
    if(history.state?.back.includes('/login/callback')){
      router.back()
    }
    if(history.state?.back.includes('/login')){
      console.log(5)
      console.log(history.state?.back)
      return router.push('/')
    } else{
      console.log(6)
      router.back()
    }
  } else {
    console.log(7)
    router.push('/')
  }

}


const emit = defineEmits<{
  (e: 'click-right'): void
}>()


const onClickRight = () => {
  emit('click-right')
  if(props.RightTo){
    console.log('onClickRight')
    return router.push(props.RightTo)
  }
}

const yes = ()=>{
  router.back()
}
</script>

<template>
  <van-nav-bar
      :left-arrow="arrow"
      @click-left="onClickLeft"
      fixed
      :title="title"
      :right-text="rightText"
      @click-right="onClickRight"
  ></van-nav-bar>
</template>

<style lang="scss" scoped>
:deep() {
  .van-nav-bar {
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }
    &__text {
      font-size: 15px;
    }
  }
}
</style>