<template>
  <div class="puzzle-management">
    <div class="search-form">
      <a-form layout="inline" :model="searchForm">
        <a-form-item label="标题关键字">
          <a-input v-model:value="searchForm.titleKeyword" placeholder="请输入标题关键字" style="width: 200px" allowClear />
        </a-form-item>
        <a-form-item label="标签">
          <a-select
            v-model:value="searchForm.tags"
            mode="multiple"
            placeholder="请选择标签"
            style="width: 200px"
            allowClear
            :loading="tagLoading"
          >
            <a-select-option
              v-for="option in tagOptions"
              :key="option.code"
              :value="option.code"
            >
              {{ option.description }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态">
          <a-select
            v-model:value="searchForm.status"
            style="width: 120px"
            allowClear
            :loading="statusLoading"
            placeholder="请选择状态"
          >
            <a-select-option
              v-for="option in statusOptions"
              :key="option.code"
              :value="option.code"
            >
              {{ option.description }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="AI生成">
          <a-select v-model:value="searchForm.aiGenerated" style="width: 120px" allowClear>
            <a-select-option :value="true">是</a-select-option>
            <a-select-option :value="false">否</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="最小评分">
          <a-input-number v-model:value="searchForm.minRating" :min="0" :max="5" :step="0.1" style="width: 120px" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
          <a-button style="margin-left: 8px" @click="addPuzzle">添加</a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-table :columns="columns" :data-source="tableData" :pagination="pagination" @change="handleTableChange"
      :loading="loading">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'id'">
          {{ record.id }}
        </template>
        <template v-if="column.key === 'title'">
          <a-badge-ribbon v-if="record.aiGenerated" text="AI" color="blue">
            <div style="background: #fafafa; padding: 6px 10px; border-radius: 4px; border: 1px solid #f0f0f0;">
              {{ record.title }}
            </div>
          </a-badge-ribbon>
          <span v-else>{{ record.title }}</span>
        </template>
        <template v-if="column.key === 'tags'">
          <a-tag v-for="tag in record.tags" :key="tag" style="margin: 2px">
            {{ getTagText(tag) }}
          </a-tag>
        </template>
        <template v-if="column.key === 'rating'">
          <a-tag color="blue">{{ record.rating?.toFixed(1) }}分</a-tag>
        </template>
        <template v-if="column.key === 'status'">
          <a-tag :color="getStatusColor(record.status)">
            {{ getStatusText(record.status) }}
          </a-tag>
        </template>

        <template v-if="column.key === 'action'">
          <a-button size="small" type="primary" @click="showDetails(record)">详情</a-button>
        </template>
      </template>
    </a-table>

    <a-modal
      v-model:open="detailModalVisible"
      :title="isEditMode ? '编辑海龟汤' : '海龟汤详情'"
      centered
      width="900px"
      :footer="null"
    >
      <!-- 查看模式 -->
      <div v-if="!isEditMode">
        <a-descriptions bordered :column="2">
          <a-descriptions-item label="ID">{{ currentPuzzle?.id }}</a-descriptions-item>
          <a-descriptions-item label="标题">{{ currentPuzzle?.title }}</a-descriptions-item>

          <a-descriptions-item label="状态">
            <a-tag :color="getStatusColor(currentPuzzle?.status)">
              {{ getStatusText(currentPuzzle?.status) }}
            </a-tag>
          </a-descriptions-item>

          <a-descriptions-item label="AI生成">
            <a-tag :color="currentPuzzle?.aiGenerated ? 'blue' : 'default'">
              {{ currentPuzzle?.aiGenerated ? 'AI生成' : '手动创建' }}
            </a-tag>
          </a-descriptions-item>

          <a-descriptions-item label="评分">
            <a-rate :value="currentPuzzle?.rating" disabled allow-half />
            <span style="margin-left: 8px">{{ currentPuzzle?.rating?.toFixed(1) }}分</span>
          </a-descriptions-item>

          <a-descriptions-item label="游戏次数">{{ currentPuzzle?.playCount }}</a-descriptions-item>

          <a-descriptions-item label="创建者">{{ currentPuzzle?.createdBy }}</a-descriptions-item>

          <a-descriptions-item label="创建时间">{{ formatDateTime(currentPuzzle?.createdAt) }}</a-descriptions-item>

          <a-descriptions-item label="更新时间">{{ formatDateTime(currentPuzzle?.updatedAt) }}</a-descriptions-item>

          <a-descriptions-item label="标签" :span="2">
            <a-tag
              v-for="(tag, index) in currentPuzzle?.tags"
              :key="index"
              style="margin: 2px"
            >
              {{ getTagText(tag) }}
            </a-tag>
          </a-descriptions-item>

          <a-descriptions-item label="汤面" :span="2">
            <div style="white-space: pre-wrap; word-wrap: break-word;">{{ currentPuzzle?.description }}</div>
          </a-descriptions-item>

          <a-descriptions-item label="汤底" :span="2">
            <div style="white-space: pre-wrap; word-wrap: break-word; background-color: #f5f5f5; padding: 12px; border-radius: 4px;">
              {{ currentPuzzle?.answer }}
            </div>
          </a-descriptions-item>

          <a-descriptions-item label="提示" :span="2">
            <ul style="list-style-type: disc; padding-left: 20px; margin: 0;">
              <li v-for="(hint, index) in currentPuzzle?.hints" :key="index" style="margin-bottom: 4px;">
                {{ hint }}
              </li>
            </ul>
          </a-descriptions-item>
        </a-descriptions>

        <!-- 查看模式的按钮 -->
        <div style="text-align: right; margin-top: 16px;">
          <a-space>
            <a-button @click="closeDetailModal">关闭</a-button>
            <a-button type="primary" @click="enterEditMode">编辑</a-button>
          </a-space>
        </div>
      </div>

      <!-- 编辑模式 -->
      <div v-else>
        <puzzle-form
          :initial-data="editFormData"
          :status-options="statusOptions"
          :status-loading="statusLoading"
          :tag-options="tagOptions"
          :tag-loading="tagLoading"
          @submit="handleSave"
          @cancel="exitEditMode"
        />
      </div>
    </a-modal>

    <!-- 创建海龟汤弹窗 -->
    <a-modal
      v-model:open="createModalVisible"
      title="新增海龟汤"
      centered
      width="900px"
      :footer="null"
    >
      <puzzle-form
        :initial-data="createFormData"
        :status-options="statusOptions"
        :status-loading="statusLoading"
        :tag-options="tagOptions"
        :tag-loading="tagLoading"
        :is-create-mode="true"
        @submit="handleCreate"
        @cancel="closeCreateModal"
      />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { http } from '../../utils/http'
import PuzzleForm from '../../components/business/PuzzleForm.vue'
import type { TablePaginationConfig } from 'ant-design-vue'
import type { SoupPageRequest } from '../../types/PuzzleTypes'

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

interface SearchForm {
  titleKeyword?: string
  tags?: string[]
  status?: string
  createdBy?: string
  aiGenerated?: boolean
  minRating?: number
  createdAtStart?: string
  createdAtEnd?: string
}

interface SoupData {
  id: string
  title: string
  description: string
  answer: string
  hints: string[]
  tags: string[]
  playCount: number
  rating: number
  status: string
  createdBy: string
  aiGenerated: boolean
  createdAt: string
  updatedAt: string
}

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
]

const tableData = ref<SoupData[]>([])
const loading = ref(false)

const pagination = ref<TablePaginationConfig>({
  total: 0,
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共 ${total} 条`,
})

const searchForm = reactive<SearchForm>({
  titleKeyword: undefined,
  tags: undefined,
  status: undefined,
  createdBy: undefined,
  aiGenerated: undefined,
  minRating: undefined,
  createdAtStart: undefined,
  createdAtEnd: undefined
})

const detailModalVisible = ref<boolean>(false)
const currentPuzzle = ref<SoupData | null>(null)
const isEditMode = ref<boolean>(false)
const editFormData = ref<SoupData | null>(null)

// 创建弹窗相关状态
const createModalVisible = ref<boolean>(false)
const createFormData = ref<any>(null)

// 枚举值数据
const statusOptions = ref<Array<{code: string, value: string, description: string}>>([])
const statusLoading = ref(false)
const tagOptions = ref<Array<{code: string, value: string, description: string}>>([])
const tagLoading = ref(false)

// 获取状态枚举值
const getStatusOptions = async () => {
  statusLoading.value = true
  try {
    const response = await http.get('/m/enum/group/SOUP_STATUS/values')
    if ((response.code === 0 || response.code === 200) && response.data) {
      statusOptions.value = response.data.filter((item: any) => item.active).map((item: any) => ({
        code: item.code,
        value: item.value,
        description: item.description
      }))
      console.log('获取到的状态选项:', statusOptions.value)
    }
  } catch (error) {
    console.error('Failed to fetch status options:', error)
  } finally {
    statusLoading.value = false
  }
}

// 获取标签枚举值
const getTagOptions = async () => {
  tagLoading.value = true
  try {
    const response = await http.get('/app/enum/groups/SOUP_TAG/values')
    if ((response.code === 0 || response.code === 200) && response.data) {
      tagOptions.value = response.data.filter((item: any) => item.active).map((item: any) => ({
        code: item.code,
        value: item.value,
        description: item.description
      }))
      console.log('获取到的标签选项:', tagOptions.value)
    }
  } catch (error) {
    console.error('Failed to fetch tag options:', error)
  } finally {
    tagLoading.value = false
  }
}

const getPuzzles = async (page = 1, pageSize = 10) => {
  loading.value = true

  // 构建分页查询请求体
  const requestBody: SoupPageRequest = {
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
  }

  try {
    const result = await http.post('/m/soup/pageQuery', requestBody)
    console.log('Request body:', requestBody, 'Response:', result)
    if ((result.code === 0 || result.code === 200) && result.data) {
      tableData.value = result.data.rows
      pagination.value.total = result.data.total
      pagination.value.current = result.data.pageNum
      pagination.value.pageSize = result.data.pageSize
    }
  } catch (error: any) {
    console.error('Error fetching puzzles:', error)
  } finally {
    loading.value = false
  }
}

const handleTableChange = (pag: TablePaginationConfig) => {
  getPuzzles(pag.current, pag.pageSize)
}

// 状态颜色映射
const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    'draft': 'default',
    'pending_review': 'orange',
    'published': 'green',
    'archived': 'red'
  }
  return colorMap[status] || 'default'
}

// 状态文本映射 - 从枚举值中获取
const getStatusText = (status: string) => {
  const statusOption = statusOptions.value.find(option => option.code === status || option.value === status)
  return statusOption ? statusOption.description : status
}

// 标签文本映射 - 从枚举值中获取
const getTagText = (tag: string) => {
  const tagOption = tagOptions.value.find(option => option.code === tag || option.value === tag)
  return tagOption ? tagOption.description : tag
}

const handleSearch = () => {
  getPuzzles(1, pagination.value.pageSize)
}

const handleReset = () => {
  searchForm.titleKeyword = undefined
  searchForm.tags = undefined
  searchForm.status = undefined
  searchForm.createdBy = undefined
  searchForm.aiGenerated = undefined
  searchForm.minRating = undefined
  searchForm.createdAtStart = undefined
  searchForm.createdAtEnd = undefined
  getPuzzles(1, pagination.value.pageSize)
}

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
  }
  createModalVisible.value = true
}

// 关闭创建弹窗
const closeCreateModal = () => {
  createModalVisible.value = false
  createFormData.value = null
}

// 处理创建提交
const handleCreate = async (formData: any) => {
  try {
    const createData = {
      title: formData.title,
      description: formData.description,
      answer: formData.answer,
      hints: formData.hints,
      tags: formData.tags,
      status: mapEnumCodeToBackendValue(formData.status),
      aiGenerated: formData.aiGenerated
    }

    console.log('创建海龟汤 - 提交数据:', createData)

    const response = await http.post('/m/soup/create', createData)

    if (response.code === 0 || response.code === 200) {
      message.success('创建成功')
      // 刷新列表
      getPuzzles(pagination.value.current, pagination.value.pageSize)
      // 关闭弹窗
      closeCreateModal()
    } else {
      message.error(response.message || '创建失败')
    }
  } catch (error) {
    message.error('创建失败')
    console.error('Failed to create puzzle:', error)
  }
}

const showDetails = (record: SoupData) => {
  currentPuzzle.value = record
  isEditMode.value = false
  detailModalVisible.value = true
}

const closeDetailModal = () => {
  detailModalVisible.value = false
  currentPuzzle.value = null
  isEditMode.value = false
  editFormData.value = null
}

// 进入编辑模式
const enterEditMode = () => {
  if (currentPuzzle.value) {
    // 确保状态值正确映射到枚举选项
    const originalStatus = currentPuzzle.value.status
    const mappedStatus = mapStatusToEnumCode(originalStatus)
    console.log('进入编辑模式 - 原始状态:', originalStatus, '映射后状态:', mappedStatus)

    // 确保标签值正确映射到枚举选项
    const originalTags = currentPuzzle.value.tags
    const mappedTags = mapTagsToEnumCodes(originalTags)
    console.log('进入编辑模式 - 原始标签:', originalTags, '映射后标签:', mappedTags)

    editFormData.value = {
      ...currentPuzzle.value,
      status: mappedStatus,
      tags: mappedTags
    }
    isEditMode.value = true
  }
}

// 将状态值映射到枚举代码
const mapStatusToEnumCode = (status: string) => {
  if (!status) return 'draft' // 默认值

  // 首先尝试直接匹配code
  const directMatch = statusOptions.value.find(option => option.code === status)
  if (directMatch) return status

  // 然后尝试匹配value
  const valueMatch = statusOptions.value.find(option => option.value === status)
  if (valueMatch) return valueMatch.code

  // 如果都没匹配到，返回默认值
  return 'draft'
}

// 将枚举代码转换为后端期望的值
const mapEnumCodeToBackendValue = (code: string) => {
  const option = statusOptions.value.find(option => option.code === code)
  // 根据API文档，后端可能期望code或value，这里我们使用code
  return option ? option.code : code
}

// 将标签值映射到枚举代码
const mapTagsToEnumCodes = (tags: string[]) => {
  if (!tags || !Array.isArray(tags)) return []

  return tags.map(tag => {
    // 首先尝试直接匹配code
    const directMatch = tagOptions.value.find(option => option.code === tag)
    if (directMatch) return tag

    // 然后尝试匹配value
    const valueMatch = tagOptions.value.find(option => option.value === tag)
    if (valueMatch) return valueMatch.code

    // 如果都没匹配到，返回原值
    return tag
  })
}

// 退出编辑模式
const exitEditMode = () => {
  isEditMode.value = false
  editFormData.value = null
}

// 保存编辑
const handleSave = async (formData: any) => {
  try {
    const originalStatus = formData.status
    const backendStatus = mapEnumCodeToBackendValue(originalStatus)
    console.log('保存编辑 - 表单状态:', originalStatus, '后端状态:', backendStatus)

    const updateData = {
      id: currentPuzzle.value?.id,
      title: formData.title,
      description: formData.description,
      answer: formData.answer,
      hints: formData.hints,
      tags: formData.tags,
      status: backendStatus,
      aiGenerated: formData.aiGenerated
    }

    const response = await http.put('/m/soup/update', updateData)

    if (response.code === 0 || response.code === 200) {
      message.success('保存成功')
      // 更新当前显示的数据
      if (response.data) {
        currentPuzzle.value = response.data
      }
      // 刷新列表
      getPuzzles(pagination.value.current, pagination.value.pageSize)
      // 退出编辑模式
      exitEditMode()
    } else {
      message.error(response.message || '保存失败')
    }
  } catch (error) {
    message.error('保存失败')
    console.error('Failed to save puzzle:', error)
  }
}

onMounted(() => {
  getPuzzles()
  getStatusOptions()
  getTagOptions()
})
</script>

<style scoped>
.puzzle-management {
  padding: 24px;
}

.search-form {
  margin-bottom: 24px;
}

.ant-form-item {
  margin-bottom: 16px;
}

.ellipsis-text {
  display: inline-block;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.puzzle-details h3 {
  margin-top: 16px;
  margin-bottom: 8px;
  color: #1890ff;
}

.puzzle-details p {
  margin-bottom: 8px;
}
</style>






