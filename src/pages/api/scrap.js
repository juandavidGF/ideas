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
  "created_at": "2023-02-22T15:21:38.513Z",
  "data": [
    {
      "title": "De-Extinction? Surely You’re Joking",
      "page": [
        "“For a successful technology, reality must take precedence over public relations, for nature cannot be fooled.” — Richard Feynman",
        "The black-faced honeycreeper — or po’o-uli, as the Hawaiians called it — was native to Maui. Two birds were spotted in 2000 and then never seen again. The species was declared extinct in 2019; it lives on only as cells in a cryogenic freezer.",
        "Or, consider the Pyrenean Ibex, a large goat native to Andorra’s mountains. The Ibex is the only animal to go extinct twice: Once in January 2000 and again in July 2003, after scientists cloned an animal and watched it die, moments later, from a lung defect.",
        "Hundreds of other plants and animals are listed as “possibly extinct” by the International Union for Conservation of Nature, which means they haven’t been seen in the wild for years. The list includes 156 amphibians, 22 birds, 29 mammals, and 93 insects. Captain Cook’s Bean Snail, the Wyoming Toad, and the She Cabbage Tree are all extinct in the wild. Today, they live only in zoos.",
        "Numbers alone can’t convey the Sixth Extinction, because numbers alone aren’t inherently visual. Each digit is an entire species, with thousands or millions of years of history, that is at risk of disappearing from the Earth. We mask extinction by visiting zoos or fawning over new technologies. “Humans made this mess,” we think, “and humans will fix it.”",
        "De-extinction, unfortunately, will not be our savior.",
        "Many academic scientists and companies aim to ‘resurrect’ long-extinct animals using gene-editing and advanced reproductive technologies. One of them, Dallas-based Colossal Biosciences, recently raised $150 million to bring back the woolly mammoth, dodo, and thylacine, a fox-like marsupial that once roamed Tasmania. The dodo bird, native to Mauritius, was hunted to extinction by Dutch sailors in 1662. Colossal launched less than a year-and-a-half ago, and yet is already valued at over $1 billion.",
        "The company, then, is a unicorn building technologies to make unicorns.",
        "Press releases, though, won’t make de-extinction come true. No papers have been published by the company, and resurrecting the Pyrenean Ibex, which ended in failure, was massively simpler in comparison; living cells were already available. True de-extinction is nowhere near possible.",
        "“It’s impossible to bring something back that’s an identical copy to something that used to be alive,” said Beth Shapiro, a Colossal advisor, in an interview for Fast Company. Instead, “we are going to be able to bring back traits and behaviors and characteristics of extinct species that I think we can use to revitalize and reinvigorate existing ecosystems.”",
        "But even that — making hybrid animals, like elephants with mammoth genes — is plagued by technical issues. It is still difficult to make ultra-precise genome edits, for instance, and there are vast gaps in our understanding of genetics and development, especially for elephants and birds.",
        "This essay breaks down de-extinction technologies, step-by-step, to separate facts from fiction.",
        "Subscribe to De Novo",
        "Subscribe to Codon",
        "George Church, a Harvard geneticist, first pondered de-extinction in the mid-2000s. Nicholas Wade, a journalist at The New York Times, was an unlikely source of inspiration. In 2008, as DNA sequencing costs were falling, Church’s lab in Boston was devising a method to make many edits across a cell’s genome. In that same year, scientists uncovered “a large fraction of the mammoth genome” by sequencing DNA isolated “from clumps of mammoth hair.” These three advances, together, made de-extinction — which once seemed impossible — seem somewhat plausible. The ever-charismatic Church even put a price tag on bringing back the mammoth: $10 million.",
        "“This is something that could work,” he told Wade, the Times reporter, “though it will be tedious and expensive.” The estimated budget was far too small, of course, and the timelines were way off. But here, finally, was a spark toward a blue-sky, scientific aim.",
        "Journalists have written about mammoth de-extinction every single year since 2008. And, although Church is the face of the mammoth project, de-extinction was, until recently, the least funded of all his group’s efforts. Scientists in Melbourne have been working to resurrect the thylacine for many years, too. They’ve already sequenced the genome from a museum specimen that was preserved in alcohol for 110 years. A nonprofit, called Revive & Restore, also aims to de-extinct the passenger pigeon, which once numbered five billion but crashed to zero within a 40-year span. Martha, the last of her species, died in the Cincinnati Zoo in September 1914.",
        "Each of these projects — the mammoth, dodo, pigeon, and thylacine — has the same problem: True de-extinction is not going to happen. To understand why, let’s break down each step in the woolly mammoth project and look at the technologies required.",
        "Weekly essays, straight to your inbox.",
        "Claim: The first step in de-extinction is to collect biological tissue, or cells, from the extinct organism, and then sequence their DNA. Well-preserved mammoth tissues have been retrieved from melted Siberian permafrost. After sequencing the extinct species, one must also sequence the genome of their closest living relative. For the mammoth, that’s the Asian Elephant. For the thylacine, it’s the dunnart, a mouse-y marsupial in Australia that weighs about 1,000-times less than its extinct relative.",
        "Response: Sequencing is the easiest step. While too much time has passed to recover dinosaur DNA from fossilized amber, the woolly mammoth lived much more recently and so it was possible to isolate DNA from specimens stored in museums (or permafrost). Although the mammoth DNA has degraded somewhat, modern sequencing technologies have enabled the assembly of genome sequences for the mammoth, dodo, and thylacine.",
        "A high-quality mammoth genome was published in the journal Current Biology in 2015, based on DNA harvested from two woolly mammoths that died 4,300 and 44,800 years ago. Beth Shapiro, the Colossal advisor and an evolutionary molecular biologist at the University of California - Santa Cruz, also sequenced the dodo genome last year, though we’re not aware of a published manuscript. The thylacine genome was sequenced by Andrew Pask and colleagues in Melbourne. Surprisingly, Asian elephants were first sequenced several years after mammoths.",
        "Claim: After sequencing the genomes, the next step is to compare them and decide which genes should be modified to turn one organism into another. For the mammoth project, scientists have identified traits that could be added to Asian Elephants to enhance cold resistance, such as “smaller ears, shaggy fur, hemoglobin adapted to cold, and excess fat tissue.” It’s expected that somewhere between 50-100 precise genome edits will be required to make an “Arctic Elephant” — basically an Asian Elephant with some added mammoth DNA.",
        "After selecting traits to modify, the next step is to edit the genome. This is not the most difficult part of de-extinction, but it’s still incredibly challenging. The general plan is to use CRISPR-Cas9 gene editing to “cut and paste” regions of the genome, slowly turning an Asian elephant cell into an elephant-mammoth hybrid. Church says that they will edit both protein-coding and regulatory genes.",
        "Response: Reading DNA is simple; precise editing is not. It is likely impossible to create a woolly mammoth genome in any reasonable timeframe (e.g. 10 years or less) by stitching together big chunks of synthesized DNA. The yeast genome is just 12 million bases in length, for example, and efforts to synthesize it have been ongoing for more than eight years. The (haploid) Asian elephant genome is 3.94 billion bases, or 328 times larger. Tools to assemble chunks of DNA also don’t work well in animal cells, and so entirely new methods would be required to actually build a mammoth genome.",
        "This is why de-extinction scientists are not synthesizing entire, ancient genomes de novo, but rather editing the genomes of living relatives, such as the Asian elephant. The woolly mammoth genome differs from the elephant genome at about 1.4 million sites, and the two animals have roughly 2,000 distinct, protein-coding genes. Colossal Biosciences has obtained Asian elephant cell lines, and their scientists are currently editing them to be more like the mammoth.",
        "Current gene editing technology, of course, cannot edit all these sites at once! State-of-the-art editing technologies can, at most, target a few dozen sites in the genome, with efficiencies at each site ranging from 5% – 80%. “A lot of the edits we have to make are precise,” says Church, “and precision editing is not a healthy field yet.”",
        "Making 50–100 edits to the Asian elephant genome, then, will require multiple rounds of experiments. Researchers also cannot recombine animal chromosomes in cell culture, so each round of editing must be done sequentially, and not in parallel. If each round of editing takes about two weeks, and (optimistically) assuming that 5 edits are made each round, it would take about 8 years to modify just the protein-coding genes, and about 5,000 years to do the rest of the genome.",
        "If all goes to plan, the best possible outcome would be a hairy, cold-tolerant “Arctic elephant;” not a true woolly mammoth. There is also the question of whether the 50 genome changes will actually have the intended outcome. Some traits, like cold resistance, could possibly be tested in cell culture. But it’s impossible to know what the hybrid animal will actually look like until it’s born and grows up. Elephants have a gestation period of at least 18 months, and that’s a long time to wait for uncertain outcomes.",
        "“Some tests will require that elephants be born and walk around in the snow in minus-40 degrees plus,” says Church, while others traits, like hair and cold resistance, could perhaps be tested using “teratomas or possibly in vitro differentiation.”",
        "Claim: After editing the genome of an Asian Elephant cell, the next step is somatic cell nuclear transfer, or SCNT. Colossal’s website explains: “The nucleus from a donated Asian elephant egg is removed, and the hybrid nucleus, which is the Asian elephant nucleus edited with the woolly mammoth DNA, is inserted in its place. Electrical pulses are applied to the egg to stimulate fertilization. The egg then begins to divide and grow into an embryo.”",
        "SCNT has been used to make cloned cows, pigs, horses, cats, dogs, monkeys, and sheep. The technique has never been tested on elephant cells.",
        "Response: In vitro fertilization, or IVF, is the simplest reproductive technology. It works by combining sperm and eggs in a test tube to make a fertilized embryo. And yet, despite its simplicity, IVF has never been done with elephants.",
        "Why? Because it’s difficult to harvest eggs from massive, endangered animals! The ultrasound devices that are normally used to pinpoint eggs in, say, a human, do not work in an elephant — their ovaries are too deep within their bodies. Fertile, female Asian elephants are also a bit of a rarity; the species numbers just 50,000 in the wild.",
        "Assuming that you had some kind of ‘egg-retrieving elephant farm,’ there’s also no guarantee that one could collect enough eggs for SCNT. You’d first have to perform superovulation, or use hormones to stimulate the ovaries to release more than one mature egg at a time. This works well in humans and mice, but we have no idea whether this would work in elephants, says stem cell expert Sergiy Velychko, which have a hormonal cycle distinct from other mammals.",
        "In the early days of SCNT, the success rate in well-studied animals, like mice, was one live clone from 277 embryo transfers, or about 0.36 percent. The current success rate for SCNT is between 5 and 10% for those same animals. ViaGen, a pet cloning company, charges $50,000 for their services because it is really expensive to create and implant the dozens of SCNT embryos required to achieve a healthy birth.",
        "To make a viable Arctic Elephant, then, one would need to collect dozens (hundreds?) of eggs from an endangered species using technology that does not yet exist. “I think promising to create a woolly mammoth right now is like promising interstellar travel when we can’t even travel to Mars yet,” says Velychko.",
        "SCNT would be even more challenging for the other species, such as the thylacine and dodo, because it has never been done in marsupials or birds. Simply growing marsupial embryos in vitro is highly challenging, according to a 2019 review, because the embryos are extremely fragile and require a shell coat for most of development.",
        "For the dodo de-extinction project, Colossal plans to edit primordial germ cells (or PGCs, which are early precursors of eggs and sperm) and transplant them into a recipient embryo. There is some precedent for producing sperm from gene-edited PGCs in chickens and quails, so it’s not a crazy idea. Still, developing PGC culture conditions for a new species is not trivial. PGCs are unable to form sperm if their growth conditions are not exactly right. Embryo culture and PGC transplantation are also challenging and, since sperm would be produced instead of an embryo, multiple rounds of breeding would be required to generate an animal with the desired genome.",
        "Claim: After SCNT, grow an embryo with the elephant-mammoth hybrid genome, and then implant it into a surrogate African (not Asian) elephant. The gestation period, for these animals, is between 18 and 22 months. A newborn would “be a hybrid with genetic traits from the extinct Woolly Mammoth and the Asian Elephant, its living relative.”",
        "Response: We’ve already described the absurd difficulties in getting Asian elephant eggs. But that’s not the biggest problem, according to Church: If the success rate of SCNT for pigs is about 10 percent, you would need “8 shots on goal” to make one pregnancy, he says. But pigs have a gestation period of just 4 months, and elephants carry just one embryo at a time and have a gestation period that is five-times longer!",
        "Assuming an initial SCNT success rate of 1 percent, one would have to implant dozens of fertile Asian elephants to get just one viable birth. “This is not something that you can just throw money at,” says Church, “because there’s a limited number of fertile Asian elephants in the world. They’re an endangered species.”",
        "Perhaps that’s why de-extinction scientists plan to implant embryos in African, rather than Asian, elephants. There are roughly eight times more African than Asian elephants in the wild, and so it will be easier to find surrogates. But African and Asian elephants are more distant relatives than humans and chimps, and so there’s no guarantee that an edited Asian Elephant embryo, implanted into an African Elephant, would even survive.",
        "Church and other scientists are working on an alternative solution: An artificial womb that could nourish and grow the embryo during its development period, thus taking the onus away from endangered elephants. “Artificial wombs are even higher risk in a certain sense,” says Church, “but at least you can throw money at it.” There’s just one problem: “Nobody has ever gotten any ex vivo tissue to survive for more than a week outside the body, and we need to do it for 22 months.”",
        "An artificial womb doesn’t yet exist for mice, and we’ve been studying them — with hundreds of billions of dollars in funding — for more than 100 years. The most advanced technology, to date, can grow non-implanted mouse embryos for the first 9.5 days of development in little flasks. Other work has focused on the end of development. Modern artificial wombs can help save human babies that are born up to 20 weeks prematurely.",
        "The problem is that these devices are not “designed to dovetail,” says Church. Nobody has made an artificial womb that can do both early and late development. “You need an umbilical cord for a few weeks of gestation,” he says. “Without a cord, you’re pumping precious stem cells into the media…There are all kinds of cells that circulate in fetal blood, which is fine if you have a tight circuit through the placenta, but not fine if working with a giant vat.”",
        "Perhaps it will be simpler to make an artificial womb for the thylacine, because these extinct marsupials spend just 12 days in the uterus during development, and then receive their nutrients through milk. But Church says the thylacine project “is distracting” and uses “probably less than 5 percent of our resources.”",
        "De-extinction groups often talk about how they are BRINGING BACK THE MAMMOTH! OR THE DODO! OR THE THYLACINE! When, in reality, they are trying to make elephant, pigeon, and dunnart hybrids.",
        "Of all these de-extinction projects, the mammoth is the most likely to succeed. Asian elephants and woolly mammoths are closely related. Projects to de-extinct the thylacine and dodo are less likely because of poorly-developed basic science and challenges in collecting unfertilized eggs.",
        "If scientists make a mammoth-elephant hybrid, they will be released into game reserves in Africa and America. They would have hundreds of square kilometers of space, says Church, and would be strategically placed on carbon-rich, endangered soil “where methane could be released any day now.” The animals would eat plants to keep the soil “cold and grassy,” thus protecting the methane reserves.",
        "Even if de-extinction never happens, the money hasn’t necessarily gone to waste. With $150 million on hand, Colossal is developing more precise gene-editing tools, crafting artificial wombs that could one day increase the survival rate of premature infants, and studying endangered species that have long been neglected. Elephants have strong cancer resistance, can live far longer than most mammals, and don’t experience neurodegeneration — we’ll learn a lot by studying them!",
        "For the other technologies — like artificial wombs and gene-editing — the commercialization strategy seems to be to get approval to use them, first, in animals. Veterinary products are sometimes approved five-times faster than human products, says Church, and so reproductive technologies will first be used on mice, and then elephants, and then people. Mammoth de-extinction, in a sense, is a flagship project that unites many technologies into a single vision. “It’s a very charismatic project, it has bipartisan support, and it has indigenous people support,” says Church. “There’s something magical about it.”",
        "Although we’re critical of the technology and timelines behind de-extinction (it’s a bit like Musk’s promises of full self-driving Teslas), we’re not skeptical of the conservation aims. Critics say that Colossal’s money would be better spent in protecting existing species, rather than de-extinct animals that have been dead for thousands of years. Maybe that’s true, but it’s extremely unlikely that this $150M would have gone to conservation otherwise! If rich people want to spend their money on de-extinction, and bolster reproductive technologies in the meantime, then we say “let ‘em.”",
        "Ben Lamm, Colossal’s CEO, has also said that the company will make all patents freely available to conservation groups. Church says the company will publish all findings in scientific journals. (Although Church hasn’t published anything specific to elephants, his laboratory has pioneered tools to make multiple edits across the genome, reprogram tissues and gametes, and has spun out a company, called eGenesis, that made pigs with 42 genome edits.)",
        "Regardless of whether you’d put your money on de-extinction or not, these projects will not fail due to a lack of money or talent. The cause, at least, is worthy. And if there’s anyone on Earth who can prove us wrong, it’s George Church.",
        "Thank you for reading. If you have questions or feedback, please leave a comment. This essay was co-authored with De Novo, an excellent synthetic biology newsletter. Please subscribe!",
        "Disclosure: Metacelsus’ research on ovarian organoids was partially funded by Colossal Biosciences. Colossal was not involved in writing or editing this article.",
        "Leave a comment",
        "No posts",
        "Ready for more?"
      ]
    },
    {
      "title": "NIO reveals aggressive plan to add 1,000 swap stations in 2023",
      "page": [
        "Home » NIO",
        "",
        "Starting in June, NIO will basically maintain a construction rate of 120-150 battery swap stations per month.",
        "",
        "(Image credit: NIO)",
        "NIO (NYSE: NIO) unveiled new, aggressive plans to build battery swap stations this year and announced a timeline for the launch of the third generation of the facility.",
        "The company announced today that it plans to add 1,000 battery swap stations in 2023, 2.5 times the 400 it previously announced.",
        "NIO's plan to add 400 battery swap stations in 2023, announced at NIO Day late last year, is far from sufficient, said William Li, the company's founder, chairman and CEO.",
        "NIO will further accelerate the deployment of battery swap stations to allow more customers to experience battery swap services that are more convenient than refueling, he said.",
        "\"We have set a new goal of adding 1,000 battery swap stations in 2023, for a cumulative total of more than 2,300 stations by the end of 2023,\" Li said in an article posted on the NIO App.",
        "Of the 1,000 new stations, about 400 will be located in highway service areas or near highway entrances and exits. The other 600 sites will be deployed in urban areas.",
        "NIO has not added any battery swap stations in the past month, and the number of such facilities in China stood at 1,313 as of January 22, according to data monitored by CnEVPost.",
        "NIO will also increase its efforts to build the facility in third- and fourth-tier cities and counties that have a certain number of users but no battery swap stations, Li said.",
        "NIO's team is already working on all aspects of preparation for this new goal, he said.",
        "Production of NIO's third-generation battery swap stations is now well underway, with mass production expected to begin in April and deployment of battery swap stations to accelerate in May, according to Li.",
        "Starting in June, NIO will basically maintain a construction rate of 120-150 battery swap stations per month, he said.",
        "NIO officially unveiled its third-generation battery swap station at the NIO Day 2022 event on December 24, capable of storing up to 21 battery packs, up from 13 in its previous generation and 5 in the first generation of the facility.",
        "The third-generation battery swap station increases the daily service capacity of a single station to 408 times, a 30 percent increase over the second generation.",
        "Notably, NIO also equipped two LiDARs and two Nvidia Orin chips on the third-generation battery swap station, for a total computing power of 508 TOPS.",
        "To improve the efficiency of site selection, NIO will launch the battery swap station wish list feature on February 28.",
        "\"Everyone is welcome to participate in recommending areas for battery swap stations, and we look forward to the help of those who have resources such as sites and power capacity,\" Li said.",
        "Li said he, along with NIO co-founder and president Qin Lihong and several other executives, met with local owners in several Chinese cities in January, and the topic that came up most often was the construction of battery swap stations.",
        "Here are Li's personal experiences as mentioned by him:",
        "From January 14 to 15, I drove to visit users in Harbin, Changchun, Shenyang and Dalian.",
        "In Northeast China, where the temperature was below -20 degrees Celsius, I used the battery swap service along the highways the whole time and had a great experience, completely different from when I first visited Northeast China users in late 2018.",
        "On the other hand, I realized in the process of talking to people that the northeast region still needs to get several times more battery swap stations to truly allow users to travel worry-free.",
        "During the Chinese New Year holiday, NIO's unlimited free battery swap service at highway service areas was well received, setting a record of 63,000 swaps in a single day.",
        "While this was convenient for everyone's holiday travel, it also exposed the need to improve the battery swap service capacity on popular highway routes during the holiday season.",
        "On the first working day after the Spring Festival holiday, I went to Wenzhou and Taizhou. These two cities already have a lot of battery swap stations, but there are still many blank areas. Cangnan county, for example, already has nearly 150 users, but not a single battery swap station.",
        "Li said these experiences made him feel that the previously announced plan to add 400 battery swap stations this year was far from enough and that the company needed to accelerate the deployment of the facility.",
        "The move is expected to increase the appeal of NIO vehicles and thus boost sales at a time when the Chinese auto industry is generally under pressure.",
        "In a group interview with local media on the second day of NIO Day 2022, Li said on December 25 that the Chinese NEV market will be under pressure in the first half of 2023 on both the supply and demand sides, but the pressure on demand will be a bit greater.",
        "However, Li mentioned at the time that if looking on the bright side, the market could gradually recover in the second quarter or in May.",
        "NIO delivered 8,506 vehicles in January, down 46.22 percent from 15,815 in December and down 11.87 percent from 9,652 in the same month last year. This was due in large part to the seasonal impact of the Chinese New Year holiday.",
        "Join us on Telegram",
        "NIO delivered a total of 122,486 vehicles in 2022, an increase of 34 percent year-on-year."
      ]
    },
    {
      "title": "Bug identified after Alaska Airlines planes bump runway while taking off",
      "page": [
        "A Boeing 737-900, Alaska Airlines jet, flies over Des Moines, Washington, as it comes in for a landing at Seattle-Tacoma International Airport Monday, Aug. 24, 2020. (Ellen M. Banner/The Seattle Times/TNS)",
        "On the morning of Jan. 26, as two Alaska Airlines flights from Seattle to Hawaii lifted off six minutes apart, the pilots each felt a slight bump and the flight attendants at the back of the cabin heard a scraping noise.",
        "As the noses of both Boeing 737s lifted skyward on takeoff, their tails had scraped the runway.",
        "Both planes circled back immediately and landed again at Seattle-Tacoma International Airport. Tail strikes happen occasionally in aviation, but two in quick succession was not normal.",
        "Bret Peyton, Alaska’s on-duty director of operations, immediately ordered no more planes were to take off across the airline’s network. All Alaska flights not already airborne were stopped nationwide.",
        "“At that point, two in a row like that, that’s when I said, ‘No, we’re done,’” said Peyton. “That’s when I stopped things.”",
        "For Peyton, who was an Air Force lieutenant colonel, that decisive call was a heart-racing moment. But few travelers, apart from the passengers aboard the two Hawaii flights who had to wait several hours to continue their journey, would have noticed anything amiss.",
        "The stoppage lasted just 22 minutes.",
        "Alaska’s flight operations staff quickly realized that a software bug was sending bad takeoff weight data to its crews. They immediately figured out a workaround and normal flying resumed.",
        "Last Tuesday, following a series of recent safety incidents and dangerous close calls around the U.S. aviation system, acting Federal Aviation Administration Administrator Billy Nolen wrote a “call to action” letter warning that the U.S. system’s stellar safety record mustn’t be taken for granted.",
        "The Jan. 26 tail strikes at Sea-Tac were not close calls; the passengers on those Hawaii flights were never in danger. Still, the mishaps point to the need for more vigilance by pilots in checking automated data.",
        "“We rely on that data to safely operate the plane,” said an Alaska Airlines captain who has flown 737s to Hawaii and asked for anonymity because he spoke without company permission.",
        "Yet the incidents also offer some reassurance, in the way Alaska promptly shut down service until it understood the cause and fixed it.",
        "“Alaska dealt with it very quickly and appropriately,” the captain said.",
        "The first incident occurred when Alaska flight 801, a Boeing Max 9 headed to Hawaii’s Big Island, lifted off at 8:48 a.m.",
        "At 8:54 a.m., Alaska flight 887 followed, this time a Boeing 737-900ER headed to Honolulu.",
        "To determine the thrust and speed settings for takeoff, Alaska’s pilots and others use a performance calculation tool supplied by a Swedish company called DynamicSource.",
        "It delivers a message to the cockpit with crucial weight and balance data, including how many people are on board, the jet’s empty and gross weight and the position of its center of gravity.",
        "In a cockpit check before takeoff, this data is entered into the flight computer to determine how much thrust the engines will provide and at what speed the jet will be ready to lift off.",
        "A pilot at American Airlines, which uses the same DynamicSource performance data tool, and who also spoke anonymously because he didn’t have authorization, explained that the computer then calculates just the right amount of engine thrust so the pilots don’t use more than necessary.",
        "“The goal is to lower the power used on takeoff,” he said. “That reduces engine wear and saves money” on fuel and maintenance.",
        "Flights to Hawaii are typically full, with lots of baggage and a full load of fuel for the trip across the ocean. The planes are heavy.",
        "That morning, a software bug in an update to the DynamicSource tool caused it to provide seriously undervalued weights for the airplanes.",
        "The Alaska 737 captain said the data was on the order of 20,000 to 30,000 pounds light. With the total weight of those jets at 150,000 to 170,000 pounds, the error was enough to skew the engine thrust and speed settings.",
        "Both planes headed down the runway with less power and at lower speed than they should have. And with the jets judged lighter than they actually were, the pilots rotated too early.",
        "Both the Max 9 and 737-900ER have long passenger cabins, which makes them more vulnerable to a tail strike when the nose comes up too soon.",
        "Alaska says it operated 727 flights that day, of which just 30 took off with incorrect takeoff data. Only those two Hawaii-bound aircraft had tail strikes.",
        "Subsequently, Alaska flight operations staff and safety experts with the pilots union, the Air Line Pilots Association, independently analyzed the data from the two flights to evaluate the safety risk. Each determined that both aircraft got airborne well within safety limits despite the lower thrust.",
        "The data “confirms that the airplane was safely airborne with runway remaining and at an altitude by the end of the runway that was well within regulatory safety margins,” said the union’s Alaska unit chair, Will McQuillen, in a statement.",
        "The fuselage under the tail of a jet has a bump on it called a “tail skid” that is designed to crumple and absorb impact. Still, maintenance technicians are required to inspect the damage, which is why the two planes immediately returned to the airport.",
        "Both airplanes were cleared to fly again later that day. Indeed, the Max 9 was cleared in time to take off at 12:30 p.m. to fly the passengers who had deboarded that morning to Kailua-Kona.",
        "The bug was identified quickly in part because some flight crews noticed the weights didn’t seem right and asked for manual validation of the figures.",
        "During preflight check, when the DynamicSource message comes in, the first officer reads each data point aloud and the captain verbally verifies each one.",
        "Soon after the tail strikes that day, Alaska issued a “safety flash” message to all its pilots that noted that when entering the DynamicSource information, they should “take a second and conduct a sanity check of the data.”",
        "In other words, they should pause if the weights seem off.",
        "The Alaska captain said that, as for many things in aviation, pilots routinely use an acronym when they do the pre-takeoff “sanity check”: TLAR, which means “That Looks About Right.”",
        "If the automatically loaded data strikes either pilot as not right, they can make a manual request for takeoff data from the airline operations center. “But 99.8% of the time, the data is accurate,” he said.",
        "Alaska’s Peyton said “several crews noticed the error and notified dispatch.”",
        "The pilot at American Airlines said “requesting manual data is not standard” and that if there’s a glitch, naturally some pilot somewhere is going to miss it.",
        "“Not everyone gets eight hours sleep the night before. Someone is going through a divorce. Someone is not so sharp that morning,” he said. “The sanity check isn’t perfect every day of the week.”",
        "After Peyton called the stoppage that morning, the discrepancy in the DynamicSource weight data became clear.",
        "“This discovery was happening in a very small time period right around that 8:45 time frame,” he said. “It all happened very, very rapidly, as did the shutting down of the airline.”",
        "A quick interim fix proved easy: When operations staff turned off the automatic uplink of the data to the aircraft and switched to manual requests “we didn’t have the bug anymore.”",
        "Peyton said his team also checked the integrity of the calculation itself before lifting the stoppage. All that was accomplished in 20 minutes.",
        "The software code was permanently repaired about five hours later.",
        "Peyton added that even though the update to the DynamicSource software had been tested over an extended period, the bug was missed because it only presented when many aircraft at the same time were using the system.",
        "Subsequently, a test of the software under high demand was developed.",
        "Peyton said his first call that day was to the airline’s chief dispatcher to halt operations. His second was to the FAA to let the agency know what was happening.",
        "Acting FAA Administrator Nolen’s Tuesday warning letter was spurred by a raft of recent airline incidents that barely escaped becoming fatal accidents.",
        "In addition to several runway incursions, the sharp dive toward the ocean of a 777 flying out of Hawaii in December and the close call this month between a FedEx 767 coming in to land and a Southwest Airlines 737 taking off from the same runway in Austin, Texas, raised particular alarm.",
        "It has been 14 years since the last fatal U.S. airliner crash. There is concern that less-experienced pilots and air traffic controllers hired during the post-pandemic labor shortage could diminish safety margins.",
        "Nolen said he’s ordered a safety review “to examine the U.S. aerospace system’s structure, culture, processes, systems and integration of safety efforts.”",
        "And he’s called a summit in March to determine “what additional actions the aviation community needs to take to maintain our safety record.”",
        "FAA spokesman Ian Gregor said Thursday the agency is looking into the Alaska incidents. He confirmed the airline’s account that the planes took off well within safety parameters.",
        "Peyton said the airline’s leadership has been very supportive of his decision to pull the plug that January morning.",
        "“We needed to stop the operation. It was very clear to me within a very short period of time, and I’m glad we did,” he said.",
        "“I didn’t walk into work that morning, thinking I would stop a major airline,” Peyton added. “What it says to me is that I’m empowered to do so and so is every employee here. It’s part of our safety culture.”",
        "1",
        "2",
        "3",
        "4",
        "5",
        "© 2022 Anchorage Daily News. All rights reserved."
      ]
    },
    {
      "title": "Dark energy from supermassive black holes? Physicists spar over radical idea",
      "page": [
        "Earlier this week, a study made headlines claiming that the mysterious “dark energy” cosmologists believe is accelerating the expansion of the universe could arise from supermassive black holes at the hearts of galaxies. If true, the connection would link two of the most mind-bending concepts in physics—black holes and dark energy—and suggest the source of the latter has been under theorists’ noses for decades. However, some leading theorists are deeply skeptical of the idea.",
        "“What they are proposing makes no sense to me,” says Robert Wald, a theoretical physicist at the University of Chicago who specializes in Albert Einstein’s general theory of relativity, the standard understanding of gravity. Other theorists were more receptive to the radical claim—even if it ends up being wrong. “I’m personally excited about it,” says astrophysicist Niayesh Afshordi of the Perimeter Institute for Theoretical Physics.",
        "At first blush, black holes and dark energy seem to have nothing to do with each other. According to general relativity, a black hole is a pure gravitational field so strong that its own energy sustains its existence. Such peculiar beasts are thought to emerge when massive stars collapse to an infinitesimal point, leaving just their gravitational fields behind. Supermassive black holes having millions or billions of times the mass of our Sun are believed to lurk in the hearts of galaxies.",
        "In contrast, dark energy is a mysterious phenomenon that literally stretches space and is accelerating the expansion of the universe. Theorists think dark energy could represent some new sort of field in space, a bit like an electric field, or it could be a fundamental property of empty space itself.",
        "So how could the two be connected? Quantum mechanics suggests the vacuum of empty space should contain a type of energy known as vacuum energy. This is thought to be spread throughout the universe and exert a force opposing gravity, making it a prime candidate for the identity of dark energy. In 1966, Soviet physicist Erast Gliner showed Einstein’s equations could also produce objects that to outside observers look and behave exactly like a black hole—yet are, in fact, giant balls of vacuum energy.",
        "If such objects were to exist, it would mean that rather than being uniformly spread throughout space, dark energy is actually confined to specific locations: the interiors of black holes. Even bound in these particular knots, dark energy would still exert its space-stretching effect on the universe.",
        "One consequence of this idea—that supermassive black holes are the source of dark energy—is that they would be linked to the constant stretching of space and their mass should change as the universe expands, says astrophysicist Duncan Farrah of the University of Hawaii, Manoa. “If the volume of the universe doubles, so does the mass of the black hole,” he adds.",
        "To test this possibility, Farrah and his colleagues studied elliptical galaxies, which contain black holes with millions or billions of times the Sun’s mass in their centers. They focused on galaxies with little gas or dust floating around between their stars, which would provide a reservoir of material that the central black hole could feed on. Such black holes wouldn’t be expected to change much over the course of cosmic history.",
        "Yet by analyzing the properties of ellipticals over roughly 9 billion years, the team saw that black holes in the early universe were much smaller relative to their host galaxy than those in the modern universe, indicating they had grown by a factor of seven to 10 times in mass, Farrah and colleagues reported this month in The Astrophysical Journal.",
        "The fact that the black holes swelled but the galaxies didn’t is the key, Farrah says. If the black holes had grown by feeding on nearby gas and dust, that material should have also generated many new stars in parts of the galaxy far from the black hole. But if black holes were made from dark energy, they would react to changes in the universe’s size in exactly the way that researchers observed in the centers of elliptical galaxies, Farrah’s team additionally reported this week in The Astrophysical Journal Letters.",
        "Wald is unpersuaded. He questions how an orb of pure dark energy could be stable. He also says the numbers don’t seem to add up: Dark energy is known to make up 70% of the mass-energy of the universe, whereas black holes are a mere fraction of the ordinary matter, which constitutes less than 5% of the universe. “I don’t see how it is in any way conceivable that such objects could be relevant to the observed dark energy,” he says.",
        "Others are taking a wait-and-see attitude. “At the moment, this is an interesting possibility,” says cosmologist Geraint Lewis of the University of Sydney, but “there would have to be a lot more evidence on the table if this is even a remotely plausible source of dark energy.”",
        "Afshordi agrees. If black holes and dark energy are linked in this way, it would likely have other visible consequences in the universe, he says. At the moment, though, he’s unsure what those would be. Determining exactly how galaxies evolve over time is a tricky business, he adds, and there could be other mechanisms to grow black holes that the team hasn’t considered.",
        "Nevertheless, Afshordi is supportive of efforts to rethink fundamental assumptions about the universe. “Most new theoretical ideas are dismissed by skepticism,” he says. “But if we dismiss all the new ideas then there won’t be anything left.”",
        "Don’t yet have access? Subscribe to News from Science for full access to breaking news and analysis on research and science policy.",
        "Help News from Science publish trustworthy, high-impact stories about research and the people who shape it. Please make a tax-deductible gift today.",
        "",
        "If we've learned anything from the COVID-19 pandemic, it's that we cannot wait for a crisis to respond. Science and AAAS are working tirelessly to provide credible, evidence-based information on the latest scientific research and policy, with extensive free coverage of the pandemic. Your tax-deductible contribution plays a critical role in sustaining this effort.",
        "© 2023 American Association for the Advancement of Science. All rights reserved. AAAS is a partner of HINARI, AGORA, OARE, CHORUS, CLOCKSS, CrossRef and COUNTER."
      ]
    },
    {
      "title": "Amazon has approval from FTC to acquire One Medical primary-care clinics",
      "page": [
        "This copy is for your personal, non-commercial use only. Distribution and use of this material are governed byour Subscriber Agreement and by copyright law. For non-personal use or to order multiple copies, please contactDow Jones Reprints at 1-800-843-0008 or visit www.djreprints.com.",
        "https://www.wsj.com/articles/ftc-wont-block-amazon-purchase-of-one-medical-network-of-health-clinics-c635495e",
        "Listen to article",
        "(2 minutes)",
        "WASHINGTON—Amazon.com Inc. will be able to .css-1h1us5y-StyledLink{color:var(--interactive-text-color);-webkit-text-decoration:underline;text-decoration:underline;}.css-1h1us5y-StyledLink:hover{-webkit-text-decoration:none;text-decoration:none;}close its purchase of 1Life Healthcare Inc., the operator of the One Medical line of primary-care clinics, without a legal challenge by antitrust enforcers.",
        "The Federal Trade Commission won’t sue in time to block the $3.9 billion deal, including debt, but will continue its investigation of the merger, an agency spokesman said. The decision clears a path for Amazon to substantially expand its healthcare offerings and operate physical medical clinics. Amazon has invested in the healthcare space for years, including with an online pharmacy and other health ventures.",
        "4 hours ago",
        "3 hours ago",
        "20 mins ago",
        "4 hours ago",
        "3 hours ago",
        "20 mins ago",
        "2 hours ago",
        "24 mins ago",
        "54 mins ago",
        "1 hour ago",
        "4 hours ago",
        "12 hours ago",
        "Continue reading your article witha WSJ membership",
        "Already a member? .css-16c7pto-SnippetSignInLink{-webkit-text-decoration:underline;text-decoration:underline;cursor:pointer;}Sign In",
        "WSJ Membership",
        "Customer Service",
        "Tools & Features",
        "Ads",
        "More",
        "Dow Jones Products",
        "WSJ Membership",
        "Customer Service",
        "Tools & Features",
        "Ads",
        "More",
        "Copyright ©2023 Dow Jones & Company, Inc. All Rights Reserved",
        "This copy is for your personal, non-commercial use only. Distribution and use of this material are governed byour Subscriber Agreement and by copyright law. For non-personal use or to order multiple copies, please contactDow Jones Reprints at 1-800-843-0008 or visit www.djreprints.com."
      ]
    },
    {
      "title": "Experts discover how zebra stripes work to thwart horsefly attacks",
      "page": [
        "Click here to sign in with                                                                                                                                    or",
        "Forget Password?",
        "Learn more",
        "share this!",
        "46",
        "65",
        "Share",
        "Email",
        "February 20, 2023",
        "by \t\t\t\t\t\t\t\t\t\t University of Bristol",
        "Researchers at the University of Bristol have found why zebra fur is thinly striped and sharply outlined.",
        "",
        "Their findings, published Feb. 17 in the Journal of Experimental Biology, reveal that stark black-white distinctions and small dark patches are particularly effective in thwarting horsefly attack. These characteristics specifically eliminate the outline of large monochrome dark patches that are attractive to horseflies at close distances.",
        "The team theorizes that the thin back stripes serve to minimize the size of local features on a zebra that are appealing to the biting flies.",
        "The research was led by Professor Tim Caro and Dr. Martin How, both from the University of Bristol's School of Biological Sciences.",
        "Prof. Caro explained, \"We knew that horseflies are averse to landing on striped objects—a number of studies have now shown this, but it is not clear which aspects of stripes they find aversive.",
        "\"Is it the thinness of the stripes? The contrast of black and white? The polarized signal that can be given off objects? So we set out to explore these issues using different patterned cloths draped over horses and filmed incoming horseflies.\"",
        "The team found that tabanid horseflies are attracted to large dark objects in their environment but less to dark broken patterns. All-gray coats were associated with by far the most landings, followed by coats with large black triangles placed in different positions, then small checkerboard patterns in no particular order. In another experiment, they found contrasting stripes attracted few flies whereas more homogeneous stripes were more attractive.",
        "Professor Caro added, \"This suggests that any hoofed animal that reduces its overall dark outline against the sky will benefit in terms of reduced ectoparasite attack.\"",
        "The team found little evidence for other issues that they tested, namely polarization or optical illusions confusing accurate landings such as the so-called \"wagon-wheel effect\" or \"the barber-pole effect.\"",
        "Now the team want to determine why natural selection has driven striping in equids—the horse family—but not other hoofed animals.",
        "Professor Caro added, \"We know that zebra pelage—fur—is short, enabling horsefly mouthparts to reach the skin and blood capillaries below, which may make them particularly susceptible to fly annoyance, but more important, perhaps, is that the diseases that they carry are fatal to the horse family but less so to ungulates. This needs investigation.\"",
        "More information:\t\t\t\t\t\t\t\t\t\t\t\tTim Caro et al, Why don't horseflies land on zebras?, Journal of Experimental Biology (2023).  DOI: 10.1242/jeb.244778",
        "Journal information:\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tJournal of Experimental Biology",
        "Provided by\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tUniversity of Bristol",
        "Explore further",
        "Facebook",
        "Twitter",
        "Email",
        "Feedback to editors",
        "22 hours ago",
        "0",
        "22 hours ago",
        "0",
        "Feb 21, 2023",
        "0",
        "Feb 20, 2023",
        "0",
        "Feb 20, 2023",
        "0",
        "41 minutes ago",
        "47 minutes ago",
        "58 minutes ago",
        "1 hour ago",
        "1 hour ago",
        "1 hour ago",
        "1 hour ago",
        "1 hour ago",
        "2 hours ago",
        "4 hours ago",
        "Aug 18, 2020",
        "Feb 20, 2019",
        "Jan 16, 2019",
        "Dec 13, 2016",
        "Jul 6, 2018",
        "Nov 30, 2017",
        "41 minutes ago",
        "6 hours ago",
        "6 hours ago",
        "19 hours ago",
        "20 hours ago",
        "22 hours ago",
        "Use this form if you have come across a typo, inaccuracy or would like to send an edit request for the content on this page.\t\t\t\t\t\t\t\t\t\t\tFor general inquiries, please use our  contact form.\t\t\t\t\t\t\t\t\t\t\tFor general feedback, use the public comments section below (please adhere to guidelines).",
        "Please select the most appropriate category to facilitate processing of your request",
        "Thank you for taking time to provide your feedback to the editors.",
        "Your feedback is important to us. However, we do not guarantee individual replies due to the high volume of messages.",
        "Your email address is used only to let the recipient know who sent the email. Neither your address nor the recipient's address will be used for any other purpose.\t\t\t\t\t\t\t\t\t\t\tThe information you enter will appear in your e-mail message and is not retained by Phys.org in any form.",
        "",
        "Get weekly and/or daily updates delivered to your inbox.\t\t\t\t\tYou can unsubscribe at any time and we'll never share your details to third parties.",
        "More information\t\t\t\t\tPrivacy policy",
        "Medical research advances and health news",
        "The latest engineering, electronics and technology advances",
        "The most comprehensive sci-tech news coverage on the web",
        "This site uses cookies to assist with navigation, analyse your use of our services, collect data for ads personalisation and provide content from third parties.                    By using our site, you acknowledge that you have read and understand our Privacy Policy                    and Terms of Use."
      ]
    },
    {
      "title": "AMD CEO: The Next Challenge Is Energy Efficiency",
      "page": [
        "IEEE websites place cookies on your device to give you the best user experience. By using our websites, you agree to the placement of these cookies. To learn more, read our Privacy Policy.",
        "A 500-megawatt supercomputer is “probably too much”",
        "AMD CEO, Lisa Su",
        "“Over the next decade, we must think of energy efficiency as the most important challenge,” Lisa Su, CEO of AMD told engineers at the 2023 IEEE International Solid State Circuits Conference (ISSCC) in San Francisco.",
        "Despite a slow-down of Moore’s Law, other factors have pushed mainstream computing capabilities to double about every two-and-a-half years. For supercomputers, the doubling is happening even faster. However, Su points out, the energy efficiency of computing has not been keeping pace, pointing to future supercomputers requiring as much as 500 megawatts a decade from now.",
        "“That’s probably too much,” she deadpanned. “It’s on the order of what a nuclear power plant would be.” Nobody really knows how to achieve the next thousand-fold increase in supercomputer capability—zettascale supercomputers, Su said. But it will surely require improvements in system-level efficiency, meaning not just energy efficient computing on chips, but also efficient interchip communication and low-power memory access.",
        "On the compute side, Su pointed to improvements in processor architecture, advanced packaging, and—despite the well-known slow-down—better silicon technology. That combination could more than double the industry’s historic performance-per-watt-increase rate.As an example, Su compared the MI250X  accelerator GPU, which is behind four of the five most efficient supercomputers, to its predecessor the MI100. The newer chip offers 4.2 times the performance with 2.2 times the efficiency. Of that, chiplet design and integration accounted for nearly half the performance increase and about 30 percent of the efficiency gain.",
        "“Probably the largest lever we’ve had recently has been the use of advanced packaging and chiplets,” she said. “It allows us to bring the components of compute together much more closely than ever before.” 3D interconnects in chiplet-based systems can sling about 50 times the bits per joule of energy as can the copper connections on the motherboard, according to AMD. Using a technology called 3D V-cache, AMD compute chiplets now can have additional SRAM stacked atop them to expand the size of their cache.",
        "",
        "",
        "Another energy-saving factor Su pointed to was what’s called domain specific computation, which Su describes as using “the right math for the right operations.” Because 8-bit floating point operations are about 30-times as energy efficient as 64-bit ones, makers of GPUs and other AI accelerator chips have been seeking ways to use such lower precision operations wherever they can. Domain-specific architecture accounted for about 40 percent of the MI250X’s performance and efficiency improvements.",
        "AMD is hoping to get another 8-fold performance improvement and 5-fold efficiency gain from its next generation, the MI300.",
        "But processor innovation in itself won’t be enough to get to zettascale supercomputing, Su said. Because AI performance and efficiency improvements are outstripping gains in the kind of high-precision math that’s dominated supercomputer physics work, the field should turn to hybrid algorithms that can leverage AI’s efficiency. For example, AI algorithms could get close to a solution quickly and efficiently, and then the gap between the AI answer and the true solution can be filled by high-precision computing.",
        "Samuel K. Moore is the senior editor at IEEE Spectrum in charge of semiconductors coverage. An IEEE member, he has a bachelor's degree in biomedical engineering from Brown University and a master's degree in journalism from New York University.",
        "The Condor processor is just one quantum-computing advance slated for 2023",
        "A researcher at IBM’s Thomas J. Watson Research Center examines some of the quantum hardware being constructed there.",
        "IBM’s Condor, the world’s first universal quantum computer with more than 1,000 qubits, is set to debut in 2023. The year is also expected to see IBM launch Heron, the first of a new flock of modular quantum processors that the company says may help it produce quantum computers with more than 4,000 qubits by 2025.",
        "This article is part of our special report \t\tTop Tech 2023.",
        "While quantum computers can, in theory, quickly find answers to problems that classical computers would take eons to solve, today’s quantum hardware is still short on qubits, limiting its usefulness. Entanglement and other quantum states necessary for quantum computation are infamously fragile, being susceptible to heat and other disturbances, which makes scaling up the number of qubits a huge technical challenge.",
        "Nevertheless, IBM has steadily increased its qubit numbers. In 2016, it \tput the first quantum computer in the cloud anyone to experiment with—a device with 5 qubits, each a superconducting circuit cooled to near absolute zero. In 2019, the company created the 27-qubit Falcon; in 2020, the 65-qubit Hummingbird; in 2021, the 127-qubit Eagle, the first quantum processor with more than 100 qubits; and in 2022, the 433-qubit Osprey.",
        "IBM expects to build quantum computers of increasing complexity over the next few years, starting with those that use the Condor processor or multiple Heron processors in parallel.Carl De Torres/IBM",
        "Other quantum computers have more qubits than does IBM’s 1,121-qubit Condor processor—for instance, D-Wave Systems unveiled a \t5,000-qubit system in 2020. But D-Wave’s computers are specialized machines for solving optimization problems, whereas Condor will be the world’s largest general-purpose quantum processor.",
        "“A thousand qubits really pushes the envelope in terms of what we can really integrate,” says \tJerry Chow, IBM’s director of quantum infrastructure. By separating the wires and other components needed for readout and control onto their own layers, a strategy that began with Eagle, the researchers say they can better protect qubits from disruption and incorporate larger numbers of them. “As we scale upwards, we’re learning design rules like ‘This can go over this; this can’t go over this; this space can be used for this task,’” Chow says.",
        "Other quantum computers with more qubits exist, but Condor will be the world’s largest general-purpose quantum processor.",
        "With only 133 qubits, Heron, the other quantum processor IBM plans for 2023, may seem modest compared with Condor. But IBM says its upgraded architecture and modular design herald a new strategy for developing powerful quantum computers. Whereas Condor uses a fixed-coupling architecture to connect its qubits, Heron will use a tunable-coupling architecture, which adds Josephson junctions between the superconducting loops that carry the qubits. This strategy reduces crosstalk between qubits, boosting processing speed and reducing errors. (Google is already using such an architecture with its 53-qubit \tSycamore processor.)",
        "In addition, Heron processors are designed for real-time classical communication with one another. The classical nature of these links means their qubits cannot entangle across Heron chips for the kind of boosts in computing power for which quantum processors are known. Still, these classical links enable “\tcircuit knitting” techniques in which quantum computers can get assistance from classical computers.",
        "For example, using a technique known as “\tentanglement forging,” IBM researchers found they could simulate quantum systems such as molecules using only half as many qubits as is typically needed. This approach divides a quantum system into two halves, models each half separately on a quantum computer, and then uses classical computing to calculate the entanglement between both halves and knit the models together.",
        "IBM Quantum State of the Union 2022",
        "While these classical links between processors are helpful, IBM intends eventually to replace them. In 2024, the \tcompany aims to launch Crossbill, a 408-qubit processor made from three microchips coupled together by short-range quantum communication links, and Flamingo, a 462-qubit module it plans on uniting by roughly 1-meter-long quantum communication links into a 1,386-qubit system. If these experiments in connectivity succeed, IBM aims to unveil its 1,386-qubit Kookaburra module in 2025, with short- and long-range quantum communication links combining three such modules into a 4,158-qubit system.",
        "IBM’s methodical strategy of “aiming at step-by-step improvements is very reasonable, and it will likely lead to success over the long term,” says Franco Nori, chief scientist at the \tTheoretical Quantum Physics Laboratory at the Riken research institute in Japan.",
        "In 2023, IBM also plans to improve its core software to help developers use quantum and classical computing in unison over the cloud. “We’re laying the groundwork for what a quantum-centric supercomputer looks like,” Chow says. “We don’t see quantum processors as fully integrated but as loosely aggregated.” This kind of framework will grant the flexibility needed to accommodate the constant upgrades that quantum hardware and software will likely experience, he explains.",
        "In 2023, IBM plans to begin prototyping quantum software applications. By 2025, the company expects to introduce such applications in machine learning, optimization problems, the natural sciences, and beyond.",
        "Researchers hope ultimately to use \tquantum error correction to compensate for the mistakes quantum processors are prone to make. These schemes spread quantum data across redundant qubits, requiring multiple physical qubits for each single useful logical qubit. Instead, IBM plans to incorporate error-mitigation schemes into its platform starting in 2024, to prevent these mistakes in the first place. But even if wrangling errors ends up demanding many more qubits, IBM should be in a good position with the likes of its 1,121-qubit Condor.",
        "This article appears in the January 2023 print issue as “IBM’s Quantum Leap .”",
        "Top Tech 2023: A Special Report",
        "Preview exciting technical developments for the coming year.",
        "Can This Company Dominate Green Hydrogen?",
        "Fortescue will need more electricity-generating capacity than France.",
        "An Airship Resurgence",
        "Pathfinder 1 could herald a new era for zeppelins",
        "A New Way to Speed Up Computing",
        "Blue microLEDs bring optical fiber to the processor.",
        "The Personal-Use eVTOL Is (Almost) Here",
        "Opener’s BlackFly is a pulp-fiction fever dream with wings.",
        "Baidu Will Make an Autonomous EV",
        "Its partnership with Geely aims at full self-driving mode.",
        "China Builds New Breeder Reactors",
        "The power plants could also make weapons-grade plutonium.",
        "Economics Drives a Ray-Gun Resurgence",
        "Lasers should be cheap enough to use against drones.",
        "A Cryptocurrency for the Masses or a Universal ID?",
        "What Worldcoin’s killer app will be is not yet clear.",
        "IBM’s Quantum Leap",
        "The company’s Condor chip will boast more than 1,000 qubits.",
        "Arthritis Gets a Jolt",
        "Vagus-nerve stimulation promises to help treat autoimmune disorders.",
        "Smartphones Become Satphones",
        "New satellites can connect directly to your phone.",
        "Exascale Comes to Europe",
        "The E.U.’s first exascale supercomputer will be built in Germany.",
        "The Short List",
        "A dozen more tech milestones to watch for in 2023."
      ]
    },
    {
      "title": "Optimizing Haskell Code for Runtime Verification",
      "page": [
        "In this blog post, we will be exploring, describing, and dissecting the first phase of the collaboration between Runtime Verification and Serokell.",
        "The collaboration involved work on making optimizations to K, a rewrite-based executable semantic framework in which programming languages, type systems, and formal analysis tools can be defined with the help of configurations and rewrite rules.",
        "The blog post will contain:",
        "The discovery phase, conducted by Vladislav Zavialov, involved a two-week-long investigation of the performance of the K framework’s symbolic execution engine, namely: the Kore language.",
        "With the use of the Glasgow Haskell Compiler’s profiling instrumentation, we were able to build the project with profiling support. This can be done by specifying profiling: True in the file cabal.project.",
        "For example:",
        "The resulting executable will be slower than the executable built without the profiling support, because:",
        "The profiling report can be generated by adding the following snippet to the command-line options of the executable:",
        "Here, +RTS and -RTS delimit the flags processed by GHC’s runtime system, and the -p flag tells it to generate a report with a .prof extension.",
        "A cost centre is a program annotation around a given expression. This expression is assigned a cost – the time or space required to evaluate it. The profiling report contains a table of the cost centres, the locations of their definitions (the name of the module and the source code location), and how much time and space they take.",
        "Here’s an example of an entry in such a table:",
        "It means that the function function, defined in the module Module from line 13 column 1 to line 14 column 12, is responsible for 3.8% of the time cost and 1.3% of the allocation cost of the program.",
        "However, recall that by making certain functions into cost centres, their inlining is prevented. In a non-profiled executable they could be optimized away; therefore, the correct way to read the entry above is this:",
        "Even without the help of the profiling instrumentation, we’re still able to visually detect some parts of the code that can hinder GHC’s abilities for optimization.",
        "Consider the following expression:",
        "Suppose the monad we work in is State s. Then the >>=s produced by the do-notation could be inlined and turned into case-expressions:",
        "If, however, we work in some abstract monad m satisfying the MonadState s m constraint, then the >>=s are opaque to the compiler. It has to follow a pointer in the class dictionary and jump to an unknown function, which is bad for branch prediction.",
        "To find out if the functions in question are getting inlined, we can insert the following line into our module:",
        "After building our module, GHC will produce a .dump-simpl file containing its internal representation of the program after most optimizations have had the chance to take place.",
        "Suppose we built the module where the do-notation snippet is defined, and we worked in an abstract monad m. When we search for >>= in our generated .dump-simpl file, we will stumble upon this snippet:",
        "The call to >>= is not inlined, and the reason is that it is instantiated at an abstract monad m_aM5, and GHC does not know which instance to use. Instead, it has to pass the implementation in a dictionary $dMonad_aMr.",
        "Here is a list of relevant terminology, datatypes, and typeclasses for this section:",
        "We attempted to solve the aforementioned problem of inlining by changing the abstract monad MonadSimplify simplifier to SimplifierT SMT. This could not be done easily because of the application architecture: the base monad, SMT or NoSMT, is determined dynamically.",
        "For the purposes of this discovery phase investigation, we removed the support of NoSMT.",
        "It turned out that the simplifier type variable is instantiated to different monad transformer stacks and could not be easily monomorphized in some functions. We developed a custom tool to determine how the monad is being instantiated in practice.",
        "Here is the summary of its results on one of the test cases:",
        "Each line in the snippet above is of the form “<number> <type>” and can be interpreted the following way: the type <type> has been instantiated <number> time(s) during the run of the program.",
        "The vast majority (99.95%) of calls are in the Simplifier monad, so we started looking into a way to get GHC to specialize such functions.",
        "The SPECIALIZE pragma (UK spelling also accepted) can be used to create a specialized copy of an overloaded function. Consider the following example:",
        "It will create a new function which will be used whenever foo is applied to a Char, and GHC will choose that function automatically.",
        "Unfortunately, specialization is not transitive: if f calls g, and f is specialized, we might not see the desired performance improvement because g still works in an abstract context. Therefore, we must look into a way to specialize all the way down the call stack.",
        "We found that the cache in attemptEquation enjoys a hit ratio of over 95%, so it is well-placed. However, one of the functions that performs the lookup of the Simplifier cache, which is essentially a HashMap, is expensive, because a lot of time is spent on hashing and comparing keys.",
        "We can either use a different data structure than a HashMap to avoid hashing and comparisons entirely, or try to minimize the amount of time required to hash and compare keys by micro-optimizing the respective operations.",
        "The profiling report revealed that there are a lot of operations over values of the datatype Id. Id is a record type that has one field with the type Text. This means that operations such as == or hashWithSalt operate over Text values, which can be slow.",
        "Unlike some other programming languages, Haskell does not provide a means for interning strings, string-like datatypes, or numbers. However, a common practice is to create a table of identifiers and assign unique numbers to them. In this case, we could create some sort of global map from the Text values to, for example, Ints. This way comparisons and hashing become integer operations, which are much faster.",
        "When optimizing code, it’s crucial to avoid sacrificing simplicity. Drew DeVault describes this principle in his blog: Simple, correct, fast: in that order. Since K is a compute-intensive tool for software quality assurance, the principle is modified: accuracy is paramount, but simplicity and speed must be balanced.",
        "While implementing these changes, we followed Runtime Verification’s GitHub guidelines for collaboration.",
        "As mentioned in the Monomorphization and specialization subsection of the Findings section, our ultimate goal was to carefully inline (monomorphize) and/or specialize as many functions as possible, to make GHC’s optimizations take place by having concrete types instead of the polymorphic ones.",
        "The first obstacle to consider is the presence of two data types that are dynamically determined, SMT and NoSMT. They are defined as follows:",
        "We started looking into a way to merge the two datatypes into one. Notice how they differ in the type signatures of the encapsulated values: NoSMT holds a value of the type LoggerT IO a, while SMT needs a SolverSetup as an argument to acquire the value of the type LoggerT IO a. The type LoggerT IO a is isomorphic to the function () -> LoggerT IO a, where () is the unit type. For a moment, let’s think of the value encapsulated by NoSMT as that aforementioned function.",
        "If we have two functions f : a -> c and g : b -> c, we can construct a function (f + g) : Either a b -> c, applying either f or g to the value held by the respective constructor of Either. This is exactly how we want to combine SMT and NoSMT:",
        "Let’s call this combination SMT (in other words, we retain the original name). It wraps a function of the type Either () SolverSetup -> LoggerT IO a. However, we can simplify the type of the argument: Either () SolverSetup is isomorphic to Maybe SolverSetup. Thus, the combined datatype can be defined like this:",
        "If the argument is a Just wrapping a SolverSetup value, this datatype is isomorphic to the original SMT; otherwise, it’s isomorphic to NoSMT.",
        "For the sake of convenience, when referring to the original definition of SMT, let’s use the name OldSMT.",
        "We now need to construct the only base instance, MonadSMT SMT, with the knowledge of how the functions were defined in the original two base instances for the original two datatypes.",
        "Suppose the functions declared in the MonadSMT typeclass have the following type signature:",
        "We know how fOldSMT :: args -> OldSMT a and fNoSMT :: args -> NoSMT a were defined in the respective instances, so let’s build a definition of f for MonadSMT SMT!",
        "It will roughly look like this:",
        "Every function in the MonadSMT typeclass has a default definition of approximately the following structure:",
        "This will allow us to automatically have a definition of that function for nested monad transformer stacks:",
        "Notice, however, that we now have only one base instance: MonadSMT SMT, which means that only SMT can reside at the very bottom of the monad transformer stack. We can simplify the definition of MonadSMT the following way:",
        "The unification of OldSMT (originally referred to as SMT before defining the combined datatype) and NoSMT was the first step of the monomorphization and specialization task. This step was aimed more at simplifying the code rather than optimizing it. Along the way, we simplified the definition of the MonadSMT typeclass by introducing liftSMT :: SMT a -> m a and defining the majority of the functions in terms of it, bringing them outside of the typeclass’ scope. The link to the pull request containing the implementation of the SMT/NoSMT fusion is available here.",
        "An analysis of the profiling report showed that the values of the Id datatype are subject to many operations.",
        "Id is a record type, one of the fields of which has the type Text:",
        "This means operations such as == or hashWithSalt operate over Text values, which can be slow.",
        "The first attempt to solve this problem was to use the intern package. Modification of Eq instance for type Id to take advantage of interning resulted in approximately 8% speedup on the integration test suite.",
        "In our attempt to modify the Ord instance to take advantage of interning as well, some of our unit and integration tests failed because they assumed that the Ids would be sorted alphabetically. When we profiled it, we noticed that Kore.Syntax.Id.compare doesn’t play much of a role there, it isn’t one of the most expensive cost centres. Moreover, some data persists between invocations of the backend via serialization, and the ordering of Ids may change between runs if they are interned in a different order.",
        "However, we wanted to have an easier way to modify or debug the code responsible for string interning. There is a cacheWidth parameter in the Interned typeclass of the intern package that creates multiple maps to speed up concurrent access. As we didn’t need that, we had to create a newtype and redefine the Interned instance with cacheWidth set to 1.",
        "Moreover, since the intern library is quite small, it seemed easier to implement a custom interning solution in our code.",
        "To begin, let’s define a datatype for our interned strings:",
        "In addition to the original Text, the datatype also contains a unique ID associated with this string. The constructor of this datatype should not be used directly to create values. Instead, we will introduce an interface to interact with our interned text cache.",
        "We then define a datatype for the global cache, which will contain all of the process’ interned strings:",
        "InternedTextCache has two fields:",
        "Finally, we define instances for our InternedText:",
        "The Eq and Hashable instances are straightforward – we use the ID of the interned string for equality comparison and hashing operations.",
        "Our Ord instance quickly checks if the IDs of interned strings are equal. If they are not, we use lexical order to compare the strings themselves.",
        "The next step is to create a function to intern our strings. To start, let’s define a function that initializes the cache.",
        "With the unsafePerformIO hack, we can define a global IORef value to store our cache outside the IO monad:",
        "To avoid cache duplication, we must ensure that globalInternedTextCache is evaluated only once. So we add the NOINLINE pragma, which will prevent GHC from inlining our definition.",
        "As soon as we have a global cache, we can define a function to intern Text values:",
        "Using atomicModifyIORef', we can thread-safely modify our global cache. We use the strict version to avoid space leaks.",
        "The function works as follows:",
        "In other words, multiple evaluations of internText with the same argument should return a pointer to the exact same InternedText object.",
        "Now that we have a custom interning solution in place, it’s time to modify the Id datatype:",
        "The final step is to define a pattern synonym to abstract away InternedText:",
        "This pattern allows us to use the Id as it was before the modification.",
        "Instead of keeping many copies of the same Text in memory, we keep only one shared InternedText. Each InternedText has a unique ID.",
        "As a result:",
        "In total, the changes above improve performance by approximately 10%. In addition, the pattern synonym maintains the simplicity of the code where the Id type is used at the same level.",
        "The first phase of the collaboration between Runtime Verification and Serokell emerged with the discovery phase, conducted to determine the important, optimizable parts of the codebase, with the help of GHC’s profiling instrumentation and custom tools.",
        "The 1st part of the monomorphization and specialization task focused on the exploration of two datatypes, SMT and NoSMT, their unification, and the resulting simplification of the code; in particular, the MonadSMT typeclass. This change didn’t produce any noticeable effects on the performance, but it is nevertheless integral to the 2nd part of the task, enabling us to progress forward with the changes that will be impactful.",
        "The string interning task focused on solving the problem of optimizing the definitions of == and hashWithSalt for the Id datatype. One of its fields is a Text value, and these values take an immediate part in the aforementioned definitions. Such operations on Texts can be slow. Instead, we assign each Text a unique identifier and compare them instead. This consequently gives rise to the need for storing such Text-identifier pairs in a map, to access or create them during the interning process. This solution introduces a 10% performance improvement.",
        "The cache hit ratio task, as well as the 2nd part of the monomorphization and specialization task, will be explored in the following blog post. To not miss it, follow us on Twitter or subscribe to our mailing list via the form below."
      ]
    },
    {
      "title": "Show HN: Lost Pixel Platform – visual regression testing for your front end",
      "page": [
        "Holistic, fast & convenient tests that come at almost no writing and maintenance costs. Your existing Storybook, App, and Marketing Page is your testing suite.",
        "Set up in a few minutes and get automatic GitHub status checks. Lost Pixel offers a smooth GitHub action experience",
        "Use your existing Storybook, Next.js & Playwright to write visual tests. Compose them together to get a holistic view.",
        "Lost Pixel UI offers a battle-tested visual testing flow for projects of various sizes and stacks.",
        "We want you to be able to ship things confidently with Lost Pixel's support, not worry every day about exceeding your monthly quota.",
        "It only takes a few minutes to get started with Lost Pixel. Use our GitHub action.",
        "Lost Pixel core is open source. You could build your own visual testing workflow with it or use it completely for free!",
        "No. For the first release of Lost Pixel we decided to heavily focus on GitHub as a platform. Lost Pixel offers seamless GitHub action to get started with your visual tests in minutes on GitHub.",
        "Design systems(Storybook, Ladle), marketing pages, application UI. Anything that relies on showing UI to the end users.",
        "You can compose Lost Pixel to run visual tests on your Storybook for components, then test your application pages using the page mode and finally pipe the screenshots from your Cypress/Playwright run in custom mode of Lost Pixel"
      ]
    },
    {
      "title": "Poisoning web-scale training datasets is practical",
      "page": [
        "In just 3 minutes help us understand how you see arXiv.",
        "Help | Advanced Search",
        "arXivLabs is a framework that allows collaborators to develop and share new arXiv features directly on our website.",
        "Both individuals and organizations that work with arXivLabs have embraced and accepted our values of openness, community, excellence, and user data privacy. arXiv is committed to these values and only works with partners that adhere to them.",
        "Have an idea for a project that will add value for arXiv's community? Learn more about arXivLabs.",
        "",
        "arXiv Operational Status                     Get status notifications via                    email                    or slack"
      ]
    },
    {
      "title": "Apple orders entire supply of TSMC's 3nm chips for iPhone 15 Pro and M3 Macs",
      "page": [
        "Apple has reportedly secured all available orders for N3, TSMC's first-generation 3-nanometer process that is likely to be used in the upcoming iPhone 15 Pro lineup as well as new MacBooks scheduled for launch in the second half of 2023.",
        "According to a paywalled DigiTimes report, Apple has procured 100% of the initial N3 supply, which is said to have a high yield, despite the higher costs involved and the decline in the foundry's utilization rate in the first half of 2023. Mass production of TSMC's 3nm process began in late December, and the foundry has scaled up process capacity at a gradual pace with monthly output set to reach 45,000 wafers in March, according to the report's sources.",
        "Apple is widely expected to adopt TSMC's 3nm technology this year for the A17 Bionic chip likely to power the iPhone 15 Pro and iPhone 15 Pro Max models. The 3nm technology is said to deliver a 35% power efficiency improvement over 4nm, which was used to make the A16 Bionic chip for the iPhone 14 Pro and Pro Max.",
        "The latter two iPhone models were the first smartphones to feature chips built on the 4nm process, and it looks like Apple is again attempting to be first to market with models based on the latest cutting-edge semiconductor technology.",
        "Apple plans to release a new MacBook Air in the second half of 2023, and it may be equipped with a 3nm chip, according to a January report from DigiTimes. However, display industry analyst Ross Young in December claimed that a 15-inch MacBook Air would be released in the first half of 2023. If DigiTimes' outlook turns out to be accurate, then perhaps both 13-inch and 15-inch MacBook Airs with M3 chips based on 3nm technology will launch in the second half of 2023 instead.",
        "Looking further ahead, Apple analyst Ming-Chi Kuo believes 14 and 16-inch MacBook Pros coming in 2024 will feature M3 Pro and ‌M3‌ Max chips that are built on TSMC's 3nm process. MacBook Pro models with the ‌M3‌ Pro and ‌M3‌ Max chips will go into mass production in the first half of 2024, according to Kuo.",
        "The 3nm technology will offer improved performance and better power efficiency compared to the current chips manufactured on a 5-nanometer process, including the M2 Pro found in Apple's current high-end Mac mini and the M2 Pro and ‌M2‌ Max used in its latest 14 and 16-inch MacBook Pro models.",
        "TSMC is poised to move to N3E – an enhanced version of N3, its first-generation 3nm technology – to commercial production in the second half of this year, and Apple will be the first customer to adopt the process, according to another report this week from DigiTimes. Nikkei Asia reported in September that Apple could adopt N3E for devices launching as soon as this year, but we've not seen any other reports corroborating this roadmap.",
        "Get weekly top MacRumors stories in your inbox.",
        "A selection of macOS tips to make your Mac life a more effortless experience.",
        "A selection of quick iOS tips that will make you a lot more time-efficient in the long run.",
        "50 features and changes you might have missed in macOS Ventura.",
        "Apple on January 23 released iOS 16.3, delivering support for Security Keys for Apple IDs, changes to Emergency SOS functionality, support for the second-generation HomePod, and more.",
        "Apple's most powerful Mac will finally shift to Apple silicon.",
        "Apple's AR/VR headset is coming soon with eye- and gesture-tracking, dual 4K displays, M-series chips, and more. Here's what we know so far.",
        "Next-generation version of iOS, set to be previewed at WWDC 2023 in June with a public release in September.",
        "Apple is working on a redesigned version of the larger-screened iMac that could bring back the \"iMac Pro\" name.",
        "4 hours ago by Hartley Charlton",
        "2 days ago by Hartley Charlton",
        "3 days ago by Joe Rossignol",
        "3 days ago by Hartley Charlton",
        "4 days ago by Hartley Charlton",
        "",
        "MacRumors attracts a broad audience of both consumers and professionals interested in the latest technologies and products. We also boast an active community focused on purchasing decisions and technical aspects of the iPhone, iPod, iPad, and Mac platforms."
      ]
    },
    {
      "title": "The usability of advanced type systems: Rust as a case study",
      "page": [
        "In just 3 minutes help us understand how you see arXiv.",
        "Help | Advanced Search",
        "arXivLabs is a framework that allows collaborators to develop and share new arXiv features directly on our website.",
        "Both individuals and organizations that work with arXivLabs have embraced and accepted our values of openness, community, excellence, and user data privacy. arXiv is committed to these values and only works with partners that adhere to them.",
        "Have an idea for a project that will add value for arXiv's community? Learn more about arXivLabs.",
        "",
        "arXiv Operational Status                     Get status notifications via                    email                    or slack"
      ]
    },
    {
      "title": "For the First Time, Genetically Modified Trees Have Been Planted in a US Forest",
      "page": [
        "Advertisement",
        "Supported by",
        "Living Carbon, a biotechnology company, hopes its seedlings can help manage climate change. But wider use of its trees may be elusive.",
        "Send any friend a story",
        "As a subscriber, you have 10 gift articles to give each month. Anyone can read what you share.",
        "By Gabriel Popkin",
        "Photographs by Audra Melton",
        "On Monday, in a low-lying tract of southern Georgia’s pine belt, a half-dozen workers planted row upon row of twig-like poplar trees.",
        "These weren’t just any trees, though: Some of the seedlings being nestled into the soggy soil had been genetically engineered to grow wood at turbocharged rates while slurping up carbon dioxide from the air.",
        "The poplars may be the first genetically modified trees planted in the United States outside of a research trial or a commercial fruit orchard. Just as the introduction of the Flavr Savr tomato in 1994 introduced a new industry of genetically modified food crops, the tree planters on Monday hope to transform forestry.",
        "Living Carbon, a San Francisco-based biotechnology company that produced the poplars, intends for its trees to be a large-scale solution to climate change.",
        "“We’ve had people tell us it’s impossible,” Maddie Hall, the company’s co-founder and chief executive, said of her dream to deploy genetic engineering on behalf of the climate. But she and her colleagues have also found believers — enough to invest $36 million in the four-year-old company.",
        "The company has also attracted critics. The Global Justice Ecology Project, an environmental group, has called the company’s trees “growing threats” to forests and expressed alarm that the federal government allowed them to evade regulation, opening the door to commercial plantings much sooner than is typical for engineered plants.",
        "Living Carbon has yet to publish peer-reviewed papers; its only publicly reported results come from a greenhouse trial that lasted just a few months. These data have some experts intrigued but stopping well short of a full endorsement.",
        "“They have some encouraging results,” said Donald Ort, a University of Illinois geneticist whose plant experiments helped inspire Living Carbon’s technology. But he added that the notion that greenhouse results will translate to success in the real world is “not a slam dunk.”",
        "Living Carbon’s poplars start their lives in a lab in Hayward, Calif. There, biologists tinker with how the trees conduct photosynthesis, the series of chemical reactions plants use to weave sunlight, water and carbon dioxide into sugars and starches. In doing so, they follow a precedent set by evolution: Several times over Earth’s long history, improvements in photosynthesis have enabled plants to ingest enough carbon dioxide to cool the planet substantially.",
        "While photosynthesis has profound impacts on the Earth, as a chemical process it is far from perfect. Numerous inefficiencies prevent plants from capturing and storing more than a small fraction of the solar energy that falls onto their leaves. Those inefficiencies, among other factors, limit how fast trees and other plants grow, and how much carbon dioxide they soak up.",
        "Scientists have spent decades trying to take over where evolution left off. In 2019, Dr. Ort and his colleagues announced that they had genetically hacked tobacco plants to photosynthesize more efficiently. Normally, photosynthesis produces a toxic byproduct that a plant must dispose of, wasting energy. The Illinois researchers added genes from pumpkins and green algae to induce tobacco seedlings to instead recycle the toxins into more sugars, producing plants that grew nearly 40 percent larger.",
        "That same year, Ms. Hall, who had been working for Silicon Valley ventures like OpenAI (which was responsible for the language model ChatGPT), met her future co-founder Patrick Mellor at a climate tech conference. Mr. Mellor was researching whether trees could be engineered to produce decay-resistant wood.",
        "With money raised from venture capital firms and Ms. Hall’s tech-world contacts, including OpenAI chief executive Sam Altman, she and Mr. Mellor started Living Carbon in a bid to juice up trees to fight climate change. “There were so few companies that were looking at large-scale carbon removal in a way that married frontier science and large-scale commercial deployment,” Ms. Hall said.",
        "They recruited Yumin Tao, a synthetic biologist who had previously worked at the chemical company DuPont. He and others retooled Dr. Ort’s genetic hack for poplar trees. Living Carbon then produced engineered poplar clones and grew them in pots. Last year, the company reported in a paper that has yet to be peer reviewed that its tweaked poplars grew more than 50 percent faster than non-modified ones over five months in the greenhouse.",
        "The company’s researchers created the greenhouse-tested trees using a bacterium that splices foreign DNA into another organism’s genome. But for the trees they planted in Georgia, they turned to an older and cruder technique known as the gene gun method, which essentially blasts foreign genes into the trees’ chromosomes.",
        "In a field accustomed to glacial progress and heavy regulation, Living Carbon has moved fast and freely. The gene gun-modified poplars avoided a set of federal regulations of genetically modified organisms that can stall biotech projects for years. (Those regulations have since been revised.) By contrast, a team of scientists who genetically engineered a blight-resistant chestnut tree using the same bacterium method employed earlier by Living Carbon have been awaiting a decision since 2020. An engineered apple grown on a small scale in Washington State took several years to be approved.",
        "“You could say the old rule was sort of leaky,” said Bill Doley, a consultant who helped manage the Agriculture Department’s genetically modified organism regulation process until 2022.",
        "On Monday, on the land of Vince Stanley, a seventh-generation farmer who manages more than 25,000 forested acres in Georgia’s pine belt, mattock-swinging workers carrying backpacks of seedlings planted nearly 5,000 modified poplars. The tweaked poplars had names like Kookaburra and Baboon, which indicated which “parent” tree they were cloned from, and were interspersed with a roughly equal number of unmodified trees. By the end of the unseasonably warm day, the workers were drenched in sweat and the planting plots were dotted with pencil-thin seedlings and colored marker flags poking from the mud.",
        "In contrast to fast-growing pines, hardwoods that grow in bottomlands like these produce wood so slowly that a landowner might get only one harvest in a lifetime, Mr. Stanley said. He hopes Living Carbon’s “elite seedlings” will allow him to grow bottomland trees and make money faster. “We’re taking a timber rotation of 50 to 60 years and we’re cutting that in half,” he said. “It’s totally a win-win.”",
        "Forest geneticists were less sanguine about Living Carbon’s trees. Researchers typically assess trees in confined field trials before moving to large-scale plantings, said Andrew Newhouse, who directs the engineered chestnut project at SUNY College of Environmental Science and Forestry. “Their claims seem bold based on very limited real-world data,” he said.",
        "Steve Strauss, a geneticist at Oregon State University, agreed with the need to see field data. “My experience over the years is that the greenhouse means almost nothing” about the outdoor prospects of trees whose physiology has been modified, he said. “Venture capitalists may not know that.”",
        "Dr. Strauss, who previously served on Living Carbon’s advisory board, has grown some of the company’s seedlings since last year as part of a field trial funded by the company. He said the trees were growing well, but it was still too early to tell whether they were outpacing unmodified trees.",
        "Even if they do, Living Carbon will face other challenges unrelated to biology. While outright destruction of genetically engineered trees has dwindled thanks in part to tougher enforcement of laws against acts of ecoterrorism, the trees still prompt unease in the forestry and environmental worlds. Major organizations that certify sustainable forests ban engineered trees from forests that get their approval; some also prohibit member companies from planting engineered trees anywhere. To date, the only country where large numbers of genetically engineered trees are known to have been planted is China.",
        "The U.S. Forest Service, which plants large numbers of trees every year, has said little about whether it would use engineered trees. To be considered for planting in national forests, which make up nearly a fifth of U.S. forestland, Living Carbon’s trees would need to align with existing management plans that typically prioritize forest health and diversity over reducing the amount of atmospheric carbon, said Dana Nelson, a geneticist with the service. “I find it hard to imagine that it would be a good fit on a national forest,” Dr. Nelson said.",
        "Living Carbon is focusing for now on private land, where it will face fewer hurdles. Later this spring it will plant poplars on abandoned coal mines in Pennsylvania. By next year Ms. Hall and Mr. Mellor hope to be putting millions of trees in the ground.",
        "To produce an income stream not reliant on venture capital, the company has started marketing credits based on carbon its trees will soak up. But carbon credits have come under fire lately and the future of that industry is in doubt.",
        "And to head off environmental concerns, Living Carbon’s modified poplar trees are all female, so they won’t produce pollen. While they could be pollinated by wild trees and produce seeds, Mr. Mellor says they’re unlikely to spread into the wild because they don’t breed with the most common poplar species in the Southeast.",
        "They’re also being planted alongside native trees like sweet gum, tulip trees and bald cypress, to avoid genetically identical stands of trees known as monocultures; non-engineered poplars are being planted as experimental controls. Ms. Hall and Mr. Mellor describe their plantings as both pilot projects and research trials. Company scientists will monitor tree growth and survival.",
        "Such measures are unlikely to assuage opponents of genetically modified organisms. Last spring, the Global Justice Ecology Project argued that Living Carbon’s trees could harm the climate by “interfering with efforts to protect and regenerate forests.”",
        "“I’m very shocked that they’re moving so fast” to plant large numbers of modified trees in the wild, said Anne Petermann, the organization’s executive director. The potential risks to the greater ecosystem needed to be better understood, she said.",
        "Dr. Ort of the University of Illinois dismissed such environmental concerns. But he said investors were taking a big chance on a tree that might not meet its creators’ expectations.",
        "“It’s not unexciting,” he said. “I just think it’s uber high risk.”",
        "Audra Melton contributed reporting from Georgia.",
        "Advertisement"
      ]
    },
    {
      "title": "Hope in the Dark: History and Ghost Stories",
      "page": [
        "Features",
        "History and Ghost Stories",
        "Scott G. Bruce                |                    Feb 15, 2023",
        "The ubiquity of the undead as protagonists in modern entertainment media—from novels to movies to video games—has exponentially increased student interest in the history of ghosts and zombies. Every age and culture has its stories about the returning dead, but teachers of premodern Europe are particularly well served by the abundance of accounts in English translation.",
        "Ghost stories provide a rich literary and cultural tapestry for historical examination. Stowe MS 17, f. 200r. British Library. Public domain.",
        "Ancient and medieval European ghost stories do not meet the expectations of modern tales of supernatural horror. They do not rely on shock tactics to frighten the reader, the ghosts themselves are typically not malformed in appearance or malevolent in intent, and the purpose of these stories is didactic rather than entertaining. Yet these tales are rewarding resources for teaching students about classical antiquity and the Western Middle Ages because they provide us with the opportunity to ask probing questions about how people in the past imagined the relationship between the living and the dead. From what otherworldly abode do the spirits of the departed return? What form do ghosts take, and how do they communicate? Why are they deprived of eternal rest, and what do they require from the living in order to obtain it? As rich and vivid cultural constructions, ancient and medieval specters give up valuable secrets about the worldviews of the authors who told stories about their return.",
        "Most premodern hauntings followed narrative conventions. An unquiet spirit appears in a certain locale or to a specific individual, reveals the reason for its unrest, and receives help from the living to find repose in the afterlife. Ancient ghosts often reminded the living to observe proper funerary rites and thereby provide them with an easy passage to the otherworld. Such was the case with the hapless sailor Elpenor in Homer’s The Odyssey, whose ghost implored Odysseus to bury him according to custom after he died in an accident. Likewise, as recounted by Pliny the Younger, a nameless wraith seeking a respectable burial haunted a rental property in Roman Athens.",
        "As centuries passed, the details of these stories changed to accommodate new belief systems. The meteoric success of Christianity in the fourth century triggered a groundswell of concern for the fate of Christian souls after death and modulated the urgency of their petitions from beyond the grave. While the teachings of the early church were clear that the soul lay in repose as though asleep until the resurrection of the dead and their judgment by God at the end of time, apocryphal writings like the Vision of Paul (composed ca. 400) depicted an afterlife immediately after death but preceding the final judgment, where human souls persisted in recognizable bodies that were vulnerable to physical punishments commensurate with their sins. In her eloquent book Moment of Reckoning (Oxford Univ. Press, 2019), Ellen Muehlberger has dubbed this alarming new phase of human existence the “postmortal.” It is from this liminal place between heaven and hell that the shades of the Christian dead return to our world, fretful of their eternal fate.",
        "Ghost stories provide us with the opportunity to ask probing questions about how people in the past imagined the relationship between the living and the dead.",
        "The dead remained stubbornly social in premodern ghost stories. As the notion of the temporary residence of souls in a punitive afterlife took hold in the Western imagination, so, too, did the idea that these spirits could benefit from the help of the living. Beginning in the late sixth century with anecdotes recounted in the Dialogues of Pope Gregory the Great (590–604), Christian apparitions returned to petition listeners to pray for their release from punishment in the hereafter. Pithy and memorable, these stories were primarily pastoral in purpose. The identity of the suffering spirits and the nature of their pleas provide us with a barometer of the kinds of people to whom Christian bishops and priests directed moral exhortation as well as the kinds of behavior that they sought to control. Pope Gregory’s audience was mostly monastic, and so, too, were his ghosts and their sins. Take, for example, the unfortunate Justus, a monk who hid three gold coins and suffered in fire after his death because of his greed until 30 days of consecutive Masses offered on his behalf by his brethren released him from his torment. Later imitators of Pope Gregory, such as Abbot Peter the Venerable (1122–56) and Caesarius of Heisterbach (ca. 1180–1240), tailored the details of these traditions to address new audiences, particularly laypeople, but they did little to alter the overall pattern of the narratives.",
        "In the later Middle Ages, however, new experiences with the undead challenged the expectations of the ghost story genre. In the 12th century, for example, authors struggled to explain reports of animated corpses terrorizing villages in northern England. These were not the spirits of the dead returning to seek the aid of the living, but rather the bloated and bloodied bodies of notorious men, who rose from their graves at night to torment their neighbors with violence and pestilence. One was an infamous churchman known as the Hundeprest (Houndpriest), owing to his inordinate love of hunting, who terrified his wife by lurking in her bedroom before crushing her nearly to death with the immense weight of his dead body. Unable to find precedent for this phenomenon in “the books of ancient authors,” the monastic chronicler William of Newburgh was at a loss to explain how the dead were rising. His stories of rampaging revenants departed from time-honored literary models and anticipated a genre that would not find prominence until the early 21st century: the zombie survival guide. William’s breathless narrative related how a band of monks armed with axes and shovels waited in a graveyard by night for the dead man to rise and then, after a pitched battle, harried him back to his tomb. Once the monks had excavated his monstrous corpse, they destroyed it with fire, but only after they had completed the grisly work of extracting his “cursed heart.”",
        "While ancient and medieval poets from Homer to Dante told stories about heroes and visionaries who visited the underworld to witness the fate of the fallen, the spirits of the deceased themselves have not played a starring role in the history of spectral literature until recently. A thought-provoking example is George Saunders’s experimental novel Lincoln in the Bardo (Random House, 2017). Set in the Civil War era, it features a cast of dead souls trapped in the “bardo,” a term for a liminal postmortal state borrowed from Buddhism. While the characters have been disfigured by the frustrated desires of their mortal lives, most do not even realize that they are dead. Their attention focuses on the newly arrived soul of a boy named Willie Lincoln, who tarries in this antechamber of eternity because the grief of his father, the famous president, tethers him unnaturally to the mortal world. In a reversal of a centuries-old tradition, the mourning of the living disturbs the repose of the dead.",
        "In Buddhist and Taoist traditions, the neglect of ancestors or misdeeds in life could give rise to “hungry ghosts.”",
        "Underlying this rich literary tradition are fundamental questions of universal interest about the fate of the dead, the porousness of the boundary separating their world from ours, and the social obligations that the living had to provide for the deceased in their need. This attention to the memory of the dead and the responsibility of the living for their care was not unique to ancient polytheism or medieval Christianity. In fact, Western ghost stories shine most brightly as tools for teaching when they are read in tandem with tales of the returning dead from other religious cultures. In Buddhist and Taoist traditions, for example, the neglect of ancestors or misdeeds in life could give rise to “hungry ghosts.” These fearful spirits abided in the underworld, but they walked the earth during the seventh month of the Chinese calendar. In anticipation of their arrival, communities celebrated the Hungry Ghost Festival to provide symbolic sustenance not only to honor their own ghostly ancestors but also to ward off the ill will of the unknown phantoms in their midst. Like their Western analogues, the practice of the care of the hungry ghosts in Chinese culture is grounded on the hope that when we die, we, too, can rely on the living for help as we face the consequences of our mortal actions in the world to come.",
        "The trappings of premodern ghost stories have been remarkably consistent in the Western tradition—Pliny the Younger’s chain-rattling Roman apparition could be mistaken for the ghost of Jacob Marley in Charles Dickens’s A Christmas Carol (1843). The genre has also retained its didactic function down to the present day, but 20th-century authors have repurposed it in creative and instructive ways worth exploring in the classroom. Some modern tales about hauntings have doubled as narratives about the lingering trauma of slavery (Toni Morrison’s Beloved) and as warnings about the injustice of cultural appropriation (Hari Kunzru’s White Tears). Others aspire only to entertain with no higher purpose than to conjure the thrill of fear. A classic example is M. R. James’s 1904 short story “Oh, Whistle, and I’ll Come to You, My Lad,” concerning a man who inadvertently summoned “a figure in pale, fluttering draperies, ill-defined” by blowing a metal whistle found in a ruined church. Read it by candlelight if you dare.",
        "",
        "Scott G. Bruce is professor of history at Fordham University.",
        "",
        "Tags:                               Features                              Europe                              Cultural History",
        "This work is licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License. Attribution must provide author name, article title, Perspectives on History, date of publication, and a link to this page. This license applies only to the article, not to text or images used here by permission.",
        "The American Historical Association welcomes comments in the discussion area below, at AHA Communities, and in letters to the editor. Please read our commenting and letters policy before submitting.",
        "",
        "Please read our commenting and letters policy before submitting.",
        "",
        "Edward Muir | Feb 14, 2023",
        "Leland Renato Grigoli | Sep 6, 2022",
        "Nike Nivar | Oct 31, 2011",
        "",
        "Phone: 202.544.2422Email: info@historians.org",
        "400 A Street SEWashington, DC 20003",
        "© 2023 American Historical Association"
      ]
    },
    {
      "title": "Passwordless authentication with FIDO2–beyond just the web",
      "page": [
        "",
        "The following subscription-only content has been made available to you by an LWN subscriber.  Thousands of subscribers depend on LWN for the best news from the Linux and free software communities.  If you enjoy this article, please consider subscribing to LWN.  Thank youfor visiting LWN.net!",
        "",
        "February 21, 2023",
        "This article was contributed by Koen Vervloesem",
        "FIDO2 is a standard forauthenticating users without the need for passwords. While the technology hasbeen introduced mainly to protect accounts on web sites, it's also usefulfor other purposes, such as logging into Linux systems. The same technologycan even be used beyond authentication, for example to sign files or Gitcommits. A couple of talks at FOSDEM2023 in Brussels presented the possibilities for Linux users.",
        "The FIDO2 standard is a joint effort between the FIDO Alliance (FIDO stands for FastIdentity Online) and the World Wide WebConsortium (W3C) to develop standards for strong authentication. Userscan securely authenticate themselves with a FIDO2 security key (a hardwaretoken), which is more convenient, faster, and more secure than traditionalpassword-based authentication. The security key can ask the user to touch abutton or enter a PIN for authentication; alternatively, it caninclude a fingerprint reader or other means for biometric authentication. FIDO2 can be used as an extra factoradded to a traditional password as part of multi-factor authentication oras the only means of authentication. In the latter case, this is calledpasswordless authentication. Note that a previous FIDO standard, FIDOU2F, was primarily designed for two-factor authentication.",
        "The FIDO2 standard consists of two parts. Web Authentication (WebAuthn)is a W3C recommendation with broad browser support thatdescribes an API allowing web sites to add FIDO2 authentication totheir login pages. FIDO's Clientto Authenticator Protocol (CTAP) complements WebAuthn by enabling anexternal authenticator, such as a security key or a mobile phone, to workwith the browser. So in short: the browser talks WebAuthn to the server andCTAP to the authenticator device.",
        "Both standards are open, and anyone can manufacture FIDO2 securitykeys. Various manufacturers have built such hardware tokens. Yubicohas some YubiKey models that supportFIDO2, as well as a dedicated FIDO2 security key. Feitian,Nitrokey,SoloKeys, and OnlyKey offer FIDO2 tokens too.",
        "FIDO2 is a challenge-response authentication system using asymmetricencryption. When a user registers with a web site, WebAuthn and CTAP worktogether to make the authenticator (usually a security key) create a newkey pair. This is only done after the user proves possession of theauthenticator, for example by pressing a button on the device, scanning afinger, or entering a PIN. The private key never leaves the device, whilethe public key is sent to the web site and associated with the user'saccount there.",
        "When logging into the web site, the site sends a challenge and itsorigin (such as its domain) to the web browser using the WebAuthn API. Theweb browser then sends the challenge to the authenticator using CTAP. Theuser again proves possession of the authenticator and the devicegenerates a response by signing the challenge with its private key. Theresponse is returned to the web browser (using CTAP) and then to theweb site (using WebAuthn). The web site verifies the response against theoriginal challenge using the public key that was used to register theaccount.",
        "The FIDO2 token can store multiple credentials, each of which consistsof a credentialID, the private key, the user ID, and a relying party ID corresponding tothe web site's domain. The web site stores the same user ID and credentialID, as well as the public key. The way FIDO2 works protects users againstphishing. The web browser only accepts WebAuthn calls using a relying party ID allowedfrom the web site's domain, and only HTTPS connections are allowed. Sowhen the authenticator signs the challenge, the browser already knows that it'stalking to the right web site, because it has verified thisusing the web site's TLS certificate. As a result, the user doesn't have tocheck the domain manually.",
        "Most of the documentation about FIDO2 is  about its use in websites as if that's the only possible use. An example is the unofficial buthelpful WebAuthn Guide made by DuoSecurity. However, the specifications can be used beyond the web. That was the topic of a talkby Joost van Dijk, a developer advocate at Yubico.",
        "Yubico developed libfido2, a C library andcorresponding command-line tools to communicate with a FIDO device (notonly the ones made by Yubico) over USB or NFC. It supports the FIDO U2F andFIDO2 protocols. The project is licensed under the BSD 2-clause license andsupports Linux, macOS, Windows, OpenBSD, and FreeBSD. Some externalprojects have built upon libfido2 to create bindings for .NET, Go, Perl, and Rust. Yubico alsomaintains a Python library, python-fido2, that istested on Linux, macOS, and Windows.",
        "One of the projects using libfido2 is pam-u2f, also developed byYubico and included in the repositories of many Linux distributions. Itintegrates FIDO2 security keys into Pluggable AuthenticationModules (PAM), which is the flexible and extensible authenticationframework for Linux systems that allows multiple authentication methods to beused. Requiring a credential on a FIDO2 device for a specific purpose is aseasy as registering a new credential, saving it in a configuration file,and then adding a reference to pam_u2f.so in the PAMconfiguration, referring to the file with the saved credential. As anexample, Van Dijk showed how to enable two-factor authentication for sudowith a FIDO2 token as the second factor. The pam-u2f documentation shows someother examples.",
        "Another use case Van Dijk described is an SSH key that is backed by a FIDO2authenticator. OpenSSH 8.2(released in February 2020) introduced support for FIDO2 security keys,using the libfido2 library under the hood. The challenge-response mechanismworks not unlike on the web, but this time the authenticator talks to thessh client using CTAP, and the ssh client talks to thesshd server using the normal SSH protocol.",
        "To make this work, OpenSSH introduced new public key types \"ecdsa-sk\"and \"ed25519-sk\", along with corresponding certificate types. If the usergenerates a new SSH key pair of one of those types withssh-keygen, the private key is generated and stored inside thehardware token, together with the relying party ID \"ssh:\" andoptionally a key handle. The authenticator returns the public key and thekey handle to ssh-keygen. The program saves the public key in afile as usual, while the file that normally stores the private key nowincludes the key handle.",
        "Authenticating with this type of key to the SSH server involves achallenge-response mechanism. The SSH server sends a challenge to theclient, which sends it to the FIDO2 authenticator. The latter signs theserver's challenge with the private key to create a digital signature thatis sent to the client and then to the server. The SSH server is able toverify this signature by the corresponding public key known to beassociated to the FIDO2 authenticator. The private key never leaves theauthenticator during this process, even the ssh client doesn't get accessto it. A hardware-backed SSH key may be used like any other key type supportedby OpenSSH, as long as the hardware token is attached when the key isused.",
        "Van Dijk showed some examples of what's possible with a hardware-backedSSH key: authenticatingto GitHub when cloning a Git repository over SSH, signingGit commits and tags and verifying their signatures, and signing andverifying files.",
        "CTAP also offers the hmac-secretextension, which is supported by most FIDO2 tokens. This is used to retrieve asecret from the authenticator in order to encrypt or decrypt data. Toprevent offline attacks, part of the secret (the salt) is held by the client, while the other part is stored on the authenticator. Theclient hands its salt to the authenticator, the device combines the saltwith its own part of the secret using the  HMAC-SHA-256 hash-based messageauthentication (HMAC), and returns the resulting key. Van Dijk showed how touse this key to encrypt data, after which it's safe to delete the key. Todecrypt the data later, the client hands the salt back to theauthenticator, which regenerates the key from the salt and its own secret.",
        "One application of this hmac-secret extension that Van Dijk demonstratedis in LinuxUnified Key Setup (LUKS) disk encryption. Systemd 248 introduced support for unlockingLUKS2 volumes with a FIDO2 security key. After enrollinga FIDO2 authenticator to a LUKS2 encrypted volume, the systemd-cryptsetupcomponent waits for the FIDO2 token to be plugged in at boot, hands it thesalt, gets back the key, and unlocks the volume with the key.",
        "With all this functionality of FIDO2 security keys, one has to wonderwhy traditional smart cards or hardware keys implementing OpenPGP aren't enough. These have beenused for a long time to store private keys offline forencryption, authentication, signing, and verification. Van Dijk considersthat the biggest advantage of FIDO2 security keys is that they are cheaperand more user-friendly.",
        "Open-source support is also improving a lot in many domains. Forexample, at FOSDEM Red Hat's Alexander Bokovoy gave two talks about hiswork on integratingFIDO2 in FreeIPA for passwordlessauthentication for  centrally managed users. Under the hood, this also uses the libfido2library. His colleague Iker Pedrosa has some instructionson his blog.",
        "With Microsoft, Apple, and Google jumping on the FIDO2bandwagon during the last few years, surely more and more affordable FIDO2devices will come to market.  With software support improving as well, itwon't be long before users start replacing their passwords with cheap FIDO2 security keys.",
        "",
        "",
        "Posted Feb 21, 2023 21:58 UTC (Tue) by mss (subscriber, #138799)       [Link]",
        "",
        "Posted Feb 21, 2023 22:18 UTC (Tue) by k8to (subscriber, #15413)       [Link]",
        "",
        "Posted Feb 21, 2023 22:29 UTC (Tue) by mss (subscriber, #138799)       [Link]",
        "",
        "Posted Feb 22, 2023 3:35 UTC (Wed) by stressinduktion (subscriber, #46452)       [Link]",
        "Something alike is in use in Germany with HBCI/FinTS (same with the electronic id cards). The security class 3 readers have display and pin pad to verify and confirm a transaction's details. Myself, I use a ReinerSCT cyberjack komfort for doing that. Most(?) financial institutes support it, but somehow they are not keen on handing out the necessary cards anymore and instead prefer to use mobile apps to get the confirmations (at least in the consumer sector). Anyway, it is handy in particular for automated processing.",
        "Are there any other countries using a standardized online banking protocol?",
        "",
        "Posted Feb 22, 2023 9:58 UTC (Wed) by MortenSickel (subscriber, #3238)       [Link]",
        "In Norway, we have the bankid system (https://www.bankid.no/en/private/) that is used for more or less all banks and a lot of other places where a secure login is needed. It can be used either by a code generator or a mobile phone app - no plugin devices.",
        "",
        "Posted Feb 22, 2023 3:31 UTC (Wed) by pabs (subscriber, #43278)       [Link]",
        "https://github.com/bulwarkid/virtual-fido",
        "",
        "Posted Feb 22, 2023 11:42 UTC (Wed) by Conan_Kudo (subscriber, #103240)       [Link]",
        "",
        "Posted Feb 22, 2023 13:38 UTC (Wed) by mss (subscriber, #138799)       [Link]",
        "",
        "Posted Feb 22, 2023 13:57 UTC (Wed) by Conan_Kudo (subscriber, #103240)       [Link]",
        "",
        "Posted Feb 22, 2023 14:40 UTC (Wed) by smurf (subscriber, #17840)       [Link]",
        "So, cute that it's possible, but when it enables the same security problems 2-factor auth is supposed to fix, probably not a good idea.",
        "",
        "Posted Feb 22, 2023 4:32 UTC (Wed) by matthias (subscriber, #94967)       [Link]",
        "Yes, a display on the device. Just in the same way, as I do online banking in Germany. A display shows the account number and amount for an authorized transfer. Doing this with something like FIDO2 would be much nicer than with the devices we currently use, where we have to put in the banking card to do the encryption, then scan the transaction details from the screen*, and afterwards type in a transaction number from the devices  screen into the banking website.",
        "And I do actually read this. For small amounts I usually only check the amount, as the possible damage is limited to the amount shown on the display. For large transactions, I also verify the account number.",
        "*newer devices use QR-codes. My device has 5 photo-diodes that scan a flickering code. One of the diodes is used for a clock signal, the other 4 to transfer 4 bits in each clock cycle. A really simple device. All actual cryptography is done inside the banking card and the device only transfers data from the computer screen to the card and the builtin display.",
        "",
        "Posted Feb 21, 2023 22:21 UTC (Tue) by ibukanov (subscriber, #3942)       [Link]",
        "",
        "Posted Feb 22, 2023 7:44 UTC (Wed) by djm (subscriber, #11651)       [Link]",
        "",
        "Posted Feb 21, 2023 22:49 UTC (Tue) by fraetor (subscriber, #161147)       [Link]",
        "On the other hand it is a significant improvement over the current state of affairs, with phishing rife.",
        "An area that I don't think it necessarily improves on is device security, particularly for portable devices. Specifically if my laptop bag is left on the train, it is likely that my FIDO2 token is also in that same bag.",
        "",
        "Posted Feb 21, 2023 22:50 UTC (Tue) by Cyberax (✭ supporter ✭, #52523)       [Link]",
        "That's not true. \"Relying party ID\" (basically, the domain name) is a part of the CTAP protocol, and the FIDO2 device can display it to the user.",
        "It's not much help if you're using USB keys without any UI, but OS-level WebAuthn subsystem can show the credential details in a pop-up window that can't be controlled by the browser. Ditto for phone authenticators.",
        "",
        "Posted Feb 21, 2023 23:11 UTC (Tue) by mss (subscriber, #138799)       [Link]",
        "",
        "Posted Feb 22, 2023 3:38 UTC (Wed) by pabs (subscriber, #43278)       [Link]",
        "https://github.com/bulwarkid/virtual-fidohttps://github.com/psanford/tpm-fidohttps://git.kernel.org/pub/scm/linux/kernel/git/jejb/fido...https://news.ycombinator.com/item?id=33943008",
        "",
        "Posted Feb 22, 2023 5:40 UTC (Wed) by Cyberax (✭ supporter ✭, #52523)       [Link]",
        "It's not possible with X11, but Wayland already does this. A Wayland client such as a browser doesn't have access to other clients, including the daemon process that handles the FIDO2 events.",
        "The browser will need to be additionally confined to disallow it access to other stuff. But it already should be mandatory. And it's already the case with Android and iOS.",
        "> All this effort would at best move the required threat just one level-up - now a \"root\" account or kernel compromise would also be necessary, so it wouldn't be a qualitative change.",
        "Well, just use your phone over Bluetooth for the FIDO2 device. This way you'll know exactly which website is requesting the auth: https://github.com/fmeum/WearAuthn - I believe this will soon be available on stock Android as an OS-level service with hardware-based security.",
        "Even in the absence of this, there is still at least some bit of security because you need physical interaction with the FIDO2 device (touching a button) that can't be faked even with the compromised kernel.",
        "",
        "Posted Feb 22, 2023 11:50 UTC (Wed) by tialaramex (subscriber, #21167)       [Link]",
        "The WebAuthn API has a slot for you to say what DNS name you want authentication for. The browser gets to weed out unacceptable choices. They just get you an error in your Javascript and no user interaction. It is allowed for example for test-new.login.example.com to ask for credentials for login.example.com whereas it won't work if bad-guy.example asks for credentials for real-bank.example assuming example is a conventional TLD. The same mechanism is used to make this work as for cookies (the Public Suffix List).",
        "But after FIDO is used to move an acceptable authentication request to your authenticator, the authenticator goes have the RpID and gets to decide what to actually do, my cheap Yubico Security Key 2 doesn't have any means to display a name, but e.g. if I need to log into a web site in a Chrome logged into Google on a Windows laptop, my Phone (which is also logged into Google) will light up - do I want to use my Phone's onboard credentials to sign into site.name.example on the laptop ? The name is right there for me to consider.",
        "This required an impressive amount of lifting to do securely, the laptop has checked the phone is present using Bluetooth (so bad guys can't cause this to trigger unless they're nearby), but the actual security protocols are run over the Internet. And of course the phone is necessarily more complicated and thus has a larger attack surface area than my Yubico Security Key 2, but if your concern is primarily hard browser take over I guess this solves it.",
        "",
        "Posted Feb 22, 2023 13:44 UTC (Wed) by mss (subscriber, #138799)       [Link]",
        "",
        "Copyright © 2023, Eklektix, Inc.                Comments and public postings are copyrighted by their creators.        Linux  is a registered trademark of Linus Torvalds"
      ]
    },
    {
      "title": "Vanderbilt University apologizes for ChaptGPT email after Michigan shooting",
      "page": [
        "Consoling email sent to students after a mass shooting at Michigan State University was written using an AI chatbot",
        "Officials at Vanderbilt University apologized for using an AI chatbot to write a consoling email to students after a mass shooting at Michigan State University.",
        "The message went out last week from the office of equity, diversity and inclusion in the Peabody College of Education and Human Development, reported the Vanderbilt Hustler, the student newspaper.",
        "The message said the Michigan shootings, in which three students were killed, were a reminder of the importance of creating an inclusive environment.",
        "“One of the key ways to promote a culture of care on our campus is through building strong relationships with one another,” the brief message said.",
        "“This involves actively engaging with people from different backgrounds and perspectives, listening to their stories, and showing empathy and support.”",
        "At the bottom of the message, in small print, the email said: “Paraphrase from OpenAI’s ChatGPT AI language model, personal communication.” The mail was signed by two administrators.",
        "Nicole Joseph, one of the associate deans who signed the letter, sent out a follow-up message apologizing and saying using ChatGPT to write the message was “poor judgment”, the Hustler said.",
        "“While we believe in the message of inclusivity expressed in the email, using ChatGPT to generate communications on behalf of our community in a time of sorrow and in response to a tragedy contradicts the values that characterize Peabody College,” Joseph’s message said.",
        "“As with all new technologies that affect higher education, this moment gives us all an opportunity to reflect on what we know and what we still must learn about AI.”",
        "Joseph and the assistant dean, Hasina Mohyuddin, who also signed the initial email, are stepping back from their roles with the equity, inclusion, and diversity office while the university investigates, ABC News reported.",
        "Laith Kayat, a Vanderbilt student from Michigan whose sibling attends Michigan State, told the Hustler the use of AI was “disgusting”.",
        "“Deans, provosts, and the chancellor: do more. Do anything. And lead us into a better future with genuine, human empathy, not a robot,” Kayat said."
      ]
    },
    {
      "title": "Dansk and the Promise of a Simple Scandinavian Life",
      "page": [
        "To revisit this article, select My Account, then View saved stories",
        "To revisit this article, visit My Profile, then View saved stories",
        "By Alexandra Lange",
        "In the summer of 1958, the sleek, modernist Statler Hilton in Dallas hosted the presentation of the Neiman Marcus Fashion Award, an annual prize created by the department-store president Stanley Marcus and his aunt Carrie Marcus Neiman. Onstage that day were Yves Saint Laurent, fresh from the creation of his Trapeze line, which freed the waist; the children’s couturier Helen Lee, known for bright, poofy girls’ dresses; and a rather standoffish Danish housewares designer named Jens Quistgaard, plucked from the remote island where he lived, wearing antiquated knickerbockers and sailor’s shoes. Under the headline “Designing Dane, Isle’s Only Man,” a reporter for the Atlanta Journal later warned, “All you men who have wives with roving eyes, blindfold them—HURRY! The bearded Dane . . . is in town today, and the ladies are giving him looks akin to those you gave Brigitte Bardot at the movies the other night—remember?” The next day, a trifecta of models, wearing Y.S.L. sweaters and Pucci pants, posed with an ice bucket designed by Quistgaard held high like a trophy. Danish design was having its “Mad Men” moment.",
        "In a classic American twist, the brand that Quistgaard was promoting while wearing his “customary attire of Copenhagen,” as another retailer put it, wasn’t Danish at all. Dansk originated from Great Neck, on Long Island. “ ‘Dansk’ is like when you sell vodka in the USA,” Quistgaard told his biographer, Stig Guldberg. “You use its Russian name and you kind of keep the original letters on the bottle and brochures.” Guldberg’s new monograph from Phaidon, “Jens Quistgaard: The Sculpting Designer,” seeks to disentangle the man from the brand, but the housewares consumer of 2023 treats the book like a catalogue. Yes, I would like Fjord flatware, which almost seamlessly combines teak with enamelled steel. Yes, I would like an enamelled Købenstyle casserole, whose lid serves as a trivet, in brilliant red or turquoise. Yes, I would like a wenge bowl with matching salad servers, which cleverly hook on the side. Yes, I will cook and eat an Emily Nunn salad, an Alison Roman pasta, a Smitten Kitchen bake, from any of the above. The life style that Quistgaard’s design suggested—and that the Dansk founders Ted and Martha Nierenberg deftly promoted—so closely aligns with how we aspire to live now that the food-media juggernaut Food52, which acquired the Dansk brand in 2021, has begun a series of reissues and planned collaborations with contemporary designers.",
        "In 1954, the Nierenbergs—Ted, an American entrepreneur; Martha, a biochemist and Hungarian Jewish refugee—were on a delayed honeymoon in Europe, seeking European design that might appeal to the burgeoning U.S. market for home goods. At the Center for Danish Arts and Crafts in Copenhagen, they asked for artist recommendations, and were presented with a pile of unlabelled photos of recent work. From that pile, they selected ten designs; eight of them turned out to be by Quistgaard. They called him right from the center, and, after he gave them the brushoff (“I was in the process of casting something, so I wasn’t interested in seeing any strangers”), the Nierenbergs showed up on his doorstep. “And that was the start of Dansk Designs. That afternoon,” he told Guldberg.",
        "Absent the Nierenbergs, Quistgaard would likely have had a successful, if small-scale, career. He was the son of a sculptor, and he had dropped out of school and apprenticed with his father, a man who was stinting in his praise. Quistgaard did not attend the Royal Academy of Art, or socialize with other Danish designers who were achieving fame in the nineteen-fifties. His standoffishness, combined with a willingness to embrace industrial production, made him a figure of both disapproval and envy. But, like his peers, he understood that times, and homes, were changing. People didn’t want silver flatware, which was expensive, high-maintenance, and formal. And people didn’t want china serving dishes, which were too matchy-matchy and best suited to multicourse meals. Quistgaard’s stainless-steel-and-teak Fjord flatware, and his stove-to-table Anker Line casserole, were not only great to look at but pointed toward a more relaxed home life.",
        "“Jens Quistgaard” is a designer’s book, tightly focussed on materials and construction details. This is apparent from the moment you pick it up, running your fingers over the embossed spine, which is colored and textured like the signature braided plastic wrapping of the Købenstyle pitcher. That wrapping, which resembles a woven wicker chair, is a good example of Quistgaard’s willingness to play to American tastes: he used stainless steel rather than costly silver for the body of the pitcher, but then dressed up the industrial product with a handmade element, originally executed at a workshop staffed by blind people. “Born in the old world, designed for the new,” was how the promotional copy for the Købenstyle line read.",
        "To better understand Dansk’s cultural milieu, one has to turn to “Scandinavian Design and the United States, 1890-1980,” the catalogue for an exhibition of the same name opening at the Milwaukee Art Museum on March 24th, after a run at LACMA. (I have an essay on Scandinavian design for children in this catalogue.) “Goods were sold to American consumers by evoking a constructed ‘Scandinavian dream’ that paralleled the mythic ‘American dream,’ linking the ownership of such objects with comfortable, modern living,” writes Monica Obniski, curator of Decorative Arts and Design at the High Museum of Art, and co-curator of the exhibition with LACMA’s Bobbye Tigerman.",
        "Americans had begun to buy Scandinavian goods before the First World War, patronizing shops like Georg Jensen in New York City for silver and jewelry. But postwar prosperity, and an increasing number of modernist houses, provoked a boom in what we would now call life-style stores—Design Research in Cambridge, Adler Schnee in Detroit, Baldwin Kingrey in Chicago—which sold Dansk alongside products like Akari lamps, Marimekko textiles, and Alvar Aalto furniture. The stores would mix and match pieces by designers from across Scandinavia and around the world whose work emphasized craftsmanship, simplicity, and informality. Arrayed among true products of Scandinavia (or, in the case of Akari, Japan), Dansk seemed like a brilliant fake. Obniski describes how “for many Americans, the housewares company Dansk was the epitome of Scandinavian design, to the point that many did not realize it was technically an American company.”",
        "If you grew up in an academic family in Cambridge in the nineteen-seventies, as I did, these objects were just part of the daily fabric, along with paper-globe lights, wooden Unit Blocks, and corduroy overalls. The modern home design sold at these stores was meant to, among other things, free women from the kitchen by suggesting more casual ways of entertaining. Dansk, and others, made stacking stoneware plates meant for a buffet, and colorful pots that looked just fine in the center of the table. The low, wide-mouthed Købenstyle dish often referred to as a “paella pan” encouraged stews and casseroles rather than separate (and separately cooked) meat, starch, and veg. In their 1950 “Guide to Easier Living,” the American designing couple Mary and Russel Wright stressed efficiency and organization, creating a chart that showed how a cafeteria-style meal created fewer dishes to wash. The recent auction of Joan Didion’s possessions included her (rather dirty) yellow Købenstyle baker alongside a Le Creuset.",
        "Quistgaard would eventually design a house for the Nierenbergs, who moved their operations from Long Island to Westchester. The house, completed in 1961, looks like a wooden ship improbably brought to ground in the exurbs, with a sawtooth metal roof, a staircase that strongly resembles Quistgaard’s famous Viking-helmet ice bucket, and custom brass hardware, including a monogram “N.” Although the house (now a wellness retreat) is grand, Quistgaard didn’t forget about the practicalities that Dansk customers cared about. “He based his design of functional analyses of the working procedures in the kitchen and of the most appropriate and logical positions for each individual item or piece of equipment for easy and convenient operation,” Guldberg writes. Drawers and cupboards with flatware and plates were placed so “close to hand that after spending a month or so in the house, without thinking, you would be able to stick your hand into a drawer or cupboard and grab whatever you needed,” Quistgaard told him.",
        "What happened? The nineteen-seventies happened, and, with them, both the end of American domestic expansionism and a new weariness with modernism. The nineteen-eighties happened, and, with them, the offshoring of manufacturing and a decline in quality of production for Dansk and other housewares companies. The Nierenbergs sold the company in 1984, and Dansk International ended up as a subsidiary of Lenox, which continued to reissue pieces, many sold through Food52’s e-commerce platform. In 2021, Lenox was down, Food52 was up, and the Web site made a deal to acquire the brand and its seventy years of archives.",
        "“Food52 started as—and to a large extent still is—a community,” Dansk’s brand strategist Christine Muhlke told me. “There’s a shared aesthetic, a shared pleasure in cooking, bringing people together around the table.” She sees a direct parallel between today’s tastes and those recognized by Quistgaard and the Nierenbergs in the nineteen-fifties when “there was a shift toward something more casual. Servicemen returning home were much more travelled, too, and had been exposed to great design.” The pitcher with the wrapped handle, reissued by Food52 in early 2021 in four colors, sold out immediately and generated a fifteen-hundred-person wait list—and this in a time when most people seem to drink from giant pastel insulated cups. A sale of vintage Dansk, organized by Muhlke, mostly sold out within eleven minutes. “Millennials and Gen Z are all about circular retail,” she said, of people buying secondhand and valuing brands that use recycled materials and production processes that reduce waste.",
        "When Quistgaard picked cobalt blue and flame red for his cast-iron Anker Line, he had no data beyond his own horror at the blandness of the competition. There’s some irony that, in order to free ourselves from the beigeness of West Elm, or that pink Instagram skillet, we have to turn to a long-dead bearded Dane or direct-to-consumer homages like Great Jones. But I’ll take it. On a day-to-day basis, what will make you happier—a Y.S.L. sweater or a cheerful set of pots? “I’m a zero-clutter person,” Muhlke said, “and I have three Dansk pots displayed on my stove like they are sculpture.” ♦",
        "An earlier version of this article misstated the type of steel used in the Købenstyle pitcher.",
        "Queen Elizabeth II’s fine-tuned feelings.",
        "After Muhammad Ali, Richard Pryor was the baddest person anywhere.",
        "John and Yoko take Manhattan.",
        "Edith Piaf’s thousand (delightful) ways to bum you out.",
        "Searching for signs of Oprah in O magazine.",
        "Hattie McDaniel arrives at the Coconut Grove.",
        "Fiction by Miranda July: “Roy Spivey.”",
        "Sign up for our daily newsletter to receive the best stories from The New Yorker.",
        "By signing up, you agree to our User Agreement and Privacy Policy & Cookie Statement.",
        "By Rebecca Mead",
        "By Hannah Goldfield",
        "By Simon Parkin",
        "Sections",
        "More",
        "© 2023 Condé Nast. All rights reserved. Use of this site constitutes acceptance of our User Agreement and Privacy Policy and Cookie Statement and Your California Privacy Rights. The New Yorker may earn a portion of sales from products that are purchased through our site as part of our Affiliate Partnerships with retailers. The material on this site may not be reproduced, distributed, transmitted, cached or otherwise used, except with the prior written permission of Condé Nast. Ad Choices"
      ]
    },
    {
      "title": "Museum displays artwork created by AI in place of Girl with a Pearl Earring",
      "page": [
        "The Mauritshuis caused some controversy by hanging an artwork created with artificial intelligence in the spot usually occupied by Johannes Vermeer’s Girl with a Pearl Earring.",
        "The Vermeer masterpiece is currently on loan to the Rijksmuseum for its Vermeer exhibition. In its absence, the Mauritshuis called on the public to create “your own girl,” inspired by the Vermeer painting, to hang in its place.",
        "According to the museum, the call sparked an explosion of creativity. It received 3,482 entries, including photographs, sculptures, crochet pieces, paintings, and even one composed of vegetables. A jury of judges chose five to hang in the museum. The entries and winners can be seen on the museum's website here.",
        "One of the chosen art pieces is A Girl With Glowing Earrings, by Julian van Dieken. He used the AI Midjourney to help create it and then Photoshop to fine-tune the result.",
        "Van Dieken is delighted, he said on Instagram. “My AI image is hanging in a museum. In the Vermeer room. At the same spot where the ORIGINAL Gilr with a Pearl Earring usually hangs,” he said, \"Yes literally. And yes, I'm serious.\"",
        "Midjourney is one of several AI generators that have added a computer twist to the age-old debate on where the line lies between plagiarism and inspiration in art. You give the AI a text prompt - for example, make a portrait of a beautiful girl with glittering earrings in the style of Vermeer - and it generates the image from its dataset.",
        "The datasets are the primary source of the controversy around these programs. So far, AIs can’t create something from nothing, only copy and combine what they’ve been fed. And their datasets commonly consist of billions of images used without the artists’ permission.",
        "Artist Eva Toorenent advocates for legislation and rules for what she calls “unethical technology” with her organization, European Guilt for Artificial Intelligence Regulation (EGAIR). “While Midjourney makes a lot of money with this software, the artists and creators whose work is involuntarily included in this dataset see nothing in return,” Toorenent said to the Volkskrant. “Without the work of human artists, this program could not generate any works at all. The higher the quality of art in the dataset, the higher the quality of the AI art.”",
        "Toorenent called it bizarre that the Mauritshuis singled out an AI creation. “That is quite something. With this, the museum is actually saying: we think this is okay.”",
        "A spokesperson for the Mauritshuis told the Volkskrant that the Vermeer action was not meant to make a statement. “It was important to us that people were inspired by Girl with a Pearl Earring.” The jury did not look at the ethical issues behind the entries. “We purely looked at what we liked. Is this creative? That’s a tough question.”",
        "© 2012-2023, NL Times, All rights reserved."
      ]
    },
    {
      "title": "Bifurcate the Problem Space",
      "page": [
        "I recently read Hillel Wayne's newsletter issue on debugging. In it, Hillel's advises the reader to \"ask broad questions\" in order to improve your debugging skills. As I was reading, it occurred to me that this was a technique I'd seen advocated before in Stuart Halloway's Debugging with the Scientific Method. Halloway calls it \"carving the world in half\" or \"proportional reduction.\" I watched his talk when it was released in 2015 and somehow internalized the phrase, bifurcate the problem space.†",
        "Bifurcating the problem space means running a test which will rule in or rule out a large number of possible root causes. When playing 20 questions, instead of immediately guessing \"Kevin Bacon,\" you start by asking, \"Is it a man or a woman?\" Doing so cuts down on half of all possible answers. Likewise, when solving a problem, you want to run tests that cut down a large number of possible root causes.",
        "Reading Wayne's newsletter reminded me that this technique is both unreasonably effective and yet, somehow, not terribly widespread. It is, admittedly, counterintuitive. Instead of asking the natural question, \"What is the answer?\" this approach pushes you to ask some version of, \"What might not be the answer?\"",
        "That said, the cost-to-benefit ratio for adopting this strategy is outrageously good compared to many strategies which, for whatever reason, did manage to catch on. Asking broad questions usually costs some number of minutes, and the benefit is you solve your problem in minutes or hours instead of weeks or never.",
        "As I was reading Wayne's post, I began to think that others might find it helpful to see an example of how to use this approach in real life. I can think of a few such examples, but one incident in particular stands out in my memory.",
        "Some time ago, I was working at a company that had the following backend architecture:",
        "Of course, as is the case with all architecture diagrams, the above picture is massively simplified. In reality, there were multiple web servers sitting behind load-balancing proxies, multiple databases of varying types, many hundreds of job runners spread across multiple datacenters (also sitting behind load-balancing proxies), and a few queues tossed in for good measure.",
        "As one might guess, occasionally Job Runner A would reject a job. When that happened, the job was supposed to be sent to another job runner, Job Runner B.",
        "One day we deployed a new version of the Job Runner. In that deploy, there was a misconfiguration of Job Runner A which caused every job to be rejected. However, instead of falling back to Job Runner B as it was supposed to, the Web Server reported in the database that Job Runner A accepted the job.",
        "This was not good. The end result was that jobs would appear to clients as if they were running forever.",
        "So the problem could be in a couple of places:",
        "Now the question is: What do you do?",
        "You could assume the problem is in the Web Server and start debugging the Web Server code. Alternatively, you could assume the problem was in the Job Runner and start debugging that code.",
        "However, if you were trying to bifurcate the problem space, you would look for a way to disqualify either the Web Server or the Job Runner. Doing so isolates the problem to one codebase or the other.",
        "In our case, we decided to test the Job Runner by removing the Web Server as a variable. We replicated the exact calls made to the Job Runner from the command line. If we could get the Job Runner to erroneously return \"Success\" instead of \"Error,\" we would know the problem is in the Job Runner. Otherwise, we have very strong evidence (but not proof) that the problem is in the Web Server.",
        "After half a dozen tries, we were unable to get the Job Runner to give us an incorrect \"Success\" status. Awesome! The problem is likely in the Web Server. We just bifurcated a problem space that included two machines to a problem space that only includes one!",
        "Assuming we didn't completely flub the DB write (possible, but unlikely), the problem was somewhere in the code path that handles job submission. Unsurprisingly, there were multiple layers of code where the error could be occurring. A simplified version of the code looks something like:",
        "Except each function was in its own file, and each function was itself broken up into smaller bits which were in their own files, and what was being passed around wasn't a request plus a job_runner string, it was a bunch of different objects holding a bunch of information.††",
        "So the problem could be in any of the following spots:",
        "Once again, our question is: What do you do?",
        "You could assume the problem is in the http request and start debugging that. Or you could assume it's in the retry code, and start there.",
        "Or you could try and bifurcate the code architecture.",
        "We decided to cut out the circuit breaker and retry logic. We commented out those functions, made them no-ops, and re-ran a job. It stored the wrong value to the database.",
        "Nice! Now we know the problem is in one of:",
        "The next part is tricky. We could not easily comment out the remainder and maintain enough functionality to have a viable test. Therefore, we started debugging each function individually, starting with handleRequest. However, we did not set out to prove handleRequest was the culprit. Rather, we set out to prove it was not the culprit. Our goal was to isolate the problem, not to solve the problem.",
        "Instead of carefully reading the code in handleRequest, adding print statements and the like, we simply invoked handleRequest directly to see if we could get it to erroneously report a success. After a few tries, it became clear that it was working properly, so we moved on to the submit call. Invoking it directly, we found that it did, in fact, return a response with the wrong jobRunner.",
        "Bingo!",
        "We were down to three possible spots:",
        "Once again, we ask: What do you do?",
        "By now, you know then answer is: Bifurcate the function!",
        "Luckily, there was a built-in way to split this code. Toggling retryCheckFeatureFlag shuts off half of the conditionals in the function, thereby isolating the other half. Doing that, we found we were unable to replicate the issue, so the problem wasn't in retryWithOtherRunner. Now we know for certain that the problem is somewhere in this code:",
        "Running checkIfActuallyReceived in isolation showed that it did in fact return true even when the Job Runner failed.††† We did it! Mission accomplished.",
        "Hopefully this was a helpful illustration of how to put Bifurcating the Problem Space into practice. It is a true story. The details are anonymized, but I had a fair amount of notes lying around, so it's a pretty accurate portrayal of what happened.",
        "As you can see, this is a recursive practice. You apply it at the top to cut as much of the problem space as possible. Then you apply it at the next level down, then the next level down, until you get to a single branch in the code.",
        "I also want to highlight a couple of common bifurcating techniques showcased in this story:",
        "Lastly, I will note, while it is generally useful, bifurcating the problem space really shines when you've exhausted the obvious leads. It turned out that the bug in checkIfActuallyReceived had been living undetected in production for several months. Had it been a recent change, I suspect we would have been able to guess the cause much more quickly.",
        "† If you'd asked me where I learned that phrase before I wrote this article, I would have told you it was from Debugging with the Scientific Method. I searched through the talk transcript, and I can find no mention of \"bifurcate\" whatsoever. I suppose I either made it up or unknowingly picked it up from someone else.",
        "†† Don't bother reading too much into that code. It looks very little like the actual code anyways. The point here is to show how convoluted a relatively straightforward interaction can become.",
        "††† The actual problem ended up being something to do with the code expecting a list of null when it actually got a list of empty lists in return. Plus one for the type checkers.",
        "A big thank you to Max Shenfield and Chris Sims for their inspiration to start writing again and for their feedback on this article."
      ]
    },
    {
      "title": "Fastbook: Listen to audiobooks faster (2020)",
      "page": [
        "Aaron Mayer aims to listen to 100 audiobooks in a single month. He intends to listen to these audiobooks at 2x - 3x speed. Intense!",
        "For the last few weeks, I’ve been working on automatic video editing tools. And one of the core features I’ve been working with is automatic speed adjustments to videos to eliminate silent airtime and make the videos more engaging. This seems like a perfect fit for Aaron’s challenge.",
        "I’ve adapted this tooling into a new tool I’m calling Fastbook. It accepts audiobooks in the form of .wav files, and can apply speed adjustments to the silence and the spoken word independently, even removing silence entirely if desired.",
        "If Aaron can already comfortably (with great focus) listen to a book at 2.5x speed, he can listen to a 10 hour book in 4 hours. If 20% of that book is actually silence, then the 10 hour book becomes an 8 hour book with silence removed, and the total listen time drops to just 3h12. I think 20% may actually be a conservative estimate for silent time, though it will vary from narrator to narrator.",
        "Estimating 45 minutes saved per book, this tool can save over 3 days total time across 100 books. Or, alternatively, Aaron could drop the playback speed down from 2.5x to 2x without increasing his total listening time at all, but potentially helping out his comprehension substantially.",
        "This tool won’t be appropriate for all audiobook listeners. For many, the silences matter, and removing them would degrade the quality of the book. For many, listening at 2.5x would also degrade the quality of the book. So use this tool with caution.",
        "For those of you who are intersted, however, here’s how to use Fastbook.",
        "I’ve made Fastbook available for free on GitHub. You can access it here.",
        "To use it, save it to your computer as fastbook.py.",
        "Next, make sure you have all the dependencies installed. See the dependencies section for what is required.",
        "You need your audiobook in wav format to use Fastbook.",
        "To convert an audiobook to wav, use ffmpeg.",
        "Install ffmpeg. Then, run ffmpeg -i book.aax book.wav to convert an Audible audiobook to a wav file. There may be an additional step if your aax file is DRM protected.",
        "Now you can use Fastbook like this:",
        "--audio_path should point to an existing wav file that you downloaded or generated in the pre-work section. --output_path is the path to the file that Fastbook will generate. Finally, --loud_speed is how much to speed up the normal spoken text of the book by, and --quiet_speed is how much to speed up the silence in the book by. You can remove silence by setting --quiet_speed=99999 or any other similarly large number.",
        "Here are the dependencies you need to use Fastbook.",
        "First, you need Python 3. You can follow these instructions to set up Python 3 if you don’t already have it installed.",
        "Then, you need these Python dependencies: fire, scipy, tqdm, numpy, and audiotsm. Install these with pip install fire scipy tqdm numpy audiotsm or use your favorite Python package manager.",
        "Finally, to do the pre-work, you will likely need ffmpeg. Installation instructions are available here.",
        "I recommend for Aaron to use the default speed settings of --loud_speed=1 --quiet_speed=5. This won’t eliminate the silence entirely, but will reduce the audio time considerably. Then, for the remaining speed-up, I suggest using whatever media player you were already using, such as VLC which supports arbitrary speed adjustments in real time. Hpy rdng!",
        "This blog post, narrated slowly:",
        "Your browser does not support the audio element.",
        "This blog post again, now with just the silence accelerated:",
        "Your browser does not support the audio element.",
        ""
      ]
    },
    {
      "title": "The time it takes to change the time (2015)",
      "page": [
        "By Stefano Maggiolo",
        "You might remember from last year my map showing the difference between solar time and standard time; you might because it was by far the most shared content I created, and somebody even uploaded it to Wikipedia for the time zone article. But with great power comes great responsibility (…); in this case it means keeping the map up to date as the whims of the time regulators change. You would think this is a rare event, but when you consider the 200 or so sovereign states in the world, and the quadratic number of possible conflicts between them, it becomes a frequent event.",
        "Indeed, the triggering event that prompted me to draw a new version wasn’t the bad color choice of the first attempt (for many people, green and red do not play well together), neither the small mistakes in the zone divisions, and not even some political faux pas (not marking Taiwan in the same way as most other sovereign states). After all, the map was drawn on top of an existing one found on Wikipedia, with just minor modifications apart from the gradients.",
        "The real reason is that just a few months after releasing my map, Russia decided to change the time in most of the country. Since Russia extends to about 3.5% of the world’s area and 11.5% of the emerged lands area, the issue was too obvious to ignore.",
        "Apart from this big change, the new map reflects that some territories in Ukraine and Georgia follow Moscow time instead of their countries’ timezone, and the introduction of the “Southeast” timezone (permanent UTC-05:00) in Quintana Roo, Mexico. Continental Mexico is about 30 degrees of longitude wide, from Tijuana to Cancun, so two timezones would make sense, instead it has four!",
        "Overall, the map is still skewed towards the red (which means that the solar noon is later in the day), and most of what could be observed from the first version is still valid. In particular, for the joy of reddit commentators, China is still very red.",
        "Sadly, one change did not happen: Australia still refuses to make Central Western Time, aka the awesome UTC+08:45 timezone, official. You see how the difference between Western and Central Australia is a whole hour and a half? This is not a big problem because no people live on the transition zone, apart from a very narrow strip of 350km along the southern coast, on the road between Perth and Adelaide, where about 200 proud people live on their own time.",
        "If made official, it would be the timezone with the fewer residents (followed by UTC+10:30, Lord Howe Island, with about 360, and UTC+12:45, Chatham Islands, with about 600), apart from the ephemeral UTC-12:00 timezone: only a few birds inhabit the two US islands of Howland and Baker, that are the only emerged lands in it, with their whopping 4 squared kilometers. But, since they are uninhabited, nobody ever said what time they should follow, and they are unofficially UTC-12:00 just because they happen to be at the correct longitude..",
        "I mentioned that 90 minutes is an unusual large difference between neighboring timezones, since of course the usual is one hour. But there are many places with much larger differences: these always involve China, thanks to its single, big, timezone. The worst offender here is the 90 kilometers border between Afghanistan (UTC+04:30) and China (UTC+08:00): a difference of three hours and a half!",
        "Drawing the first version of this map was a very long process done more or less by hand, modifying the source of an existing SVG file, and I definitely did not want to go over the same process again (and again when something else changes). So I blatantly ignored xkcd and proceeded to Create the Tool that would Create the Map for me. The real value of the tool for the future depends on the availability of up to date data, still I can trick myself into thinking I saved time.",
        "All the tools I will mention in the following can be found in the solar time vs standard time repository.",
        "Looking at a map, people often do not realize how many ingredients combine to create it;  we take a lot of things for granted. This map has probably a sub-average number of ingredients, though we can see:",
        "Luckily, there are datasets available for most of these; some with a unique source, maybe slightly out of date, some with more sources. It turns out that choosing the best in terms of accuracy and license is an important step when creating a map programmatically. In our case, timezones come from Eric Muller’s website, and the same for country boundaries (these in turns come from the FIPS dataset). Homogeneity is an important quality, and since timezone boundaries is a very rare dataset, it made sense to take the country boundaries from Eric as well. Coordinates of major cities (with other info useful to select whose to show) instead came from the ESRI datasets.",
        "But getting the data is just the first step. The second is not very hard: draw the SVG with the boundaries. This involves some templating to create the file and most importantly translating latitude and longitude into pixel coordinates (that is, the choice of a projection). Again, I was constrained to a rectilinear projection because drawing the gradients was much simpler, so I sticked with the Miller.",
        "Third step, writing the labels. Here there is an important choice: is it faster to design an algorithm that tries to place the labels automatically, or to place them semi-manually? The first option is not that easy: I would frame it as an optimization problem, where the function to optimize depends on the distance between the labels and what they refer to, on their size, and on how much they overlap, but I admit I did not try this. Instead, the semi-manual approach consists in placing the labels in a reasonable position (at the centroid of the country, and anchored to the coordinates of the city), and then to tweak the labels that need tweaking.",
        "Fourth step is drawing the labels and lines of the timezones. For the labels, I just wrote a list of positions I wanted, so again very manual. For the lines, in theory a good approximation could be just drawing 24 equispaced meridians, but the map becomes very hard to read. To make easier the job of drawing a lot of polylines on a map, I wrote a very simple helper tool based on Maps API, that allows to draw directly on the map and retrieve the coordinates of the vertices in a JSON format.",
        "Finally, the last step: data correction! Eric Muller’s data sadly is not completely up to date. Some fixes are easy (just changing the offset of a few timezones), others are not so simple, and I eventually decided to just use GIMP to draw over the final image generated by the program (which explains the GIMP file in the repository). Shifting the center of the map so that the cut point is not over Siberia was also done in postprocessing; in theory it should be easy to do at the projection stage, but the source datasets already split all lands on the 180 meridian, which made more convenient to use the same cut point in the projection."
      ]
    },
    {
      "title": "Rust-sitter: Define your entire tree-sitter grammar in Rust code",
      "page": [
        "Use Tree Sitter to parse your own languages in Rust",
        "Use Git or checkout with SVN using the web URL.",
        "Work fast with our official CLI.      Learn more.",
        "Please                sign in                to use Codespaces.",
        "If nothing happens, download GitHub Desktop and try again.",
        "If nothing happens, download GitHub Desktop and try again.",
        "If nothing happens, download Xcode and try again.",
        "Your codespace will open once ready.",
        "There was a problem preparing your codespace, please try again.",
        "Rust Sitter makes it easy to create efficient parsers in Rust by leveraging the Tree Sitter parser generator. With Rust Sitter, you can define your entire grammar with annotations on idiomatic Rust code, and let macros generate the parser and type-safe bindings for you!",
        "First, add Rust/Tree Sitter to your Cargo.toml:",
        "Note: By default, Rust Sitter uses a fork of Tree Sitter with a pure-Rust runtime to support wasm32-unknown-unknown. To use the standard C runtime instead, disable default features and enable the tree-sitter-standard feature",
        "The first step is to configure your build.rs to compile and link the generated Tree Sitter parser:",
        "Now that we have Rust Sitter added to our project, we can define our grammar. Rust Sitter grammars are defined in annotated Rust modules. First, we define the module that will contain our grammar",
        "Then, inside the module, we can define individual AST nodes. For this simple example, we'll define an expression that can be used in a mathematical expression. Note that we annotate this type as #[rust_sitter::language] to indicate that it is the root AST type.",
        "Now that we have the type defined, we must annotate the enum variants to describe how to identify them in the text being parsed. First, we can apply rust_sitter::leaf to use a regular expression to match digits corresponding to a number, and define a transformation that parses the resulting string into a u32.",
        "For the Add variant, things are a bit more complicated. First, we add an extra field corresponding to the + that must sit between the two sub-expressions. This can be achieved with text parameter of rust_sitter::leaf, which instructs the parser to match a specific string. Because we are parsing to (), we do not need to provide a transformation.",
        "If we try to compile this grammar, however, we will see ane error due to conflicting parse trees for expressions like 1 + 2 + 3, which could be parsed as (1 + 2) + 3 or 1 + (2 + 3). We want the former, so we can add a further annotation specifying that we want left-associativity for this rule.",
        "All together, our grammar looks like this:",
        "We can then parse text using this grammar:",
        "Rust Sitter supports a number of annotations that can be applied to fields in your grammar. These annotations can be used to control how the parser behaves, and how the resulting AST is constructed.",
        "The #[rust_sitter::leaf(...)] annotation can be used to define a leaf node in the AST. This annotation takes a number of parameters that control how the parser behaves:",
        "This annotation can be used to define a left/right-associative operator. This annotation takes a single parameter, which is the precedence level of the operator (higher binds more tightly).",
        "This annotation can be used to define a field that does not correspond to anything in the input string, such as some metadata. This annotation takes a single parameter, which is the value that should be used to populate that field at runtime.",
        "This annotation marks the field as a Tree Sitter word, which is useful when handling errors involving keywords. Only one field in the grammar can be marked as a word.",
        "Rust Sitter has a few special types that can be used to define more complex grammars.",
        "To parse repeating structures, you can use a Vec<T> to parse a list of Ts. Note that the Vec<T> type cannot be wrapped in another Vec (create additional structs if this is necessary). There are two special attributes that can be applied to a Vec field to control the parsing behavior.",
        "The #[rust_sitter::delimited(...)] attribute can be used to specify a separator between elements of the list, and takes a parameter of the same format as an unnamed field. For example, we can define a grammar that parses a comma-separated list of expressions:",
        "The #[rust_sitter::repeat(...)] attribute can be used to specify additional configuration for the parser. Currently, there is only one available parameter: non_empty, which takes a boolean that specifies if the list must contain at least one element. For example, we can define a grammar that parses a non-empty comma-separated list of numbers:",
        "To parse optional structures, you can use an Option<T> to parse a single T or nothing. Like Vec, the Option<T> type cannot be wrapped in another Option (create additional structs if this is necessary). For example, we can make the list elements in the previous example optional so we can parse strings like 1,,2:",
        "When using Rust Sitter to power diagnostic tools, it can be helpful to access spans marking the sections of text corresponding to a parsed node. To do this, you can use the Spanned<T> type, which captures the underlying parsed T and a pair of indices for the start (inclusive) and end (exclusive) of the corresponding substring. Spanned types can be used anywhere, and do not affect the parsing logic. For example, we could capture the spans of the expressions in our previous example:",
        "Boxes are automatically constructed around the inner type when parsing, but Rust Sitter doesn't do anything extra beyond that.",
        "Use Tree Sitter to parse your own languages in Rust"
      ]
    }
  ],
  "_id": "63f6330265c310c47b8da5ab"
}


