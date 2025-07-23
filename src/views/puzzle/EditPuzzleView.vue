<template>
  <div class="edit-puzzle">
    <h1>编辑谜题</h1>
    <puzzle-form
      :initial-data="puzzleData"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import PuzzleForm from '../../components/business/PuzzleForm.vue';
import { http } from '../../utils/http';
import type { SoupFormData } from '../../types/PuzzleTypes';

const route = useRoute();
const router = useRouter();
const puzzleData = ref<SoupFormData | null>(null);

// 获取谜题数据
const fetchPuzzleData = async () => {
  // 根据路由参数获取
  try {
    const response = await http.get(`/m/soup/${route.params.id}`);
    console.log('Fetched puzzle data:', response);
    if ((response.code === 0 || response.code === 200) && response.data) {
      // 转换API返回的数据结构为表单需要的格式
      const apiData = response.data;
      puzzleData.value = {
        id: apiData.id,
        title: apiData.title,
        description: apiData.description,
        answer: apiData.answer,
        hints: apiData.hints || [],
        tags: apiData.tags || [],
        status: apiData.status,
        aiGenerated: apiData.aiGenerated,
        rating: apiData.rating,
        playCount: apiData.playCount,
        createdBy: apiData.createdBy,
        createdAt: apiData.createdAt,
        updatedAt: apiData.updatedAt
      };
    }
  } catch (error) {
    message.error('获取谜题数据失败');
    console.error('Failed to fetch puzzle:', error);
  }
};

// 处理表单提交
const handleSubmit = async (formData) => {
  try {
    // 构建更新请求的数据结构，必须包含id字段
    const updateData = {
      id: route.params.id as string, // 必需字段
      title: formData.title,
      description: formData.description,
      answer: formData.answer,
      hints: formData.hints,
      tags: formData.tags,
      status: formData.status,
      aiGenerated: formData.aiGenerated
      // rating 字段在更新时可以包含，但通常由系统管理
    };

    const response = await http.put('/m/soup/update', updateData);
    console.log('Update response:', response);

    if (response.code === 0 || response.code === 200) {
      message.success('保存成功');
      router.push('/puzzles');
    } else {
      message.error(response.message || '保存失败');
    }
  } catch (error) {
    message.error('保存失败');
    console.error('Failed to save puzzle:', error);
  }
};

// 处理取消
const handleCancel = () => {
  router.push('/puzzles');
};

onMounted(() => {
  fetchPuzzleData();
});
</script>

<style scoped>
.edit-puzzle {
  padding: 24px;
}

h1 {
  margin-bottom: 24px;
}
</style>
