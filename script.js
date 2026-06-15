/* =========================================================
   loper（ロッパー） メイン画面 スクリプト
   ※ Firebase連携は未実装のため、ダミーデータで動作確認できる
     ようにしています。
   ========================================================= */

/* ---------------- カテゴリ定義 ---------------- */
const CATEGORIES = [
  { id: 'all',   label: 'すべて', icon: '🗂️' },
  { id: 'game',  label: 'ゲーム', icon: '🎮' },
  { id: 'app',   label: 'アプリ', icon: '📱' },
  { id: 'site',  label: 'サイト', icon: '🌐' },
  { id: 'video', label: '映像',   icon: '🎬' },
];

const CATEGORY_BORDER_CLASS = {
  game: 'cat-game',
  app: 'cat-app',
  site: 'cat-site',
  video: 'cat-video',
};

/* カテゴリごとのタグ一覧（タグバー・タグ一覧パネル表示用） */
const CATEGORY_TAGS = {
  game:  ['Unity', 'UE5', 'Godot', '2D', '3D', 'PixelArt', 'VR', 'AR', 'RPG', 'アクション', 'ホラー', 'パズル', 'シミュレーション', 'FPS', 'ADV', '初心者歓迎', '経験者募集', 'プログラマー募集', 'デザイナー募集', '作曲者募集'],
  app:   ['Android', 'iOS', 'Windows', 'Mac', 'Flutter', 'ReactNative', 'Swift', 'Kotlin', 'WebApp', 'ツールアプリ', '個人開発', '生活系', 'SNS', 'ゲームアプリ', '教育', '健康'],
  site:  ['HTML', 'CSS', 'JavaScript', 'React', 'Nextjs', 'PHP', 'Laravel', 'WordPress', 'ポートフォリオ', 'LP', '企業サイト', 'ECサイト', 'ブログ', 'デザイナー募集', 'コーダー募集', 'フロントエンド', 'バックエンド'],
  video: ['MV', 'PV', 'アニメーション', 'VFX', '3DCG', 'AfterEffects', 'PremierePro', 'Blender', 'Maya', 'Cinema4D', '編集者募集', 'イラスト募集', '声優募集'],
};

// 「すべて」は各カテゴリのタグをまとめたもの（重複は除く）
CATEGORY_TAGS.all = [...new Set([
  ...CATEGORY_TAGS.game,
  ...CATEGORY_TAGS.app,
  ...CATEGORY_TAGS.site,
  ...CATEGORY_TAGS.video,
])];

