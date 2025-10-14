<template>
  <ErrorFallback v-if="hasError" :error="error" />
  <div v-else class="vue-mfe">
    <header class="vue-header">
      <h1>Vue MFE - Products</h1>
      <p>Single-SPA Vue 3 Micro-Frontend</p>
    </header>

    <main class="vue-content">
      <div class="info-card">
        <h2>Product Catalog</h2>
        <p>
          This is the Vue micro-frontend responsible for product listings,
          shopping cart, and e-commerce functionality.
        </p>
      </div>

      <!-- Cross-MFE Communication Demo -->
      <div class="counter-demo">
        <h3>🔗 Cross-MFE Counter Display</h3>
        <p class="demo-description">
          This counter syncs with React & Angular MFEs in real-time!
        </p>

        <div class="counter-display">
          <div class="counter-badge">{{ counter }}</div>
        </div>

        <p v-if="lastSource" class="last-update">
          Last updated by: <strong>{{ lastSource }}</strong>
        </p>

        <div class="action-hint">
          💡 Go to React MFE to change the counter and watch it update here!
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useErrorHandler } from './composables/useErrorHandler';
import ErrorFallback from './components/ErrorFallback.vue';

const { error, hasError } = useErrorHandler('vue-mfe');

// Access shared services from window (provided by shell)
const sharedServices = (window as any).sharedServices;
const counterActions = sharedServices?.counterActions;
const eventBus = sharedServices?.eventBus;

const counter = ref(0);
const lastSource = ref('');

let unsubscribeCounter: (() => void) | null = null;
let unsubscribeEvents: (() => void) | null = null;

onMounted(() => {
  if (counterActions && eventBus) {
    // Initialize with current value
    counter.value = counterActions.getValue();

    // Subscribe to counter changes
    unsubscribeCounter = counterActions.subscribe((value: number) => {
      counter.value = value;
    });

    // Track source of updates
    unsubscribeEvents = eventBus.onAll((payload: any) => {
      if (payload.type.startsWith('counter-')) {
        lastSource.value = payload.source;
      }
    });

    console.log('✅ Vue MFE: Connected to shared counter state');
  } else {
    console.warn('⚠️ Vue MFE: Shared services not available');
  }
});

onUnmounted(() => {
  if (unsubscribeCounter) unsubscribeCounter();
  if (unsubscribeEvents) unsubscribeEvents();
});
</script>

<style scoped>
.vue-mfe {
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f0fff0;
  min-height: 100vh;
}

.vue-header {
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
  color: white;
  border-radius: 8px;
  text-align: center;
}

.vue-header h1 {
  margin: 0;
  font-size: 28px;
}

.vue-header p {
  margin: 10px 0 0 0;
  opacity: 0.9;
}

.vue-content {
  max-width: 800px;
  margin: 0 auto;
}

.info-card {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.info-card h2 {
  color: #333;
  margin-bottom: 15px;
}

.info-card p {
  color: #666;
  line-height: 1.6;
}

.counter-demo {
  background-color: #d4edda;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border: 2px solid #42b883;
  text-align: center;
}

.counter-demo h3 {
  color: #155724;
  margin-top: 0;
}

.demo-description {
  color: #155724;
  font-size: 14px;
  margin-bottom: 20px;
}

.counter-display {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.counter-badge {
  font-size: 48px;
  font-weight: bold;
  color: #42b883;
  min-width: 120px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  border: 3px solid #42b883;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.last-update {
  margin-top: 15px;
  font-size: 12px;
  color: #155724;
  font-style: italic;
}

.action-hint {
  margin-top: 15px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  font-size: 13px;
  color: #155724;
}
</style>
