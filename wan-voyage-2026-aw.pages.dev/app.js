const app = document.querySelector('#app');
const searchInput = document.querySelector('#searchInput');
const clearSearch = document.querySelector('#clearSearch');
const toast = document.querySelector('#toast');

const STORE_NAME = 'WAN VOYAGE';
const STORE_ENGLISH = 'DESIGNER\'S DOGWARE';
const CART_KEY = 'wan_voyage_2026_aw_cart_v1';
const LANGUAGE_KEY = 'wan_voyage_2026_aw_language_v1';
const CATALOG_URL = 'data/catalog.json';

const COPY = {
  zh: {
    languageName: '中文',
    languageOriginal: '日本語原版',
    announcementTitle: 'WAN VOYAGE · 2026 AUTUMN & WINTER',
    identityCaption: "DESIGNER'S DOGWARE SELECT SHOP",
    navCatalog: '目录',
    navSaved: '收藏夹',
    searchPlaceholder: '搜索商品、品牌、规格或编号',
    searchLabel: '搜索商品、品牌、规格或编号',
    allProducts: '全部商品',
    allBrands: '全部品牌',
    allGroups: '全部品类',
    brandProducts: '品牌商品',
    groupProducts: '品类商品',
    brands: '品牌',
    categories: '品类',
    filterIndex: '筛选目录',
    result: '搜索结果',
    resultCount: count => `“${count.query}” · ${count.total} 件`,
    catalogOrder: count => `${count} 件商品 · 目录顺序`,
    sort: '排序',
    sortFeatured: '默认顺序',
    sortLow: '价格由低到高',
    sortHigh: '价格由高到低',
    sortName: '按名称',
    noResults: '没有找到商品',
    noResultsHint: '换一个关键词，或选择其他品牌与品类试试。',
    productUnit: '商品',
    brandUnit: '品牌',
    variantUnit: '规格',
    galleryUnit: '详情图',
    browseAll: '浏览全部商品',
    available: '可售',
    soldOut: '暂时缺货',
    availableCount: (available, total) => `${available}/${total} 可选`,
    viewProduct: name => `查看 ${name}`,
    originalName: name => `日文原名：${name}`,
    galleryView: index => `查看第 ${index} 张图片`,
    galleryNote: count => `商品图与详情资料图 · 共 ${count} 张`,
    notFound: '商品不存在',
    notFoundHint: '这件商品可能已经从当前目录中移除。',
    backCatalog: '返回目录',
    selectVariant: '选择规格',
    selectable: (available, total) => `${available}/${total} 可选`,
    defaultVariant: '默认规格',
    brandFact: '品牌',
    groupFact: '品类',
    skuFact: '商品编号',
    variantFact: '规格数量',
    priceFact: '价格范围',
    variantFactValue: (total, available) => `${total} 个 · ${available} 个可选`,
    priceCurrency: '价格',
    addSaved: '加入收藏夹',
    saved: '已加入收藏夹',
    detailUnavailable: '暂时缺货',
    savedNote: '这里的收藏夹只保存在当前浏览器，不会提交订单。购买与实时库存请以商品页面为准。',
    productDetails: '商品详情',
    detailsOriginal: '以下商品说明保留日文原文。',
    savedList: 'SAVED LIST',
    sharedSaved: '朋友分享的收藏夹',
    mySaved: '我的收藏夹',
    savedCount: count => `${count} 件商品`,
    sharedSuffix: ' · 来自分享链接',
    localSuffix: ' · 保存在本机',
    saveToMine: '保存到我的收藏夹',
    shareSaved: '分享收藏夹',
    clearSaved: '清空',
    remove: '移除',
    totalReference: '合计参考价',
    emptySaved: '收藏夹还是空的',
    sharedEmpty: '这条分享清单没有可展示的商品。',
    localEmpty: '看到喜欢的商品，就先放进这里吧。',
    browseCatalog: '去浏览目录　↗',
    savedDisclaimer: '收藏夹只保存在当前浏览器。分享时会把商品与规格编码进链接；它不是订单，价格和库存可能随时间变化。',
    toastEmpty: '收藏夹是空的，先挑选几件喜欢的商品吧。',
    toastCopied: '分享链接已复制。',
    toastCleared: '收藏夹已清空。',
    toastSaved: '已保存到我的收藏夹。',
    priceUnknown: '价格待确认',
    footerItems: count => `2026 Autumn & Winter · ${count} items`,
  },
  ja: {
    languageName: '中文',
    languageOriginal: '日本語原版',
    announcementTitle: 'WAN VOYAGE · 2026 AUTUMN & WINTER',
    identityCaption: "DESIGNER'S DOGWARE SELECT SHOP",
    navCatalog: 'カタログ',
    navSaved: 'お気に入り',
    searchPlaceholder: '商品・ブランド・仕様・品番を検索',
    searchLabel: '商品・ブランド・仕様・品番を検索',
    allProducts: 'すべての商品',
    allBrands: 'すべてのブランド',
    allGroups: 'すべてのカテゴリー',
    brandProducts: 'ブランド商品',
    groupProducts: 'カテゴリー商品',
    brands: 'ブランド',
    categories: 'カテゴリー',
    filterIndex: 'カタログを絞り込む',
    result: '検索結果',
    resultCount: count => `「${count.query}」 · ${count.total} 件`,
    catalogOrder: count => `${count} 件 · カタログ順`,
    sort: '並び替え',
    sortFeatured: 'おすすめ順',
    sortLow: '価格の安い順',
    sortHigh: '価格の高い順',
    sortName: '名前順',
    noResults: '商品が見つかりません',
    noResultsHint: 'キーワードを変えるか、別のブランド・カテゴリーを選んでください。',
    productUnit: '商品',
    brandUnit: 'ブランド',
    variantUnit: '仕様',
    galleryUnit: '画像',
    browseAll: 'すべての商品を見る',
    available: 'AVAILABLE',
    soldOut: 'SOLD OUT',
    availableCount: (available, total) => `${available}/${total} 選択可`,
    viewProduct: name => `${name}を見る`,
    originalName: name => name,
    galleryView: index => `${index}枚目の画像を見る`,
    galleryNote: count => `商品画像・資料画像 · 全${count}枚`,
    notFound: '商品が見つかりません',
    notFoundHint: 'この商品は現在のカタログから削除された可能性があります。',
    backCatalog: 'カタログに戻る',
    selectVariant: '仕様を選択',
    selectable: (available, total) => `${available}/${total} 選択可`,
    defaultVariant: 'デフォルト仕様',
    brandFact: 'ブランド',
    groupFact: 'カテゴリー',
    skuFact: '商品番号',
    variantFact: '仕様数',
    priceFact: '価格帯',
    variantFactValue: (total, available) => `${total} 仕様 · ${available} 仕様選択可`,
    priceCurrency: '価格',
    addSaved: 'お気に入りに追加',
    saved: 'お気に入りに追加済み',
    detailUnavailable: 'SOLD OUT',
    savedNote: 'お気に入りはこのブラウザにのみ保存され、注文は送信されません。購入・最新在庫は商品ページをご確認ください。',
    productDetails: '商品詳細',
    detailsOriginal: '商品説明は日本語原文のまま掲載しています。',
    savedList: 'SAVED LIST',
    sharedSaved: '共有されたお気に入り',
    mySaved: 'マイお気に入り',
    savedCount: count => `${count} 件`,
    sharedSuffix: ' · 共有リンク',
    localSuffix: ' · このブラウザに保存',
    saveToMine: 'マイお気に入りに保存',
    shareSaved: 'お気に入りを共有',
    clearSaved: 'すべて削除',
    remove: '削除',
    totalReference: '合計参考価格',
    emptySaved: 'お気に入りは空です',
    sharedEmpty: '共有リストに表示できる商品がありません。',
    localEmpty: '気になる商品をお気に入りに追加してください。',
    browseCatalog: 'カタログを見る　↗',
    savedDisclaimer: 'お気に入りはこのブラウザにのみ保存されます。共有リンクには商品と仕様が含まれます。注文ではなく、価格・在庫は変動する場合があります。',
    toastEmpty: 'お気に入りは空です。まず商品を選んでください。',
    toastCopied: '共有リンクをコピーしました。',
    toastCleared: 'お気に入りを削除しました。',
    toastSaved: 'マイお気に入りに保存しました。',
    priceUnknown: '価格確認中',
    footerItems: count => `2026 Autumn & Winter · ${count} items`,
  },
};

