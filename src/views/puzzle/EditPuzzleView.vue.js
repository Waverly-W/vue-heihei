import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import PuzzleForm from '../../components/business/PuzzleForm.vue';
import { http } from '../../utils/http';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const route = useRoute();
const router = useRouter();
const puzzleData = ref(null);
// 获取谜题数据
const fetchPuzzleData = async () => {
    // 根据路由参数获取
    try {
        const response = await http.get(`/m/soup/${route.params.id}`);
        console.log('Fetched puzzle data:', response);
        if ((response.code === 0 || response.code === 200) && response.data) {
            // 转换API返回的数据结构为表单需要的格式
            const apiData = response.data;
            puzzleData.value = {
                id: apiData.id,
                title: apiData.title,
                description: apiData.description,
                answer: apiData.answer,
                hints: apiData.hints || [],
                tags: apiData.tags || [],
                status: apiData.status,
                aiGenerated: apiData.aiGenerated,
                rating: apiData.rating,
                playCount: apiData.playCount,
                createdBy: apiData.createdBy,
                createdAt: apiData.createdAt,
                updatedAt: apiData.updatedAt
            };
        }
    }
    catch (error) {
        message.error('获取谜题数据失败');
        console.error('Failed to fetch puzzle:', error);
    }
};
// 处理表单提交
const handleSubmit = async (formData) => {
    try {
        // 构建更新请求的数据结构，必须包含id字段
        const updateData = {
            id: route.params.id, // 必需字段
            title: formData.title,
            description: formData.description,
            answer: formData.answer,
            hints: formData.hints,
            tags: formData.tags,
            status: formData.status,
            aiGenerated: formData.aiGenerated
            // rating 字段在更新时可以包含，但通常由系统管理
        };
        const response = await http.put('/m/soup/update', updateData);
        console.log('Update response:', response);
        if (response.code === 0 || response.code === 200) {
            message.success('保存成功');
            router.push('/puzzles');
        }
        else {
            message.error(response.message || '保存失败');
        }
    }
    catch (error) {
        message.error('保存失败');
        console.error('Failed to save puzzle:', error);
    }
};
// 处理取消
const handleCancel = () => {
    router.push('/puzzles');
};
onMounted(() => {
    fetchPuzzleData();
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
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("edit-puzzle") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
    // @ts-ignore
    [PuzzleForm,];
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(PuzzleForm, new PuzzleForm({ ...{ 'onSubmit': {} }, ...{ 'onCancel': {} }, initialData: ((__VLS_ctx.puzzleData)), }));
    const __VLS_1 = __VLS_0({ ...{ 'onSubmit': {} }, ...{ 'onCancel': {} }, initialData: ((__VLS_ctx.puzzleData)), }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    let __VLS_5;
    const __VLS_6 = {
        onSubmit: (__VLS_ctx.handleSubmit)
    };
    const __VLS_7 = {
        onCancel: (__VLS_ctx.handleCancel)
    };
    let __VLS_2;
    let __VLS_3;
    var __VLS_4;
    __VLS_styleScopedClasses['edit-puzzle'];
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
            puzzleData: puzzleData,
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
