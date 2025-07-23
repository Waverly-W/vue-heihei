import { reactive, ref, defineProps, defineEmits, watch, withDefaults } from 'vue';
const { defineSlots, defineExpose, defineModel, defineOptions, } = await import('vue');
const props = withDefaults(defineProps(), {
    statusOptions: () => [],
    statusLoading: false,
    tagOptions: () => [],
    tagLoading: false,
    isCreateMode: false
});
const emit = defineEmits(['submit', 'cancel']);
const formRef = ref();
const formState = reactive({
    title: '',
    description: '',
    answer: '',
    hints: [],
    tags: [],
    status: 'draft',
    aiGenerated: false,
    rating: 0,
    playCount: 0
});
// 表单验证规则
const rules = {
    title: [
        { required: true, message: '请输入标题' },
        { max: 200, message: '标题长度不能超过200个字符' }
    ],
    description: [
        { required: true, message: '请输入汤面' },
        { max: 2000, message: '汤面描述长度不能超过2000个字符' }
    ],
    answer: [
        { required: true, message: '请输入汤底' },
        { max: 2000, message: '汤底答案长度不能超过2000个字符' }
    ],
    status: [{ required: true, message: '请选择状态' }],
};
// 样式配置
const labelCol = { style: { width: '120px' } };
const wrapperCol = { span: 20 };
// 监听初始数据变化
watch(() => props.initialData, (newVal) => {
    if (newVal) {
        Object.assign(formState, newVal);
    }
}, { immediate: true });
const onSubmit = async () => {
    try {
        await formRef.value?.validate();
        emit('submit', { ...formState });
    }
    catch (error) {
        console.error('Validation failed:', error);
    }
};
const onCancel = () => {
    emit('cancel');
};
; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    statusOptions: () => [],
    statusLoading: false,
    tagOptions: () => [],
    tagLoading: false,
    isCreateMode: false
});
const __VLS_fnComponent = (await import('vue')).defineComponent({
    emits: {},
});
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
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.AForm;
    /** @type { [typeof __VLS_components.AForm, typeof __VLS_components.aForm, typeof __VLS_components.AForm, typeof __VLS_components.aForm, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ model: ((__VLS_ctx.formState)), labelCol: ((__VLS_ctx.labelCol)), wrapperCol: ((__VLS_ctx.wrapperCol)), rules: ((__VLS_ctx.rules)), ref: ("formRef"), }));
    const __VLS_2 = __VLS_1({ model: ((__VLS_ctx.formState)), labelCol: ((__VLS_ctx.labelCol)), wrapperCol: ((__VLS_ctx.wrapperCol)), rules: ((__VLS_ctx.rules)), ref: ("formRef"), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    // @ts-ignore navigation for `const formRef = ref()`
    __VLS_ctx.formRef;
    var __VLS_6 = {};
    const __VLS_7 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({ label: ("标题"), name: ("title"), }));
    const __VLS_9 = __VLS_8({ label: ("标题"), name: ("title"), }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const __VLS_13 = __VLS_resolvedLocalAndGlobalComponents.AInput;
    /** @type { [typeof __VLS_components.AInput, typeof __VLS_components.aInput, ] } */
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({ value: ((__VLS_ctx.formState.title)), placeholder: ("请输入汤底标题"), maxlength: ((200)), showCount: (true), }));
    const __VLS_15 = __VLS_14({ value: ((__VLS_ctx.formState.title)), placeholder: ("请输入汤底标题"), maxlength: ((200)), showCount: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    __VLS_nonNullable(__VLS_12.slots).default;
    var __VLS_12;
    const __VLS_19 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({ label: ("汤面"), name: ("description"), }));
    const __VLS_21 = __VLS_20({ label: ("汤面"), name: ("description"), }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    const __VLS_25 = __VLS_resolvedLocalAndGlobalComponents.ATextarea;
    /** @type { [typeof __VLS_components.ATextarea, typeof __VLS_components.aTextarea, ] } */
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({ value: ((__VLS_ctx.formState.description)), rows: ((4)), placeholder: ("请输入谜题描述"), maxlength: ((2000)), showCount: (true), }));
    const __VLS_27 = __VLS_26({ value: ((__VLS_ctx.formState.description)), rows: ((4)), placeholder: ("请输入谜题描述"), maxlength: ((2000)), showCount: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    __VLS_nonNullable(__VLS_24.slots).default;
    var __VLS_24;
    const __VLS_31 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({ label: ("汤底"), name: ("answer"), }));
    const __VLS_33 = __VLS_32({ label: ("汤底"), name: ("answer"), }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    const __VLS_37 = __VLS_resolvedLocalAndGlobalComponents.ATextarea;
    /** @type { [typeof __VLS_components.ATextarea, typeof __VLS_components.aTextarea, ] } */
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({ value: ((__VLS_ctx.formState.answer)), rows: ((4)), placeholder: ("请输入谜题答案"), maxlength: ((2000)), showCount: (true), }));
    const __VLS_39 = __VLS_38({ value: ((__VLS_ctx.formState.answer)), rows: ((4)), placeholder: ("请输入谜题答案"), maxlength: ((2000)), showCount: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    __VLS_nonNullable(__VLS_36.slots).default;
    var __VLS_36;
    const __VLS_43 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({ label: ("提示"), name: ("hints"), }));
    const __VLS_45 = __VLS_44({ label: ("提示"), name: ("hints"), }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    const __VLS_49 = __VLS_resolvedLocalAndGlobalComponents.ASelect;
    /** @type { [typeof __VLS_components.ASelect, typeof __VLS_components.aSelect, ] } */
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({ value: ((__VLS_ctx.formState.hints)), mode: ("tags"), placeholder: ("请输入提示内容"), }));
    const __VLS_51 = __VLS_50({ value: ((__VLS_ctx.formState.hints)), mode: ("tags"), placeholder: ("请输入提示内容"), }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    __VLS_nonNullable(__VLS_48.slots).default;
    var __VLS_48;
    const __VLS_55 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({ label: ("标签"), name: ("tags"), }));
    const __VLS_57 = __VLS_56({ label: ("标签"), name: ("tags"), }, ...__VLS_functionalComponentArgsRest(__VLS_56));
    const __VLS_61 = __VLS_resolvedLocalAndGlobalComponents.ASelect;
    /** @type { [typeof __VLS_components.ASelect, typeof __VLS_components.aSelect, typeof __VLS_components.ASelect, typeof __VLS_components.aSelect, ] } */
    // @ts-ignore
    const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({ value: ((__VLS_ctx.formState.tags)), mode: ("multiple"), placeholder: ("请选择标签"), loading: ((props.tagLoading)), }));
    const __VLS_63 = __VLS_62({ value: ((__VLS_ctx.formState.tags)), mode: ("multiple"), placeholder: ("请选择标签"), loading: ((props.tagLoading)), }, ...__VLS_functionalComponentArgsRest(__VLS_62));
    for (const [option] of __VLS_getVForSourceType((props.tagOptions))) {
        const __VLS_67 = __VLS_resolvedLocalAndGlobalComponents.ASelectOption;
        /** @type { [typeof __VLS_components.ASelectOption, typeof __VLS_components.aSelectOption, typeof __VLS_components.ASelectOption, typeof __VLS_components.aSelectOption, ] } */
        // @ts-ignore
        const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({ key: ((option.code)), value: ((option.code)), }));
        const __VLS_69 = __VLS_68({ key: ((option.code)), value: ((option.code)), }, ...__VLS_functionalComponentArgsRest(__VLS_68));
        (option.description);
        __VLS_nonNullable(__VLS_72.slots).default;
        var __VLS_72;
    }
    __VLS_nonNullable(__VLS_66.slots).default;
    var __VLS_66;
    __VLS_nonNullable(__VLS_60.slots).default;
    var __VLS_60;
    const __VLS_73 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({ label: ("状态"), name: ("status"), }));
    const __VLS_75 = __VLS_74({ label: ("状态"), name: ("status"), }, ...__VLS_functionalComponentArgsRest(__VLS_74));
    const __VLS_79 = __VLS_resolvedLocalAndGlobalComponents.ASelect;
    /** @type { [typeof __VLS_components.ASelect, typeof __VLS_components.aSelect, typeof __VLS_components.ASelect, typeof __VLS_components.aSelect, ] } */
    // @ts-ignore
    const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({ value: ((__VLS_ctx.formState.status)), loading: ((props.statusLoading)), }));
    const __VLS_81 = __VLS_80({ value: ((__VLS_ctx.formState.status)), loading: ((props.statusLoading)), }, ...__VLS_functionalComponentArgsRest(__VLS_80));
    for (const [option] of __VLS_getVForSourceType((props.statusOptions))) {
        const __VLS_85 = __VLS_resolvedLocalAndGlobalComponents.ASelectOption;
        /** @type { [typeof __VLS_components.ASelectOption, typeof __VLS_components.aSelectOption, typeof __VLS_components.ASelectOption, typeof __VLS_components.aSelectOption, ] } */
        // @ts-ignore
        const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({ key: ((option.code)), value: ((option.code)), }));
        const __VLS_87 = __VLS_86({ key: ((option.code)), value: ((option.code)), }, ...__VLS_functionalComponentArgsRest(__VLS_86));
        (option.description);
        __VLS_nonNullable(__VLS_90.slots).default;
        var __VLS_90;
    }
    __VLS_nonNullable(__VLS_84.slots).default;
    var __VLS_84;
    __VLS_nonNullable(__VLS_78.slots).default;
    var __VLS_78;
    const __VLS_91 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({ label: ("AI生成"), name: ("aiGenerated"), }));
    const __VLS_93 = __VLS_92({ label: ("AI生成"), name: ("aiGenerated"), }, ...__VLS_functionalComponentArgsRest(__VLS_92));
    const __VLS_97 = __VLS_resolvedLocalAndGlobalComponents.ASwitch;
    /** @type { [typeof __VLS_components.ASwitch, typeof __VLS_components.aSwitch, ] } */
    // @ts-ignore
    const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({ checked: ((__VLS_ctx.formState.aiGenerated)), }));
    const __VLS_99 = __VLS_98({ checked: ((__VLS_ctx.formState.aiGenerated)), }, ...__VLS_functionalComponentArgsRest(__VLS_98));
    __VLS_nonNullable(__VLS_96.slots).default;
    var __VLS_96;
    if (!props.isCreateMode) {
        const __VLS_103 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
        /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
        // @ts-ignore
        const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({ label: ("评分"), name: ("rating"), }));
        const __VLS_105 = __VLS_104({ label: ("评分"), name: ("rating"), }, ...__VLS_functionalComponentArgsRest(__VLS_104));
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("rating-display") }, });
        (__VLS_ctx.formState.rating ? __VLS_ctx.formState.rating.toFixed(2) : '暂无评分');
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("rating-note") }, });
        __VLS_nonNullable(__VLS_108.slots).default;
        var __VLS_108;
        const __VLS_109 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
        /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
        // @ts-ignore
        const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({ label: ("游戏次数"), name: ("playCount"), }));
        const __VLS_111 = __VLS_110({ label: ("游戏次数"), name: ("playCount"), }, ...__VLS_functionalComponentArgsRest(__VLS_110));
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("play-count-display") }, });
        (__VLS_ctx.formState.playCount || 0);
        __VLS_nonNullable(__VLS_114.slots).default;
        var __VLS_114;
    }
    const __VLS_115 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({ wrapperCol: (({ span: 14, offset: 4 })), }));
    const __VLS_117 = __VLS_116({ wrapperCol: (({ span: 14, offset: 4 })), }, ...__VLS_functionalComponentArgsRest(__VLS_116));
    const __VLS_121 = __VLS_resolvedLocalAndGlobalComponents.AButton;
    /** @type { [typeof __VLS_components.AButton, typeof __VLS_components.aButton, typeof __VLS_components.AButton, typeof __VLS_components.aButton, ] } */
    // @ts-ignore
    const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({ ...{ 'onClick': {} }, type: ("primary"), }));
    const __VLS_123 = __VLS_122({ ...{ 'onClick': {} }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_122));
    let __VLS_127;
    const __VLS_128 = {
        onClick: (__VLS_ctx.onSubmit)
    };
    let __VLS_124;
    let __VLS_125;
    (props.isCreateMode ? '创建' : '保存');
    __VLS_nonNullable(__VLS_126.slots).default;
    var __VLS_126;
    const __VLS_129 = __VLS_resolvedLocalAndGlobalComponents.AButton;
    /** @type { [typeof __VLS_components.AButton, typeof __VLS_components.aButton, typeof __VLS_components.AButton, typeof __VLS_components.aButton, ] } */
    // @ts-ignore
    const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({ ...{ 'onClick': {} }, ...{ style: ({}) }, }));
    const __VLS_131 = __VLS_130({ ...{ 'onClick': {} }, ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_130));
    let __VLS_135;
    const __VLS_136 = {
        onClick: (__VLS_ctx.onCancel)
    };
    let __VLS_132;
    let __VLS_133;
    __VLS_nonNullable(__VLS_134.slots).default;
    var __VLS_134;
    __VLS_nonNullable(__VLS_120.slots).default;
    var __VLS_120;
    __VLS_nonNullable(__VLS_5.slots).default;
    var __VLS_5;
    __VLS_styleScopedClasses['rating-display'];
    __VLS_styleScopedClasses['rating-note'];
    __VLS_styleScopedClasses['play-count-display'];
    var __VLS_slots;
    var __VLS_inheritedAttrs;
    const __VLS_refs = {
        "formRef": __VLS_6,
    };
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
            formRef: formRef,
            formState: formState,
            rules: rules,
            labelCol: labelCol,
            wrapperCol: wrapperCol,
            onSubmit: onSubmit,
            onCancel: onCancel,
        };
    },
    emits: {},
    __typeProps: {},
    props: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    emits: {},
    __typeProps: {},
    props: {},
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