/* ---------------- 投稿のダミーデータ ---------------- */
const basePosts = [
  {
    category: 'game',
    title: '2Dアクションゲームの共同制作メンバー募集',
    description: 'ドット絵スタイルの2Dアクションゲームを作っています。プログラマー、ドット絵デザイナーを募集中です。未経験の方も歓迎します。',
    tags: ['Unity', '2D', 'PixelArt', '初心者歓迎'],
    date: '2026年06月01日',
    likes: 24,
    image: null,
  },
  {
    category: 'app',
    title: 'タスク管理アプリを一緒に開発しませんか',
    description: 'Flutterで作るシンプルなタスク管理アプリです。UI実装が得意な方、一緒に開発を進めてくれる方を探しています。',
    tags: ['Flutter', 'iOS', 'Android', '個人開発'],
    date: '2026年06月02日',
    likes: 11,
    image: null,
  },
  {
    category: 'site',
    title: 'ポートフォリオサイトのデザイン協力者募集',
    description: 'エンジニア向けポートフォリオサイトのテンプレートを作成中です。デザインが得意な方、コーディングを手伝ってくれる方を募集します。',
    tags: ['React', 'ポートフォリオ', 'デザイナー募集'],
    date: '2026年06月03日',
    likes: 8,
    image: null,
  },
  {
    category: 'video',
    title: 'ゲーム実況用オープニング映像の制作チーム',
    description: 'YouTube向けのゲーム実況チャンネルのオープニング映像を制作しています。モーショングラフィックスの経験がある方を探しています。',
    tags: ['PV', 'AfterEffects', '編集者募集'],
    date: '2026年06月04日',
    likes: 35,
    image: null,
  },
  {
    category: 'game',
    title: 'ローグライクRPGのレベルデザイナー募集',
    description: 'ダンジョン自動生成のローグライクRPGを開発中です。レベルデザインやバランス調整に興味がある方、ぜひご参加ください。',
    tags: ['Unity', 'RPG', '経験者募集'],
    date: '2026年06月05日',
    likes: 19,
    image: null,
  },
  {
    category: 'app',
    title: '習慣化アプリのUI/UXデザイナーを探しています',
    description: '毎日の習慣を記録できるアプリを開発中です。使いやすいUI/UXを一緒に考えてくれる方を募集しています。',
    tags: ['ReactNative', 'ツールアプリ', '生活系'],
    date: '2026年06月06日',
    likes: 6,
    image: null,
  },
  {
    category: 'site',
    title: '個人ブログのリニューアルを手伝ってくれる人',
    description: 'Vue.jsで作られた個人ブログのリニューアルプロジェクトです。SEO対策やLPの改善に詳しい方を歓迎します。',
    tags: ['WordPress', 'ブログ', 'コーダー募集'],
    date: '2026年06月07日',
    likes: 14,
    image: null,
  },
  {
    category: 'video',
    title: 'ショート動画編集メンバーを募集しています',
    description: 'SNS向けのショート動画を定期的に制作するチームです。撮影や編集スキルを学びながら一緒に活動しませんか。',
    tags: ['編集者募集', 'PV', 'MV'],
    date: '2026年06月08日',
    likes: 27,
    image: null,
  },
  {
    category: 'game',
    title: '3Dアドベンチャーゲームのプログラマー募集',
    description: 'UnrealEngineを使った3Dアドベンチャーゲームを開発しています。C++またはブループリントが書けるプログラマーを募集します。',
    tags: ['UE5', '3D', 'プログラマー募集'],
    date: '2026年06月09日',
    likes: 42,
    image: null,
  },
  {
    category: 'app',
    title: '英語学習アプリの初期開発メンバーを探してます',
    description: 'スキマ時間で英単語を学習できるアプリを企画中です。初心者の方も大歓迎、一緒に学びながら開発しましょう。',
    tags: ['Flutter', '教育', '個人開発'],
    date: '2026年06月10日',
    likes: 9,
    image: null,
  },
];

/* 初期でピン止めしておく basePosts のインデックス */
const INITIAL_PINNED_INDEXES = [0, 5];

/* ---------------- 状態管理 ---------------- */
const state = {
  allPosts: [],          // 読み込み済みの投稿（無限スクロールで増える）
  nextId: 1,
  currentCategory: 'all',
  activeTags: new Set(),
  showPinnedOnly: false,
  searchKeyword: '',
  loading: false,
  reachedEnd: false,
  profile: {
    name: '名前',
    avatarUrl: null,
    bio: '',
    links: ['', '', '', ''],
  },
};

const MAX_POSTS = 60;       // これ以上はロードしない
const PAGE_SIZE = 4;        // 1回のスクロールで読み込む件数
const ADS_EVERY = 10;       // 何件ごとに広告を挟むか

/* ---------------- DOM要素 ---------------- */
const els = {};

document.addEventListener('DOMContentLoaded', () => {
  cacheElements();
  init();
});

