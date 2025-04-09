import { searchTeachers, convertHtmlToMarkdown } from '../utils/api.js';

/**
 * 先生検索結果をHTMLからMarkdownに変換するサンプル
 */
async function searchTeachersAndConvertToMarkdown() {
  try {
    // 数学の中学生を教えられる先生を検索
    const result = await searchTeachers({
      subject_ids: [2], // 数学
      grade_ids: [4], // 中学1年生
      sort: 'rating'
    });

    console.log('検索URL:', result.url);
    console.log('\n======= HTML =======\n');
    console.log(result.bodyContent.substring(0, 500) + '...'); // 先頭500文字だけ表示

    console.log('\n======= Markdown =======\n');
    console.log(result.markdown.substring(0, 500) + '...'); // 先頭500文字だけ表示

    // HTMLから直接変換するパターン
    const sampleHtml = `
      <div>
        <h1>マナリンク</h1>
        <p>オンライン家庭教師プラットフォーム</p>
        <ul>
          <li><a href="/about">サービスについて</a></li>
          <li><a href="/teachers">先生を探す</a></li>
        </ul>
      </div>
    `;

    console.log('\n======= サンプルHTML =======\n');
    console.log(sampleHtml);

    console.log('\n======= サンプルMarkdown =======\n');
    console.log(convertHtmlToMarkdown(sampleHtml));

  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

// 実行
searchTeachersAndConvertToMarkdown();