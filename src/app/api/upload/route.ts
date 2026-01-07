import { NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 生成唯一文件名，保留原始扩展名
    const originalName = file.name
    const ext = originalName.split('.').pop()
    const fileName = `${uuidv4()}.${ext}`
    
    // 保存到 public/uploads 目录
    const uploadDir = join(process.cwd(), "public/uploads")
    const filePath = join(uploadDir, fileName)
    
    await writeFile(filePath, buffer)

    // 返回可访问的 URL
    const url = `/uploads/${fileName}`

    return NextResponse.json({ url })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    )
  }
}