export default async function handler(req, res) {

	const mongoClient = await clientPromise;
	const db = mongoClient.db(process.env.MONGO_DB_NEWS);
	const collection = db.collection(process.env.MONGO_COLLECTION_HN);

	if(req.method === 'GET') {}

	try {
		// const hnUlr = 'https://news.ycombinator.com/news?p=1';
		// const scrapHNs = await scrapPage(hnUlr, extract_rules_hn)

		// const pagesHN = scrapHNs.title.map((item) => {
		// 	return {
		// 		name: item.name[0],
		// 		link: item.links[0]
		// 	}
		// });

		// console.log('hacker news data', pagesHN)

		// let dataPages = [];
		// let page = '';
		// for(let i in pagesHN) {
		// 	const { name, link } = pagesHN[i];
		// 	console.log('scrapHNs#scraping: ', name, link);
		// 	page = await scrapPage(link, extract_rules_page);
		// 	if(page && page.p) {
		// 		console.log('true | success');
		// 		dataPages.push({
		// 			title: name,
		// 			link: link,
		// 			page: page.p,
		// 		});
		// 	} else {
		// 		console.log(page, name, link)
		// 	}
		// 	// if(i > 5) break;
		// }

		// const data = {
		// 	created_at: new Date(),
		// 	data: dataPages,
		// }

		// await collection.insertOne(data)

		const data = dataPagesMockData;

		//TODO Con esta data, ahora tengo que llamar una función que resuma todo esto.
		const maxSentenceCount = 2;
		const summary = [];
		let resp = '';
		const pagesConcat = data.data.map(item => `title: ${item.title}. page: `.concat(item.page));
		for(let i in pagesConcat) {
			resp = await summarize([pagesConcat[i]], maxSentenceCount);
			data.data[i]['summary'] = resp;
			// summary.push(resp);
			console.log(i)
			// if(i > 2) break;
		}

		await collection.insertOne({summary: summary});

		// console.log('summary', summary);

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
