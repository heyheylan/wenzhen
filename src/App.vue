<template>
  <!--<div>-->
  <!--  {{ store.user }}-->
  <!--  <Button @click="getUserInfo">获取个人信息</Button>-->
  <!--  <Button @click="login">登录</Button>-->
  <!--</div>-->
  <router-view></router-view>
</template>

<script setup lang="ts">
import {useUserStore} from '@/stores'
import {ref,onMounted} from 'vue'
import {Button} from 'vant'
import {request} from "@/utils/request";
//用户信息数据类型
import type {User} from "@/types/user";


const store = useUserStore()

//获取个人信息
const getUserInfo = async () => {
  const res = await request('/patient/myUser')
  console.log(res)
}
//登录函数
const login = async () => {
  const res = await request<User>('/login/password', 'POST', {
    mobile: '13211112222',
    // 密码 abc123456 测试：出现非10000的情况
    password: 'abc12345'
  })
  console.log(res)
  store.SetUser(res.data)
}

onMounted( ()=>{
  const  store = useUserStore()
  // console.log(store.user)
})
</script>

<style scoped>

</style>