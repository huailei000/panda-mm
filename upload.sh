#!/usr/bin/env bash

path=/home/fedev/www/web-mall/build

scp -r $path fedev@10.109.3.179:$path

echo ">10.109.3.179同步完成"

scp -r $path fedev@10.109.3.180:$path

echo ">10.109.3.180同步完成"