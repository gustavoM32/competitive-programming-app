import { Button } from '@mui/material'
import Head from 'next/head'

export default function Home() {
  return (
    <div>
      <Head>
        <title>CPWA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Competitive Programming Web App</h1>

        <div>
          <Button href="/problems" variant="contained" target="_blank" rel="noopener">Problems</Button>
        </div>
      </main>
    </div>
  )
}
