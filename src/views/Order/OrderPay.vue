<script setup lang="ts">
import {createMedicalOrderAPI, getAddressListAPI, getMedicalOrderPreAPI} from "@/apis/order";
import type {AddressItem,OrderPre} from "@/types/order";
import {onMounted,ref} from "vue";
import {useRoute} from "vue-router";
import {showFailToast} from "vant";
import OrderMedical from "@/components/order-medical.vue";
import {useOrderDetail} from "@/composables/getMedicalOrderDetail";

const route = useRoute()
//订单信息
const orderPre = ref<OrderPre>()
//收货地址
const address = ref<AddressItem>()

const agree = ref(false)
const loading = ref(false)
const orderId = ref('')

const submit = async () => {
  if (!agree.value) return showFailToast('请同意支付协议')
  if (!address.value?.id) return showFailToast('请选择收货地址')
  if (!orderPre.value?.id) return showFailToast('未找到处方')
  // 没有生成订单ID
  if (!orderId.value) {
    loading.value = true
    try {
      const res = await createMedicalOrderAPI({
        id: orderPre.value?.id,
        addressId: address.value?.id,
        couponId: orderPre.value.couponId
      })
      orderId.value = res.data.id
      loading.value = false
      // 打开支付抽屉
      show.value = true
    } catch (e) {
      loading.value = false
    }
  } else {
    show.value = true
  }
}
// 控制抽屉和弹窗
const show = ref(false)

onMounted(async ()=>{
  const res = await getMedicalOrderPreAPI({prescriptionId:route.query.id as string })
  const addRes = await getAddressListAPI()
  console.log(res)
  console.log(addRes)
  orderPre.value = res.data
  //设置收货地址
  if(addRes.data.length){
    const defAddress = addRes.data.find((item) => item.isDefault === 0)
    if(defAddress) address.value = defAddress
    else address.value = addRes.data[0]
  }
})

// const { order } = useOrderDetail(route.params.id as string)
</script>

<template>
  <div class="order-pay-page" v-if="address && orderPre ">
    <cp-nav-bar :arrow="true" title="药品支付" />
    <div class="order-address">
      <p class="area">
        <van-icon name="location" />
        <span>{{ address.province + address.city + address.county }}</span>
      </p>
      <p class="detail">{{ address.addressDetail }}</p>
      <p>{{ address.receiver }}
        {{ address.mobile.replace(/^(\d{3})(?:\d{4})(\d{4})$/, '\$1****\$2') }}</p>
    </div>
    <!--<div class="order-medical">-->
    <!--  <div class="head">-->
    <!--    <h3>优医药房</h3>-->
    <!--    <small>优医质保 假一赔十</small>-->
    <!--  </div>-->
    <!--  <div class="item van-hairline&#45;&#45;top" v-for="med in orderPre.medicines" :key="med.id">-->
    <!--    <img class="img" :src="med.avatar" alt="" />-->
    <!--    <div class="info">-->
    <!--      <p class="name">-->
    <!--        <span>{{ med.name }}</span>-->
    <!--        <span>x{{ med.quantity }}</span>-->
    <!--      </p>-->
    <!--      <p class="size">-->
    <!--        <van-tag v-if="med.prescriptionFlag === 1">处方药</van-tag>-->
    <!--        <span>{{ med.specs }}</span>-->
    <!--      </p>-->
    <!--      <p class="price">￥{{ med.amount }}</p>-->
    <!--    </div>-->
    <!--    <div class="desc">{{ med.usageDosag }}</div>-->
    <!--  </div>-->
    <!--</div>-->
    <order-medical :medicines="orderPre.medicines" />
    <div class="order-detail">
      <van-cell-group>
        <van-cell title="药品金额" :value="`￥${orderPre.payment}`" />
        <van-cell title="运费" :value="`￥${orderPre.expressFee}`" />
        <van-cell title="优惠券" :value="`-￥${orderPre.couponDeduction}`" />
        <van-cell title="实付款" :value="`￥${orderPre.actualPayment}`" class="price" />
      </van-cell-group>
    </div>
    <div class="order-tip">
      <p class="tip">
        由于药品的特殊性，如非错发、漏发药品的情况，药品一经发出
        不得退换，请核对药品信息无误后下单。
      </p>
      <van-checkbox v-model="agree">我已同意<a href="javascript:;">支付协议</a></van-checkbox>
    </div>
    <van-submit-bar
        @click="submit"
        :price="50 * 100"
        button-text="立即支付"
        button-type="primary"
        text-align="left"
    ></van-submit-bar>
    <cp-pay-sheet
        v-if="orderPre && orderId"
        :orderId="orderId"
        :actualPayment="orderPre.actualPayment"
        payCallback="http://localhost/order/pay/result"
        v-model:show="show"
    />
  </div>
</template>

<style lang="scss" scoped>
:deep(.van-nav-bar) {
  background-color: var(--cp-primary);
  .van-nav-bar__arrow,
  .van-nav-bar__title {
    color: #fff;
  }
}
:deep(.van-cell) {
  .van-cell__title {
    font-size: 16px;
  }
  .van-cell__value {
    font-size: 16px;
  }
  &.price {
    .van-cell__value {
      font-size: 18px;
      color: var(--cp-price);
    }
  }
}
:deep(.van-submit-bar) {
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
  .van-button {
    width: 200px;
  }
}
.order-pay-page {
  padding: 46px 0 65px;
}
.order-address {
  padding: 15px 15px 0 15px;
  background-color: #fff;
  font-size: 13px;
  .area {
    color: var(--cp-tag);
    margin-bottom: 5px;
    .van-icon-location {
      color: #ff7702;
      font-size: 14px;
    }
  }
  .detail {
    font-size: 17px;
    margin-bottom: 5px;
  }
  &::after {
    content: '';
    display: block;
    height: 12px;
    background-color: var(--cp-bg);
    margin: 0 -15px;
    margin-top: 15px;
  }
}

.order-medical {
  background-color: #fff;
  padding: 0 15px;
  .head {
    display: flex;
    height: 54px;
    align-items: center;
    > h3 {
      font-size: 16px;
      font-weight: normal;
    }
    > small {
      font-size: 13px;
      color: var(--cp-tag);
      margin-left: 10px;
    }
  }
  .item {
    display: flex;
    flex-wrap: wrap;
    padding: 15px 0;
    .img {
      width: 80px;
      height: 70px;
      border-radius: 2px;
      overflow: hidden;
    }
    .info {
      padding-left: 15px;
      width: 250px;
      .name {
        display: flex;
        font-size: 15px;
        margin-bottom: 5px;
        > span:first-child {
          width: 200px;
        }
        > span:last-child {
          width: 50px;
          text-align: right;
        }
      }
      .size {
        margin-bottom: 5px;
        .van-tag {
          background-color: var(--cp-primary);
          vertical-align: middle;
        }
        span:not(.van-tag) {
          margin-left: 10px;
          color: var(--cp-tag);
          vertical-align: middle;
        }
      }
      .price {
        font-size: 16px;
        color: #eb5757;
      }
    }
    .desc {
      width: 100%;
      background-color: var(--cp-bg);
      border-radius: 4px;
      margin-top: 10px;
      padding: 4px 10px;
      color: var(--cp-tip);
    }
  }
}
.order-tip {
  padding: 0 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 10px;
  .tip {
    font-size: 12px;
    color: var(--cp-tag);
    width: 100%;
    &::before {
      content: '*';
      color: var(--cp-price);
      font-size: 14px;
    }
    margin-bottom: 30px;
  }
  .van-checkbox {
    a {
      color: var(--cp-primary);
    }
  }
}
</style>
