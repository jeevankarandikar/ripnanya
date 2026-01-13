import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  // Upload functionality disabled - files will be added manually
  return NextResponse.json(
    { error: 'Upload functionality is currently disabled. Contact administrator to add media.' },
    { status: 503 }
  )
}
