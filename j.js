const puppeteer =require('puppeteer');

( async () => {
  let elt=[]
  const browser = await puppeteer.launch({headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://www.goafricaonline.com/ci/annuaire/organisations-non-gouvernementales-ong#google_vignette');
  const el = await page.evaluate(async () => {
    let  articles = document.querySelectorAll('article');
      const lien = articles[1].querySelector('div.flex-1 > h2 > a')
      if(lien){
        lien.click()
        await page.evaluate(()=>{
          let description = document.querySelector('#short-description').textContent.trim();
          let nom = document.querySelector("#goafrica-main-container > div > div.boxify.rounded-none.t\\:rounded-lg.border-l-0.border-r-0.t\\:border-l.t\\:border-r.mt-\\[80px\\] > div > div.px-10.mt-8.flex.flex-col.flex-wrap > div > div.w-full.t\\:w-auto.t\\:flex-1.mb-8.flex.flex-col.gap-6 > h1").textContent.trim();
          let numero = document.querySelector("#goafrica-main-container > div > div.w-full.flex.flex-wrap.mt-g > div.w-full.ls\\:w-7\\/12.ls\\:pr-g.flex.flex-col.gap-y-g > div:nth-child(2) > div > div > div.flex.flex-wrap.ls\\:flex-nowrap.text-gray-700.ls\\:gx-8 > div.flex.ls\\:block.flex-wrap.justify-between.w-full.ls\\:w-1\\/2.mt-12.ls\\:mt-0 > div > div > div > a").textContent.trim();
          elt.push({
            nom: nom,
            description: description,
            numero: numero
          })
          return elt
        })
      }
      return elt
    })
    console.log(el)
})
  ();
