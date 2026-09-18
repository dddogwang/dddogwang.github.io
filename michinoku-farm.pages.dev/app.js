(function () {
  'use strict';

  const data = window.MICHINOKU_DATA;
  if (!data || !data.brand) return;

  const $ = (selector) => document.querySelector(selector);
  const translations = {
    zh: {
      htmlLang: 'zh-CN',
      title: 'みちのくファーム · 商品目录',
      description: 'みちのくファーム天然食材与犬用零食商品目录',
      brandSubtitle: '天然食材 · 犬用零食',
      navLabel: '主要导航',
      official: '品牌官网 ↗',
      languageLabel: '选择语言',
      cart: '购物车',
      heroEyebrow: 'MICHINOKU FARM · PRODUCT CATALOG',
      heroTitleMain: '给日常，选一份',
      heroTitleEm: '天然的好零食。',
      heroDescription: '来自日本みちのくファーム的天然食材与犬用零食目录。当前页面为本地静态快照，方便浏览与整理心愿清单。',
      snapshotPrefix: '抓取于',
      itemUnit: '件',
      catalogEyebrow: 'BROWSE THE COLLECTION',
      catalogTitle: '商品目录',
      catalogNote: '日元参考价 · 以品牌官网为准',
      searchPlaceholder: '搜索商品、分类或规格',
      clearSearch: '清空搜索',
      sortLabel: '排序',
      sortAria: '商品排序',
      sortDefault: '默认排序',
      sortAsc: '参考价由低到高',
      sortDesc: '参考价由高到低',
      allLabel: '全部商品',
      allSub: 'All items',
      categoryAria: '商品分类',
      searchResult: (query) => `搜索：${query}`,
      resultCount: (count, total) => `${count} / ${total} 件`,
      stock: (available, total) => available ? `${available}/${total} 个规格可选` : '当前规格均暂无库存',
      featured: '精选',
      productAria: (name) => `查看 ${name}`,
      emptyTitle: '没有找到相关商品',
      emptyCopy: '换个关键词，或返回全部商品继续浏览。',
      resetFilters: '清除筛选',
      footerSnapshot: (date) => `商品、价格、库存和上下架状态来自 ${date} 的本地静态快照。`,
      footerNote: (url) => `仅作商品目录与购物车整理使用，完整信息请以 <a href="${url}" target="_blank" rel="noreferrer">品牌官网</a> 为准。`,
      modalClose: '关闭商品详情',
      detailEyebrow: 'MICHINOKU FARM',
      categoryMeta: '分类',
      currentVariantMeta: '当前规格',
      priceMeta: '对应价格',
      chooseVariant: '选择规格 / 价格',
      outOfStock: '暂时缺货',
      addToCart: '加入购物车',
      unavailable: '当前缺货',
      viewSource: '查看原站 ↗',
      detailNote: '商品展示用参考信息，非实时售价。价格、库存和上下架状态以品牌官网为准；购物车只保存在当前浏览器。',
      cartEyebrow: 'MICHINOKU FARM · CART',
      cartTitle: '我的购物车',
      closeCart: '关闭购物车',
      sharedCart: '这是朋友分享的购物车，保存后会写入本机。',
      emptyCartTitle: '购物车还是空的',
      emptyCartCopy: '看到喜欢的商品，就先放进这里吧。',
      browse: '去逛商品 ↗',
      saveShared: '保存到我的购物车',
      shareCart: '分享购物车',
      clearCart: '清空',
      remove: '移出',
      drawerNote: '购物车保存在当前浏览器。分享链接只包含商品与规格编号，不包含账号或支付信息。',
      added: '已加入购物车',
      alreadyAdded: '这个规格已经在购物车里',
      cleared: '购物车已清空',
      saved: '已保存到我的购物车',
      sharedOpened: '已打开分享的购物车',
      shareCopied: '购物车链接已复制',
      sharePrompt: '复制这个购物车链接：',
      noscript: '本商品目录需要启用 JavaScript 才能浏览。',
    },
    ja: {
      htmlLang: 'ja',
      title: 'みちのくファーム · 商品一覧',
      description: 'みちのくファームの天然食材・犬用おやつ商品一覧',
      brandSubtitle: '天然食材・犬用おやつ',
      navLabel: 'メインナビゲーション',
      official: '公式サイト ↗',
      languageLabel: '言語を選択',
      cart: 'カート',
      heroEyebrow: 'MICHINOKU FARM · PRODUCT CATALOG',
      heroTitleMain: 'いつもの毎日に、',
      heroTitleEm: '天然のおやつを。',
      heroDescription: '日本のみちのくファームが届ける、天然食材と犬用おやつの商品一覧です。現在のページは、商品を探してお気に入りを整理するための静的スナップショットです。',
      snapshotPrefix: '取得日',
      itemUnit: '件',
      catalogEyebrow: 'BROWSE THE COLLECTION',
      catalogTitle: '商品一覧',
      catalogNote: '参考価格は日本円 · 詳細は公式サイトをご確認ください',
      searchPlaceholder: '商品名・カテゴリ・規格で検索',
      clearSearch: '検索をクリア',
      sortLabel: '並び順',
      sortAria: '商品の並び順',
      sortDefault: 'おすすめ順',
      sortAsc: '参考価格の安い順',
      sortDesc: '参考価格の高い順',
      allLabel: '全商品',
      allSub: 'All items',
      categoryAria: '商品カテゴリ',
      searchResult: (query) => `検索：${query}`,
      resultCount: (count, total) => `${count} / ${total} 件`,
      stock: (available, total) => available ? `${available}/${total} 規格が選択可能` : '現在すべて在庫切れ',
      featured: 'おすすめ',
      productAria: (name) => `${name}の商品詳細を表示`,
      emptyTitle: '商品が見つかりません',
      emptyCopy: 'キーワードを変えるか、すべての商品に戻ってご覧ください。',
      resetFilters: '絞り込みを解除',
      footerSnapshot: (date) => `商品・価格・在庫・販売状況は ${date} 時点の静的スナップショットです。`,
      footerNote: (url) => `商品一覧とカート整理のためのページです。最新情報は <a href="${url}" target="_blank" rel="noreferrer">公式サイト</a> をご確認ください。`,
      modalClose: '商品詳細を閉じる',
      detailEyebrow: 'MICHINOKU FARM',
      categoryMeta: 'カテゴリ',
      currentVariantMeta: '選択中の規格',
      priceMeta: '価格',
      chooseVariant: '規格・価格を選択',
      outOfStock: '在庫切れ',
      addToCart: 'カートに入れる',
      unavailable: '在庫切れ',
      viewSource: '公式サイトを見る ↗',
      detailNote: '表示価格は参考情報で、リアルタイム価格ではありません。価格・在庫・販売状況は公式サイトをご確認ください。カートはこのブラウザ内に保存されます。',
      cartEyebrow: 'MICHINOKU FARM · CART',
      cartTitle: 'カート',
      closeCart: 'カートを閉じる',
      sharedCart: '共有されたカートです。保存するとこの端末に登録されます。',
      emptyCartTitle: 'カートは空です',
      emptyCartCopy: '気になる商品を見つけたら、ここに入れておきましょう。',
      browse: '商品を見る ↗',
      saveShared: 'マイカートに保存',
      shareCart: 'カートを共有',
      clearCart: 'クリア',
      remove: '削除',
      drawerNote: 'カートはこのブラウザに保存されます。共有リンクには商品と規格の番号のみが含まれ、アカウント情報や決済情報は含まれません。',
      added: 'カートに追加しました',
      alreadyAdded: 'この規格はすでにカートに入っています',
      cleared: 'カートをクリアしました',
      saved: 'マイカートに保存しました',
      sharedOpened: '共有されたカートを開きました',
      shareCopied: 'カートのリンクをコピーしました',
      sharePrompt: 'このカートリンクをコピーしてください：',
      noscript: 'この商品一覧を表示するには JavaScript を有効にしてください。',
    },
  };

  const state = {
    language: 'zh',
    category: 'all',
    query: '',
    sort: 'default',
    detailId: null,
    detailVariantId: null,
    cart: [],
    sharedCart: false,
  };
  let toastTimer;

  const asset = (path) => String(path || '').replace(/^\/?assets\//, 'assets/');
  const escapeHtml = (value) => String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  const productById = (id) => data.products.find((product) => product.id === String(id));
  const variantById = (product, id) => product && (product.variants.find((variant) => variant.id === String(id)) || product.variants[0]);
  const availableCount = (product) => product.variants.filter((variant) => variant.available).length;
  const current = () => translations[state.language];
  const categoryById = (id) => data.categories.find((category) => category.id === String(id));
  const categoryLabel = (category) => category ? (state.language === 'ja' ? category.name : category.label) : (state.language === 'ja' ? '新着商品' : '品牌新着商品');
  const categorySecondary = (category) => category ? (state.language === 'ja' ? category.label : category.name) : '';

  function readLanguage() {
    const urlLanguage = new URL(window.location.href).searchParams.get('lang');
    if (urlLanguage === 'ja' || urlLanguage === 'zh') return urlLanguage;
    try {
      const stored = localStorage.getItem('michinoku_language');
      if (stored === 'ja' || stored === 'zh') return stored;
    } catch (error) {
      // Local storage may be unavailable in a private browsing context.
    }
    return 'zh';
  }

  function saveLanguage() {
    try {
      localStorage.setItem('michinoku_language', state.language);
    } catch (error) {
      // The language still works for the current page when storage is blocked.
    }
  }

  function readStoredCart() {
    try {
      const value = JSON.parse(localStorage.getItem('michinoku_cart_v1') || '[]');
      return Array.isArray(value) ? value.filter((entry) => entry && entry.productId && entry.variantId) : [];
    } catch (error) {
      return [];
    }
  }

  function writeStoredCart() {
    try {
      localStorage.setItem('michinoku_cart_v1', JSON.stringify(state.cart));
    } catch (error) {
      // The cart remains usable for this page when storage is blocked.
    }
  }

  function formatCartParam(entries) {
    return entries.map((entry) => `${encodeURIComponent(entry.productId)}:${encodeURIComponent(entry.variantId)}`).join(',');
  }

  function parseCartParam(value) {
    return String(value || '').split(',').map((item) => {
      const [productId, variantId] = item.split(':').map(decodeURIComponent);
      return productId && variantId ? { productId, variantId } : null;
    }).filter((entry) => {
      const product = productById(entry && entry.productId);
      return product && variantById(product, entry.variantId);
    });
  }

  function showToast(message) {
    const node = $('#toast');
    node.textContent = message;
    node.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove('visible'), 2300);
  }

  function updateUrl(changes, replace) {
    const url = new URL(window.location.href);
    Object.entries(changes).forEach(([key, value]) => {
      if (value == null || value === '' || value === 'all' || value === 'default') url.searchParams.delete(key);
      else url.searchParams.set(key, value);
    });
    window.history[replace ? 'replaceState' : 'pushState']({}, '', url);
  }

  function renderBrand() {
    $('#brand-logo').src = asset(data.brand.logo);
    $('#brand-banner').src = asset(data.brand.banner);
    $('#brand-name').textContent = data.brand.name;
  }

  function renderLanguage() {
    const t = current();
    document.documentElement.lang = t.htmlLang;
    document.title = t.title;
    $('meta[name="description"]').setAttribute('content', t.description);
    $('.top-nav').setAttribute('aria-label', t.navLabel);
    $('.language-switch').setAttribute('aria-label', t.languageLabel);
    $('#brand-subtitle').textContent = t.brandSubtitle;
    $('#official-link').textContent = t.official;
    $('#cart-label').textContent = t.cart;
    $('#hero-eyebrow').textContent = t.heroEyebrow;
    $('#hero-title-main').textContent = t.heroTitleMain;
    $('#hero-title-em').textContent = t.heroTitleEm;
    $('#hero-description').textContent = t.heroDescription;
    $('#product-count').textContent = `${data.productCount} ${t.itemUnit}${state.language === 'ja' ? '' : '商品'}`;
    $('#snapshot-meta').textContent = `${t.snapshotPrefix} ${data.snapshotDate}`;
    $('#catalog-eyebrow').textContent = t.catalogEyebrow;
    $('#catalog-title').textContent = t.catalogTitle;
    $('#catalog-note').textContent = t.catalogNote;
    $('#search-input').placeholder = t.searchPlaceholder;
    $('#search-input').setAttribute('aria-label', t.searchPlaceholder);
    $('#clear-search').setAttribute('aria-label', t.clearSearch);
    $('#sort-label').textContent = t.sortLabel;
    $('#sort-select').setAttribute('aria-label', t.sortAria);
    $('#sort-select').querySelector('option[value="default"]').textContent = t.sortDefault;
    $('#sort-select').querySelector('option[value="price-asc"]').textContent = t.sortAsc;
    $('#sort-select').querySelector('option[value="price-desc"]').textContent = t.sortDesc;
    $('#category-strip').setAttribute('aria-label', t.categoryAria);
    $('#empty-title').textContent = t.emptyTitle;
    $('#empty-copy').textContent = t.emptyCopy;
    $('#reset-filters').textContent = t.resetFilters;
    $('#footer-snapshot').textContent = t.footerSnapshot(data.snapshotDate);
    $('#footer-note').innerHTML = t.footerNote(escapeHtml(data.brand.sourceUrl));
    $('#modal-close').setAttribute('aria-label', t.modalClose);
    $('#cart-eyebrow').textContent = t.cartEyebrow;
    $('#cart-title').textContent = t.cartTitle;
    $('#cart-close').setAttribute('aria-label', t.closeCart);
    $('#shared-cart-note').textContent = t.sharedCart;
    $('#cart-empty-title').textContent = t.emptyCartTitle;
    $('#cart-empty-copy').textContent = t.emptyCartCopy;
    $('#cart-empty-close').textContent = t.browse;
    $('#save-shared-cart').textContent = t.saveShared;
    $('#share-cart').textContent = t.shareCart;
    $('#clear-cart').textContent = t.clearCart;
    $('#drawer-note').textContent = t.drawerNote;
    document.querySelectorAll('[data-language]').forEach((button) => {
      const active = button.dataset.language === state.language;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function renderCategories() {
    const t = current();
    const items = [{ id: 'all', label: t.allLabel, name: t.allSub }].concat(data.categories);
    $('#category-strip').innerHTML = items.map((category) => `
      <button class="category-chip ${state.category === category.id ? 'active' : ''}" type="button" data-category="${escapeHtml(category.id)}" role="listitem">
        <strong>${escapeHtml(category.id === 'all' ? category.label : categoryLabel(category))}</strong>
        <span>${escapeHtml(category.id === 'all' ? category.name : categorySecondary(category))}</span>
      </button>
    `).join('');
  }

  function filteredProducts() {
    const query = state.query.trim().toLowerCase();
    const list = data.products.filter((product) => {
      const matchesCategory = state.category === 'all' || product.categories.includes(state.category);
      const categoryNames = product.categories.map((id) => categoryById(id)).filter(Boolean).flatMap((category) => [category.name, category.label]);
      const searchText = [product.name, product.categoryText, ...categoryNames, ...product.variants.map((variant) => variant.name)].join(' ').toLowerCase();
      return matchesCategory && (!query || searchText.includes(query));
    });
    if (state.sort === 'price-asc') list.sort((a, b) => (a.price == null ? Infinity : a.price) - (b.price == null ? Infinity : b.price));
    if (state.sort === 'price-desc') list.sort((a, b) => (b.price || 0) - (a.price || 0));
    return list;
  }

  function productCard(product) {
    const t = current();
    const inStock = availableCount(product);
    const stockText = t.stock(inStock, product.variants.length);
    return `
      <article class="product-card" data-product-id="${escapeHtml(product.id)}">
        <button type="button" aria-label="${escapeHtml(t.productAria(product.name))}">
          <div class="product-photo-wrap">
            <img class="product-photo" src="${escapeHtml(asset(product.image))}" alt="${escapeHtml(product.name)}" loading="lazy" decoding="async" />
            ${product.home ? `<span class="product-badge">${escapeHtml(t.featured)}</span>` : ''}
          </div>
          <div class="product-info">
            <div class="product-category">${escapeHtml(categoryLabel(categoryById(product.categories[0])))}</div>
            <h3 class="product-name">${escapeHtml(product.name)}</h3>
            <div class="product-price"><span>${escapeHtml(product.priceLabel)}</span><small>${escapeHtml(state.language === 'ja' ? 'JPY〜' : product.priceUnit)}</small></div>
            <div class="product-stock ${inStock ? '' : 'unavailable'}">${escapeHtml(stockText)}</div>
          </div>
        </button>
      </article>
    `;
  }

  function renderProducts() {
    const t = current();
    const products = filteredProducts();
    const category = categoryById(state.category);
    $('#result-label').textContent = state.query ? t.searchResult(state.query) : (category ? categoryLabel(category) : t.allLabel);
    $('#result-count').textContent = t.resultCount(products.length, data.productCount);
    $('#product-grid').innerHTML = products.map(productCard).join('');
    $('#empty-state').hidden = products.length > 0;
    $('#search-input').value = state.query;
    $('#clear-search').hidden = !state.query;
  }

  function renderCart() {
    const t = current();
    const entries = state.cart.map((entry) => {
      const product = productById(entry.productId);
      const variant = variantById(product, entry.variantId);
      return product && variant ? { entry, product, variant } : null;
    }).filter(Boolean);
    state.cart = entries.map(({ entry }) => entry);
    $('#cart-count').textContent = String(entries.length);
    $('#cart-items').innerHTML = entries.map(({ entry, product, variant }) => `
      <div class="cart-item">
        <img src="${escapeHtml(asset(product.image))}" alt="${escapeHtml(product.name)}" loading="lazy" />
        <div>
          <h3>${escapeHtml(product.name)}</h3>
          <p>${escapeHtml(variant.name)}</p>
          <p>${escapeHtml(variant.priceText)}</p>
        </div>
        <button class="remove-item" type="button" data-remove-cart="${escapeHtml(entry.productId)}:${escapeHtml(entry.variantId)}">${escapeHtml(t.remove)}</button>
      </div>
    `).join('');
    $('#cart-empty').hidden = entries.length > 0;
    $('#cart-actions').hidden = entries.length === 0;
    $('#save-shared-cart').hidden = !state.sharedCart;
    $('#shared-cart-note').hidden = !state.sharedCart;
  }

  function openCart() {
    $('#cart-drawer').classList.add('open');
    $('#cart-drawer').setAttribute('aria-hidden', 'false');
    $('#cart-toggle').setAttribute('aria-expanded', 'true');
  }

  function closeCart() {
    $('#cart-drawer').classList.remove('open');
    $('#cart-drawer').setAttribute('aria-hidden', 'true');
    $('#cart-toggle').setAttribute('aria-expanded', 'false');
  }

  function openProduct(productId, push) {
    const product = productById(productId);
    if (!product) return;
    state.detailId = product.id;
    state.detailVariantId = (variantById(product, state.detailVariantId) || product.variants[0]).id;
    renderProductModal();
    $('#modal-backdrop').hidden = false;
    $('#product-modal').hidden = false;
    document.body.style.overflow = 'hidden';
    if (push !== false) updateUrl({ product: product.id }, false);
  }

  function closeProduct(push) {
    state.detailId = null;
    $('#modal-backdrop').hidden = true;
    $('#product-modal').hidden = true;
    document.body.style.overflow = '';
    if (push !== false) updateUrl({ product: null }, false);
  }

  function renderProductModal() {
    const t = current();
    const product = productById(state.detailId);
    if (!product) return;
    const variant = variantById(product, state.detailVariantId);
    state.detailVariantId = variant.id;
    const available = variant.available;
    const category = categoryLabel(categoryById(product.categories[0]));
    $('#modal-content').innerHTML = `
      <div class="detail-layout">
        <img class="detail-image" src="${escapeHtml(asset(product.image))}" alt="${escapeHtml(product.name)}" />
        <div class="detail-copy">
          <p class="eyebrow">${escapeHtml(t.detailEyebrow)} · ${escapeHtml(category)}</p>
          <h2 id="detail-title">${escapeHtml(product.name)}</h2>
          <div class="detail-price">${escapeHtml(variant.priceLabel)} <small>JPY</small></div>
          <div class="detail-metadata">
            <div class="metadata-row"><span>${escapeHtml(t.categoryMeta)}</span><span>${escapeHtml(category)}</span></div>
            <div class="metadata-row"><span>${escapeHtml(t.currentVariantMeta)}</span><span>${escapeHtml(variant.name)}</span></div>
            <div class="metadata-row"><span>${escapeHtml(t.priceMeta)}</span><span>${escapeHtml(variant.priceText)}</span></div>
          </div>
          ${product.variants.length > 1 ? `
            <div class="variant-label">${escapeHtml(t.chooseVariant)}</div>
            <div class="variant-options" role="radiogroup">
              ${product.variants.map((item) => `
                <button class="variant-option ${item.id === variant.id ? 'selected' : ''}" type="button" data-variant-id="${escapeHtml(item.id)}" role="radio" aria-checked="${item.id === variant.id}" ${item.available ? '' : 'disabled'}>
                  <span class="variant-name">${escapeHtml(item.name)}</span>
                  <span class="variant-price">${escapeHtml(item.priceText)}</span>
                  ${item.available ? '' : `<span class="variant-stock">${escapeHtml(t.outOfStock)}</span>`}
                </button>
              `).join('')}
            </div>
          ` : ''}
          <div class="detail-actions">
            <button class="button primary-button" type="button" data-add-detail ${available ? '' : 'disabled'}>${escapeHtml(available ? t.addToCart : t.unavailable)}</button>
            <a class="text-link" href="${escapeHtml(product.sourceUrl)}" target="_blank" rel="noreferrer">${escapeHtml(t.viewSource)}</a>
          </div>
          <p class="detail-note">${escapeHtml(t.detailNote)}</p>
        </div>
      </div>
    `;
  }

  function addToCart(productId, variantId) {
    const t = current();
    const exists = state.cart.some((entry) => entry.productId === String(productId) && entry.variantId === String(variantId));
    if (!exists) state.cart.push({ productId: String(productId), variantId: String(variantId) });
    writeStoredCart();
    renderCart();
    showToast(exists ? t.alreadyAdded : t.added);
  }

  function removeFromCart(productId, variantId) {
    state.cart = state.cart.filter((entry) => !(entry.productId === String(productId) && entry.variantId === String(variantId)));
    writeStoredCart();
    renderCart();
  }

  function syncFromUrl() {
    const params = new URL(window.location.href).searchParams;
    const urlLanguage = params.get('lang');
    if (urlLanguage === 'ja' || urlLanguage === 'zh') state.language = urlLanguage;
    state.category = params.get('category') || 'all';
    if (state.category !== 'all' && !data.categories.some((category) => category.id === state.category)) state.category = 'all';
    state.query = params.get('q') || '';
    state.sort = params.get('sort') || 'default';
    if (!['default', 'price-asc', 'price-desc'].includes(state.sort)) state.sort = 'default';
    $('#sort-select').value = state.sort;
    renderLanguage();
    renderCategories();
    renderProducts();
    renderCart();
    const productId = params.get('product');
    if (productId) openProduct(productId, false);
    else if (state.detailId) closeProduct(false);
  }

  function setLanguage(language) {
    if (language !== 'ja' && language !== 'zh') return;
    state.language = language;
    saveLanguage();
    updateUrl({ lang: language }, false);
    renderLanguage();
    renderCategories();
    renderProducts();
    renderCart();
    if (state.detailId) renderProductModal();
  }

  function shareCart() {
    const t = current();
    if (!state.cart.length) return;
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('cart', formatCartParam(state.cart));
    url.searchParams.set('lang', state.language);
    const shareUrl = url.toString();
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(shareUrl).then(() => showToast(t.shareCopied)).catch(() => showToast(shareUrl));
    } else {
      window.prompt(t.sharePrompt, shareUrl);
    }
  }

  document.addEventListener('click', (event) => {
    const language = event.target.closest('[data-language]');
    if (language) {
      setLanguage(language.dataset.language);
      return;
    }
    const category = event.target.closest('[data-category]');
    if (category) {
      state.category = category.dataset.category;
      updateUrl({ category: state.category }, false);
      renderCategories();
      renderProducts();
      return;
    }
    const card = event.target.closest('[data-product-id]');
    if (card) {
      openProduct(card.dataset.productId, true);
      return;
    }
    const variant = event.target.closest('[data-variant-id]');
    if (variant && state.detailId) {
      state.detailVariantId = variant.dataset.variantId;
      renderProductModal();
      return;
    }
    if (event.target.closest('[data-add-detail]') && state.detailId) {
      addToCart(state.detailId, state.detailVariantId);
      renderProductModal();
      return;
    }
    const remove = event.target.closest('[data-remove-cart]');
    if (remove) {
      const [productId, variantId] = remove.dataset.removeCart.split(':');
      removeFromCart(productId, variantId);
    }
  });

  $('#search-input').addEventListener('input', (event) => {
    state.query = event.target.value;
    updateUrl({ q: state.query }, true);
    renderProducts();
  });
  $('#clear-search').addEventListener('click', () => {
    state.query = '';
    updateUrl({ q: null }, true);
    renderProducts();
    $('#search-input').focus();
  });
  $('#sort-select').addEventListener('change', (event) => {
    state.sort = event.target.value;
    updateUrl({ sort: state.sort }, true);
    renderProducts();
  });
  $('#reset-filters').addEventListener('click', () => {
    state.category = 'all';
    state.query = '';
    state.sort = 'default';
    updateUrl({ category: null, q: null, sort: null }, true);
    $('#sort-select').value = state.sort;
    renderCategories();
    renderProducts();
  });
  $('#cart-toggle').addEventListener('click', openCart);
  $('#cart-close').addEventListener('click', closeCart);
  $('#cart-empty-close').addEventListener('click', closeCart);
  $('#modal-close').addEventListener('click', () => closeProduct(true));
  $('#modal-backdrop').addEventListener('click', () => closeProduct(true));
  $('#clear-cart').addEventListener('click', () => {
    const t = current();
    state.cart = [];
    state.sharedCart = false;
    writeStoredCart();
    renderCart();
    showToast(t.cleared);
  });
  $('#save-shared-cart').addEventListener('click', () => {
    const t = current();
    state.sharedCart = false;
    writeStoredCart();
    renderCart();
    showToast(t.saved);
  });
  $('#share-cart').addEventListener('click', shareCart);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (state.detailId) closeProduct(true);
      else closeCart();
    }
  });
  window.addEventListener('popstate', syncFromUrl);

  renderBrand();
  state.language = readLanguage();
  state.cart = readStoredCart();
  const initialCart = new URL(window.location.href).searchParams.get('cart');
  if (initialCart) {
    const sharedEntries = parseCartParam(initialCart);
    if (sharedEntries.length) {
      state.cart = sharedEntries;
      state.sharedCart = true;
      showToast(current().sharedOpened);
    }
  }
  syncFromUrl();
}());
