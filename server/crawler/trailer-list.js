// 爬取 列表信息 电影概览
const puppeteer = require('puppeteer')
const URL = 'https://movie.douban.com/tag/#/?sort=R&range=6,10&tags='

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
  await page.goto(URL, {
    waitUntil: 'networkidle2'
  })
  await sleep(3000)
  await page.waitForSelector('.more')

  for (let i = 0; i < 1; i++) {
    await sleep(3000)
    await page.click('.more')
  }

  const result = await page.evaluate(() => {
    var $ = window.$
    var items = $('.list-wp .item')
    var links = []

    if (items.length >= 1) {
      items.each((index, item) => {
        let it = $(item)
        let doubanId = it.find('.cover-wp').data('id')
        let title = it.find('.title').text()
        let rate = Number(it.find('.rate').text())
        let poster = it
          .find('img')
          .attr('src')
          .replace('s_ratio', 'l_ratio')
        // https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2515496055.jpg

        links.push({
          doubanId,
          title,
          rate,
          poster
        })
      })
    }

    return links
  })

  browser.close()

  process.send({ result })
  process.exit(0)
})()
