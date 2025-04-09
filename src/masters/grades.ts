/**
 * 学年マスターデータ
 */
export interface Grade {
  id: number;
  name: string;
}

export const grades: Grade[] = [
  { id: 1, name: "小学1年生" },
  { id: 2, name: "小学2年生" },
  { id: 3, name: "小学3年生" },
  { id: 4, name: "小学4年生" },
  { id: 5, name: "小学5年生" },
  { id: 6, name: "小学6年生" },
  { id: 7, name: "中学1年生" },
  { id: 8, name: "中学2年生" },
  { id: 9, name: "中学3年生" },
  { id: 10, name: "中学浪人" },
  { id: 11, name: "高校1年生" },
  { id: 12, name: "高校2年生" },
  { id: 13, name: "高校3年生" },
  { id: 14, name: "浪人生" },
  { id: 15, name: "社会人" }
];

/**
 * 学年グループ定義（中学生、高校生などの広いカテゴリ）
 */
export interface GradeGroup {
  name: string;
  gradeIds: number[];
}

export const gradeGroups: GradeGroup[] = [
  { name: "小学生", gradeIds: [1, 2, 3, 4, 5, 6] },
  { name: "中学生", gradeIds: [7, 8, 9, 10] },
  { name: "高校生", gradeIds: [11, 12, 13] }
];