const app = document.querySelector('#app');
const searchInput = document.querySelector('#searchInput');
const clearSearch = document.querySelector('#clearSearch');
const toast = document.querySelector('#toast');
const STORE_NAME = '绒爪选物';
const STORE_ENGLISH = 'PAW ATELIER';
const CART_KEY = 'paw_atelier_web_cart_v1';
const LANGUAGE_KEY = 'paw_atelier_language_v1';

const translations = {
  zh: {
    htmlLang: 'zh-CN',
    title: `${STORE_NAME} · 商品目录`,
    description: `${STORE_NAME} · 宠物发饰、项圈与配件商品目录。`,
    announcementType: '宠物发饰与配件',
    brandHomeAria: `${STORE_NAME}商品首页`,
    identityCaption: 'PET RIBBON & ACCESSORIES',
    navProducts: '商品',
    navCart: '心愿单',
    mobileNavAria: '移动端导航',
    searchPlaceholder: '搜索商品、规格或分类',
    searchAria: '搜索商品、规格或分类',
    clearSearch: '清空搜索',
    languageSwitcher: '语言切换',
    categoryHeading: '商品分类',
    categoriesEn: 'Categories',
    allItems: '全部商品',
    allItemsEn: 'All items',
    otherItems: '其他商品',
    otherItemsEn: 'Other items',
    categoryMap: {
      'Hair ribbon': '发饰',
      Option: '配件',
      Collar: '项圈',
      Necklace: '项链',
      'Pet Goods': '宠物用品',
      'hair ribbon sold out': '已售罄发饰',
    },
    heroAlt: `${STORE_NAME}商品精选`,
    heroEyebrow: `${STORE_ENGLISH} · PET ACCESSORIES`,
    heroTitle: '小小的装饰，<br>也值得认真挑选。',
    collectionEyebrow: `${STORE_ENGLISH} / COLLECTION`,
    productCount: count => `${count} 件商品`,
    searchResult: (query, count) => `“${query}”的搜索结果 · ${count} 件`,
    searchResultsTitle: '搜索结果',
    sort: '排序',
    sortFeatured: '默认顺序',
    sortPriceLow: '价格由低到高',
    sortPriceHigh: '价格由高到低',
    sortName: '按名称',
    sortAria: '商品排序',
    viewProduct: name => `查看 ${name}`,
    soldOut: '暂时缺货',
    variantCount: count => `${count} 个规格`,
    singleVariant: '单一规格',
    pricePending: '价格待确认',
    priceFrom: price => `${price} 起`,
    defaultVariant: '默认规格',
    detailBack: '← 返回商品目录',
    detailBreadcrumb: '商品',
    variantLegend: '选择规格与价格',
    variantStock: '暂时缺货',
    priceReference: 'RMB 参考价',
    currentVariant: '当前规格',
    productCode: '商品编号',
    productCategory: '商品分类',
    source: '资料来源',
    status: '在售状态',
    available: '可加入心愿单',
    unavailable: '暂时缺货',
    addToCart: '加入心愿单',
    inCart: '已在心愿单',
    detailNote: '选择规格后，加入心愿单会保留对应规格和人民币参考价。',
    missingProduct: '商品不存在',
    missingProductText: '这件商品可能已经从当前目录中移除。',
    returnProducts: '返回商品目录',
    cartEyebrow: `${STORE_ENGLISH} / WISHLIST`,
    cartTitle: '我的心愿单',
    sharedCartTitle: '朋友分享的心愿单',
    cartStatus: (count, shared) => `${count} 件商品${shared ? ' · 来自分享链接' : ' · 保存在本机'}`,
    saveShared: '保存到我的心愿单',
    shareCart: '分享心愿单',
    clearCart: '清空',
    remove: '移除',
    cartTotal: '合计参考价',
    cartEmptyTitle: '心愿单还是空的',
    cartEmptyText: '看到喜欢的商品，就先放进心愿单吧。',
    sharedCartEmptyText: '这条分享清单没有可展示的商品。',
    chooseProducts: '去挑选商品　↗',
    cartNote: '心愿单只保存在当前浏览器。分享时会把商品和规格编码进链接；它不是订单，价格和库存可能随时间变化。',
    shareEmpty: '心愿单是空的，先挑选几件喜欢的商品吧。',
    shareCopied: '分享链接已复制，可以发给微信好友。',
    copyPrompt: '复制这个心愿单分享链接',
    sharedTitle: `${STORE_NAME}心愿单`,
    sharedText: `看看我在${STORE_NAME}挑的商品`,
    added: '已加入心愿单。',
    alreadyInCart: '这个规格已经在心愿单里。',
    savedToCart: '已保存到我的心愿单。',
    cartCleared: '心愿单已清空。',
    noProducts: '没有找到商品',
    noProductsText: '换一个关键词，或选择其他分类试试。',
    loadError: '商品目录暂时无法加载',
    loadErrorText: '请通过本地服务器或网站地址打开此页面。',
    sourceFallback: '品牌公开目录',
    footerTagline: '为小小的它，挑一件刚刚好的装饰。',
  },
  ja: {
    htmlLang: 'ja',
    title: `${STORE_NAME} · 商品カタログ`,
    description: `${STORE_NAME} · ペット用リボン、首輪、アクセサリーの商品カタログ。`,
    announcementType: 'ペット用リボン・首輪・アクセサリー',
    brandHomeAria: `${STORE_NAME}の商品トップ`,
    identityCaption: 'PET RIBBON & ACCESSORIES',
    navProducts: '商品',
    navCart: 'ウィッシュリスト',
    mobileNavAria: 'モバイルナビゲーション',
    searchPlaceholder: '商品名・仕様・カテゴリーを検索',
    searchAria: '商品名・仕様・カテゴリーを検索',
    clearSearch: '検索をクリア',
    languageSwitcher: '言語切り替え',
    categoryHeading: 'カテゴリー',
    categoriesEn: 'Categories',
    allItems: 'すべての商品',
    allItemsEn: 'All items',
    otherItems: 'その他の商品',
    otherItemsEn: 'Other items',
    categoryMap: {
      'Hair ribbon': 'リボン・ヘアアクセサリー',
      Option: 'アクセサリー',
      Collar: '首輪',
      Necklace: 'ネックレス',
      'Pet Goods': 'ペット用品',
      'hair ribbon sold out': '販売終了リボン',
    },
    heroAlt: `${STORE_NAME}の商品セレクション`,
    heroEyebrow: `${STORE_ENGLISH} · PET ACCESSORIES`,
    heroTitle: '小さな装いも、<br>丁寧に選ぶ。',
    collectionEyebrow: `${STORE_ENGLISH} / COLLECTION`,
    productCount: count => `${count}点の商品`,
    searchResult: (query, count) => `「${query}」の検索結果 · ${count}点`,
    searchResultsTitle: '検索結果',
    sort: '並び替え',
    sortFeatured: 'おすすめ順',
    sortPriceLow: '価格の安い順',
    sortPriceHigh: '価格の高い順',
    sortName: '名前順',
    sortAria: '商品の並び替え',
    viewProduct: name => `${name}の詳細を見る`,
    soldOut: '在庫切れ',
    variantCount: count => `${count}仕様`,
    singleVariant: '単一仕様',
    pricePending: '価格未定',
    priceFrom: price => `${price}から`,
    defaultVariant: '標準仕様',
    detailBack: '← 商品一覧へ戻る',
    detailBreadcrumb: '商品',
    variantLegend: '仕様と価格を選択',
    variantStock: '在庫切れ',
    priceReference: 'RMB参考価格',
    currentVariant: '選択中の仕様',
    productCode: '商品番号',
    productCategory: 'カテゴリー',
    source: '資料出典',
    status: '販売状況',
    available: 'ウィッシュリストに追加できます',
    unavailable: '在庫切れ',
    addToCart: 'ウィッシュリストに追加',
    inCart: 'ウィッシュリストに追加済み',
    detailNote: '仕様を選択すると、その仕様と人民元参考価格がウィッシュリストに保存されます。',
    missingProduct: '商品が見つかりません',
    missingProductText: 'この商品は現在のカタログから削除された可能性があります。',
    returnProducts: '商品一覧に戻る',
    cartEyebrow: `${STORE_ENGLISH} / WISHLIST`,
    cartTitle: 'マイウィッシュリスト',
    sharedCartTitle: '友だちから共有されたウィッシュリスト',
    cartStatus: (count, shared) => `${count}点${shared ? ' · 共有リンクから' : ' · この端末に保存'}`,
    saveShared: 'マイウィッシュリストに保存',
    shareCart: 'ウィッシュリストを共有',
    clearCart: '空にする',
    remove: '削除',
    cartTotal: '参考価格合計',
    cartEmptyTitle: 'ウィッシュリストは空です',
    cartEmptyText: '気になる商品をウィッシュリストに入れてみましょう。',
    sharedCartEmptyText: 'この共有リストに表示できる商品はありません。',
    chooseProducts: '商品を選ぶ　↗',
    cartNote: 'ウィッシュリストは現在のブラウザにのみ保存されます。共有時は商品と仕様をリンクに含めます。注文ではないため、価格や在庫は変わる場合があります。',
    shareEmpty: 'ウィッシュリストが空です。まず気になる商品を選んでください。',
    shareCopied: '共有リンクをコピーしました。WeChatで友だちに送れます。',
    copyPrompt: 'ウィッシュリスト共有リンクをコピー',
    sharedTitle: `${STORE_NAME}のウィッシュリスト`,
    sharedText: `${STORE_NAME}で選んだ商品を見てください`,
    added: 'ウィッシュリストに追加しました。',
    alreadyInCart: 'この仕様はすでにウィッシュリストに入っています。',
    savedToCart: 'マイウィッシュリストに保存しました。',
    cartCleared: 'ウィッシュリストを空にしました。',
    noProducts: '商品が見つかりません',
    noProductsText: 'キーワードを変えるか、別のカテゴリーを選んでください。',
    loadError: 'カタログを読み込めません',
    loadErrorText: 'ローカルサーバーまたはサイトのURLから開いてください。',
    sourceFallback: '公開カタログ',
    footerTagline: '小さな家族に、ちょうどいい装いを。',
  },
};

