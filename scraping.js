const puppeteer = require('puppeteer');
const fs = require('fs');
async function scraping () {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.goafricaonline.com/ci/annuaire/organisations-non-gouvernementales-ong#google_vignette'); 
    const idarticle=await page.evaluate(() => {
        let id=[];
        let  articles = document.querySelectorAll('article');
        articles.forEach(el=>{
            id.push(el.id)
        })
        return id
    })
        let data=[]
        for(const id of idarticle.splice(1,)){
        const selector=`#${id} > div.flex.w-full > div > div:nth-child(1) > div.flex-1 > h2 > a`
        await page.waitForSelector(selector);
        await page.click(selector)
        const elements=await page.evaluate(()=>{
            let description =document.querySelector('#short-description');
            let nom = document.querySelector("#goafrica-main-container > div > div.boxify.rounded-none.t\\:rounded-lg.border-l-0.border-r-0.t\\:border-l.t\\:border-r.mt-\\[80px\\] > div > div.px-10.mt-8.flex.flex-col.flex-wrap > div > div.w-full.t\\:w-auto.t\\:flex-1.mb-8.flex.flex-col.gap-6 > h1");
            let numero = document.querySelector("#goafrica-main-container > div > div.w-full.flex.flex-wrap.mt-g > div.w-full.ls\\:w-7\\/12.ls\\:pr-g.flex.flex-col.gap-y-g > div:nth-child(2) > div > div > div.flex.flex-wrap.ls\\:flex-nowrap.text-gray-700.ls\\:gx-8 > div.flex.ls\\:block.flex-wrap.justify-between.w-full.ls\\:w-1\\/2.mt-12.ls\\:mt-0 > div > div > div > a");
            numero=numero?numero:document.querySelector("#goafrica-main-container > div > div.w-full.flex.flex-wrap.mt-g > div.w-full.ls\\:w-7\\/12.ls\\:pr-g.flex.flex-col.gap-y-g > div:nth-child(1) > div > div > div.flex.flex-wrap.ls\\:flex-nowrap.text-gray-700.ls\\:gx-8 > div.flex.ls\\:block.flex-wrap.justify-between.w-full.ls\\:w-1\\/2.mt-12.ls\\:mt-0 > div > div > div:nth-child(1) > a");
            let address=document.querySelector('address')
            let element={
                nom: nom ? nom.textContent.trim() : '',
                description: description ? description.textContent.trim() : '',
                numero: numero ? numero.textContent.trim() : '',
                address:address ? address.textContent.trim() : ''
            };
            return element
        })
        data.push(elements)
        setTimeout(async ()=>{
            await page.goBack();
        },1000)
        }
        return data
};

/*(async () => {
    const a = await scraping();
// Convertir les données en format JSON
const jsonData = JSON.stringify(a, null, 2); // Le deuxième argument (null) et le troisième argument (2) sont pour l'espacement et la mise en forme du JSON.

// Chemin du fichier où vous souhaitez écrire les données JSON
const filePath = 'data.json';

// Écrire les données JSON dans le fichier
fs.writeFile(filePath, jsonData, 'utf8', (err) => {
  if (err) {
    console.error('Erreur lors de l\'écriture du fichier :', err);
  } else {
    console.log('Données JSON ont été écrites dans le fichier avec succès.');
  }
});

  })();*/



  