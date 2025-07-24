<template>
  <div class="create-puzzle">
    <h1>新增谜题</h1>
    
    <!-- 智能录入区域 -->
    <div class="parse-section">
      <a-form layout="vertical">
        <a-form-item label="汤面">
          <a-textarea
            v-model:value="puzzleFace"
            :rows="4"
            placeholder="请输入汤面文本"
          />
        </a-form-item>
        <a-form-item label="汤底">
          <a-textarea
            v-model:value="puzzleBase"
            :rows="4"
            placeholder="请输入汤底文本"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleParse" :loading="parsing">解析文本</a-button>
        </a-form-item>
      </a-form>
    </div>

    <a-divider />
    
    <puzzle-form
      :initial-data="formData"
      :status-options="statusOptions"
      :status-loading="statusLoading"
      :tag-options="tagOptions"
      :tag-loading="tagLoading"
      :is-create-mode="true"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import PuzzleForm from '../../components/business/PuzzleForm.vue';
import { http } from '../../utils/http';

const router = useRouter();
const puzzleFace = ref('');
const puzzleBase = ref('');
const parsing = ref(false);
const formData = ref<any>(null);

// 枚举值数据
const statusOptions = ref<Array<{code: string, value: string, description: string}>>([]);
const statusLoading = ref(false);
const tagOptions = ref<Array<{code: string, value: string, description: string}>>([]);
const tagLoading = ref(false);

// 获取状态枚举值
const getStatusOptions = async () => {
  statusLoading.value = true;
  try {
    const response = await http.get('/m/enum/group/SOUP_STATUS/values');
    if ((response.code === 0 || response.code === 200) && response.data) {
      statusOptions.value = response.data.filter((item: any) => item.active).map((item: any) => ({
        code: item.code,
        value: item.value,
        description: item.description
      }));
      console.log('获取到的状态选项:', statusOptions.value);
    }
  } catch (error) {
    console.error('Failed to fetch status options:', error);
  } finally {
    statusLoading.value = false;
  }
};

// 获取标签枚举值
const getTagOptions = async () => {
  tagLoading.value = true;
  try {
    const response = await http.get('/app/enum/groups/SOUP_TAG/values');
    if ((response.code === 0 || response.code === 200) && response.data) {
      tagOptions.value = response.data.filter((item: any) => item.active).map((item: any) => ({
        code: item.code,
        value: item.value,
        description: item.description
      }));
      console.log('获取到的标签选项:', tagOptions.value);
    }
  } catch (error) {
    console.error('Failed to fetch tag options:', error);
  } finally {
    tagLoading.value = false;
  }
};

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
  } catch (error) {
    message.error('解析失败');
    console.error('Failed to parse text:', error);
  } finally {
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
  } catch (error) {
    message.error('创建失败');
    console.error('Failed to create puzzle:', error);
  }
};

// 处理取消
const handleCancel = () => {
  router.push('/puzzles');
};

// 组件挂载时获取枚举值
onMounted(async () => {
  await Promise.all([
    getStatusOptions(),
    getTagOptions()
  ]);
});
</script>

<style scoped>
.create-puzzle {
  padding: 24px;
}

.parse-section {
  max-width: 1000px;
  margin-bottom: 24px;
}
</style>
