import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function GET() {
  try {
    const metadataPath = path.join(process.cwd(), 'public', 'uploads', 'metadata.json')

    if (!existsSync(metadataPath)) {
      return NextResponse.json({ files: [] })
    }

    const metadataContent = await readFile(metadataPath, 'utf-8')
    const files = JSON.parse(metadataContent)

    return NextResponse.json({ files })
  } catch (error) {
    console.error('Error reading media:', error)
    return NextResponse.json({ files: [] })
  }
}
