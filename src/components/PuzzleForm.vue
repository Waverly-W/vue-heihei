<template>
  <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules" ref="formRef">
    <a-form-item label="难度" name="difficultyLevel">
      <a-select v-model:value="formState.difficultyLevel">
        <a-select-option value="简单">简单</a-select-option>
        <a-select-option value="中等">中等</a-select-option>
        <a-select-option value="困难">困难</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="主题" name="theme">
      <a-select v-model:value="formState.theme" mode="tags" placeholder="请输入主题标签" />
    </a-form-item>

    <a-form-item label="汤面" name="prompt">
      <a-textarea v-model:value="formState.prompt" :rows="4" placeholder="请输入谜题描述" />
    </a-form-item>

    <a-form-item label="汤底" name="solution">
      <a-textarea v-model:value="formState.solution" :rows="4" placeholder="请输入谜题答案" />
    </a-form-item>

    <a-form-item label="关键点" name="keyPoints">
      <a-select v-model:value="formState.keyPoints" mode="tags" placeholder="请输入关键点" />
    </a-form-item>

    <a-form-item label="激活状态" name="active">
      <a-switch v-model:checked="formState.active" />
    </a-form-item>
    <a-form-item label="逻辑分" name="logicScore">
      <div class="score-slider">
        <a-slider v-model:value="formState.score.logicScore" :min="0" :max="100" :step="1" :tooltip-open="true"
          @change="calculateTotalScore" />
        <span class="score-value">{{ formState.score.logicScore.toFixed(1) }}</span>
      </div>
    </a-form-item>

    <a-form-item label="趣味分" name="funScore">
      <div class="score-slider">
        <a-slider v-model:value="formState.score.funScore" :min="0" :max="100" :step="1" :tooltip-open="true"
          @change="calculateTotalScore" />
        <span class="score-value">{{ formState.score.funScore.toFixed(1) }}</span>
      </div>
    </a-form-item>

    <a-form-item label="难度分" name="difficultyScore">
      <div class="score-slider">
        <a-slider v-model:value="formState.score.difficultyScore" :min="0" :max="100" :step="1" :tooltip-open="true"
          @change="calculateTotalScore" />
        <span class="score-value">{{ formState.score.difficultyScore.toFixed(1) }}</span>
      </div>
    </a-form-item>

    <a-form-item label="多样性分" name="diversityScore">
      <div class="score-slider">
        <a-slider v-model:value="formState.score.diversityScore" :min="0" :max="100" :step="1" :tooltip-open="true"
          @change="calculateTotalScore" />
        <span class="score-value">{{ formState.score.diversityScore.toFixed(1) }}</span>
      </div>
    </a-form-item>

    <a-form-item label="总分">
      <span class="total-score">{{ formState.score.totalScore.toFixed(2) }}</span>
    </a-form-item>


    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit">保存</a-button>
      <a-button style="margin-left: 10px" @click="onCancel">取消</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { reactive, ref, defineProps, defineEmits, watch } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import type { PuzzleScore } from '../types/PuzzleTypes';

interface FormState {
  difficultyLevel: string;
  theme: string[];
  prompt: string;
  solution: string;
  keyPoints: string[];
  active: boolean;
  score: PuzzleScore;
}

const props = defineProps<{
  initialData?: FormState;
}>();

const emit = defineEmits(['submit', 'cancel']);

const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  difficultyLevel: '',
  theme: [],
  prompt: '',
  solution: '',
  keyPoints: [],
  active: false,
  score: {
    logicScore: 0,
    funScore: 0,
    difficultyScore: 0,
    diversityScore: 0,
    totalScore: 0
  }
});

// 表单验证规则
const rules = {
  difficultyLevel: [{ required: true, message: '请选择难度' }],
  prompt: [{ required: true, message: '请输入汤面' }],
  solution: [{ required: true, message: '请输入汤底' }],
};

// 样式配置
const labelCol = { style: { width: '120px' } };
const wrapperCol = { span: 20 };

// 计算总分
const calculateTotalScore = () => {
  const { logicScore, funScore, difficultyScore, diversityScore } = formState.score;
  formState.score.totalScore = (logicScore + funScore + difficultyScore + diversityScore) / 4;
};

// 监听初始数据变化
watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      Object.assign(formState, newVal);
      // 确保score对象存在
      if (!formState.score) {
        formState.score = {
          logicScore: 0,
          funScore: 0,
          difficultyScore: 0,
          diversityScore: 0,
          totalScore: 0
        };
      }
      calculateTotalScore();
    }
  },
  { immediate: true }
);

// 监听分数变化
watch(
  () => formState.score,
  () => {
    calculateTotalScore();
  },
  { deep: true }
);

const onSubmit = async () => {
  try {
    await formRef.value?.validate();
    emit('submit', { ...formState });
  } catch (error) {
    console.error('Validation failed:', error);
  }
};

const onCancel = () => {
  emit('cancel');
};
</script>

<style scoped>
.ant-form {
  max-width: 1000px;
  margin: 0 auto;
}

.ant-form-item {
  margin-bottom: 24px;
}

.ant-input,
.ant-select {
  width: 100%;
}

.ant-btn {
  min-width: 90px;
}

.score-section {
  margin-top: 24px;
  border-top: 1px solid #f0f0f0;
  padding-top: 24px;
}

.score-section h3 {
  margin-bottom: 24px;
  color: #1890ff;
}

.score-slider {
  display: flex;
  align-items: center;
  gap: 16px;
}

.score-slider .ant-slider {
  flex: 1;
}

.score-value {
  min-width: 40px;
  text-align: right;
  color: #1890ff;
  font-weight: 500;
}

.total-score {
  font-size: 24px;
  color: #1890ff;
  font-weight: bold;
}
</style>
