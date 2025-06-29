def format_command_line(line):
    if not line.strip():
        return f'<span class="code-line"></span>'
    
    # 提取注释（考虑引号内的#）
    quote_char = None
    escape_next = False
    comment_start = -1
    for i, char in enumerate(line):
        if escape_next:
            escape_next = False
            continue
        if char == '\\':
            escape_next = True
        elif char == '"' or char == "'":
            if quote_char is None:
                quote_char = char
            elif quote_char == char:
                quote_char = None
        elif char == '#' and quote_char is None:
            comment_start = i
            break
    
    # 分割命令部分和注释部分
    if comment_start >= 0:
        command_part = line[:comment_start].rstrip()
        comment = line[comment_start:]
    else:
        command_part = line.rstrip()
        comment = None
    
    # 处理命令部分的分词和上色
    formatted_command = []
    tokens = []
    current_token = ""
    in_quotes = False
    quote_char = None
    escape_next = False
    
    # 构建颜色化的命令部分
    is_first_token = True
    in_string = False
    for char in command_part:
        if escape_next:
            current_token += char
            escape_next = False
            continue
            
        if char == '\\':
            escape_next = True
            current_token += char
            continue
            
        if char == '"' or char == "'":
            if not in_quotes:
                # 开始字符串
                in_quotes = True
                quote_char = char
                # 如果当前token非空，先保存
                if current_token:
                    tokens.append(current_token)
                    current_token = ""
                # 添加引号
                tokens.append(char)
            else:
                if char == quote_char:
                    # 结束字符串
                    in_quotes = False
                    tokens.append(current_token)
                    tokens.append(char)
                    current_token = ""
                    # 结束字符串后重置状态
                    tokens.append("STRING_END")
                else:
                    # 不同引号类型，继续当前字符串
                    current_token += char
            continue
            
        if in_quotes:
            # 在引号内，直接添加字符
            current_token += char
        else:
            # 在引号外
            if char == ' ' or char == '\t':
                if current_token:
                    tokens.append(current_token)
                    current_token = ""
                tokens.append(char)
            else:
                current_token += char
                
    if current_token:
        tokens.append(current_token)
    
    # 应用样式规则
    found_option = False
    for token in tokens:
        if token == "STRING_END":
            # 字符串结束标识
            in_string = False
            continue
            
        if token in ['"', "'"]:
            # 字符串开始/结束引号
            if in_string:
                # 结束引号
                in_string = False
                formatted_token = f'<span class="terminal-string">{token}</span>'
            else:
                # 开始引号
                in_string = True
                formatted_token = f'<span class="terminal-string">{token}</span>'
        elif in_string:
            # 字符串内容
            formatted_token = f'<span class="terminal-string">{token}</span>'
        elif token.isspace():
            formatted_token = token
        else:
            if is_first_token:
                formatted_token = f'<span class="terminal-yellow">{token}</span>'
                is_first_token = False
            elif token.startswith('-'):
                formatted_token = f'<span class="terminal-blue">{token}</span>'
                found_option = True
            elif found_option:
                formatted_token = f'<span class="terminal-white">{token}</span>'
                found_option = False
            else:
                formatted_token = f'<span class="terminal-white">{token}</span>'
                
        formatted_command.append(formatted_token)
    
    # 添加注释部分
    result = "".join(formatted_command)
    if comment:
        result += f'<span class="terminal-green">{comment}</span>'
    
    return f'<span class="code-line">{result}</span>'

with open('input.txt', 'r', encoding='utf-8') as infile, open('output.txt', 'w', encoding='utf-8') as outfile:
    for line in infile:
        formatted_line = format_command_line(line.rstrip('\n'))
        outfile.write(formatted_line + '\n')