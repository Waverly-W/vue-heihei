<template>
  <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules" ref="formRef">
    <a-form-item label="标题" name="title">
      <a-input
        v-model:value="formState.title"
        placeholder="请输入汤底标题"
        :maxlength="200"
        show-count
      />
    </a-form-item>

    <a-form-item label="汤面" name="description">
      <a-textarea
        v-model:value="formState.description"
        :rows="4"
        placeholder="请输入谜题描述"
        :maxlength="2000"
        show-count
      />
    </a-form-item>

    <a-form-item label="汤底" name="answer">
      <a-textarea
        v-model:value="formState.answer"
        :rows="4"
        placeholder="请输入谜题答案"
        :maxlength="2000"
        show-count
      />
    </a-form-item>

    <a-form-item label="提示" name="hints">
      <a-select v-model:value="formState.hints" mode="tags" placeholder="请输入提示内容" />
    </a-form-item>

    <a-form-item label="标签" name="tags">
      <a-select
        v-model:value="formState.tags"
        mode="multiple"
        placeholder="请选择标签"
        :loading="props.tagLoading"
      >
        <a-select-option
          v-for="option in props.tagOptions"
          :key="option.code"
          :value="option.code"
        >
          {{ option.description }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="状态" name="status">
      <a-select v-model:value="formState.status" :loading="props.statusLoading">
        <a-select-option
          v-for="option in props.statusOptions"
          :key="option.code"
          :value="option.code"
        >
          {{ option.description }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="AI生成" name="aiGenerated">
      <a-switch v-model:checked="formState.aiGenerated" />
    </a-form-item>

    <!-- 只在编辑模式下显示评分和游戏次数 -->
    <template v-if="!props.isCreateMode">
      <a-form-item label="评分" name="rating">
        <span class="rating-display">{{ formState.rating ? formState.rating.toFixed(2) : '暂无评分' }}</span>
        <span class="rating-note">（评分由用户评价生成，不可编辑）</span>
      </a-form-item>

      <a-form-item label="游戏次数" name="playCount">
        <span class="play-count-display">{{ formState.playCount || 0 }} 次</span>
      </a-form-item>
    </template>


    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit">{{ props.isCreateMode ? '创建' : '保存' }}</a-button>
      <a-button style="margin-left: 10px" @click="onCancel">取消</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import type { SoupFormData } from '../../types/PuzzleTypes';

const props = withDefaults(defineProps<{
  initialData?: SoupFormData;
  statusOptions?: Array<{code: string, value: string, description: string}>;
  statusLoading?: boolean;
  tagOptions?: Array<{code: string, value: string, description: string}>;
  tagLoading?: boolean;
  isCreateMode?: boolean;
}>(), {
  statusOptions: () => [],
  statusLoading: false,
  tagOptions: () => [],
  tagLoading: false,
  isCreateMode: false
});

const emit = defineEmits(['submit', 'cancel']);

const formRef = ref<FormInstance>();
const formState = reactive<SoupFormData>({
  title: '',
  description: '',
  answer: '',
  hints: [],
  tags: [],
  status: 'draft',
  aiGenerated: false,
  rating: 0,
  playCount: 0
});

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入标题' },
    { max: 200, message: '标题长度不能超过200个字符' }
  ],
  description: [
    { required: true, message: '请输入汤面' },
    { max: 2000, message: '汤面描述长度不能超过2000个字符' }
  ],
  answer: [
    { required: true, message: '请输入汤底' },
    { max: 2000, message: '汤底答案长度不能超过2000个字符' }
  ],
  status: [{ required: true, message: '请选择状态' }],
};

// 样式配置
const labelCol = { style: { width: '120px' } };
const wrapperCol = { span: 20 };

// 监听初始数据变化
watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      Object.assign(formState, newVal);
    }
  },
  { immediate: true }
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

.rating-display {
  font-size: 16px;
  color: #1890ff;
  font-weight: 500;
  margin-right: 8px;
}

.rating-note {
  font-size: 12px;
  color: #999;
}

.play-count-display {
  font-size: 16px;
  color: #52c41a;
  font-weight: 500;
}
</style>
