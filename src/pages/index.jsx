import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import React, { useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

	const [response, setResponse] = useState();
	const { user, error, isLoading } = useUser();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const text = e.target.text.value;
		const res = await fetch('/api/davinci', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ prompt: text }),
		});
		const data = await res.json();
		console.log('data', data);
		setResponse(data.message);
	}

  return (
    <>
      <Head>
        <title>X Assistant</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
				<h1>Your personal assistant</h1>
				<p>Connect to different channels, whatsapp, slack</p>
				<p>teach new acknowledgment to your assistant based in text, audio, video</p><br/>
				<p>{response}</p>
				{user ?
					(<form onSubmit={handleSubmit}>
						<div className="upload-image">
							<input type="text" id="text" name="text"/>
							<button type="submit">Send</button>
						</div>
					</form>)
					: (
						<div>
							<input type="text" id="text" name="text"/>
							<button href="/api/auth/login">Send</button>
						</div>
					)
				}
      </main>
    </>
  )
}
