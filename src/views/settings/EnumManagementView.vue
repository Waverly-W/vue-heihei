<template>
  <div class="enum-management">
    <a-card title="枚举组管理">
      <!-- 搜索表单 -->
      <a-form layout="inline" style="margin-bottom: 16px">
        <a-form-item label="Code">
          <a-input v-model:value="searchForm.code" placeholder="请输入Code" style="width: 200px" />
        </a-form-item>
        <a-form-item label="描述">
          <a-input v-model:value="searchForm.description" placeholder="请输入描述" style="width: 200px" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>

      <!-- 枚举组表格 -->
      <template #extra>
        <a-button type="primary" @click="showAddEnumGroupModal">新增枚举组</a-button>
      </template>
      <a-table
        :columns="enumGroupColumns"
        :data-source="enumGroups"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="showEditEnumGroupModal(record)">编辑</a-button>
              <a-button type="link" @click="showEnumValues(record)">查看枚举值</a-button>
              <a-popconfirm
                :title="record.active ? '确定要停用这个枚举组吗？' : '确定要启用这个枚举组吗？'"
                @confirm="toggleEnumGroupActive(record.id)"
              >
                <a-button type="link" :danger="record.active">
                  {{ record.active ? '停用' : '启用' }}
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
          <template v-else-if="column.key === 'active'">
            <a-tag :color="record.active ? 'green' : 'red'">
              {{ record.active ? '激活' : '未激活' }}
            </a-tag>
          </template>
        </template>
      </a-table>
    </a-card>



    <!-- 新增/编辑枚举组模态框 -->
    <a-modal
      v-model:open="enumGroupModalVisible"
      :title="enumGroupModalMode === 'add' ? '新增枚举组' : '编辑枚举组'"
      @ok="handleEnumGroupModalOk"
    >
      <a-form :model="enumGroupForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="Code" v-if="enumGroupModalMode === 'add'">
          <a-input v-model:value="enumGroupForm.code" placeholder="例如：difficulty, genre, theme, tag" />
        </a-form-item>
        <a-form-item label="描述">
          <a-textarea v-model:value="enumGroupForm.description" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 枚举值管理弹窗 -->
    <a-modal
      v-model:open="enumValuesModalVisible"
      :title="'枚举值管理 - ' + (selectedEnumGroup?.code || '')"
      width="80%"
      :footer="null"
    >
      <div style="margin-bottom: 16px">
        <a-button type="primary" @click="showAddEnumValueModal">新增枚举值</a-button>
      </div>
      <a-table
        :columns="enumValueColumns"
        :data-source="enumValues"
        :pagination="false"
        :loading="valuesLoading"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="showEditEnumValueModal(record)">编辑</a-button>
              <a-popconfirm
                :title="record.active ? '确定要停用这个枚举值吗？' : '确定要启用这个枚举值吗？'"
                @confirm="toggleEnumValueActive(record.id)"
              >
                <a-button type="link" :danger="record.active">
                  {{ record.active ? '停用' : '启用' }}
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
          <template v-else-if="column.key === 'active'">
            <a-tag :color="record.active ? 'green' : 'red'">
              {{ record.active ? '激活' : '未激活' }}
            </a-tag>
          </template>
        </template>
      </a-table>
    </a-modal>

    <!-- 新增/编辑枚举值模态框 -->
    <a-modal
      v-model:open="enumValueModalVisible"
      :title="enumValueModalMode === 'add' ? '新增枚举值' : '编辑枚举值'"
      @ok="handleEnumValueModalOk"
    >
      <a-form :model="enumValueForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="值编码" v-if="enumValueModalMode === 'add'">
          <a-input v-model:value="enumValueForm.code" />
        </a-form-item>
        <a-form-item label="值名称" v-if="enumValueModalMode === 'add'">
          <a-input v-model:value="enumValueForm.value" />
        </a-form-item>
        <a-form-item label="描述">
          <a-textarea v-model:value="enumValueForm.description" />
        </a-form-item>
        <a-form-item label="排序序号">
          <a-input-number v-model:value="enumValueForm.index" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { http } from '../../utils/http'
