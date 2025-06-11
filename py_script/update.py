import os
import re
from bs4 import BeautifulSoup

def extract_sidebar_content(sidebar_path):
    """从sidebar.html中提取<div class="column">内容"""
    with open(sidebar_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
        column_div = soup.find('div', class_='column')
        if column_div:
            return str(column_div)
    return None

def replace_columns_in_file(file_path, new_content):
    """替换index.html中的<div class="column">内容"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 使用BeautifulSoup定位目标div
    soup = BeautifulSoup(content, 'html.parser')
    old_div = soup.find('div', class_='column')
    
    if old_div and new_content:
        # 直接替换整个div内容
        old_div.replace_with(BeautifulSoup(new_content, 'html.parser'))
        new_html = str(soup)
        
        # 写回文件
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_html)
        return True
    return False

def main():
    # 工程根目录路径（根据实际情况修改）
    root_dir = os.path.dirname(os.path.abspath(__file__))
    sidebar_path = os.path.join(root_dir, 'common', 'sidebar.html')

    # 提取sidebar内容
    sidebar_content = extract_sidebar_content(sidebar_path)
    if not sidebar_content:
        print("Error: Could not find <div class='column'> in sidebar.html")
        return
    
    # 遍历所有目录寻找index.html文件
    count = 0
    for dirpath, _, filenames in os.walk(root_dir):
        if 'index.html' in filenames:
            file_path = os.path.join(dirpath, 'index.html')
            if replace_columns_in_file(file_path, sidebar_content):
                print(f"Updated: {file_path}")
                count += 1
    
    print(f"\nSuccessfully updated {count} files")

if __name__ == "__main__":
    main()