import { Company, CompanyFinancials } from '@/types'

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
