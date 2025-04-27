<template>
  <div class="markdown-content" v-html="renderedContent"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMarkdown } from '~/composables/useMarkdown';

const props = defineProps<{  content: string;
}>();

const { renderMarkdown } = useMarkdown();

// Compute the rendered markdown content
const renderedContent = computed(() => {
  return renderMarkdown(props.content || '');
});
</script>

<style>
/* Markdown content styling */
.markdown-content {
  max-width: none;
}

.markdown-content p {
  margin-bottom: 0.75rem;
}

.markdown-content p:last-child {
  margin-bottom: 0;
}

/* Math formula styling */
.markdown-content pre {
  padding: 0.5rem;
  margin: 0.5rem 0;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 0.25rem;
  overflow-x: auto;
}

/* Inline code */
.markdown-content code {
  font-family: monospace;
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
  background: rgba(0, 0, 0, 0.05);
}

/* Math display blocks */
.markdown-content .math-display {
  display: block;
  overflow-x: auto;
  margin: 1em 0;
}

/* Math inline blocks */
.markdown-content .math-inline {
  display: inline-block;
}
</style>
