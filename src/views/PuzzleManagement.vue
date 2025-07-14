<template>
  <div class="puzzle-management">
    <h1>Puzzle Management</h1>
    <div class="search-form">
      <a-form layout="inline" :model="searchForm">
        <a-form-item label="难度">
          <a-select v-model:value="searchForm.difficulty" style="width: 120px" allowClear>
            <a-select-option 
              v-for="item in difficultyOptions" 
              :key="item.valueCode" 
              :value="item.valueCode"
            >
              {{ item.valueName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="searchForm.isActive" style="width: 120px" allowClear>
            <a-select-option :value="true">启用</a-select-option>
            <a-select-option :value="false">禁用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="分数范围" style="width: 300px">
          <a-slider
            v-model:value="scoreRange"
            range
            :marks="scoreMarks"
            :step="5"
            @change="handleScoreChange"
          >
            <template #mark="{ label }">
              {{ label }}
            </template>
          </a-slider>
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
        <template v-if="column.key === 'difficultyLevel'">
          <a-tag :bordered="false" :color="getDifficultyColor(record.difficultyLevel)">
            {{ record.difficultyLevel }}
          </a-tag>
        </template>
        <template v-if="column.key === 'prompt'">
          <a-tooltip>
            <template #title>{{ record.prompt }}</template>
            <span class="ellipsis-text">{{ record.prompt }}</span>
          </a-tooltip>
        </template>
        <template v-if="column.key === 'score'">
          <a-popover title="详细得分">
            <template #content>
              <p>逻辑: {{ record.score.logicScore }}</p>
              <p>趣味: {{ record.score.funScore }}</p>
              <p>难度: {{ record.score.difficultyScore }}</p>
              <p>多样性: {{ record.score.diversityScore }}</p>
              <p>总分: {{ record.score.totalScore }}</p>
            </template>
            <p><strong>{{ record.score.totalScore }}</strong></p>
          </a-popover>
        </template>
        <template v-if="column.key === 'active'">
          <a-switch v-model:checked="record.active" @change="(checked) => handleStatusChange(record.id, checked)" />
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
      width="800px"
      @ok="closeDetailModal"
    >
      <div class="puzzle-details">
        <h3>汤面</h3>
        <p>{{ currentPuzzle?.prompt }}</p>
        
        <h3>汤底</h3>
        <pre style="white-space: pre-wrap; word-wrap: break-word;">{{ currentPuzzle?.solution }}</pre>
        
        <h3>关键点</h3>
        <ul style="list-style-type: disc; padding-left: 20px;">
          <li v-for="(point, index) in currentPuzzle?.keyPoints" :key="index">{{ point }}</li>
        </ul>
        
        <h3>主题标签</h3>
        <div>
          <a-tag
            v-for="(theme, index) in currentPuzzle?.theme"
            :key="index"
            style="margin: 4px"
          >
            {{ theme }}
          </a-tag>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '../utils/http'
import { Modal } from 'ant-design-vue'
import type { TablePaginationConfig } from 'ant-design-vue'
import type { EnumValue } from '../types/PuzzleTypes'

interface SearchForm {
  difficulty?: string
  isActive?: boolean
  minScore?: string
  maxScore?: string
}

interface PuzzleScore {
  logicScore: number
  funScore: number
  difficultyScore: number
  diversityScore: number
  totalScore: number
}

interface PuzzleData {
  id: number
  difficultyLevel: string
  theme: string[]
  prompt: string
  solution: string
  keyPoints: string[]
  creator: string
  modifier: string | null
  versionNumber: number
  score: PuzzleScore
  createdDate: number
  lastModifiedDate: number
  active: boolean
  valid: boolean
}

const router = useRouter()

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 60,
  },
  {
    title: '难度',
    dataIndex: 'difficultyLevel',
    key: 'difficultyLevel',
    width: 80,
  },
  {
    title: '汤面',
    dataIndex: 'prompt',
    key: 'prompt',
    ellipsis: true,
    width: 300,
  },
  {
    title: '评分',
    dataIndex: 'score',
    key: 'score',
    width: 80,
  },
  {
    title: '状态',
    dataIndex: 'active',
    key: 'active',
    width: 80,
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
  },
]

