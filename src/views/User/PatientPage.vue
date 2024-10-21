<script setup lang="ts">
import {getPatientList,addPatientAPI,editPatientAPI,delPatientAPI} from "@/apis/user";
import {useRoute} from "vue-router";
import type {PatientList,Patient} from '@/types/user'
import { onMounted, ref,computed } from 'vue'
import {idCardRules,nameRules} from '@/utils/rules'
import {type FormInstance, showConfirmDialog, showFailToast, showSuccessToast} from "vant";
import  {useConsultStore} from "@/stores/modules/consult";
import router from "@/router";

const store = useConsultStore()

const route = useRoute()
//接收isChange，怎么进入问诊选患者状态
const  isChange = computed(()=> route.query.isChange === '1')

const list = ref<PatientList>([])
const loadList = async () => {
  const  res = await getPatientList()
  console.log(res)
  list.value = res.data
  //设置默认选中（在选择患者功能时），将默认患者设为选中状态
  //只需要匹配一项，使用find方法
  if(isChange.value && list.value.length){
    //找到默认患者
    const defPatient = list.value.find((item)=> item.defaultFlag === 1)
    if(defPatient) selectedPatientId.value = defPatient.id
    else selectedPatientId.value = list.value[0].id  //默认第一个是默认患者
  }
}

onMounted(()=>{
  loadList()
})

//点击选中效果（选择患者页面才有的功能）
const selectedPatientId = ref<string>()
const selectedPatient = (item:Patient)=>{
  if(isChange.value){
    selectedPatientId.value = item.id
    console.log(item.id)
  }
}


const options = [
  { label: '男', value: 1 },
  { label: '女', value: 0 }
]

// 2. 打开侧滑栏
const show = ref(false)
const showPopup = (item?:Patient) => {
  if(item){
    //结构数据
    const {id,gender,name,idCard,defaultFlag} = item
    patientFrom.value = {id,gender,name,idCard,defaultFlag}
  }else{
    //重置表单
    patientFrom.value = {...initPatientFrom}
  }
  show.value = true
}

//表单初始值
const initPatientFrom:Patient = {
  name: '',
  idCard: '',
  gender: 1,
  defaultFlag: 0
}

const patientFrom = ref<Patient>({...initPatientFrom})

//默认值转换
const defaultFlag = computed({
  get() {
    return patientFrom.value.defaultFlag === 1
  },
  set(value) {
    //value是true，值就是1，否则0
    patientFrom.value.defaultFlag = value ? 1 : 0
  }
})


//表单校验
const form = ref<FormInstance>()
const onSubmit = async () => {
  await form.value?.validate()
  // 校验通过
  // 身份证倒数第二位，单数是男，双数是女
  const gender = +patientFrom.value.idCard.slice(-2,-1)  % 2
  console.log(patientFrom.value.gender)
  if(gender !== patientFrom.value.gender){
    await showConfirmDialog({
      title: '温馨提示',
      message: '身份证号与性别不匹配，确认提交？',
      confirmButtonText: '确定'
    })
  }

  //添加患者
  const res = patientFrom.value.id ? await editPatientAPI(patientFrom.value): await addPatientAPI(patientFrom.value)
  if(res.code === 10000){
    showSuccessToast(patientFrom.value.id ? '编辑成功' : '添加成功')
    show.value = false
    loadList()
  }else{
    showSuccessToast(patientFrom.value.id ? '编辑失败' :'添加失败')
  }
}

const remove = async () => {
  if(patientFrom.value.id){
    await showConfirmDialog({
      title: '温馨提示',
      message: '确定删除该患者？',
      confirmButtonText: '确定'
    })
  }
  const res = await delPatientAPI(<string>patientFrom.value.id)
  showSuccessToast('删除成功')
  show.value = false
  loadList()
}

const next = ()=>{
  // if(!selectedPatientId) return showFailToast('请选择就诊患者')
  store.setPatient(<string>selectedPatientId.value)
  router.push('/consult/pay')
}
</script>

