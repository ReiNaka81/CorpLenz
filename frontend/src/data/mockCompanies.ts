import { Company, CompanyFinancials, CompanySummary } from '@/types'

export const mockCompanies: Company[] = [
  { id: '1', name: 'トヨタ自動車', ticker: '7203', sector: '製造業', color: '#e50012' },
  { id: '2', name: 'ソニーグループ', ticker: '6758', sector: '製造業', color: '#003087' },
  { id: '3', name: '日立製作所', ticker: '6501', sector: '製造業', color: '#cf0a2c' },
  { id: '4', name: '野村総合研究所', ticker: '4307', sector: 'IT・通信', color: '#e60012' },
  { id: '5', name: 'NTTデータグループ', ticker: '9613', sector: 'IT・通信', color: '#0060a9' },
  { id: '6', name: 'ソフトバンクグループ', ticker: '9984', sector: 'IT・通信', color: '#cc0000' },
  { id: '7', name: 'キーエンス', ticker: '6861', sector: '製造業', color: '#1a237e' },
  { id: '8', name: 'ファナック', ticker: '6954', sector: '製造業', color: '#ffca28' },
  { id: '9', name: '三菱UFJフィナンシャル', ticker: '8306', sector: '金融', color: '#d32f2f' },
  { id: '10', name: '東京エレクトロン', ticker: '8035', sector: '製造業', color: '#1565c0' },
]

export const mockSummaries: Record<string, CompanySummary> = {
  '7203': {
    human_capital: {
      employee_count_consolidated: 375235,
      employee_count_standalone: 72567,
      average_age: 40.5,
      average_tenure: 17.2,
      average_salary: 895,
      female_manager_ratio: 8.2,
      commentary: '連結従業員数は国内製造業最大規模の37万人超。平均勤続年数17年超と離職率が低く、長期雇用が根付いた文化を持つ。平均年収895万円は製造業トップクラス。女性管理職比率は8.2%と業界平均を上回るが、さらなる向上が課題として掲げられている。',
    },
    business: {
      description: '自動車の設計・製造・販売を中核事業とし、ハイブリッド・電気・燃料電池車など幅広いパワートレインを展開。金融サービス（ローン・リース）も収益の柱。トヨタ生産方式（TPS）はグローバルで製造業のスタンダードとなっている。',
      segments: [
        { name: '自動車', revenue_ratio: 0.89 },
        { name: '金融', revenue_ratio: 0.08 },
        { name: 'その他', revenue_ratio: 0.03 },
      ],
      rd_expense: 11400,
      history_highlights: '1937年豊田自動車工業として設立。1950年代に量産体制を確立し国内トップへ。1997年プリウス発売でハイブリッド車市場を開拓。2023年純利益5兆円超で過去最高を更新。',
    },
    management: {
      policy: 'カーボンニュートラル実現に向けた「全方位戦略」を掲げ、HV・PHV・EV・FCEVを並行展開。2030年までにEV150万台販売を目標とする。ソフトウェア定義車両（SDV）への転換も重点投資領域。',
      challenges: '電動化投資と既存事業収益のバランス確保。半導体・電池などサプライチェーンの安定化。ソフトウェア人材の確保と社内DX推進。新興EV勢力（BYD等）との価格競争への対応。',
      risks: '為替リスク（1円の円安で約500億円の営業利益増減）。電動化移行期のモデルミックス変化。原材料（希少金属・鉄鋼）の価格変動。各国の排ガス規制強化への対応コスト。',
      capex: 15000,
    },
  },
  '6758': {
    human_capital: {
      employee_count_consolidated: 109700,
      employee_count_standalone: 2013,
      average_age: 42.3,
      average_tenure: 15.8,
      average_salary: 1292,
      female_manager_ratio: 21.5,
      commentary: 'ソニーグループは純粋持株会社のため単体従業員数は約2,000人。連結では約11万人のグローバル人材を擁する。平均年収1,292万円はエンターテインメント・テック企業として国内最高水準。女性管理職比率21.5%はグローバル企業として高い水準を維持している。',
    },
    business: {
      description: 'エレクトロニクス・エンターテインメント・金融の3軸で構成。PlayStation・音楽・映画・アニメなどのエンタメ事業が安定した利益の柱。センサー（特にCMOSイメージセンサー）はスマートフォン向けで世界シェア首位を誇る。',
      segments: [
        { name: 'ゲーム&ネットワーク', revenue_ratio: 0.29 },
        { name: '音楽', revenue_ratio: 0.14 },
        { name: '映画', revenue_ratio: 0.11 },
        { name: 'エレクトロニクス', revenue_ratio: 0.22 },
        { name: 'イメージ&センシング', revenue_ratio: 0.12 },
        { name: '金融', revenue_ratio: 0.12 },
      ],
      rd_expense: 6200,
      history_highlights: '1946年東京通信工業として設立。1979年ウォークマン発売で携帯音楽市場を創出。1994年PlayStation発売。2012年以降エンタメへ事業転換。2021年ソニーグループに社名変更。',
    },
    management: {
      policy: '「クリエイティビティとテクノロジーの力で、世界を感動で満たす」をパーパスに掲げる。エンターテインメント・テクノロジー・金融の融合によるシナジー最大化を推進。AI・クラウド活用でコンテンツ配信の高度化を図る。',
      challenges: 'PlayStation向けコンテンツの継続的な充実と競合（Microsoft等）への対応。CMOSセンサーの中国スマホ市場依存からの分散。金融子会社（ソニー銀行等）の独立上場検討と持株会社との関係整理。',
      risks: '為替変動（円安は売上増・円高は利益減）。ゲームソフト開発コストの高騰。半導体供給制約によるセンサー生産への影響。地政学リスク（米中対立による中国事業への影響）。',
      capex: 5800,
    },
  },
  '6501': {
    human_capital: {
      employee_count_consolidated: 123812,
      employee_count_standalone: 33813,
      average_age: 43.1,
      average_tenure: 18.5,
      average_salary: 893,
      female_manager_ratio: 11.3,
      commentary: '連結12万人超のグローバル総合電機メーカー。平均勤続18.5年と日立グループの長期雇用文化を反映。デジタル事業への転換に伴い、DX・クラウド人材の採用を強化している。女性管理職比率は11.3%で着実に上昇中。',
    },
    business: {
      description: 'デジタルシステム&サービス（ITコンサル・クラウド）、グリーンエナジー&モビリティ（エネルギー・鉄道）、コネクティブインダストリーズ（産業機器・IoT）の3セグメントで構成。2021年以降、家電・化学など非中核事業を売却しITサービス企業への転換を加速。',
      segments: [
        { name: 'デジタルシステム&サービス', revenue_ratio: 0.38 },
        { name: 'グリーンエナジー&モビリティ', revenue_ratio: 0.34 },
        { name: 'コネクティブインダストリーズ', revenue_ratio: 0.28 },
      ],
      rd_expense: 3200,
      history_highlights: '1910年設立。1950〜80年代に総合電機として成長。2008年リーマンショック後に7,873億円の最終赤字を計上し構造改革を開始。2020年代にITサービス企業への転換を完遂。Lumadaプラットフォームが成長の核。',
    },
    management: {
      policy: 'データ・AI・デジタル技術を活用した社会インフラの高度化「Social Innovation Business」を推進。Lumada（データ活用ソリューション）の売上比率引き上げを最重要KPIとして設定。2030年に売上収益14兆円・調整後EBIT率10%以上を目標。',
      challenges: 'Lumadaビジネスの安定成長と収益化。GlobalLogic（買収したITサービス企業）とのシナジー創出。エネルギー・鉄道事業における大型プロジェクトの採算管理。',
      risks: 'ITサービス市場での競合激化（アクセンチュア・富士通等）。大型M&Aに伴ののれん減損リスク。エネルギー・インフラ案件の納期遅延・コスト超過。',
      capex: 3800,
    },
  },
}

