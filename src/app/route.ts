export async function GET() {
    return Response.json(
        {
            made: {
                with: 'Love',
                by: 'SysHub'
            },
            name: 'arkitektonika',
            version: process.env.npm_package_version
        }
    );
}
