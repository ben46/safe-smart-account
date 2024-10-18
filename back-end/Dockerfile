# 使用官方Node.js镜像  
FROM node:20

# 设置工作目录  
WORKDIR /usr/src/app  

# 复制package.json和package-lock.json  
COPY package*.json ./  

# 安装依赖  
RUN npm install  

# 复制应用代码  
COPY . .  

# 暴露端口  
EXPOSE 13000  

# 启动应用  
CMD ["npx", "ts-node", "src/app.ts"]