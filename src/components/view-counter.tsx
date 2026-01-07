'use client'

import { useEffect } from 'react'
import { incrementViewCount } from '@/app/actions'

export function ViewCounter({ slug }: { slug: string }) {
  useEffect(() => {
    // 页面加载后延迟一小会儿执行，避免影响首屏性能
    const timer = setTimeout(() => {
      incrementViewCount(slug)
    }, 1000)

    return () => clearTimeout(timer)
  }, [slug])

  return null // 这个组件不渲染任何东西
}
