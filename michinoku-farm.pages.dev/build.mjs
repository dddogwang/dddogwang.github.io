import { createRequire } from 'node:module';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import productNamesZh from './product-names-zh.mjs';

const currentDir = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const catalogCandidates = [
  process.env.MICHINOKU_CATALOG,
  join(currentDir, '../miniprogram/data/catalog.js'),
  join(currentDir, '../../michinoku-farm-miniprogram/miniprogram/data/catalog.js'),
].filter(Boolean);
const catalogPath = catalogCandidates.find((candidate) => existsSync(candidate));
if (!catalogPath) throw new Error('Michinoku catalog source was not found');
const rawCatalog = require(catalogPath);

const categoryLabels = [
  '马肉',
  '袋鼠肉',
  '鹿肉',
  '牛 / 羊 / 骆驼',
  '猪 / 野猪',
  '鸡 / 鸭 / 火鸡',
  '鱼 / 贝类',
  '营养补充 / 奶类',
  '饼干 / 奶酪',
  '主粮 / 其他',
  '组合套装',
  '蔬菜 / 水果',
];

const toAssetPath = (value) => String(value || '').replace(/^\/?assets\//, 'assets/');
const RMB_RATE = 0.07;
const RMB_STEP = 10;
const toRmbPrice = (value) => {
  if (value == null || !Number.isFinite(Number(value))) return null;
  const jpyPrice = Number(value);
  return Math.ceil((jpyPrice * RMB_RATE) / RMB_STEP - 1e-9) * RMB_STEP;
};
const formatPrice = (value) => Number(value).toLocaleString('en-US');
const priceLabel = (value) => value == null ? '原站未标价' : `¥ ${formatPrice(value)}`;
const priceText = (value) => value == null ? '价格请见原站' : `¥ ${formatPrice(value)} RMB`;

const sourceBrand = rawCatalog.find((brand) => brand.id === 'michi');
if (!sourceBrand) throw new Error('michi brand was not found in the current catalog');

const excludedProductIds = new Set([
  'michi-1880275',
  'michi-1211009',
  'michi-1518349',
  'michi-1523978',
]);

const categories = sourceBrand.categories.map((category) => ({
  id: String(category.id),
  name: category.name,
  label: categoryLabels[Number(category.id)] || category.name,
  url: category.url,
  paused: String(category.name).includes('販売休止'),
}));

const products = sourceBrand.products.filter((product) => !excludedProductIds.has(String(product.id))).map((product) => {
  const nameZh = productNamesZh[String(product.id)];
  if (!nameZh) throw new Error(`Chinese product name is missing for ${product.id}`);
  const variants = (Array.isArray(product.variants) && product.variants.length ? product.variants : [{
    id: 'default',
    name: '默认规格',
    price: product.price,
    priceText: product.priceText,
    available: true,
  }]).map((variant, index) => {
    const sourcePrice = variant.price == null ? null : Number(variant.price);
    const price = toRmbPrice(sourcePrice);
    return {
      id: String(variant.id == null ? (index ? index : 'default') : variant.id),
      name: variant.name || '默认规格',
      sourcePrice,
      price,
      priceLabel: priceLabel(price),
      priceText: priceText(price),
      stock: variant.stock == null ? null : Number(variant.stock),
      available: variant.available !== false && (variant.stock == null || Number(variant.stock) > 0),
      itemCode: variant.itemCode || '',
    };
  });

  const sourcePrice = product.price == null ? null : Number(product.price);
  const price = toRmbPrice(sourcePrice);

  return {
    id: String(product.id),
    name: product.name,
    nameZh,
    image: toAssetPath(product.image),
    sourceUrl: product.url,
    sourcePrice,
    price,
    priceLabel: priceLabel(price),
    priceUnit: 'RMB 起',
    priceText: priceText(price),
    categories: (product.categories || []).map(String),
    categoryText: (product.categories || [])
      .map((id) => categories.find((category) => category.id === String(id)))
      .filter(Boolean)
      .map((category) => category.label)
      .join(' / ') || '品牌新着商品',
    home: Boolean(product.home),
    variants,
  };
});

const data = {
  brand: {
    id: sourceBrand.id,
    name: sourceBrand.name,
    subtitle: sourceBrand.subtitle,
    english: 'MICHINOKU FARM',
    logo: toAssetPath(sourceBrand.logo),
    banner: toAssetPath(sourceBrand.banner),
    sourceUrl: sourceBrand.url,
  },
  categories,
  products,
  snapshotDate: '2026-09-16',
  productCount: products.length,
  variantCount: products.reduce((count, product) => count + product.variants.length, 0),
};

mkdirSync(currentDir, { recursive: true });
writeFileSync(join(currentDir, 'site-data.js'), `window.MICHINOKU_DATA = ${JSON.stringify(data)};\n`);
console.log(`Built ${data.productCount} products and ${data.variantCount} variants.`);