export const mockFinancials: Record<string, CompanyFinancials> = {
  '7203': {
    ticker: '7203',
    years: [
      { year: 2020, revenue: 272143, net_profit: 20761, equity: 228498, total_assets: 626219 },
      { year: 2021, revenue: 279275, net_profit: 28501, equity: 239802, total_assets: 668575 },
      { year: 2022, revenue: 319423, net_profit: 25095, equity: 257219, total_assets: 721566 },
      { year: 2023, revenue: 374956, net_profit: 34095, equity: 293121, total_assets: 838437 },
      { year: 2024, revenue: 452351, net_profit: 53584, equity: 332190, total_assets: 952174 },
    ],
  },
  '6758': {
    ticker: '6758',
    years: [
      { year: 2020, revenue: 82599, net_profit: 1177, equity: 50498, total_assets: 186497 },
      { year: 2021, revenue: 89985, net_profit: 11571, equity: 57782, total_assets: 205005 },
      { year: 2022, revenue: 99215, net_profit: 8825, equity: 63501, total_assets: 226027 },
      { year: 2023, revenue: 113994, net_profit: 10245, equity: 71354, total_assets: 256744 },
      { year: 2024, revenue: 130207, net_profit: 10254, equity: 78634, total_assets: 289221 },
    ],
  },
  '6501': {
    ticker: '6501',
    years: [
      { year: 2020, revenue: 84222, net_profit: 2151, equity: 32145, total_assets: 100234 },
      { year: 2021, revenue: 89720, net_profit: 2757, equity: 34521, total_assets: 106321 },
      { year: 2022, revenue: 104291, net_profit: 5013, equity: 38924, total_assets: 119234 },
      { year: 2023, revenue: 120744, net_profit: 7219, equity: 44398, total_assets: 133765 },
      { year: 2024, revenue: 135921, net_profit: 9432, equity: 51203, total_assets: 149871 },
    ],
  },
  '4307': {
    ticker: '4307',
    years: [
      { year: 2020, revenue: 5270, net_profit: 718, equity: 4512, total_assets: 7001 },
      { year: 2021, revenue: 5619, net_profit: 801, equity: 4813, total_assets: 7456 },
      { year: 2022, revenue: 6077, net_profit: 914, equity: 5124, total_assets: 8012 },
      { year: 2023, revenue: 6632, net_profit: 1024, equity: 5501, total_assets: 8765 },
      { year: 2024, revenue: 7243, net_profit: 1147, equity: 5978, total_assets: 9421 },
    ],
  },
  '9613': {
    ticker: '9613',
    years: [
      { year: 2020, revenue: 21700, net_profit: 1423, equity: 10234, total_assets: 29541 },
      { year: 2021, revenue: 23432, net_profit: 1652, equity: 11098, total_assets: 31023 },
      { year: 2022, revenue: 25891, net_profit: 1894, equity: 12341, total_assets: 34512 },
      { year: 2023, revenue: 28123, net_profit: 2123, equity: 13701, total_assets: 38012 },
      { year: 2024, revenue: 31254, net_profit: 2456, equity: 15234, total_assets: 42301 },
    ],
  },
  '9984': {
    ticker: '9984',
    years: [
      { year: 2020, revenue: 476521, net_profit: -122945, equity: 512345, total_assets: 3210234 },
      { year: 2021, revenue: 621230, net_profit: 62342, equity: 601234, total_assets: 3456712 },
      { year: 2022, revenue: 589203, net_profit: -134234, equity: 489012, total_assets: 3123456 },
      { year: 2023, revenue: 612341, net_profit: -91023, equity: 412341, total_assets: 3210234 },
      { year: 2024, revenue: 689234, net_profit: 12341, equity: 445678, total_assets: 3312456 },
    ],
  },
  '6861': {
    ticker: '6861',
    years: [
      { year: 2020, revenue: 5519, net_profit: 2130, equity: 19234, total_assets: 21345 },
      { year: 2021, revenue: 6540, net_profit: 2687, equity: 20841, total_assets: 23012 },
      { year: 2022, revenue: 9222, net_profit: 3899, equity: 23451, total_assets: 26234 },
      { year: 2023, revenue: 10930, net_profit: 4501, equity: 26781, total_assets: 29876 },
      { year: 2024, revenue: 11010, net_profit: 4012, equity: 29012, total_assets: 32541 },
    ],
  },
  '6954': {
    ticker: '6954',
    years: [
      { year: 2020, revenue: 5779, net_profit: 1234, equity: 15321, total_assets: 18234 },
      { year: 2021, revenue: 6983, net_profit: 1654, equity: 16234, total_assets: 19451 },
      { year: 2022, revenue: 9002, net_profit: 2345, equity: 17891, total_assets: 21234 },
      { year: 2023, revenue: 9501, net_profit: 2156, equity: 19012, total_assets: 23456 },
      { year: 2024, revenue: 8234, net_profit: 1678, equity: 20123, total_assets: 24321 },
    ],
  },
  '8306': {
    ticker: '8306',
    years: [
      { year: 2020, revenue: 57823, net_profit: 7234, equity: 234512, total_assets: 3601234 },
      { year: 2021, revenue: 59012, net_profit: 9012, equity: 245012, total_assets: 3712345 },
      { year: 2022, revenue: 67234, net_profit: 11234, equity: 258012, total_assets: 3834512 },
      { year: 2023, revenue: 78012, net_profit: 14512, equity: 274012, total_assets: 3978234 },
      { year: 2024, revenue: 91234, net_profit: 17823, equity: 291234, total_assets: 4123456 },
    ],
  },
  '8035': {
    ticker: '8035',
    years: [
      { year: 2020, revenue: 12945, net_profit: 2123, equity: 14234, total_assets: 18012 },
      { year: 2021, revenue: 19234, net_profit: 4512, equity: 17823, total_assets: 23012 },
      { year: 2022, revenue: 22031, net_profit: 5234, equity: 20934, total_assets: 27234 },
      { year: 2023, revenue: 18912, net_profit: 3678, equity: 23012, total_assets: 30121 },
      { year: 2024, revenue: 23456, net_profit: 6012, equity: 27345, total_assets: 35678 },
    ],
  },
}
