const fs = require('fs')
const ph = require('path')
const curTime = formatDatetime(new Date())
const curDate = curTime.substring(0, curTime.indexOf(' '))
const packFileName = `Frontend-Notes-Pack-${curDate}.md`
const questionsFileName = `Frontend-Questions-${curDate}.md`
const buildTag = `\`build at ${curTime}\`\n`
const mdPaths = [
  ph.resolve(__dirname, 'notes/javascript/index.md'),
  ph.resolve(__dirname, 'notes/vue/index.md'),
  ph.resolve(__dirname, 'notes/css/index.md'),
  ph.resolve(__dirname, 'notes/html/index.md'),
  ph.resolve(__dirname, 'notes/algorithm/index.md'),
  ph.resolve(__dirname, 'notes/backend/index.md'),
  ph.resolve(__dirname, 'notes/tools/index.md'),
  ph.resolve(__dirname, 'notes/career/index.md')
]

if(!fs.existsSync('pack')){
  fs.mkdirSync('pack')
}
process.chdir('./pack')
generateMdPack()
generateQuestions()

function generateMdPack(){
  fs.writeFileSync(packFileName, buildTag)
  const writer = fs.createWriteStream(packFileName, {flags: 'a'})
  mdPaths.forEach((md) => {
    const content = fs.readFileSync(md, 'utf8')
    writer.write('\n', 'utf8')
    writer.write(content, 'utf8')
    writer.write('\n---\n', 'utf8')
    console.log(`成功写入文件 ${md}`)
  })
  writer.end()
  console.log(`成功生成 ${packFileName}`)
}


function generateQuestions(){
  const h2Titles = []
  const readLine = require('readline')
  const rl =  readLine.createInterface(fs.createReadStream(packFileName))
  rl.on('line', (line)=>{
    if(line.startsWith('## ')){
      h2Titles.push(line)
    }
  })
  rl.on('close', ()=>{
    fs.writeFileSync(questionsFileName, buildTag)
    const writer = fs.createWriteStream(questionsFileName, {flags: 'a'})
    const questions = shuffle(h2Titles)
    questions.forEach((question)=>{
      writer.write(`\n${question}\n`, 'utf8')
    })
    console.log(`成功生成 ${questionsFileName}`)
  })
}




function formatDatetime(datetime) {
  if (datetime === '' || !datetime) {
    return '';
  }
  const date = new Date(datetime);
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  let d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  let h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  let minute = date.getMinutes();
  minute = minute < 10 ? ('0' + minute) : minute;
  let second = date.getSeconds();
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}

function shuffle (source) {
  
  const array = source.slice() // 复制数组，不影响参数原数组
  for (let i = 0; i < array.length; i++) {
    const j = Math.floor(Math.random() * (i + 1))
    swap(array, i, j)
  }
  return array
}

function swap (array, idx1, idx2) {
  const temp = array[idx1]
  array[idx1] = array[idx2]
  array[idx2] = temp
}
