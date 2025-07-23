import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { http } from '../../utils/http';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
// 搜索表单
const searchForm = ref({
    code: '',
    description: ''
});
// 分页配置
const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条记录`
});
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
// 枚举组表格列定义
const enumGroupColumns = [
    {
        title: 'Code',
        dataIndex: 'code',
        key: 'code'
    },
    {
        title: '描述',
        dataIndex: 'description',
        key: 'description'
    },
    {
        title: '激活状态',
        dataIndex: 'active',
        key: 'active'
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        customRender: ({ text }) => formatDateTime(text)
    },
    {
        title: '操作',
        key: 'action'
    }
];
// 枚举值表格列定义
const enumValueColumns = [
    {
        title: '值编码',
        dataIndex: 'code',
        key: 'code'
    },
    {
        title: '值名称',
        dataIndex: 'value',
        key: 'value'
    },
    {
        title: '描述',
        dataIndex: 'description',
        key: 'description'
    },
    {
        title: '排序序号',
        dataIndex: 'index',
        key: 'index'
    },
    {
        title: '激活状态',
        dataIndex: 'active',
        key: 'active'
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        customRender: ({ text }) => formatDateTime(text)
    },
    {
        title: '操作',
        key: 'action'
    }
];
// 数据状态
const enumGroups = ref([]);
const enumValues = ref([]);
const selectedEnumGroup = ref(null);
const loading = ref(false);
const valuesLoading = ref(false);
// 模态框状态
const enumGroupModalVisible = ref(false);
const enumValueModalVisible = ref(false);
const enumValuesModalVisible = ref(false);
const enumGroupModalMode = ref('add');
const enumValueModalMode = ref('add');
const enumGroupForm = ref({
    id: null,
    code: '',
    description: ''
});
const enumValueForm = ref({
    id: null,
    groupId: null,
    code: '',
    value: '',
    description: '',
    index: 0
});
// 获取枚举组列表
const fetchEnumGroups = async () => {
    loading.value = true;
    try {
        // 构建分页查询请求体
        const requestBody = {
            pageNum: pagination.value.current,
            pageSize: pagination.value.pageSize,
            code: searchForm.value.code || undefined,
            description: searchForm.value.description || undefined
        };
        const response = await http.post('/m/enum/groups', requestBody);
        console.log('Request body:', requestBody, 'Response:', response);
        if (response.code === 200) {
            enumGroups.value = response.data;
            pagination.value.total = response.total || response.data.length;
        }
        else {
            message.error(response.message || '获取枚举组列表失败');
        }
    }
    catch (error) {
        console.error('获取枚举组列表错误:', error);
        message.error('获取枚举组列表失败');
    }
    finally {
        loading.value = false;
    }
};
// 搜索
const handleSearch = () => {
    pagination.value.current = 1;
    fetchEnumGroups();
};
// 重置搜索
const handleReset = () => {
    searchForm.value = {
        code: '',
        description: ''
    };
    pagination.value.current = 1;
    fetchEnumGroups();
};
// 表格变化处理
const handleTableChange = (pag) => {
    pagination.value.current = pag.current;
    pagination.value.pageSize = pag.pageSize;
    fetchEnumGroups();
};
// 显示枚举值
const showEnumValues = async (record) => {
    selectedEnumGroup.value = record;
    enumValuesModalVisible.value = true;
    await fetchEnumValues(record.code);
};
// 获取枚举值列表
const fetchEnumValues = async (groupCode) => {
    valuesLoading.value = true;
    try {
        const response = await http.get(`/m/enum/group/${groupCode}/values`);
        console.log('枚举值响应数据:', response);
        if (response.code === 200) {
            enumValues.value = response.data;
        }
        else {
            message.error(response.message || '获取枚举值列表失败');
        }
    }
    catch (error) {
        console.error('获取枚举值列表错误:', error);
        message.error('获取枚举值列表失败');
    }
    finally {
        valuesLoading.value = false;
    }
};
// 新增枚举组相关方法
const showAddEnumGroupModal = () => {
    enumGroupModalMode.value = 'add';
    enumGroupForm.value = {
        id: null,
        code: '',
        description: ''
    };
    enumGroupModalVisible.value = true;
};
const showEditEnumGroupModal = (record) => {
    enumGroupModalMode.value = 'edit';
    enumGroupForm.value = {
        id: record.id,
        code: record.code,
        description: record.description
    };
    enumGroupModalVisible.value = true;
};
const handleEnumGroupModalOk = async () => {
    try {
        if (enumGroupModalMode.value === 'add') {
            const payload = {
                code: enumGroupForm.value.code,
                description: enumGroupForm.value.description
            };
            const response = await http.post('/m/enum/group/add', payload);
            if (response.code === 200) {
                message.success('添加枚举组成功');
                enumGroupModalVisible.value = false;
                await updateEnumLists();
            }
            else {
                message.error(response.message || '操作失败');
            }
        }
        else {
            const payload = {
                id: enumGroupForm.value.id,
                description: enumGroupForm.value.description
            };
            const response = await http.post('/m/enum/group/updateDesc', payload);
            if (response.code === 200) {
                message.success('更新枚举组成功');
                enumGroupModalVisible.value = false;
                await updateEnumLists();
            }
            else {
                message.error(response.message || '操作失败');
            }
        }
    }
    catch (error) {
        message.error('操作失败');
    }
};
// 新增枚举值相关方法
const showAddEnumValueModal = () => {
    enumValueModalMode.value = 'add';
    enumValueForm.value = {
        id: null,
        groupId: selectedEnumGroup.value.id,
        code: '',
        value: '',
        description: '',
        index: 0
    };
    enumValueModalVisible.value = true;
};
const showEditEnumValueModal = (record) => {
    enumValueModalMode.value = 'edit';
    enumValueForm.value = {
        id: record.id,
        groupId: selectedEnumGroup.value.id,
        code: record.code,
        value: record.value,
        description: record.description,
        index: record.index
    };
    enumValueModalVisible.value = true;
};
const handleEnumValueModalOk = async () => {
    try {
        if (enumValueModalMode.value === 'add') {
            const payload = {
                groupId: enumValueForm.value.groupId,
                code: enumValueForm.value.code,
                value: enumValueForm.value.value,
                description: enumValueForm.value.description,
                index: enumValueForm.value.index
            };
            const response = await http.post('/m/enum/value/add', payload);
            if (response.code === 200) {
                message.success('添加枚举值成功');
                enumValueModalVisible.value = false;
                await updateEnumLists();
            }
            else {
                message.error(response.message || '操作失败');
            }
        }
        else {
            const payload = {
                valueId: enumValueForm.value.id,
                description: enumValueForm.value.description,
                index: enumValueForm.value.index
            };
            const response = await http.post('/m/enum/value/update', payload);
            if (response.code === 200) {
                message.success('更新枚举值成功');
                enumValueModalVisible.value = false;
                await updateEnumLists();
            }
            else {
                message.error(response.message || '操作失败');
            }
        }
    }
    catch (error) {
        message.error('操作失败');
    }
};
// 切换激活状态方法
const toggleEnumGroupActive = async (id) => {
    try {
        const response = await http.post('/m/enum/group/switchStatus', { id });
        if (response.code === 200) {
            message.success('切换枚举组激活状态成功');
            await updateEnumLists();
        }
        else {
            message.error(response.message || '操作失败');
        }
    }
    catch (error) {
        message.error('操作失败');
    }
};
const toggleEnumValueActive = async (id) => {
    try {
        const response = await http.post('/m/enum/value/switchStatus', { id });
        if (response.code === 200) {
            message.success('切换枚举值激活状态成功');
            await updateEnumLists();
        }
        else {
            message.error(response.message || '操作失败');
        }
    }
    catch (error) {
        message.error('操作失败');
    }
};
// 更新枚举组和枚举值列表
const updateEnumLists = async () => {
    await fetchEnumGroups();
    // 如果当前有选中的枚举组且弹窗打开，更新枚举值列表
    if (selectedEnumGroup.value && enumValuesModalVisible.value) {
        const updatedGroup = enumGroups.value.find(group => group.id === selectedEnumGroup.value.id);
        if (updatedGroup) {
            selectedEnumGroup.value = updatedGroup;
            await fetchEnumValues(updatedGroup.code);
        }
    }
};
onMounted(() => {
    fetchEnumGroups();
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
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("enum-management") }, });
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.ACard;
    /** @type { [typeof __VLS_components.ACard, typeof __VLS_components.aCard, typeof __VLS_components.ACard, typeof __VLS_components.aCard, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ title: ("枚举组管理"), }));
    const __VLS_2 = __VLS_1({ title: ("枚举组管理"), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const __VLS_6 = __VLS_resolvedLocalAndGlobalComponents.AForm;
    /** @type { [typeof __VLS_components.AForm, typeof __VLS_components.aForm, typeof __VLS_components.AForm, typeof __VLS_components.aForm, ] } */
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({ layout: ("inline"), ...{ style: ({}) }, }));
    const __VLS_8 = __VLS_7({ layout: ("inline"), ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    const __VLS_12 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({ label: ("Code"), }));
    const __VLS_14 = __VLS_13({ label: ("Code"), }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    const __VLS_18 = __VLS_resolvedLocalAndGlobalComponents.AInput;
    /** @type { [typeof __VLS_components.AInput, typeof __VLS_components.aInput, ] } */
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({ value: ((__VLS_ctx.searchForm.code)), placeholder: ("请输入Code"), ...{ style: ({}) }, }));
    const __VLS_20 = __VLS_19({ value: ((__VLS_ctx.searchForm.code)), placeholder: ("请输入Code"), ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    __VLS_nonNullable(__VLS_17.slots).default;
    var __VLS_17;
    const __VLS_24 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({ label: ("描述"), }));
    const __VLS_26 = __VLS_25({ label: ("描述"), }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    const __VLS_30 = __VLS_resolvedLocalAndGlobalComponents.AInput;
    /** @type { [typeof __VLS_components.AInput, typeof __VLS_components.aInput, ] } */
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({ value: ((__VLS_ctx.searchForm.description)), placeholder: ("请输入描述"), ...{ style: ({}) }, }));
    const __VLS_32 = __VLS_31({ value: ((__VLS_ctx.searchForm.description)), placeholder: ("请输入描述"), ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    __VLS_nonNullable(__VLS_29.slots).default;
    var __VLS_29;
    const __VLS_36 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({}));
    const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
    const __VLS_42 = __VLS_resolvedLocalAndGlobalComponents.AButton;
    /** @type { [typeof __VLS_components.AButton, typeof __VLS_components.aButton, typeof __VLS_components.AButton, typeof __VLS_components.aButton, ] } */
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({ ...{ 'onClick': {} }, type: ("primary"), }));
    const __VLS_44 = __VLS_43({ ...{ 'onClick': {} }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    let __VLS_48;
    const __VLS_49 = {
        onClick: (__VLS_ctx.handleSearch)
    };
    let __VLS_45;
    let __VLS_46;
    __VLS_nonNullable(__VLS_47.slots).default;
    var __VLS_47;
    const __VLS_50 = __VLS_resolvedLocalAndGlobalComponents.AButton;
    /** @type { [typeof __VLS_components.AButton, typeof __VLS_components.aButton, typeof __VLS_components.AButton, typeof __VLS_components.aButton, ] } */
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({ ...{ 'onClick': {} }, ...{ style: ({}) }, }));
    const __VLS_52 = __VLS_51({ ...{ 'onClick': {} }, ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    let __VLS_56;
    const __VLS_57 = {
        onClick: (__VLS_ctx.handleReset)
    };
    let __VLS_53;
    let __VLS_54;
    __VLS_nonNullable(__VLS_55.slots).default;
    var __VLS_55;
    __VLS_nonNullable(__VLS_41.slots).default;
    var __VLS_41;
    __VLS_nonNullable(__VLS_11.slots).default;
    var __VLS_11;
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { extra: __VLS_thisSlot } = __VLS_nonNullable(__VLS_5.slots);
        const __VLS_58 = __VLS_resolvedLocalAndGlobalComponents.AButton;
        /** @type { [typeof __VLS_components.AButton, typeof __VLS_components.aButton, typeof __VLS_components.AButton, typeof __VLS_components.aButton, ] } */
        // @ts-ignore
        const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({ ...{ 'onClick': {} }, type: ("primary"), }));
        const __VLS_60 = __VLS_59({ ...{ 'onClick': {} }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_59));
        let __VLS_64;
        const __VLS_65 = {
            onClick: (__VLS_ctx.showAddEnumGroupModal)
        };
        let __VLS_61;
        let __VLS_62;
        __VLS_nonNullable(__VLS_63.slots).default;
        var __VLS_63;
    }
    const __VLS_66 = __VLS_resolvedLocalAndGlobalComponents.ATable;
    /** @type { [typeof __VLS_components.ATable, typeof __VLS_components.aTable, typeof __VLS_components.ATable, typeof __VLS_components.aTable, ] } */
    // @ts-ignore
    const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({ ...{ 'onChange': {} }, columns: ((__VLS_ctx.enumGroupColumns)), dataSource: ((__VLS_ctx.enumGroups)), pagination: ((__VLS_ctx.pagination)), loading: ((__VLS_ctx.loading)), }));
    const __VLS_68 = __VLS_67({ ...{ 'onChange': {} }, columns: ((__VLS_ctx.enumGroupColumns)), dataSource: ((__VLS_ctx.enumGroups)), pagination: ((__VLS_ctx.pagination)), loading: ((__VLS_ctx.loading)), }, ...__VLS_functionalComponentArgsRest(__VLS_67));
    let __VLS_72;
    const __VLS_73 = {
        onChange: (__VLS_ctx.handleTableChange)
    };
    let __VLS_69;
    let __VLS_70;
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { bodyCell: __VLS_thisSlot } = __VLS_nonNullable(__VLS_71.slots);
        const [{ column, record }] = __VLS_getSlotParams(__VLS_thisSlot);
        if (column.key === 'action') {
            const __VLS_74 = __VLS_resolvedLocalAndGlobalComponents.ASpace;
            /** @type { [typeof __VLS_components.ASpace, typeof __VLS_components.aSpace, typeof __VLS_components.ASpace, typeof __VLS_components.aSpace, ] } */
            // @ts-ignore
            const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({}));
            const __VLS_76 = __VLS_75({}, ...__VLS_functionalComponentArgsRest(__VLS_75));
            const __VLS_80 = __VLS_resolvedLocalAndGlobalComponents.AButton;
            /** @type { [typeof __VLS_components.AButton, typeof __VLS_components.aButton, typeof __VLS_components.AButton, typeof __VLS_components.aButton, ] } */
            // @ts-ignore
            const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({ ...{ 'onClick': {} }, type: ("link"), }));
            const __VLS_82 = __VLS_81({ ...{ 'onClick': {} }, type: ("link"), }, ...__VLS_functionalComponentArgsRest(__VLS_81));
            let __VLS_86;
            const __VLS_87 = {
                onClick: (...[$event]) => {
                    if (!((column.key === 'action')))
                        return;
                    __VLS_ctx.showEditEnumGroupModal(record);
                }
            };
            let __VLS_83;
            let __VLS_84;
            __VLS_nonNullable(__VLS_85.slots).default;
            var __VLS_85;
            const __VLS_88 = __VLS_resolvedLocalAndGlobalComponents.AButton;
            /** @type { [typeof __VLS_components.AButton, typeof __VLS_components.aButton, typeof __VLS_components.AButton, typeof __VLS_components.aButton, ] } */
            // @ts-ignore
            const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({ ...{ 'onClick': {} }, type: ("link"), }));
            const __VLS_90 = __VLS_89({ ...{ 'onClick': {} }, type: ("link"), }, ...__VLS_functionalComponentArgsRest(__VLS_89));
            let __VLS_94;
            const __VLS_95 = {
                onClick: (...[$event]) => {
                    if (!((column.key === 'action')))
                        return;
                    __VLS_ctx.showEnumValues(record);
                }
            };
            let __VLS_91;
            let __VLS_92;
            __VLS_nonNullable(__VLS_93.slots).default;
            var __VLS_93;
            const __VLS_96 = __VLS_resolvedLocalAndGlobalComponents.APopconfirm;
            /** @type { [typeof __VLS_components.APopconfirm, typeof __VLS_components.aPopconfirm, typeof __VLS_components.APopconfirm, typeof __VLS_components.aPopconfirm, ] } */
            // @ts-ignore
            const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({ ...{ 'onConfirm': {} }, title: ((record.active ? '确定要停用这个枚举组吗？' : '确定要启用这个枚举组吗？')), }));
            const __VLS_98 = __VLS_97({ ...{ 'onConfirm': {} }, title: ((record.active ? '确定要停用这个枚举组吗？' : '确定要启用这个枚举组吗？')), }, ...__VLS_functionalComponentArgsRest(__VLS_97));
            let __VLS_102;
            const __VLS_103 = {
                onConfirm: (...[$event]) => {
                    if (!((column.key === 'action')))
                        return;
                    __VLS_ctx.toggleEnumGroupActive(record.id);
                }
            };
            let __VLS_99;
            let __VLS_100;
            const __VLS_104 = __VLS_resolvedLocalAndGlobalComponents.AButton;
            /** @type { [typeof __VLS_components.AButton, typeof __VLS_components.aButton, typeof __VLS_components.AButton, typeof __VLS_components.aButton, ] } */
            // @ts-ignore
            const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({ type: ("link"), danger: ((record.active)), }));
            const __VLS_106 = __VLS_105({ type: ("link"), danger: ((record.active)), }, ...__VLS_functionalComponentArgsRest(__VLS_105));
            (record.active ? '停用' : '启用');
            __VLS_nonNullable(__VLS_109.slots).default;
            var __VLS_109;
            __VLS_nonNullable(__VLS_101.slots).default;
            var __VLS_101;
            __VLS_nonNullable(__VLS_79.slots).default;
            var __VLS_79;
        }
        else if (column.key === 'active') {
            const __VLS_110 = __VLS_resolvedLocalAndGlobalComponents.ATag;
            /** @type { [typeof __VLS_components.ATag, typeof __VLS_components.aTag, typeof __VLS_components.ATag, typeof __VLS_components.aTag, ] } */
            // @ts-ignore
            const __VLS_111 = __VLS_asFunctionalComponent(__VLS_110, new __VLS_110({ color: ((record.active ? 'green' : 'red')), }));
            const __VLS_112 = __VLS_111({ color: ((record.active ? 'green' : 'red')), }, ...__VLS_functionalComponentArgsRest(__VLS_111));
            (record.active ? '激活' : '未激活');
            __VLS_nonNullable(__VLS_115.slots).default;
            var __VLS_115;
        }
    }
    var __VLS_71;
    var __VLS_5;
    const __VLS_116 = __VLS_resolvedLocalAndGlobalComponents.AModal;
    /** @type { [typeof __VLS_components.AModal, typeof __VLS_components.aModal, typeof __VLS_components.AModal, typeof __VLS_components.aModal, ] } */
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({ ...{ 'onOk': {} }, open: ((__VLS_ctx.enumGroupModalVisible)), title: ((__VLS_ctx.enumGroupModalMode === 'add' ? '新增枚举组' : '编辑枚举组')), }));
    const __VLS_118 = __VLS_117({ ...{ 'onOk': {} }, open: ((__VLS_ctx.enumGroupModalVisible)), title: ((__VLS_ctx.enumGroupModalMode === 'add' ? '新增枚举组' : '编辑枚举组')), }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    let __VLS_122;
    const __VLS_123 = {
        onOk: (__VLS_ctx.handleEnumGroupModalOk)
    };
    let __VLS_119;
    let __VLS_120;
    const __VLS_124 = __VLS_resolvedLocalAndGlobalComponents.AForm;
    /** @type { [typeof __VLS_components.AForm, typeof __VLS_components.aForm, typeof __VLS_components.AForm, typeof __VLS_components.aForm, ] } */
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({ model: ((__VLS_ctx.enumGroupForm)), labelCol: (({ span: 6 })), wrapperCol: (({ span: 16 })), }));
    const __VLS_126 = __VLS_125({ model: ((__VLS_ctx.enumGroupForm)), labelCol: (({ span: 6 })), wrapperCol: (({ span: 16 })), }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    if (__VLS_ctx.enumGroupModalMode === 'add') {
        const __VLS_130 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
        /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
        // @ts-ignore
        const __VLS_131 = __VLS_asFunctionalComponent(__VLS_130, new __VLS_130({ label: ("Code"), }));
        const __VLS_132 = __VLS_131({ label: ("Code"), }, ...__VLS_functionalComponentArgsRest(__VLS_131));
        const __VLS_136 = __VLS_resolvedLocalAndGlobalComponents.AInput;
        /** @type { [typeof __VLS_components.AInput, typeof __VLS_components.aInput, ] } */
        // @ts-ignore
        const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({ value: ((__VLS_ctx.enumGroupForm.code)), placeholder: ("例如：difficulty, genre, theme, tag"), }));
        const __VLS_138 = __VLS_137({ value: ((__VLS_ctx.enumGroupForm.code)), placeholder: ("例如：difficulty, genre, theme, tag"), }, ...__VLS_functionalComponentArgsRest(__VLS_137));
        __VLS_nonNullable(__VLS_135.slots).default;
        var __VLS_135;
    }
    const __VLS_142 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_143 = __VLS_asFunctionalComponent(__VLS_142, new __VLS_142({ label: ("描述"), }));
    const __VLS_144 = __VLS_143({ label: ("描述"), }, ...__VLS_functionalComponentArgsRest(__VLS_143));
    const __VLS_148 = __VLS_resolvedLocalAndGlobalComponents.ATextarea;
    /** @type { [typeof __VLS_components.ATextarea, typeof __VLS_components.aTextarea, ] } */
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({ value: ((__VLS_ctx.enumGroupForm.description)), }));
    const __VLS_150 = __VLS_149({ value: ((__VLS_ctx.enumGroupForm.description)), }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    __VLS_nonNullable(__VLS_147.slots).default;
    var __VLS_147;
    __VLS_nonNullable(__VLS_129.slots).default;
    var __VLS_129;
    __VLS_nonNullable(__VLS_121.slots).default;
    var __VLS_121;
    const __VLS_154 = __VLS_resolvedLocalAndGlobalComponents.AModal;
    /** @type { [typeof __VLS_components.AModal, typeof __VLS_components.aModal, typeof __VLS_components.AModal, typeof __VLS_components.aModal, ] } */
    // @ts-ignore
    const __VLS_155 = __VLS_asFunctionalComponent(__VLS_154, new __VLS_154({ open: ((__VLS_ctx.enumValuesModalVisible)), title: (('枚举值管理 - ' + (__VLS_ctx.selectedEnumGroup?.code || ''))), width: ("80%"), footer: ((null)), }));
    const __VLS_156 = __VLS_155({ open: ((__VLS_ctx.enumValuesModalVisible)), title: (('枚举值管理 - ' + (__VLS_ctx.selectedEnumGroup?.code || ''))), width: ("80%"), footer: ((null)), }, ...__VLS_functionalComponentArgsRest(__VLS_155));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ style: ({}) }, });
    const __VLS_160 = __VLS_resolvedLocalAndGlobalComponents.AButton;
    /** @type { [typeof __VLS_components.AButton, typeof __VLS_components.aButton, typeof __VLS_components.AButton, typeof __VLS_components.aButton, ] } */
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({ ...{ 'onClick': {} }, type: ("primary"), }));
    const __VLS_162 = __VLS_161({ ...{ 'onClick': {} }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    let __VLS_166;
    const __VLS_167 = {
        onClick: (__VLS_ctx.showAddEnumValueModal)
    };
    let __VLS_163;
    let __VLS_164;
    __VLS_nonNullable(__VLS_165.slots).default;
    var __VLS_165;
    const __VLS_168 = __VLS_resolvedLocalAndGlobalComponents.ATable;
    /** @type { [typeof __VLS_components.ATable, typeof __VLS_components.aTable, typeof __VLS_components.ATable, typeof __VLS_components.aTable, ] } */
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({ columns: ((__VLS_ctx.enumValueColumns)), dataSource: ((__VLS_ctx.enumValues)), pagination: ((false)), loading: ((__VLS_ctx.valuesLoading)), }));
    const __VLS_170 = __VLS_169({ columns: ((__VLS_ctx.enumValueColumns)), dataSource: ((__VLS_ctx.enumValues)), pagination: ((false)), loading: ((__VLS_ctx.valuesLoading)), }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { bodyCell: __VLS_thisSlot } = __VLS_nonNullable(__VLS_173.slots);
        const [{ column, record }] = __VLS_getSlotParams(__VLS_thisSlot);
        if (column.key === 'action') {
            const __VLS_174 = __VLS_resolvedLocalAndGlobalComponents.ASpace;
            /** @type { [typeof __VLS_components.ASpace, typeof __VLS_components.aSpace, typeof __VLS_components.ASpace, typeof __VLS_components.aSpace, ] } */
            // @ts-ignore
            const __VLS_175 = __VLS_asFunctionalComponent(__VLS_174, new __VLS_174({}));
            const __VLS_176 = __VLS_175({}, ...__VLS_functionalComponentArgsRest(__VLS_175));
            const __VLS_180 = __VLS_resolvedLocalAndGlobalComponents.AButton;
            /** @type { [typeof __VLS_components.AButton, typeof __VLS_components.aButton, typeof __VLS_components.AButton, typeof __VLS_components.aButton, ] } */
            // @ts-ignore
            const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({ ...{ 'onClick': {} }, type: ("link"), }));
            const __VLS_182 = __VLS_181({ ...{ 'onClick': {} }, type: ("link"), }, ...__VLS_functionalComponentArgsRest(__VLS_181));
            let __VLS_186;
            const __VLS_187 = {
                onClick: (...[$event]) => {
                    if (!((column.key === 'action')))
                        return;
                    __VLS_ctx.showEditEnumValueModal(record);
                }
            };
            let __VLS_183;
            let __VLS_184;
            __VLS_nonNullable(__VLS_185.slots).default;
            var __VLS_185;
            const __VLS_188 = __VLS_resolvedLocalAndGlobalComponents.APopconfirm;
            /** @type { [typeof __VLS_components.APopconfirm, typeof __VLS_components.aPopconfirm, typeof __VLS_components.APopconfirm, typeof __VLS_components.aPopconfirm, ] } */
            // @ts-ignore
            const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({ ...{ 'onConfirm': {} }, title: ((record.active ? '确定要停用这个枚举值吗？' : '确定要启用这个枚举值吗？')), }));
            const __VLS_190 = __VLS_189({ ...{ 'onConfirm': {} }, title: ((record.active ? '确定要停用这个枚举值吗？' : '确定要启用这个枚举值吗？')), }, ...__VLS_functionalComponentArgsRest(__VLS_189));
            let __VLS_194;
            const __VLS_195 = {
                onConfirm: (...[$event]) => {
                    if (!((column.key === 'action')))
                        return;
                    __VLS_ctx.toggleEnumValueActive(record.id);
                }
            };
            let __VLS_191;
            let __VLS_192;
            const __VLS_196 = __VLS_resolvedLocalAndGlobalComponents.AButton;
            /** @type { [typeof __VLS_components.AButton, typeof __VLS_components.aButton, typeof __VLS_components.AButton, typeof __VLS_components.aButton, ] } */
            // @ts-ignore
            const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({ type: ("link"), danger: ((record.active)), }));
            const __VLS_198 = __VLS_197({ type: ("link"), danger: ((record.active)), }, ...__VLS_functionalComponentArgsRest(__VLS_197));
            (record.active ? '停用' : '启用');
            __VLS_nonNullable(__VLS_201.slots).default;
            var __VLS_201;
            __VLS_nonNullable(__VLS_193.slots).default;
            var __VLS_193;
            __VLS_nonNullable(__VLS_179.slots).default;
            var __VLS_179;
        }
        else if (column.key === 'active') {
            const __VLS_202 = __VLS_resolvedLocalAndGlobalComponents.ATag;
            /** @type { [typeof __VLS_components.ATag, typeof __VLS_components.aTag, typeof __VLS_components.ATag, typeof __VLS_components.aTag, ] } */
            // @ts-ignore
            const __VLS_203 = __VLS_asFunctionalComponent(__VLS_202, new __VLS_202({ color: ((record.active ? 'green' : 'red')), }));
            const __VLS_204 = __VLS_203({ color: ((record.active ? 'green' : 'red')), }, ...__VLS_functionalComponentArgsRest(__VLS_203));
            (record.active ? '激活' : '未激活');
            __VLS_nonNullable(__VLS_207.slots).default;
            var __VLS_207;
        }
    }
    var __VLS_173;
    __VLS_nonNullable(__VLS_159.slots).default;
    var __VLS_159;
    const __VLS_208 = __VLS_resolvedLocalAndGlobalComponents.AModal;
    /** @type { [typeof __VLS_components.AModal, typeof __VLS_components.aModal, typeof __VLS_components.AModal, typeof __VLS_components.aModal, ] } */
    // @ts-ignore
    const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({ ...{ 'onOk': {} }, open: ((__VLS_ctx.enumValueModalVisible)), title: ((__VLS_ctx.enumValueModalMode === 'add' ? '新增枚举值' : '编辑枚举值')), }));
    const __VLS_210 = __VLS_209({ ...{ 'onOk': {} }, open: ((__VLS_ctx.enumValueModalVisible)), title: ((__VLS_ctx.enumValueModalMode === 'add' ? '新增枚举值' : '编辑枚举值')), }, ...__VLS_functionalComponentArgsRest(__VLS_209));
    let __VLS_214;
    const __VLS_215 = {
        onOk: (__VLS_ctx.handleEnumValueModalOk)
    };
    let __VLS_211;
    let __VLS_212;
    const __VLS_216 = __VLS_resolvedLocalAndGlobalComponents.AForm;
    /** @type { [typeof __VLS_components.AForm, typeof __VLS_components.aForm, typeof __VLS_components.AForm, typeof __VLS_components.aForm, ] } */
    // @ts-ignore
    const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({ model: ((__VLS_ctx.enumValueForm)), labelCol: (({ span: 6 })), wrapperCol: (({ span: 16 })), }));
    const __VLS_218 = __VLS_217({ model: ((__VLS_ctx.enumValueForm)), labelCol: (({ span: 6 })), wrapperCol: (({ span: 16 })), }, ...__VLS_functionalComponentArgsRest(__VLS_217));
    if (__VLS_ctx.enumValueModalMode === 'add') {
        const __VLS_222 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
        /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
        // @ts-ignore
        const __VLS_223 = __VLS_asFunctionalComponent(__VLS_222, new __VLS_222({ label: ("值编码"), }));
        const __VLS_224 = __VLS_223({ label: ("值编码"), }, ...__VLS_functionalComponentArgsRest(__VLS_223));
        const __VLS_228 = __VLS_resolvedLocalAndGlobalComponents.AInput;
        /** @type { [typeof __VLS_components.AInput, typeof __VLS_components.aInput, ] } */
        // @ts-ignore
        const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({ value: ((__VLS_ctx.enumValueForm.code)), }));
        const __VLS_230 = __VLS_229({ value: ((__VLS_ctx.enumValueForm.code)), }, ...__VLS_functionalComponentArgsRest(__VLS_229));
        __VLS_nonNullable(__VLS_227.slots).default;
        var __VLS_227;
    }
    if (__VLS_ctx.enumValueModalMode === 'add') {
        const __VLS_234 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
        /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
        // @ts-ignore
        const __VLS_235 = __VLS_asFunctionalComponent(__VLS_234, new __VLS_234({ label: ("值名称"), }));
        const __VLS_236 = __VLS_235({ label: ("值名称"), }, ...__VLS_functionalComponentArgsRest(__VLS_235));
        const __VLS_240 = __VLS_resolvedLocalAndGlobalComponents.AInput;
        /** @type { [typeof __VLS_components.AInput, typeof __VLS_components.aInput, ] } */
        // @ts-ignore
        const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({ value: ((__VLS_ctx.enumValueForm.value)), }));
        const __VLS_242 = __VLS_241({ value: ((__VLS_ctx.enumValueForm.value)), }, ...__VLS_functionalComponentArgsRest(__VLS_241));
        __VLS_nonNullable(__VLS_239.slots).default;
        var __VLS_239;
    }
    const __VLS_246 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_247 = __VLS_asFunctionalComponent(__VLS_246, new __VLS_246({ label: ("描述"), }));
    const __VLS_248 = __VLS_247({ label: ("描述"), }, ...__VLS_functionalComponentArgsRest(__VLS_247));
    const __VLS_252 = __VLS_resolvedLocalAndGlobalComponents.ATextarea;
    /** @type { [typeof __VLS_components.ATextarea, typeof __VLS_components.aTextarea, ] } */
    // @ts-ignore
    const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({ value: ((__VLS_ctx.enumValueForm.description)), }));
    const __VLS_254 = __VLS_253({ value: ((__VLS_ctx.enumValueForm.description)), }, ...__VLS_functionalComponentArgsRest(__VLS_253));
    __VLS_nonNullable(__VLS_251.slots).default;
    var __VLS_251;
    const __VLS_258 = __VLS_resolvedLocalAndGlobalComponents.AFormItem;
    /** @type { [typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, typeof __VLS_components.AFormItem, typeof __VLS_components.aFormItem, ] } */
    // @ts-ignore
    const __VLS_259 = __VLS_asFunctionalComponent(__VLS_258, new __VLS_258({ label: ("排序序号"), }));
    const __VLS_260 = __VLS_259({ label: ("排序序号"), }, ...__VLS_functionalComponentArgsRest(__VLS_259));
    const __VLS_264 = __VLS_resolvedLocalAndGlobalComponents.AInputNumber;
    /** @type { [typeof __VLS_components.AInputNumber, typeof __VLS_components.aInputNumber, ] } */
    // @ts-ignore
    const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({ value: ((__VLS_ctx.enumValueForm.index)), }));
    const __VLS_266 = __VLS_265({ value: ((__VLS_ctx.enumValueForm.index)), }, ...__VLS_functionalComponentArgsRest(__VLS_265));
    __VLS_nonNullable(__VLS_263.slots).default;
    var __VLS_263;
    __VLS_nonNullable(__VLS_221.slots).default;
    var __VLS_221;
    __VLS_nonNullable(__VLS_213.slots).default;
    var __VLS_213;
    __VLS_styleScopedClasses['enum-management'];
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
            searchForm: searchForm,
            pagination: pagination,
            enumGroupColumns: enumGroupColumns,
            enumValueColumns: enumValueColumns,
            enumGroups: enumGroups,
            enumValues: enumValues,
            selectedEnumGroup: selectedEnumGroup,
            loading: loading,
            valuesLoading: valuesLoading,
            enumGroupModalVisible: enumGroupModalVisible,
            enumValueModalVisible: enumValueModalVisible,
            enumValuesModalVisible: enumValuesModalVisible,
            enumGroupModalMode: enumGroupModalMode,
            enumValueModalMode: enumValueModalMode,
            enumGroupForm: enumGroupForm,
            enumValueForm: enumValueForm,
            handleSearch: handleSearch,
            handleReset: handleReset,
            handleTableChange: handleTableChange,
            showEnumValues: showEnumValues,
            showAddEnumGroupModal: showAddEnumGroupModal,
            showEditEnumGroupModal: showEditEnumGroupModal,
            handleEnumGroupModalOk: handleEnumGroupModalOk,
            showAddEnumValueModal: showAddEnumValueModal,
            showEditEnumValueModal: showEditEnumValueModal,
            handleEnumValueModalOk: handleEnumValueModalOk,
            toggleEnumGroupActive: toggleEnumGroupActive,
            toggleEnumValueActive: toggleEnumValueActive,
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
