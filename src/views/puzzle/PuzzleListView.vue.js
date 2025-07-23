import { ref, onMounted, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { http } from '../../utils/http';
import PuzzleForm from '../../components/business/PuzzleForm.vue';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
// 时间格式化函数
const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr)
        return '';
    const date = new Date(dateTimeStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
    },
    {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        width: 200,
    },
    {
        title: '标签',
        dataIndex: 'tags',
        key: 'tags',
        width: 150,
    },
    {
        title: '评分',
        dataIndex: 'rating',
        key: 'rating',
        width: 120,
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 80,
    },
    {
        title: '操作',
        key: 'action',
        width: 100,
    },
];
const tableData = ref([]);
const loading = ref(false);
const pagination = ref({
    total: 0,
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`,
});
const searchForm = reactive({
    titleKeyword: undefined,
    tags: undefined,
    status: undefined,
    createdBy: undefined,
    aiGenerated: undefined,
    minRating: undefined,
    createdAtStart: undefined,
    createdAtEnd: undefined
});
const detailModalVisible = ref(false);
const currentPuzzle = ref(null);
const isEditMode = ref(false);
const editFormData = ref(null);
// 创建弹窗相关状态
const createModalVisible = ref(false);
const createFormData = ref(null);
// 枚举值数据
const statusOptions = ref([]);
const statusLoading = ref(false);
const tagOptions = ref([]);
const tagLoading = ref(false);
// 获取状态枚举值
const getStatusOptions = async () => {
    statusLoading.value = true;
    try {
        const response = await http.get('/m/enum/group/SOUP_STATUS/values');
        if ((response.code === 0 || response.code === 200) && response.data) {
            statusOptions.value = response.data.filter((item) => item.active).map((item) => ({
                code: item.code,
                value: item.value,
                description: item.description
            }));
            console.log('获取到的状态选项:', statusOptions.value);
        }
    }
    catch (error) {
        console.error('Failed to fetch status options:', error);
    }
    finally {
        statusLoading.value = false;
    }
};
// 获取标签枚举值
const getTagOptions = async () => {
    tagLoading.value = true;
    try {
        const response = await http.get('/app/enum/groups/SOUP_TAG/values');
        if ((response.code === 0 || response.code === 200) && response.data) {
            tagOptions.value = response.data.filter((item) => item.active).map((item) => ({
                code: item.code,
                value: item.value,
                description: item.description
            }));
            console.log('获取到的标签选项:', tagOptions.value);
        }
    }
    catch (error) {
        console.error('Failed to fetch tag options:', error);
    }
    finally {
        tagLoading.value = false;
    }
};
const getPuzzles = async (page = 1, pageSize = 10) => {
    loading.value = true;
    // 构建分页查询请求体
    const requestBody = {
        pageNum: page,
        pageSize: pageSize,
        titleKeyword: searchForm.titleKeyword,
        tags: searchForm.tags,
        status: searchForm.status,
        createdBy: searchForm.createdBy,
        aiGenerated: searchForm.aiGenerated,
        minRating: searchForm.minRating,
        createdAtStart: searchForm.createdAtStart,
        createdAtEnd: searchForm.createdAtEnd
    };
    try {
        const result = await http.post('/m/soup/pageQuery', requestBody);
        console.log('Request body:', requestBody, 'Response:', result);
        if ((result.code === 0 || result.code === 200) && result.data) {
            tableData.value = result.data.rows;
            pagination.value.total = result.data.total;
            pagination.value.current = result.data.pageNum;
            pagination.value.pageSize = result.data.pageSize;
        }
    }
    catch (error) {
        console.error('Error fetching puzzles:', error);
    }
    finally {
        loading.value = false;
    }
};
const handleTableChange = (pag) => {
    getPuzzles(pag.current, pag.pageSize);
};
// 状态颜色映射
const getStatusColor = (status) => {
    const colorMap = {
        'draft': 'default',
        'pending_review': 'orange',
        'published': 'green',
        'archived': 'red'
    };
    return colorMap[status] || 'default';
};
// 状态文本映射 - 从枚举值中获取
const getStatusText = (status) => {
    const statusOption = statusOptions.value.find(option => option.code === status || option.value === status);
    return statusOption ? statusOption.description : status;
};
// 标签文本映射 - 从枚举值中获取
const getTagText = (tag) => {
    const tagOption = tagOptions.value.find(option => option.code === tag || option.value === tag);
    return tagOption ? tagOption.description : tag;
};
const handleSearch = () => {
    getPuzzles(1, pagination.value.pageSize);
};
const handleReset = () => {
    searchForm.titleKeyword = undefined;
    searchForm.tags = undefined;
    searchForm.status = undefined;
    searchForm.createdBy = undefined;
    searchForm.aiGenerated = undefined;
    searchForm.minRating = undefined;
    searchForm.createdAtStart = undefined;
    searchForm.createdAtEnd = undefined;
    getPuzzles(1, pagination.value.pageSize);
};
const addPuzzle = () => {
    // 初始化创建表单数据
    createFormData.value = {
        title: '',
        description: '',
        answer: '',
        hints: [],
        tags: [],
        status: 'draft',
        aiGenerated: false
    };
    createModalVisible.value = true;
};
// 关闭创建弹窗
const closeCreateModal = () => {
    createModalVisible.value = false;
    createFormData.value = null;
};
// 处理创建提交
const handleCreate = async (formData) => {
    try {
        const createData = {
            title: formData.title,
            description: formData.description,
            answer: formData.answer,
            hints: formData.hints,
            tags: formData.tags,
            status: mapEnumCodeToBackendValue(formData.status),
            aiGenerated: formData.aiGenerated
        };
        console.log('创建海龟汤 - 提交数据:', createData);
        const response = await http.post('/m/soup/create', createData);
        if (response.code === 0 || response.code === 200) {
            message.success('创建成功');
            // 刷新列表
            getPuzzles(pagination.value.current, pagination.value.pageSize);
            // 关闭弹窗
            closeCreateModal();
        }
        else {
            message.error(response.message || '创建失败');
        }
    }
    catch (error) {
        message.error('创建失败');
        console.error('Failed to create puzzle:', error);
    }
};
const showDetails = (record) => {
    currentPuzzle.value = record;
    isEditMode.value = false;
    detailModalVisible.value = true;
};
const closeDetailModal = () => {
    detailModalVisible.value = false;
    currentPuzzle.value = null;
    isEditMode.value = false;
    editFormData.value = null;
};
// 进入编辑模式
const enterEditMode = () => {
    if (currentPuzzle.value) {
        // 确保状态值正确映射到枚举选项
        const originalStatus = currentPuzzle.value.status;
        const mappedStatus = mapStatusToEnumCode(originalStatus);
        console.log('进入编辑模式 - 原始状态:', originalStatus, '映射后状态:', mappedStatus);
        // 确保标签值正确映射到枚举选项
        const originalTags = currentPuzzle.value.tags;
        const mappedTags = mapTagsToEnumCodes(originalTags);
        console.log('进入编辑模式 - 原始标签:', originalTags, '映射后标签:', mappedTags);
        editFormData.value = {
            ...currentPuzzle.value,
            status: mappedStatus,
            tags: mappedTags
        };
        isEditMode.value = true;
    }
};
// 将状态值映射到枚举代码
const mapStatusToEnumCode = (status) => {
    if (!status)
        return 'draft'; // 默认值
    // 首先尝试直接匹配code
    const directMatch = statusOptions.value.find(option => option.code === status);
    if (directMatch)
        return status;
    // 然后尝试匹配value
    const valueMatch = statusOptions.value.find(option => option.value === status);
    if (valueMatch)
        return valueMatch.code;
    // 如果都没匹配到，返回默认值
    return 'draft';
};
// 将枚举代码转换为后端期望的值
const mapEnumCodeToBackendValue = (code) => {
    const option = statusOptions.value.find(option => option.code === code);
    // 根据API文档，后端可能期望code或value，这里我们使用code
    return option ? option.code : code;
};
// 将标签值映射到枚举代码
const mapTagsToEnumCodes = (tags) => {
    if (!tags || !Array.isArray(tags))
        return [];
    return tags.map(tag => {
        // 首先尝试直接匹配code
        const directMatch = tagOptions.value.find(option => option.code === tag);
        if (directMatch)
            return tag;
        // 然后尝试匹配value
        const valueMatch = tagOptions.value.find(option => option.value === tag);
        if (valueMatch)
            return valueMatch.code;
        // 如果都没匹配到，返回原值
        return tag;
    });
};
// 退出编辑模式
const exitEditMode = () => {
    isEditMode.value = false;
    editFormData.value = null;
};
// 保存编辑
const handleSave = async (formData) => {
    try {
        const originalStatus = formData.status;
        const backendStatus = mapEnumCodeToBackendValue(originalStatus);
        console.log('保存编辑 - 表单状态:', originalStatus, '后端状态:', backendStatus);
        const updateData = {
            id: currentPuzzle.value?.id,
            title: formData.title,
            description: formData.description,
            answer: formData.answer,
            hints: formData.hints,
            tags: formData.tags,
            status: backendStatus,
            aiGenerated: formData.aiGenerated
        };
        const response = await http.put('/m/soup/update', updateData);
        if (response.code === 0 || response.code === 200) {
            message.success('保存成功');
            // 更新当前显示的数据
            if (response.data) {
                currentPuzzle.value = response.data;
            }
            // 刷新列表
            getPuzzles(pagination.value.current, pagination.value.pageSize);
            // 退出编辑模式
            exitEditMode();
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
onMounted(() => {
    getPuzzles();
    getStatusOptions();
    getTagOptions();
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
    __VLS_styleScopedClasses['puzzle-details'];
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("puzzle-management") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("search-form") }, });
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.AForm;
    /** @type { [typeof __VLS_components.AForm, typeof __VLS_components.aForm, typeof __VLS_components.AForm, typeof __VLS_components.aForm, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ layout: ("inline"), model: ((__VLS_ctx.searchForm)), }));
    const __VLS_2 = __VLS_1({ layout: ("inline"), model: ((__VLS_ctx.searchForm)), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const __VLS_6 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({ label: ("标题关键字"), }));
    const __VLS_8 = __VLS_7({ label: ("标题关键字"), }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    const __VLS_12 = __VLS_resolvedLocalAndGlobalComponents.AInput;
    /** @type { [typeof __VLS_components.AInput, typeof __VLS_components.aInput, ] } */
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({ value: ((__VLS_ctx.searchForm.titleKeyword)), placeholder: ("请输入标题关键字"), ...{ style: ({}) }, allowClear: (true), }));
    const __VLS_14 = __VLS_13({ value: ((__VLS_ctx.searchForm.titleKeyword)), placeholder: ("请输入标题关键字"), ...{ style: ({}) }, allowClear: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_nonNullable(__VLS_11.slots).default;
    var __VLS_11;
    const __VLS_18 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({ label: ("标签"), }));
    const __VLS_20 = __VLS_19({ label: ("标签"), }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    const __VLS_24 = __VLS_resolvedLocalAndGlobalComponents.ASelect;
    /** @type { [typeof __VLS_components.ASelect, typeof __VLS_components.aSelect, typeof __VLS_components.ASelect, typeof __VLS_components.aSelect, ] } */
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({ value: ((__VLS_ctx.searchForm.tags)), mode: ("multiple"), placeholder: ("请选择标签"), ...{ style: ({}) }, allowClear: (true), loading: ((__VLS_ctx.tagLoading)), }));
    const __VLS_26 = __VLS_25({ value: ((__VLS_ctx.searchForm.tags)), mode: ("multiple"), placeholder: ("请选择标签"), ...{ style: ({}) }, allowClear: (true), loading: ((__VLS_ctx.tagLoading)), }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    for (const [option] of __VLS_getVForSourceType((__VLS_ctx.tagOptions))) {
        const __VLS_30 = __VLS_resolvedLocalAndGlobalComponents.ASelectOption;
        /** @type { [typeof __VLS_components.ASelectOption, typeof __VLS_components.aSelectOption, typeof __VLS_components.ASelectOption, typeof __VLS_components.aSelectOption, ] } */
        // @ts-ignore
        const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({ key: ((option.code)), value: ((option.code)), }));
        const __VLS_32 = __VLS_31({ key: ((option.code)), value: ((option.code)), }, ...__VLS_functionalComponentArgsRest(__VLS_31));
        (option.description);
        __VLS_nonNullable(__VLS_35.slots).default;
        var __VLS_35;
    }
    __VLS_nonNullable(__VLS_29.slots).default;
    var __VLS_29;
    __VLS_nonNullable(__VLS_23.slots).default;
    var __VLS_23;
    const __VLS_36 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({ label: ("状态"), }));
    const __VLS_38 = __VLS_37({ label: ("状态"), }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    const __VLS_42 = __VLS_resolvedLocalAndGlobalComponents.ASelect;
    /** @type { [typeof __VLS_components.ASelect, typeof __VLS_components.aSelect, typeof __VLS_components.ASelect, typeof __VLS_components.aSelect, ] } */
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({ value: ((__VLS_ctx.searchForm.status)), ...{ style: ({}) }, allowClear: (true), loading: ((__VLS_ctx.statusLoading)), placeholder: ("请选择状态"), }));
    const __VLS_44 = __VLS_43({ value: ((__VLS_ctx.searchForm.status)), ...{ style: ({}) }, allowClear: (true), loading: ((__VLS_ctx.statusLoading)), placeholder: ("请选择状态"), }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    for (const [option] of __VLS_getVForSourceType((__VLS_ctx.statusOptions))) {
        const __VLS_48 = __VLS_resolvedLocalAndGlobalComponents.ASelectOption;
        /** @type { [typeof __VLS_components.ASelectOption, typeof __VLS_components.aSelectOption, typeof __VLS_components.ASelectOption, typeof __VLS_components.aSelectOption, ] } */
        // @ts-ignore
        const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({ key: ((option.code)), value: ((option.code)), }));
        const __VLS_50 = __VLS_49({ key: ((option.code)), value: ((option.code)), }, ...__VLS_functionalComponentArgsRest(__VLS_49));
        (option.description);
        __VLS_nonNullable(__VLS_53.slots).default;
        var __VLS_53;
    }
    __VLS_nonNullable(__VLS_47.slots).default;
    var __VLS_47;
    __VLS_nonNullable(__VLS_41.slots).default;
    var __VLS_41;
    const __VLS_54 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({ label: ("AI生成"), }));
    const __VLS_56 = __VLS_55({ label: ("AI生成"), }, ...__VLS_functionalComponentArgsRest(__VLS_55));
    const __VLS_60 = __VLS_resolvedLocalAndGlobalComponents.ASelect;
    /** @type { [typeof __VLS_components.ASelect, typeof __VLS_components.aSelect, typeof __VLS_components.ASelect, typeof __VLS_components.aSelect, ] } */
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({ value: ((__VLS_ctx.searchForm.aiGenerated)), ...{ style: ({}) }, allowClear: (true), }));
    const __VLS_62 = __VLS_61({ value: ((__VLS_ctx.searchForm.aiGenerated)), ...{ style: ({}) }, allowClear: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    const __VLS_66 = __VLS_resolvedLocalAndGlobalComponents.ASelectOption;
    /** @type { [typeof __VLS_components.ASelectOption, typeof __VLS_components.aSelectOption, typeof __VLS_components.ASelectOption, typeof __VLS_components.aSelectOption, ] } */
    // @ts-ignore
    const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({ value: ((true)), }));
    const __VLS_68 = __VLS_67({ value: ((true)), }, ...__VLS_functionalComponentArgsRest(__VLS_67));
    __VLS_nonNullable(__VLS_71.slots).default;
    var __VLS_71;
    const __VLS_72 = __VLS_resolvedLocalAndGlobalComponents.ASelectOption;
    /** @type { [typeof __VLS_components.ASelectOption, typeof __VLS_components.aSelectOption, typeof __VLS_components.ASelectOption, typeof __VLS_components.aSelectOption, ] } */
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({ value: ((false)), }));
    const __VLS_74 = __VLS_73({ value: ((false)), }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_nonNullable(__VLS_77.slots).default;
    var __VLS_77;
    __VLS_nonNullable(__VLS_65.slots).default;
    var __VLS_65;
    __VLS_nonNullable(__VLS_59.slots).default;
    var __VLS_59;
    const __VLS_78 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({ label: ("最小评分"), }));
    const __VLS_80 = __VLS_79({ label: ("最小评分"), }, ...__VLS_functionalComponentArgsRest(__VLS_79));
    const __VLS_84 = __VLS_resolvedLocalAndGlobalComponents.AInputNumber;
    /** @type { [typeof __VLS_components.AInputNumber, typeof __VLS_components.aInputNumber, ] } */
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({ value: ((__VLS_ctx.searchForm.minRating)), min: ((0)), max: ((5)), step: ((0.1)), ...{ style: ({}) }, }));
    const __VLS_86 = __VLS_85({ value: ((__VLS_ctx.searchForm.minRating)), min: ((0)), max: ((5)), step: ((0.1)), ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    __VLS_nonNullable(__VLS_83.slots).default;
    var __VLS_83;
    const __VLS_90 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({}));
    const __VLS_92 = __VLS_91({}, ...__VLS_functionalComponentArgsRest(__VLS_91));
    const __VLS_96 = __VLS_resolvedLocalAndGlobalComponents.AButton;
    /** @type { [typeof __VLS_components.AButton, typeof __VLS_components.aButton, typeof __VLS_components.AButton, typeof __VLS_components.aButton, ] } */
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({ ...{ 'onClick': {} }, type: ("primary"), }));
    const __VLS_98 = __VLS_97({ ...{ 'onClick': {} }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    let __VLS_102;
    const __VLS_103 = {
        onClick: (__VLS_ctx.handleSearch)
    };
    let __VLS_99;
    let __VLS_100;
    __VLS_nonNullable(__VLS_101.slots).default;
    var __VLS_101;
    const __VLS_104 = __VLS_resolvedLocalAndGlobalComponents.AButton;
    /** @type { [typeof __VLS_components.AButton, typeof __VLS_components.aButton, typeof __VLS_components.AButton, typeof __VLS_components.aButton, ] } */
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({ ...{ 'onClick': {} }, ...{ style: ({}) }, }));
    const __VLS_106 = __VLS_105({ ...{ 'onClick': {} }, ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    let __VLS_110;
    const __VLS_111 = {
        onClick: (__VLS_ctx.handleReset)
    };
    let __VLS_107;
    let __VLS_108;
    __VLS_nonNullable(__VLS_109.slots).default;
    var __VLS_109;
    const __VLS_112 = __VLS_resolvedLocalAndGlobalComponents.AButton;
    /** @type { [typeof __VLS_components.AButton, typeof __VLS_components.aButton, typeof __VLS_components.AButton, typeof __VLS_components.aButton, ] } */
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({ ...{ 'onClick': {} }, ...{ style: ({}) }, }));
    const __VLS_114 = __VLS_113({ ...{ 'onClick': {} }, ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    let __VLS_118;
    const __VLS_119 = {
        onClick: (__VLS_ctx.addPuzzle)
    };
    let __VLS_115;
    let __VLS_116;
    __VLS_nonNullable(__VLS_117.slots).default;
    var __VLS_117;
    __VLS_nonNullable(__VLS_95.slots).default;
    var __VLS_95;
    __VLS_nonNullable(__VLS_5.slots).default;
    var __VLS_5;
    const __VLS_120 = __VLS_resolvedLocalAndGlobalComponents.ATable;
    /** @type { [typeof __VLS_components.ATable, typeof __VLS_components.aTable, typeof __VLS_components.ATable, typeof __VLS_components.aTable, ] } */
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({ ...{ 'onChange': {} }, columns: ((__VLS_ctx.columns)), dataSource: ((__VLS_ctx.tableData)), pagination: ((__VLS_ctx.pagination)), loading: ((__VLS_ctx.loading)), }));
    const __VLS_122 = __VLS_121({ ...{ 'onChange': {} }, columns: ((__VLS_ctx.columns)), dataSource: ((__VLS_ctx.tableData)), pagination: ((__VLS_ctx.pagination)), loading: ((__VLS_ctx.loading)), }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    let __VLS_126;
    const __VLS_127 = {
        onChange: (__VLS_ctx.handleTableChange)
    };
    let __VLS_123;
    let __VLS_124;
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { bodyCell: __VLS_thisSlot } = __VLS_nonNullable(__VLS_125.slots);
        const [{ column, record }] = __VLS_getSlotParams(__VLS_thisSlot);
        if (column.key === 'id') {
            (record.id);
        }
        if (column.key === 'title') {
            if (record.aiGenerated) {
                const __VLS_128 = __VLS_resolvedLocalAndGlobalComponents.ABadgeRibbon;
                /** @type { [typeof __VLS_components.ABadgeRibbon, typeof __VLS_components.aBadgeRibbon, typeof __VLS_components.ABadgeRibbon, typeof __VLS_components.aBadgeRibbon, ] } */
                // @ts-ignore
                const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({ text: ("AI"), color: ("blue"), }));
                const __VLS_130 = __VLS_129({ text: ("AI"), color: ("blue"), }, ...__VLS_functionalComponentArgsRest(__VLS_129));
                __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ style: ({}) }, });
                (record.title);
                __VLS_nonNullable(__VLS_133.slots).default;
                var __VLS_133;
            }
            else {
                __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                (record.title);
            }
        }
        if (column.key === 'tags') {
            for (const [tag] of __VLS_getVForSourceType((record.tags))) {
                const __VLS_134 = __VLS_resolvedLocalAndGlobalComponents.ATag;
                /** @type { [typeof __VLS_components.ATag, typeof __VLS_components.aTag, typeof __VLS_components.ATag, typeof __VLS_components.aTag, ] } */
                // @ts-ignore
                const __VLS_135 = __VLS_asFunctionalComponent(__VLS_134, new __VLS_134({ key: ((tag)), ...{ style: ({}) }, }));
                const __VLS_136 = __VLS_135({ key: ((tag)), ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_135));
                (__VLS_ctx.getTagText(tag));
                __VLS_nonNullable(__VLS_139.slots).default;
                var __VLS_139;
            }
        }
        if (column.key === 'rating') {
            const __VLS_140 = __VLS_resolvedLocalAndGlobalComponents.ATag;
            /** @type { [typeof __VLS_components.ATag, typeof __VLS_components.aTag, typeof __VLS_components.ATag, typeof __VLS_components.aTag, ] } */
            // @ts-ignore
            const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({ color: ("blue"), }));
            const __VLS_142 = __VLS_141({ color: ("blue"), }, ...__VLS_functionalComponentArgsRest(__VLS_141));
            (record.rating?.toFixed(1));
            __VLS_nonNullable(__VLS_145.slots).default;
            var __VLS_145;
        }
        if (column.key === 'status') {
            const __VLS_146 = __VLS_resolvedLocalAndGlobalComponents.ATag;
            /** @type { [typeof __VLS_components.ATag, typeof __VLS_components.aTag, typeof __VLS_components.ATag, typeof __VLS_components.aTag, ] } */
            // @ts-ignore
            const __VLS_147 = __VLS_asFunctionalComponent(__VLS_146, new __VLS_146({ color: ((__VLS_ctx.getStatusColor(record.status))), }));
            const __VLS_148 = __VLS_147({ color: ((__VLS_ctx.getStatusColor(record.status))), }, ...__VLS_functionalComponentArgsRest(__VLS_147));
            (__VLS_ctx.getStatusText(record.status));
            __VLS_nonNullable(__VLS_151.slots).default;
            var __VLS_151;
        }
        if (column.key === 'action') {
            const __VLS_152 = __VLS_resolvedLocalAndGlobalComponents.AButton;
            /** @type { [typeof __VLS_components.AButton, typeof __VLS_components.aButton, typeof __VLS_components.AButton, typeof __VLS_components.aButton, ] } */
            // @ts-ignore
            const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({ ...{ 'onClick': {} }, size: ("small"), type: ("primary"), }));
            const __VLS_154 = __VLS_153({ ...{ 'onClick': {} }, size: ("small"), type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_153));
            let __VLS_158;
            const __VLS_159 = {
                onClick: (...[$event]) => {
                    if (!((column.key === 'action')))
                        return;
                    __VLS_ctx.showDetails(record);
                }
            };
            let __VLS_155;
            let __VLS_156;
            __VLS_nonNullable(__VLS_157.slots).default;
            var __VLS_157;
        }
    }
    var __VLS_125;
    const __VLS_160 = __VLS_resolvedLocalAndGlobalComponents.AModal;
    /** @type { [typeof __VLS_components.AModal, typeof __VLS_components.aModal, typeof __VLS_components.AModal, typeof __VLS_components.aModal, ] } */
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({ open: ((__VLS_ctx.detailModalVisible)), title: ((__VLS_ctx.isEditMode ? '编辑海龟汤' : '海龟汤详情')), centered: (true), width: ("900px"), footer: ((null)), }));
    const __VLS_162 = __VLS_161({ open: ((__VLS_ctx.detailModalVisible)), title: ((__VLS_ctx.isEditMode ? '编辑海龟汤' : '海龟汤详情')), centered: (true), width: ("900px"), footer: ((null)), }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    if (!__VLS_ctx.isEditMode) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        const __VLS_166 = __VLS_resolvedLocalAndGlobalComponents.ADescriptions;
        /** @type { [typeof __VLS_components.ADescriptions, typeof __VLS_components.aDescriptions, typeof __VLS_components.ADescriptions, typeof __VLS_components.aDescriptions, ] } */
        // @ts-ignore
        const __VLS_167 = __VLS_asFunctionalComponent(__VLS_166, new __VLS_166({ bordered: (true), column: ((2)), }));
        const __VLS_168 = __VLS_167({ bordered: (true), column: ((2)), }, ...__VLS_functionalComponentArgsRest(__VLS_167));
        const __VLS_172 = __VLS_resolvedLocalAndGlobalComponents.ADescriptionsItem;
        /** @type { [typeof __VLS_components.ADescriptionsItem, typeof __VLS_components.aDescriptionsItem, typeof __VLS_components.ADescriptionsItem, typeof __VLS_components.aDescriptionsItem, ] } */
        // @ts-ignore
        const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({ label: ("ID"), }));
        const __VLS_174 = __VLS_173({ label: ("ID"), }, ...__VLS_functionalComponentArgsRest(__VLS_173));
        (__VLS_ctx.currentPuzzle?.id);
        __VLS_nonNullable(__VLS_177.slots).default;
        var __VLS_177;
        const __VLS_178 = __VLS_resolvedLocalAndGlobalComponents.ADescriptionsItem;
        /** @type { [typeof __VLS_components.ADescriptionsItem, typeof __VLS_components.aDescriptionsItem, typeof __VLS_components.ADescriptionsItem, typeof __VLS_components.aDescriptionsItem, ] } */
        // @ts-ignore
        const __VLS_179 = __VLS_asFunctionalComponent(__VLS_178, new __VLS_178({ label: ("标题"), }));
        const __VLS_180 = __VLS_179({ label: ("标题"), }, ...__VLS_functionalComponentArgsRest(__VLS_179));
        (__VLS_ctx.currentPuzzle?.title);
        __VLS_nonNullable(__VLS_183.slots).default;
        var __VLS_183;
        const __VLS_184 = __VLS_resolvedLocalAndGlobalComponents.ADescriptionsItem;
        /** @type { [typeof __VLS_components.ADescriptionsItem, typeof __VLS_components.aDescriptionsItem, typeof __VLS_components.ADescriptionsItem, typeof __VLS_components.aDescriptionsItem, ] } */
        // @ts-ignore
        const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({ label: ("状态"), }));
        const __VLS_186 = __VLS_185({ label: ("状态"), }, ...__VLS_functionalComponentArgsRest(__VLS_185));
        const __VLS_190 = __VLS_resolvedLocalAndGlobalComponents.ATag;
        /** @type { [typeof __VLS_components.ATag, typeof __VLS_components.aTag, typeof __VLS_components.ATag, typeof __VLS_components.aTag, ] } */
        // @ts-ignore
        const __VLS_191 = __VLS_asFunctionalComponent(__VLS_190, new __VLS_190({ color: ((__VLS_ctx.getStatusColor(__VLS_ctx.currentPuzzle?.status))), }));
        const __VLS_192 = __VLS_191({ color: ((__VLS_ctx.getStatusColor(__VLS_ctx.currentPuzzle?.status))), }, ...__VLS_functionalComponentArgsRest(__VLS_191));
        (__VLS_ctx.getStatusText(__VLS_ctx.currentPuzzle?.status));
        __VLS_nonNullable(__VLS_195.slots).default;
        var __VLS_195;
        __VLS_nonNullable(__VLS_189.slots).default;
        var __VLS_189;
        const __VLS_196 = __VLS_resolvedLocalAndGlobalComponents.ADescriptionsItem;
        /** @type { [typeof __VLS_components.ADescriptionsItem, typeof __VLS_components.aDescriptionsItem, typeof __VLS_components.ADescriptionsItem, typeof __VLS_components.aDescriptionsItem, ] } */
        // @ts-ignore
        const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({ label: ("AI生成"), }));
        const __VLS_198 = __VLS_197({ label: ("AI生成"), }, ...__VLS_functionalComponentArgsRest(__VLS_197));
        const __VLS_202 = __VLS_resolvedLocalAndGlobalComponents.ATag;
        /** @type { [typeof __VLS_components.ATag, typeof __VLS_components.aTag, typeof __VLS_components.ATag, typeof __VLS_components.aTag, ] } */
        // @ts-ignore
        const __VLS_203 = __VLS_asFunctionalComponent(__VLS_202, new __VLS_202({ color: ((__VLS_ctx.currentPuzzle?.aiGenerated ? 'blue' : 'default')), }));
        const __VLS_204 = __VLS_203({ color: ((__VLS_ctx.currentPuzzle?.aiGenerated ? 'blue' : 'default')), }, ...__VLS_functionalComponentArgsRest(__VLS_203));
        (__VLS_ctx.currentPuzzle?.aiGenerated ? 'AI生成' : '手动创建');
        __VLS_nonNullable(__VLS_207.slots).default;
        var __VLS_207;
        __VLS_nonNullable(__VLS_201.slots).default;
        var __VLS_201;
        const __VLS_208 = __VLS_resolvedLocalAndGlobalComponents.ADescriptionsItem;
        /** @type { [typeof __VLS_components.ADescriptionsItem, typeof __VLS_components.aDescriptionsItem, typeof __VLS_components.ADescriptionsItem, typeof __VLS_components.aDescriptionsItem, ] } */
        // @ts-ignore
        const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({ label: ("评分"), }));
        const __VLS_210 = __VLS_209({ label: ("评分"), }, ...__VLS_functionalComponentArgsRest(__VLS_209));
        const __VLS_214 = __VLS_resolvedLocalAndGlobalComponents.ARate;
        /** @type { [typeof __VLS_components.ARate, typeof __VLS_components.aRate, ] } */
        // @ts-ignore
        const __VLS_215 = __VLS_asFunctionalComponent(__VLS_214, new __VLS_214({ value: ((__VLS_ctx.currentPuzzle?.rating)), disabled: (true), allowHalf: (true), }));
        const __VLS_216 = __VLS_215({ value: ((__VLS_ctx.currentPuzzle?.rating)), disabled: (true), allowHalf: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_215));
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ style: ({}) }, });
        (__VLS_ctx.currentPuzzle?.rating?.toFixed(1));
        __VLS_nonNullable(__VLS_213.slots).default;
        var __VLS_213;
        const __VLS_220 = __VLS_resolvedLocalAndGlobalComponents.ADescriptionsItem;
        /** @type { [typeof __VLS_components.ADescriptionsItem, typeof __VLS_components.aDescriptionsItem, typeof __VLS_components.ADescriptionsItem, typeof __VLS_components.aDescriptionsItem, ] } */
        // @ts-ignore
        const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({ label: ("游戏次数"), }));
        const __VLS_222 = __VLS_221({ label: ("游戏次数"), }, ...__VLS_functionalComponentArgsRest(__VLS_221));
        (__VLS_ctx.currentPuzzle?.playCount);
        __VLS_nonNullable(__VLS_225.slots).default;
        var __VLS_225;
        const __VLS_226 = __VLS_resolvedLocalAndGlobalComponents.ADescriptionsItem;
        /** @type { [typeof __VLS_components.ADescriptionsItem, typeof __VLS_components.aDescriptionsItem, typeof __VLS_components.ADescriptionsItem, typeof __VLS_components.aDescriptionsItem, ] } */
        // @ts-ignore
        const __VLS_227 = __VLS_asFunctionalComponent(__VLS_226, new __VLS_226({ label: ("创建者"), }));
        const __VLS_228 = __VLS_227({ label: ("创建者"), }, ...__VLS_functionalComponentArgsRest(__VLS_227));
        (__VLS_ctx.currentPuzzle?.createdBy);
        __VLS_nonNullable(__VLS_231.slots).default;
        var __VLS_231;
        const __VLS_232 = __VLS_resolvedLocalAndGlobalComponents.ADescriptionsItem;
        /** @type { [typeof __VLS_components.ADescriptionsItem, typeof __VLS_components.aDescriptionsItem, typeof __VLS_components.ADescriptionsItem, typeof __VLS_components.aDescriptionsItem, ] } */
        // @ts-ignore
        const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({ label: ("创建时间"), }));
        const __VLS_234 = __VLS_233({ label: ("创建时间"), }, ...__VLS_functionalComponentArgsRest(__VLS_233));
        (__VLS_ctx.formatDateTime(__VLS_ctx.currentPuzzle?.createdAt));
        __VLS_nonNullable(__VLS_237.slots).default;
        var __VLS_237;
        const __VLS_238 = __VLS_resolvedLocalAndGlobalComponents.ADescriptionsItem;
        /** @type { [typeof __VLS_components.ADescriptionsItem, typeof __VLS_components.aDescriptionsItem, typeof __VLS_components.ADescriptionsItem, typeof __VLS_components.aDescriptionsItem, ] } */
        // @ts-ignore
        const __VLS_239 = __VLS_asFunctionalComponent(__VLS_238, new __VLS_238({ label: ("更新时间"), }));
        const __VLS_240 = __VLS_239({ label: ("更新时间"), }, ...__VLS_functionalComponentArgsRest(__VLS_239));
        (__VLS_ctx.formatDateTime(__VLS_ctx.currentPuzzle?.updatedAt));
        __VLS_nonNullable(__VLS_243.slots).default;
        var __VLS_243;
        const __VLS_244 = __VLS_resolvedLocalAndGlobalComponents.ADescriptionsItem;
        /** @type { [typeof __VLS_components.ADescriptionsItem, typeof __VLS_components.aDescriptionsItem, typeof __VLS_components.ADescriptionsItem, typeof __VLS_components.aDescriptionsItem, ] } */
        // @ts-ignore
        const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({ label: ("标签"), span: ((2)), }));
        const __VLS_246 = __VLS_245({ label: ("标签"), span: ((2)), }, ...__VLS_functionalComponentArgsRest(__VLS_245));
        for (const [tag, index] of __VLS_getVForSourceType((__VLS_ctx.currentPuzzle?.tags))) {
            const __VLS_250 = __VLS_resolvedLocalAndGlobalComponents.ATag;
            /** @type { [typeof __VLS_components.ATag, typeof __VLS_components.aTag, typeof __VLS_components.ATag, typeof __VLS_components.aTag, ] } */
            // @ts-ignore
            const __VLS_251 = __VLS_asFunctionalComponent(__VLS_250, new __VLS_250({ key: ((index)), ...{ style: ({}) }, }));
            const __VLS_252 = __VLS_251({ key: ((index)), ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_251));
            (__VLS_ctx.getTagText(tag));
            __VLS_nonNullable(__VLS_255.slots).default;
            var __VLS_255;
        }
        __VLS_nonNullable(__VLS_249.slots).default;
        var __VLS_249;
        const __VLS_256 = __VLS_resolvedLocalAndGlobalComponents.ADescriptionsItem;
        /** @type { [typeof __VLS_components.ADescriptionsItem, typeof __VLS_components.aDescriptionsItem, typeof __VLS_components.ADescriptionsItem, typeof __VLS_components.aDescriptionsItem, ] } */
        // @ts-ignore
        const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({ label: ("汤面"), span: ((2)), }));
        const __VLS_258 = __VLS_257({ label: ("汤面"), span: ((2)), }, ...__VLS_functionalComponentArgsRest(__VLS_257));
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ style: ({}) }, });
        (__VLS_ctx.currentPuzzle?.description);
        __VLS_nonNullable(__VLS_261.slots).default;
        var __VLS_261;
        const __VLS_262 = __VLS_resolvedLocalAndGlobalComponents.ADescriptionsItem;
        /** @type { [typeof __VLS_components.ADescriptionsItem, typeof __VLS_components.aDescriptionsItem, typeof __VLS_components.ADescriptionsItem, typeof __VLS_components.aDescriptionsItem, ] } */
        // @ts-ignore
        const __VLS_263 = __VLS_asFunctionalComponent(__VLS_262, new __VLS_262({ label: ("汤底"), span: ((2)), }));
        const __VLS_264 = __VLS_263({ label: ("汤底"), span: ((2)), }, ...__VLS_functionalComponentArgsRest(__VLS_263));
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ style: ({}) }, });
        (__VLS_ctx.currentPuzzle?.answer);
        __VLS_nonNullable(__VLS_267.slots).default;
        var __VLS_267;
        const __VLS_268 = __VLS_resolvedLocalAndGlobalComponents.ADescriptionsItem;
        /** @type { [typeof __VLS_components.ADescriptionsItem, typeof __VLS_components.aDescriptionsItem, typeof __VLS_components.ADescriptionsItem, typeof __VLS_components.aDescriptionsItem, ] } */
        // @ts-ignore
        const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({ label: ("提示"), span: ((2)), }));
        const __VLS_270 = __VLS_269({ label: ("提示"), span: ((2)), }, ...__VLS_functionalComponentArgsRest(__VLS_269));
        __VLS_elementAsFunction(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({ ...{ style: ({}) }, });
        for (const [hint, index] of __VLS_getVForSourceType((__VLS_ctx.currentPuzzle?.hints))) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({ key: ((index)), ...{ style: ({}) }, });
            (hint);
        }
        __VLS_nonNullable(__VLS_273.slots).default;
        var __VLS_273;
        __VLS_nonNullable(__VLS_171.slots).default;
        var __VLS_171;
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ style: ({}) }, });
        const __VLS_274 = __VLS_resolvedLocalAndGlobalComponents.ASpace;
        /** @type { [typeof __VLS_components.ASpace, typeof __VLS_components.aSpace, typeof __VLS_components.ASpace, typeof __VLS_components.aSpace, ] } */
        // @ts-ignore
        const __VLS_275 = __VLS_asFunctionalComponent(__VLS_274, new __VLS_274({}));
        const __VLS_276 = __VLS_275({}, ...__VLS_functionalComponentArgsRest(__VLS_275));
        const __VLS_280 = __VLS_resolvedLocalAndGlobalComponents.AButton;
        /** @type { [typeof __VLS_components.AButton, typeof __VLS_components.aButton, typeof __VLS_components.AButton, typeof __VLS_components.aButton, ] } */
        // @ts-ignore
        const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({ ...{ 'onClick': {} }, }));
        const __VLS_282 = __VLS_281({ ...{ 'onClick': {} }, }, ...__VLS_functionalComponentArgsRest(__VLS_281));
        let __VLS_286;
        const __VLS_287 = {
            onClick: (__VLS_ctx.closeDetailModal)
        };
        let __VLS_283;
        let __VLS_284;
        __VLS_nonNullable(__VLS_285.slots).default;
        var __VLS_285;
        const __VLS_288 = __VLS_resolvedLocalAndGlobalComponents.AButton;
        /** @type { [typeof __VLS_components.AButton, typeof __VLS_components.aButton, typeof __VLS_components.AButton, typeof __VLS_components.aButton, ] } */
        // @ts-ignore
        const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({ ...{ 'onClick': {} }, type: ("primary"), }));
        const __VLS_290 = __VLS_289({ ...{ 'onClick': {} }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_289));
        let __VLS_294;
        const __VLS_295 = {
            onClick: (__VLS_ctx.enterEditMode)
        };
        let __VLS_291;
        let __VLS_292;
        __VLS_nonNullable(__VLS_293.slots).default;
        var __VLS_293;
        __VLS_nonNullable(__VLS_279.slots).default;
        var __VLS_279;
    }
    else {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        // @ts-ignore
        [PuzzleForm,];
        // @ts-ignore
        const __VLS_296 = __VLS_asFunctionalComponent(PuzzleForm, new PuzzleForm({ ...{ 'onSubmit': {} }, ...{ 'onCancel': {} }, initialData: ((__VLS_ctx.editFormData)), statusOptions: ((__VLS_ctx.statusOptions)), statusLoading: ((__VLS_ctx.statusLoading)), tagOptions: ((__VLS_ctx.tagOptions)), tagLoading: ((__VLS_ctx.tagLoading)), }));
        const __VLS_297 = __VLS_296({ ...{ 'onSubmit': {} }, ...{ 'onCancel': {} }, initialData: ((__VLS_ctx.editFormData)), statusOptions: ((__VLS_ctx.statusOptions)), statusLoading: ((__VLS_ctx.statusLoading)), tagOptions: ((__VLS_ctx.tagOptions)), tagLoading: ((__VLS_ctx.tagLoading)), }, ...__VLS_functionalComponentArgsRest(__VLS_296));
        let __VLS_301;
        const __VLS_302 = {
            onSubmit: (__VLS_ctx.handleSave)
        };
        const __VLS_303 = {
            onCancel: (__VLS_ctx.exitEditMode)
        };
        let __VLS_298;
        let __VLS_299;
        var __VLS_300;
    }
    __VLS_nonNullable(__VLS_165.slots).default;
    var __VLS_165;
    const __VLS_304 = __VLS_resolvedLocalAndGlobalComponents.AModal;
    /** @type { [typeof __VLS_components.AModal, typeof __VLS_components.aModal, typeof __VLS_components.AModal, typeof __VLS_components.aModal, ] } */
    // @ts-ignore
    const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({ open: ((__VLS_ctx.createModalVisible)), title: ("新增海龟汤"), centered: (true), width: ("900px"), footer: ((null)), }));
    const __VLS_306 = __VLS_305({ open: ((__VLS_ctx.createModalVisible)), title: ("新增海龟汤"), centered: (true), width: ("900px"), footer: ((null)), }, ...__VLS_functionalComponentArgsRest(__VLS_305));
    // @ts-ignore
    [PuzzleForm,];
    // @ts-ignore
    const __VLS_310 = __VLS_asFunctionalComponent(PuzzleForm, new PuzzleForm({ ...{ 'onSubmit': {} }, ...{ 'onCancel': {} }, initialData: ((__VLS_ctx.createFormData)), statusOptions: ((__VLS_ctx.statusOptions)), statusLoading: ((__VLS_ctx.statusLoading)), tagOptions: ((__VLS_ctx.tagOptions)), tagLoading: ((__VLS_ctx.tagLoading)), isCreateMode: ((true)), }));
    const __VLS_311 = __VLS_310({ ...{ 'onSubmit': {} }, ...{ 'onCancel': {} }, initialData: ((__VLS_ctx.createFormData)), statusOptions: ((__VLS_ctx.statusOptions)), statusLoading: ((__VLS_ctx.statusLoading)), tagOptions: ((__VLS_ctx.tagOptions)), tagLoading: ((__VLS_ctx.tagLoading)), isCreateMode: ((true)), }, ...__VLS_functionalComponentArgsRest(__VLS_310));
    let __VLS_315;
    const __VLS_316 = {
        onSubmit: (__VLS_ctx.handleCreate)
    };
    const __VLS_317 = {
        onCancel: (__VLS_ctx.closeCreateModal)
    };
    let __VLS_312;
    let __VLS_313;
    var __VLS_314;
    __VLS_nonNullable(__VLS_309.slots).default;
    var __VLS_309;
    __VLS_styleScopedClasses['puzzle-management'];
    __VLS_styleScopedClasses['search-form'];
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
            formatDateTime: formatDateTime,
            columns: columns,
            tableData: tableData,
            loading: loading,
            pagination: pagination,
            searchForm: searchForm,
            detailModalVisible: detailModalVisible,
            currentPuzzle: currentPuzzle,
            isEditMode: isEditMode,
            editFormData: editFormData,
            createModalVisible: createModalVisible,
            createFormData: createFormData,
            statusOptions: statusOptions,
            statusLoading: statusLoading,
            tagOptions: tagOptions,
            tagLoading: tagLoading,
            handleTableChange: handleTableChange,
            getStatusColor: getStatusColor,
            getStatusText: getStatusText,
            getTagText: getTagText,
            handleSearch: handleSearch,
            handleReset: handleReset,
            addPuzzle: addPuzzle,
            closeCreateModal: closeCreateModal,
            handleCreate: handleCreate,
            showDetails: showDetails,
            closeDetailModal: closeDetailModal,
            enterEditMode: enterEditMode,
            exitEditMode: exitEditMode,
            handleSave: handleSave,
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
