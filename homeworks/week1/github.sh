#!/bin/bash

PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

#1. 讓 wget 可以使用 pipe 來利用指令
#2. 可以 get 到 特定 pattern
#3. 儲存成檔案
rep=$(wget -qO- https://api.github.com/users/${1})


for info in "name" "bio" "location" "blog"
do
    echo "${rep}" | grep ${info} | awk 'BEGIN { FS = "\"" } ; {print $4}'
done

exit 0
