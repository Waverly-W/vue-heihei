import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import PuzzleForm from '../../components/business/PuzzleForm.vue';
import { http } from '../../utils/http';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const router = useRouter();
const puzzleFace = ref('');
const puzzleBase = ref('');
const parsing = ref(false);
const formData = ref(null);
// 处理文本解析
const handleParse = async () => {
    if (!puzzleFace.value.trim() || !puzzleBase.value.trim()) {
        message.warning('请输入汤面和汤底文本');
        return;
    }
    parsing.value = true;
    try {
        const response = await http.post('/manage/puzzle/parse', {
            puzzleFace: puzzleFace.value.trim(),
            puzzleBase: puzzleBase.value.trim()
        });
        if (response) {
            formData.value = response;
            message.success('解析成功');
        }
    }
    catch (error) {
        message.error('解析失败');
        console.error('Failed to parse text:', error);
    }
    finally {
        parsing.value = false;
    }
};
// 处理表单提交
const handleSubmit = async (formState) => {
    try {
        // 转换为后端需要的格式
        const submitData = {
            difficultyLevel: formState.difficultyLevel,
            theme: formState.theme,
            prompt: formState.prompt,
            solution: formState.solution,
            keyPoints: formState.keyPoints,
            isActive: formState.active,
            score: {
                logicScore: formState.score.logicScore,
                funScore: formState.score.funScore,
                difficultyScore: formState.score.difficultyScore,
                diversityScore: formState.score.diversityScore,
                totalScore: formState.score.totalScore
            }
        };
        await http.post('/manage/puzzle/save', submitData);
        message.success('创建成功');
        router.push('/puzzles');
    }
    catch (error) {
        message.error('创建失败');
        console.error('Failed to create puzzle:', error);
    }
};
// 处理取消
const handleCancel = () => {
    router.push('/puzzles');
};
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
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("create-puzzle") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("parse-section") }, });
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.AForm;
    /** @type { [typeof __VLS_components.AForm, typeof __VLS_components.aForm, typeof __VLS_components.AForm, typeof __VLS_components.aForm, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ layout: ("vertical"), }));
    const __VLS_2 = __VLS_1({ layout: ("vertical"), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const __VLS_6 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({ label: ("汤面"), }));
    const __VLS_8 = __VLS_7({ label: ("汤面"), }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    const __VLS_12 = __VLS_resolvedLocalAndGlobalComponents.ATextarea;
    /** @type { [typeof __VLS_components.ATextarea, typeof __VLS_components.aTextarea, ] } */
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({ value: ((__VLS_ctx.puzzleFace)), rows: ((4)), placeholder: ("请输入汤面文本"), }));
    const __VLS_14 = __VLS_13({ value: ((__VLS_ctx.puzzleFace)), rows: ((4)), placeholder: ("请输入汤面文本"), }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_nonNullable(__VLS_11.slots).default;
    var __VLS_11;
    const __VLS_18 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({ label: ("汤底"), }));
    const __VLS_20 = __VLS_19({ label: ("汤底"), }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    const __VLS_24 = __VLS_resolvedLocalAndGlobalComponents.ATextarea;
    /** @type { [typeof __VLS_components.ATextarea, typeof __VLS_components.aTextarea, ] } */
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({ value: ((__VLS_ctx.puzzleBase)), rows: ((4)), placeholder: ("请输入汤底文本"), }));
    const __VLS_26 = __VLS_25({ value: ((__VLS_ctx.puzzleBase)), rows: ((4)), placeholder: ("请输入汤底文本"), }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_nonNullable(__VLS_23.slots).default;
    var __VLS_23;
    const __VLS_30 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({}));
    const __VLS_32 = __VLS_31({}, ...__VLS_functionalComponentArgsRest(__VLS_31));
    const __VLS_36 = __VLS_resolvedLocalAndGlobalComponents.AButton;
    /** @type { [typeof __VLS_components.AButton, typeof __VLS_components.aButton, typeof __VLS_components.AButton, typeof __VLS_components.aButton, ] } */
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({ ...{ 'onClick': {} }, type: ("primary"), loading: ((__VLS_ctx.parsing)), }));
    const __VLS_38 = __VLS_37({ ...{ 'onClick': {} }, type: ("primary"), loading: ((__VLS_ctx.parsing)), }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    let __VLS_42;
    const __VLS_43 = {
        onClick: (__VLS_ctx.handleParse)
    };
    let __VLS_39;
    let __VLS_40;
    __VLS_nonNullable(__VLS_41.slots).default;
    var __VLS_41;
    __VLS_nonNullable(__VLS_35.slots).default;
    var __VLS_35;
    __VLS_nonNullable(__VLS_5.slots).default;
    var __VLS_5;
    const __VLS_44 = __VLS_resolvedLocalAndGlobalComponents.ADivider;
    /** @type { [typeof __VLS_components.ADivider, typeof __VLS_components.aDivider, ] } */
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({}));
    const __VLS_46 = __VLS_45({}, ...__VLS_functionalComponentArgsRest(__VLS_45));
    // @ts-ignore
    [PuzzleForm,];
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent(PuzzleForm, new PuzzleForm({ ...{ 'onSubmit': {} }, ...{ 'onCancel': {} }, initialData: ((__VLS_ctx.formData)), }));
    const __VLS_51 = __VLS_50({ ...{ 'onSubmit': {} }, ...{ 'onCancel': {} }, initialData: ((__VLS_ctx.formData)), }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    let __VLS_55;
    const __VLS_56 = {
        onSubmit: (__VLS_ctx.handleSubmit)
    };
    const __VLS_57 = {
        onCancel: (__VLS_ctx.handleCancel)
    };
    let __VLS_52;
    let __VLS_53;
    var __VLS_54;
    __VLS_styleScopedClasses['create-puzzle'];
    __VLS_styleScopedClasses['parse-section'];
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
            PuzzleForm: PuzzleForm,
            puzzleFace: puzzleFace,
            puzzleBase: puzzleBase,
            parsing: parsing,
            formData: formData,
            handleParse: handleParse,
            handleSubmit: handleSubmit,
            handleCancel: handleCancel,
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
