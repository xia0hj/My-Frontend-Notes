# JS笔记

## Object.defineProperty()的坑
设定getter和setter时，不能直接返回或修改obj.key的值，否则在getter中访问又会继续触发getter，造成无限递归