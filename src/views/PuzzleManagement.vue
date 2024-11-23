<template>
  <div class="puzzle-management">
    <h1>Puzzle Management</h1>
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
        <template v-if="column.key === 'theme'">
          <a-tag :bordered="false" :color="getDifficultyColor(record.difficultyLevel)">{{ record.theme }}</a-tag>
        </template>
        <template v-if="column.key === 'prompt'">
          <a-collapse v-model:activeKey="activeKeys[record.id]" :bordered="false">
            <a-collapse-panel key="1" :header="record.prompt">
              <p><strong>解答：</strong>{{ record.solution }}</p>
              <p><strong>关键点：</strong>{{ record.keyPoints.join(', ') }}</p>
            </a-collapse-panel>
          </a-collapse>
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
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="primary" size="small" @click="viewDetails(record)">查看</a-button>
            <a-button size="small" @click="editPuzzle(record)">编辑</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { http } from '../utils/http'
import type { TablePaginationConfig } from 'ant-design-vue'

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
  theme: string
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
    title: '主题',
    dataIndex: 'theme',
    key: 'theme',
    width: 80,
  },
  {
    title: '汤面',
    dataIndex: 'prompt',
    key: 'prompt',
    ellipsis: true,
  },
  {
    title: '评分',
    dataIndex: 'score',
    key: 'score',
    width: 150,
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
  },
]

const tableData = ref < PuzzleData[] > ([])
const loading = ref(false)
const activeKeys = reactive < Record < number, string[]>> ({})

const pagination = ref < TablePaginationConfig > ({
  total: 0,
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共 ${total} 条`,
})

const getDifficultyColor = (difficulty: string) => {
  const colors = {
    EASY: 'green',
    MEDIUM: 'orange',
    HARD: 'red',
  }
  return colors[difficulty as keyof typeof colors] || 'blue'
}

const getPuzzles = async (page = 1, pageSize = 10) => {
  loading.value = true
  try {
    const data = {
      pageNumber: page,
      pageSize: pageSize
    }
    const result = await http.post('/manage/puzzle/page', data)
    tableData.value = result.data.list
    pagination.value.total = result.data.total
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

const viewDetails = (record: PuzzleData) => {
  console.log('查看详情:', record.id)
}

const editPuzzle = (record: PuzzleData) => {
  console.log('编辑谜题:', record.id)
}

onMounted(() => {
  getPuzzles()
})
</script>

<style scoped>
.puzzle-management {
  padding: 20px;
}

:deep(.ant-collapse) {
  background: transparent;
  border: none;
}

:deep(.ant-collapse-header) {
  padding: 4px 0 !important;
}

:deep(.ant-collapse-content) {
  background: #f5f5f5;
  border-radius: 4px;
}

:deep(.ant-table-cell) {
  vertical-align: top;
}
</style>
