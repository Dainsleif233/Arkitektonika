import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
    const args = request.nextUrl.pathname.split('/').filter(Boolean);
    const method = request.method;

    if (method === 'OPTIONS') return new NextResponse(
        null,
        {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': process.env.ALLOW_ORIGIN ?? '*',
                'Access-Control-Allow-Methods': 'DELETE'
            }
        }
    );

    const unAuthResponse = new NextResponse(null, {
        status: 403,
        headers: { 'Access-Control-Allow-Origin': process.env.ALLOW_ORIGIN ?? '*' }
    });

    // 检查路由是否有效
    const isValidRoute = (action: string|undefined, expectedLength: number, allowedMethods: string[]) => {
        const actionIndex = process.env.PASSWORD ? 1 : 0;
        return args[actionIndex] === action && 
               args.length === expectedLength && 
               allowedMethods.includes(method);
    };

    // 无密码模式
    if (!process.env.PASSWORD) {
        if (isValidRoute(undefined, 0, ['GET']) ||
            isValidRoute('upload', 1, ['POST']) ||
            isValidRoute('download', 2, ['HEAD', 'GET']) ||
            isValidRoute('delete', 2, ['HEAD', 'DELETE']) ||
            isValidRoute('clean', 2, ['HEAD'])) {
            const nextResponse = NextResponse.next();
            nextResponse.headers.set('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN ?? '*');
            nextResponse.headers.set('X-Api-Version', process.env.npm_package_version as string);
            return nextResponse;
        }
        return unAuthResponse;
    }

    // 有密码模式
    if (process.env.PASSWORD === args[0]) {
        if (isValidRoute(undefined, 1, ['GET']) ||
            isValidRoute('upload', 2, ['POST']) ||
            isValidRoute('download', 3, ['HEAD', 'GET']) ||
            isValidRoute('delete', 3, ['HEAD', 'DELETE']) ||
            isValidRoute('clean', 3, ['HEAD'])) {
            // 重写URL，移除密码前缀，统一为无密码格式传递给后端
            const newUrl = new URL(request.url);
            newUrl.pathname = '/' + args.slice(1).join('/');
            const rewriteResponse = NextResponse.rewrite(newUrl);
            rewriteResponse.headers.set('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN ?? '*');
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
