<template>
  <div class="min-h-screen flex flex-col items-center justify-start bg-gray-light py-12 px-4">
    <h1 class="text-4xl font-bold mb-4 text-primary-dark">
      AutoByteus Chemistry Animation Workshop
    </h1>
    <p class="text-lg text-gray-dark max-w-xl text-center mb-8">
      Welcome to the hands-on online workshop! Follow the instructions below to set up your environment and join us at the scheduled Tencent Meeting.
    </p>

    <div class="w-full max-w-2xl bg-white rounded-2xl shadow-md p-6 mb-12">
      <h2 class="text-2xl font-semibold mb-4 text-primary">Environment Preparation</h2>
      <ul class="list-disc list-inside space-y-3 text-gray-dark">
        <li>
          <strong>Install Node.js</strong><br>
          If you don't have Node.js installed, download it from <a href="https://nodejs.org/en/download/" class="text-primary underline">nodejs.org</a> and install before proceeding.
        </li>
        <li>
          <strong>Node.js v20.11.0</strong><br>
          验证版本：
          <pre class="bg-gray-100 p-2 rounded text-sm font-mono"><code>node --version  # 应输出 v20.11.0</code></pre>
          使用 <code class="font-mono">nvm</code>：
          <pre class="bg-gray-100 p-2 rounded text-sm font-mono"><code>nvm install 20.11.0
nvm use 20.11.0</code></pre>
        </li>
        <li>
          <strong>克隆仓库</strong><br>
          <pre class="bg-gray-100 p-2 rounded text-sm font-mono"><code>git clone https://github.com/ryan-zheng-teki/autobyteus_workshops.git
cd autobyteus_workshops/2025-04-17/frontend</code></pre>
        </li>
        <li>
          <strong>安装依赖</strong><br>
          <pre class="bg-gray-100 p-2 rounded text-sm font-mono"><code>yarn install</code></pre>
        </li>
        <li>
          <strong>启动项目</strong><br>
          <pre class="bg-gray-100 p-2 rounded text-sm font-mono"><code>yarn start</code></pre>
        </li>
      </ul>
    </div>

    <p class="text-sm text-gray-dark">
      已完成环境准备？请查看 README 获取更多详情。
    </p>
  </div>
</template>

<script setup lang="ts">
// Static page; future interactivity can be added here.
</script>

<style scoped>
/* Page-specific styling can be enhanced here if needed */
</style>
