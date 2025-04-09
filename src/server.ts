import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { subjects } from './masters/subjects.js';
import { grades, gradeGroups } from './masters/grades.js';
import { fetchCourseFeatures, searchTeachers, TeacherSearchParams } from './utils/api.js';

// MCPサーバーのインスタンスを作成
const server = new McpServer({
  name: "マナリンクMCP",
  version: "1.0.0",
  capabilities: {
    tools: {}
  }
});

// 科目マスタ取得ツール
server.tool(
  "get_subject_master",
  "科目マスタを取得します。このマスタの取得を通じて、科目のラベルとIDの対応を取得します。",
  async () => {
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify(subjects, null, 2)
      }]
    };
  }
);

// 特徴マスタ取得ツール
server.tool(
  "get_course_features",
  "コース特徴マスタを取得します。このマスタの取得を通じて、特徴のラベルとIDの対応を取得します。",
  async () => {
    try {
      const features = await fetchCourseFeatures();
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify(features, null, 2)
        }]
      };
    } catch (error) {
      console.error('特徴マスタの取得に失敗しました:', error);
      return {
        content: [{
          type: "text" as const,
          text: `エラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`
        }],
        isError: true
      };
    }
  }
);

// 学年マスタ取得ツール
server.tool(
  "get_grade_master",
  "学年マスタを取得します。このマスタの取得を通じて、学年のラベルとIDの対応を取得します。",
  async () => {
    // 学年マスタと学年グループを組み合わせた情報を返す
    const response = {
      grades,
      gradeGroups
    };

    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify(response, null, 2)
      }]
    };
  }
);

// 詳細パラメータによる先生検索ツール
server.tool(
  "search_teachers_advanced",
  "科目、学年、特徴、ソート順、指導期間を指定して先生を検索します",
  {
    subject_ids: z.array(z.number()).optional().describe("科目IDの配列"),
    grade_ids: z.array(z.number()).optional().describe("学年IDの配列"),
    course_feature_id: z.number().optional().describe("特徴ID"),
    sort: z.enum(['pr', 'certification', 'rating', 'lesson_count', 'latest']).optional().describe("ソート順"),
    desired_teaching_period: z.enum(['monthly', 'once']).optional().describe("指導期間 (monthly: 長期, once: 短期)")
  },
  async (params) => {
    try {
      const result = await searchTeachers(params as TeacherSearchParams);
      return {
        content: [{
          type: "text" as const,
          text: result.markdown.slice(0, 30000)
        }]
      };
    } catch (error) {
      console.error('先生検索に失敗しました:', error);
      return {
        content: [{
          type: "text" as const,
          text: `エラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`
        }],
        isError: true
      };
    }
  }
);

// メインサーバー関数を公開
export { server };