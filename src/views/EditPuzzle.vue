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
import PuzzleForm from '../components/PuzzleForm.vue';
import { http } from '../utils/http';

const route = useRoute();
const router = useRouter();
const puzzleData = ref(null);

// 获取谜题数据
const fetchPuzzleData = async () => {
  // 根据路由参数获取
  try {
    const response = await http.get(`/manage/puzzle/${route.params.id}`);
    puzzleData.value = response;
  } catch (error) {
    message.error('获取谜题数据失败');
    console.error('Failed to fetch puzzle:', error);
  }
};

// 处理表单提交
const handleSubmit = async (formData) => {
  try {
    await http.put(`/puzzles/${route.params.id}`, formData);
    message.success('保存成功');
    router.push('/puzzles'); 
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
