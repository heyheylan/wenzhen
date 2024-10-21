import {createRouter,createWebHistory} from 'vue-router'
import {useUserStore} from "@/stores";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const router = createRouter({
    history:createWebHistory(import.meta.env.BASE_URL), //BASE_URL: 特定的环境变量，通常表示应用的基础 URL 或公共基础路径。
    routes: [
        {
            path: '/login', component: () => import('@/views/Login/index.vue'), meta: { title: '登录' }
        },{
            path: '/register', component: () => import('@/views/Login/register.vue'), meta: { title: '注册' }
        },
        {
            path: '/',
            component: () => import('@/views/Layout/index.vue'),
            redirect: '/home',
            children: [
                { path: '/home', component: () => import('@/views/Home/index.vue') },
                { path: '/article', component: () => import('@/views/Article/index.vue') },
                { path: '/notify', component: () => import('@/views/Notify/index.vue') },
                { path: '/user', component: () => import('@/views/User/index.vue') }
            ]
        },
        {
            path: '/user/patient',
            component: () => import('@/views/User/PatientPage.vue'),
            meta: { title: '家庭档案' }
        },
        {
            path: '/user/consult',
            component: () => import('@/views/User/ConsultPage.vue'),
            meta: { title: '问诊记录' }
        },
        {
            path: '/user/consult/:id',
            component: () => import('@/views/User/ConsultDetail.vue'),
            meta: { title: '问诊详情' }
        },
        {
            path: '/consult/fast',
            component: () => import('@/views/Consult/ConsultFast.vue'),
            meta: { title: '极速问诊' }
        },
        {
            path: '/consult/dep',
            component: () => import('@/views/Consult/ConsultDep.vue'),
            meta: { title: '选择科室' }
        },
        {
            path: '/consult/illness',
            component: () => import('@/views/Consult/ConsultIllness.vue'),
            meta: { title: '病情描述' }
        },
        {
            path: '/consult/pay',
            component: () => import('@/views/Consult/ConsultPay.vue'),
            meta: { title: '问诊支付' }
        },
        {
            path: '/room',
            component: () => import('@/views/Room/index.vue'),
            meta: { title: '问诊室' },
            beforeEnter(to) {
                if (to.query.payResult === 'false') return '/user/consult'
            }
        },
        {
            path: '/order/pay',
            component: () => import('@/views/Order/OrderPay.vue'),
            meta: { title: '药品支付' }
        },
        {
            path: '/order/pay/result',
            component: () => import('@/views/Order/OrderPayResult.vue'),
            meta: { title: '药品支付结果' }
        },
        {
            path: '/order/:id',
            component: () => import('@/views/Order/OrderDetail.vue'),
            meta: { title: '药品订单详情' }
        },
        {
            path: '/order/logistics/:id',
            component: () => import('@/views/Order/OrderLogistics.vue'),
            meta: { title: '物流详情' }
        },
        {
            path: '/login/callback',
            component: () => import('@/views/Login/LoginCallback.vue'),
            meta: { title: '登录回跳' }
        }
    ]
})

//路由守卫
router.beforeEach((to)=>{
    //进度条加载开启
    NProgress.start()
    const store = useUserStore()
    //白名单
    const whiteList = ['/login','/register','/login/callback']
    // if(store.user?.token){
    //     next()
    // }else{
    //     if (whiteList.includes(to.path)){
    //         next()
    //     }else{
    //         next('/login')
    //     }
    // }

    if(!store.user?.token && !whiteList.includes(to.path)) return  '/login'

})

router.afterEach((to) => {
    document.title = `${to.meta.title || ''}-优医问诊`
    //进度条加载完毕
    NProgress.done()
})
//插件配置，颜色修改
NProgress.configure({
    showSpinner: false
})

export default router