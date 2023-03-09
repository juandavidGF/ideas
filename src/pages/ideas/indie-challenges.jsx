import Head from 'next/head'
import Link from 'next/link'
import { useState } from "react"
import styles from '@/styles/Indiecha.module.css'

export default function Indiechallenges() {

	const [statusSuscribe, setStatusSuscribe] = useState();

	const handleSuscribe = async (e) => {
		e.preventDefault()
		const email = e.target.email.value;
		if (!email) return;
		
		try {
			const res = await fetch('/api/new-suscripter', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email: email, appName: 'indie-challenge' }),
			});
			const data = await res.json();
			if(data.success === 'Ok') {
				setStatusSuscribe('Successful subscription')
			} else {
				setStatusSuscribe('Error')
			}
		} catch (error) {
			console.log(error)
		}
		e.target.email.value = '';
	}

	return (
		<>
			<Head>
				<title>Indie challenges</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				{/* <link rel="icon" href="/favicon.ico" /> */}
			</Head>
			<button className={styles.twitter}>
				<Link href="https://twitter.com/juandavid_gf">
					@juandavid_gf
				</Link>
				</button>
			<main className={styles.main}>
				<h1>Indie challenges</h1>
				<p>Hi, I’m Juan David. I’m an indiepreneur who loves building products.🚀</p>
				<p>Challenges can motivate us to be more productive, achieve our goals, and learn faster.👏</p>
				<p>Are you ready to join me? Let’s do this!💯</p>
				<p></p>
				<form onSubmit={handleSuscribe}>
					{/* <label htmlFor="email">emal: </label> */}
					<input type="text" id="email" name="email" placeholder='email@example.com' pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"/>
					<button type='submit'>Suscribe</button>
					<div id='status'>{ statusSuscribe }</div>
				</form>
			</main>
		</>
	)
}