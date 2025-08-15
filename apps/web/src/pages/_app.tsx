import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Urbanist } from 'next/font/google';

const urbanist = Urbanist({ subsets: ['latin'] });

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>NovaX Web</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<div className={urbanist.className}>
				<Component {...pageProps} />
			</div>
		</>
	);
}