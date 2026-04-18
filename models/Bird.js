import mongoose from 'mongoose';

const birdSchema = new mongoose.Schema(
  {
    name_zh: { type: String, required: true },
    name_en: { type: String, required: true },
    name_scientific: { type: String, required: true },
    category: {
      type: String,
      enum: ['猛禽', '水鳥', '鳴禽', '攀禽', '走禽', '其他'],
      required: true,
    },
    habitat: [{ type: String }],
    description: { type: String, required: true },
    conservationStatus: {
      type: String,
      enum: ['無危', '近危', '易危', '瀕危', '極危', '野外絕滅', '絕滅'],
      default: '無危',
    },
    images: [{ type: String }],
    distribution: { type: String },
    funFacts: [{ type: String }],
    season: [{ type: String }],
    // 深度生態欄位
    size: { type: String },           // 體型大小，如 "體長約 28 公分"
    diet: [{ type: String }],         // 食性，如 ["昆蟲","漿果","種子"]
    behavior: { type: String },       // 行為習性
    breedingSeason: { type: String }, // 繁殖季節
    nestType: { type: String },       // 築巢方式
    altitudeRange: { type: String },  // 海拔範圍，如 "1500–3500 公尺"
    threats: [{ type: String }],      // 威脅因素
    ecologyTags: [{ type: String }],  // 生態標籤，如 ["夜行性","群居","候鳥"]
  },
  { timestamps: true }
);

birdSchema.index({ name_zh: 'text', name_en: 'text', name_scientific: 'text' });

const Bird = mongoose.model('Bird', birdSchema);
export default Bird;
