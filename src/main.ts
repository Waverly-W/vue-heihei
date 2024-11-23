import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// 引入 Ant Design Vue
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

// 引入 axios 配置
import { http } from './utils/http'

const app = createApp(App)

// 将 http 实例添加到全局属性中
app.config.globalProperties.$http = http

// 使用插件
app.use(createPinia())
app.use(router)
app.use(Antd)

app.mount('#app')
