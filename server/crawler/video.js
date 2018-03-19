// 爬取 movie 信息
const puppeteer = require('puppeteer')

const BASE_URL = 'https://movie.douban.com/subject/'
const doubanId = '26739551'
const videoBase = `https://movie.douban.com/trailer/219491/`

const sleep = time =>
  new Promise((resolve, reject) => {
    setTimeout(resolve, time)
  })
;(async () => {
  console.log(
    '-------------------Start visit the target page-------------------'
  )
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    dumpio: false
  })

  const page = await browser.newPage()
  await page.goto(BASE_URL + doubanId, {
    waitUntil: 'networkidle2'
  })
  await sleep(1000)
  
  const result = await page.evaluate(() => {
    var $ = window.$
    var it = $('.related-pic-video')

    if (it && it.length > 0) {
      var link = it.attr('href')
      var cover = it.find('img').attr('src')

      return {link, cover}
    }

    return {}
  })

  // 详情页爬到了 link和cover后
  let video
  if (result.link) {
    await page.goto(result.link, {
      waitUntil: 'networkidle2'
    })
    await sleep(2000)
    video = await page.evaluate(() => {
      var $ = window.$
      var it = $('source')

      if (it && it.length > 0) {
        return it.attr('src')
      }

      return ''
    })
  }

  const data = {
    video,
    doubanId,
    cover: result.cover
  }


  browser.close()

  process.send({ data })
  process.exit(0)
})()
