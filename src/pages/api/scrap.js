import axios from 'axios';
import clientPromise from '../../../lib/mongodb'

const API_KEY = process.env["WEB_SCRAPING_API_KEY"]
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

const dataPagesMockData = {
  "data": [
    {
      "title": "Spy Balloon Simulator",
      "page": ""
    },
    {
      "title": "TreeTalk London – Tree Map",
      "page": ""
    },
    {
      "title": "Amazon employees push CEO Andy Jassy to drop return-to-office mandate",
      "page": [
        "",
        "In this article",
        "A group of Amazon employees is urging CEO Andy Jassy to reconsider a new return-to-office mandate.",
        "On Friday, Jassy announced Amazon would require corporate staffers to spend at least three days a week in the office beginning May 1. Jassy said he and Amazon's leadership team, known as the S-team, decided it would be easier for employees to collaborate and invent together in person and that in-person work would strengthen the company's culture.",
        "The move marks a shift from Amazon's pandemic-era policy, last updated in October 2021, which left it up to managers to decide how frequently their teams needed to be in the office. Since then, there's been a mix of fully remote and hybrid work among Amazon's white-collar workforce.",
        "Staffers on Friday created a Slack channel to advocate for remote work and share their concerns about the new return-to-work policy, according to screenshots viewed by CNBC. Almost 14,000 employees had joined the Slack channel as of Tuesday morning.",
        "The employees have also drafted a petition, addressed to Jassy and the S-team, that calls for leadership to drop the new policy, saying it \"runs contrary\" to Amazon's positions on diversity and inclusion, affordable housing, sustainability, and focus on being the \"Earth's Best Employer.\"",
        "\"We, the undersigned, call for Amazon to protect its role and status as a global retail and tech leader by immediately cancelling the RTO policy and issuing a new policy that allows employees to work remotely or more flexibly, if they choose to do so, as their team and job role permits,\" according to a draft of the petition, which was previously reported by Business Insider.",
        "The 'profitless Nasdaq junk' stocks leading the recent rally pose a risk to investors, says Josh Brown",
        "Nvidia vs. TSMC: Wall Street pros name their favorite stock as chip battle heats up",
        "These are Wall Street's favorite chip stocks, including one expected to rally more than 30%",
        "An Amazon spokesperson referred back to Jassy's blog post about return-to-office guidance.",
        "The employees also pointed to Jassy's previous statements on return-to-office plans, in which he said there is no \"one-size-fits-all approach for how every team works best\" and extolled the benefits of remote work.",
        "\"Many employees trusted these statements and planned for a life where their employer wouldn't force them to return to the office,\" a draft of the petition states. \"The RTO mandate shattered their trust in Amazon's leaders.\"",
        "Employees who moved during the pandemic or were hired for a remote role are concerned about how the new policy will affect them, according to one employee, who asked to remain anonymous. Amazon's head count ballooned over the last three years, and it hired more employees outside of its key tech hubs such as Seattle, New York and Northern California as it embraced a more distributed workforce.",
        "Amazon hasn't addressed whether remote employees will be asked to relocate, beyond Jassy noting that there will be \"a small minority\" of exceptions to the new policy.",
        "The petition cites internal data showing that a significant share of employees prefer working fully remote with the option of a monthly sync-up in the office, or prefer working in the office at most one to two days a week. It also points to research showing that remote work increases productivity and allows companies such as Amazon to reduce expenses and attract and retain top talent.",
        "It also notes that a return to mostly in-person work could affect employees' work-life balance, and could particularly hurt parents, minorities, caregivers and people with disabilities. Employees also questioned Amazon's rationale behind forcing in-person work in all cases. For instance, some employees who are part of global teams will come into the office only to continue having virtual meetings, and they may not even have a coworker in their office, the petition says.",
        "WATCH: Andy Jassy on the benefits of remote work",
        "Got a confidential news tip? We want to hear from you.",
        "Sign up for free newsletters and get more CNBC delivered to your inbox",
        "Get this delivered to your inbox, and more info about our products and services.",
        "© 2023 CNBC LLC. All Rights Reserved. A Division of NBCUniversal",
        "Data is a real-time snapshot *Data is delayed at least 15 minutes. Global Business and Financial News, Stock Quotes, and Market Data and Analysis.",
        "Data also provided by"
      ]
    },
    {
      "title": "Prompt Engineering Guide: Guides, papers, and resources for prompt engineering",
      "page": [
        "🐙 Guides, papers, lecture, and resources for prompt engineering",
        "Use Git or checkout with SVN using the web URL.",
        "Work fast with our official CLI.      Learn more.",
        "Please                sign in                to use Codespaces.",
        "If nothing happens, download GitHub Desktop and try again.",
        "If nothing happens, download GitHub Desktop and try again.",
        "If nothing happens, download Xcode and try again.",
        "Your codespace will open once ready.",
        "There was a problem preparing your codespace, please try again.",
        "This guide contains a set of recent papers, learning guides, and tools related to prompt engineering. The repo is intended as a research and educational reference for practitioners and developers.",
        "Announcements:",
        "🎉 Prompt Engineering Lecture is live here! It Includes notebook and slides.",
        "Join our Discord",
        "Follow us on Twitter",
        "We have published a 1 hour lecture that provides a comprehensive overview of prompting techniques, applications, and tools.",
        "The following are a set of guides on prompt engineering developed by us. Guides are work in progress.",
        "The following are the latest papers (sorted by release date) on prompt engineering. We update this on a daily basis and new papers come in. We incorporate summaries of these papers to the guides above every week.",
        "Surveys / Overviews:",
        "Approaches/Techniques:",
        "Applications:",
        "Collections:",
        "Feel free to open a PR if you think something is missing here. Always welcome feedback and suggestions.",
        "🐙 Guides, papers, lecture, and resources for prompt engineering"
      ]
    },
    {
      "title": "KanjiVG – SVGs of Kanji character strokes including order, shape and direction",
      "page": [
        "KanjiVG (Kanji Vector Graphics)  provides vector graphics  and other information about kanji  used by the Japanese language. For each character, it provides an  SVG file which gives the shape and  direction of its strokes, as well as  the stroke order. Each file  is also enriched with information about the components of the  character such as the radical,  or the type of stroke employed.",
        "It is very easy to create stroke order diagrams, animations, kanji  dictionaries, and much more using  KanjiVG. See Projects using KanjiVG for  a growing list of applications of the KanjiVG data.",
        "The KanjiVG diagrams are simply SVG files, and may be viewed in any  web browser or other SVG viewer.  See the links at the left under  \"Format\" for details of the file internals.",
        "Report incorrect kanji at the KanjiVG  Github issues  page. You need a Github account. Alternatively, use the mailing  list.",
        "KanjiVG is copyright © 2009-2023 Ulrich Apel. It is released  under the  Creative  Commons Attribution-Share Alike 3.0 license.",
        "Use our mailing list to report  mistakes, or discuss anything related to KanjiVG.",
        "",
        "© 2009 — 2023 Ulrich Apel — Licensing",
        "The source code for this documentation is at\t  github.com.  Report issues with\t  the documentation on the\t  issues page.  To ask\t  questions or discuss KanjiVG, use the mailing list."
      ]
    }
  ]
}


export default async function handler(req, res) {

	const mongoClient = await clientPromise;
	const db = mongoClient.db(process.env.MONGO_DB_NEWS);
	const collection = db.collection(process.env.MONGO_COLLECTION_HN);

	if (req.method === 'GET') {}

	try {
		const hnUlr = 'https://news.ycombinator.com/news?p=1';
		const scrapHNs = await scrapPage(hnUlr, extract_rules_hn)

		const pagesHN = scrapHNs.title.map((item) => {
			return {
				name: item.name[0],
				link: item.links[0]
			}
		});

		console.log('hacker news data', pagesHN)

		let dataPages = [];
		let page = '';
		for(let i in pagesHN) {
			const { name, link } = pagesHN[i];
			console.log('scrapHNs#scraping: ', name, link);
			page = await scrapPage(link, extract_rules_page);
			if(page) {
				console.log('true | success');
				dataPages.push({
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
			data: dataPages,
		}

		await collection.insertOne(data)

		res.status(200).json(data)

	} catch (error) {
		console.error("handler#err:", error);
		res.status(500)
	}

	console.log('<end>')
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
