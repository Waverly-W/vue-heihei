<template>
    <div class="header-container">
      <div class="logo">海龟汤谜题管理系统</div>
      <a-input-search placeholder="搜索谜题" style="width: 300px;" />
      <div class="user-info">
        <a-avatar icon="user" />
        <span>管理员</span>
        <a-button type="link">登出</a-button>
      </div>
    </div>
  </template>
  
  <script>
  </script>
  
  <style scoped>
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding: 0 20px;
  }
  .logo {
    color: white;
    font-size: 18px;
  }
  .user-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  </style>
  