#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
转换SQL文件，将表名从Business改为shops，修改字段名，并添加phone字段
"""

import re

# 输入和输出文件路径
input_file = r'd:\GitHub\go-shop-admin\sql\all-business-data-complete.sql'
output_file = r'd:\GitHub\go-shop-admin\sql\all-business-data-complete-shops-python.sql'

# 读取原始SQL文件
with open(input_file, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# 1. 将表名从Business改为shops
content = content.replace('INSERT INTO Business', 'INSERT INTO shops')

# 2. 修改字段名
content = content.replace('otherInfo', 'other_info')
content = content.replace('imageBase64', 'image_base64')

# 3. 在字段列表中添加phone字段
content = re.sub(
    r'\(name, email, address, type, contact, rating, latitude, longitude, other_info, image_base64, description\)',
    '(name, email, address, type, contact, rating, latitude, longitude, other_info, image_base64, description, phone)',
    content
)

# 4. 在VALUES列表末尾添加NULL（phone字段的值）
content = re.sub(
    r'(NULL,\s*NULL,\s*NULL)\s*\);',
    r'\1, NULL);',
    content
)

# 写入转换后的SQL文件
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"转换完成！输出文件: {output_file}")
print(f"原始文件大小: {len(content)} 字符")
