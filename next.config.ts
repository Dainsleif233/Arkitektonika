import type { NextConfig } from "next";
import packageJson from './package.json';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    typedRoutes: false,
  },
  webpack: (config, { isServer }) => {
    // 忽略 TypeORM 相关的警告
    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
      /Module not found: Can't resolve/,
    ];

    if (isServer) {
      // 忽略不需要的数据库驱动
      config.externals.push({
        'react-native-sqlite-storage': 'react-native-sqlite-storage',
        '@sap/hana-client': '@sap/hana-client',
        '@sap/hana-client/extension/Stream': '@sap/hana-client/extension/Stream',
        'mysql': 'mysql',
        'oracledb': 'oracledb',
        'pg-native': 'pg-native',
        'redis': 'redis',
        'ioredis': 'ioredis',
        'better-sqlite3': 'better-sqlite3',
        'sqlite3': 'sqlite3',
        'sql.js': 'sql.js',
        'mongodb': 'mongodb',
        'mssql': 'mssql',
        'react-native-sqlite-2': 'react-native-sqlite-2',
        'typeorm-aurora-data-api-driver': 'typeorm-aurora-data-api-driver'
      });
    } else {
      // 客户端也需要忽略这些模块
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        os: false,
        stream: false,
        util: false,
        url: false,
        assert: false,
        http: false,
        https: false,
        zlib: false,
        querystring: false,
      };
    }
    return config;
  },
  headers: async() => {
    return [{
      source: '/(.*)',
      headers: [
        {
          key: 'Access-Control-Allow-Origin',
          value: process.env.ALLOW_ORIGIN ?? '*'
        },
        {
          key: 'X-Api-Version',
          value: packageJson.version
        }
      ]
    }]
  }
};

export default nextConfig;
