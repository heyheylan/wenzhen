//用户信息数据类型声明
export type User = {
    token:string
    id:string
    account:string
    mobile:string
    avatar:string
}

// 短信验证码类型声明
export type MobileCode = {
    code:string
}

//注册成功返回的数据类型声明
export type RegisteredId ={
    id:string
}


// 短信验证码类型，登录|注册|修改手机号|忘记密码|绑定手机号
export type CodeType = 'login' | 'register' | 'changeMobile' | 'forgetPassword' | 'bindMobile'

//声明用户信息一部分类型
type OmitUser = Omit<User,'token'>  //不要token，其他都要
//声明个人信息类型（与OmitUser合并）
export type UserInfo = OmitUser & {
    /** 关注 */
    likeNumber: number
    /** 收藏 */
    collectionNumber: number
    /** 积分 */
    score: number
    /** 优惠券 */
    couponNumber: number
    orderInfo: {
        /** 待付款 */
        paidNumber: number
        /** 待发货 */
        receivedNumber: number
        /** 待收货 */
        shippedNumber: number
        /** 已完成 */
        finishedNumber: number
    }
}

// 家庭档案-患者信息
export type Patient = {
    /** 患者ID */
    id?: string
    /** 患者名称 */
    name: string
    /** 身份证号 */
    idCard: string
    /** 0不默认  1默认 */
    defaultFlag: 0 | 1
    /** 0 女  1 男 */
    gender: 0 | 1
    /** 性别文字 */
    genderValue?: string
    /** 年龄 */
    age?: number
}

// 家庭档案-患者信息列表
export type PatientList = Patient[]