import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  const { filename } = params;
  const filePath = path.join(process.cwd(), 'uploads', 'resource', filename);

  if (!fs.existsSync(filePath)) {
    return new NextResponse('文件未找到', { status: 404 });
  }

  try {
    const fileBuffer = await fs.promises.readFile(filePath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error('读取PDF文件失败:', err);
    return new NextResponse('服务器内部错误', { status: 500 });
  }
}