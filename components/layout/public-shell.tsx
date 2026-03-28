import Navbar from '@/components/navbar/navbar'
import Footer from '@/components/footer/footer'
import SocialVideoStoriesBar from '@/components/social-video/social-video-stories-bar'
import { PropsWithChildren } from 'react'

export default function PublicShell({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <SocialVideoStoriesBar />
      {children}
      <Footer />
    </>
  )
}
