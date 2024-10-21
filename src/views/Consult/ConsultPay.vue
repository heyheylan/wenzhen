<script setup lang="ts">
import {getConsultOrderPreAPI,createConsultOrderAPI,getConsultOrderPayUrl} from "@/apis/consult";
import {getPatientDetail} from "@/apis/user";
import {useConsultStore} from "@/stores";
import type {ConsultOrderPreData, PartialConsult} from "@/types/consult";
import type {Patient} from "@/types/user";
import {ref,onMounted} from "vue";
import {showConfirmDialog, showDialog, showFailToast, showLoadingToast, showSuccessToast, showToast} from "vant";
import {onBeforeRouteLeave, useRouter} from 'vue-router'


const loading1 = ref(true)
const store = useConsultStore()
const router = useRouter()
//加载病人信息
const patientInfo = ref<Patient>()
const loadPatientInfo = async () =>{
  const res = await getPatientDetail(<string>store.consultInfo.patientId)
  // console.log(res.data)
  patientInfo.value = res.data
  // console.log(patientInfo.value)

  loading1.value = false

}

const payInfo = ref<ConsultOrderPreData>()
//加载订单信息
const loadPayData = async () =>{
  const res = await getConsultOrderPreAPI({
    type:store.consultInfo.type,
    illnessType:store.consultInfo.illnessType
  })
  // console.log(res.data)
  payInfo.value = res.data
  // 设置优惠券
  store.setCoupon(res.data.couponId)
}
type Key = keyof PartialConsult
onMounted(()=>{

  const validKeys: Key[] = [
    'type',
    'illnessType',
    'depId',
    'illnessDesc',
    'illnessTime',
    'consultFlag',
    'patientId'
  ]
  const valid = validKeys.every((key) => store.consultInfo[key] !== undefined)
  if (!valid) {
    return showDialog({
      title: '温馨提示',
      message:
          '问诊信息不完整请重新填写，如有未支付的问诊订单可在问诊记录中继续支付！',
      closeOnPopstate: false
    }).then(() => {
      router.push('/')
    })
  }
   loadPayData()
   loadPatientInfo()
})

const agree = ref(false)
const show = ref(false)
const loading = ref(false)
const orderId = ref<string>('')
const paymentMethod = ref<0 | 1>()
const submit = async ()=>{
  if(!agree.value) return showFailToast('请勾选我已同意协议')
  loading.value = true
  const res = await createConsultOrderAPI(store.consultInfo)
  orderId.value = res.data.id
  loading.value = false
  store.clear() //清除问诊信息
  //打开抽屉
  show.value = true
  console.log(orderId.value)
}

//支付抽屉关闭
const onClose = () => {
  return showConfirmDialog({
    title: '关闭支付',
    message: '取消支付将无法获得医生回复，医生接诊名额有限，是否确认关闭？',
    cancelButtonText: '仍要关闭',
    confirmButtonText: '继续支付',
  }).then(() => {
        return false
      })
      .catch(() => {
        window.location.reload()
        return true
      })
}
//转跳支付
// const toPay = async ()=>{
//   if (paymentMethod.value === undefined) return showFailToast('请选择支付方式')
//   showLoadingToast({ message: '跳转支付', duration: 0 })
//   const res = await getConsultOrderPayUrl({
//     orderId: orderId.value,
//     paymentMethod: paymentMethod.value,
//     payCallback: 'http://localhost/room'
//   })
//   console.log(res)
//   window.location.href = res.data.payUrl
// }

onBeforeRouteLeave(() => {
  if (orderId.value) return false
})

</script>