const state = {
  language: 'zh',
  catalog: null,
  products: [],
  productMap: new Map(),
  categoryMap: new Map(),
  category: 'all',
  sort: 'featured',
  query: '',
  selectedVariants: new Map(),
  cartEntries: [],
  route: null,
};

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));

const assetPath = value => {
  const path = String(value || '');
  return path.startsWith('/') ? `.${path}` : path;
};

const baseCategoryName = name => String(name || '').split('：')[0].trim();

function ui(key, ...args) {
  const value = translations[state.language]?.[key] ?? translations.zh[key] ?? key;
  return typeof value === 'function' ? value(...args) : value;
}

function readLanguage() {
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    return saved === 'ja' ? 'ja' : 'zh';
  } catch {
    return 'zh';
  }
}

function setLanguage(language) {
  state.language = language === 'ja' ? 'ja' : 'zh';
  try { localStorage.setItem(LANGUAGE_KEY, state.language); } catch { /* storage is best effort */ }
  toast.classList.remove('show');
  applyLanguage();
  if (state.catalog) render();
}

function applyLanguage() {
  const lang = translations[state.language];
  document.documentElement.lang = lang.htmlLang;
  document.title = lang.title;
  document.querySelector('#metaDescription')?.setAttribute('content', lang.description);
  const textBindings = {
    announcementType: lang.announcementType,
    identityCaption: lang.identityCaption,
    navProductsLabel: lang.navProducts,
    navCartLabel: lang.navCart,
    mobileProductsLabel: lang.navProducts,
    mobileCartLabel: lang.navCart,
    footerTagline: lang.footerTagline,
  };
  Object.entries(textBindings).forEach(([id, value]) => {
    const element = document.querySelector(`#${id}`);
    if (element) element.textContent = value;
  });
  document.querySelector('#brandHome')?.setAttribute('aria-label', lang.brandHomeAria);
  document.querySelector('#mobileNav')?.setAttribute('aria-label', lang.mobileNavAria);
  document.querySelector('#languageSwitcher')?.setAttribute('aria-label', lang.languageSwitcher);
  if (searchInput) {
    searchInput.placeholder = lang.searchPlaceholder;
    searchInput.setAttribute('aria-label', lang.searchAria);
  }
  clearSearch?.setAttribute('aria-label', lang.clearSearch);
  document.querySelectorAll('[data-language]').forEach(button => {
    const active = button.dataset.language === state.language;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function categoryIsPaused(category) {
  return String(category?.name || '').includes('販売休止');
}

function categoryLabel(category) {
  if (!category) return ui('otherItems');
  const base = baseCategoryName(category.name);
  const mapped = translations[state.language].categoryMap[base] || (state.language === 'zh' ? category.sheetZh || base : base);
  if (categoryIsPaused(category)) return state.language === 'ja' ? `${mapped}（販売休止中）` : `${mapped}（暂停销售）`;
  return mapped;
}

function categorySecondary(category) {
  if (!category) return ui('otherItemsEn');
  if (categoryIsPaused(category)) return state.language === 'ja' ? '販売休止中' : '販売休止中';
  return baseCategoryName(category.name);
}

function isVariantAvailable(variant) {
  return variant && variant.available !== false && (variant.stock == null || Number(variant.stock) > 0);
}

function formatPrice(value) {
  if (value == null || Number.isNaN(Number(value))) return ui('pricePending');
  const locale = state.language === 'ja' ? 'ja-JP' : 'zh-CN';
  return `¥${new Intl.NumberFormat(locale).format(Number(value))}`;
}

function formatVariantPrice(variant) {
  if (!variant || variant.price == null) return ui('pricePending');
  return formatPrice(variant.price);
}

function getProductVariants(product) {
  if (Array.isArray(product?.variants) && product.variants.length) return product.variants;
  return [{ id: 'default', name: ui('defaultVariant'), price: product?.price, priceText: product?.priceText, available: true }];
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

function priceRange(product) {
  const values = getProductVariants(product).map(variant => Number(variant.price)).filter(value => Number.isFinite(value));
  if (!values.length) return ui('pricePending');
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max ? formatPrice(min) : ui('priceFrom', formatPrice(min));
}

function getProductCategories(product) {
  const categories = (product.categories || []).map(id => state.categoryMap.get(String(id))).filter(Boolean);
  return categories.length ? categories : [{ id: 'uncategorized', name: ui('otherItems'), label: ui('otherItems') }];
}

function primaryCategory(product) {
  return getProductCategories(product)[0];
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
  try { localStorage.setItem(CART_KEY, JSON.stringify(state.cartEntries)); } catch { /* storage is best effort */ }
  updateCartCount();
  return state.cartEntries;
}

function cartProducts(entries = state.cartEntries) {
  return dedupeEntries(entries).map(entry => {
    const product = state.productMap.get(entry.productId);
    const variant = getProductVariants(product).find(item => String(item.id) === String(entry.variantId)) || getDefaultVariant(product);
    return { ...product, variant, cartKey: entryKey(entry), variantName: variant?.name || ui('defaultVariant') };
  }).filter(item => item.variant);
}

function addToCart(product, variant) {
  if (!product || !variant || !isVariantAvailable(variant)) return false;
  const entry = { productId: product.id, variantId: String(variant.id) };
  const exists = state.cartEntries.some(item => entryKey(item) === entryKey(entry));
  if (!exists) writeCart([...state.cartEntries, entry]);
  return !exists;
}

function removeFromCart(key, entries = state.cartEntries) {
  return entries.filter(entry => entryKey(entry) !== key);
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
  if (!parts.length || parts[0] === 'products') return { name: 'products', category: params.get('category') || 'all' };
  if (parts[0] === 'product') return { name: 'product', id: decodeURIComponent(parts[1] || '') };
  if (parts[0] === 'cart') return { name: 'cart', shared: params.has('ids'), ids: params.get('ids') || '' };
  return { name: 'products', category: 'all' };
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
    showToast(ui('shareEmpty'));
    return;
  }
  const url = `${location.origin}${location.pathname}#/cart?ids=${encodeURIComponent(serializeEntries(cleanEntries))}`;
  const shareData = { title: ui('sharedTitle'), text: ui('sharedText'), url };
  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
    return;
  }
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(url).then(() => showToast(ui('shareCopied'))).catch(() => window.prompt(ui('copyPrompt'), url));
    return;
  }
  window.prompt(ui('copyPrompt'), url);
}

function renderCategories() {
  const categories = [...state.categoryMap.values()];
  const countFor = id => id === 'all'
    ? state.products.length
    : state.products.filter(product => id === 'uncategorized'
      ? !(product.categories || []).length
      : (product.categories || []).map(String).includes(String(id))).length;
  const items = [
    { id: 'all', label: ui('allItems'), secondary: ui('allItemsEn') },
    ...categories.map(category => ({ id: category.id, label: categoryLabel(category), secondary: categorySecondary(category), paused: categoryIsPaused(category) })),
  ];
  const uncategorizedCount = countFor('uncategorized');
  if (uncategorizedCount) items.push({ id: 'uncategorized', label: ui('otherItems'), secondary: ui('otherItemsEn') });
  return items.map(item => `<a class="category-link ${state.category === String(item.id) ? 'active' : ''} ${item.paused ? 'paused' : ''}" href="#/products?category=${encodeURIComponent(item.id)}"><span class="category-text"><span>${escapeHtml(item.label)}</span><span class="jp">${escapeHtml(item.secondary)}</span></span><span class="count">${countFor(item.id)}</span></a>`).join('');
}

function matchesQuery(product) {
  if (!state.query) return true;
  const categoryText = getProductCategories(product).flatMap(category => [categoryLabel(category), category.name]).join(' ');
  const variants = getProductVariants(product).map(variant => variant.name).join(' ');
  return `${product.name} ${categoryText} ${variants} ${product.id}`.toLowerCase().includes(state.query.toLowerCase());
}

function filteredProducts() {
  let products = state.products.filter(product => {
    const categoryMatch = state.category === 'all'
      || (state.category === 'uncategorized' ? !(product.categories || []).length : (product.categories || []).map(String).includes(String(state.category)));
    return categoryMatch && matchesQuery(product);
  });
  if (state.sort === 'price-low') products = [...products].sort((a, b) => (Number(a.price) || Infinity) - (Number(b.price) || Infinity));
  if (state.sort === 'price-high') products = [...products].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
  if (state.sort === 'name') products = [...products].sort((a, b) => String(a.name).localeCompare(String(b.name), 'ja'));
  return products;
}

function productCard(product) {
  const category = primaryCategory(product);
  const variants = getProductVariants(product);
  const hasAvailable = variants.some(isVariantAvailable);
  return `<article class="product-card"><a class="product-link" href="#/product/${encodeURIComponent(product.id)}" aria-label="${escapeHtml(ui('viewProduct', product.name))}"><div class="product-image"><img src="${escapeHtml(assetPath(product.image))}" alt="${escapeHtml(product.name)}" loading="lazy" decoding="async"><span class="image-mark ${hasAvailable ? '' : 'sold'}">${hasAvailable ? STORE_ENGLISH : ui('soldOut')}</span></div><div class="product-info"><p class="product-category">${escapeHtml(categoryLabel(category))}</p><h2>${escapeHtml(product.name)}</h2><div class="product-meta"><span class="product-price">${escapeHtml(priceRange(product))}<small>RMB</small></span><span class="variant-count">${variants.length > 1 ? ui('variantCount', variants.length) : ui('singleVariant')}</span></div></div></a></article>`;
}

function renderProductsPage() {
  const filtered = filteredProducts();
  const category = state.category === 'all' || state.category === 'uncategorized' ? null : state.categoryMap.get(String(state.category));
  const title = category ? categoryLabel(category) : state.category === 'uncategorized' ? ui('otherItems') : state.query ? ui('searchResultsTitle') : ui('allItems');
  const description = state.query ? ui('searchResult', escapeHtml(state.query), filtered.length) : ui('productCount', filtered.length);
  const emptyState = `<div class="empty-state"><strong>${escapeHtml(ui('noProducts'))}</strong><p>${escapeHtml(ui('noProductsText'))}</p></div>`;
  app.innerHTML = `<section class="hero"><div class="hero-media"><img src="${escapeHtml(assetPath(state.catalog.brand.banner))}" alt="${escapeHtml(ui('heroAlt'))}"></div><div class="hero-copy"><span class="eyebrow">${escapeHtml(ui('heroEyebrow'))}</span><h1>${ui('heroTitle')}</h1></div><div class="hero-serial">THE COLLECTION<br><strong>01</strong></div></section><div class="shop-layout"><aside class="filter-panel"><div class="filter-heading"><span>${escapeHtml(ui('categoryHeading'))}</span><small>${escapeHtml(ui('categoriesEn'))}</small></div><div class="category-list">${renderCategories()}</div></aside><section class="shop-content"><div class="listing-head"><div class="listing-title"><span class="eyebrow">${escapeHtml(ui('collectionEyebrow'))}</span><h1>${escapeHtml(title)}</h1><p>${description}</p></div><div class="listing-controls"><label for="sortSelect">${escapeHtml(ui('sort'))}</label><select id="sortSelect" aria-label="${escapeHtml(ui('sortAria'))}"><option value="featured">${escapeHtml(ui('sortFeatured'))}</option><option value="price-low">${escapeHtml(ui('sortPriceLow'))}</option><option value="price-high">${escapeHtml(ui('sortPriceHigh'))}</option><option value="name">${escapeHtml(ui('sortName'))}</option></select></div></div><div class="product-grid">${filtered.length ? filtered.map(productCard).join('') : emptyState}</div></section></div>`;
  const sortSelect = document.querySelector('#sortSelect');
  if (sortSelect) {
    sortSelect.value = state.sort;
    sortSelect.addEventListener('change', event => { state.sort = event.target.value; renderProductsPage(); updateHeader(); });
  }
}

function renderDetailPage(product) {
  if (!product) {
    app.innerHTML = `<div class="empty-state"><strong>${escapeHtml(ui('missingProduct'))}</strong><p>${escapeHtml(ui('missingProductText'))}</p><a class="text-link" href="#/products">${escapeHtml(ui('returnProducts'))}</a></div>`;
    return;
  }
  const variants = getProductVariants(product);
  const selected = getSelectedVariant(product);
  const hasAvailable = variants.some(isVariantAvailable);
  const inCart = state.cartEntries.some(entry => entry.productId === product.id && String(entry.variantId) === String(selected?.id));
  const categories = getProductCategories(product);
  const variantOptions = variants.length > 1 ? `<fieldset class="variant-fieldset"><legend>${escapeHtml(ui('variantLegend'))}</legend><div class="variant-list">${variants.map(variant => `<label class="variant-option ${String(variant.id) === String(selected?.id) ? 'selected' : ''} ${isVariantAvailable(variant) ? '' : 'unavailable'}"><input type="radio" name="variant" value="${escapeHtml(variant.id)}" ${String(variant.id) === String(selected?.id) ? 'checked' : ''} ${isVariantAvailable(variant) ? '' : 'disabled'}><span class="variant-name">${escapeHtml(variant.name || ui('defaultVariant'))}</span><span class="variant-price">${escapeHtml(variant.priceText || formatVariantPrice(variant))}</span>${isVariantAvailable(variant) ? '' : `<span class="variant-stock">${escapeHtml(ui('variantStock'))}</span>`}</label>`).join('')}</div></fieldset>` : '';
  app.innerHTML = `<div class="detail-page"><div class="breadcrumb"><a href="#/products">${escapeHtml(ui('detailBreadcrumb'))}</a><span>/</span><span>${escapeHtml(categories.map(category => categoryLabel(category)).join(' / '))}</span><span>/</span><span>${escapeHtml(product.name)}</span></div><div class="detail-layout"><div class="detail-media"><img src="${escapeHtml(assetPath(product.image))}" alt="${escapeHtml(product.name)}"><span class="image-mark ${hasAvailable ? '' : 'sold'}">${hasAvailable ? STORE_ENGLISH : ui('soldOut')}</span></div><div class="detail-copy"><a class="back-link" href="#/products">${escapeHtml(ui('detailBack'))}</a><span class="eyebrow">${escapeHtml(STORE_ENGLISH)} / ${escapeHtml(categoryLabel(categories[0]))}</span><h1>${escapeHtml(product.name)}</h1><p class="detail-price">${escapeHtml(formatVariantPrice(selected))}<small>${escapeHtml(ui('priceReference'))}</small></p><div class="detail-divider"></div>${variantOptions}<dl class="detail-facts"><div class="detail-fact"><dt>${escapeHtml(ui('currentVariant'))}</dt><dd>${escapeHtml(selected?.name || ui('defaultVariant'))}</dd></div><div class="detail-fact"><dt>${escapeHtml(ui('productCode'))}</dt><dd>${escapeHtml(selected?.itemCode || product.id)}</dd></div><div class="detail-fact"><dt>${escapeHtml(ui('productCategory'))}</dt><dd>${escapeHtml(categories.map(category => categoryLabel(category)).join(' / '))}</dd></div><div class="detail-fact"><dt>${escapeHtml(ui('source'))}</dt><dd>${escapeHtml(state.catalog.brand.sourceBrand || ui('sourceFallback'))}</dd></div><div class="detail-fact"><dt>${escapeHtml(ui('status'))}</dt><dd>${escapeHtml(isVariantAvailable(selected) ? ui('available') : ui('unavailable'))}</dd></div></dl><button class="add-button" type="button" id="detailAdd" ${!isVariantAvailable(selected) || inCart ? 'disabled' : ''}>${escapeHtml(inCart ? ui('inCart') : ui('addToCart'))}</button><p class="detail-note">${escapeHtml(ui('detailNote'))}</p></div></div></div>`;
  document.querySelectorAll('input[name="variant"]').forEach(input => input.addEventListener('change', event => {
    state.selectedVariants.set(product.id, event.target.value);
    renderDetailPage(product);
    updateHeader();
  }));
  document.querySelector('#detailAdd')?.addEventListener('click', () => {
    const added = addToCart(product, getSelectedVariant(product));
    showToast(added ? ui('added') : ui('alreadyInCart'));
    renderDetailPage(product);
    updateHeader();
  });
}

function renderCartPage(route) {
  const sharedEntries = route.shared ? parseSharedEntries(route.ids) : state.cartEntries;
  const items = cartProducts(sharedEntries);
  const title = route.shared ? ui('sharedCartTitle') : ui('cartTitle');
  const total = items.reduce((sum, item) => sum + (Number(item.variant?.price) || 0), 0);
  const actionButtons = items.length ? `<div class="cart-actions">${route.shared ? `<button class="save-button" type="button" data-save-shared>${escapeHtml(ui('saveShared'))}</button>` : ''}<button class="share-button" type="button" data-share-cart>${escapeHtml(ui('shareCart'))}</button>${route.shared ? '' : `<button class="clear-button" type="button" data-clear-cart>${escapeHtml(ui('clearCart'))}</button>`}</div>` : '';
  const list = items.length ? `<div class="cart-grid">${items.map(item => `<article class="cart-item"><a class="cart-thumb" href="#/product/${encodeURIComponent(item.id)}"><img src="${escapeHtml(assetPath(item.image))}" alt="${escapeHtml(item.name)}" loading="lazy" decoding="async"></a><div class="cart-info"><p class="product-category">${escapeHtml(categoryLabel(primaryCategory(item)))}</p><h2>${escapeHtml(item.name)}</h2><p class="cart-variant">${escapeHtml(item.variantName)}</p><p class="cart-price">${escapeHtml(formatVariantPrice(item.variant))}</p></div><button class="remove-button" type="button" data-remove-cart="${escapeHtml(item.cartKey)}">${escapeHtml(ui('remove'))}</button></article>`).join('')}</div><div class="cart-total"><span>${escapeHtml(ui('cartTotal'))}</span><strong>${total ? escapeHtml(formatPrice(total)) : escapeHtml(ui('pricePending'))}<small>RMB</small></strong></div>` : `<div class="cart-empty"><div class="empty-symbol">♡</div><h2>${escapeHtml(ui('cartEmptyTitle'))}</h2><p>${escapeHtml(route.shared ? ui('sharedCartEmptyText') : ui('cartEmptyText'))}</p><a href="#/products">${escapeHtml(ui('chooseProducts'))}</a></div>`;
  app.innerHTML = `<section class="cart-page"><div class="cart-head"><div><span class="eyebrow">${escapeHtml(ui('cartEyebrow'))}</span><h1>${escapeHtml(title)}</h1><p>${escapeHtml(ui('cartStatus', items.length, route.shared))}</p></div><span class="cart-head-mark">♡</span></div>${actionButtons}${list}<p class="cart-note">${escapeHtml(ui('cartNote'))}</p></section>`;
  document.querySelector('[data-share-cart]')?.addEventListener('click', () => shareCart(sharedEntries));
  document.querySelector('[data-clear-cart]')?.addEventListener('click', () => { writeCart([]); renderCartPage({ name: 'cart', shared: false, ids: '' }); updateHeader(); showToast(ui('cartCleared')); });
  document.querySelector('[data-save-shared]')?.addEventListener('click', () => { writeCart([...state.cartEntries, ...sharedEntries]); location.hash = '#/cart'; showToast(ui('savedToCart')); });
  document.querySelectorAll('[data-remove-cart]').forEach(button => button.addEventListener('click', () => {
    const next = removeFromCart(button.dataset.removeCart, sharedEntries);
    if (route.shared) {
      const query = serializeEntries(next);
      location.hash = query ? `#/cart?ids=${encodeURIComponent(query)}` : '#/cart?ids=';
    } else {
      writeCart(next);
      renderCartPage({ name: 'cart', shared: false, ids: '' });
      updateHeader();
    }
  }));
}

function updateHeader() {
  const routeName = state.route?.name || 'products';
  document.querySelectorAll('[data-nav]').forEach(link => {
    const active = link.dataset.nav === routeName;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
  });
  const count = state.products.length;
  const catalogCount = document.querySelector('#catalogCount');
  const mobileCatalogCount = document.querySelector('#mobileCatalogCount');
  if (catalogCount) catalogCount.textContent = count;
  if (mobileCatalogCount) mobileCatalogCount.textContent = count;
  if (searchInput) searchInput.value = state.query;
  if (clearSearch) clearSearch.hidden = !state.query;
  updateCartCount();
}

function render() {
  state.route = parseRoute();
  if (state.route.name === 'products') {
    state.category = state.categoryMap.has(String(state.route.category)) || state.route.category === 'all' || state.route.category === 'uncategorized' ? String(state.route.category) : 'all';
    renderProductsPage();
  } else if (state.route.name === 'product') {
    renderDetailPage(state.productMap.get(state.route.id));
  } else if (state.route.name === 'cart') {
    renderCartPage(state.route);
  }
  updateHeader();
}

async function init() {
  state.language = readLanguage();
  applyLanguage();
  try {
    const response = await fetch('./data/catalog.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`catalog request failed: ${response.status}`);
    state.catalog = await response.json();
    state.categoryMap = new Map(state.catalog.brand.categories.map(category => [String(category.id), { ...category, label: categoryLabel(category) }]));
    state.products = state.catalog.products.map(product => ({ ...product, image: assetPath(product.image) }));
    state.productMap = new Map(state.products.map(product => [product.id, product]));
    state.cartEntries = dedupeEntries(readStoredEntries());
    document.querySelector('#brandLogo').src = assetPath(state.catalog.brand.logo);
    render();
  } catch (error) {
    app.innerHTML = `<div class="empty-state"><strong>${escapeHtml(ui('loadError'))}</strong><p>${escapeHtml(ui('loadErrorText'))}</p></div>`;
    console.error(error);
  }
}

document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));

searchInput.addEventListener('input', event => {
  state.query = event.target.value.trim();
  if (state.route?.name === 'products') renderProductsPage();
  updateHeader();
});

clearSearch.addEventListener('click', () => {
  state.query = '';
  if (state.route?.name === 'products') renderProductsPage();
  updateHeader();
  searchInput.focus();
});

window.addEventListener('hashchange', () => {
  state.query = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  render();
});

window.addEventListener('storage', event => {
  if (event.key === CART_KEY) {
    state.cartEntries = dedupeEntries(readStoredEntries());
    if (state.route?.name === 'cart' && !state.route.shared) renderCartPage(state.route);
    updateHeader();
  }
});

init();
