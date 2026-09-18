const app = document.querySelector('#app');
const searchInput = document.querySelector('#searchInput');
const clearSearch = document.querySelector('#clearSearch');
const toast = document.querySelector('#toast');
const STORE_NAME = '绒爪选物';
const STORE_ENGLISH = 'PAW ATELIER';
const CART_KEY = 'paw_atelier_web_cart_v1';

const categoryTranslations = {
  'Hair ribbon': '发饰',
  'Option': '配件',
  'Collar': '项圈',
  'Necklace': '项链',
  'Pet Goods': '宠物用品',
  'hair ribbon sold out': '已售罄发饰',
};

const state = {
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

function categoryLabel(category) {
  if (!category) return '其他商品';
  return categoryTranslations[baseCategoryName(category.name)] || category.name;
}

function categoryIsPaused(category) {
  return String(category?.name || '').includes('販売休止');
}

function isVariantAvailable(variant) {
  return variant && variant.available !== false && (variant.stock == null || Number(variant.stock) > 0);
}

function formatPrice(value) {
  if (value == null || Number.isNaN(Number(value))) return '价格待确认';
  return `¥${new Intl.NumberFormat('zh-CN').format(Number(value))}`;
}

function formatVariantPrice(variant) {
  if (!variant || variant.price == null) return '价格待确认';
  return formatPrice(variant.price);
}

function getProductVariants(product) {
  if (Array.isArray(product?.variants) && product.variants.length) return product.variants;
  return [{ id: 'default', name: '默认规格', price: product?.price, priceText: product?.priceText, available: true }];
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
  if (!values.length) return '价格待确认';
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max ? formatPrice(min) : `${formatPrice(min)} 起`;
}

function getProductCategories(product) {
  const categories = (product.categories || []).map(id => state.categoryMap.get(String(id))).filter(Boolean);
  return categories.length ? categories : [{ id: 'uncategorized', name: '其他商品', label: '其他商品' }];
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

function removeFromCart(key, entries = state.cartEntries) {
  const next = entries.filter(entry => entryKey(entry) !== key);
  return next;
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
    return { name: 'products', category: params.get('category') || 'all' };
  }
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
    showToast('购物车是空的，先挑选几件喜欢的商品吧。');
    return;
  }
  const url = `${location.origin}${location.pathname}#/cart?ids=${encodeURIComponent(serializeEntries(cleanEntries))}`;
  const shareData = { title: `${STORE_NAME}购物车`, text: `看看我在${STORE_NAME}挑的商品`, url };
  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
    return;
  }
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(url).then(() => showToast('分享链接已复制，可以发给微信好友。')).catch(() => window.prompt('复制这个购物车分享链接', url));
    return;
  }
  window.prompt('复制这个购物车分享链接', url);
}

function renderCategories() {
  const categories = [...state.categoryMap.values()];
  const countFor = id => id === 'all' ? state.products.length : state.products.filter(product => id === 'uncategorized' ? !(product.categories || []).length : (product.categories || []).map(String).includes(String(id))).length;
  const items = [{ id: 'all', label: '全部商品', jp: 'All items' }, ...categories.map(category => ({ id: category.id, label: categoryLabel(category), jp: baseCategoryName(category.name), paused: categoryIsPaused(category) }))];
  const uncategorizedCount = countFor('uncategorized');
  if (uncategorizedCount) items.push({ id: 'uncategorized', label: '其他商品', jp: 'Other items' });
  return items.map(item => `<a class="category-link ${state.category === String(item.id) ? 'active' : ''} ${item.paused ? 'paused' : ''}" href="#/products?category=${encodeURIComponent(item.id)}"><span class="category-text"><span>${escapeHtml(item.label)}</span><span class="jp">${escapeHtml(item.jp)}</span></span><span class="count">${countFor(item.id)}</span></a>`).join('');
}

function matchesQuery(product) {
  if (!state.query) return true;
  const categoryText = getProductCategories(product).flatMap(category => [category.label, category.name]).join(' ');
  const variants = getProductVariants(product).map(variant => variant.name).join(' ');
  return `${product.name} ${categoryText} ${variants} ${product.id}`.toLowerCase().includes(state.query.toLowerCase());
}