function cacheElements() {
  els.categoryDropdown = document.getElementById('categoryDropdown');
  els.categoryCurrent = document.getElementById('categoryCurrent');
  els.categoryPulldown = document.getElementById('categoryPulldown');
  els.tagList = document.getElementById('tagList');
  els.tagPanel = document.getElementById('tagPanel');

  els.sidebarCategoryItems = document.querySelectorAll('.category-list-section .category-item');
  els.pulldownItems = document.querySelectorAll('.pulldown-item');
  els.pinItem = document.getElementById('pinItem');

  els.postButton = document.getElementById('postButton');
  els.contentArea = document.getElementById('contentArea');
  els.postsGrid = document.getElementById('postsGrid');

  els.searchInput = document.getElementById('searchInput');
  els.searchBtn = document.getElementById('searchBtn');
  els.clearTagsBtn = document.getElementById('clearTagsBtn');
  els.selectedTagsDropdown = document.getElementById('selectedTagsDropdown');
  els.selectedTagsLabel = document.getElementById('selectedTagsLabel');
  els.selectedTagsPulldown = document.getElementById('selectedTagsPulldown');

  els.profileIcon = document.getElementById('profileIcon');

  els.detailModalOverlay = document.getElementById('detailModalOverlay');
  els.detailModal = document.getElementById('detailModal');
  els.detailModalClose = document.getElementById('detailModalClose');
  els.detailAvatar = document.getElementById('detailAvatar');
  els.detailAuthor = document.getElementById('detailAuthor');
  els.detailTitle = document.getElementById('detailTitle');
  els.detailDesc = document.getElementById('detailDesc');
  els.detailTags = document.getElementById('detailTags');
  els.detailDate = document.getElementById('detailDate');
  els.detailLikes = document.getElementById('detailLikes');
  els.detailPinBtn = document.getElementById('detailPinBtn');

  els.postModalOverlay = document.getElementById('postModalOverlay');
  els.postModalClose = document.getElementById('postModalClose');
  els.postForm = document.getElementById('postForm');
  els.postTitleInput = document.getElementById('postTitleInput');
  els.postCategoryInput = document.getElementById('postCategoryInput');
  els.postImageInput = document.getElementById('postImageInput');
  els.postTagsInput = document.getElementById('postTagsInput');
  els.postDescInput = document.getElementById('postDescInput');

  els.toast = document.getElementById('toast');

  els.profileOverlay = document.getElementById('profileOverlay');
  els.profilePanel = document.getElementById('profilePanel');
  els.profileCloseBtn = document.getElementById('profileCloseBtn');
  els.profileSettingsBtn = document.getElementById('profileSettingsBtn');
  els.profileAvatar = document.getElementById('profileAvatar');
  els.profileAvatarInput = document.getElementById('profileAvatarInput');
  els.profileNameInput = document.getElementById('profileNameInput');
  els.profileBio = document.getElementById('profileBio');
  els.profileLinks = [
    document.getElementById('profileLink1'),
    document.getElementById('profileLink2'),
    document.getElementById('profileLink3'),
    document.getElementById('profileLink4'),
  ];
}

/* ---------------- 初期化 ---------------- */
function init() {
  // 最初の投稿を読み込む
  loadMorePosts();

  renderTagList();

  setupCategorySidebar();
  setupPulldown();
  setupTagPanelToggle();
  setupTagListEvents();
  setupClearTagsBtn();
  setupSelectedTagsDropdown();
  setupPinSection();
  setupPostButton();
  setupSearch();
  setupProfileIcon();
  setupProfilePanel();
  setupDetailModal();
  setupPostModal();
  setupInfiniteScroll();
}

/* =========================================================
   投稿データ生成
   ========================================================= */
function generatePostsBatch(count) {
  const newPosts = [];
  for (let i = 0; i < count; i++) {
    const template = basePosts[(state.nextId - 1) % basePosts.length];
    const id = state.nextId;
    newPosts.push({
      id: id,
      category: template.category,
      title: template.title,
      description: template.description,
      tags: template.tags.slice(),
      date: template.date,
      likes: template.likes,
      liked: false,
      image: template.image,
      pinned: INITIAL_PINNED_INDEXES.includes((id - 1) % basePosts.length) && id <= basePosts.length,
    });
    state.nextId++;
  }
  return newPosts;
}

function loadMorePosts() {
  if (state.loading || state.reachedEnd) return;
  state.loading = true;

  const newPosts = generatePostsBatch(PAGE_SIZE);
  state.allPosts = state.allPosts.concat(newPosts);

  if (state.allPosts.length >= MAX_POSTS) {
    state.reachedEnd = true;
  }

  renderPosts();
  state.loading = false;
}

/* =========================================================
   フィルタリング
   ========================================================= */
