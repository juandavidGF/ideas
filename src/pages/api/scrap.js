import axios from 'axios';
import clientPromise from '../../../lib/mongodb'

const API_KEY = process.env["WEB_SCRAPING_API_KEY"]

const extract_rules_hn = [
	{
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
]

export default async function handler(req, res) {

	const mongoClient = await clientPromise;
	const db = mongoClient.db(process.env.MONGO_DB_NEWS);
	const collection = db.collection(process.env.MONGO_COLLECTION_HN);

	if (req.method === 'GET') {}

	try {
		const hnUlr = 'https://news.ycombinator.com/news?p=1';
		const scrap = await scrapPage(hnUlr, extract_rules_hn[0])

		const results = scrap.title.map((item) => {
			return {
				name: item.name[0],
				link: item.links[0]
			}
		});

		console.log('result', result);

		const data = {
			created_time: new Date(),
			data: results
		}
		await collection.insertOne(data)

		res.status(200).json({ name: data })

	} catch (error) {
		console.error("challenges server mogoConnection err:", error);
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

	const page_url_encoded = encodeURI(page_url);
	const extract_rules_encoded = encodeURI(JSON.stringify(extract_rules));

	const hostname = 'https://api.webscrapingapi.com';

	const options = {
		"method": "GET",
		"hostname": "api.webscrapingapi.com",
		"port": null,
		"path": `/v1?url=${page_url_encoded}&api_key=${API_KEY}&device=desktop&proxy_type=datacenter&render_js=0&extract_rules=${extract_rules_encoded}`,
		"headers": {}
	};

	console.log('doing scraping HNs')
	const res = await axios.get(hostname + options.path);
	// console.log('scrapPage#res', res.data);
	return res.data;
};
