#!/usr/bin/env bash

# 当前路径
CURDIR=$(cd `dirname $0`; pwd)

# 构建代码
node ${CURDIR}/build.js --target dev