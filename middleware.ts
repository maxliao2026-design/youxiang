// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
    // 非 www（apex）一律 301 導到 www，合併重複索引的權重。
    // canonical 方向以 next-sitemap 的 siteUrl（www.memorycorner8.com）為準。
    const host = req.headers.get('host') || ''
    if (host === 'memorycorner8.com') {
        const url = req.nextUrl.clone()
        url.host = 'www.memorycorner8.com'
        url.protocol = 'https:'
        url.port = ''
        return NextResponse.redirect(url, 301)
    }

    // 其餘流量直接放行
    return NextResponse.next()
}

// 設定 Middleware 作用範圍
export const config = {
    matcher: '/:path*',
}