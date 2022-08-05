import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '../styles/globals.css'

type MyAppProps = {
  Component: any,
  pageProps: any
}

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: MyAppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}

export default MyApp
