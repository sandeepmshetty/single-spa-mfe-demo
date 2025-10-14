<template>
  <div class="error-fallback">
    <h2>⚠️ Something went wrong</h2>
    <p>The application encountered an error. Please try refreshing the page.</p>
    <details v-if="error">
      <summary>Error details</summary>
      <pre>{{ error.message }}</pre>
    </details>
    <button @click="reload">Reload Page</button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  error?: Error;
}

defineProps<Props>();

const reload = () => {
  window.location.reload();
};
</script>

<style scoped>
.error-fallback {
  padding: 20px;
  margin: 20px;
  border: 2px solid #ff4444;
  border-radius: 8px;
  background-color: #fff5f5;
}

h2 {
  color: #cc0000;
  margin-top: 0;
}

details {
  margin-top: 10px;
}

summary {
  cursor: pointer;
  color: #666;
}

pre {
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow: auto;
}

button {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0052a3;
}
</style>
