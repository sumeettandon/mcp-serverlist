import fs from 'fs';
import path from 'path';
import { ServerEntry, ServerResponse } from '../lib/types';

const API_URL = 'https://registry.modelcontextprotocol.io/v0/servers';
const DATA_DIR = path.join(process.cwd(), 'lib', 'data');

interface ServerCounts {
  total: number;
  local: number;
  remote: number;
  both: number;
  timestamp: string;
}

async function fetchServers(cursor?: string): Promise<ServerResponse> {
  const url = cursor ? `${API_URL}?cursor=${cursor}` : API_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  
  return response.json();
}

function classifyServer(server: ServerEntry) {
  const hasRemotes = !!server.remotes?.length;
  const hasPackages = !!server.packages?.length;
  
  return {
    isLocal: !hasRemotes || hasPackages,
    isRemote: hasRemotes,
    isBoth: hasRemotes && hasPackages
  };
}

async function collectAllServers(): Promise<ServerCounts> {
  let cursor: string | undefined = undefined;
  let counts = {
    total: 0,
    local: 0,
    remote: 0,
    both: 0,
    timestamp: new Date().toISOString()
  };
  
  do {
    const response = await fetchServers(cursor);
    
    for (const server of response.servers) {
      const classification = classifyServer(server);
      counts.total++;
      
      if (classification.isLocal) counts.local++;
      if (classification.isRemote) counts.remote++;
      if (classification.isBoth) counts.both++;
    }
    
    cursor = response.metadata.next_cursor;
  } while (cursor);
  
  return counts;
}

async function appendToCSV(counts: ServerCounts) {
  const month = counts.timestamp.slice(0, 7); // YYYY-MM
  const filename = `${month}.csv`;
  const filepath = path.join(DATA_DIR, 'hourly', filename);
  
  // Ensure directory exists
  fs.mkdirSync(path.join(DATA_DIR, 'hourly'), { recursive: true });
  
  // Create file with headers if it doesn't exist
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, 'timestamp,total,local,remote,both\n');
  }
  
  // Append data
  const line = `${counts.timestamp},${counts.total},${counts.local},${counts.remote},${counts.both}\n`;
  fs.appendFileSync(filepath, line);
}

async function main() {
  try {
    console.log('Starting data collection...');
    const counts = await collectAllServers();
    await appendToCSV(counts);
    console.log('Data collection complete:', counts);
  } catch (error) {
    console.error('Error collecting data:', error);
    process.exit(1);
  }
}

main();