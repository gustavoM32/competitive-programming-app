import '../styles/globals.css'

type MyAppProps = {
  Component: any,
  pageProps: any
}

function MyApp({ Component, pageProps }: MyAppProps) {
  return <Component {...pageProps} />
}

export default MyApp
