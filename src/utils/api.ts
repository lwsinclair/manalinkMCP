import axios from 'axios';
// cheerioを追加（HTMLパース用）
import * as cheerio from 'cheerio';
// HTMLをMarkdownに変換するライブラリを追加
import { NodeHtmlMarkdown } from 'node-html-markdown';

// MANALINK_BASE_URLをAPI_BASE_URLの代わりに使用
const MANALINK_BASE_URL = 'https://manalink.jp';

// HTMLフェッチ関数
async function fetchHTML(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTPエラー: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error('HTMLの取得に失敗しました:', error);
    throw new Error('HTMLの取得に失敗しました');
  }
}

/**
 * HTMLからbodyタグ(コンテンツが含まれるところ)の内容だけを抽出する
 * 不要なタグ(svg, style, noscript)を除外し、classなどの属性も削除
 */
function extractBodyContent(html: string): string {
  try {
    const $ = cheerio.load(html);

    // 不要なタグを削除
    $('svg, style, noscript, iframe').remove();

    // すべてのタグからclass属性を削除
    $('*').each((_, element) => {
      $(element).removeAttr('class');
      $(element).removeAttr('style');
    });

    // マナリンクではbody > articleの中に全コンテンツが配置されていることが多い
    const bodyContent = $('article').html() || '';
    return bodyContent;
  } catch (error) {
    console.error('bodyタグ（相当）の抽出に失敗しました:', error);
    return html; // 失敗した場合は元のHTMLを返す
  }
}

/**
 * HTMLをMarkdownに変換する
 * @param html HTMLテキスト
 * @returns Markdownテキスト
 */
export function convertHtmlToMarkdown(html: string): string {
  try {
    return NodeHtmlMarkdown.translate(html);
  } catch (error) {
    console.error('HTMLからMarkdownへの変換に失敗しました:', error);
    return html; // 失敗した場合は元のHTMLを返す
  }
}

/**
 * コース特徴マスタデータ
 */
export interface CourseFeature {
  id: number;
  name: string;
  description?: string;
}

/**
 * ハードコーディングされた特徴マスタデータ
 * CSVデータ: id, name, visible, show_on_teacher_search, position
 */
const COURSE_FEATURES: CourseFeature[] = [
  { id: 1, name: "中学受験" },
  { id: 2, name: "高校受験" },
  { id: 3, name: "TOEIC" },
  { id: 5, name: "大学受験" },
  { id: 6, name: "発達障害" },
  { id: 8, name: "英検" },
  { id: 9, name: "定期テスト" },
  { id: 12, name: "共通テスト" },
  { id: 21, name: "中高一貫" },
  { id: 25, name: "看護" },
  { id: 27, name: "帰国子女" },
  { id: 32, name: "海外子女" },
  { id: 52, name: "医学部" },
  { id: 66, name: "不登校" },
  { id: 67, name: "平均点以下" },
  { id: 71, name: "公務員試験" },
  { id: 78, name: "小論文" }
];

/**
 * コース特徴マスタを取得する - ハードコーディング版
 */
export async function fetchCourseFeatures(): Promise<CourseFeature[]> {
  return COURSE_FEATURES;
}

/**
 * 先生検索APIのパラメータ
 */
export interface TeacherSearchParams {
  subject_ids?: number[];
  grade_ids?: number[];
  course_feature_id?: number;
  sort?: 'pr' | 'certification' | 'rating' | 'lesson_count' | 'latest';
  desired_teaching_period?: 'monthly' | 'once';
}

/**
 * 先生の情報
 */
export interface Teacher {
  id: number;
  name: string;
  profile?: string;
  subjects?: {
    id: number;
    name: string;
  }[];
  grades?: {
    id: number;
    name: string;
  }[];
  // 他の必要なプロパティを追加
}

/**
 * 先生検索 - HTML取得版
 * @returns bodyタグの内容を返します
 */
export async function searchTeachers(params: TeacherSearchParams): Promise<{ bodyContent: string, markdown: string, url: string }> {
  try {
    // URLパラメータを構築
    const queryParams = new URLSearchParams();

    // 各パラメータを適切に設定
    if (params.grade_ids && params.grade_ids.length > 0) {
      queryParams.set('target_grade', params.grade_ids[0].toString());
    }

    if (params.subject_ids && params.subject_ids.length > 0) {
      queryParams.set('subject_ids', params.subject_ids.join(','));
    }

    if (params.course_feature_id) {
      queryParams.set('course_feature_id', params.course_feature_id.toString());
    }

    if (params.sort) {
      queryParams.set('sort', params.sort);
    }

    if (params.desired_teaching_period) {
      queryParams.set('desired_teaching_period', params.desired_teaching_period);
    }

    // 必ずwithout_fully_booked=true
    queryParams.set('without_fully_booked', 'true');

    // 検索URLを構築
    const searchUrl = `${MANALINK_BASE_URL}/teacher/search/filter?${queryParams.toString()}`;

    // HTMLを取得
    const html = await fetchHTML(searchUrl);

    // bodyタグの内容を抽出
    const bodyContent = extractBodyContent(html);

    // HTMLをMarkdownに変換
    const markdown = convertHtmlToMarkdown(bodyContent);

    // bodyコンテンツとURLとMarkdownを返す
    return {
      bodyContent,
      markdown,
      url: searchUrl
    };
  } catch (error) {
    console.error('先生検索に失敗しました:', error);
    throw new Error('先生検索に失敗しました');
  }
}