const tableData = ref<PuzzleData[]>([])
const loading = ref(false)
const activeKeys = reactive<Record<number, string[]>>({})

const pagination = ref<TablePaginationConfig>({
  total: 0,
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共 ${total} 条`,
})

const searchForm = reactive<SearchForm>({
  difficulty: undefined,
  isActive: undefined,
  minScore: undefined,
  maxScore: undefined
})

const scoreMarks = {
  0: '0',
  20: '20',
  40: '40',
  60: '60',
  80: '80',
  100: {
    style: {
      color: '#f50',
    },
    label: '100',
  },
}

const scoreRange = ref<[number, number]>([0, 100])

const difficultyOptions = ref<EnumValue[]>([])
const detailModalVisible = ref<boolean>(false)
const currentPuzzle = ref<PuzzleData | null>(null)

const handleScoreChange = (value: [number, number]) => {
  searchForm.minScore = value[0].toString()
  searchForm.maxScore = value[1].toString()
}

const getDifficultyColor = (difficulty: string) => {
  const difficultyItem = difficultyOptions.value.find(item => item.valueName === difficulty)
  const colors = {
    "简单": 'green',
    "中等": 'blue',
    "困难": 'orange',
    "专家": 'red'
  }
  return colors[difficulty] || 'blue'
}

const getPuzzles = async (page = 1, pageSize = 10) => {
  loading.value = true
  const params = {
    pageNumber: page,
    pageSize: pageSize,
    ...searchForm
  }
  try {
    const result = await http.post('/manage/puzzle/page', params)
    console.log(params, result)
    tableData.value = result.list
    pagination.value.total = result.total
    pagination.value.current = page
    pagination.value.pageSize = pageSize
  } catch (error: any) {
    console.error('Error fetching puzzles:', error)
  } finally {
    loading.value = false
  }
}

const handleTableChange = (pag: TablePaginationConfig) => {
  getPuzzles(pag.current, pag.pageSize)
}

const editPuzzle = (record: PuzzleData) => {
  router.push({
    path: `/edit/${record.id}`
  })
}

const handleStatusChange = async (id: number, status: boolean) => {
  try {
    await http.put(`/manage/puzzle/chgSts/${id}`, { active: status })
    // Refresh the current page data
    getPuzzles(pagination.value.current, pagination.value.pageSize)
  } catch (error) {
    console.error('Failed to update status:', error)
  }
}

const handleSearch = () => {
  getPuzzles(1, pagination.value.pageSize)
}

const handleReset = () => {
  searchForm.difficulty = undefined
  searchForm.isActive = undefined
  searchForm.minScore = undefined
  searchForm.maxScore = undefined
  scoreRange.value = [0, 100]
  getPuzzles(1, pagination.value.pageSize)
}

const addPuzzle = () => {
  router.push('/create')
}

const showDetails = (record: PuzzleData) => {
  currentPuzzle.value = record
  detailModalVisible.value = true
}

const closeDetailModal = () => {
  detailModalVisible.value = false
  currentPuzzle.value = null
}

const getDifficultyEnum = async () => {
  try {
    const result = await http.get('/config/enum/DIFFICULTY')
    if (result.code === '200' && result.enumValues) {
      difficultyOptions.value = result.enumValues.filter(item => !item.deleted)
    }
  } catch (error) {
    console.error('获取难度枚举失败:', error)
  }
}

onMounted(() => {
  getDifficultyEnum()
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

:deep(.ant-slider) {
  margin: 8px 10px 32px;
}

:deep(.ant-slider-mark-text) {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

:deep(.ant-slider-with-marks) {
  margin-bottom: 28px;
}

:deep(.ant-collapse) {
  background: transparent;
  border: none;
}

:deep(.ant-collapse-header) {
  padding: 4px 0 !important;
}

:deep(.ant-collapse-content) {
  background: transparent;
}

.ellipsis-text {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
