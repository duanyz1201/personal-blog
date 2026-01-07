'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

const defaultImages = [
  // 你的名字/新海诚风格
  "https://wallpapers.com/images/hd/your-name-background-e58k25175u777i6k.jpg",
  // 唯美天空
  "https://wallpapers.com/images/hd/anime-scenery-4k-2560x1440-wallpaper-r4i67a65977555p7.jpg",
  // 赛博朋克城市
  "https://wallpapers.com/images/hd/anime-city-background-1920-x-1080-3h112n72y2727672.jpg",
  // 宁静街道
  "https://wallpapers.com/images/hd/anime-street-1920-x-1080-background-q23526426426242.jpg", 
]

export function HeroCarousel({ images: propImages }: { images?: string[] }) {
  // 如果没有传入图片或者图片数组为空，使用默认图片
  const images = propImages && propImages.length > 0 ? propImages : defaultImages
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000) // 每5秒切换一次

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 h-full w-full"
        >
          <Image
            src={images[currentIndex]}
            alt="Hero Background"
            fill
            priority
            unoptimized
            className="object-cover"
            quality={90}
          />
        </motion.div>
      </AnimatePresence>
      
      {/* 视觉优化遮罩 */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* 左侧文字区域加深 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        
        {/* 底部渐变衔接：跟随主题背景色 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 dark:from-background via-slate-50/60 dark:via-background/60 to-transparent" />
      </div>
    </div>
  )
}
