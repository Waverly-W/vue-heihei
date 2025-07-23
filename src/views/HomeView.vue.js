import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { FileTextOutlined, AuditOutlined, BarChartOutlined, SettingOutlined, DownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { clearUserInfo } from '../utils/auth';
import { http } from '../utils/http';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const route = useRoute();
const router = useRouter();
// 用户信息
const userInfo = ref({
    nickname: '',
    avatarUrl: '',
    role: '',
    level: 0
});
// 获取用户信息
const fetchUserInfo = async () => {
    try {
        const response = await http.post('/m/admin/auth/userInfo');
        if (response.code === 0 || response.code === 200) {
            userInfo.value = response.data;
        }
    }
    catch (error) {
        console.error('获取用户信息失败:', error);
    }
};
// 获取用户显示名称
const displayName = computed(() => {
    return userInfo.value.nickname || '管理员';
});
// 获取头像字符
const avatarChar = computed(() => {
    const name = userInfo.value.nickname || '管理员';
    return name.charAt(0).toUpperCase();
});
// 根据当前路由计算激活的菜单项
const selectedKeys = computed(() => {
    const path = route.path;
    if (path.startsWith('/puzzles')) {
        return ['puzzles'];
    }
    else if (path.startsWith('/reviews')) {
        return ['reviews'];
    }
    else if (path.startsWith('/reports')) {
        return ['reports'];
    }
    else if (path.startsWith('/settings')) {
        return ['settings'];
    }
    return ['puzzles'];
});
// 处理用户菜单点击
const handleUserMenuClick = ({ key }) => {
    if (key === 'settings') {
        router.push('/settings/user-settings');
    }
    else if (key === 'logout') {
        clearUserInfo();
        message.success('已退出登录');
        router.push('/login');
    }
};
// 组件挂载时获取用户信息
onMounted(() => {
    fetchUserInfo();
});
; /* PartiallyEnd: #3632/scriptSetup.vue */
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
    __VLS_styleScopedClasses['nav-menu'];
    __VLS_styleScopedClasses['nav-menu'];
    __VLS_styleScopedClasses['ant-menu-item'];
    __VLS_styleScopedClasses['nav-menu'];
    __VLS_styleScopedClasses['nav-menu'];
    __VLS_styleScopedClasses['ant-menu-item'];
    __VLS_styleScopedClasses['nav-menu'];
    __VLS_styleScopedClasses['ant-menu-item'];
    __VLS_styleScopedClasses['nav-menu'];
    __VLS_styleScopedClasses['nav-menu'];
    __VLS_styleScopedClasses['ant-menu-item'];
    __VLS_styleScopedClasses['anticon'];
    __VLS_styleScopedClasses['logo'];
    __VLS_styleScopedClasses['user-avatar-wrapper'];
    __VLS_styleScopedClasses['ant-layout-content'];
    __VLS_styleScopedClasses['site-layout-content'];
    __VLS_styleScopedClasses['header-content'];
    __VLS_styleScopedClasses['nav-menu'];
    __VLS_styleScopedClasses['ant-menu-item'];
    __VLS_styleScopedClasses['user-info'];
    __VLS_styleScopedClasses['user-avatar-wrapper'];
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.ALayout;
    /** @type { [typeof __VLS_components.ALayout, typeof __VLS_components.aLayout, typeof __VLS_components.ALayout, typeof __VLS_components.aLayout, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ...{ class: ("layout") }, }));
    const __VLS_2 = __VLS_1({ ...{ class: ("layout") }, }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_6 = {};
    const __VLS_7 = __VLS_resolvedLocalAndGlobalComponents.ALayoutHeader;
    /** @type { [typeof __VLS_components.ALayoutHeader, typeof __VLS_components.aLayoutHeader, typeof __VLS_components.ALayoutHeader, typeof __VLS_components.aLayoutHeader, ] } */
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({ ...{ class: ("header") }, }));
    const __VLS_9 = __VLS_8({ ...{ class: ("header") }, }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("header-content") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("logo") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.img)({ src: ("@/assets/logo.png"), alt: ("Logo"), });
    const __VLS_13 = __VLS_resolvedLocalAndGlobalComponents.AMenu;
    /** @type { [typeof __VLS_components.AMenu, typeof __VLS_components.aMenu, typeof __VLS_components.AMenu, typeof __VLS_components.aMenu, ] } */
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({ selectedKeys: ((__VLS_ctx.selectedKeys)), mode: ("horizontal"), ...{ class: ("nav-menu") }, }));
    const __VLS_15 = __VLS_14({ selectedKeys: ((__VLS_ctx.selectedKeys)), mode: ("horizontal"), ...{ class: ("nav-menu") }, }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const __VLS_19 = __VLS_resolvedLocalAndGlobalComponents.AMenuItem;
    /** @type { [typeof __VLS_components.AMenuItem, typeof __VLS_components.aMenuItem, typeof __VLS_components.AMenuItem, typeof __VLS_components.aMenuItem, ] } */
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({ key: ("puzzles"), }));
    const __VLS_21 = __VLS_20({ key: ("puzzles"), }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { icon: __VLS_thisSlot } = __VLS_nonNullable(__VLS_24.slots);
        const __VLS_25 = __VLS_resolvedLocalAndGlobalComponents.FileTextOutlined;
        /** @type { [typeof __VLS_components.FileTextOutlined, ] } */
        // @ts-ignore
        const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({}));
        const __VLS_27 = __VLS_26({}, ...__VLS_functionalComponentArgsRest(__VLS_26));
    }
    const __VLS_31 = __VLS_resolvedLocalAndGlobalComponents.RouterLink;
    /** @type { [typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ] } */
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({ to: ("/puzzles"), }));
    const __VLS_33 = __VLS_32({ to: ("/puzzles"), }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    __VLS_nonNullable(__VLS_36.slots).default;
    var __VLS_36;
    var __VLS_24;
    const __VLS_37 = __VLS_resolvedLocalAndGlobalComponents.AMenuItem;
    /** @type { [typeof __VLS_components.AMenuItem, typeof __VLS_components.aMenuItem, typeof __VLS_components.AMenuItem, typeof __VLS_components.aMenuItem, ] } */
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({ key: ("reviews"), }));
    const __VLS_39 = __VLS_38({ key: ("reviews"), }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { icon: __VLS_thisSlot } = __VLS_nonNullable(__VLS_42.slots);
        const __VLS_43 = __VLS_resolvedLocalAndGlobalComponents.AuditOutlined;
        /** @type { [typeof __VLS_components.AuditOutlined, ] } */
        // @ts-ignore
        const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({}));
        const __VLS_45 = __VLS_44({}, ...__VLS_functionalComponentArgsRest(__VLS_44));
    }
    const __VLS_49 = __VLS_resolvedLocalAndGlobalComponents.RouterLink;
    /** @type { [typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ] } */
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({ to: ("/reviews"), }));
    const __VLS_51 = __VLS_50({ to: ("/reviews"), }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    __VLS_nonNullable(__VLS_54.slots).default;
    var __VLS_54;
    var __VLS_42;
    const __VLS_55 = __VLS_resolvedLocalAndGlobalComponents.AMenuItem;
    /** @type { [typeof __VLS_components.AMenuItem, typeof __VLS_components.aMenuItem, typeof __VLS_components.AMenuItem, typeof __VLS_components.aMenuItem, ] } */
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({ key: ("reports"), }));
    const __VLS_57 = __VLS_56({ key: ("reports"), }, ...__VLS_functionalComponentArgsRest(__VLS_56));
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { icon: __VLS_thisSlot } = __VLS_nonNullable(__VLS_60.slots);
        const __VLS_61 = __VLS_resolvedLocalAndGlobalComponents.BarChartOutlined;
        /** @type { [typeof __VLS_components.BarChartOutlined, ] } */
        // @ts-ignore
        const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({}));
        const __VLS_63 = __VLS_62({}, ...__VLS_functionalComponentArgsRest(__VLS_62));
    }
    const __VLS_67 = __VLS_resolvedLocalAndGlobalComponents.RouterLink;
    /** @type { [typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ] } */
    // @ts-ignore
    const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({ to: ("/reports"), }));
    const __VLS_69 = __VLS_68({ to: ("/reports"), }, ...__VLS_functionalComponentArgsRest(__VLS_68));
    __VLS_nonNullable(__VLS_72.slots).default;
    var __VLS_72;
    var __VLS_60;
    const __VLS_73 = __VLS_resolvedLocalAndGlobalComponents.AMenuItem;
    /** @type { [typeof __VLS_components.AMenuItem, typeof __VLS_components.aMenuItem, typeof __VLS_components.AMenuItem, typeof __VLS_components.aMenuItem, ] } */
    // @ts-ignore
    const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({ key: ("settings"), }));
    const __VLS_75 = __VLS_74({ key: ("settings"), }, ...__VLS_functionalComponentArgsRest(__VLS_74));
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { icon: __VLS_thisSlot } = __VLS_nonNullable(__VLS_78.slots);
        const __VLS_79 = __VLS_resolvedLocalAndGlobalComponents.SettingOutlined;
        /** @type { [typeof __VLS_components.SettingOutlined, ] } */
        // @ts-ignore
        const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({}));
        const __VLS_81 = __VLS_80({}, ...__VLS_functionalComponentArgsRest(__VLS_80));
    }
    const __VLS_85 = __VLS_resolvedLocalAndGlobalComponents.RouterLink;
    /** @type { [typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ] } */
    // @ts-ignore
    const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({ to: ("/settings"), }));
    const __VLS_87 = __VLS_86({ to: ("/settings"), }, ...__VLS_functionalComponentArgsRest(__VLS_86));
    __VLS_nonNullable(__VLS_90.slots).default;
    var __VLS_90;
    var __VLS_78;
    __VLS_nonNullable(__VLS_18.slots).default;
    var __VLS_18;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("user-info") }, });
    const __VLS_91 = __VLS_resolvedLocalAndGlobalComponents.ADropdown;
    /** @type { [typeof __VLS_components.ADropdown, typeof __VLS_components.aDropdown, typeof __VLS_components.ADropdown, typeof __VLS_components.aDropdown, ] } */
    // @ts-ignore
    const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({}));
    const __VLS_93 = __VLS_92({}, ...__VLS_functionalComponentArgsRest(__VLS_92));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("user-avatar-wrapper") }, });
    if (__VLS_ctx.userInfo.avatarUrl) {
        const __VLS_97 = __VLS_resolvedLocalAndGlobalComponents.AAvatar;
        /** @type { [typeof __VLS_components.AAvatar, typeof __VLS_components.aAvatar, ] } */
        // @ts-ignore
        const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({ src: ((__VLS_ctx.userInfo.avatarUrl)), }));
        const __VLS_99 = __VLS_98({ src: ((__VLS_ctx.userInfo.avatarUrl)), }, ...__VLS_functionalComponentArgsRest(__VLS_98));
    }
    else {
        const __VLS_103 = __VLS_resolvedLocalAndGlobalComponents.AAvatar;
        /** @type { [typeof __VLS_components.AAvatar, typeof __VLS_components.aAvatar, typeof __VLS_components.AAvatar, typeof __VLS_components.aAvatar, ] } */
        // @ts-ignore
        const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({ ...{ style: ({}) }, }));
        const __VLS_105 = __VLS_104({ ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_104));
        (__VLS_ctx.avatarChar);
        __VLS_nonNullable(__VLS_108.slots).default;
        var __VLS_108;
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.displayName);
    const __VLS_109 = __VLS_resolvedLocalAndGlobalComponents.DownOutlined;
    /** @type { [typeof __VLS_components.DownOutlined, ] } */
    // @ts-ignore
    const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({}));
    const __VLS_111 = __VLS_110({}, ...__VLS_functionalComponentArgsRest(__VLS_110));
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { overlay: __VLS_thisSlot } = __VLS_nonNullable(__VLS_96.slots);
        const __VLS_115 = __VLS_resolvedLocalAndGlobalComponents.AMenu;
        /** @type { [typeof __VLS_components.AMenu, typeof __VLS_components.aMenu, typeof __VLS_components.AMenu, typeof __VLS_components.aMenu, ] } */
        // @ts-ignore
        const __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({ ...{ 'onClick': {} }, }));
        const __VLS_117 = __VLS_116({ ...{ 'onClick': {} }, }, ...__VLS_functionalComponentArgsRest(__VLS_116));
        let __VLS_121;
        const __VLS_122 = {
            onClick: (__VLS_ctx.handleUserMenuClick)
        };
        let __VLS_118;
        let __VLS_119;
        const __VLS_123 = __VLS_resolvedLocalAndGlobalComponents.AMenuItem;
        /** @type { [typeof __VLS_components.AMenuItem, typeof __VLS_components.aMenuItem, typeof __VLS_components.AMenuItem, typeof __VLS_components.aMenuItem, ] } */
        // @ts-ignore
        const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({ key: ("settings"), }));
        const __VLS_125 = __VLS_124({ key: ("settings"), }, ...__VLS_functionalComponentArgsRest(__VLS_124));
        __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
        {
            const { icon: __VLS_thisSlot } = __VLS_nonNullable(__VLS_128.slots);
            const __VLS_129 = __VLS_resolvedLocalAndGlobalComponents.SettingOutlined;
            /** @type { [typeof __VLS_components.SettingOutlined, ] } */
            // @ts-ignore
            const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({}));
            const __VLS_131 = __VLS_130({}, ...__VLS_functionalComponentArgsRest(__VLS_130));
        }
        var __VLS_128;
        const __VLS_135 = __VLS_resolvedLocalAndGlobalComponents.AMenuItem;
        /** @type { [typeof __VLS_components.AMenuItem, typeof __VLS_components.aMenuItem, typeof __VLS_components.AMenuItem, typeof __VLS_components.aMenuItem, ] } */
        // @ts-ignore
        const __VLS_136 = __VLS_asFunctionalComponent(__VLS_135, new __VLS_135({ key: ("logout"), danger: (true), }));
        const __VLS_137 = __VLS_136({ key: ("logout"), danger: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_136));
        __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
        {
            const { icon: __VLS_thisSlot } = __VLS_nonNullable(__VLS_140.slots);
            const __VLS_141 = __VLS_resolvedLocalAndGlobalComponents.LogoutOutlined;
            /** @type { [typeof __VLS_components.LogoutOutlined, ] } */
            // @ts-ignore
            const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({}));
            const __VLS_143 = __VLS_142({}, ...__VLS_functionalComponentArgsRest(__VLS_142));
        }
        var __VLS_140;
        __VLS_nonNullable(__VLS_120.slots).default;
        var __VLS_120;
    }
    var __VLS_96;
    __VLS_nonNullable(__VLS_12.slots).default;
    var __VLS_12;
    const __VLS_147 = __VLS_resolvedLocalAndGlobalComponents.ALayoutContent;
    /** @type { [typeof __VLS_components.ALayoutContent, typeof __VLS_components.aLayoutContent, typeof __VLS_components.ALayoutContent, typeof __VLS_components.aLayoutContent, ] } */
    // @ts-ignore
    const __VLS_148 = __VLS_asFunctionalComponent(__VLS_147, new __VLS_147({ ...{ style: ({}) }, }));
    const __VLS_149 = __VLS_148({ ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_148));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("site-layout-content") }, });
    const __VLS_153 = __VLS_resolvedLocalAndGlobalComponents.RouterView;
    /** @type { [typeof __VLS_components.RouterView, ] } */
    // @ts-ignore
    const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({}));
    const __VLS_155 = __VLS_154({}, ...__VLS_functionalComponentArgsRest(__VLS_154));
    __VLS_nonNullable(__VLS_152.slots).default;
    var __VLS_152;
    const __VLS_159 = __VLS_resolvedLocalAndGlobalComponents.ALayoutFooter;
    /** @type { [typeof __VLS_components.ALayoutFooter, typeof __VLS_components.aLayoutFooter, typeof __VLS_components.ALayoutFooter, typeof __VLS_components.aLayoutFooter, ] } */
    // @ts-ignore
    const __VLS_160 = __VLS_asFunctionalComponent(__VLS_159, new __VLS_159({ ...{ style: ({}) }, }));
    const __VLS_161 = __VLS_160({ ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_160));
    __VLS_nonNullable(__VLS_164.slots).default;
    var __VLS_164;
    __VLS_nonNullable(__VLS_5.slots).default;
    var __VLS_5;
    __VLS_styleScopedClasses['layout'];
    __VLS_styleScopedClasses['header'];
    __VLS_styleScopedClasses['header-content'];
    __VLS_styleScopedClasses['logo'];
    __VLS_styleScopedClasses['nav-menu'];
    __VLS_styleScopedClasses['user-info'];
    __VLS_styleScopedClasses['user-avatar-wrapper'];
    __VLS_styleScopedClasses['site-layout-content'];
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
            FileTextOutlined: FileTextOutlined,
            AuditOutlined: AuditOutlined,
            BarChartOutlined: BarChartOutlined,
            SettingOutlined: SettingOutlined,
            DownOutlined: DownOutlined,
            LogoutOutlined: LogoutOutlined,
            userInfo: userInfo,
            displayName: displayName,
            avatarChar: avatarChar,
            selectedKeys: selectedKeys,
            handleUserMenuClick: handleUserMenuClick,
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
