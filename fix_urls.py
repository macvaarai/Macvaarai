#!/usr/bin/env python3
import os
import re
from pathlib import Path

src_dir = Path("macvaarai-frontend/macvaarai-frontend/src")

for jsx_file in src_dir.rglob("*.jsx"):
    with open(jsx_file, 'r') as f:
        content = f.read()

    # Replace hardcoded localhost URLs with proper template strings
    # Match patterns like: fetch('http://localhost:8000/...
    # Replace with: fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}...

    pattern = r"fetch\('http://localhost:8000(/[^']*)',"
    replacement = r"fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}\1`,"

    new_content = re.sub(pattern, replacement, content)

    pattern2 = r'fetch\("http://localhost:8000(/[^"]*)"\,'
    replacement2 = r'fetch(`${import.meta.env.VITE_API_URL || \'http://localhost:8000\'}\1`,'

    new_content = re.sub(pattern2, replacement2, new_content)

    if new_content != content:
        with open(jsx_file, 'w') as f:
            f.write(new_content)
        print(f"Fixed: {jsx_file}")

print("Done!")
