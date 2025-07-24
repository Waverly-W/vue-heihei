<template>
  <div class="edit-puzzle">
    <h1>编辑谜题</h1>
    <puzzle-form
      :initial-data="puzzleData"
      :status-options="statusOptions"
      :status-loading="statusLoading"
      :tag-options="tagOptions"
      :tag-loading="tagLoading"
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

// 将状态值映射到枚举代码
const mapStatusToEnumCode = (status: string) => {
  if (!status) return 'draft';

  // 首先尝试直接匹配code
  const directMatch = statusOptions.value.find(option => option.code === status);
  if (directMatch) return status;

  // 然后尝试匹配value
  const valueMatch = statusOptions.value.find(option => option.value === status);
  if (valueMatch) return valueMatch.code;

  // 如果都没匹配到，返回默认值
  return 'draft';
};

// 将标签值映射到枚举代码
const mapTagsToEnumCodes = (tags: string[]) => {
  if (!tags || !Array.isArray(tags)) return [];

  return tags.map(tag => {
    // 首先尝试直接匹配code
    const directMatch = tagOptions.value.find(option => option.code === tag);
    if (directMatch) return tag;

    // 然后尝试匹配value
    const valueMatch = tagOptions.value.find(option => option.value === tag);
    if (valueMatch) return valueMatch.code;

    // 如果都没匹配到，返回原值
    return tag;
  });
};

// 获取谜题数据
const fetchPuzzleData = async () => {
  // 根据路由参数获取
  try {
    const response = await http.get(`/m/soup/${route.params.id}`);
    console.log('Fetched puzzle data:', response);
    if ((response.code === 0 || response.code === 200) && response.data) {
      // 转换API返回的数据结构为表单需要的格式
      const apiData = response.data;

      // 确保状态值正确映射到枚举选项
      const originalStatus = apiData.status;
      const mappedStatus = mapStatusToEnumCode(originalStatus);
      console.log('原始状态:', originalStatus, '映射后状态:', mappedStatus);

      // 确保标签值正确映射到枚举选项
      const originalTags = apiData.tags || [];
      const mappedTags = mapTagsToEnumCodes(originalTags);
      console.log('原始标签:', originalTags, '映射后标签:', mappedTags);

      puzzleData.value = {
        id: apiData.id,
        title: apiData.title,
        description: apiData.description,
        answer: apiData.answer,
        hints: apiData.hints || [],
        tags: mappedTags,
        status: mappedStatus,
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

onMounted(async () => {
  // 先获取枚举值，再获取谜题数据
  await Promise.all([
    getStatusOptions(),
    getTagOptions()
  ]);
  await fetchPuzzleData();
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