import type { EnumPageRequest } from '../../types/PuzzleTypes'

// 搜索表单
const searchForm = ref({
  code: '',
  description: ''
})

// 分页配置
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`
})

// 时间格式化函数
const formatDateTime = (dateTimeStr: string) => {
  if (!dateTimeStr) return ''
  const date = new Date(dateTimeStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

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
    customRender: ({ text }: { text: string }) => formatDateTime(text)
  },
  {
    title: '操作',
    key: 'action'
  }
]

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
    customRender: ({ text }: { text: string }) => formatDateTime(text)
  },
  {
    title: '操作',
    key: 'action'
  }
]

// 数据状态
const enumGroups = ref<any[]>([])
const enumValues = ref<any[]>([])
const selectedEnumGroup = ref<any>(null)
const loading = ref(false)
const valuesLoading = ref(false)

// 模态框状态
const enumGroupModalVisible = ref(false)
const enumValueModalVisible = ref(false)
const enumValuesModalVisible = ref(false)
const enumGroupModalMode = ref<'add' | 'edit'>('add')
const enumValueModalMode = ref<'add' | 'edit'>('add')
const enumGroupForm = ref({
  id: null,
  code: '',
  description: ''
})
const enumValueForm = ref({
  id: null,
  groupId: null,
  code: '',
  value: '',
  description: '',
  index: 0
})

// 获取枚举组列表
const fetchEnumGroups = async () => {
  loading.value = true
  try {
    // 构建分页查询请求体
    const requestBody: EnumPageRequest = {
      pageNum: pagination.value.current,
      pageSize: pagination.value.pageSize,
      code: searchForm.value.code || undefined,
      description: searchForm.value.description || undefined
    }

    const response = await http.post('/m/enum/groups', requestBody)
    console.log('Request body:', requestBody, 'Response:', response)
    if (response.code === 200) {
      enumGroups.value = response.data
      pagination.value.total = response.total || response.data.length
    } else {
      message.error(response.message || '获取枚举组列表失败')
    }
  } catch (error) {
    console.error('获取枚举组列表错误:', error)
    message.error('获取枚举组列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.value.current = 1
  fetchEnumGroups()
}

// 重置搜索
const handleReset = () => {
  searchForm.value = {
    code: '',
    description: ''
  }
  pagination.value.current = 1
  fetchEnumGroups()
}

// 表格变化处理
const handleTableChange = (pag: any) => {
  pagination.value.current = pag.current
  pagination.value.pageSize = pag.pageSize
  fetchEnumGroups()
}

// 显示枚举值
const showEnumValues = async (record: any) => {
  selectedEnumGroup.value = record
  enumValuesModalVisible.value = true
  await fetchEnumValues(record.code)
}

// 获取枚举值列表
const fetchEnumValues = async (groupCode: string) => {
  valuesLoading.value = true
  try {
    const response = await http.get(`/m/enum/group/${groupCode}/values`)
    console.log('枚举值响应数据:', response)
    if (response.code === 200) {
      enumValues.value = response.data
    } else {
      message.error(response.message || '获取枚举值列表失败')
    }
  } catch (error) {
    console.error('获取枚举值列表错误:', error)
    message.error('获取枚举值列表失败')
  } finally {
    valuesLoading.value = false
  }
}

// 新增枚举组相关方法
const showAddEnumGroupModal = () => {
  enumGroupModalMode.value = 'add'
  enumGroupForm.value = {
    id: null,
    code: '',
    description: ''
  }
  enumGroupModalVisible.value = true
}

const showEditEnumGroupModal = (record: any) => {
  enumGroupModalMode.value = 'edit'
  enumGroupForm.value = {
    id: record.id,
    code: record.code,
    description: record.description
  }
  enumGroupModalVisible.value = true
}

const handleEnumGroupModalOk = async () => {
  try {
    if (enumGroupModalMode.value === 'add') {
      const payload = {
        code: enumGroupForm.value.code,
        description: enumGroupForm.value.description
      }
      const response = await http.post('/m/enum/group/add', payload)
      if (response.code === 200) {
        message.success('添加枚举组成功')
        enumGroupModalVisible.value = false
        await updateEnumLists()
      } else {
        message.error(response.message || '操作失败')
      }
    } else {
      const payload = {
        id: enumGroupForm.value.id,
        description: enumGroupForm.value.description
      }
      const response = await http.post('/m/enum/group/updateDesc', payload)
      if (response.code === 200) {
        message.success('更新枚举组成功')
        enumGroupModalVisible.value = false
        await updateEnumLists()
      } else {
        message.error(response.message || '操作失败')
      }
    }
  } catch (error) {
    message.error('操作失败')
  }
}

// 新增枚举值相关方法
const showAddEnumValueModal = () => {
  enumValueModalMode.value = 'add'
  enumValueForm.value = {
    id: null,
    groupId: selectedEnumGroup.value.id,
    code: '',
    value: '',
    description: '',
    index: 0
  }
  enumValueModalVisible.value = true
}

const showEditEnumValueModal = (record: any) => {
  enumValueModalMode.value = 'edit'
  enumValueForm.value = {
    id: record.id,
    groupId: selectedEnumGroup.value.id,
    code: record.code,
    value: record.value,
    description: record.description,
    index: record.index
  }
  enumValueModalVisible.value = true
}

const handleEnumValueModalOk = async () => {
  try {
    if (enumValueModalMode.value === 'add') {
      const payload = {
        groupId: enumValueForm.value.groupId,
        code: enumValueForm.value.code,
        value: enumValueForm.value.value,
        description: enumValueForm.value.description,
        index: enumValueForm.value.index
      }
      const response = await http.post('/m/enum/value/add', payload)
      if (response.code === 200) {
        message.success('添加枚举值成功')
        enumValueModalVisible.value = false
        await updateEnumLists()
      } else {
        message.error(response.message || '操作失败')
      }
    } else {
      const payload = {
        valueId: enumValueForm.value.id,
        description: enumValueForm.value.description,
        index: enumValueForm.value.index
      }
      const response = await http.post('/m/enum/value/update', payload)
      if (response.code === 200) {
        message.success('更新枚举值成功')
        enumValueModalVisible.value = false
        await updateEnumLists()
      } else {
        message.error(response.message || '操作失败')
      }
    }
  } catch (error) {
    message.error('操作失败')
  }
}

// 切换激活状态方法
const toggleEnumGroupActive = async (id: string) => {
  try {
    const response = await http.post('/m/enum/group/switchStatus', { id })
    if (response.code === 200) {
      message.success('切换枚举组激活状态成功')
      await updateEnumLists()
    } else {
      message.error(response.message || '操作失败')
    }
  } catch (error) {
    message.error('操作失败')
  }
}

const toggleEnumValueActive = async (id: string) => {
  try {
    const response = await http.post('/m/enum/value/switchStatus', { id })
    if (response.code === 200) {
      message.success('切换枚举值激活状态成功')
      await updateEnumLists()
    } else {
      message.error(response.message || '操作失败')
    }
  } catch (error) {
    message.error('操作失败')
  }
}

// 更新枚举组和枚举值列表
const updateEnumLists = async () => {
  await fetchEnumGroups()
  // 如果当前有选中的枚举组且弹窗打开，更新枚举值列表
  if (selectedEnumGroup.value && enumValuesModalVisible.value) {
    const updatedGroup = enumGroups.value.find(group => group.id === selectedEnumGroup.value.id)
    if (updatedGroup) {
      selectedEnumGroup.value = updatedGroup
      await fetchEnumValues(updatedGroup.code)
    }
  }
}

onMounted(() => {
  fetchEnumGroups()
})
</script>

<style scoped>
.enum-management {
  padding: 24px;
}
</style>