<template>
  <div class="consult-pay-page" v-if="payInfo && patientInfo">
    <cp-nav-bar :LeftTo="'/user/patient?isChange=1'" :arrow="true" title="支付" />
    <div class="pay-info">
      <p class="tit">图文问诊 {{ payInfo.payment }} 元</p>
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p class="desc">
        <span>极速问诊</span>
        <span>自动分配医生</span>
      </p>
    </div>
    <van-cell-group>
      <van-cell title="优惠券" :value="`-¥${payInfo.couponDeduction}`" />
      <van-cell title="积分抵扣" :value="`-¥${payInfo.pointDeduction}`" />
      <van-cell title="实付款" :value="`¥${payInfo.actualPayment}`" class="pay-price" />
    </van-cell-group>
    <div class="pay-space"></div>
    <van-cell-group>
      <van-cell title="患者信息" :value="`${patientInfo.name} | ${patientInfo.genderValue} | ${patientInfo.age}岁`"></van-cell>
      <van-cell title="病情描述" :label="store.consultInfo.illnessDesc"></van-cell>
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="agree">我已同意 <span class="text">支付协议</span></van-checkbox>
    </div>
    <van-submit-bar button-type="primary"  :price="payInfo.actualPayment * 100" button-text="立即支付" text-align="left"  :loading="loading" @click="submit"/>


    <!--支付抽屉-->
    <cp-pay-sheet
        v-if="orderId"
        v-model:show="show"
        :order-id="orderId"
        :actualPayment="payInfo.actualPayment"
        :onClose="onClose"
        :payCallback="'http://localhost/room'"
    />
    <!--<van-action-sheet v-model:show="show" title="选择支付方式" :close-on-popstate="false" :closeable="false" :before-close="onClose">-->
    <!--  <div class="pay-type">-->
    <!--    <p class="amount">￥{{ payInfo.actualPayment.toFixed(2)}}</p>-->
    <!--    <van-cell-group >-->
    <!--      <van-cell title="微信支付"  @click="paymentMethod = 0">-->
    <!--        <template #icon><cp-icon name="consult-wechat" /></template>-->
    <!--        <template #extra><van-checkbox :checked="paymentMethod === 0"/></template>-->
    <!--      </van-cell>-->
    <!--      <van-cell title="支付宝支付"  @click="paymentMethod = 1">-->
    <!--        <template #icon><cp-icon name="consult-alipay" /></template>-->
    <!--        <template #extra><van-checkbox :checked="paymentMethod === 1"/></template>-->
    <!--      </van-cell>-->
    <!--    </van-cell-group>-->
    <!--    <div class="btn">-->
    <!--      <van-button type="primary" round block @click="toPay">立即支付</van-button>-->
    <!--    </div>-->
    <!--  </div>-->
    <!--</van-action-sheet>-->
  </div>
<!-- 骨架屏 -->
  <div class="consult-pay-page" v-else>
    <cp-nav-bar :arrow="true" title="支付" />
    <van-skeleton title :row="10" style="margin-top: 30px"  :loading="loading1">
      <div class="pay-info">
        <p class="tit">图文问诊  元</p>
        <img class="img" src="@/assets/avatar-doctor.svg" />
        <p class="desc">
          <span>极速问诊</span>
          <span>自动分配医生</span>
        </p>
      </div>
      <van-cell-group>
        <van-cell title="优惠券" :value="`-¥`" />
        <van-cell title="积分抵扣" :value="`-¥$`" />
        <van-cell title="实付款" :value="`¥$`" class="pay-price" />
      </van-cell-group>
      <div class="pay-space"></div>
      <van-cell-group>
        <van-cell title="患者信息" :value="`岁`"></van-cell>
        <van-cell title="病情描述" :label="store.consultInfo.illnessDesc"></van-cell>
      </van-cell-group>
      <div class="pay-schema">
        <van-checkbox v-model="agree">我已同意 <span class="text">支付协议</span></van-checkbox>
      </div>
      <van-submit-bar button-type="primary"   button-text="立即支付" text-align="left"  :loading="loading" @click="submit"/>
    </van-skeleton>
  </div>
</template>

<style lang="scss" scoped>
.consult-pay-page {
  padding: 46px 0 50px 0;
}
.pay-info {
  display: flex;
  padding: 15px;
  flex-wrap: wrap;
  align-items: center;
  .tit {
    width: 100%;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .img {
    margin-right: 10px;
    width: 38px;
    height: 38px;
    border-radius: 4px;
    overflow: hidden;
  }
  .desc {
    flex: 1;
    > span {
      display: block;
      color: var(--cp-tag);
      &:first-child {
        font-size: 16px;
        color: var(--cp-text2);
      }
    }
  }
}
.pay-price {
  ::v-deep() {
    .vam-cell__title {
      font-size: 16px;
    }
    .van-cell__value {
      font-size: 16px;
      color: var(--cp-price);
    }
  }
}
.pay-space {
  height: 12px;
  background-color: var(--cp-bg);
}
.pay-schema {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    color: var(--cp-primary);
  }
}
::v-deep() {
  .van-submit-bar__button {
    font-weight: normal;
    width: 160px;
  }
}
.pay-type {
  .amount {
    padding: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  .btn {
    padding: 15px;
  }
  .van-cell {
    align-items: center;
    .cp-icon {
      margin-right: 10px;
      font-size: 18px;
    }
    .van-checkbox :deep(.van-checkbox__icon) {
      font-size: 16px;
    }
  }
}
</style>