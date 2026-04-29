'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/shadcn.utils'
import { PlayCircleIcon } from '@/lib/constants/icons'
import { getYouTubeId, getThumbnailUrl } from '@/lib/utils/youtube.utils'
import type { SocialVideo } from '@/lib/schemas/entities/social-video.entity.schema'
import { api } from '@/lib/api/fetch-client'
import StoryViewer from './story-viewer'

export default function SocialVideoStoriesBar() {
  const [videos, setVideos] = useState<SocialVideo[]>([])
  const [scrolled, setScrolled] = useState(false)
  const [navbarHidden, setNavbarHidden] = useState(false)
  const [activeStory, setActiveStory] = useState<SocialVideo | null>(null)
  const params = useParams()
  const pathname = usePathname()
  const lang = params.lang as string

  const isHomePage = pathname === `/${lang}` || pathname === `/${lang}/`
  const isOnTopOfHomePage = isHomePage && !scrolled
  const isShopPage = pathname === `/${lang}/shop` || pathname.startsWith(`/${lang}/shop/`)

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentY = window.scrollY
      setScrolled(currentY > 100)
      setNavbarHidden(currentY > 100 && currentY > lastScrollY)
      lastScrollY = currentY
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    api
      .get<SocialVideo[]>('/social-videos')
      .then(setVideos)
      .catch(() => {})
  }, [])

  const visible = !isOnTopOfHomePage && !isShopPage && navbarHidden && videos.length > 0

  return (
    <>
      <div
        className={cn(
          'fixed left-0 right-0 z-30 bg-background border-b border-border transition-all duration-500 ease-out',
          navbarHidden ? 'top-0' : 'top-[57px]',
          visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        )}
      >
        <div className="flex justify-center gap-3 overflow-x-auto px-4 py-2 scrollbar-hide max-w-7xl mx-auto">
          {videos.map(video => {
            const videoId = getYouTubeId(video.url)
            const thumbnail = videoId ? getThumbnailUrl(videoId) : null

            return (
              <button
                key={video.id}
                type="button"
                onClick={() => setActiveStory(video)}
                className="flex shrink-0 flex-col items-center gap-1 focus:outline-none"
              >
                <div
                  className="size-[56px] rounded-full p-[2px]"
                  style={{
                    background: 'linear-gradient(135deg, #f9a825, #e91e8c, #6a11cb)',
                  }}
                >
                  <div className="relative size-full overflow-hidden rounded-full bg-background p-px">
                    <div className="relative size-full overflow-hidden rounded-full">
                      {thumbnail ? (
                        <Image
                          src={thumbnail}
                          alt={video.title ?? ''}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <PlayCircleIcon className="size-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {video.title && (
                  <p className="max-w-[60px] truncate text-[10px] text-foreground/70">{video.title}</p>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {activeStory && (
        <StoryViewer
          videos={videos}
          initialVideo={activeStory}
          onClose={() => setActiveStory(null)}
          lang={lang}
        />
      )}
    </>
  )
}
