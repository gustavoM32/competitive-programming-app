import { Button } from '@mui/material'

export default function Home() {
  return (
    <div>
      <main>
        <h1>Competitive Programming Web App</h1>

        <div>
          <Button href="/problems" variant="contained" target="_blank" rel="noopener">Problems</Button>
          <Button href="/problemLists" variant="contained" target="_blank" rel="noopener">Problem Lists</Button>
        </div>
      </main>
    </div>
  )
}
