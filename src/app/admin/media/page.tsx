import { getMediaFiles } from "@/app/actions"
import { MediaGrid } from "@/components/media-grid"

export const dynamic = 'force-dynamic'

export default async function MediaPage() {
  const files = await getMediaFiles()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">媒体库</h1>
        <p className="text-muted-foreground">
          管理所有上传的图片文件。
        </p>
      </div>

      <MediaGrid files={files} />
    </div>
  )
}