function getFilteredPosts() {
  const keyword = state.searchKeyword.trim().toLowerCase();

  return state.allPosts.filter((post) => {
    // 検索キーワードがある場合はカテゴリ・ピン条件を無視して検索のみ適用
    if (keyword) {
      const inTitle = post.title.toLowerCase().includes(keyword);
      const inTags = post.tags.some((t) => t.toLowerCase().includes(keyword));
      return inTitle || inTags;
    }

    if (state.showPinnedOnly && !post.pinned) return false;

    if (!state.showPinnedOnly && state.currentCategory !== 'all' && post.category !== state.currentCategory) {
      return false;
    }

    if (state.activeTags.size > 0 && ![...state.activeTags].every(t => post.tags.includes(t))) return false;

    return true;
  });
}

/* =========================================================
   描画：タグ一覧
   ========================================================= */
function renderTagList() {
  const tags = CATEGORY_TAGS[state.currentCategory] || [];
  els.tagList.innerHTML = '';

  tags.forEach((tag) => {
    const item = document.createElement('span');
    item.className = 'tag-item';
    item.dataset.tag = tag;
    item.textContent = '#' + tag;
    if (state.activeTags.has(tag)) {
      item.classList.add('active');
    }
    els.tagList.appendChild(item);
  });
}

/* 選んだカテゴリ名をクリックしたときに、そのカテゴリの全タグを
   スクロール無しのグリッドで表示するパネル */
function renderTagPanel() {
  const tags = CATEGORY_TAGS[state.currentCategory] || [];
  els.tagPanel.innerHTML = '';

  tags.forEach((tag) => {
    const item = document.createElement('span');
    item.className = 'tag-item';
    item.dataset.tag = tag;
    item.textContent = '#' + tag;
    if (state.activeTags.has(tag)) {
      item.classList.add('active');
    }
    els.tagPanel.appendChild(item);
  });
}

/* =========================================================
   描画：投稿一覧
   ========================================================= */
function renderPosts() {
  const filtered = getFilteredPosts();
  els.postsGrid.innerHTML = '';

  if (filtered.length === 0) {
    const msg = document.createElement('div');
    msg.className = 'status-message';
    msg.textContent = '該当する投稿がありません。';
    els.postsGrid.appendChild(msg);
    return;
  }

  filtered.forEach((post, index) => {
    els.postsGrid.appendChild(createPostCard(post));

    const isLastPost = index === filtered.length - 1;
    if ((index + 1) % ADS_EVERY === 0 && !isLastPost) {
      els.postsGrid.appendChild(createAdCard());
    }
  });

  if (state.reachedEnd && !state.searchKeyword.trim()) {
    const end = document.createElement('div');
    end.className = 'status-message';
    end.textContent = 'すべての投稿を表示しました。';
    els.postsGrid.appendChild(end);
  }
}

function createPostCard(post) {
  const card = document.createElement('div');
  card.className = 'post-card ' + (CATEGORY_BORDER_CLASS[post.category] || '');
  card.dataset.id = post.id;

  // ピン止めボタン（カード右上）
  const pinBtn = document.createElement('div');
  pinBtn.className = 'post-pin-btn' + (post.pinned ? ' pinned' : '');
  pinBtn.textContent = '📌';
  pinBtn.title = post.pinned ? 'ピン止めを解除' : 'ピン止めする';
  pinBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePin(post, pinBtn);
  });
  card.appendChild(pinBtn);

  // アイコン＋名前（自分のアカウント情報を表示）
  const header = document.createElement('div');
  header.className = 'post-header';

  const avatar = document.createElement('div');
  avatar.className = 'post-avatar';
  if (state.profile.avatarUrl) {
    avatar.style.backgroundImage = 'url(' + state.profile.avatarUrl + ')';
  }
  header.appendChild(avatar);

  const author = document.createElement('span');
  author.className = 'post-author';
  author.textContent = state.profile.name || '名前';
  header.appendChild(author);

  card.appendChild(header);

  // タイトル（太字）
  const title = document.createElement('h3');
  title.className = 'post-title';
  title.textContent = post.title;
  card.appendChild(title);

  // 内容（画像を添付している場合は内容枠の中に表示）
  const contentBox = document.createElement('div');
  contentBox.className = 'post-content-box';
  if (post.image) {
    const img = document.createElement('img');
    img.src = post.image;
    img.alt = '';
    contentBox.appendChild(img);
  }
  contentBox.appendChild(document.createTextNode(post.description));
  card.appendChild(contentBox);

  // タグ（横スクロールで表示）
  const tagsWrap = document.createElement('div');
  tagsWrap.className = 'post-tags';
  post.tags.forEach((tag) => {
    const pill = document.createElement('span');
    pill.className = 'tag-pill';
    pill.textContent = '#' + tag;
    tagsWrap.appendChild(pill);
  });
  card.appendChild(tagsWrap);

  // 投稿日時・いいね数
  const footer = document.createElement('div');
  footer.className = 'post-footer';

  const dateEl = document.createElement('span');
  dateEl.className = 'post-date';
  dateEl.textContent = '投稿日時　' + post.date;
  footer.appendChild(dateEl);

  const likesEl = document.createElement('span');
  likesEl.className = 'post-likes' + (post.liked ? ' liked' : '');
  likesEl.textContent = '👍 ' + post.likes;
  likesEl.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleLike(post, likesEl);
  });
  footer.appendChild(likesEl);

  card.appendChild(footer);

  card.addEventListener('click', () => openDetailModal(post));

  return card;
}

