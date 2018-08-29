#!/usr/bin/env bash

#当前路径
CURDIR=$(cd `dirname $0`; pwd)

#定义常量
TARGET=src
if [ $# -gt 0 ]; then
    TARGET="$1"
fi
echo "[TARGET] is: ${TARGET}"

# 启动server
node ${CURDIR}/server.js --server mock --target ${TARGET}