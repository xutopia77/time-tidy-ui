#!/usr/bin/env python3

# 进入..目录下，执行 npm run build
import os
import subprocess

# 获取当前脚本所在的目录
current_dir = os.path.dirname(os.path.abspath(__file__))

# 进入..目录下
parent_dir = os.path.dirname(current_dir)
os.chdir(parent_dir)

try:
    # 请将这里替换为你的 npm 实际路径
    npm_path = r'C:\Program Files\nodejs\npm.cmd'
    subprocess.run([npm_path, 'run', 'build'], check=True)
    # 输出构建完成的提示
    print('构建完成')
except FileNotFoundError:
    print("未找到 npm，请检查 npm 路径是否正确。")
except subprocess.CalledProcessError:
    print("构建过程中出错，请检查构建命令。")

# 先删除 D:\\02_workspace\\05_timeCapsule\\timeCapsule_ui\\time_capsule_app_v2\\time_capsule\\out\www目录下的所有文件
import shutil
import os
import time

# 定义要删除的目录路径
directory_path = r'D:\\02_workspace\\05_timeCapsule\\timeCapsule_ui\\time_capsule_app_v2\\time_capsule\\out\\www'
# 检查目录是否存在
if os.path.exists(directory_path):
    # 删除目录及其所有内容
    shutil.rmtree(directory_path)
    print(f"目录 {directory_path} 及其所有内容已成功删除。")
else:
    print(f"目录 {directory_path} 不存在。")
    # 退出
    exit(1)

# 等待1秒
time.sleep(1)
# 把成果物复制到directory_path目录
# 定义源目录和目标目录
source_dir = r'D:\\02_workspace\\05_timeCapsule\\timeCapsule_ui\\time_capsule_ui_v2\\dist'
target_dir = directory_path
# 检查源目录是否存在
if os.path.exists(source_dir):
    # 遍历源目录中的所有文件和子目录
    for root, dirs, files in os.walk(source_dir):
        for file in files:
            # 构建源文件的完整路径
            source_file = os.path.join(root, file)
            # 构建目标文件的完整路径
            relative_path = os.path.relpath(source_file, source_dir)
            target_file = os.path.join(target_dir, relative_path)
            # 确保目标目录存在
            os.makedirs(os.path.dirname(target_file), exist_ok=True)
            # 复制文件到目标目录
            shutil.copy2(source_file, target_file)
    print(f"所有文件和子目录已成功复制到 {target_dir}。")
else:
    print(f"源目录 {source_dir} 不存在。")
    # 退出
    exit(1)
# 输出复制完成的提示
print('复制完成')
