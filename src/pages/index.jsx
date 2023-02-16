import styles from '@/styles/Home.module.css'
import { Inter } from '@next/font/google'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

	const handleSubmit = async (e) => {
		e.preventDefault();
		const email = e.target.email.value;
		if (!email) return;
		try {
			const res = await fetch('/api/suscripter', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email: email }),
			});
			const data = await res.json();
		} catch (error) {
			console.log(error)
		}
		e.target.email.value = '';
	}

  return (
    <>
      <Head>
        <title>AI-Source</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <main className={styles.main}>
				<div className='content'>
					<h1>Get up-to-date Hacker News and Artificial Intelligence news faster</h1>
					<p>You lost great opportunities to be more competitive in your business</p>
					<p>Simplify your news intake with our daily insights and summaries</p>
					<p style={{color: "#D2691E"}}>We give you daily insights and summaries of the most important topics in AI and HN</p>
					<br/><form onSubmit={handleSubmit} class="suscription">
						<p>Enter your email to suscribe</p>
						<input className={styles.email} type="text" id="email" placeholder="example@email.com" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" />
						<button className={styles.suscribe} type="submit">suscribe</button>
					</form><br/>
					<p><u>Price: 4 USD/month</u></p>
					<p>You can select the Language of your preference</p>
				</div>
      </main>
    </>
  )
}
