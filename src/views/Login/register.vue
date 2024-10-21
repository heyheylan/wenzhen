<script setup lang="ts">
//导入校验规则
import {mobileRules, passwordRules,codeRules} from "@/utils/rules";
//导入登录函数
import {registerAPI} from '@/apis/user'

//导入路由
import { useRouter} from "vue-router";
import {ref} from 'vue'
import { showSuccessToast, showFailToast } from 'vant';

import {useMobileCode} from "@/composables/UseMobileCode";

const mobile = ref('')
const password = ref('12345678')
const code = ref('') //验证码

const {time,send,form} = useMobileCode(mobile,'register',code)

const registerId = ref()
const router = useRouter()  //用于路由跳转


const show = ref(false) //密码明文显示
const agree = ref(true) //协议同意




//表单提交登录
const register = async () => {
  if (!agree.value)  {showFailToast('请勾选我已同意')}
  if(agree.value){
      const res = await registerAPI(mobile.value,code.value, password.value)
      registerId.value = res.data.id
      showSuccessToast('注册成功,请登录')
      router.push('/login')
  }
}


// //发送验证码
// const send = async () => {
//   // 已经倒计时time的值大于0，此时不能发送验证码
//   if (time.value > 0) return
//   // 验证不通过报错，阻止程序继续执行
//   await form.value?.validate('mobile')  //检验mobile是否有值
//   const res = await sendMobileCode(mobile.value, 'register')
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
// onUnmounted(()=>{
//   window.clearInterval(timeId)
// })


</script>

<template>
  <div class="login-page">
    <cp-nav-bar
        :arrow=true
        right-text="登录"
        @click-right="router.push('/login')"
    ></cp-nav-bar>
    <!-- 头部 -->
    <div class="login-head">
      <h3>注册</h3>
    </div>
    <!-- 表单 -->
    <!--监听表单校验成功后 submit 事件-->
    <van-form autocomplete="off" @submit="register" ref="form">
      <van-field v-model="mobile" :rules="mobileRules" placeholder="请输入手机号" type="tel" name="mobile">
      </van-field>
      <van-field v-model="password"
                 :rules="passwordRules"
                 placeholder="请输入密码"
                 :type="show ? 'text' : 'password'"
      >
        <template #button>
          <cp-icon @click="show = !show" :name="`login-eye-${show ? 'on' : 'off'}`"></cp-icon>
        </template>
      </van-field>
      <van-field  v-model="code" :rules="codeRules" placeholder="短信验证码">
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
        <van-button block round type="primary" native-type="submit"> 注册</van-button>
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
    <!-- 底部 -->

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