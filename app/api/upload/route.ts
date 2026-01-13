import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const filename = `${timestamp}.${extension}`
    const filepath = path.join(uploadsDir, filename)

    // Write file
    await writeFile(filepath, buffer)

    // Save metadata to a JSON file
    const metadataPath = path.join(uploadsDir, 'metadata.json')
    let metadata: any[] = []

    if (existsSync(metadataPath)) {
      const metadataContent = await import('fs').then(fs =>
        fs.promises.readFile(metadataPath, 'utf-8')
      )
      metadata = JSON.parse(metadataContent)
    }

    const fileType = file.type.startsWith('image/') ? 'image' : 'video'
    metadata.push({
      id: timestamp.toString(),
      url: `/uploads/${filename}`,
      type: fileType,
      uploadedAt: new Date().toISOString(),
    })

    await writeFile(metadataPath, JSON.stringify(metadata, null, 2))

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}