const GROUP_NAMES_JA = {
  clothing: 'ウェア',
  'leash-harness': 'リード・ハーネス',
  'home-travel': 'ベッド・お出かけ',
  toys: 'おもちゃ',
  'shoes-socks': 'シューズ・ソックス',
  accessories: 'アクセサリー',
};

const VARIANT_TRANSLATIONS = [
  ['オフホワイト', '米白色'], ['イエロー', '黄色'], ['ホワイト', '白色'], ['ピンク', '粉色'],
  ['グレー', '灰色'], ['ブルー', '蓝色'], ['ベージュ', '米色'], ['アッシュグリーン', '灰绿色'],
  ['ラベンダーパープル', '薰衣草紫'], ['ブラウン', '棕色'], ['ブラック', '黑色'], ['レッド', '红色'],
  ['グリーン', '绿色'], ['ネイビー', '藏青色'], ['カーキ', '卡其色'], ['オレンジ', '橙色'],
  ['パープル', '紫色'], ['Purple', '紫色'], ['Kinari', '原色'], ['White', '白色'], ['Black', '黑色'],
  ['Pink', '粉色'], ['Blue', '蓝色'], ['Gray', '灰色'], ['Free', '均码'],
];

const state = {
  catalog: null,
  products: [],
  productMap: new Map(),
  brandMap: new Map(),
  groupMap: new Map(),
  brand: 'all',
  group: 'all',
  sort: 'featured',
  query: '',
  selectedVariants: new Map(),
  galleryIndexes: new Map(),
  cartEntries: [],
  route: null,
  lang: 'zh',
};

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));

