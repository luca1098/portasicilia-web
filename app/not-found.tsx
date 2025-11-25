import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
}
export default function NotFound() {
  return (
    <html>
      <body>
        <h1>Not Found</h1>
      </body>
    </html>
  )
}
