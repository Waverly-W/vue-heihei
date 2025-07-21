<template>
  <div class="puzzle-management">
    <div class="search-form">
      <a-form layout="inline" :model="searchForm">
        <a-form-item label="标题关键字">
          <a-input v-model:value="searchForm.titleKeyword" placeholder="请输入标题关键字" style="width: 200px" allowClear />
        </a-form-item>
        <a-form-item label="标签">
          <a-select v-model:value="searchForm.tags" mode="multiple" placeholder="请选择标签" style="width: 200px" allowClear>
            <a-select-option value="悬疑">悬疑</a-select-option>
            <a-select-option value="推理">推理</a-select-option>
            <a-select-option value="恐怖">恐怖</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="searchForm.status" style="width: 120px" allowClear>
            <a-select-option value="ACTIVE">启用</a-select-option>
            <a-select-option value="INACTIVE">禁用</a-select-option>
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
        <template v-if="column.key === 'tags'">
          <a-tag v-for="tag in record.tags" :key="tag" style="margin: 2px">
            {{ tag }}
          </a-tag>
        </template>
        <template v-if="column.key === 'rating'">
          <a-tag color="blue">{{ record.rating?.toFixed(1) }}分</a-tag>
        </template>
        <template v-if="column.key === 'status'">
          <a-tag :color="record.status === 'ACTIVE' ? 'green' : 'red'">
            {{ record.status === 'ACTIVE' ? '启用' : '禁用' }}
          </a-tag>
        </template>
        <template v-if="column.key === 'aiGenerated'">
          <a-tag :color="record.aiGenerated ? 'blue' : 'default'">
            {{ record.aiGenerated ? 'AI生成' : '手动创建' }}
          </a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button size="small" @click="editPuzzle(record)">编辑</a-button>
            <a-button size="small" type="link" @click="showDetails(record)">详情</a-button>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal
      v-model:open="detailModalVisible"
      title="题目详情"
      centered
      width="900px"
      @ok="closeDetailModal"
    >
      <a-descriptions title="海龟汤详情" bordered :column="2">
        <a-descriptions-item label="ID">{{ currentPuzzle?.id }}</a-descriptions-item>
        <a-descriptions-item label="标题">{{ currentPuzzle?.title }}</a-descriptions-item>
        
        <a-descriptions-item label="状态">
          <a-tag :color="currentPuzzle?.status === 'ACTIVE' ? 'green' : 'red'">
            {{ currentPuzzle?.status === 'ACTIVE' ? '启用' : '禁用' }}
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
            {{ tag }}
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
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '../utils/http'
import type { TablePaginationConfig } from 'ant-design-vue'

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

const router = useRouter()

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
    title: 'AI生成',
    dataIndex: 'aiGenerated',
    key: 'aiGenerated',
    width: 100,
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
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

const getPuzzles = async (page = 1, pageSize = 10) => {
  loading.value = true
  const params = {
    pageNum: page,
    pageSize: pageSize,
    ...searchForm
  }
  try {
    const result = await http.get('/m/soup/pageQuery', { params })
    console.log(params, result)
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

const editPuzzle = (record: SoupData) => {
  router.push({
    path: `/edit/${record.id}`
  })
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
  router.push('/create')
}

const showDetails = (record: SoupData) => {
  currentPuzzle.value = record
  detailModalVisible.value = true
}

const closeDetailModal = () => {
  detailModalVisible.value = false
  currentPuzzle.value = null
}

onMounted(() => {
  getPuzzles()
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






