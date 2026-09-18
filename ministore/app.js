const stores = [
  {
    id: 'paw',
    slug: 'paw-atelier-shop.pages.dev',
    name: '绒爪选物',
    english: 'PAW ATELIER',
    tag: 'ACCESSORIES',
    href: '../paw-atelier-shop.pages.dev/',
    dataUrl: '../paw-atelier-shop.pages.dev/data/catalog.json',
    type: 'json',
  },
  {
    id: 'michi',
    slug: 'michinoku-farm.pages.dev',
    name: 'みちのくファーム',
    english: 'MICHINOKU FARM',
    tag: 'NATURAL TREATS',
    href: '../michinoku-farm.pages.dev/',
    dataUrl: '../michinoku-farm.pages.dev/site-data.js',
    type: 'script-data',
  },
  {
    id: 'wan',
    slug: 'wan-voyage-2026-aw.pages.dev',
    name: 'WAN VOYAGE',
    english: "DOGWARE SELECTS",
    tag: "2026 AUTUMN & WINTER",
    href: '../wan-voyage-2026-aw.pages.dev/',
    dataUrl: '../wan-voyage-2026-aw.pages.dev/data/catalog.json',
    type: 'json',
  },
];

const numberFormat = new Intl.NumberFormat('zh-CN');
const productGrid = document.querySelector('#productGrid');
const refreshButton = document.querySelector('#refreshProducts');
const totalProductsNode = document.querySelector('[data-total-products]');
const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
let loadedStores = [];

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

async function loadStore(store) {
  const response = await fetch(store.dataUrl, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`${store.id}: ${response.status}`);
  }

  let data;
  if (store.type === 'json') {
    data = await response.json();
  } else {
    const source = await response.text();
    const marker = source.match(/window\.MICHINOKU_DATA\s*=\s*([\s\S]*);\s*$/);
    if (!marker) {
      throw new Error(`${store.id}: invalid data format`);
    }
    data = JSON.parse(marker[1]);
  }

  return { ...store, data, products: data.products || [] };
}

function normalizeProduct(store, product) {
  const variant = product.variants?.find((item) => item.available) || product.variants?.[0];
  const price = product.priceRmb ?? product.price ?? variant?.priceRmb ?? variant?.price;
  const name = product.nameZh || product.name || product.sourceTitle || '精选商品';
  const category = product.categoryText || product.groupName || product.brandName || store.tag;

  return {
    id: `${store.id}-${product.id}`,
    store,
    name,
    category,
    image: product.image,
    price: Number.isFinite(Number(price)) ? Number(price) : null,
  };
}

function productImageUrl(product) {
  if (!product.image) {
    return '';
  }
  if (/^https?:\/\//i.test(product.image)) {
    return product.image;
  }
  return `../${product.store.slug}/${String(product.image).replace(/^\.\//, '')}`;
}

function renderPrice(price) {
  if (price === null) {
    return '价格待定';
  }
  return `¥${numberFormat.format(price)}<small>RMB</small>`;
}

function pickProducts() {
  const balanced = loadedStores.flatMap((store) => {
    const products = shuffle(store.products).slice(0, 3);
    return products.map((product) => normalizeProduct(store, product));
  });
  return shuffle(balanced).slice(0, 9);
}

function renderProducts() {
  const products = pickProducts();
  if (!products.length) {
    productGrid.innerHTML = '<p class="product-empty">暂时没有可展示的商品。</p>';
    return;
  }

  productGrid.innerHTML = products.map((product) => {
    const image = productImageUrl(product);
    return `<a class="product-card" href="${escapeHtml(product.store.href)}" aria-label="查看 ${escapeHtml(product.name)} 所属品牌">
      <div class="product-media">
        ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(product.name)}" loading="lazy" decoding="async">` : ''}
        <span class="product-brand">${escapeHtml(product.store.english)}</span>
        <span class="product-arrow" aria-hidden="true">↗</span>
      </div>
      <div class="product-copy">
        <span class="product-label">${escapeHtml(product.category)}</span>
        <h3>${escapeHtml(product.name)}</h3>
        <div class="product-bottom">
          <strong>${renderPrice(product.price)}</strong>
          <span>进入品牌 →</span>
        </div>
      </div>
    </a>`;
  }).join('');

  productGrid.querySelectorAll('img').forEach((image) => {
    image.addEventListener('error', () => {
      image.closest('.product-media')?.classList.add('image-failed');
      image.remove();
    }, { once: true });
  });
}

function setMenuBehavior() {
  if (!header || !menuButton) {
    return;
  }

  menuButton.addEventListener('click', () => {
    const open = header.classList.toggle('nav-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  document.querySelectorAll('.site-nav a').forEach((link) => {
    link.addEventListener('click', () => {
      header.classList.remove('nav-open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

async function init() {
  setMenuBehavior();

  const results = await Promise.allSettled(stores.map(loadStore));
  loadedStores = results
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value);

  const total = loadedStores.reduce((sum, store) => sum + store.products.length, 0);
  if (totalProductsNode) {
    totalProductsNode.textContent = numberFormat.format(total);
  }

  if (!loadedStores.length) {
    productGrid.innerHTML = '<p class="product-error">商品暂时无法载入，请稍后再试。</p>';
    return;
  }

  renderProducts();
}

refreshButton?.addEventListener('click', renderProducts);
init();