/* いいねのトグル */
function toggleLike(post, el) {
  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
  el.textContent = '👍 ' + post.likes;
  el.classList.toggle('liked', post.liked);
}

function createAdCard() {
  const ad = document.createElement('div');
  ad.className = 'ad-card';

  const label = document.createElement('div');
  label.className = 'ad-label';
  label.textContent = '広告';

  const sub = document.createElement('div');
  sub.className = 'ad-sub';
  sub.textContent = 'Advertisement';

  ad.appendChild(label);
  ad.appendChild(sub);
  return ad;
}

/* =========================================================
   カテゴリ切替
   ========================================================= */
function setupCategorySidebar() {
  els.sidebarCategoryItems.forEach((item) => {
    item.addEventListener('click', () => {
      selectCategory(item.dataset.category);
    });
  });
}

function setupPulldown() {
  els.categoryDropdown.addEventListener('click', (e) => {
    // プルダウン内の項目クリックは別ハンドラで処理するため除外
    if (e.target.closest('.pulldown-item')) return;
    els.categoryDropdown.classList.toggle('open');
    els.categoryPulldown.classList.toggle('open');
  });

  els.pulldownItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      selectCategory(item.dataset.category);
      closePulldown();
    });
  });

  document.addEventListener('click', (e) => {
    if (!els.categoryDropdown.contains(e.target)) {
      closePulldown();
    }
  });
}

function closePulldown() {
  els.categoryDropdown.classList.remove('open');
  els.categoryPulldown.classList.remove('open');
}

/* 選んだカテゴリ名をクリックすると、タグ一覧パネルを開閉する
   （カテゴリのプルダウン開閉とは別の操作） */
function setupTagPanelToggle() {
  els.categoryCurrent.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleTagPanel();
  });
}

function toggleTagPanel() {
  const willOpen = !els.tagPanel.classList.contains('open');
  els.tagPanel.classList.toggle('open', willOpen);
  if (willOpen) {
    renderTagPanel();
  }
}

function selectCategory(categoryId) {
  state.currentCategory = categoryId;
  state.showPinnedOnly = false;
  state.activeTags = new Set();
  state.searchKeyword = '';
  els.searchInput.value = '';

  const categoryInfo = CATEGORIES.find((c) => c.id === categoryId);
  els.categoryCurrent.textContent = categoryInfo ? categoryInfo.label : 'すべて';

  // サイドバーのアクティブ表示
  els.sidebarCategoryItems.forEach((item) => {
    item.classList.toggle('active', item.dataset.category === categoryId);
  });
  els.pinItem.classList.remove('active');

  // プルダウンのアクティブ表示
  els.pulldownItems.forEach((item) => {
    item.classList.toggle('active', item.dataset.category === categoryId);
  });

  renderTagList();
  if (els.tagPanel.classList.contains('open')) {
    renderTagPanel();
  }
  renderPosts();
  els.contentArea.scrollTop = 0;
}

/* =========================================================
   タグクリックでの絞り込み
   ========================================================= */
