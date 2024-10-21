<script setup lang="ts">
import { onMounted,ref,onUnmounted} from "vue";
import {loginByQQAPI, sendMobileCode,bindMobileAPI} from "@/apis/user";
import {useRouter} from "vue-router";
import { mobileRules, codeRules } from '@/utils/rules'
import { showFailToast,showSuccessToast, type FormInstance } from 'vant'
import type {User} from "@/types/user";
import { useUserStore } from '@/stores'
const store = useUserStore()


const router = useRouter()

const openId = ref('')

const isNeedBind = ref(false)

const mobile = ref('')
const code = ref('')

const form = ref<FormInstance>()
const time = ref(0)
let timeId: number

//发送验证码
const send = async ()=>{
  if(time.value > 0) return

  await form.value?.validate('mobile')
  const res = await sendMobileCode(mobile.value,'bindMobile')
  console.log(res)
  code.value = res.data.code
  showSuccessToast('发送成功')
  time.value = 60
  clearInterval(timeId)
  timeId = setInterval(() => {
    time.value--
    if (time.value <= 0) window.clearInterval(timeId)
  }, 1000)
}

const loginSuccess = (data:User) =>{
  store.SetUser(data)
  router.replace('/user')
  showSuccessToast('登录成功')
}

const  onSubmit = async()=>{
  const res = await bindMobileAPI({
    mobile: mobile.value,
    code: code.value,
    openId: openId.value
  })
  loginSuccess(res.data)
}

onUnmounted(() => {
  window.clearInterval(timeId)
})

const bind = async () => {
  // 校验通过
}


onMounted(()=>{
  if(QC.Login.check()) {
    QC.Login.getMe((id: string) => {
      openId.value = id
      const res = loginByQQAPI(id)
          .then((res) => {

          })
          .catch(() => {
            isNeedBind.value = true

          })
    })
  }
})
</script>

<template>
  <div class="login-page" v-if="isNeedBind">
    <cp-nav-bar
        :back="router.back"
        :arrow=false
        right-text="注册"
        @click-right="router.push('/register')"
    ></cp-nav-bar>
    <div class="login-head">
      <h3>手机绑定</h3>
    </div>
    <van-form autocomplete="off" ref="form" @submit="onSubmit">
      <van-field
          v-model="mobile"
          name="mobile"
          :rules="mobileRules"
          placeholder="请输入手机号"
      ></van-field>
      <van-field v-model="code" name="code" :rules="codeRules" placeholder="请输入验证码">
        <template #button>
          <span class="btn-send" :class="{ active: time > 0 }" @click="send">{{ time > 0 ? `${time}s后再次发送` : '发送验证码' }}</span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-button block round type="primary" native-type="submit">
          立即绑定
        </van-button>
      </div>
    </van-form>
  </div>
</template>



<style scoped>
@import "@/styles/login.scss";
</style>