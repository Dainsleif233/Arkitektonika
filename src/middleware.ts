import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
    const unAuthResponse = new NextResponse(null, {
        status: 403,
        headers: { 'Access-Control-Allow-Origin': '*' }
    });

    const args = request.nextUrl.pathname.split('/').filter(Boolean);
    const method = request.method;

    // 检查路由是否有效
    const isValidRoute = (action: string, expectedLength: number, allowedMethods: string[]) => {
        const actionIndex = process.env.PASSWORD ? 1 : 0;
        return args[actionIndex] === action && 
               args.length === expectedLength && 
               allowedMethods.includes(method);
    };

    // 无密码模式
    if (!process.env.PASSWORD) {
        if (isValidRoute('upload', 1, ['POST']) ||
            isValidRoute('download', 2, ['HEAD', 'GET']) ||
            isValidRoute('delete', 2, ['HEAD', 'DELETE'])) {
            const nextResponse = NextResponse.next();
            nextResponse.headers.set('Access-Control-Allow-Origin', '*');
            nextResponse.headers.set('X-Api-Version', process.env.npm_package_version as string);
            return nextResponse;
        }
        return unAuthResponse;
    }

    // 有密码模式
    if (process.env.PASSWORD === args[0]) {
        if (isValidRoute('upload', 2, ['POST']) ||
            isValidRoute('download', 3, ['HEAD', 'GET']) ||
            isValidRoute('delete', 3, ['HEAD', 'DELETE'])) {
            // 重写URL，移除密码前缀，统一为无密码格式传递给后端
            const newUrl = new URL(request.url);
            newUrl.pathname = '/' + args.slice(1).join('/');
            const rewriteResponse = NextResponse.rewrite(newUrl);
            rewriteResponse.headers.set('Access-Control-Allow-Origin', '*');
            rewriteResponse.headers.set('X-API-Version', process.env.npm_package_version as string);
            return rewriteResponse;
        }
    }

    return unAuthResponse;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image).*)'
    ]
}
