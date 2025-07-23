import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter, useRoute } from 'vue-router';
import { http } from '../../utils/http';
import { clearLoginStatusCache } from '../../router/index';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const router = useRouter();
const route = useRoute();
// 表单模式切换
const isLogin = ref(true);
// 加载状态
const loading = ref(false);
// 表单数据
const formData = reactive({
    openid: '',
    password: '',
    nickname: '',
    avatarUrl: ''
});
// 表单验证规则
const rules = {
    openid: [
        { required: true, message: '请输入登录标识', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少6位', trigger: 'blur' }
    ],
    nickname: [
        { required: !isLogin.value, message: '请输入用户昵称', trigger: 'blur' }
    ]
};
// 切换登录/注册模式
const toggleMode = () => {
    isLogin.value = !isLogin.value;
    // 清空表单数据
    Object.keys(formData).forEach(key => {
        formData[key] = '';
    });
};
// 处理表单提交
const handleSubmit = async () => {
    loading.value = true;
    try {
        if (isLogin.value) {
            // 登录逻辑
            await handleLogin();
        }
        else {
            // 注册逻辑
            await handleRegister();
        }
    }
    catch (error) {
        console.error('操作失败:', error);
    }
    finally {
        loading.value = false;
    }
};
// 处理登录
const handleLogin = async () => {
    try {
        const payload = {
            openid: formData.openid,
            password: formData.password
        };
        console.log('发送登录请求:', payload);
        const response = await http.post('/m/admin/auth/login', payload);
        console.log('登录响应数据:', response);
        if (response.code === 200 || response.code === 0) {
            const { token, nickname, avatarUrl, role } = response.data;
            // 存储用户信息到本地存储
            localStorage.setItem('token', token);
            localStorage.setItem('userInfo', JSON.stringify({
                nickname,
                avatarUrl,
                role,
                openid: formData.openid
            }));
            console.log('用户信息已存储到本地');
            // 清除登录状态缓存，确保路由守卫重新检查
            clearLoginStatusCache();
            message.success('登录成功');
            // 获取重定向路径，如果没有则跳转到主页
            const redirectPath = route.query.redirect || '/';
            console.log('当前路由查询参数:', route.query);
            console.log('准备跳转到:', redirectPath);
            // 直接跳转，不需要延迟
            try {
                await router.push(redirectPath);
                console.log('跳转完成到:', redirectPath);
            }
            catch (routerError) {
                console.error('路由跳转失败:', routerError);
                // 如果跳转失败，尝试跳转到主页
                try {
                    await router.push('/');
                    console.log('跳转到主页成功');
                }
                catch (homeError) {
                    console.error('跳转到主页也失败:', homeError);
                    // 强制刷新页面
                    window.location.href = '/';
                }
            }
        }
        else {
            message.error(response.message || '登录失败');
        }
    }
    catch (error) {
        console.error('登录错误:', error);
        message.error(error.response?.data?.message || '登录失败，请检查网络连接');
    }
};
// 处理注册
const handleRegister = async () => {
    try {
        const payload = {
            openid: formData.openid,
            password: formData.password,
            nickname: formData.nickname,
            avatarUrl: formData.avatarUrl
        };
        const response = await http.post('/m/admin/auth/register', payload);
        console.log('注册响应数据:', response);
        if (response.code === 200 || response.code === 0) {
            message.success('注册成功，请登录');
            // 切换到登录模式
            isLogin.value = true;
            // 保留openid和password，清空其他字段
            const { openid, password } = formData;
            Object.keys(formData).forEach(key => {
                formData[key] = '';
            });
            formData.openid = openid;
            formData.password = password;
        }
        else {
            message.error(response.message || '注册失败');
        }
    }
    catch (error) {
        console.error('注册错误:', error);
        message.error(error.response?.data?.message || '注册失败，请检查网络连接');
    }
}; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_fnComponent = (await import('vue')).defineComponent({});
;
let __VLS_functionalComponentProps;
function __VLS_template() {
    const __VLS_ctx = {};
    const __VLS_localComponents = {
        ...{},
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_components;
    const __VLS_localDirectives = {
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_directives;
    let __VLS_styleScopedClasses;
    __VLS_styleScopedClasses['login-header'];
    __VLS_styleScopedClasses['ant-btn-link'];
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("login-container") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("login-card") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("login-header") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    (__VLS_ctx.isLogin ? '用户登录' : '用户注册');
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.AForm;
    /** @type { [typeof __VLS_components.AForm, typeof __VLS_components.aForm, typeof __VLS_components.AForm, typeof __VLS_components.aForm, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ...{ 'onFinish': {} }, model: ((__VLS_ctx.formData)), rules: ((__VLS_ctx.rules)), layout: ("vertical"), ...{ class: ("login-form") }, }));
    const __VLS_2 = __VLS_1({ ...{ 'onFinish': {} }, model: ((__VLS_ctx.formData)), rules: ((__VLS_ctx.rules)), layout: ("vertical"), ...{ class: ("login-form") }, }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_6;
    const __VLS_7 = {
        onFinish: (__VLS_ctx.handleSubmit)
    };
    let __VLS_3;
    let __VLS_4;
    const __VLS_8 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({ label: ("登录标识"), name: ("openid"), }));
    const __VLS_10 = __VLS_9({ label: ("登录标识"), name: ("openid"), }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    const __VLS_14 = __VLS_resolvedLocalAndGlobalComponents.AInput;
    /** @type { [typeof __VLS_components.AInput, typeof __VLS_components.aInput, ] } */
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({ value: ((__VLS_ctx.formData.openid)), placeholder: ("请输入登录标识"), size: ("large"), }));
    const __VLS_16 = __VLS_15({ value: ((__VLS_ctx.formData.openid)), placeholder: ("请输入登录标识"), size: ("large"), }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    __VLS_nonNullable(__VLS_13.slots).default;
    var __VLS_13;
    const __VLS_20 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({ label: ("密码"), name: ("password"), }));
    const __VLS_22 = __VLS_21({ label: ("密码"), name: ("password"), }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    const __VLS_26 = __VLS_resolvedLocalAndGlobalComponents.AInputPassword;
    /** @type { [typeof __VLS_components.AInputPassword, typeof __VLS_components.aInputPassword, ] } */
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({ value: ((__VLS_ctx.formData.password)), placeholder: ("请输入密码"), size: ("large"), }));
    const __VLS_28 = __VLS_27({ value: ((__VLS_ctx.formData.password)), placeholder: ("请输入密码"), size: ("large"), }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    __VLS_nonNullable(__VLS_25.slots).default;
    var __VLS_25;
    if (!__VLS_ctx.isLogin) {
        const __VLS_32 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
        /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
        // @ts-ignore
        const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({ label: ("用户昵称"), name: ("nickname"), }));
        const __VLS_34 = __VLS_33({ label: ("用户昵称"), name: ("nickname"), }, ...__VLS_functionalComponentArgsRest(__VLS_33));
        const __VLS_38 = __VLS_resolvedLocalAndGlobalComponents.AInput;
        /** @type { [typeof __VLS_components.AInput, typeof __VLS_components.aInput, ] } */
        // @ts-ignore
        const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({ value: ((__VLS_ctx.formData.nickname)), placeholder: ("请输入用户昵称"), size: ("large"), }));
        const __VLS_40 = __VLS_39({ value: ((__VLS_ctx.formData.nickname)), placeholder: ("请输入用户昵称"), size: ("large"), }, ...__VLS_functionalComponentArgsRest(__VLS_39));
        __VLS_nonNullable(__VLS_37.slots).default;
        var __VLS_37;
        const __VLS_44 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
        /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
        // @ts-ignore
        const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({ label: ("头像URL"), name: ("avatarUrl"), }));
        const __VLS_46 = __VLS_45({ label: ("头像URL"), name: ("avatarUrl"), }, ...__VLS_functionalComponentArgsRest(__VLS_45));
        const __VLS_50 = __VLS_resolvedLocalAndGlobalComponents.AInput;
        /** @type { [typeof __VLS_components.AInput, typeof __VLS_components.aInput, ] } */
        // @ts-ignore
        const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({ value: ((__VLS_ctx.formData.avatarUrl)), placeholder: ("请输入头像URL（可选）"), size: ("large"), }));
        const __VLS_52 = __VLS_51({ value: ((__VLS_ctx.formData.avatarUrl)), placeholder: ("请输入头像URL（可选）"), size: ("large"), }, ...__VLS_functionalComponentArgsRest(__VLS_51));
        __VLS_nonNullable(__VLS_49.slots).default;
        var __VLS_49;
    }
    const __VLS_56 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({}));
    const __VLS_58 = __VLS_57({}, ...__VLS_functionalComponentArgsRest(__VLS_57));
    const __VLS_62 = __VLS_resolvedLocalAndGlobalComponents.AButton;
    /** @type { [typeof __VLS_components.AButton, typeof __VLS_components.aButton, typeof __VLS_components.AButton, typeof __VLS_components.aButton, ] } */
    // @ts-ignore
    const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({ type: ("primary"), htmlType: ("submit"), size: ("large"), block: (true), loading: ((__VLS_ctx.loading)), }));
    const __VLS_64 = __VLS_63({ type: ("primary"), htmlType: ("submit"), size: ("large"), block: (true), loading: ((__VLS_ctx.loading)), }, ...__VLS_functionalComponentArgsRest(__VLS_63));
    (__VLS_ctx.isLogin ? '登录' : '注册');
    __VLS_nonNullable(__VLS_67.slots).default;
    var __VLS_67;
    __VLS_nonNullable(__VLS_61.slots).default;
    var __VLS_61;
    __VLS_nonNullable(__VLS_5.slots).default;
    var __VLS_5;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("login-footer") }, });
    const __VLS_68 = __VLS_resolvedLocalAndGlobalComponents.AButton;
    /** @type { [typeof __VLS_components.AButton, typeof __VLS_components.aButton, typeof __VLS_components.AButton, typeof __VLS_components.aButton, ] } */
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({ ...{ 'onClick': {} }, type: ("link"), }));
    const __VLS_70 = __VLS_69({ ...{ 'onClick': {} }, type: ("link"), }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    let __VLS_74;
    const __VLS_75 = {
        onClick: (__VLS_ctx.toggleMode)
    };
    let __VLS_71;
    let __VLS_72;
    (__VLS_ctx.isLogin ? '没有账号？立即注册' : '已有账号？立即登录');
    __VLS_nonNullable(__VLS_73.slots).default;
    var __VLS_73;
    __VLS_styleScopedClasses['login-container'];
    __VLS_styleScopedClasses['login-card'];
    __VLS_styleScopedClasses['login-header'];
    __VLS_styleScopedClasses['login-form'];
    __VLS_styleScopedClasses['login-footer'];
    var __VLS_slots;
    var __VLS_inheritedAttrs;
    const __VLS_refs = {};
    var $refs;
    var $el;
    return {
        attrs: {},
        slots: __VLS_slots,
        refs: $refs,
        rootEl: $el,
    };
}
;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            isLogin: isLogin,
            loading: loading,
            formData: formData,
            rules: rules,
            toggleMode: toggleMode,
            handleSubmit: handleSubmit,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