function filteredProducts() {
  let products = state.products.filter(product => {
    const categoryMatch = state.category === 'all' || (state.category === 'uncategorized' ? !(product.categories || []).length : (product.categories || []).map(String).includes(String(state.category)));
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
  return `<article class="product-card"><a class="product-link" href="#/product/${encodeURIComponent(product.id)}" aria-label="查看 ${escapeHtml(product.name)}"><div class="product-image"><img src="${escapeHtml(assetPath(product.image))}" alt="${escapeHtml(product.name)}" loading="lazy" decoding="async"><span class="image-mark ${hasAvailable ? '' : 'sold'}">${hasAvailable ? STORE_ENGLISH : '暂时缺货'}</span></div><div class="product-info"><p class="product-category">${escapeHtml(category.label)}</p><h2>${escapeHtml(product.name)}</h2><div class="product-meta"><span class="product-price">${escapeHtml(priceRange(product))}<small>RMB</small></span><span class="variant-count">${variants.length > 1 ? `${variants.length} 个规格` : '单一规格'}</span></div></div></a></article>`;
}

function renderProductsPage() {
  const filtered = filteredProducts();
  const shown = filtered;
  const category = state.category === 'all' ? null : state.category === 'uncategorized' ? null : state.categoryMap.get(String(state.category));
  const title = category ? categoryLabel(category) : state.category === 'uncategorized' ? '其他商品' : state.query ? '搜索结果' : '全部商品';
  const description = state.query ? `“${escapeHtml(state.query)}”的搜索结果 · ${filtered.length} 件` : `${filtered.length} 件商品`;
  const loadMore = '';
  app.innerHTML = `<section class="hero"><div class="hero-media"><img src="${escapeHtml(assetPath(state.catalog.brand.banner))}" alt="${escapeHtml(STORE_NAME)}商品精选"></div><div class="hero-copy"><span class="eyebrow">${STORE_ENGLISH} · PET ACCESSORIES</span><h1>小小的装饰，<br>也值得认真挑选。</h1><p>为宠物设计的发饰、项圈与配件。每一件都保留原有规格，价格按统一人民币公式计算。</p></div><div class="hero-serial">THE COLLECTION<br><strong>01</strong></div></section><div class="shop-layout"><aside class="filter-panel"><div class="filter-heading"><span>商品分类</span><small>Categories</small></div><div class="category-list">${renderCategories()}</div></aside><section class="shop-content"><div class="listing-head"><div class="listing-title"><span class="eyebrow">${STORE_ENGLISH} / COLLECTION</span><h1>${escapeHtml(title)}</h1><p>${description}</p></div><div class="listing-controls"><label for="sortSelect">排序</label><select id="sortSelect" aria-label="商品排序"><option value="featured">默认顺序</option><option value="price-low">价格由低到高</option><option value="price-high">价格由高到低</option><option value="name">按名称</option></select></div></div><div class="product-grid">${shown.length ? shown.map(productCard).join('') : '<div class="empty-state"><strong>没有找到商品</strong><p>换一个关键词，或选择其他分类试试。</p></div>'}</div>${loadMore}</section></div>`;
  const sortSelect = document.querySelector('#sortSelect');
  if (sortSelect) {
    sortSelect.value = state.sort;
    sortSelect.addEventListener('change', event => { state.sort = event.target.value; renderProductsPage(); updateHeader(); });
  }
}

function renderDetailPage(product) {
  if (!product) {
    app.innerHTML = '<div class="empty-state"><strong>商品不存在</strong><p>这件商品可能已经从当前目录中移除。</p><a class="text-link" href="#/products">返回商品目录</a></div>';
    return;
  }
  const variants = getProductVariants(product);
  const selected = getSelectedVariant(product);
  const hasAvailable = variants.some(isVariantAvailable);
  const inCart = state.cartEntries.some(entry => entry.productId === product.id && String(entry.variantId) === String(selected?.id));
  const categories = getProductCategories(product);
  const variantOptions = variants.length > 1 ? `<fieldset class="variant-fieldset"><legend>选择规格与价格</legend><div class="variant-list">${variants.map(variant => `<label class="variant-option ${String(variant.id) === String(selected?.id) ? 'selected' : ''} ${isVariantAvailable(variant) ? '' : 'unavailable'}"><input type="radio" name="variant" value="${escapeHtml(variant.id)}" ${String(variant.id) === String(selected?.id) ? 'checked' : ''} ${isVariantAvailable(variant) ? '' : 'disabled'}><span class="variant-name">${escapeHtml(variant.name || '默认规格')}</span><span class="variant-price">${escapeHtml(variant.priceText || formatVariantPrice(variant))}</span>${isVariantAvailable(variant) ? '' : '<span class="variant-stock">暂时缺货</span>'}</label>`).join('')}</div></fieldset>` : '';
  app.innerHTML = `<div class="detail-page"><div class="breadcrumb"><a href="#/products">商品</a><span>/</span><span>${escapeHtml(categories.map(category => category.label).join(' / '))}</span><span>/</span><span>${escapeHtml(product.name)}</span></div><div class="detail-layout"><div class="detail-media"><img src="${escapeHtml(assetPath(product.image))}" alt="${escapeHtml(product.name)}"><span class="image-mark ${hasAvailable ? '' : 'sold'}">${hasAvailable ? STORE_ENGLISH : '暂时缺货'}</span></div><div class="detail-copy"><a class="back-link" href="#/products">← 返回商品目录</a><span class="eyebrow">${STORE_ENGLISH} / ${escapeHtml(categories[0].label)}</span><h1>${escapeHtml(product.name)}</h1><p class="detail-price">${escapeHtml(formatVariantPrice(selected))}<small>RMB 参考价</small></p><div class="detail-divider"></div>${variantOptions}<dl class="detail-facts"><div class="detail-fact"><dt>当前规格</dt><dd>${escapeHtml(selected?.name || '默认规格')}</dd></div><div class="detail-fact"><dt>商品编号</dt><dd>${escapeHtml(selected?.itemCode || product.id)}</dd></div><div class="detail-fact"><dt>商品分类</dt><dd>${escapeHtml(categories.map(category => category.label).join(' / '))}</dd></div><div class="detail-fact"><dt>资料来源</dt><dd>${escapeHtml(state.catalog.brand.sourceBrand || '品牌公开目录')}</dd></div><div class="detail-fact"><dt>在售状态</dt><dd>${isVariantAvailable(selected) ? '可加入购物车' : '暂时缺货'}</dd></div></dl><button class="add-button" type="button" id="detailAdd" ${!isVariantAvailable(selected) || inCart ? 'disabled' : ''}>${inCart ? '已在购物车' : '加入购物车'}</button><p class="detail-note">选择规格后，加入购物车会保留对应规格和人民币参考价。</p></div></div></div>`;
  document.querySelectorAll('input[name="variant"]').forEach(input => input.addEventListener('change', event => {
    state.selectedVariants.set(product.id, event.target.value);
    renderDetailPage(product);
    updateHeader();
  }));
  document.querySelector('#detailAdd')?.addEventListener('click', () => {
    const added = addToCart(product, getSelectedVariant(product));
    showToast(added ? '已加入购物车。' : '这个规格已经在购物车里。');
    renderDetailPage(product);
    updateHeader();
  });
}

function renderCartPage(route) {
  const sharedEntries = route.shared ? parseSharedEntries(route.ids) : state.cartEntries;
  const items = cartProducts(sharedEntries);
  const title = route.shared ? '朋友分享的购物车' : '我的购物车';
  const total = items.reduce((sum, item) => sum + (Number(item.variant?.price) || 0), 0);
  const actionButtons = items.length ? `<div class="cart-actions">${route.shared ? '<button class="save-button" type="button" data-save-shared>保存到我的购物车</button>' : ''}<button class="share-button" type="button" data-share-cart>分享购物车</button>${route.shared ? '' : '<button class="clear-button" type="button" data-clear-cart>清空</button>'}</div>` : '';
  const list = items.length ? `<div class="cart-grid">${items.map(item => `<article class="cart-item"><a class="cart-thumb" href="#/product/${encodeURIComponent(item.id)}"><img src="${escapeHtml(assetPath(item.image))}" alt="${escapeHtml(item.name)}" loading="lazy" decoding="async"></a><div class="cart-info"><p class="product-category">${escapeHtml(primaryCategory(item).label)}</p><h2>${escapeHtml(item.name)}</h2><p class="cart-variant">${escapeHtml(item.variantName)}</p><p class="cart-price">${escapeHtml(formatVariantPrice(item.variant))}</p></div><button class="remove-button" type="button" data-remove-cart="${escapeHtml(item.cartKey)}">移除</button></article>`).join('')}</div><div class="cart-total"><span>合计参考价</span><strong>${total ? escapeHtml(formatPrice(total)) : '价格待确认'}<small>RMB</small></strong></div>` : `<div class="cart-empty"><div class="empty-symbol">♡</div><h2>购物车还是空的</h2><p>${route.shared ? '这条分享清单没有可展示的商品。' : '看到喜欢的商品，就先放进这里吧。'}</p><a href="#/products">去挑选商品　↗</a></div>`;
  app.innerHTML = `<section class="cart-page"><div class="cart-head"><div><span class="eyebrow">${STORE_ENGLISH} / CART</span><h1>${escapeHtml(title)}</h1><p>${items.length} 件商品${route.shared ? ' · 来自分享链接' : ' · 保存在本机'}</p></div><span class="cart-head-mark">♡</span></div>${actionButtons}${list}<p class="cart-note">购物车只保存在当前浏览器。分享时会把商品和规格编码进链接；它不是订单，价格和库存可能随时间变化。</p></section>`;
  document.querySelector('[data-share-cart]')?.addEventListener('click', () => shareCart(sharedEntries));
  document.querySelector('[data-clear-cart]')?.addEventListener('click', () => { writeCart([]); renderCartPage({ name: 'cart', shared: false, ids: '' }); updateHeader(); showToast('购物车已清空。'); });
  document.querySelector('[data-save-shared]')?.addEventListener('click', () => { writeCart([...state.cartEntries, ...sharedEntries]); location.hash = '#/cart'; showToast('已保存到我的购物车。'); });
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
    app.innerHTML = '<div class="empty-state"><strong>商品目录暂时无法加载</strong><p>请通过本地服务器或网站地址打开此页面。</p></div>';
    console.error(error);
  }
}

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
