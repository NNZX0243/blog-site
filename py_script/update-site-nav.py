import os
import re
from pathlib import Path

# 替换配置列表 - 根据需要在此添加/修改替换规则
REPLACEMENT_RULES = [
    {
        # 要查找的HTML块开始标签
        "search_tag": '<nav class="site-nav">',
        # 要查找的HTML块结束标签
        "end_tag": '</nav>',
        # 替换内容文件的路径
        "replacement_file": "./common/nav-class-site-nav.html",
        # 要处理的文件名模式
        "target_files": "index.html"
    },
    # 添加更多替换规则示例：
    # {
    #     "search_tag": '<div class="header">',
    #     "end_tag": '</div>',
    #     "replacement_file": "new-header.html",
    #     "target_files": "*.html"
    # }
]

def replace_html_blocks(root_dir):
    """递归替换所有匹配文件中的指定HTML块"""
    # 预编译所有替换规则的正则模式
    compiled_rules = []
    for rule in REPLACEMENT_RULES:
        try:
            with open(rule['replacement_file'], 'r', encoding='utf-8') as f:
                replacement_content = f.read()
        except FileNotFoundError:
            print(f"⚠️ 替换文件未找到: {rule['replacement_file']}")
            continue
        
        # 创建匹配开始标签到结束标签的模式（考虑多行和任意中间内容）
        pattern = re.compile(
            r'(' + re.escape(rule['search_tag']) + 
            r'.*?' + 
            re.escape(rule['end_tag']) + r')',
            re.DOTALL  # 使.匹配包括换行符在内的所有字符
        )
        
        compiled_rules.append({
            "pattern": pattern,
            "replacement": replacement_content,
            "file_pattern": rule['target_files']
        })
    
    # 递归遍历所有目录
    for foldername, subfolders, filenames in os.walk(root_dir):
        for filename in filenames:
            file_path = Path(foldername) / filename
            
            # 检查文件是否匹配任一替换规则的目标模式
            for rule in compiled_rules:
                if not rule['file_pattern'] or filename != rule['file_pattern']:
                    continue
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # 执行替换
                    new_content, count = rule['pattern'].subn(
                        rule['replacement'], 
                        content
                    )
                    
                    if count > 0:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"✅ 已更新: {file_path} (替换了 {count} 处内容)")
                    
                except Exception as e:
                    print(f"❌ 处理 {file_path} 时出错: {str(e)}")

if __name__ == "__main__":
    project_root = os.getcwd()  # 使用当前目录作为项目根目录
    print(f"🏁 开始在目录中查找文件: {project_root}")
    replace_html_blocks(project_root)
    print("🎉 所有文件处理完成！")