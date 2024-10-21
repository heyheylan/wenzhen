<script setup lang="ts">
//导入校验规则
import {mobileRules, passwordRules,codeRules} from "@/utils/rules";
//导入登录函数
import {loginByPassword,loginByMobile} from '@/apis/user'
//导入user模块
import {useUserStore} from "@/stores";
//导入路由
import {useRoute, useRouter} from "vue-router";
import {ref} from 'vue'

import { showSuccessToast, showFailToast } from 'vant';
import {useMobileCode} from "@/composables/UseMobileCode";
import {onMounted} from "vue";

const mobile = ref('13230000100')
const password = ref('')
const code = ref('') //验证码

const {time,send,form} = useMobileCode(mobile,'login',code)



const store = useUserStore()
const router = useRouter()  //用于路由跳转
const route = useRoute() //用于路由页面信息



const show = ref(false) //密码明文显示
const agree = ref(true) //协议同意
const isPass = ref(true) //页面切换，密码登录(true)和短信登录(false)

// const time = ref(0) //已经倒计时
// let timeId: number
// const form = ref<FormInstance>() //发送验证码表单

//表单提交登录
const login = async () => {
  if (!agree.value)  {showFailToast('请勾选我已同意')}
  if(agree.value){
    // 验证完毕，进行登录
    const res = isPass.value ? await loginByPassword(password.value,mobile.value) : await loginByMobile(mobile.value,code.value)
    // console.log(res.data)
    store.SetUser(res.data)
    // // 如果有回跳地址就进行回跳，没有跳转到个人中心
    router.push((route.query.returnUrl as string) || '/user')
    showSuccessToast('登录成功')
  }
}
onMounted(() => {
  // 组件渲染完毕，使用QC生成QQ登录按钮，目的得到跳转链接
  // QC.Login({
  //   btnId: 'qq'
  // })
})

//发送验证码
// const send = async () => {
//   // 已经倒计时time的值大于0，此时不能发送验证码
//   if (time.value > 0) return
//   // 验证不通过报错，阻止程序继续执行
//   await form.value?.validate('mobile')  //检验mobile是否有值
//   const res = await sendMobileCode(mobile.value, 'login')
//   code.value = res.data.code
//   console.log(code.value)
//   showSuccessToast('发送成功')
//   time.value = 60
//   // 倒计时开始
//   clearInterval(timeId)
//   timeId = window.setInterval(()=>{
//     time.value--
//     if(time.value <= 0) window.clearInterval(timeId)
//   },1000)
// }
// //组件卸载关闭计时器
//  onUnmounted(()=>{
//    window.clearInterval(timeId)
//  })

const changeIsPass = () => {
  isPass.value = !isPass.value
  form.value?.resetValidation()
}

</script>

<template>
  <div class="login-page">
    <cp-nav-bar
        :arrow=false
        right-text="注册"
        @click-right="router.push('/register')"
    ></cp-nav-bar>
    <!-- 头部 -->
    <div class="login-head">
      <h3>{{ isPass ? '密码登录' : '短信验证码登录' }}</h3>
      <a href="javascript:;">
        <span @click="changeIsPass">{{ !isPass ? '密码登录' : '短信验证码登录' }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- 表单 -->
    <!--监听表单校验成功后 submit 事件-->
    <van-form autocomplete="off" @submit="login" ref="form">
      <van-field v-model="mobile" :rules="mobileRules" placeholder="请输入手机号" type="tel" name="mobile">
      </van-field>
      <van-field v-model="password"
      v-if="isPass"
      :rules="passwordRules"
      placeholder="请输入密码"
      :type="show ? 'text' : 'password'"
      >
        <!--<svg aria-hidden="false">-->
        <!--  &lt;!&ndash; #icon-文件夹名称-图片名称 &ndash;&gt;-->
        <!--  <use href="#icons-login-eye-off" />-->
        <!--</svg>-->
        <template #button>
          <cp-icon @click="show = !show" :name="`login-eye-${show ? 'on' : 'off'}`"></cp-icon>
        </template>
      </van-field>
      <van-field v-else v-model="code" :rules="codeRules" placeholder="短信验证码">

        <template #button>
          <span class="btn-send" :class="{active: time > 0}" @click="send">{{time>0 ? `${time}s后再次发送`:'发送验证码'}}</span>
        </template>

      </van-field>


      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <!--按钮绑定submit事件-->
        <van-button block round type="primary" native-type="submit"> 登 录</van-button>
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
    <!-- 底部 -->
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icon" >
        <a
            href="https://graph.qq.com/oauth2.0/show?which=Login&display=pc&client_id=102015968&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fconsult-patients.itheima.net%2Flogin%2Fcallback"
        >
          <img src="@/assets/qq.svg" alt="" />
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  &-page {
    padding-top: 46px;
  }

  &-head {
    display: flex;
    padding: 30px 30px 50px;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;

    h3 {
      font-weight: normal;
      font-size: 24px;
    }

    a {
      font-size: 15px;
    }
  }

  &-other {
    margin-top: 60px;
    padding: 0 30px;

    .icon {
      display: flex;
      justify-content: center;

      img {
        width: 36px;
        height: 36px;
        padding: 4px;
      }
    }
  }
}

.van-form {
  padding: 0 14px;

  .cp-cell {
    height: 52px;
    line-height: 24px;
    padding: 14px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;

    .van-checkbox {
      a {
        color: var(--cp-primary);
        padding: 0 5px;
      }
    }
  }

  .btn-send {
    color: var(--cp-primary);

    &.active {
      color: rgba(22, 194, 163, 0.5);
    }
  }
}
</style>