const safeUrl = value => {
  const url = String(value || '');
  if (/^https:\/\//i.test(url) || /^(?:assets|\.?\/assets)\//i.test(url)) return url;
  return '';
};

function text(key, ...args) {
  const value = COPY[state.lang]?.[key] ?? COPY.zh[key] ?? key;
  return typeof value === 'function' ? value(...args) : value;
}

function readLanguage() {
  try {
    return localStorage.getItem(LANGUAGE_KEY) === 'ja' ? 'ja' : 'zh';
  } catch {
    return 'zh';
  }
}

function productName(product) {
  return state.lang === 'ja' ? product?.name || '' : product?.nameZh || product?.name || '';
}

function productOriginalName(product) {
  return product?.name || product?.sourceTitle || '';
}

function groupName(group) {
  if (!group) return '';
  return state.lang === 'ja' ? GROUP_NAMES_JA[group.id] || group.name : group.name;
}

function variantName(variant) {
  const original = variant?.name || text('defaultVariant');
  if (state.lang === 'ja') return original;
  return VARIANT_TRANSLATIONS.reduce((value, [from, to]) => value.replaceAll(from, to), original)
    .replaceAll('サイズ', '码')
    .replaceAll('・', ' · ');
}

function localizeProductText(product) {
  return state.lang === 'ja' ? productOriginalName(product) : text('originalName', productOriginalName(product));
}

function rmbPrice(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return Math.ceil((number * 0.05 + 20 - 1e-9) / 10) * 10;
}

function priceAmount(value) {
  const original = typeof value === 'object' ? value?.price : value;
  const number = Number(original);
  if (!Number.isFinite(number)) return null;
  if (state.lang === 'ja') return number;
  const storedRmb = typeof value === 'object' ? Number(value.priceRmb) : NaN;
  return Number.isFinite(storedRmb) ? storedRmb : rmbPrice(number);
}

function formatAmount(value) {
  if (value == null || Number.isNaN(Number(value))) return text('priceUnknown');
  const locale = state.lang === 'ja' ? 'ja-JP' : 'zh-CN';
  return `¥${new Intl.NumberFormat(locale).format(Number(value))}`;
}

function formatPrice(value) {
  return formatAmount(priceAmount(value));
}

function formatPriceRange(product) {
  const minimum = priceAmount({ price: product?.price, priceRmb: product?.priceRmb });
  const maximum = priceAmount({ price: product?.maxPrice, priceRmb: product?.maxPriceRmb });
  if (minimum == null) return text('priceUnknown');
  if (maximum == null || minimum === maximum) return formatAmount(minimum);
  return `${formatAmount(minimum)} ${state.lang === 'ja' ? 'から' : '起'}`;
}

function formatVariantPrice(variant) {
  return variant?.price == null ? text('priceUnknown') : formatPrice(variant);
}

function currencyCode() {
  return state.lang === 'ja' ? 'JPY' : 'RMB';
}

function isVariantAvailable(variant) {
  return Boolean(variant?.available);
}

function getProductVariants(product) {
  return Array.isArray(product?.variants) && product.variants.length
    ? product.variants
    : [{ id: 'default', name: text('defaultVariant'), price: product?.price, priceRmb: rmbPrice(product?.price), priceText: formatPrice(product?.price), available: true, sku: '' }];
}

function getDefaultVariant(product) {
  const variants = getProductVariants(product);
  return variants.find(isVariantAvailable) || variants[0] || null;
}

function getSelectedVariant(product) {
  if (!product) return null;
  const variants = getProductVariants(product);
  const storedId = state.selectedVariants.get(product.id);
  return variants.find(variant => String(variant.id) === String(storedId)) || getDefaultVariant(product);
}

function primaryGalleryImage(product) {
  const index = Number(state.galleryIndexes.get(product.id) || 0);
  return product.gallery?.[index] || product.gallery?.[0] || { url: product.image, alt: product.name };
}

function readStoredEntries() {
  try {
    const value = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function entryKey(entry) {
  return `${entry.productId}|${entry.variantId}`;
}

function normalizeEntry(value) {
  if (!value) return null;
  const productId = typeof value === 'string' ? value.split('|')[0] : value.productId;
  const variantId = typeof value === 'string' ? value.split('|')[1] : value.variantId;
  const product = state.productMap.get(String(productId));
  if (!product) return null;
  const variant = getProductVariants(product).find(item => String(item.id) === String(variantId)) || getDefaultVariant(product);
  return variant ? { productId: product.id, variantId: String(variant.id) } : null;
}

function dedupeEntries(entries) {
  const seen = new Set();
  return (entries || []).map(normalizeEntry).filter(entry => {
    if (!entry || seen.has(entryKey(entry))) return false;
    seen.add(entryKey(entry));
    return true;
  });
}

function writeCart(entries) {
  state.cartEntries = dedupeEntries(entries);
  try { localStorage.setItem(CART_KEY, JSON.stringify(state.cartEntries)); } catch { /* best effort */ }
  updateCartCount();
  return state.cartEntries;
}

function cartProducts(entries = state.cartEntries) {
  return dedupeEntries(entries).map(entry => {
    const product = state.productMap.get(entry.productId);
    const variant = getProductVariants(product).find(item => String(item.id) === String(entry.variantId)) || getDefaultVariant(product);
    return { ...product, variant, cartKey: entryKey(entry), variantName: variant?.name || '默认规格' };
  }).filter(item => item.variant);
}

function addToCart(product, variant) {
  if (!product || !variant || !isVariantAvailable(variant)) return false;
  const entry = { productId: product.id, variantId: String(variant.id) };
  const exists = state.cartEntries.some(item => entryKey(item) === entryKey(entry));
  if (!exists) writeCart([...state.cartEntries, entry]);
  return !exists;
}

function updateCartCount() {
  document.querySelectorAll('[data-cart-count]').forEach(element => {
    element.textContent = state.cartEntries.length;
    element.hidden = state.cartEntries.length === 0;
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function parseRoute() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [path, queryString = ''] = raw.split('?');
  const parts = path.split('/').filter(Boolean);
  const params = new URLSearchParams(queryString);
  if (!parts.length || parts[0] === 'products') {
    return { name: 'products', brand: params.get('brand') || 'all', group: params.get('group') || 'all' };
  }
  if (parts[0] === 'product') return { name: 'product', id: decodeURIComponent(parts[1] || '') };
  if (parts[0] === 'cart') return { name: 'cart', shared: params.has('ids'), ids: params.get('ids') || '' };
  return { name: 'products', brand: 'all', group: 'all' };
}

function serializeEntries(entries) {
  return dedupeEntries(entries).map(entry => `${entry.productId}~${entry.variantId}`).join(',');
}

function parseSharedEntries(value) {
  try {
    return dedupeEntries(decodeURIComponent(value || '').split(',').filter(Boolean).map(item => {
      const splitAt = item.lastIndexOf('~');
      return splitAt < 0 ? null : { productId: item.slice(0, splitAt), variantId: item.slice(splitAt + 1) };
    }));
  } catch {
    return [];
  }
}

function shareCart(entries) {
  const cleanEntries = dedupeEntries(entries);
  if (!cleanEntries.length) {
    showToast(text('toastEmpty'));
    return;
  }
  const url = `${location.origin}${location.pathname}#/cart?ids=${encodeURIComponent(serializeEntries(cleanEntries))}`;
  const shareData = { title: `${STORE_NAME} ${text('navSaved')}`, text: `${STORE_NAME} ${text('navSaved')}`, url };
  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
    return;
  }
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(url).then(() => showToast(text('toastCopied'))).catch(() => window.prompt(text('shareSaved'), url));
    return;
  }
  window.prompt(text('shareSaved'), url);
}

function filterLink({ type, id, label, count, active = false }) {
  const params = new URLSearchParams();
  if (type === 'brand' && id !== 'all') params.set('brand', id);
  if (type === 'group' && id !== 'all') params.set('group', id);
  const query = params.toString();
  return `<a class="filter-link ${active ? 'active' : ''}" href="#/products${query ? `?${query}` : ''}"><span>${escapeHtml(label)}</span><b>${count}</b></a>`;
}

function renderFilters() {
  const brandItems = [
    filterLink({ type: 'brand', id: 'all', label: text('allBrands'), count: state.products.length, active: state.brand === 'all' }),
    ...[...state.brandMap.values()].map(brand => filterLink({ type: 'brand', id: brand.id, label: brand.name, count: brand.count, active: state.brand === brand.id })),
  ];
  const groupItems = [
    filterLink({ type: 'group', id: 'all', label: text('allGroups'), count: state.products.length, active: state.group === 'all' }),
    ...[...state.groupMap.values()].map(group => filterLink({ type: 'group', id: group.id, label: groupName(group), count: group.count, active: state.group === group.id })),
  ];
  return `<div class="filter-section"><div class="filter-title"><span>${text('brands')}</span><small>BRANDS</small></div><div class="filter-links">${brandItems.join('')}</div></div><div class="filter-section"><div class="filter-title"><span>${text('categories')}</span><small>CATEGORIES</small></div><div class="filter-links">${groupItems.join('')}</div></div>`;
}

function matchesQuery(product) {
  if (!state.query) return true;
  const variants = getProductVariants(product).map(variant => `${variant.name} ${variant.sku}`).join(' ');
  const searchable = `${product.name} ${product.nameZh || ''} ${product.sourceTitle} ${product.brandName} ${product.groupName} ${groupName(state.groupMap.get(product.group))} ${product.handle} ${variants}`;
  return searchable.toLowerCase().includes(state.query.toLowerCase());
}

function filteredProducts() {
  let products = state.products.filter(product => {
    const brandMatch = state.brand === 'all' || product.brand === state.brand;
    const groupMatch = state.group === 'all' || product.group === state.group;
    return brandMatch && groupMatch && matchesQuery(product);
  });
  if (state.sort === 'price-low') products = [...products].sort((a, b) => (priceAmount({ price: a.price, priceRmb: a.priceRmb }) || Infinity) - (priceAmount({ price: b.price, priceRmb: b.priceRmb }) || Infinity));
  if (state.sort === 'price-high') products = [...products].sort((a, b) => (priceAmount({ price: b.price, priceRmb: b.priceRmb }) || 0) - (priceAmount({ price: a.price, priceRmb: a.priceRmb }) || 0));
  if (state.sort === 'name') products = [...products].sort((a, b) => String(a.name).localeCompare(String(b.name), 'ja'));
  return products;
}

function productCard(product) {
  const variants = getProductVariants(product);
  const available = variants.filter(isVariantAvailable).length;
  const hasAvailable = available > 0;
  const image = safeUrl(product.image);
  const name = productName(product);
  return `<article class="product-card"><a class="product-link" href="#/product/${encodeURIComponent(product.id)}" aria-label="${escapeHtml(text('viewProduct', name))}"><div class="product-image"><img src="${escapeHtml(image)}" alt="${escapeHtml(name)}" loading="lazy" decoding="async"><span class="image-mark ${hasAvailable ? '' : 'sold'}">${hasAvailable ? text('available') : text('soldOut')}</span><span class="product-index">${String(product.position).padStart(2, '0')}</span></div><div class="product-info"><div class="product-kicker"><span>${escapeHtml(product.brandName)}</span><span>${escapeHtml(groupName(state.groupMap.get(product.group)))}</span></div><h2>${escapeHtml(name)}</h2><p class="source-title">${escapeHtml(localizeProductText(product))}</p><div class="product-meta"><span class="product-price">${escapeHtml(formatPriceRange(product))}<small>${currencyCode()}</small></span><span class="variant-count">${text('availableCount', available, variants.length)}</span></div></div></a></article>`;
}

function heroMarkup() {
  const first = state.products[0];
  const heroImage = safeUrl(first?.image);
  const brandCount = state.brandMap.size;
  return `<section class="season-hero"><div class="hero-copy"><div class="hero-overline"><span>WAN VOYAGE</span><span>COLLECTION 026</span></div><h1>2026<br><em>Autumn &amp; Winter</em></h1><a class="hero-link" href="#/products">${text('browseAll')} <span>↗</span></a></div><div class="hero-visual"><div class="hero-frame"><img src="${escapeHtml(heroImage)}" alt="${escapeHtml(productName(first) || 'WAN VOYAGE 2026 Autumn & Winter')}" decoding="async"></div><div class="hero-side-note"><span>LOOKBOOK</span><strong>AW<br>26</strong></div></div><div class="hero-stats"><div><strong>${state.products.length}</strong><span>${text('productUnit')}</span></div><div><strong>${brandCount}</strong><span>${text('brandUnit')}</span></div><div><strong>${state.catalog.brand.variantCount}</strong><span>${text('variantUnit')}</span></div><div><strong>${state.catalog.brand.imageCount}</strong><span>${text('galleryUnit')}</span></div></div></section>`;
}

function renderProductsPage() {
  const filtered = filteredProducts();
  const title = state.query ? text('result') : state.brand !== 'all' ? state.brandMap.get(state.brand)?.name || text('brandProducts') : state.group !== 'all' ? groupName(state.groupMap.get(state.group)) || text('groupProducts') : text('allProducts');
  const description = state.query ? text('resultCount', { query: escapeHtml(state.query), total: filtered.length }) : text('catalogOrder', filtered.length);
  app.innerHTML = `${heroMarkup()}<div class="catalog-layout"><aside class="filter-panel"><div class="filter-heading"><span>${text('filterIndex')}</span><small>INDEX / 2026 AW</small></div>${renderFilters()}</aside><section class="shop-content"><div class="listing-head"><div class="listing-title"><span class="eyebrow">${STORE_ENGLISH} / ${state.catalog.brand.season}</span><h2>${escapeHtml(title)}</h2><p>${description}</p></div><div class="listing-controls"><label for="sortSelect">${text('sort')}</label><select id="sortSelect" aria-label="${text('sort')}"><option value="featured">${text('sortFeatured')}</option><option value="price-low">${text('sortLow')}</option><option value="price-high">${text('sortHigh')}</option><option value="name">${text('sortName')}</option></select></div></div><div class="product-grid">${filtered.length ? filtered.map(productCard).join('') : `<div class="empty-state"><strong>${text('noResults')}</strong><p>${text('noResultsHint')}</p></div>`}</div></section></div>`;
  const sortSelect = document.querySelector('#sortSelect');
  if (sortSelect) {
    sortSelect.value = state.sort;
    sortSelect.addEventListener('change', event => { state.sort = event.target.value; renderProductsPage(); updateHeader(); });
  }
}

function galleryMarkup(product) {
  const gallery = Array.isArray(product.gallery) && product.gallery.length ? product.gallery : [{ url: product.image, alt: product.name }];
  const selectedIndex = Math.min(Number(state.galleryIndexes.get(product.id) || 0), gallery.length - 1);
  const selected = gallery[selectedIndex];
  const thumbs = gallery.map((image, index) => `<button class="gallery-thumb ${index === selectedIndex ? 'active' : ''}" type="button" data-gallery-index="${index}" aria-label="${escapeHtml(text('galleryView', index + 1))}"><img src="${escapeHtml(safeUrl(image.url))}" alt="" loading="lazy" decoding="async"></button>`).join('');
  return `<div class="detail-gallery"><div class="gallery-main"><img src="${escapeHtml(safeUrl(selected.url))}" alt="${escapeHtml(selected.alt || productName(product))}" decoding="async"><span class="gallery-count">${selectedIndex + 1} / ${gallery.length}</span></div><div class="gallery-thumbs">${thumbs}</div><p class="gallery-note">${text('galleryNote', gallery.length)}</p></div>`;
}

function renderDetailPage(product) {
  if (!product) {
    app.innerHTML = `<div class="empty-state page-empty"><strong>${text('notFound')}</strong><p>${text('notFoundHint')}</p><a class="text-link" href="#/products">${text('backCatalog')}</a></div>`;
    return;
  }
  const variants = getProductVariants(product);
  const selected = getSelectedVariant(product);
  const availableCount = variants.filter(isVariantAvailable).length;
  const inCart = state.cartEntries.some(entry => entry.productId === product.id && String(entry.variantId) === String(selected?.id));
  const optionMarkup = variants.length > 1 ? `<label class="variant-field"><span>${text('selectVariant')} <small>${text('selectable', availableCount, variants.length)}</small></span><select id="variantSelect" aria-label="${text('selectVariant')}">${variants.map(variant => `<option value="${escapeHtml(variant.id)}" ${String(variant.id) === String(selected?.id) ? 'selected' : ''} ${isVariantAvailable(variant) ? '' : 'disabled'}>${escapeHtml(variantName(variant))} · ${escapeHtml(formatVariantPrice(variant))}${isVariantAvailable(variant) ? '' : ` · ${text('detailUnavailable')}`}</option>`).join('')}</select></label>` : `<div class="single-variant"><span>${text('variantUnit')}</span><strong>${escapeHtml(variantName(selected))}</strong></div>`;
  const detailFacts = `<dl class="detail-facts"><div><dt>${text('brandFact')}</dt><dd>${escapeHtml(product.brandName)}</dd></div><div><dt>${text('groupFact')}</dt><dd>${escapeHtml(groupName(state.groupMap.get(product.group)))}</dd></div><div><dt>${text('skuFact')}</dt><dd>${escapeHtml(product.handle)}</dd></div><div><dt>${text('variantFact')}</dt><dd>${text('variantFactValue', variants.length, availableCount)}</dd></div><div><dt>${text('priceFact')}</dt><dd>${escapeHtml(formatPriceRange(product))} ${currencyCode()}</dd></div></dl>`;
  const detailBody = product.detailsHtml || `<p>${text('detailsOriginal')}</p>`;
  app.innerHTML = `<div class="detail-page"><div class="breadcrumb"><a href="#/products">${text('backCatalog')}</a><span>/</span><span>${escapeHtml(product.brandName)}</span><span>/</span><span>${escapeHtml(productName(product))}</span></div><div class="detail-layout">${galleryMarkup(product)}<div class="detail-copy"><a class="back-link" href="#/products">← ${text('backCatalog')}</a><div class="detail-label"><span>${escapeHtml(product.brandName)}</span><span>${escapeHtml(groupName(state.groupMap.get(product.group)))}</span></div><h1>${escapeHtml(productName(product))}</h1><p class="detail-source-title">${escapeHtml(localizeProductText(product))}</p><p class="detail-price">${escapeHtml(formatVariantPrice(selected))}<small>${escapeHtml(text('priceCurrency'))}</small></p><div class="detail-divider"></div>${optionMarkup}${detailFacts}<button class="add-button" type="button" id="detailAdd" ${!isVariantAvailable(selected) || inCart ? 'disabled' : ''}>${inCart ? text('saved') : isVariantAvailable(selected) ? text('addSaved') : text('detailUnavailable')}</button><p class="detail-note">${text('savedNote')}</p></div></div><section class="details-section"><div class="section-heading"><div><span class="eyebrow">DETAILS / ${escapeHtml(product.handle)}</span><h2>${text('productDetails')}</h2></div><span>${escapeHtml(product.brandName)}</span></div><p class="details-language-note">${text('detailsOriginal')}</p><div class="details-body">${detailBody}</div></section></div>`;
  document.querySelectorAll('[data-gallery-index]').forEach(button => button.addEventListener('click', () => {
    state.galleryIndexes.set(product.id, Number(button.dataset.galleryIndex));
    renderDetailPage(product);
  }));
  document.querySelector('#variantSelect')?.addEventListener('change', event => {
    state.selectedVariants.set(product.id, event.target.value);
    renderDetailPage(product);
    updateHeader();
  });
  document.querySelector('#detailAdd')?.addEventListener('click', () => {
    const added = addToCart(product, getSelectedVariant(product));
    showToast(added ? text('saved') : state.lang === 'ja' ? 'この仕様はすでにお気に入りに追加されています。' : '这个规格已经在收藏夹里。');
    renderDetailPage(product);
    updateHeader();
  });
}

function renderCartPage(route) {
  const sharedEntries = route.shared ? parseSharedEntries(route.ids) : state.cartEntries;
  const items = cartProducts(sharedEntries);
  const title = route.shared ? text('sharedSaved') : text('mySaved');
  const total = items.reduce((sum, item) => sum + (priceAmount(item.variant) || 0), 0);
  const actionButtons = items.length ? `<div class="cart-actions">${route.shared ? `<button class="save-button" type="button" data-save-shared>${text('saveToMine')}</button>` : ''}<button class="share-button" type="button" data-share-cart>${text('shareSaved')}</button>${route.shared ? '' : `<button class="clear-button" type="button" data-clear-cart>${text('clearSaved')}</button>`}</div>` : '';
  const list = items.length ? `<div class="cart-grid">${items.map(item => `<article class="cart-item"><a class="cart-thumb" href="#/product/${encodeURIComponent(item.id)}"><img src="${escapeHtml(safeUrl(item.image))}" alt="${escapeHtml(productName(item))}" loading="lazy" decoding="async"></a><div class="cart-info"><p class="product-category">${escapeHtml(item.brandName)} · ${escapeHtml(groupName(state.groupMap.get(item.group)))}</p><h2>${escapeHtml(productName(item))}</h2><p class="cart-variant">${escapeHtml(variantName(item.variant))}</p><p class="cart-price">${escapeHtml(formatVariantPrice(item.variant))} ${currencyCode()}</p></div><button class="remove-button" type="button" data-remove-cart="${escapeHtml(item.cartKey)}">${text('remove')}</button></article>`).join('')}</div><div class="cart-total"><span>${text('totalReference')}</span><strong>${escapeHtml(formatAmount(total))}<small>${currencyCode()}</small></strong></div>` : `<div class="cart-empty"><div class="empty-symbol">♡</div><h2>${text('emptySaved')}</h2><p>${route.shared ? text('sharedEmpty') : text('localEmpty')}</p><a href="#/products">${text('browseCatalog')}</a></div>`;
  const suffix = route.shared ? text('sharedSuffix') : text('localSuffix');
  app.innerHTML = `<section class="cart-page"><div class="cart-head"><div><span class="eyebrow">${STORE_ENGLISH} / ${text('savedList')}</span><h1>${escapeHtml(title)}</h1><p>${text('savedCount', items.length)}${suffix}</p></div><span class="cart-head-mark">♡</span></div>${actionButtons}${list}<p class="cart-note">${text('savedDisclaimer')}</p></section>`;
  document.querySelector('[data-share-cart]')?.addEventListener('click', () => shareCart(sharedEntries));
  document.querySelector('[data-clear-cart]')?.addEventListener('click', () => { writeCart([]); renderCartPage({ name: 'cart', shared: false, ids: '' }); updateHeader(); showToast(text('toastCleared')); });
  document.querySelector('[data-save-shared]')?.addEventListener('click', () => { writeCart([...state.cartEntries, ...sharedEntries]); location.hash = '#/cart'; showToast(text('toastSaved')); });
  document.querySelectorAll('[data-remove-cart]').forEach(button => button.addEventListener('click', () => {
    const next = state.cartEntries.filter(entry => entryKey(entry) !== button.dataset.removeCart);
    writeCart(next);
    renderCartPage({ name: 'cart', shared: false, ids: '' });
  }));
}

function updateStaticChrome() {
  document.documentElement.lang = state.lang === 'ja' ? 'ja' : 'zh-CN';
  document.title = state.lang === 'ja' ? 'WAN VOYAGE · 2026 Autumn & Winter（日本語原版）' : 'WAN VOYAGE · 2026 Autumn & Winter';
  const announcementTitle = document.querySelector('#announcementTitle');
  const identityCaption = document.querySelector('#identityCaption');
  const desktopCatalog = document.querySelector('#desktopCatalogLabel');
  const desktopSaved = document.querySelector('#desktopSavedLabel');
  const mobileCatalog = document.querySelector('#mobileCatalogLabel');
  const mobileSaved = document.querySelector('#mobileSavedLabel');
  const footerNote = document.querySelector('#footerNote');
  if (announcementTitle) announcementTitle.textContent = text('announcementTitle');
  if (identityCaption) identityCaption.textContent = text('identityCaption');
  if (desktopCatalog) desktopCatalog.textContent = text('navCatalog');
  if (desktopSaved) desktopSaved.textContent = text('navSaved');
  if (mobileCatalog) mobileCatalog.textContent = text('navCatalog');
  if (mobileSaved) mobileSaved.textContent = text('navSaved');
  if (footerNote) footerNote.textContent = 'Designer’s Dogware Select Shop';
  searchInput.placeholder = text('searchPlaceholder');
  searchInput.setAttribute('aria-label', text('searchLabel'));
  document.querySelectorAll('[data-language]').forEach(button => {
    const active = button.dataset.language === state.lang;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function setLanguage(language) {
  state.lang = language === 'ja' ? 'ja' : 'zh';
  try { localStorage.setItem(LANGUAGE_KEY, state.lang); } catch { /* best effort */ }
  render();
}

function updateHeader() {
  const route = state.route || parseRoute();
  document.querySelectorAll('[data-nav]').forEach(link => { link.classList.toggle('active', link.dataset.nav === route.name); });
  const count = state.catalog?.brand?.productCount || state.products.length;
  const countText = count ? `${count}` : '';
  const catalogCount = document.querySelector('#catalogCount');
  const mobileCatalogCount = document.querySelector('#mobileCatalogCount');
  if (catalogCount) catalogCount.textContent = countText;
  if (mobileCatalogCount) mobileCatalogCount.textContent = countText;
  const footerCount = document.querySelector('#footerProductCount');
  if (footerCount) footerCount.textContent = count;
  updateStaticChrome();
  updateCartCount();
}

function render() {
  state.route = parseRoute();
  state.brand = state.route.brand || 'all';
  state.group = state.route.group || 'all';
  if (state.route.name === 'product') renderDetailPage(state.productMap.get(String(state.route.id)));
  else if (state.route.name === 'cart') renderCartPage(state.route);
  else renderProductsPage();
  updateHeader();
  if (state.route.name !== 'product' || !state.galleryIndexes.has(state.route.id)) window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function bootstrap() {
  try {
    state.lang = readLanguage();
    const response = await fetch(CATALOG_URL);
    if (!response.ok) throw new Error(`目录加载失败：${response.status}`);
    state.catalog = await response.json();
    state.products = Array.isArray(state.catalog.products) ? state.catalog.products : [];
    state.productMap = new Map(state.products.map(product => [String(product.id), product]));
    state.brandMap = new Map((state.catalog.filters?.brands || []).map(brand => [brand.id, brand]));
    state.groupMap = new Map((state.catalog.filters?.groups || []).map(group => [group.id, group]));
    writeCart(readStoredEntries());
    render();
  } catch (error) {
    app.innerHTML = `<div class="empty-state page-empty"><strong>目录暂时无法加载</strong><p>${escapeHtml(error.message)}。请刷新页面重试。</p></div>`;
  }
}

searchInput.addEventListener('input', event => {
  state.query = event.target.value.trim();
  clearSearch.hidden = !state.query;
  if (state.route?.name !== 'products') location.hash = '#/products';
  else renderProductsPage();
});

clearSearch.addEventListener('click', () => {
  searchInput.value = '';
  state.query = '';
  clearSearch.hidden = true;
  renderProductsPage();
  searchInput.focus();
});

document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));

window.addEventListener('hashchange', render);
bootstrap();
