// 数字位运算用作数组
function getBit(num, index) {
  const cur = (1 << index)
  return num & cur
}
function setBit(num, index, boolVal) {
  const cur = (1 << index)
  if (boolVal) {
    return num | cur
  } else {
    return num & (~cur)
  }
}


