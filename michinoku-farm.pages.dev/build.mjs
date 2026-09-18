import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const rawCatalog = require('../miniprogram/data/catalog.js');
const currentDir = dirname(fileURLToPath(import.meta.url));

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
const priceLabel = (value) => value == null ? '原站未标价' : `¥ ${Number(value).toLocaleString('en-US')}`;

const sourceBrand = rawCatalog.find((brand) => brand.id === 'michi');
if (!sourceBrand) throw new Error('michi brand was not found in the current catalog');

const categories = sourceBrand.categories.map((category) => ({
  id: String(category.id),
  name: category.name,
  label: categoryLabels[Number(category.id)] || category.name,
  url: category.url,
  paused: String(category.name).includes('販売休止'),
}));

const products = sourceBrand.products.map((product) => {
  const variants = (Array.isArray(product.variants) && product.variants.length ? product.variants : [{
    id: 'default',
    name: '默认规格',
    price: product.price,
    priceText: product.priceText,
    available: true,
  }]).map((variant, index) => {
    const price = variant.price == null ? null : Number(variant.price);
    return {
      id: String(variant.id == null ? (index ? index : 'default') : variant.id),
      name: variant.name || '默认规格',
      price,
      priceLabel: priceLabel(price),
      priceText: variant.priceText || (price == null ? '价格请见原站' : `${price.toLocaleString('en-US')}円（税込み）`),
      stock: variant.stock == null ? null : Number(variant.stock),
      available: variant.available !== false && (variant.stock == null || Number(variant.stock) > 0),
      itemCode: variant.itemCode || '',
    };
  });

  return {
    id: String(product.id),
    name: product.name,
    image: toAssetPath(product.image),
    sourceUrl: product.url,
    price: product.price == null ? null : Number(product.price),
    priceLabel: priceLabel(product.price),
    priceUnit: 'JPY 起',
    priceText: product.priceText || '',
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
