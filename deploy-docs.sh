
if [[ $1 == "-p" ]]; then
  deployPath=/data/wxpusher/wxpusher-docs-fe/docs/
  server=101.34.81.179 
  port=22
  echo "腾讯main服务器"
else
  deployPath=/data/app/wxpusher-test/wxpusher-docs/docs/
  server=115.28.141.240
  port=22
  echo "部署测试环境"
fi


targetFile=dist.tar.gz

echo "打包产物"

tar -zcf  ${targetFile} -C docs .    

echo "上传"

ssh -p ${port} admin@${server} "
if [ ! -d ${deployPath} ]; then
    echo  "文件夹不存在，创建文件夹"
    mkdir -p ${deployPath}
fi
"
echo "上传文件:${targetFile}"
scp -P ${port} ${targetFile} admin@${server}:${deployPath}${targetFile}
echo "上传完成"

echo "解压"
ssh -p ${port} admin@${server} "
tar -zxf ${deployPath}${targetFile} -C ${deployPath}
rm ${deployPath}${targetFile}
"
rm ${targetFile}
if [[ $? == 0 ]]; then
    echo "\033[32m 部署完成"
else
    echo "\033[31m 部署失败"
fi
