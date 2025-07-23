import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { SettingOutlined, OrderedListOutlined, UserOutlined } from '@ant-design/icons-vue';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const router = useRouter();
const route = useRoute();
// 根据当前路由计算激活的菜单项
const selectedKeys = computed(() => {
    const path = route.path;
    if (path.includes('enum-management')) {
        return ['enum'];
    }
    else if (path.includes('user-settings')) {
        return ['user-settings'];
    }
    else {
        return ['general'];
    }
});
// 处理菜单选择
const handleMenuSelect = ({ key }) => {
    if (key === 'enum') {
        router.push('/settings/enum-management');
    }
    else if (key === 'user-settings') {
        router.push('/settings/user-settings');
    }
    else {
        router.push('/settings/general');
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
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("settings-container") }, });
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.ARow;
    /** @type { [typeof __VLS_components.ARow, typeof __VLS_components.aRow, typeof __VLS_components.ARow, typeof __VLS_components.aRow, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ gutter: ((16)), }));
    const __VLS_2 = __VLS_1({ gutter: ((16)), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const __VLS_6 = __VLS_resolvedLocalAndGlobalComponents.ACol;
    /** @type { [typeof __VLS_components.ACol, typeof __VLS_components.aCol, typeof __VLS_components.ACol, typeof __VLS_components.aCol, ] } */
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({ span: ((4)), }));
    const __VLS_8 = __VLS_7({ span: ((4)), }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    const __VLS_12 = __VLS_resolvedLocalAndGlobalComponents.AMenu;
    /** @type { [typeof __VLS_components.AMenu, typeof __VLS_components.aMenu, typeof __VLS_components.AMenu, typeof __VLS_components.aMenu, ] } */
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({ ...{ 'onSelect': {} }, selectedKeys: ((__VLS_ctx.selectedKeys)), mode: ("inline"), ...{ style: ({}) }, }));
    const __VLS_14 = __VLS_13({ ...{ 'onSelect': {} }, selectedKeys: ((__VLS_ctx.selectedKeys)), mode: ("inline"), ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    let __VLS_18;
    const __VLS_19 = {
        onSelect: (__VLS_ctx.handleMenuSelect)
    };
    let __VLS_15;
    let __VLS_16;
    const __VLS_20 = __VLS_resolvedLocalAndGlobalComponents.AMenuItem;
    /** @type { [typeof __VLS_components.AMenuItem, typeof __VLS_components.aMenuItem, typeof __VLS_components.AMenuItem, typeof __VLS_components.aMenuItem, ] } */
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({ key: ("general"), }));
    const __VLS_22 = __VLS_21({ key: ("general"), }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { icon: __VLS_thisSlot } = __VLS_nonNullable(__VLS_25.slots);
        const __VLS_26 = __VLS_resolvedLocalAndGlobalComponents.SettingOutlined;
        /** @type { [typeof __VLS_components.SettingOutlined, ] } */
        // @ts-ignore
        const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({}));
        const __VLS_28 = __VLS_27({}, ...__VLS_functionalComponentArgsRest(__VLS_27));
    }
    var __VLS_25;
    const __VLS_32 = __VLS_resolvedLocalAndGlobalComponents.AMenuItem;
    /** @type { [typeof __VLS_components.AMenuItem, typeof __VLS_components.aMenuItem, typeof __VLS_components.AMenuItem, typeof __VLS_components.aMenuItem, ] } */
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({ key: ("user-settings"), }));
    const __VLS_34 = __VLS_33({ key: ("user-settings"), }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { icon: __VLS_thisSlot } = __VLS_nonNullable(__VLS_37.slots);
        const __VLS_38 = __VLS_resolvedLocalAndGlobalComponents.UserOutlined;
        /** @type { [typeof __VLS_components.UserOutlined, ] } */
        // @ts-ignore
        const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({}));
        const __VLS_40 = __VLS_39({}, ...__VLS_functionalComponentArgsRest(__VLS_39));
    }
    var __VLS_37;
    const __VLS_44 = __VLS_resolvedLocalAndGlobalComponents.AMenuItem;
    /** @type { [typeof __VLS_components.AMenuItem, typeof __VLS_components.aMenuItem, typeof __VLS_components.AMenuItem, typeof __VLS_components.aMenuItem, ] } */
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({ key: ("enum"), }));
    const __VLS_46 = __VLS_45({ key: ("enum"), }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { icon: __VLS_thisSlot } = __VLS_nonNullable(__VLS_49.slots);
        const __VLS_50 = __VLS_resolvedLocalAndGlobalComponents.OrderedListOutlined;
        /** @type { [typeof __VLS_components.OrderedListOutlined, ] } */
        // @ts-ignore
        const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({}));
        const __VLS_52 = __VLS_51({}, ...__VLS_functionalComponentArgsRest(__VLS_51));
    }
    var __VLS_49;
    __VLS_nonNullable(__VLS_17.slots).default;
    var __VLS_17;
    __VLS_nonNullable(__VLS_11.slots).default;
    var __VLS_11;
    const __VLS_56 = __VLS_resolvedLocalAndGlobalComponents.ACol;
    /** @type { [typeof __VLS_components.ACol, typeof __VLS_components.aCol, typeof __VLS_components.ACol, typeof __VLS_components.aCol, ] } */
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({ span: ((20)), }));
    const __VLS_58 = __VLS_57({ span: ((20)), }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    const __VLS_62 = __VLS_resolvedLocalAndGlobalComponents.RouterView;
    /** @type { [typeof __VLS_components.RouterView, typeof __VLS_components.routerView, typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ] } */
    // @ts-ignore
    const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({}));
    const __VLS_64 = __VLS_63({}, ...__VLS_functionalComponentArgsRest(__VLS_63));
    __VLS_nonNullable(__VLS_61.slots).default;
    var __VLS_61;
    __VLS_nonNullable(__VLS_5.slots).default;
    var __VLS_5;
    __VLS_styleScopedClasses['settings-container'];
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
            SettingOutlined: SettingOutlined,
            OrderedListOutlined: OrderedListOutlined,
            UserOutlined: UserOutlined,
            selectedKeys: selectedKeys,
            handleMenuSelect: handleMenuSelect,
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
