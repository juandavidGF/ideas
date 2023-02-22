import axios from 'axios';
import clientPromise from '../../../lib/mongodb'

const API_KEY = process.env["WEB_SCRAPING_API_KEY"]
const HOSTNAME = 'https://api.webscrapingapi.com';

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
const extract_rules_page = {
	"p": {
		"selector": "p",
		"output": "text",
	}
}


const hnMockData =  [
  {
    name: 'Launch HN: Moonrepo (YC W23) – Open-source build system',
    link: 'item?id=34885077'
  },
  {
    name: 'Spy Balloon Simulator',
    link: 'https://spyballoonsim.hornetsnestguild.com/'
  },
  {
    name: 'TreeTalk London – Tree Map',
    link: 'https://www.treetalk.co.uk/map/'
  },
  {
    name: 'Amazon employees push CEO Andy Jassy to drop return-to-office mandate',
    link: 'https://www.cnbc.com/2023/02/21/amazon-employees-push-ceo-andy-jassy-to-drop-return-to-office-mandate.html'
  },
  {
    name: 'Prompt Engineering Guide: Guides, papers, and resources for prompt engineering',
    link: 'https://github.com/dair-ai/Prompt-Engineering-Guide'
  },
  {
    name: 'Show HN: Phind.com – Generative AI search engine for developers',
    link: 'https://phind.com'
  },
  {
    name: 'KanjiVG – SVGs of Kanji character strokes including order, shape and direction',
    link: 'https://kanjivg.tagaini.net/'
  },
  {
    name: 'Jerry (YC S17) Is Hiring a Senior / Staff Engineer (China Remote)',
    link: 'https://jobs.ashbyhq.com/Jerry/142d1a0a-56e4-4deb-92bd-20c0e13d35f9'
  },
  {
    name: 'World’s Largest Four-Day Work Week Trial Finds Few Are Going Back',
    link: 'https://www.bloomberg.com/news/articles/2023-02-21/four-day-work-week-uk-study-finds-majority-of-employers-shifting'
  },
  {
    name: 'Show HN: Yobulk – Open-source CSV importer powered by GPT3',
    link: 'https://github.com/yobulkdev/yobulkdev'
  },
  {
    name: 'Color of the Night Sky',
    link: 'https://clarkvision.com/articles/color.of.the.night.sky/'
  },
  {
    name: 'Sci-fi becomes real as renowned magazine closes submissions due to AI writers',
    link: 'https://arstechnica.com/information-technology/2023/02/sci-fi-becomes-real-as-renowned-magazine-closes-submissions-due-to-ai-writers/'
  },
  {
    name: 'Microsoft is now injecting full-size ads on Chrome website',
    link: 'https://www.neowin.net/news/microsoft-is-now-injecting-full-size-ads-on-chrome-website-to-make-you-stay-on-edge/'
  },
  {
    name: 'OODA Loop',
    link: 'https://en.wikipedia.org/wiki/OODA_loop'
  },
  {
    name: 'Haiku package management',
    link: 'https://www.markround.com/blog/2023/02/13/haiku-package-management/'
  },
  {
    name: 'Is this painting a Raphael or not?',
    link: 'https://www.wsj.com/articles/is-this-painting-a-raphael-or-not-a-fortune-rides-on-the-answer-2cf3283a'
  },
  {
    name: 'Show HN: QuestDB with Python, Pandas and SQL in a Jupyter notebook – no install',
    link: 'https://play.questdb.io/'
  },
  {
    name: 'Software 2.0 (2017)',
    link: 'https://karpathy.medium.com/software-2-0-a64152b37c35'
  },
  {
    name: 'Anaximander and the Nature of Science',
    link: 'https://www.theguardian.com/books/2023/feb/13/anaximander-and-the-nature-of-science-by-carlo-rovelli-review-the-ancient-master-of-the-universe'
  },
  {
    name: 'What is the randomart image for?',
    link: 'https://bytes.zone/posts/what-is-the-randomart-image-for/'
  },
  {
    name: 'Asp.net Core updates in .NET 8 Preview 1',
    link: 'https://devblogs.microsoft.com/dotnet/asp-net-core-updates-in-dotnet-8-preview-1/'
  },
  {
    name: 'Reddit is experiencing a partial outage',
    link: 'https://www.redditstatus.com'
  },
  {
    name: 'EPA orders Norfolk Southern to conduct all cleanup actions related to derailment',
    link: 'https://www.epa.gov/newsreleases/epa-orders-norfolk-southern-conduct-all-cleanup-actions-associated-east-palestine'
  },
  {
    name: 'Paleotsunami Detectives Hunt for Ancient Disasters',
    link: 'https://hakaimagazine.com/news/paleotsunami-detectives-hunt-for-ancient-disasters/'
  },
  {
    name: 'Saying goodbye to Stack Overflow',
    link: 'https://old.reddit.com/r/webdev/comments/116vvpp/saying_goodbye_to_stack_overflow/'
  },
  {
    name: "AdNauseam – clicking ads so you don't have to",
    link: 'https://adnauseam.io/'
  },
  {
    name: 'Show HN: Planlike.pro – New Estimating Tool',
    link: 'https://planlike.pro/'
  },
  {
    name: 'Ask HN: YC co-founder matching is bad',
    link: 'item?id=34883106'
  },
  {
    name: "Supreme Court declines to hear Wikimedia's challenge to NSA mass surveillance",
    link: 'https://diff.wikimedia.org/2023/02/21/u-s-supreme-court-declines-to-hear-wikimedia-foundations-challenge-to-nsa-mass-surveillance/'
  },
  {
    name: '“Balkan Cosmology” by Bruce Sterling (2022)',
    link: 'https://bruces.medium.com/balkan-cosmology-by-bruce-sterling-2022-9a06b9b28bc0'
  }
]




export default async function handler(req, res) {

	const mongoClient = await clientPromise;
	const db = mongoClient.db(process.env.MONGO_DB_NEWS);
	const collection = db.collection(process.env.MONGO_COLLECTION_HN);

	if (req.method === 'GET') {}

	try {
		// const hnUlr = 'https://news.ycombinator.com/news?p=1';
		// const scrap = await scrapPage(hnUlr, extract_rules_hn[0])

		// const pages = scrap.title.map((item) => {
		// 	return {
		// 		name: item.name[0],
		// 		link: item.links[0]
		// 	}
		// });

		// console.log('hacker news data', pages)

		// console.log('data', data);
		// await collection.insertOne(data)

		const pages = hnMockData;

		let data_pages = [];
		let page = '';
		for(let i in pages) {
			const { name, link } = pages[i];
			console.log('scrapHNs#scraping: ', name, link);
			page = await scrapPage(link, extract_rules_page);
			if(page) {
				console.log('true | success');
				data_pages.push({
					title: name,
					page: page.p,
				});
			} else {
				console.log(page, name, link)
			}
			// if(i > 5) break;
		}

		const data = {
			created_at: new Date(),
			data: data_pages,
		}

		await collection.insertOne(data)

		res.status(200).json({ data: data_pages })

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