function setupTagListEvents() {
  const handleTagClick = (e) => {
    const item = e.target.closest('.tag-item');
    if (!item) return;

    const tag = item.dataset.tag;
    if (state.activeTags.has(tag)) {
      state.activeTags.delete(tag);
    } else {
      state.activeTags.add(tag);
    }
    updateClearTagsBtn();
    renderTagList();
    if (els.tagPanel.classList.contains('open')) {
      renderTagPanel();
    }
    renderPosts();
  };

  els.tagList.addEventListener('click', handleTagClick);
  els.tagPanel.addEventListener('click', handleTagClick);

  // マウスホイールで横スクロール
  els.tagList.addEventListener('wheel', (e) => {
    if (e.deltaY !== 0) {
      e.preventDefault();
      els.tagList.scrollLeft += e.deltaY;
    }
  }, { passive: false });

  // ドラッグで横スクロール
  let isDragging = false;
  let hasDragged = false;
  let startX = 0;
  let scrollStart = 0;

  els.tagList.addEventListener('mousedown', (e) => {
    isDragging = true;
    hasDragged = false;
    startX = e.clientX;
    scrollStart = els.tagList.scrollLeft;
    els.tagList.style.cursor = 'grabbing';
    els.tagList.style.userSelect = 'none';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) hasDragged = true;
    els.tagList.scrollLeft = scrollStart - dx;
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    els.tagList.style.cursor = '';
    els.tagList.style.userSelect = '';
  });

  // ドラッグ後の誤クリックをキャプチャフェーズでキャンセル
  els.tagList.addEventListener('click', (e) => {
    if (hasDragged) {
      e.stopImmediatePropagation();
      hasDragged = false;
    }
  }, true);
}

/* =========================================================
   タグ削除ボタン
   ========================================================= */
function updateClearTagsBtn() {
  const hasTags = state.activeTags.size > 0;
  els.clearTagsBtn.classList.toggle('has-tags', hasTags);
  els.selectedTagsDropdown.classList.toggle('has-tags', hasTags);
  els.selectedTagsLabel.textContent = hasTags
    ? '選択タグ (' + state.activeTags.size + ')'
    : '選択タグ';
}

function renderSelectedTagsPulldown() {
  els.selectedTagsPulldown.innerHTML = '';
  if (state.activeTags.size === 0) {
    const empty = document.createElement('div');
    empty.className = 'selected-tags-pulldown-empty';
    empty.textContent = '選択中のタグはありません';
    els.selectedTagsPulldown.appendChild(empty);
    return;
  }
  state.activeTags.forEach((tag) => {
    const item = document.createElement('div');
    item.className = 'selected-tags-pulldown-item';
    item.textContent = '#' + tag;
    els.selectedTagsPulldown.appendChild(item);
  });
}

function setupSelectedTagsDropdown() {
  els.selectedTagsDropdown.addEventListener('click', (e) => {
    e.stopPropagation();
    const willOpen = !els.selectedTagsPulldown.classList.contains('open');
    if (willOpen) renderSelectedTagsPulldown();
    els.selectedTagsDropdown.classList.toggle('open', willOpen);
    els.selectedTagsPulldown.classList.toggle('open', willOpen);
  });

  document.addEventListener('click', (e) => {
    if (!els.selectedTagsDropdown.contains(e.target)) {
      els.selectedTagsDropdown.classList.remove('open');
      els.selectedTagsPulldown.classList.remove('open');
    }
  });
}

function setupClearTagsBtn() {
  els.clearTagsBtn.addEventListener('click', () => {
    state.activeTags = new Set();
    updateClearTagsBtn();
    els.selectedTagsDropdown.classList.remove('open');
    els.selectedTagsPulldown.classList.remove('open');
    renderTagList();
    if (els.tagPanel.classList.contains('open')) {
      renderTagPanel();
    }
    renderPosts();
  });
}

/* =========================================================
   ピン止め
   ========================================================= */
function setupPinSection() {
  els.pinItem.addEventListener('click', () => {
    state.showPinnedOnly = true;
    state.searchKeyword = '';
    els.searchInput.value = '';

    els.sidebarCategoryItems.forEach((item) => item.classList.remove('active'));
    els.pinItem.classList.add('active');

    renderPosts();
    els.contentArea.scrollTop = 0;
  });
}

