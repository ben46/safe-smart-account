
# 后端

### signature/add

- to
- value
- data
- operation
- signature
- owner

接收到提交之后

从合约获取dataHash

从合约获取data

调用`checkNSignatures(hash,data,signature,1)`, 通过存入数据库, 不通过返回错误

数据库存

- to
- value
- data
- operation
- signature
- owner
- txData
- txHash(hash of txData)
- id(auto increment)

### signature/exec

TODO 权限权限

- txHash
- execTimeStamp

会从数据库中找出所有的签名order by owner asc, 获取合约上的`getThreshold`, 如果签名数量>threshold, 则插入数据库

写一个轮循, 一分钟轮循一次, 从数据库读取需要定时发布的升级任务



