import os
import pytest
import tempfile
import shutil
from linda_server.utils.file_utils import save_file, ensure_directory_exists

class TestFileUtils:
    @pytest.fixture
    def temp_dir(self):
        # Create a temporary directory for testing
        temp_dir = tempfile.mkdtemp()
        yield temp_dir
        # Clean up after the test
        shutil.rmtree(temp_dir)
    
    def test_save_file(self, temp_dir):
        # Test saving a normal file
        test_path = os.path.join(temp_dir, "test_dir", "test_file.txt")
        test_content = "Test content"
        
        result = save_file(test_path, test_content)
        
        assert result is True
        assert os.path.exists(test_path)
        with open(test_path, "r") as f:
            assert f.read() == test_content
    
    def test_save_file_system_file_skipped(self, temp_dir):
        # Test that system files are skipped
        system_file_path = os.path.join(temp_dir, "nuxt.config.ts")
        result = save_file(system_file_path, "content")
        
        assert result is False
        assert not os.path.exists(system_file_path)
    
    def test_save_file_system_file_override(self, temp_dir):
        # Test that system files can be saved if skip_system_files is False
        system_file_path = os.path.join(temp_dir, "nuxt.config.ts")
        result = save_file(system_file_path, "content", skip_system_files=False)
        
        assert result is True
        assert os.path.exists(system_file_path)
    
    def test_ensure_directory_exists(self, temp_dir):
        # Test creating a directory
        test_dir = os.path.join(temp_dir, "test_dir", "nested_dir")
        ensure_directory_exists(test_dir)
        
        assert os.path.exists(test_dir)
        assert os.path.isdir(test_dir)
    
    def test_ensure_directory_exists_idempotent(self, temp_dir):
        # Test that calling ensure_directory_exists on existing directory is fine
        test_dir = os.path.join(temp_dir, "test_dir")
        os.makedirs(test_dir)
        
        # This should not raise an exception
        ensure_directory_exists(test_dir)
        
        assert os.path.exists(test_dir)
