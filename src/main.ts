import 'vant/lib/index.css'
import '@/styles/main.scss'
import pinia from "@/stores";
import { createApp } from 'vue'
import { Toast } from 'vant';

import App from './App.vue'
import router from './router'
import 'virtual:svg-icons-register'
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Toast)

app.mount('#app')
