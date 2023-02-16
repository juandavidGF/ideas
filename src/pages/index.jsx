import styles from '@/styles/Home.module.css'
import { Inter } from '@next/font/google'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

	const handleSubmit = async (e) => {
		e.preventDefault();
		const email = e.target.email.value;
		const res = await fetch('/api/suscripter', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email: email }),
		});
		const data = await res.json();
		console.log(data);
	}

  return (
    <>
      <Head>
        <title>News Fast</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <main className={styles.main}>
				<div className='content'>
					<h1>Get Hacker News and Artificial Intelligent news faster</h1>
					<p>You miss important information because you dont have enough time to review all the HN posts and more</p>
					<p>Be updated is key to make you and your Bussines more competitive</p>
					<p>We give to you daily summarize of HN and another sources of information</p><br/>
					<form onSubmit={handleSubmit} class="suscription">
						<p>Enter your email to suscribe</p>
						<input className={styles.email} type="text" id="email" placeholder="example@email.com" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" />
						<button className={styles.suscribe} type="submit">suscribe</button>
					</form>
				</div>
      </main>
    </>
  )
}
