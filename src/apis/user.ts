//导入用户信息类型
import type {User, CodeType, MobileCode, UserInfo, RegisteredId, PatientList, Patient} from '@/types/user'
import {request} from '@/utils/request'


//密码登录
export const loginByPassword = (password:string, mobile:string) => {
   return  request<User>('/login/password', "POST", {password,mobile})
}

//发送验证码
export const sendMobileCode = (mobile:string, type:CodeType) => {
   return  request<MobileCode>('/code', 'GET', {mobile,type})
}

// 短信登录
export const loginByMobile = (mobile:string, code:string) => {
   return  request<User>('/login', 'POST', {mobile,code})
}

//获取个人信息
export const getUserInfoAPI = () => request<UserInfo>('/patient/myUser')

//注册账户
export const registerAPI = (mobile:string, code:string, password:string) => request<RegisteredId>('/register', 'POST', {mobile,code,password})

// 获患者信息列表
export const getPatientList = () => request<PatientList>('/patient/mylist')

//添加患者信息
export const addPatientAPI = (patient: Patient) => request('/patient/add', 'POST', patient)

//编辑患者信息
export const editPatientAPI = (patient: Patient) => request('/patient/update', 'PUT', patient)

//删除患者信息
export const delPatientAPI = (id: string) => request(`/patient/del/${id}`, 'DELETE')

//查询患者详情
export const getPatientDetail = (id: string) => request<Patient>(`/patient/info/${id}`)


//qq登录API函数
export const loginByQQAPI = (openId: string) =>   request<User>('/login/thirdparty', 'POST', { openId, source: 'qq' })


/**
 * 登录--绑定用户新-三方登录绑定手机号
 * @param data 请求参数
 * @returns
 */
export const bindMobileAPI = (data: {
   mobile: string
   code: string
   openId: string
}) => request<User>('/login/binding', 'POST', data)