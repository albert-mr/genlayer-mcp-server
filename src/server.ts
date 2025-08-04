import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { registerGenLayerTools } from './tools/toolRegistry.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));
const version = packageJson.version;

export function createServer(): Server {
  const server = new Server(
    {
      name: 'genlayer-mcp-server',
      version
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );

  registerGenLayerTools(server);

  return server;
}
