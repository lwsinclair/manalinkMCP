import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from './server.js';

/**
 * マナリンクMCPサーバーを起動する
 */
async function main() {
  try {
    // 標準入出力を使用するトランスポートを作成
    const transport = new StdioServerTransport();

    // MCP接続を開始
    console.error('マナリンクMCPサーバーを起動中...');
    await server.connect(transport);

    console.error('マナリンクMCPサーバーが起動しました（標準入出力モード）');
  } catch (error) {
    console.error('サーバー起動エラー:', error);
    process.exit(1);
  }
}

// サーバー起動
main().catch((error) => {
  console.error('致命的なエラーが発生しました:', error);
  process.exit(1);
});
