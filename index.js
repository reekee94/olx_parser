import cheerio from 'cheerio'
import axios from "axios"
import Agenda from 'agenda'
import HomePageAds from "./model/HomePageAds.js";
import dotenv from "dotenv";
const url = 'https://www.olx.ua/'
dotenv.config()

const agenda = new Agenda({ db: { address: process.env.MONGO_URI } });

const dateFormatter = (str) => {
  let result
  const now = new Date()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  let array = str.split(' ')
  let day = array[0]
  let time = array[array.length-1]
  if (day === 'Вчера') {
    result = now.toISOString().slice(0,10)+" "+time
  }
  if (day === 'Сегодня') {
    result = yesterday.toISOString().slice(0,10)+" "+ time

  }
  if (time === 'март') {

    now.setDate(day)
    result = now.toISOString().slice(0,10)+ " " + "00:00"
  }
  if (time !== 'март' && day !=='Сегодня' && day !=='Вчера' && time) {
    now.setDate(day)
    now.setMonth(-1)
    result = now.toISOString().slice(0,10)+ " " + "00:00"
  }
  return result
}

const olxWorker = () => {

  agenda.define('parse olx', async (job) => {
    try {
      const {data} = await axios.get(url)
      const $ = cheerio.load(data)
      const d = $('ul#gallerywide.clr.normal').find('[data-adnumber]')
      d.each(async (i, item) => {
        const olx_id = $(item).attr('data-id')
        const title = $(item).find('a').attr('title')
        const image_href = $(item).find('a').attr('href')
        const price = $(item).find('div.price').text().trim().split('\t')[0]
        const categor = $(item).find('div.inner span.breadcrumb.small').text().trim().split('\n')[0].split('»')
        const parent_cat = categor[0]
        const child_cat = categor[1]
        const location = $(item).find('ul.date-location').children().first().text().split(',')
        const time = $(item).find('ul.date-location').children().last().text()
        const posted_time = await dateFormatter(time)

        const advertisment = new HomePageAds({
          olx_id,
          title,
          posted_time,
          image_href,
          price,
          city: location[0],
          city_area: location[1] ? location[1] : '',
          category: parent_cat,
          sub_category: child_cat,
        })


        const allreadyInBase = await HomePageAds.exists({olx_id})
        if(allreadyInBase ){
          return console.log('allreadyInBase')
        }

        await advertisment.save()

      })
    } catch (e) {
      console.error('worker error:', e);
    }
  });
  (async function () {
    await agenda.start();
    await agenda.every('3 minutes', 'parse olx');
  })();
};
export default olxWorker
