# Vue

### scoped
作用: 样式私有化，做样式隔离，防止样式冲突

实现方式

 - 通过postCSS实现，读取文件路径，根据文件名称生成哈希值，放到data-v中：data-v-hash
 