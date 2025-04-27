import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';

export const useMarkdown = () => {
  // Create markdown-it instance with essential configuration
  const md = new MarkdownIt({
    html: false,        // Don't allow HTML tags in source
    breaks: true,       // Convert '\n' to <br>
    linkify: true,      // Autoconvert URL-like text to links
    typographer: true,  // Enable some language-neutral replacement + quotes beautification
  });

  // Render markdown content with sanitization
  const renderMarkdown = (content: string): string => {
    if (!content) return '';
    
    const renderedContent = md.render(content);
    return DOMPurify.sanitize(renderedContent, {
      ADD_ATTR: ['class'], // Allow class attributes
    });
  };

  return {
    renderMarkdown
  };
};
