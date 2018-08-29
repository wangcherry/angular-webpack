#!/usr/bin/env bash

# 当前路径
CURDIR=$(cd `dirname $0`; pwd)

# 定义常量
BRANCH=master
if [ $# -gt 0 ]; then
    BRANCH="$1"
fi
echo "[BRANCH] is: ${BRANCH}"

# 拉取最新更新，切换到分支（默认 dev）
git pull
git checkout "${BRANCH}"
git pull

# 重新安装npm
npm i

# 构建代码，上传git，静态资源上传到nos
node ${CURDIR}/build.js --target online
