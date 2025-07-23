import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { http } from '../../utils/http';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
// 表单数据
const formData = reactive({
    id: '',
    openid: '',
    nickname: '',
    avatarUrl: '',
    level: 0,
    experience: 0,
    role: '',
    status: '',
    password: '',
    confirmPassword: ''
});
// 原始用户信息，用于重置
const originalUserInfo = ref({
    id: '',
    openid: '',
    nickname: '',
    avatarUrl: '',
    level: 0,
    experience: 0,
    role: '',
    status: ''
});
const fileList = ref([]);
const loading = ref(false);
const saving = ref(false);
// 获取用户信息
const fetchUserInfo = async () => {
    loading.value = true;
    try {
        const response = await http.post('/m/admin/auth/userInfo');
        console.log('用户信息响应:', response);
        if (response.code === 0 || response.code === 200) {
            const userInfo = response.data;
            // 更新表单数据
            Object.assign(formData, {
                ...userInfo,
                password: '',
                confirmPassword: ''
            });
            // 保存原始信息
            originalUserInfo.value = { ...userInfo };
            console.log('用户信息加载成功:', userInfo);
        }
        else {
            message.error(response.message || '获取用户信息失败');
        }
    }
    catch (error) {
        console.error('获取用户信息错误:', error);
        message.error('获取用户信息失败，请检查网络连接');
    }
    finally {
        loading.value = false;
    }
};
// 刷新用户信息
const refreshUserInfo = () => {
    fetchUserInfo();
};
// 获取角色颜色
const getRoleColor = (role) => {
    const colorMap = {
        '超级管理员': 'red',
        '管理员': 'orange'
    };
    return colorMap[role] || 'blue';
};
// 获取状态颜色
const getStatusColor = (status) => {
    const colorMap = {
        '激活': 'green',
        '等待激活': 'orange',
        '未激活': 'gray',
        '封禁': 'red'
    };
    return colorMap[status] || 'blue';
};
// 获取状态文本
const getStatusText = (status) => {
    // 如果已经是中文，直接返回
    const textMap = {
        'active': '激活',
        'pending': '等待激活',
        'inactive': '未激活',
        'banned': '封禁'
    };
    return textMap[status] || status;
};
// 获取角色类型
const getRoleType = (role) => {
    const typeMap = {
        '超级管理员': 'danger',
        '管理员': 'warning'
    };
    return typeMap[role] || 'info';
};
// 获取状态类型
const getStatusType = (status) => {
    const typeMap = {
        '激活': 'success',
        '等待激活': 'warning',
        '未激活': 'info',
        '封禁': 'danger'
    };
    return typeMap[status] || 'info';
};
// 文件上传前验证
const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('只能上传 JPG/PNG 格式的图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('图片大小不能超过 2MB!');
    }
    return isJpgOrPng && isLt2M;
};
// 处理文件上传
const handleChange = (info) => {
    if (info.file.status === 'uploading') {
        return;
    }
    if (info.file.status === 'done') {
        // 处理上传成功后的逻辑
        if (info.file.response && info.file.response.url) {
            formData.avatarUrl = info.file.response.url;
            message.success('头像上传成功!');
        }
    }
    else if (info.file.status === 'error') {
        message.error('头像上传失败!');
    }
};
// 提交表单
const handleSubmit = async (values) => {
    // 验证密码
    if (formData.password && formData.password !== formData.confirmPassword) {
        message.error('两次输入的密码不一致!');
        return;
    }
    saving.value = true;
    try {
        // 准备更新数据
        const updateData = {
            nickname: formData.nickname,
            avatarUrl: formData.avatarUrl
        };
        // 如果有新密码，添加到更新数据中
        if (formData.password) {
            updateData.password = formData.password;
        }
        console.log('准备保存用户设置:', updateData);
        // 这里应该调用更新用户信息的接口
        // const response = await http.post('/m/admin/auth/updateUserInfo', updateData)
        // 暂时模拟成功响应
        message.success('设置保存成功!');
        // 清空密码字段
        formData.password = '';
        formData.confirmPassword = '';
        // 刷新用户信息
        await fetchUserInfo();
    }
    catch (error) {
        console.error('保存用户设置错误:', error);
        message.error('保存设置失败，请重试');
    }
    finally {
        saving.value = false;
    }
};
// 重置表单
const resetForm = () => {
    // 恢复到原始用户信息
    Object.assign(formData, {
        ...originalUserInfo.value,
        password: '',
        confirmPassword: ''
    });
    message.info('表单已重置');
};
// 组件挂载时获取用户信息
onMounted(() => {
    fetchUserInfo();
}); /* PartiallyEnd: #3632/scriptSetup.vue */
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
    __VLS_styleScopedClasses['avatar-uploader'];
    __VLS_styleScopedClasses['ant-upload-select-picture-card'];
    __VLS_styleScopedClasses['avatar-info'];
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("user-settings") }, });
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.ACard;
    /** @type { [typeof __VLS_components.ACard, typeof __VLS_components.aCard, typeof __VLS_components.ACard, typeof __VLS_components.aCard, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ title: ("用户设置"), loading: ((__VLS_ctx.loading)), }));
    const __VLS_2 = __VLS_1({ title: ("用户设置"), loading: ((__VLS_ctx.loading)), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const __VLS_6 = __VLS_resolvedLocalAndGlobalComponents.AForm;
    /** @type { [typeof __VLS_components.AForm, typeof __VLS_components.aForm, typeof __VLS_components.AForm, typeof __VLS_components.aForm, ] } */
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({ ...{ 'onFinish': {} }, model: ((__VLS_ctx.formData)), labelCol: (({ span: 4 })), wrapperCol: (({ span: 16 })), }));
    const __VLS_8 = __VLS_7({ ...{ 'onFinish': {} }, model: ((__VLS_ctx.formData)), labelCol: (({ span: 4 })), wrapperCol: (({ span: 16 })), }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    let __VLS_12;
    const __VLS_13 = {
        onFinish: (__VLS_ctx.handleSubmit)
    };
    let __VLS_9;
    let __VLS_10;
    const __VLS_14 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({ label: ("昵称"), name: ("nickname"), }));
    const __VLS_16 = __VLS_15({ label: ("昵称"), name: ("nickname"), }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    const __VLS_20 = __VLS_resolvedLocalAndGlobalComponents.AInput;
    /** @type { [typeof __VLS_components.AInput, typeof __VLS_components.aInput, ] } */
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({ value: ((__VLS_ctx.formData.nickname)), placeholder: ("请输入昵称"), }));
    const __VLS_22 = __VLS_21({ value: ((__VLS_ctx.formData.nickname)), placeholder: ("请输入昵称"), }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_nonNullable(__VLS_19.slots).default;
    var __VLS_19;
    const __VLS_26 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({ label: ("头像"), name: ("avatarUrl"), }));
    const __VLS_28 = __VLS_27({ label: ("头像"), name: ("avatarUrl"), }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("avatar-section") }, });
    const __VLS_32 = __VLS_resolvedLocalAndGlobalComponents.AUpload;
    /** @type { [typeof __VLS_components.AUpload, typeof __VLS_components.aUpload, typeof __VLS_components.AUpload, typeof __VLS_components.aUpload, ] } */
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({ ...{ 'onChange': {} }, fileList: ((__VLS_ctx.fileList)), name: ("avatar"), listType: ("picture-card"), ...{ class: ("avatar-uploader") }, showUploadList: ((false)), action: ("/api/upload/avatar"), beforeUpload: ((__VLS_ctx.beforeUpload)), }));
    const __VLS_34 = __VLS_33({ ...{ 'onChange': {} }, fileList: ((__VLS_ctx.fileList)), name: ("avatar"), listType: ("picture-card"), ...{ class: ("avatar-uploader") }, showUploadList: ((false)), action: ("/api/upload/avatar"), beforeUpload: ((__VLS_ctx.beforeUpload)), }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    let __VLS_38;
    const __VLS_39 = {
        onChange: (__VLS_ctx.handleChange)
    };
    let __VLS_35;
    let __VLS_36;
    if (__VLS_ctx.formData.avatarUrl) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.img)({ src: ((__VLS_ctx.formData.avatarUrl)), alt: ("avatar"), });
    }
    else {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        const __VLS_40 = __VLS_resolvedLocalAndGlobalComponents.PlusOutlined;
        /** @type { [typeof __VLS_components.PlusOutlined, ] } */
        // @ts-ignore
        const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({}));
        const __VLS_42 = __VLS_41({}, ...__VLS_functionalComponentArgsRest(__VLS_41));
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ style: ({}) }, });
    }
    __VLS_nonNullable(__VLS_37.slots).default;
    var __VLS_37;
    __VLS_nonNullable(__VLS_31.slots).default;
    var __VLS_31;
    const __VLS_46 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({ label: ("用户等级"), name: ("level"), }));
    const __VLS_48 = __VLS_47({ label: ("用户等级"), name: ("level"), }, ...__VLS_functionalComponentArgsRest(__VLS_47));
    const __VLS_52 = __VLS_resolvedLocalAndGlobalComponents.ABadge;
    /** @type { [typeof __VLS_components.ABadge, typeof __VLS_components.aBadge, ] } */
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({ count: ((__VLS_ctx.formData.level)), showZero: (true), numberStyle: (({ backgroundColor: '#52c41a' })), }));
    const __VLS_54 = __VLS_53({ count: ((__VLS_ctx.formData.level)), showZero: (true), numberStyle: (({ backgroundColor: '#52c41a' })), }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_nonNullable(__VLS_51.slots).default;
    var __VLS_51;
    const __VLS_58 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({ label: ("经验值"), name: ("experience"), }));
    const __VLS_60 = __VLS_59({ label: ("经验值"), name: ("experience"), }, ...__VLS_functionalComponentArgsRest(__VLS_59));
    const __VLS_64 = __VLS_resolvedLocalAndGlobalComponents.ABadge;
    /** @type { [typeof __VLS_components.ABadge, typeof __VLS_components.aBadge, ] } */
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({ count: ((__VLS_ctx.formData.experience)), showZero: (true), }));
    const __VLS_66 = __VLS_65({ count: ((__VLS_ctx.formData.experience)), showZero: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_nonNullable(__VLS_63.slots).default;
    var __VLS_63;
    const __VLS_70 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({ label: ("用户角色"), name: ("role"), }));
    const __VLS_72 = __VLS_71({ label: ("用户角色"), name: ("role"), }, ...__VLS_functionalComponentArgsRest(__VLS_71));
    const __VLS_76 = __VLS_resolvedLocalAndGlobalComponents.ATag;
    /** @type { [typeof __VLS_components.ATag, typeof __VLS_components.aTag, typeof __VLS_components.ATag, typeof __VLS_components.aTag, ] } */
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({ color: ((__VLS_ctx.getRoleColor(__VLS_ctx.formData.role))), }));
    const __VLS_78 = __VLS_77({ color: ((__VLS_ctx.getRoleColor(__VLS_ctx.formData.role))), }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    (__VLS_ctx.formData.role);
    __VLS_nonNullable(__VLS_81.slots).default;
    var __VLS_81;
    __VLS_nonNullable(__VLS_75.slots).default;
    var __VLS_75;
    const __VLS_82 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({ label: ("用户状态"), name: ("status"), }));
    const __VLS_84 = __VLS_83({ label: ("用户状态"), name: ("status"), }, ...__VLS_functionalComponentArgsRest(__VLS_83));
    const __VLS_88 = __VLS_resolvedLocalAndGlobalComponents.ATag;
    /** @type { [typeof __VLS_components.ATag, typeof __VLS_components.aTag, typeof __VLS_components.ATag, typeof __VLS_components.aTag, ] } */
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({ color: ((__VLS_ctx.getStatusColor(__VLS_ctx.formData.status))), }));
    const __VLS_90 = __VLS_89({ color: ((__VLS_ctx.getStatusColor(__VLS_ctx.formData.status))), }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    (__VLS_ctx.getStatusText(__VLS_ctx.formData.status));
    __VLS_nonNullable(__VLS_93.slots).default;
    var __VLS_93;
    __VLS_nonNullable(__VLS_87.slots).default;
    var __VLS_87;
    const __VLS_94 = __VLS_resolvedLocalAndGlobalComponents.ADivider;
    /** @type { [typeof __VLS_components.ADivider, typeof __VLS_components.aDivider, typeof __VLS_components.ADivider, typeof __VLS_components.aDivider, ] } */
    // @ts-ignore
    const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({}));
    const __VLS_96 = __VLS_95({}, ...__VLS_functionalComponentArgsRest(__VLS_95));
    __VLS_nonNullable(__VLS_99.slots).default;
    var __VLS_99;
    const __VLS_100 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({ label: ("新密码"), name: ("password"), }));
    const __VLS_102 = __VLS_101({ label: ("新密码"), name: ("password"), }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    const __VLS_106 = __VLS_resolvedLocalAndGlobalComponents.AInputPassword;
    /** @type { [typeof __VLS_components.AInputPassword, typeof __VLS_components.aInputPassword, ] } */
    // @ts-ignore
    const __VLS_107 = __VLS_asFunctionalComponent(__VLS_106, new __VLS_106({ value: ((__VLS_ctx.formData.password)), placeholder: ("请输入新密码（不修改请留空）"), }));
    const __VLS_108 = __VLS_107({ value: ((__VLS_ctx.formData.password)), placeholder: ("请输入新密码（不修改请留空）"), }, ...__VLS_functionalComponentArgsRest(__VLS_107));
    __VLS_nonNullable(__VLS_105.slots).default;
    var __VLS_105;
    const __VLS_112 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({ label: ("确认密码"), name: ("confirmPassword"), }));
    const __VLS_114 = __VLS_113({ label: ("确认密码"), name: ("confirmPassword"), }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    const __VLS_118 = __VLS_resolvedLocalAndGlobalComponents.AInputPassword;
    /** @type { [typeof __VLS_components.AInputPassword, typeof __VLS_components.aInputPassword, ] } */
    // @ts-ignore
    const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({ value: ((__VLS_ctx.formData.confirmPassword)), placeholder: ("请再次输入新密码"), }));
    const __VLS_120 = __VLS_119({ value: ((__VLS_ctx.formData.confirmPassword)), placeholder: ("请再次输入新密码"), }, ...__VLS_functionalComponentArgsRest(__VLS_119));
    __VLS_nonNullable(__VLS_117.slots).default;
    var __VLS_117;
    const __VLS_124 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({ wrapperCol: (({ offset: 4, span: 16 })), }));
    const __VLS_126 = __VLS_125({ wrapperCol: (({ offset: 4, span: 16 })), }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    const __VLS_130 = __VLS_resolvedLocalAndGlobalComponents.AButton;
    /** @type { [typeof __VLS_components.AButton, typeof __VLS_components.aButton, typeof __VLS_components.AButton, typeof __VLS_components.aButton, ] } */
    // @ts-ignore
    const __VLS_131 = __VLS_asFunctionalComponent(__VLS_130, new __VLS_130({ type: ("primary"), htmlType: ("submit"), loading: ((__VLS_ctx.saving)), }));
    const __VLS_132 = __VLS_131({ type: ("primary"), htmlType: ("submit"), loading: ((__VLS_ctx.saving)), }, ...__VLS_functionalComponentArgsRest(__VLS_131));
    __VLS_nonNullable(__VLS_135.slots).default;
    var __VLS_135;
    const __VLS_136 = __VLS_resolvedLocalAndGlobalComponents.AButton;
    /** @type { [typeof __VLS_components.AButton, typeof __VLS_components.aButton, typeof __VLS_components.AButton, typeof __VLS_components.aButton, ] } */
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({ ...{ 'onClick': {} }, ...{ style: ({}) }, }));
    const __VLS_138 = __VLS_137({ ...{ 'onClick': {} }, ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    let __VLS_142;
    const __VLS_143 = {
        onClick: (__VLS_ctx.resetForm)
    };
    let __VLS_139;
    let __VLS_140;
    __VLS_nonNullable(__VLS_141.slots).default;
    var __VLS_141;
    const __VLS_144 = __VLS_resolvedLocalAndGlobalComponents.AButton;
    /** @type { [typeof __VLS_components.AButton, typeof __VLS_components.aButton, typeof __VLS_components.AButton, typeof __VLS_components.aButton, ] } */
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({ ...{ 'onClick': {} }, ...{ style: ({}) }, }));
    const __VLS_146 = __VLS_145({ ...{ 'onClick': {} }, ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    let __VLS_150;
    const __VLS_151 = {
        onClick: (__VLS_ctx.refreshUserInfo)
    };
    let __VLS_147;
    let __VLS_148;
    __VLS_nonNullable(__VLS_149.slots).default;
    var __VLS_149;
    __VLS_nonNullable(__VLS_129.slots).default;
    var __VLS_129;
    __VLS_nonNullable(__VLS_11.slots).default;
    var __VLS_11;
    __VLS_nonNullable(__VLS_5.slots).default;
    var __VLS_5;
    __VLS_styleScopedClasses['user-settings'];
    __VLS_styleScopedClasses['avatar-section'];
    __VLS_styleScopedClasses['avatar-uploader'];
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
            PlusOutlined: PlusOutlined,
            formData: formData,
            fileList: fileList,
            loading: loading,
            saving: saving,
            refreshUserInfo: refreshUserInfo,
            getRoleColor: getRoleColor,
            getStatusColor: getStatusColor,
            getStatusText: getStatusText,
            beforeUpload: beforeUpload,
            handleChange: handleChange,
            handleSubmit: handleSubmit,
            resetForm: resetForm,
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
