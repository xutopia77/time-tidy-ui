#!/usr/bin/env python3

# 进入..目录下，执行 npm run build
import os
import subprocess
import argparse
import shutil
import os
import time

# 解析命令行参数
# app 打包electron， app_dbg，只打包web，然后替换进去，不打包electron
def parse_args():
    parser = argparse.ArgumentParser(description='根据打包类型进行打包操作')
    parser.add_argument('type', choices=['app','app_dbg', 'web', 'go'], help='打包类型，可选值：app, app_dbg, web, go')
    return parser.parse_args()
args = parse_args()

# 获取当前脚本所在的目录
current_dir = os.path.dirname(os.path.abspath(__file__))
# 进入..目录下
parent_dir = os.path.dirname(current_dir)
os.chdir(parent_dir)

npm_path = r'C:/Program Files/nodejs/npm.cmd'

try:
    subprocess.run([npm_path, 'run', 'build'], check=True)
    print('web 构建完成')
except FileNotFoundError:
    print("未找到 npm，请检查 npm 路径是否正确。")
except subprocess.CalledProcessError:
    print("构建过程中出错，请检查构建命令。")
    exit(1)

web_dist_dir = r'D:\\02_workspace\\05_timeCapsule\\timeCapsule_ui\\time_capsule_ui_v2\\dist'

# 打包 electron 应用
if args.type in ['app','app_dbg']:
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
    target_dir = directory_path
    # 检查源目录是否存在
    if os.path.exists(web_dist_dir):
        # 遍历源目录中的所有文件和子目录
        for root, dirs, files in os.walk(web_dist_dir):
            for file in files:
                # 构建源文件的完整路径
                source_file = os.path.join(root, file)
                # 构建目标文件的完整路径
                relative_path = os.path.relpath(source_file, web_dist_dir)
                target_file = os.path.join(target_dir, relative_path)
                # 确保目标目录存在
                os.makedirs(os.path.dirname(target_file), exist_ok=True)
                # 复制文件到目标目录
                shutil.copy2(source_file, target_file)
        print(f"所有文件和子目录已成功复制到 {target_dir}。")
    else:
        print(f"源目录 {web_dist_dir} 不存在。")
        # 退出
        exit(1)
    # 输出复制完成的提示
    print('复制完成')
    if args.type == 'app':
        etectron_path='D:/02_workspace/05_timeCapsule/timeCapsule_ui/time_capsule_app_v2/time_capsule'
        try:
            os.chdir(etectron_path)
            subprocess.run([npm_path, 'run', 'build:win'], check=True)
            print('electron 构建完成')
        except FileNotFoundError:
            print("未找到 npm，请检查 npm 路径是否正确。")
        except subprocess.CalledProcessError:
            print("构建过程中出错，请检查构建命令。")
            exit(1)

if args.type == 'go':
    # 先删除目录
    go_web_dir = 'D:/02_workspace/05_timeCapsule/time_capsule/assets/www'
    if os.path.exists(go_web_dir):
        # 删除目录及其所有内容
        shutil.rmtree(go_web_dir)
        print(f"目录 {go_web_dir} 及其所有内容已成功删除。")
    # 把 web_dist_dir 复制到 go_web_dir 目录
    target_dir = go_web_dir
    # 检查源目录是否存在
    if os.path.exists(web_dist_dir):
        # 遍历源目录中的所有文件和子目录
        for root, dirs, files in os.walk(web_dist_dir):
            for file in files:
                # 构建源文件的完整路径
                source_file = os.path.join(root, file)
                # 构建目标文件的完整路径
                relative_path = os.path.relpath(source_file, web_dist_dir)
                target_file = os.path.join(target_dir, relative_path)
                # 确保目标目录存在
                os.makedirs(os.path.dirname(target_file), exist_ok=True)
                # 复制文件到目标目录
                shutil.copy2(source_file, target_file)
        print(f"所有文件和子目录已成功复制到 {target_dir}。")

    go_dir='D:/02_workspace/05_timeCapsule/time_capsule'
    try:
        os.chdir(go_dir)
        subprocess.run(['go', 'build'], check=True)
        print('go 构建完成')
    except FileNotFoundError:
        print("未找到 go，请检查 go 路径是否正确。")
    except subprocess.CalledProcessError:
        print("构建过程中出错，请检查构建命令。")
        exit(1)
    
    release_dir='D:/02_workspace/05_timeCapsule/time_capsule_release/time_capsule_exe'
    # 删除 release_dir目录
    if os.path.exists(release_dir):
        # 删除目录及其所有内容
        shutil.rmtree(release_dir)
        print(f"目录 {release_dir} 及其所有内容已成功删除。")
    # 复制 go_dir目录下的time_capsule.exe 到 release_dir 目录
    target_file = os.path.join(release_dir, 'time_capsule.exe')
    source_file = os.path.join(go_dir, 'time_capsule.exe')
    # 确保目标目录存在
    os.makedirs(os.path.dirname(target_file), exist_ok=True)
    # 复制文件到目标目录
    shutil.copy2(source_file, target_file)
    print(f"文件已成功复制到 {target_file}。")
    # 复制 go_dir目录下的assets 目录 到 release_dir 目录
    target_dir = os.path.join(release_dir, 'assets')
    source_dir = os.path.join(go_dir, 'assets')
    # 确保目标目录存在
    os.makedirs(os.path.dirname(target_dir), exist_ok=True)
    # 复制目录到目标目录
    shutil.copytree(source_dir, target_dir)
    print(f"目录已成功复制到 {target_dir}。")
    print('go 打包完成')
exit(1)



