import axios from 'axios';
import clientPromise from '../../../lib/mongodb';
import summarize from '../../../lib/summarize';

const API_KEY = process.env["WEB_SCRAPING_API_KEY"];
const HOSTNAME = 'https://api.webscrapingapi.com';

const extract_rules_hn = {
	"title": {
		"selector": ".titleline",
		"output": {
			"name": {
				"selector": "a",
				"output": "text"
			},
			"links": {
				"selector": "a",
				"output": "@href",
				"all": "1"
			}
		},
		"all": "1"
	}
}

const extract_rules_page = {
	"p": {
		"selector": "p",
		"output": "text",
	}
}

export default async function handler(req, res) {

	const mongoClient = await clientPromise;
	const db = mongoClient.db(process.env.MONGO_DB_NEWS);
	const collection = db.collection(process.env.MONGO_COLLECTION_HN);

	if(req.method === 'GET') {}

	try {
		const hnUlr = 'https://news.ycombinator.com/news?p=1';
		const scrapHNs = await scrapPage(hnUlr, extract_rules_hn)

		const pagesHN = scrapHNs.title.map((item) => {
			return {
				name: item.name[0],
				link: item.links[0]
			}
		});

		// await collection.insertOne({nameLinks: pagesHN})

		let dataPages = [];
		let page = '';
		for(let i in pagesHN) {
			const { name, link } = pagesHN[i];
			console.log('scrapHNs#scraping: ', name, link);
			page = await scrapPage(link, extract_rules_page);
			if(page && page.p) {
				console.log('true | success');
				dataPages.push({
					title: name,
					link: link,
					page: page.p,
				});
			} else {
				console.log(page, name, link)
			}
			// if(i > 5) break;
		}

		const data = {
			created_at: new Date(),
			data: dataPages,
		}

		// const data = dataScrapedMock;

		// await collection.insertOne({...data})

		// const data = dataPagesMockData;

		//TODO Con esta data, ahora tengo que llamar una función que resuma todo esto.
		const maxSentenceCount = 2;
		// const pagesConcat = data.data.map(item => `title: ${item.title}. page: `.concat(item.page));
		let pagesConcat = '';
		for(let i in data.data) {
			pagesConcat = `title: ${data.data[i].title}. page: `.concat(data.data[i].page);
			data.data[i]['summary'] = await summarize([pagesConcat], maxSentenceCount);
			console.log(i)
			// if(i > 2) break;
		}

		await collection.insertOne(data);

		res.status(200).json(data);

	} catch (error) {
		console.error("handler#err:", error);
		res.status(500)
	}
}

async function scrapHNs() {
	// TODO scrap HNs

	// const pages = json.title;

	const extract_rules = {
		"p": {
			"selector": "p",
			"output": "text",
		}
	}

	let i = 0;
	let data_pages = [];
	for(chunk of pages) {
		const { name, links } = chunk;
		console.log('scrapHNs#scraping: ', name[0],links[0]);
		try {
			p = await scrapPage(links[0], extract_rules);
		} catch (error) {
			console.log('scrapHNs#ERROR', error);
		}
		p['title'] = name;
		data_pages.push(p);
		// i++;
		// if(i > 20) break;
	}
	// console.log('data_pages', data_pages);
	// TODO save in DB - mongo
};

async function scrapPage(page_url, extract_rules) {
	try {
		const page_url_encoded = encodeURI(page_url);
		const extract_rules_encoded = encodeURI(JSON.stringify(extract_rules));

		const options = {
			"method": "GET",
			"hostname": "api.webscrapingapi.com",
			"port": null,
			"path": `/v1?url=${page_url_encoded}&api_key=${API_KEY}&device=desktop&proxy_type=datacenter&render_js=0&extract_rules=${extract_rules_encoded}`,
			"headers": {}
		};

		const res = await axios.get(HOSTNAME + options.path);
		return res.data;

	} catch (error) {
		// console.log('scrapPage#ERROR', error);
		console.log('scrapPage#ERROR', error.response.data);
		return null;
	}
};

async function doSummary(pages, maxSentenceCount) {
	let text = '';
	let summary = [];
	for(let i in pages) {
		text = [`title: ${pages[i].title}. page: `.concat(pages[i].page)]
		console.log(i, text);
		console.log(`sumarizing: ${pages[i].title}`)
		const result = await summarize(text, maxSentenceCount);
		summary.push(result);
		if(i > 1) break;
	}
	console.log('doSummary#summary', summary);
	return summary;
}
