#!/usr/bin/env python3
"""
Script to rename a directory inside a zip file without extracting it.
Preserves all file metadata including permissions, timestamps, and ownership info.
"""

import zipfile
import os
import sys
import tempfile
import shutil

def rename_directory_in_zip(zip_path, old_dir_name, new_dir_name, output_zip_path=None):
    """
    Rename a directory inside a zip file without extracting it.
    
    Args:
        zip_path (str): Path to the input zip file
        old_dir_name (str): Old directory name to rename (without trailing slash)
        new_dir_name (str): New directory name (without trailing slash)
        output_zip_path (str, optional): Output zip file path. If None, overwrites original
    
    Returns:
        bool: True if successful, False otherwise
    """
    
    if output_zip_path is None:
        output_zip_path = zip_path
    
    # Ensure directory names don't have trailing slashes for consistency
    old_dir_name = old_dir_name.rstrip('/')
    new_dir_name = new_dir_name.rstrip('/')
    
    # Create a temporary file for the modified zip
    temp_dir = tempfile.mkdtemp()
    temp_zip_path = os.path.join(temp_dir, 'modified.zip')
    
    try:
        with zipfile.ZipFile(zip_path, 'r') as zip_read:
            with zipfile.ZipFile(temp_zip_path, 'w', compression=zipfile.ZIP_DEFLATED) as zip_write:
                for item in zip_read.infolist():
                    # Get the original file info to preserve all metadata
                    new_filename = item.filename
                    
                    # Check if this file is in the directory we want to rename
                    if new_filename.startswith(old_dir_name + '/'):
                        # Replace the old directory name with new one
                        new_filename = new_dir_name + new_filename[len(old_dir_name):]
                    
                    # Also handle the case where the directory itself is listed as an entry
                    elif new_filename == old_dir_name + '/':
                        new_filename = new_dir_name + '/'
                    
                    # Copy the file with preserved metadata
                    with zip_read.open(item) as source_file:
                        content = source_file.read()
                    
                    # Create new zipinfo with original metadata
                    new_info = zipfile.ZipInfo(new_filename)
                    
                    # Preserve all original metadata
                    new_info.date_time = item.date_time
                    new_info.compress_type = item.compress_type
                    new_info.comment = item.comment
                    new_info.extra = item.extra  # This preserves Unix permissions!
                    new_info.create_system = item.create_system
                    new_info.create_version = item.create_version
                    new_info.extract_version = item.extract_version
                    new_info.flag_bits = item.flag_bits
                    new_info.volume = item.volume
                    
                    # Set external attributes to preserve Unix permissions
                    new_info.external_attr = item.external_attr
                    
                    # Write the file with preserved metadata
                    zip_write.writestr(new_info, content)
        
        # Replace the original file with the modified one
        if output_zip_path == zip_path:
            # Backup original if we're overwriting
            backup_path = zip_path + '.bak'
            shutil.copy2(zip_path, backup_path)
            print(f"Backed up original to: {backup_path}")
        
        shutil.move(temp_zip_path, output_zip_path)
        print(f"Successfully renamed directory '{old_dir_name}' to '{new_dir_name}' in {output_zip_path}")
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        return False
    finally:
        # Clean up temporary directory
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)

def main():
    if len(sys.argv) not in [4, 5]:
        print("Usage: python rename_zip_dir.py <zip_file> <old_dir_name> <new_dir_name> [output_zip_file]")
        print("Example: python rename_zip_dir.py myapp.zip old-dir new-dir")
        print("Example: python rename_zip_dir.py myapp.zip old-dir new-dir modified_app.zip")
        sys.exit(1)
    
    zip_file = sys.argv[1]
    old_dir = sys.argv[2]
    new_dir = sys.argv[3]
    output_file = sys.argv[4] if len(sys.argv) > 4 else None
    
    if not os.path.exists(zip_file):
        print(f"Error: Zip file '{zip_file}' not found")
        sys.exit(1)
    
    success = rename_directory_in_zip(zip_file, old_dir, new_dir, output_file)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()