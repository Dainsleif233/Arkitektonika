import packageJson from '../../package.json';

export async function GET() {
    return Response.json(
        {
            made: {
                with: 'Love',
                by: 'SysHub'
            },
            name: 'arkitektonika',
            version: packageJson.version
        }
    );
}