function togglePin(post, btnEl) {
  post.pinned = !post.pinned;

  if (state.showPinnedOnly && !post.pinned) {
    renderPosts();
    return;
  }

  // カード上のピンアイコンの表示を更新
  const card = els.postsGrid.querySelector('.post-card[data-id="' + post.id + '"]');
  const pinBtn = btnEl || (card ? card.querySelector('.post-pin-btn') : null);
  if (pinBtn) {
    pinBtn.classList.toggle('pinned', post.pinned);
    pinBtn.title = post.pinned ? 'ピン止めを解除' : 'ピン止めする';

    // ピンを付けるときにアニメーションを表示
    if (post.pinned) {
      pinBtn.classList.remove('pin-animate');
      // クラスを再付与するために一度リフローさせる
      void pinBtn.offsetWidth;
      pinBtn.classList.add('pin-animate');
      pinBtn.addEventListener('animationend', () => {
        pinBtn.classList.remove('pin-animate');
      }, { once: true });
    }
  }

  // 詳細モーダルが同じ投稿を開いている場合はボタン表示も更新
  if (els.detailModalOverlay.classList.contains('show') && els.detailModalOverlay.dataset.postId === String(post.id)) {
    updateDetailPinButton(post);
  }
}

/* =========================================================
   検索
   ========================================================= */
function setupSearch() {
  els.searchBtn.addEventListener('click', () => runSearch());
  els.searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      runSearch();
    }
  });
}

function runSearch() {
  const keyword = els.searchInput.value.trim();
  state.searchKeyword = keyword;

  if (keyword) {
    state.showPinnedOnly = false;
    els.sidebarCategoryItems.forEach((item) => item.classList.remove('active'));
    els.pinItem.classList.remove('active');
  }

  renderPosts();
  els.contentArea.scrollTop = 0;
}

/* =========================================================
   無限スクロール
   ========================================================= */
function setupInfiniteScroll() {
  els.contentArea.addEventListener('scroll', () => {
    const el = els.contentArea;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 80;
    if (nearBottom) {
      loadMorePosts();
    }
  });
}

/* =========================================================
   投稿詳細モーダル
   ========================================================= */
function setupDetailModal() {
  els.detailModalClose.addEventListener('click', closeDetailModal);
  els.detailModalOverlay.addEventListener('click', (e) => {
    if (e.target === els.detailModalOverlay) closeDetailModal();
  });
}

function openDetailModal(post) {
  els.detailModalOverlay.dataset.postId = String(post.id);

  // カテゴリに応じたモーダルの配色（ゲーム=青／アプリ=紫／サイト=茶色／映像=白）
  els.detailModal.className = 'modal ' + (CATEGORY_BORDER_CLASS[post.category] || '');

  // アイコン・名前（自分のアカウント情報）
  els.detailAvatar.style.backgroundImage = state.profile.avatarUrl
    ? 'url(' + state.profile.avatarUrl + ')'
    : '';
  els.detailAuthor.textContent = state.profile.name || '名前';

  els.detailTitle.textContent = post.title;

  // 内容（画像が添付されている場合は内容枠の中に表示）
  els.detailDesc.innerHTML = '';
  if (post.image) {
    const img = document.createElement('img');
    img.src = post.image;
    img.alt = '';
    els.detailDesc.appendChild(img);
  }
  els.detailDesc.appendChild(document.createTextNode(post.description));

  els.detailTags.innerHTML = '';
  post.tags.forEach((tag) => {
    const pill = document.createElement('span');
    pill.className = 'tag-pill';
    pill.textContent = '#' + tag;
    els.detailTags.appendChild(pill);
  });

  // 投稿日時・いいね
  els.detailDate.textContent = '投稿日時　' + post.date;
  els.detailLikes.textContent = '👍 ' + post.likes;
  els.detailLikes.classList.toggle('liked', post.liked);
  els.detailLikes.onclick = () => toggleLike(post, els.detailLikes);

  updateDetailPinButton(post);
  els.detailPinBtn.onclick = () => {
    togglePin(post);
    updateDetailPinButton(post);
  };

  els.detailModalOverlay.classList.add('show');
}

