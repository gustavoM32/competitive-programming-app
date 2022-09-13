import { render, screen } from '@testing-library/react'
import Home from './home'

test('loads and displays greeting', async () => {
  render(<Home />)

  expect(screen.getByRole('heading')).toHaveTextContent('Competitive Programming Web App')
})
