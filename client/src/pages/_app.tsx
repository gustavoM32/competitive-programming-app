import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProps } from 'next/app'
import '../styles/globals.css'

const queryClient = new QueryClient()

function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}

export default App