function updateDetailPinButton(post) {
  els.detailPinBtn.textContent = post.pinned ? 'ピン止めを解除する' : 'ピン止めする';
  els.detailPinBtn.classList.toggle('pinned', post.pinned);
}

function closeDetailModal() {
  els.detailModalOverlay.classList.remove('show');
}

/* =========================================================
   投稿作成モーダル
   ========================================================= */
function setupPostButton() {
  els.postButton.addEventListener('click', () => {
    els.postForm.reset();
    els.postModalOverlay.classList.add('show');
  });
}

/* 現在日時を「yyyy年mm月dd日」形式に変換 */
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return y + '年' + m + '月' + d + '日';
}

function setupPostModal() {
  els.postModalClose.addEventListener('click', closePostModal);
  els.postModalOverlay.addEventListener('click', (e) => {
    if (e.target === els.postModalOverlay) closePostModal();
  });

  els.postForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = els.postTitleInput.value.trim();
    if (!title) return;

    const category = els.postCategoryInput.value;
    const tags = els.postTagsInput.value
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const description = els.postDescInput.value.trim() || '詳細はまだ記入されていません。';

    const finishCreatingPost = (imageDataUrl) => {
      const newPost = {
        id: state.nextId,
        category: category,
        title: title,
        description: description,
        tags: tags.length > 0 ? tags : ['未設定'],
        date: formatDate(new Date()),
        likes: 0,
        liked: false,
        image: imageDataUrl || null,
        pinned: false,
      };
      state.nextId++;

      state.allPosts.unshift(newPost);

      // 「すべて」表示にリセットして、作成した投稿を確認できるようにする
      selectCategory('all');

      closePostModal();
      showToast('投稿を作成しました');
    };

    const imageFile = els.postImageInput.files[0];
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (ev) => finishCreatingPost(ev.target.result);
      reader.readAsDataURL(imageFile);
    } else {
      finishCreatingPost(null);
    }
  });
}

function closePostModal() {
  els.postModalOverlay.classList.remove('show');
}

/* =========================================================
   プロフィールアイコン・プロフィール画面
   ========================================================= */
function setupProfileIcon() {
  els.profileIcon.addEventListener('click', () => {
    openProfilePanel();
  });
}

function openProfilePanel() {
  els.profileOverlay.classList.add('show');
}

function closeProfilePanel() {
  els.profileOverlay.classList.remove('show');
}

function applyProfileAvatar() {
  els.profileAvatar.style.backgroundImage = state.profile.avatarUrl
    ? 'url(' + state.profile.avatarUrl + ')'
    : '';
}

function setupProfilePanel() {
  // ×ボタン・背景クリックでメイン画面へ戻る
  els.profileCloseBtn.addEventListener('click', closeProfilePanel);
  els.profileOverlay.addEventListener('click', (e) => {
    if (e.target === els.profileOverlay) closeProfilePanel();
  });

  // 設定ボタン（このデモでは未実装）
  els.profileSettingsBtn.addEventListener('click', () => {
    showToast('設定画面へ移行します（このデモでは未実装です）');
  });

  // アイコンクリックでファイルから画像を取得
  els.profileAvatar.addEventListener('click', () => {
    els.profileAvatarInput.click();
  });
  els.profileAvatarInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      state.profile.avatarUrl = ev.target.result;
      applyProfileAvatar();
      renderPosts(); // 投稿カードのアイコンにも反映
    };
    reader.readAsDataURL(file);
  });

  // 名前（文字数制限はmaxlengthで設定済み）
  els.profileNameInput.addEventListener('input', () => {
    state.profile.name = els.profileNameInput.value;
    renderPosts(); // 投稿カードの名前にも反映
  });

  // 自己紹介
  els.profileBio.addEventListener('input', () => {
    state.profile.bio = els.profileBio.value;
  });

  // リンク（GitHub / Discord / X / 自作サイト）
  els.profileLinks.forEach((input, index) => {
    input.addEventListener('input', () => {
      state.profile.links[index] = input.value;
    });
  });
}

/* =========================================================
   トースト表示
   ========================================================= */
let toastTimer = null;
function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    els.toast.classList.remove('show');
  }, 2200);
}
