import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// 引入 Ant Design Vue
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';// Ant Design Vue 的样式文件
import './assets/global.scss'

// 引入全局样式
import './assets/main.css';

// 创建 Vue 应用
const app = createApp(App);

// 使用 Pinia 作为状态管理
app.use(createPinia());

// 使用路由
app.use(router);

// 使用 Ant Design Vue
app.use(Antd);

// 挂载应用
app.mount('#app');

