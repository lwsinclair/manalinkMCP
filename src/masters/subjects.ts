/**
 * 科目マスターデータ
 */
export interface Subject {
  id: number;
  name: string;
  code: string;
}

export const subjects: Subject[] = [
  { id: 40, name: "英語", code: "english" },
  { id: 45, name: "理科", code: "science" },
  { id: 46, name: "化学", code: "chemistry" },
  { id: 47, name: "物理", code: "physics" },
  { id: 48, name: "算数", code: "math" },
  { id: 49, name: "中学数学", code: "juniorhighschoolmath" },
  { id: 50, name: "高校数学", code: "highschoolmath" },
  { id: 51, name: "国語", code: "language" },
  { id: 52, name: "古典", code: "classic" },
  { id: 53, name: "社会", code: "social" },
  { id: 212, name: "その他の科目", code: "others" },
  { id: 2655, name: "総合型・学校推薦型対策", code: "essay" },
  { id: 2657, name: "金融", code: "finance" },
  { id: 2658, name: "情報", code: "information" }
];