<template>
  <div class="markdown-content" v-html="renderedContent"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMarkdown } from '~/composables/useMarkdown';

const props = defineProps<{  
  content: string;
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
  line-height: 1.6;
  color: #334155;
}

.markdown-content h1, 
.markdown-content h2, 
.markdown-content h3, 
.markdown-content h4 {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #1e40af;
}

.markdown-content h1 {
  font-size: 1.5rem;
}

.markdown-content h2 {
  font-size: 1.25rem;
}

.markdown-content h3 {
  font-size: 1.125rem;
}

.markdown-content h4 {
  font-size: 1rem;
}

.markdown-content p {
  margin-bottom: 1rem;
}

.markdown-content p:last-child {
  margin-bottom: 0;
}

.markdown-content ul, 
.markdown-content ol {
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.markdown-content li {
  margin-bottom: 0.25rem;
}

.markdown-content a {
  color: #4f46e5;
  text-decoration: underline;
}

.markdown-content a:hover {
  text-decoration: none;
}

/* Math formula styling */
.markdown-content pre {
  padding: 0.75rem;
  margin: 0.75rem 0;
  background: #f8fafc;
  border-radius: 0.375rem;
  overflow-x: auto;
  border: 1px solid #e2e8f0;
}

/* Inline code */
.markdown-content code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
  background: #f1f5f9;
  color: #4338ca;
  font-size: 0.875em;
  white-space: pre-wrap;
}

/* Math display blocks */
.markdown-content .math-display {
  display: block;
  overflow-x: auto;
  margin: 1em 0;
  padding: 0.5em;
  background: #f8fafc;
  border-radius: 0.375rem;
  border: 1px solid #e2e8f0;
}

/* Math inline blocks */
.markdown-content .math-inline {
  display: inline-block;
  padding: 0 0.2em;
  font-style: italic;
}

/* Tables */
.markdown-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.markdown-content table th,
.markdown-content table td {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
}

.markdown-content table th {
  background-color: #f1f5f9;
  font-weight: 600;
  text-align: left;
}

.markdown-content table tr:nth-child(even) {
  background-color: #f8fafc;
}

/* Blockquotes */
.markdown-content blockquote {
  border-left: 4px solid #818cf8;
  padding-left: 1rem;
  color: #4b5563;
  font-style: italic;
  margin: 1rem 0;
}
</style>