<template>
  <div class="patient-page">
    <cp-nav-bar :arrow="true" :title="isChange ? '选择患者' : '家庭档案'"  :LeftTo="isChange ? '/consult/illness' : '/user' " ></cp-nav-bar>
    <!-- 头部提示 -->
    <div class="patient-change" v-if="isChange">
      <h3>请选择患者信息</h3>
      <p>以便医生给出更准确的治疗，信息仅医生可见</p>
    </div>
    <div class="patient-list">
      <div class="patient-item" v-for="item in list" :key="item.id" @click="selectedPatient(item)" :class="{ selected: selectedPatientId === item.id }">
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">{{ item.idCard.replace(/^(.{6}).+(.{4})$/, '\$1********\$2') }}</span>
          <span>{{ item.gender === 1 ? '男' : '女' }}</span>
          <span>{{ item.age }}岁</span>
        </div>
        <div class="icon" @click="showPopup(item)"><cp-icon name="user-edit" /></div>
        <div class="tag" v-if="item.defaultFlag === 1">默认</div>
      </div>
      <div class="patient-add" v-if="list.length < 6"  @click="showPopup()">
        <cp-icon name="user-add"  />
        <p>添加患者</p>
      </div>
      <div class="patient-tip" >最多可添加 6 人</div>
    </div>
    <!-- 侧边栏 -->
    <!-- <van-popup :show="show" @update:show="show=$event" position="right">-->
    <van-popup v-model:show="show" position="right">
      <cp-nav-bar :arrow="true" :back="() => (show = false)" :title="patientFrom.id ? '编辑患者' : '添加患者'" right-text="保存" @click-right="onSubmit"></cp-nav-bar>
      <van-form autocomplete="off" ref="form">
        <van-field label="真实姓名" placeholder="请输入真实姓名" v-model="patientFrom.name" :rules="nameRules"/>
        <van-field label="身份证号" placeholder="请输入身份证号" v-model="patientFrom.idCard" :rules="idCardRules"/>

        <van-field label="性别" class="pb4">
          <!-- 单选按钮组件 -->
          <template #input>
            <!--<cp-radio-btn :options="options" :modelValue="patientFrom.gender" @update:modelValue="gender = $event"></cp-radio-btn>-->
            <cp-radio-btn :options="options"  v-model="patientFrom.gender"></cp-radio-btn>
          </template>
        </van-field>

        <van-field label="默认就诊人">
          <template #input>
            <van-checkbox :icon-size="18" round v-model="defaultFlag"/>
          </template>
        </van-field>
      </van-form>
      <van-action-bar>
        <van-action-bar-button v-if="patientFrom.id" @click="remove" >删除</van-action-bar-button>
      </van-action-bar>
    </van-popup>
    <!-- 底部按钮 -->
    <div class="patient-next" v-if="isChange">
      <van-button type="primary" round block @click="next">下一步</van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.patient-page {
  padding: 46px 0 80px;
  :deep() {
    .van-popup {
      width: 100%;
      height: 100%;
      padding-top: 46px;
      box-sizing: border-box;
    }
  }
}
.patient-list {
  padding: 15px;
}
.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;
  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;
      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }
      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }
  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }
  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);
    .icon {
      color: var(--cp-primary);
    }
  }
}
.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;
  .cp-icon {
    font-size: 24px;
  }
}
.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
}
.pb4 {
  padding-bottom: 4px;
}
// 底部操作栏
.van-action-bar {
  padding: 0 10px;
  margin-bottom: 10px;
  .van-button {
    color: var(--cp-price);
    background-color: var(--cp-bg);
  }
}
.patient-change {
  padding: 15px;
  > h3 {
    font-weight: normal;
    margin-bottom: 5px;
  }
  > p {
    color: var(--cp-text3);
  }
}
.patient-next {
  padding: 15px;
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 80px;
  box-sizing: border-box;
}
</style>