import os
import pytest
import tempfile
import shutil
from linda_server.utils.animation_parser import parse_animation_code, save_animation_files, AnimationFileInfo

class TestAnimationParser:
    @pytest.fixture
    def test_animation_code(self):
        return """
File: pages/geometry-animation.vue
```vue
<template>
  <div class="container">
    <h1>Geometry Animation</h1>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const step = ref(0);
</script>
```

File: stores/animationStore.ts
```typescript
import { defineStore } from 'pinia';

export const useAnimationStore = defineStore('animation', {
  state: () => ({
    currentStep: 0,
  }),
  actions: {
    nextStep() {
      this.currentStep++;
    },
    prevStep() {
      if (this.currentStep > 0) this.currentStep--;
    }
  }
});
```

File: utils/geometry-helpers.ts
// Some utility functions
export const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};
"""
    
    @pytest.fixture
    def temp_dir(self):
        # Create a temporary directory for testing
        temp_dir = tempfile.mkdtemp()
        yield temp_dir
        # Clean up after the test
        shutil.rmtree(temp_dir)
    
    def test_parse_animation_code(self, test_animation_code):
        # Test parsing animation code into file infos
        files = parse_animation_code(test_animation_code)
        
        assert len(files) == 3
        assert files[0].path == "pages/geometry-animation.vue"
        assert "<template>" in files[0].content
        assert files[1].path == "stores/animationStore.ts"
        assert "defineStore" in files[1].content
        assert files[2].path == "utils/geometry-helpers.ts"
        assert "calculateDistance" in files[2].content
    
    def test_parse_animation_code_empty(self):
        # Test parsing empty code
        files = parse_animation_code("")
        assert len(files) == 0
    
    def test_parse_animation_code_no_file_markers(self):
        # Test parsing code without file markers
        code = "This is just some code without file markers"
        files = parse_animation_code(code)
        assert len(files) == 0
    
    def test_save_animation_files(self, test_animation_code, temp_dir, monkeypatch):
        # Mock dependency to avoid actual file system operations in save_file
        save_file_calls = []
        
        def mock_save_file(path, content, skip_system_files=True):
            save_file_calls.append((path, content))
            return True
        
        # Apply the monkeypatch
        import linda_server.utils.file_utils
        monkeypatch.setattr(linda_server.utils.file_utils, "save_file", mock_save_file)
        
        # Parse and save files
        files = parse_animation_code(test_animation_code)
        saved_paths = save_animation_files(temp_dir, files)
        
        # Check that save_file was called for each file
        assert len(save_file_calls) == 3
        assert all(path in saved_paths for path, _ in save_file_calls)
        
        # Check the first file call to verify path construction
        first_path, first_content = save_file_calls[0]
        expected_path = os.path.join(temp_dir, "pages/geometry-animation.vue")
        assert first_path == expected_path
        assert "<template>" in first_content
