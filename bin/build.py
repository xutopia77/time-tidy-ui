#!/usr/bin/env python3

# 进入..目录下，执行 npm run build
import os
import subprocess
import argparse
import shutil
import os
import time

go_dir='D:/02_workspace/05_timeCapsule/time_capsule'
etectron_path='D:/02_workspace/05_timeCapsule/timeCapsule_ui/time_capsule_app_v2/time_capsule'
go_release_dir='D:/02_workspace/05_timeCapsule/time_capsule_release/time_capsule_exe'

# 解析命令行参数
# app 打包electron， app_dbg，只打包web，然后替换进去，不打包electron
def parse_args():
    parser = argparse.ArgumentParser(description='根据打包类型进行打包操作')
    parser.add_argument('type', choices=['app','app_dbg', 'web', 'go'], help='打包类型，可选值：app, app_dbg, web, go')
    return parser.parse_args()
def build_go():
    try:
        os.chdir(go_dir)
        subprocess.run(['go', 'build'], check=True)
        print('------------go 构建完成')
    except FileNotFoundError:
        print("未找到 go，请检查 go 路径是否正确。")
    except subprocess.CalledProcessError:
        print("go 构建过程中出错，请检查构建命令。")
        exit(1)
def pack_go():
    #1，构建 go 程序
    build_go()

    #2， 先删除web资源目录
    go_web_dir = 'D:/02_workspace/05_timeCapsule/time_capsule/assets/www'
    if os.path.exists(go_web_dir):
        # 删除目录及其所有内容
        shutil.rmtree(go_web_dir)
        print(f"目录 {go_web_dir} 及其所有内容已成功删除。")
    # 把 web_dist_dir 复制到 go_web_dir 目录
    target_dir = go_web_dir
    # 检查源目录是否存在
    if os.path.exists(web_dist_dir):
        try:
            os.makedirs(target_dir, exist_ok=True)
            shutil.copytree(web_dist_dir, target_dir, dirs_exist_ok=True)
            print(f"所有文件和子目录已成功复制到 {target_dir}。")
        except Exception as e:
            print(f"复制过程中出现错误: {e}")
            exit(1)

    #3，打包 go 程序 
    if os.path.exists(go_release_dir):
        shutil.rmtree(go_release_dir)
        print(f"目录 {go_release_dir} 及其所有内容已成功删除。")
    #3.1， 复制 go_dir目录下的time_capsule.exe 到 go_release_dir 目录
    target_file = os.path.join(go_release_dir, 'time_capsule.exe')
    source_file = os.path.join(go_dir, 'time_capsule.exe')
    # 确保目标目录存在
    os.makedirs(os.path.dirname(target_file), exist_ok=True)
    # 复制文件到目标目录
    shutil.copy2(source_file, target_file)
    print(f"文件已成功复制到 {target_file}。")
    # 3.2，复制 go_dir目录下的assets 目录 到 go_release_dir 目录
    target_dir = os.path.join(go_release_dir, 'assets')
    source_dir = os.path.join(go_dir, 'assets')
    # 确保目标目录存在
    os.makedirs(os.path.dirname(target_dir), exist_ok=True)
    # 复制目录到目标目录
    shutil.copytree(source_dir, target_dir)
    print(f"目录已成功复制到 {target_dir}。")
    print('------------go 打包完成')

def build_electron():
    try:
        os.chdir(etectron_path)
        subprocess.run([npm_path, 'run', 'build:win'], check=True)
        print('------------electron 构建完成')
    except FileNotFoundError:
        print("未找到 npm，请检查 npm 路径是否正确。")
    except subprocess.CalledProcessError:
        print("构建过程中出错，请检查构建命令。")
        exit(1)

def pack_electron():
    #1，删除 electron 应用目录下的 web 资源目录
    time_capsule_exe_dir = os.path.join(etectron_path, 'resources/time_capsule_exe')
    if os.path.exists(time_capsule_exe_dir):
        shutil.rmtree(time_capsule_exe_dir)
        print(f"目录 {time_capsule_exe_dir} 及其所有内容已成功删除。")
    resources_dir = os.path.join(etectron_path, 'resources/time_capsule_exe')
    # 把go_release_dir目录复制到 resources_dir 目录下
    target_dir = resources_dir
    # 检查源目录是否存在
    if os.path.exists(go_release_dir):
        try:
            shutil.copytree(go_release_dir, target_dir)
            print(f"------------web资源复制成功")
        except FileExistsError:
            print(f"目标目录 {target_dir} 已存在，复制失败。")
            exit(1)
        except Exception as e:
            print(f"复制过程中出现错误: {e}")
            exit(1)
    else:
        print(f"源目录 {go_release_dir} 不存在。")
        exit(1)
    #2，构建 electron 应用
    time.sleep(1)
    build_electron()
    

args = parse_args()

# 获取当前脚本所在的目录
current_dir = os.path.dirname(os.path.abspath(__file__))
# 进入..目录下
parent_dir = os.path.dirname(current_dir)
os.chdir(parent_dir)

npm_path = r'C:/Program Files/nodejs/npm.cmd'

try:
    subprocess.run([npm_path, 'run', 'build'], check=True)
    print('------------web 构建完成')
except FileNotFoundError:
    print("未找到 npm，请检查 npm 路径是否正确。")
except subprocess.CalledProcessError:
    print("构建过程中出错，请检查构建命令。")
    exit(1)

web_dist_dir = r'D:\\02_workspace\\05_timeCapsule\\timeCapsule_ui\\time_capsule_ui_v2\\dist'

# 打包 electron 应用
if args.type in ['app','app_dbg']:
    #1，删除app目录下的web资源目录
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
    #2，等待1秒，把成果物复制到directory_path目录
    time.sleep(1)
    target_dir = directory_path
    # 检查源目录是否存在
    if os.path.exists(web_dist_dir):
        try:
            shutil.copytree(web_dist_dir, target_dir)
            print(f"所有文件和子目录已成功复制到 {target_dir}。")
        except FileExistsError:
            print(f"目标目录 {target_dir} 已存在，复制失败。")
            exit(1)
        except Exception as e:
            print(f"复制过程中出现错误: {e}")
            exit(1)
    else:
        print(f"源目录 {web_dist_dir} 不存在。")
        exit(1)
    #3，构建 electron
    if args.type == 'app':
        pack_electron()
    print('------------app 打包完成')

    # 4, 打包go程序


if args.type == 'go':
    pack_go()
exit(1)



