#!/bin/bash

PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

for c in $(seq ${1})
do
    echo -e "create ${c}.js"

    touch ${c}.js

    # 主程式
done
exit 0