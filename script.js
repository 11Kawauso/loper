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
  game:  ['Unity', 'UE5', 'Godot', '2D', '3D', 'PixelArt', 'VR', 'AR', 'RPG', 'アクション', 'ホラー', 'パズル', 'シミュレーション', 'FPS', 'ADV', 'オープンワールド', '初心者歓迎', '経験者募集', 'プログラマー募集', 'デザイナー募集', '作曲者募集'],
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
    contact: 'X（旧Twitter）: @pixel_game_dev',
    images: [],
    deadlineDays: 60,
  },
  {
    category: 'app',
    title: 'タスク管理アプリを一緒に開発しませんか',
    description: 'Flutterで作るシンプルなタスク管理アプリです。UI実装が得意な方、一緒に開発を進めてくれる方を探しています。',
    tags: ['Flutter', 'iOS', 'Android', '個人開発'],
    date: '2026年06月02日',
    contact: 'Discord: taskapp#1234',
    images: [],
    deadlineDays: 45,
  },
  {
    category: 'site',
    title: 'ポートフォリオサイトのデザイン協力者募集',
    description: 'エンジニア向けポートフォリオサイトのテンプレートを作成中です。デザインが得意な方、コーディングを手伝ってくれる方を募集します。',
    tags: ['React', 'ポートフォリオ', 'デザイナー募集'],
    date: '2026年06月03日',
    contact: 'メール: portfolio.design@example.com',
    images: [],
    deadlineDays: 30,
  },
  {
    category: 'video',
    title: 'ゲーム実況用オープニング映像の制作チーム',
    description: 'YouTube向けのゲーム実況チャンネルのオープニング映像を制作しています。モーショングラフィックスの経験がある方を探しています。',
    tags: ['PV', 'AfterEffects', '編集者募集'],
    date: '2026年06月04日',
    contact: 'X（旧Twitter）: @op_movie_team',
    images: [],
    deadlineDays: 14,
  },
  {
    category: 'game',
    title: 'ローグライクRPGのレベルデザイナー募集',
    description: 'ダンジョン自動生成のローグライクRPGを開発中です。レベルデザインやバランス調整に興味がある方、ぜひご参加ください。',
    tags: ['Unity', 'RPG', '経験者募集'],
    date: '2026年06月05日',
    contact: 'Discord: roguelike_dev#5678',
    images: [],
    deadlineDays: 90,
  },
  {
    category: 'app',
    title: '習慣化アプリのUI/UXデザイナーを探しています',
    description: '毎日の習慣を記録できるアプリを開発中です。使いやすいUI/UXを一緒に考えてくれる方を募集しています。',
    tags: ['ReactNative', 'ツールアプリ', '生活系'],
    date: '2026年06月06日',
    contact: 'メール: habit.app.ux@example.com',
    images: [],
    deadlineDays: 10,
  },
  {
    category: 'site',
    title: '個人ブログのリニューアルを手伝ってくれる人',
    description: 'Vue.jsで作られた個人ブログのリニューアルプロジェクトです。SEO対策やLPの改善に詳しい方を歓迎します。',
    tags: ['WordPress', 'ブログ', 'コーダー募集'],
    date: '2026年06月07日',
    contact: 'X（旧Twitter）: @blog_renewal',
    images: [],
    deadlineDays: 30,
  },
  {
    category: 'video',
    title: 'ショート動画編集メンバーを募集しています',
    description: 'SNS向けのショート動画を定期的に制作するチームです。撮影や編集スキルを学びながら一緒に活動しませんか。',
    tags: ['編集者募集', 'PV', 'MV'],
    date: '2026年06月08日',
    contact: 'Discord: shortmovie#4321',
    images: [],
    deadlineDays: 7,
  },
  {
    category: 'game',
    title: '3Dアドベンチャーゲームのプログラマー募集',
    description: 'UnrealEngineを使った3Dアドベンチャーゲームを開発しています。C++またはブループリントが書けるプログラマーを募集します。',
    tags: ['UE5', '3D', 'プログラマー募集'],
    date: '2026年06月09日',
    contact: 'メール: adv.game.dev@example.com',
    images: [],
    deadlineDays: 60,
  },
  {
    category: 'app',
    title: '英語学習アプリの初期開発メンバーを探してます',
    description: 'スキマ時間で英単語を学習できるアプリを企画中です。初心者の方も大歓迎、一緒に学びながら開発しましょう。',
    tags: ['Flutter', '教育', '個人開発'],
    date: '2026年06月10日',
    contact: 'X（旧Twitter）: @english_app_dev',
    images: [],
    deadlineDays: 30,
  },
  {
    category: 'video',
    title: '自主制作アニメのBGM・SE担当を募集中',
    description: '個人で制作中の短編アニメーションにBGMや効果音をつけてくれる方を探しています。ジャンルはSFファンタジーです。',
    tags: ['アニメーション', 'Blender', '3DCG'],
    date: '2026年06月11日',
    contact: 'Discord: anime_bgm#9012',
    images: [],
    deadlineDays: 45,
  },
  {
    category: 'video',
    title: 'MV制作チームのモーションデザイナー募集',
    description: 'ボカロ楽曲のMVを制作するチームです。AfterEffectsやCinema4Dでモーショングラフィックスを作れる方を募集しています。',
    tags: ['MV', 'AfterEffects', 'Cinema4D', 'VFX'],
    date: '2026年06月12日',
    contact: 'X（旧Twitter）: @mv_motion_team',
    images: [],
    deadlineDays: 60,
  },
  {
    category: 'video',
    title: 'ドキュメンタリー映像の撮影・編集メンバー募集',
    description: '地域の伝統文化を記録するドキュメンタリー映像を制作中です。撮影や編集に興味がある方、一緒に作品を作りませんか。',
    tags: ['PremierePro', '編集者募集', 'PV'],
    date: '2026年06月13日',
    contact: 'メール: docs.film@example.com',
    images: [],
    deadlineDays: 30,
  },
];

/* 初期でピン止めしておく basePosts のインデックス */
const INITIAL_PINNED_INDEXES = [0, 5];

/* ---------------- 状態管理 ---------------- */
const state = {
  allPosts: [],          // 読み込み済みの投稿（無限スクロールで増える）
  nextId: 1,
  currentCategory: 'all',
  tagBarCategory: 'all',
  activeTags: new Set(),
  showPinnedOnly: false,
  searchKeyword: '',
  searchIncludeBody: false,
  sortOrder: 'newest',
  loading: false,
  reachedEnd: false,
  currentUser: null,
  profile: {
    name: '名前',
    avatarUrl: 'images/ProfileIcon.png',
    bio: '',
    contact: '',
    links: [''],
  },
};

let postSelectedTags = new Set();
let postSelectedFiles = [];
let previewUrls = [];
let postExistingImages = [];
let editingPostId = null;
let editingDeadlinePostId = null;

const CROP_SIZE = 280;    // トリムコンテナのサイズ（px）
const CROP_RADIUS = 120;  // トリム円の半径（px）
const cropState = { scale: 1, minScale: 1, maxScale: 4, tx: 0, ty: 0, dragging: false, lastX: 0, lastY: 0 };

const MAX_POSTS = 60;       // これ以上はロードしない
const INITIAL_PAGE_SIZE = 12; // 初回表示件数
const PAGE_SIZE = 16;       // 1回のスクロールで読み込む件数
const ADS_EVERY = 20;       // 何件ごとに広告を挟むか

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

  els.sidebar = document.getElementById('sidebar');
  els.sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  els.sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
  els.sidebarOverlay = document.getElementById('sidebarOverlay');

  els.postButton = document.getElementById('postButton');
  els.contentArea = document.getElementById('contentArea');
  els.contentSlider = document.getElementById('contentSlider');
  els.postsPane = document.getElementById('postsPane');
  els.postsGrid = document.getElementById('postsGrid');

  els.searchArea = document.getElementById('searchArea');
  els.searchInput = document.getElementById('searchInput');
  els.searchBtn = document.getElementById('searchBtn');
  els.searchOptionsPanel = document.getElementById('searchOptionsPanel');
  els.searchIncludeBody = document.getElementById('searchIncludeBody');
  els.sortDropdown = document.getElementById('sortDropdown');
  els.sortCurrentLabel = document.getElementById('sortCurrentLabel');
  els.sortPulldown = document.getElementById('sortPulldown');
  els.sortPulldownItems = document.querySelectorAll('.sort-pulldown-item');

  els.selectedTagsDropdown = document.getElementById('selectedTagsDropdown');
  els.selectedTagsLabel = document.getElementById('selectedTagsLabel');
  els.selectedTagsPulldown = document.getElementById('selectedTagsPulldown');

  els.hamburgerBtn = document.getElementById('hamburgerBtn');
  els.menuOverlay = document.getElementById('menuOverlay');
  els.menuCloseBtn = document.getElementById('menuCloseBtn');
  els.menuProfileIcon = document.getElementById('menuProfileIcon');
  els.menuProfileName = document.getElementById('menuProfileName');
  els.menuProfileArea = document.querySelector('.menu-profile-area');

  els.detailPane = document.getElementById('detailPane');
  els.detailBackBtn = document.getElementById('detailBackBtn');
  els.detailAvatar = document.getElementById('detailAvatar');
  els.detailAuthor = document.getElementById('detailAuthor');
  els.detailMoreMenuWrap = document.getElementById('detailMoreMenuWrap');
  els.detailTitle = document.getElementById('detailTitle');
  els.detailImageBox = document.getElementById('detailImageBox');
  els.lightboxOverlay = document.getElementById('lightboxOverlay');
  els.lightboxImage = document.getElementById('lightboxImage');
  els.detailDesc = document.getElementById('detailDesc');
  els.detailTags = document.getElementById('detailTags');
  els.detailContact = document.getElementById('detailContact');
  els.detailContactValue = document.getElementById('detailContactValue');
  els.detailDate = document.getElementById('detailDate');
  els.detailDeadline = document.getElementById('detailDeadline');
  els.detailPinBtn = document.getElementById('detailPinBtn');

  els.postModalOverlay = document.getElementById('postModalOverlay');
  els.postModal = document.getElementById('postModal');
  els.postModalClose = document.getElementById('postModalClose');
  els.postForm = document.getElementById('postForm');
  els.postTitleInput = document.getElementById('postTitleInput');
  els.postCategoryInput = document.getElementById('postCategoryInput');
  els.postDescInput = document.getElementById('postDescInput');
  els.postContactInput = document.getElementById('postContactInput');
  els.titleCharCounter = document.getElementById('titleCharCounter');
  els.descCharCounter = document.getElementById('descCharCounter');
  els.postImageInput = document.getElementById('postImageInput');
  els.fileInputDisplay = document.getElementById('fileInputDisplay');
  els.imagePreviewContainer = document.getElementById('imagePreviewContainer');
  els.postTagDropdown = document.getElementById('postTagDropdown');
  els.postTagDropdownDisplay = document.getElementById('postTagDropdownDisplay');
  els.postTagDropdownPanel = document.getElementById('postTagDropdownPanel');
  els.postTagDisplayText = document.getElementById('postTagDisplayText');
  els.postTagSelector = document.getElementById('postTagSelector');
  els.postTagsInput = document.getElementById('postTagsInput');
  els.postDeadlineInput = document.getElementById('postDeadlineInput');
  els.postDeadlineGroup = document.getElementById('postDeadlineGroup');
  els.postModalTitle = document.getElementById('postModalTitle');
  els.postSubmitBtn = document.getElementById('postSubmitBtn');

  els.genericConfirmOverlay = document.getElementById('genericConfirmOverlay');
  els.genericConfirmMessage = document.getElementById('genericConfirmMessage');
  els.genericConfirmOk = document.getElementById('genericConfirmOk');
  els.genericConfirmCancel = document.getElementById('genericConfirmCancel');

  els.deadlineEditOverlay = document.getElementById('deadlineEditOverlay');
  els.deadlineEditClose = document.getElementById('deadlineEditClose');
  els.deadlineEditInput = document.getElementById('deadlineEditInput');
  els.deadlineEditSave = document.getElementById('deadlineEditSave');

  els.settingsOverlay = document.getElementById('settingsOverlay');
  els.settingsCloseBtn = document.getElementById('settingsCloseBtn');
  els.settingsNameInput = document.getElementById('settingsNameInput');
  els.settingsNameSave = document.getElementById('settingsNameSave');
  els.settingsContactInput = document.getElementById('settingsContactInput');
  els.settingsContactSave = document.getElementById('settingsContactSave');
  els.expiredPostsList = document.getElementById('expiredPostsList');

  els.toast = document.getElementById('toast');

  els.profileOverlay = document.getElementById('profileOverlay');
  els.profilePanel = document.getElementById('profilePanel');
  els.profileCloseBtn = document.getElementById('profileCloseBtn');
  els.profileSettingsBtn = document.getElementById('profileSettingsBtn');
  els.profileAvatar = document.getElementById('profileAvatar');
  els.profileAvatarInput = document.getElementById('profileAvatarInput');
  els.profileAvatarDeleteBtn = document.getElementById('profileAvatarDeleteBtn');
  els.profileNameInput = document.getElementById('profileNameInput');
  els.profileContactDisplay = document.getElementById('profileContactDisplay');
  els.profileBio = document.getElementById('profileBio');
  els.profileLinksContainer = document.getElementById('profileLinks');
  els.profileAddLinkBtn = document.getElementById('profileAddLinkBtn');
  els.profileLoginSection = document.getElementById('profileLoginSection');
  els.profileContent = document.getElementById('profileContent');
  els.githubLoginBtn = document.getElementById('githubLoginBtn');
  els.profileLogoutBtn = document.getElementById('profileLogoutBtn');

  els.avatarCropOverlay = document.getElementById('avatarCropOverlay');
  els.avatarCropContainer = document.getElementById('avatarCropContainer');
  els.avatarCropImage = document.getElementById('avatarCropImage');
  els.avatarCropZoom = document.getElementById('avatarCropZoom');
  els.avatarCropCancel = document.getElementById('avatarCropCancel');
  els.avatarCropConfirm = document.getElementById('avatarCropConfirm');
}

/* ---------------- 初期化 ---------------- */
function init() {
  // 最初の投稿を読み込む
  loadMorePosts(INITIAL_PAGE_SIZE);

  renderTagList();

  setupCategorySidebar();
  setupSidebarToggle();
  setupPulldown();
  setupSortDropdown();
  setupTagPanelToggle();
  setupTagListEvents();
  setupSelectedTagsDropdown();
  setupPinSection();
  setupPostButton();
  setupSearch();
  setupProfileIcon();
  setupAvatarCrop();
  setupProfilePanel();
  applyProfileAvatar();
  setupDetailModal();
  setupPostModal();
  setupInfiniteScroll();
  setupSettings();
  setupGenericConfirm();
  setupDeadlineEditModal();
  setupFirebase();
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
      createdAt: parseDateString(template.date),
      deadlineDays: template.deadlineDays,
      contact: template.contact || '',
      images: template.images.slice(),
      pinned: INITIAL_PINNED_INDEXES.includes((id - 1) % basePosts.length) && id <= basePosts.length,
      authorUid: null,
    });
    state.nextId++;
  }
  return newPosts;
}

function loadMorePosts(count = PAGE_SIZE) {
  if (state.loading || state.reachedEnd) return;
  state.loading = true;

  const newPosts = generatePostsBatch(count);
  state.allPosts = state.allPosts.concat(newPosts);

  if (state.allPosts.length >= MAX_POSTS) {
    state.reachedEnd = true;
  }

  renderPosts();
  state.loading = false;
}

/* =========================================================
   期限判定
   ========================================================= */
function parseDateString(dateStr) {
  const m = dateStr.match(/(\d{4})年(\d{2})月(\d{2})日/);
  if (!m) return new Date();
  return new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]));
}

function isPostExpired(post) {
  if (!post.createdAt || !post.deadlineDays) return false;
  const deadline = new Date(post.createdAt);
  deadline.setDate(deadline.getDate() + post.deadlineDays);
  return new Date() > deadline;
}

function getExpiredPosts() {
  return state.allPosts.filter(post => isPostExpired(post));
}

/* =========================================================
   フィルタリング
   ========================================================= */
function getFilteredPosts() {
  const keyword = state.searchKeyword.trim().toLowerCase();

  const filtered = state.allPosts.filter((post) => {
    if (isPostExpired(post)) return false;

    if (keyword) {
      const inTitle = post.title.toLowerCase().includes(keyword);
      const inTags = post.tags.some((t) => t.toLowerCase().includes(keyword));
      const inBody = state.searchIncludeBody && post.description.toLowerCase().includes(keyword);
      return inTitle || inTags || inBody;
    }

    if (state.showPinnedOnly && !post.pinned) return false;

    if (!state.showPinnedOnly && state.currentCategory !== 'all' && post.category !== state.currentCategory) {
      return false;
    }

    if (state.activeTags.size > 0 && ![...state.activeTags].every(t => post.tags.includes(t))) return false;

    return true;
  });

  return sortPosts(filtered);
}

/* =========================================================
   描画：タグ一覧
   ========================================================= */
function renderTagList() {
  const tags = CATEGORY_TAGS[state.tagBarCategory] || [];
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
  const tags = CATEGORY_TAGS[state.tagBarCategory] || [];
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

  // 内容（テキストのみ。画像は詳細モーダルで表示）
  const contentBox = document.createElement('div');
  contentBox.className = 'post-content-box';
  contentBox.appendChild(document.createTextNode(post.description));
  card.appendChild(contentBox);

  // タグ（横スクロールで表示。クリックでそのタグを検索）
  const tagsWrap = document.createElement('div');
  tagsWrap.className = 'post-tags';
  post.tags.forEach((tag) => {
    const pill = document.createElement('span');
    pill.className = 'tag-pill';
    pill.textContent = '#' + tag;
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      searchByTag(tag);
    });
    tagsWrap.appendChild(pill);
  });
  card.appendChild(tagsWrap);

  // 投稿日時
  const footer = document.createElement('div');
  footer.className = 'post-footer';

  const dateEl = document.createElement('span');
  dateEl.className = 'post-date';
  dateEl.textContent = '投稿日時　' + post.date;
  footer.appendChild(dateEl);

  if (post.createdAt && post.deadlineDays) {
    const deadline = new Date(post.createdAt);
    deadline.setDate(deadline.getDate() + post.deadlineDays);
    const remaining = Math.ceil((deadline - new Date()) / (24 * 60 * 60 * 1000));
    const deadlineEl = document.createElement('span');
    deadlineEl.className = 'post-deadline' + (remaining <= 3 ? ' urgent' : '');
    deadlineEl.textContent = '残り ' + remaining + ' 日';
    footer.appendChild(deadlineEl);
  }

  card.appendChild(footer);

  card.addEventListener('click', () => openDetailModal(post));

  return card;
}

/* =========================================================
   投稿カード「…」メニュー（自分の投稿＝編集/期限変更/削除、他人の投稿＝通報）
   ========================================================= */
function isOwnPost(post) {
  return !!(state.currentUser && post.authorUid && post.authorUid === state.currentUser.uid);
}

function closeAllPostMenus() {
  document.querySelectorAll('.post-more-menu.open').forEach((menu) => menu.classList.remove('open'));
}

function createPostMoreMenu(post) {
  const wrap = document.createElement('div');
  wrap.className = 'post-more-wrap';

  const own = isOwnPost(post);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'post-more-btn' + (own ? '' : ' report');
  btn.textContent = '⋯';
  btn.title = own ? '投稿の操作' : 'この投稿を通報';

  const menu = document.createElement('div');
  menu.className = 'post-more-menu';

  if (own) {
    menu.appendChild(createPostMoreMenuItem('編集', false, (e) => {
      e.stopPropagation();
      closeAllPostMenus();
      if (!isOwnPost(post)) {
        closeDetailModal();
        showLoginPrompt();
        return;
      }
      closeDetailModal();
      openEditPostModal(post);
    }));
    menu.appendChild(createPostMoreMenuItem('期限変更', false, (e) => {
      e.stopPropagation();
      closeAllPostMenus();
      if (!isOwnPost(post)) {
        closeDetailModal();
        showLoginPrompt();
        return;
      }
      closeDetailModal();
      openDeadlineEditModal(post);
    }));
    menu.appendChild(createPostMoreMenuItem('削除', true, (e) => {
      e.stopPropagation();
      closeAllPostMenus();
      if (!isOwnPost(post)) {
        closeDetailModal();
        showLoginPrompt();
        return;
      }
      showGenericConfirm('この投稿を削除しますか？', () => {
        state.allPosts = state.allPosts.filter((p) => p.id !== post.id);
        closeDetailModal();
        renderPosts();
        showToast('投稿を削除しました');
      });
    }));
  } else {
    const reasons = [
      { label: '不適切な投稿', value: 'inappropriate' },
      { label: 'スパム', value: 'spam' },
      { label: 'その他', value: 'other' },
    ];
    reasons.forEach((r) => {
      menu.appendChild(createPostMoreMenuItem(r.label, true, (e) => {
        e.stopPropagation();
        closeAllPostMenus();
        reportPost(post, r.value);
      }));
    });
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const willOpen = !menu.classList.contains('open');
    closeAllPostMenus();
    menu.classList.toggle('open', willOpen);
  });

  wrap.appendChild(btn);
  wrap.appendChild(menu);
  return wrap;
}

function createPostMoreMenuItem(label, danger, onClick) {
  const item = document.createElement('button');
  item.type = 'button';
  item.className = 'post-more-menu-item' + (danger ? ' danger' : '');
  item.textContent = label;
  item.addEventListener('click', onClick);
  return item;
}

document.addEventListener('click', () => closeAllPostMenus());

/* 通報をFirestoreのreportsコレクションへ保存 */
async function reportPost(post, reason) {
  if (!state.currentUser) {
    showLoginPrompt();
    return;
  }
  const fb = window._firebase;
  if (!fb) {
    showToast('通報機能が利用できません');
    return;
  }
  try {
    await fb.addDoc(fb.collection(fb.db, 'reports'), {
      postId: String(post.id),
      postTitle: post.title,
      reason: reason,
      reporterUid: state.currentUser.uid,
      createdAt: new Date().toISOString(),
    });
    showToast('通報しました。ご協力ありがとうございます');
  } catch (err) {
    console.error('Firestore report error:', err);
    showToast('通報に失敗しました');
  }
}

function createAdCard() {
  const ad = document.createElement('div');
  ad.className = 'ad-card';

  const label = document.createElement('div');
  label.className = 'ad-label';
  label.textContent = '広告';

  const iframe = document.createElement('iframe');
  iframe.width = '728';
  iframe.height = '90';
  iframe.frameBorder = '0';
  iframe.scrolling = 'no';
  iframe.style.maxWidth = '100%';
  iframe.sandbox = 'allow-scripts allow-popups allow-same-origin';
  iframe.src = 'ad.html';

  ad.appendChild(label);
  ad.appendChild(iframe);
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

/* =========================================================
   サイドバー（モバイル用スライド開閉）
   ========================================================= */
function setupSidebarToggle() {
  els.sidebarToggleBtn.addEventListener('click', openSidebarDrawer);
  els.sidebarCloseBtn.addEventListener('click', closeSidebarDrawer);
  els.sidebarOverlay.addEventListener('click', closeSidebarDrawer);

  els.sidebar.addEventListener('click', (e) => {
    if (e.target === els.sidebarCloseBtn) return;
    if (window.matchMedia('(max-width: 900px)').matches) {
      closeSidebarDrawer();
    }
  });
}

function openSidebarDrawer() {
  els.sidebar.classList.add('open');
  els.sidebarOverlay.classList.add('show');
}

function closeSidebarDrawer() {
  els.sidebar.classList.remove('open');
  els.sidebarOverlay.classList.remove('show');
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
      selectTagBarCategory(item.dataset.category);
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

/* =========================================================
   並び替え
   ========================================================= */
const SORT_LABELS = {
  newest: '新着順',
  oldest: '古い順',
  deadline_long: '期限が長い順',
  deadline_short: '期限が短い順',
};

function setupSortDropdown() {
  els.sortDropdown.addEventListener('click', (e) => {
    if (e.target.closest('.sort-pulldown-item')) return;
    const willOpen = !els.sortPulldown.classList.contains('open');
    els.sortDropdown.classList.toggle('open', willOpen);
    els.sortPulldown.classList.toggle('open', willOpen);
  });

  els.sortPulldownItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      selectSortOrder(item.dataset.sort);
      closeSortPulldown();
    });
  });

  document.addEventListener('click', (e) => {
    if (!els.sortDropdown.contains(e.target)) {
      closeSortPulldown();
    }
  });
}

function closeSortPulldown() {
  els.sortDropdown.classList.remove('open');
  els.sortPulldown.classList.remove('open');
}

function selectSortOrder(sortOrder) {
  if (!sortOrder || state.sortOrder === sortOrder) return;
  state.sortOrder = sortOrder;
  els.sortCurrentLabel.textContent = SORT_LABELS[sortOrder];
  els.sortPulldownItems.forEach((item) => {
    item.classList.toggle('active', item.dataset.sort === sortOrder);
  });
  renderPosts();
  closeDetailModal();
}

function getPostDeadline(post) {
  if (!post.createdAt || !post.deadlineDays) return null;
  const deadline = new Date(post.createdAt);
  deadline.setDate(deadline.getDate() + post.deadlineDays);
  return deadline;
}

function sortPosts(posts) {
  const sorted = posts.slice();
  switch (state.sortOrder) {
    case 'oldest':
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    case 'deadline_long':
      sorted.sort((a, b) => (getPostDeadline(b) || 0) - (getPostDeadline(a) || 0));
      break;
    case 'deadline_short':
      sorted.sort((a, b) => (getPostDeadline(a) || 0) - (getPostDeadline(b) || 0));
      break;
    case 'newest':
    default:
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
  }
  return sorted;
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

function selectTagBarCategory(categoryId) {
  state.tagBarCategory = categoryId;

  const categoryInfo = CATEGORIES.find((c) => c.id === categoryId);
  els.categoryCurrent.textContent = categoryInfo ? categoryInfo.label : 'すべて';

  els.pulldownItems.forEach((item) => {
    item.classList.toggle('active', item.dataset.category === categoryId);
  });

  renderTagList();
  if (els.tagPanel.classList.contains('open')) {
    renderTagPanel();
  }
}

function selectCategory(categoryId) {
  state.currentCategory = categoryId;
  state.tagBarCategory = categoryId;
  state.showPinnedOnly = false;
  state.activeTags = new Set();
  updateClearTagsBtn();
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
  closeDetailModal();
  els.postsPane.scrollTop = 0;
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
    closeDetailModal();
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
  els.selectedTagsDropdown.classList.toggle('has-tags', hasTags);
  els.selectedTagsLabel.textContent = hasTags
    ? '選択タグ (' + state.activeTags.size + ')'
    : '選択タグ';
}

function clearAllTags() {
  state.activeTags = new Set();
  updateClearTagsBtn();
  renderTagList();
  if (els.tagPanel.classList.contains('open')) {
    renderTagPanel();
  }
  renderPosts();
  renderSelectedTagsPulldown();
  closeDetailModal();
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

  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className = 'selected-tags-pulldown-clear';
  clearBtn.textContent = 'すべて削除';
  clearBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    clearAllTags();
  });
  els.selectedTagsPulldown.appendChild(clearBtn);

  state.activeTags.forEach((tag) => {
    const item = document.createElement('div');
    item.className = 'selected-tags-pulldown-item';

    const label = document.createElement('span');
    label.textContent = '#' + tag;

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'selected-tags-pulldown-remove';
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.activeTags.delete(tag);
      updateClearTagsBtn();
      renderTagList();
      if (els.tagPanel.classList.contains('open')) renderTagPanel();
      renderPosts();
      renderSelectedTagsPulldown();
      closeDetailModal();
    });

    item.appendChild(label);
    item.appendChild(removeBtn);
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

/* =========================================================
   ピン止め
   ========================================================= */
function setupPinSection() {
  els.pinItem.addEventListener('click', () => {
    if (!state.currentUser) {
      showLoginPrompt();
      return;
    }
    state.showPinnedOnly = true;
    state.searchKeyword = '';
    els.searchInput.value = '';

    els.sidebarCategoryItems.forEach((item) => item.classList.remove('active'));
    els.pinItem.classList.add('active');

    renderPosts();
    closeDetailModal();
    els.postsPane.scrollTop = 0;
  });
}

function togglePin(post, btnEl) {
  if (!state.currentUser) {
    showLoginPrompt();
    return;
  }
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

  // 詳細画面が同じ投稿を開いている場合はボタン表示も更新
  if (els.contentSlider.classList.contains('show-detail') && els.detailPane.dataset.postId === String(post.id)) {
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

  // 検索バーにフォーカスしたらオプションパネルを表示
  els.searchInput.addEventListener('focus', () => {
    els.searchOptionsPanel.classList.add('open');
  });

  // 検索バーの外側をクリックしたら閉じる
  document.addEventListener('click', (e) => {
    if (!els.searchArea.contains(e.target)) {
      els.searchOptionsPanel.classList.remove('open');
    }
  });

  // 「本文も含める」の切り替え。検索中なら即座に結果へ反映する
  els.searchIncludeBody.addEventListener('change', () => {
    state.searchIncludeBody = els.searchIncludeBody.checked;
    if (state.searchKeyword.trim()) {
      renderPosts();
      els.postsPane.scrollTop = 0;
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
  closeDetailModal();
  els.postsPane.scrollTop = 0;
}

/* タグクリックでそのタグをキーワードとして検索する */
function searchByTag(tag) {
  els.searchInput.value = tag;
  runSearch();
}

/* =========================================================
   無限スクロール
   ========================================================= */
function setupInfiniteScroll() {
  els.postsPane.addEventListener('scroll', () => {
    const el = els.postsPane;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 80;
    if (nearBottom) {
      loadMorePosts();
    }
  });
}

/* =========================================================
   投稿詳細（一覧エリアがスライドして切り替わる）
   ========================================================= */
function setupDetailModal() {
  els.detailBackBtn.addEventListener('click', closeDetailModal);

  els.lightboxOverlay.addEventListener('click', () => {
    els.lightboxOverlay.classList.remove('show');
  });
}

function openLightbox(src) {
  els.lightboxImage.src = src;
  els.lightboxOverlay.classList.add('show');
}

function openDetailModal(post) {
  els.detailPane.dataset.postId = String(post.id);

  // カテゴリに応じたページ上部の配色（ゲーム=青／アプリ=紫／サイト=茶色／映像=白）
  els.detailPane.className = 'content-pane detail-pane ' + (CATEGORY_BORDER_CLASS[post.category] || '');

  // アイコン・名前（自分のアカウント情報）
  els.detailAvatar.style.backgroundImage = state.profile.avatarUrl
    ? 'url(' + state.profile.avatarUrl + ')'
    : '';
  els.detailAuthor.textContent = state.profile.name || '名前';

  els.detailMoreMenuWrap.innerHTML = '';
  els.detailMoreMenuWrap.appendChild(createPostMoreMenu(post));

  els.detailTitle.textContent = post.title;

  // 画像（サムネイル一覧。クリックでライトボックス）
  els.detailImageBox.innerHTML = '';
  if (post.images && post.images.length > 0) {
    post.images.forEach((src) => {
      const img = document.createElement('img');
      img.src = src;
      img.className = 'modal-thumbnail';
      img.alt = '';
      img.addEventListener('click', () => openLightbox(src));
      els.detailImageBox.appendChild(img);
    });
    els.detailImageBox.classList.add('has-image');
  } else {
    els.detailImageBox.classList.remove('has-image');
  }

  // 内容
  els.detailDesc.textContent = post.description;

  els.detailTags.innerHTML = '';
  post.tags.forEach((tag) => {
    const pill = document.createElement('span');
    pill.className = 'tag-pill';
    pill.textContent = '#' + tag;
    pill.addEventListener('click', () => searchByTag(tag));
    els.detailTags.appendChild(pill);
  });

  // 連絡先（未入力なら非表示）
  if (post.contact && post.contact.trim()) {
    els.detailContactValue.textContent = post.contact;
    els.detailContact.style.display = '';
  } else {
    els.detailContactValue.textContent = '';
    els.detailContact.style.display = 'none';
  }

  // 投稿日時・残り日数
  els.detailDate.textContent = '投稿日時　' + post.date;

  const deadline = getPostDeadline(post);
  if (deadline) {
    const remaining = Math.ceil((deadline - new Date()) / (24 * 60 * 60 * 1000));
    els.detailDeadline.textContent = '残り ' + remaining + ' 日';
    els.detailDeadline.className = 'post-deadline' + (remaining <= 3 ? ' urgent' : '');
    els.detailDeadline.style.display = '';
  } else {
    els.detailDeadline.textContent = '';
    els.detailDeadline.style.display = 'none';
  }

  updateDetailPinButton(post);
  els.detailPinBtn.onclick = () => {
    togglePin(post);
    updateDetailPinButton(post);
  };

  els.contentSlider.classList.add('show-detail');
  els.detailPane.scrollTop = 0;
}

function updateDetailPinButton(post) {
  const label = post.pinned ? 'ピン止めを解除する' : 'ピン止めする';
  els.detailPinBtn.title = label;
  els.detailPinBtn.setAttribute('aria-label', label);
  els.detailPinBtn.classList.toggle('pinned', post.pinned);
}

function closeDetailModal() {
  els.contentSlider.classList.remove('show-detail');
}

/* =========================================================
   投稿作成モーダル
   ========================================================= */
function setupPostButton() {
  els.postButton.addEventListener('click', () => {
    if (!state.currentUser) {
      showLoginPrompt();
      return;
    }
    resetPostForm();
    els.postModalTitle.textContent = '投稿を作成';
    els.postSubmitBtn.textContent = '投稿する';
    els.postDeadlineGroup.style.display = '';
    els.postModalOverlay.classList.add('show');
  });
}

/* フォームを新規投稿用の初期状態にリセット */
function resetPostForm() {
  editingPostId = null;
  els.postForm.reset();
  postSelectedTags = new Set();
  postSelectedFiles = [];
  postExistingImages = [];
  previewUrls.forEach(url => URL.revokeObjectURL(url));
  previewUrls = [];
  els.imagePreviewContainer.innerHTML = '';
  els.titleCharCounter.textContent = '0 / 30';
  els.titleCharCounter.className = 'char-counter';
  els.descCharCounter.textContent = '0 / 500';
  els.descCharCounter.className = 'char-counter';
  updateFileInputDisplay();
  updatePostModalBorder();
  renderPostTagSelector();
}

/* 既存の投稿を編集モードでフォームに反映 */
function openEditPostModal(post) {
  resetPostForm();
  editingPostId = post.id;

  els.postTitleInput.value = post.title;
  els.postTitleInput.dispatchEvent(new Event('input'));

  els.postCategoryInput.value = post.category;
  updatePostModalBorder();

  els.postDescInput.value = post.description;
  els.postDescInput.dispatchEvent(new Event('input'));

  els.postContactInput.value = post.contact || '';

  const knownTags = post.tags.filter((t) => (CATEGORY_TAGS.all || []).includes(t));
  const freeTags = post.tags.filter((t) => !(CATEGORY_TAGS.all || []).includes(t));
  postSelectedTags = new Set(knownTags);
  els.postTagsInput.value = freeTags.join(',');
  renderPostTagSelector();

  postExistingImages = (post.images || []).slice();
  updateImagePreviews();
  updateFileInputDisplay();

  els.postModalTitle.textContent = '投稿を編集';
  els.postSubmitBtn.textContent = '更新する';
  els.postDeadlineGroup.style.display = 'none';

  els.postModalOverlay.classList.add('show');
}

/* 現在日時を「yyyy年mm月dd日」形式に変換 */
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return y + '年' + m + '月' + d + '日';
}

function renderPostTagSelector() {
  const tags = CATEGORY_TAGS.all || [];
  els.postTagSelector.innerHTML = '';
  tags.forEach((tag) => {
    const pill = document.createElement('span');
    pill.className = 'tag-pill' + (postSelectedTags.has(tag) ? ' selected' : '');
    pill.textContent = '#' + tag;
    pill.addEventListener('click', () => {
      if (postSelectedTags.has(tag)) {
        postSelectedTags.delete(tag);
      } else {
        postSelectedTags.add(tag);
      }
      pill.classList.toggle('selected', postSelectedTags.has(tag));
      updatePostTagDisplayText();
    });
    els.postTagSelector.appendChild(pill);
  });
  updatePostTagDisplayText();
}

function setupPostModal() {
  els.postModalClose.addEventListener('click', closePostModal);
  els.postModalOverlay.addEventListener('click', (e) => {
    if (e.target === els.postModalOverlay) closePostModal();
  });

  // カテゴリ変更 → モーダル枠色切替
  els.postCategoryInput.addEventListener('change', updatePostModalBorder);

  // タイトル文字数カウンター
  els.postTitleInput.addEventListener('input', () => {
    const len = els.postTitleInput.value.length;
    els.titleCharCounter.textContent = len + ' / 30';
    els.titleCharCounter.className = 'char-counter' + (len >= 30 ? ' at-limit' : len >= 25 ? ' near-limit' : '');
  });

  // 詳細文字数カウンター
  els.postDescInput.addEventListener('input', () => {
    const len = els.postDescInput.value.length;
    els.descCharCounter.textContent = len + ' / 500';
    els.descCharCounter.className = 'char-counter' + (len >= 500 ? ' at-limit' : len >= 450 ? ' near-limit' : '');
  });

  // 画像選択
  els.postImageInput.addEventListener('change', (e) => {
    const newFiles = [...e.target.files];
    const remaining = 4 - (postExistingImages.length + postSelectedFiles.length);
    if (remaining > 0) {
      postSelectedFiles = [...postSelectedFiles, ...newFiles.slice(0, remaining)];
    }
    els.postImageInput.value = '';
    updateImagePreviews();
    updateFileInputDisplay();
  });

  // タグドロップダウン開閉
  els.postTagDropdownDisplay.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = els.postTagDropdownPanel.classList.contains('open');
    els.postTagDropdownPanel.classList.toggle('open', !isOpen);
    els.postTagDropdown.classList.toggle('open', !isOpen);
  });

  document.addEventListener('click', (e) => {
    if (!els.postTagDropdown.contains(e.target)) {
      els.postTagDropdownPanel.classList.remove('open');
      els.postTagDropdown.classList.remove('open');
    }
  });

  els.postForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = els.postTitleInput.value.trim();
    if (!title) return;

    const category = els.postCategoryInput.value;
    const freeTags = els.postTagsInput.value
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const tags = [...postSelectedTags, ...freeTags];
    const description = els.postDescInput.value.trim() || '詳細はまだ記入されていません。';
    const contact = els.postContactInput.value.trim();

    const finishSaving = (newImages) => {
      const images = [...postExistingImages, ...newImages].slice(0, 4);

      if (editingPostId !== null) {
        const post = state.allPosts.find((p) => p.id === editingPostId);
        if (post) {
          post.category = category;
          post.title = title;
          post.description = description;
          post.tags = tags.length > 0 ? tags : ['未設定'];
          post.contact = contact;
          post.images = images;
        }
        editingPostId = null;
        renderPosts();
        closePostModal();
        showToast('投稿を更新しました');
        return;
      }

      const deadlineDays = Math.min(365, Math.max(1, parseInt(els.postDeadlineInput.value) || 30));
      const newPost = {
        id: state.nextId,
        category: category,
        title: title,
        description: description,
        tags: tags.length > 0 ? tags : ['未設定'],
        date: formatDate(new Date()),
        createdAt: new Date(),
        deadlineDays: deadlineDays,
        contact: contact,
        images: images,
        pinned: false,
        authorUid: state.currentUser ? state.currentUser.uid : null,
      };
      state.nextId++;

      state.allPosts.unshift(newPost);

      selectCategory('all');

      closePostModal();
      showToast('投稿を作成しました');
    };

    const imageFiles = postSelectedFiles.slice(0, 4 - postExistingImages.length);
    if (imageFiles.length > 0) {
      Promise.all(imageFiles.map((file) => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.readAsDataURL(file);
      }))).then((images) => finishSaving(images));
    } else {
      finishSaving([]);
    }
  });
}

function closePostModal() {
  els.postModalOverlay.classList.remove('show');
  els.postTagDropdownPanel.classList.remove('open');
  els.postTagDropdown.classList.remove('open');
  editingPostId = null;
}

function updatePostModalBorder() {
  const cat = els.postCategoryInput.value;
  els.postModal.className = 'modal post-modal ' + (CATEGORY_BORDER_CLASS[cat] || 'cat-game');
}

function updatePostTagDisplayText() {
  if (postSelectedTags.size === 0) {
    els.postTagDisplayText.textContent = '選択してください';
    els.postTagDisplayText.classList.add('placeholder');
  } else {
    els.postTagDisplayText.textContent = [...postSelectedTags].join('、');
    els.postTagDisplayText.classList.remove('placeholder');
  }
}

function updateFileInputDisplay() {
  const count = postExistingImages.length + postSelectedFiles.length;
  if (count === 0) {
    els.fileInputDisplay.textContent = 'ファイルが選択されていません';
    els.fileInputDisplay.setAttribute('for', 'postImageInput');
  } else if (count >= 4) {
    els.fileInputDisplay.textContent = '4枚選択中（上限）';
    els.fileInputDisplay.removeAttribute('for');
  } else {
    els.fileInputDisplay.textContent = count + '枚選択中（クリックで追加）';
    els.fileInputDisplay.setAttribute('for', 'postImageInput');
  }
}

function updateImagePreviews() {
  previewUrls.forEach(url => URL.revokeObjectURL(url));
  previewUrls = [];
  els.imagePreviewContainer.innerHTML = '';

  postExistingImages.forEach((url, i) => {
    const item = document.createElement('div');
    item.className = 'image-preview-item';

    const img = document.createElement('img');
    img.src = url;
    img.alt = '';

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'image-preview-remove';
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', () => {
      postExistingImages.splice(i, 1);
      updateImagePreviews();
      updateFileInputDisplay();
    });

    item.appendChild(img);
    item.appendChild(removeBtn);
    els.imagePreviewContainer.appendChild(item);
  });

  postSelectedFiles.forEach((file, i) => {
    const url = URL.createObjectURL(file);
    previewUrls.push(url);

    const item = document.createElement('div');
    item.className = 'image-preview-item';

    const img = document.createElement('img');
    img.src = url;
    img.alt = '';

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'image-preview-remove';
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', () => {
      postSelectedFiles.splice(i, 1);
      updateImagePreviews();
      updateFileInputDisplay();
    });

    item.appendChild(img);
    item.appendChild(removeBtn);
    els.imagePreviewContainer.appendChild(item);
  });
}

/* =========================================================
   プロフィールアイコン・プロフィール画面
   ========================================================= */
function setupProfileIcon() {
  els.hamburgerBtn.addEventListener('click', () => openMenu());
  els.menuCloseBtn.addEventListener('click', () => closeMenu());
  els.menuOverlay.addEventListener('click', (e) => {
    if (e.target === els.menuOverlay) closeMenu();
  });
  els.menuProfileArea.addEventListener('click', () => {
    closeMenu();
    openProfilePanel();
  });
}

function openMenu() {
  applyMenuProfile();
  els.menuOverlay.classList.add('show');
}

function closeMenu() {
  els.menuOverlay.classList.remove('show');
}

function applyMenuProfile() {
  const url = state.profile.avatarUrl ? 'url(' + state.profile.avatarUrl + ')' : '';
  els.menuProfileIcon.style.backgroundImage = url;
  els.menuProfileName.textContent = state.profile.name || '名前';
}

function openProfilePanel() {
  els.profileOverlay.classList.add('show');
}

function closeProfilePanel() {
  els.profileOverlay.classList.remove('show');
}

function applyProfileAvatar() {
  const url = state.profile.avatarUrl ? 'url(' + state.profile.avatarUrl + ')' : '';
  els.profileAvatar.style.backgroundImage = url;
  els.menuProfileIcon.style.backgroundImage = url;
  els.menuProfileName.textContent = state.profile.name || '名前';
}

function setupProfilePanel() {
  // ×ボタンでメニュー画面へ戻る
  els.profileCloseBtn.addEventListener('click', () => {
    closeProfilePanel();
    openMenu();
  });
  // 背景クリックで一気にメイン画面へ戻る
  els.profileOverlay.addEventListener('click', (e) => {
    if (e.target === els.profileOverlay) closeProfilePanel();
  });

  els.profileSettingsBtn.addEventListener('click', () => {
    if (!state.currentUser) {
      showLoginPrompt();
      return;
    }
    openSettings();
  });

  // アイコンクリックでファイル選択 → トリムモーダルへ
  els.profileAvatar.addEventListener('click', () => {
    els.profileAvatarInput.click();
  });

  // バツボタンで削除確認モーダルを表示
  els.profileAvatarDeleteBtn.addEventListener('click', () => {
    showIconDeleteConfirm();
  });


  // 自己紹介
  els.profileBio.addEventListener('input', () => {
    state.profile.bio = els.profileBio.value;
    debouncedSaveProfile();
  });

  // リンク
  renderProfileLinks();
  els.profileAddLinkBtn.addEventListener('click', () => {
    if (state.profile.links.length >= 10) return;
    state.profile.links.push('');
    renderProfileLinks();
  });
}

const MAX_LINKS = 10;

function renderProfileLinks() {
  els.profileLinksContainer.innerHTML = '';

  state.profile.links.forEach((url, index) => {
    const row = document.createElement('div');
    row.className = 'profile-link-row';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'profile-link-input';
    input.placeholder = 'URLを入力';
    input.value = url;
    input.addEventListener('input', () => {
      state.profile.links[index] = input.value;
      debouncedSaveProfile();
    });

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'profile-link-remove-btn';
    removeBtn.textContent = '×';
    removeBtn.title = 'このリンクを削除';
    removeBtn.addEventListener('click', () => {
      state.profile.links.splice(index, 1);
      if (state.profile.links.length === 0) state.profile.links.push('');
      renderProfileLinks();
      debouncedSaveProfile();
    });

    row.appendChild(input);
    row.appendChild(removeBtn);
    els.profileLinksContainer.appendChild(row);
  });

  els.profileAddLinkBtn.disabled = state.profile.links.length >= MAX_LINKS;
}

/* =========================================================
   アイコントリム
   ========================================================= */
function setupAvatarCrop() {
  els.profileAvatarInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    els.profileAvatarInput.value = '';
    const reader = new FileReader();
    reader.onload = (ev) => openAvatarCrop(ev.target.result);
    reader.readAsDataURL(file);
  });

  els.avatarCropCancel.addEventListener('click', closeAvatarCrop);
  els.avatarCropOverlay.addEventListener('click', (e) => {
    if (e.target === els.avatarCropOverlay) closeAvatarCrop();
  });
  els.avatarCropConfirm.addEventListener('click', confirmAvatarCrop);
  els.avatarCropZoom.addEventListener('input', onCropZoomChange);

  const c = els.avatarCropContainer;
  c.addEventListener('mousedown', onCropDragStart);
  window.addEventListener('mousemove', onCropDragMove);
  window.addEventListener('mouseup', onCropDragEnd);
  c.addEventListener('touchstart', onCropTouchStart, { passive: false });
  window.addEventListener('touchmove', onCropTouchMove, { passive: false });
  window.addEventListener('touchend', onCropDragEnd);
}

function openAvatarCrop(src) {
  const img = els.avatarCropImage;
  img.onload = () => {
    const diameter = CROP_RADIUS * 2;
    cropState.minScale = Math.max(diameter / img.naturalWidth, diameter / img.naturalHeight);
    cropState.maxScale = cropState.minScale * 4;
    cropState.scale = cropState.minScale;
    cropState.tx = (CROP_SIZE - img.naturalWidth * cropState.scale) / 2;
    cropState.ty = (CROP_SIZE - img.naturalHeight * cropState.scale) / 2;
    constrainCropTranslation();
    applyCropTransform();
    els.avatarCropZoom.value = 0;
    els.avatarCropOverlay.classList.add('show');
  };
  img.src = src;
}

function closeAvatarCrop() {
  els.avatarCropOverlay.classList.remove('show');
}

function applyCropTransform() {
  els.avatarCropImage.style.transform =
    `translate(${cropState.tx}px, ${cropState.ty}px) scale(${cropState.scale})`;
}

function constrainCropTranslation() {
  const w = els.avatarCropImage.naturalWidth * cropState.scale;
  const h = els.avatarCropImage.naturalHeight * cropState.scale;
  const cx = CROP_SIZE / 2;
  const cy = CROP_SIZE / 2;
  const r = CROP_RADIUS;
  cropState.tx = Math.max(cx + r - w, Math.min(cx - r, cropState.tx));
  cropState.ty = Math.max(cy + r - h, Math.min(cy - r, cropState.ty));
}

function onCropZoomChange() {
  const ratio = els.avatarCropZoom.value / 100;
  const newScale = cropState.minScale + ratio * (cropState.maxScale - cropState.minScale);
  const cx = CROP_SIZE / 2;
  const cy = CROP_SIZE / 2;
  const sr = newScale / cropState.scale;
  cropState.tx = cx + (cropState.tx - cx) * sr;
  cropState.ty = cy + (cropState.ty - cy) * sr;
  cropState.scale = newScale;
  constrainCropTranslation();
  applyCropTransform();
}

function onCropDragStart(e) {
  cropState.dragging = true;
  cropState.lastX = e.clientX;
  cropState.lastY = e.clientY;
  els.avatarCropContainer.style.cursor = 'grabbing';
}

function onCropDragMove(e) {
  if (!cropState.dragging) return;
  cropState.tx += e.clientX - cropState.lastX;
  cropState.ty += e.clientY - cropState.lastY;
  cropState.lastX = e.clientX;
  cropState.lastY = e.clientY;
  constrainCropTranslation();
  applyCropTransform();
}

function onCropDragEnd() {
  if (!cropState.dragging) return;
  cropState.dragging = false;
  els.avatarCropContainer.style.cursor = 'grab';
}

function onCropTouchStart(e) {
  e.preventDefault();
  const t = e.touches[0];
  cropState.dragging = true;
  cropState.lastX = t.clientX;
  cropState.lastY = t.clientY;
}

function onCropTouchMove(e) {
  if (!cropState.dragging) return;
  e.preventDefault();
  const t = e.touches[0];
  cropState.tx += t.clientX - cropState.lastX;
  cropState.ty += t.clientY - cropState.lastY;
  cropState.lastX = t.clientX;
  cropState.lastY = t.clientY;
  constrainCropTranslation();
  applyCropTransform();
}

function confirmAvatarCrop() {
  const img = els.avatarCropImage;
  const OUT = 256;
  const canvas = document.createElement('canvas');
  canvas.width = OUT;
  canvas.height = OUT;
  const ctx = canvas.getContext('2d');

  ctx.beginPath();
  ctx.arc(OUT / 2, OUT / 2, OUT / 2, 0, Math.PI * 2);
  ctx.clip();

  const cx = CROP_SIZE / 2;
  const cy = CROP_SIZE / 2;
  const r = CROP_RADIUS;
  const srcX = (cx - r - cropState.tx) / cropState.scale;
  const srcY = (cy - r - cropState.ty) / cropState.scale;
  const srcSize = (r * 2) / cropState.scale;
  ctx.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, OUT, OUT);

  state.profile.avatarUrl = canvas.toDataURL('image/jpeg', 0.92);
  applyProfileAvatar();
  renderPosts();
  closeAvatarCrop();
  debouncedSaveProfile();
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

/* =========================================================
   Firebase：認証 & Firestore
   ========================================================= */
/* =========================================================
   設定画面
   ========================================================= */
function setupSettings() {
  els.settingsCloseBtn.addEventListener('click', closeSettings);
  els.settingsOverlay.addEventListener('click', (e) => {
    if (e.target === els.settingsOverlay) closeSettings();
  });

  const expiredHeader = document.getElementById('expiredPulldownHeader');
  const expiredArrow = document.getElementById('expiredPulldownArrow');
  expiredHeader.addEventListener('click', () => {
    const isOpen = els.expiredPostsList.style.display !== 'none';
    els.expiredPostsList.style.display = isOpen ? 'none' : 'flex';
    expiredArrow.classList.toggle('open', !isOpen);
  });

  els.settingsNameSave.addEventListener('click', () => {
    const newName = els.settingsNameInput.value.trim();
    if (!newName) return;
    state.profile.name = newName;
    els.profileNameInput.textContent = newName;
    els.menuProfileName.textContent = newName;
    renderPosts();
    debouncedSaveProfile();
    showToast('名前を変更しました');
  });

  els.settingsContactSave.addEventListener('click', () => {
    const newContact = els.settingsContactInput.value.trim();
    state.profile.contact = newContact;
    els.profileContactDisplay.textContent = newContact;
    debouncedSaveProfile();
    showToast('連絡先を変更しました');
  });
}

function openSettings() {
  els.settingsNameInput.value = state.profile.name;
  els.settingsContactInput.value = state.profile.contact;
  els.expiredPostsList.style.display = 'none';
  document.getElementById('expiredPulldownArrow').classList.remove('open');
  renderExpiredPosts();
  els.settingsOverlay.classList.add('show');
}

function closeSettings() {
  els.settingsOverlay.classList.remove('show');
}

function renderExpiredPosts() {
  const expired = getExpiredPosts();
  els.expiredPostsList.innerHTML = '';

  if (expired.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'expired-posts-empty';
    empty.textContent = '期限切れの募集はありません';
    els.expiredPostsList.appendChild(empty);
    return;
  }

  expired.forEach((post) => {
    const item = document.createElement('div');
    item.className = 'expired-post-item';
    item.addEventListener('click', () => {
      closeSettings();
      openDetailModal(post);
    });

    const info = document.createElement('div');
    info.className = 'expired-post-info';

    const title = document.createElement('div');
    title.className = 'expired-post-title';
    title.textContent = post.title;

    const deadline = new Date(post.createdAt);
    deadline.setDate(deadline.getDate() + post.deadlineDays);

    const meta = document.createElement('div');
    meta.className = 'expired-post-meta';
    meta.textContent = post.date + ' ／ 期限 ' + formatDate(deadline);

    info.appendChild(title);
    info.appendChild(meta);
    item.appendChild(info);
    els.expiredPostsList.appendChild(item);
  });
}

/* =========================================================
   Firebase：認証 & Firestore
   ========================================================= */
function setupFirebase() {
  const fb = window._firebase;
  if (!fb) return;

  fb.onAuthStateChanged(fb.auth, (user) => {
    if (user) {
      onFirebaseLogin(user);
    } else {
      onFirebaseLogout();
    }
  });

  els.githubLoginBtn.addEventListener('click', loginWithGithub);
  els.profileLogoutBtn.addEventListener('click', () => {
    showLogoutConfirm();
  });
  setupLoginPrompt();
}

/* ログイン促進モーダル */
function setupLoginPrompt() {
  const overlay = document.getElementById('loginPromptOverlay');
  const closeBtn = document.getElementById('loginPromptClose');
  const githubBtn = document.getElementById('loginPromptGithubBtn');

  closeBtn.addEventListener('click', () => overlay.classList.remove('show'));
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('show');
  });

  githubBtn.addEventListener('click', async () => {
    overlay.classList.remove('show');
    await loginWithGithub();
  });
}

function showLoginPrompt() {
  document.getElementById('loginPromptOverlay').classList.add('show');
}

/* ログアウト確認モーダル */
function showLogoutConfirm() {
  const overlay = document.getElementById('logoutConfirmOverlay');
  overlay.classList.add('show');

  const ok = document.getElementById('logoutConfirmOk');
  const cancel = document.getElementById('logoutConfirmCancel');

  const close = () => {
    overlay.classList.remove('show');
    ok.replaceWith(ok.cloneNode(true));
    cancel.replaceWith(cancel.cloneNode(true));
  };

  ok.addEventListener('click', () => { close(); logoutFirebase(); }, { once: true });
  cancel.addEventListener('click', close, { once: true });
}

/* アイコン削除確認モーダル */
function showIconDeleteConfirm() {
  const overlay = document.getElementById('iconDeleteConfirmOverlay');
  overlay.classList.add('show');

  const ok = document.getElementById('iconDeleteConfirmOk');
  const cancel = document.getElementById('iconDeleteConfirmCancel');

  const close = () => {
    overlay.classList.remove('show');
    ok.replaceWith(ok.cloneNode(true));
    cancel.replaceWith(cancel.cloneNode(true));
  };

  ok.addEventListener('click', () => {
    close();
    state.profile.avatarUrl = 'images/ProfileIcon.png';
    applyProfileAvatar();
    renderPosts();
    debouncedSaveProfile();
  }, { once: true });
  cancel.addEventListener('click', close, { once: true });
}

/* =========================================================
   汎用確認モーダル（投稿削除など）
   ========================================================= */
function setupGenericConfirm() {
  els.genericConfirmOverlay.addEventListener('click', (e) => {
    if (e.target === els.genericConfirmOverlay) els.genericConfirmOverlay.classList.remove('show');
  });
}

function showGenericConfirm(message, onConfirm) {
  els.genericConfirmMessage.textContent = message;
  els.genericConfirmOverlay.classList.add('show');

  const ok = document.getElementById('genericConfirmOk');
  const cancel = document.getElementById('genericConfirmCancel');

  const close = () => {
    els.genericConfirmOverlay.classList.remove('show');
    ok.replaceWith(ok.cloneNode(true));
    cancel.replaceWith(cancel.cloneNode(true));
  };

  ok.addEventListener('click', () => { close(); onConfirm(); }, { once: true });
  cancel.addEventListener('click', close, { once: true });
}

/* =========================================================
   募集期限の変更モーダル
   ========================================================= */
function openDeadlineEditModal(post) {
  editingDeadlinePostId = post.id;
  els.deadlineEditInput.value = post.deadlineDays || 30;
  els.deadlineEditOverlay.classList.add('show');
}

function closeDeadlineEditModal() {
  editingDeadlinePostId = null;
  els.deadlineEditOverlay.classList.remove('show');
}

function setupDeadlineEditModal() {
  els.deadlineEditClose.addEventListener('click', closeDeadlineEditModal);
  els.deadlineEditOverlay.addEventListener('click', (e) => {
    if (e.target === els.deadlineEditOverlay) closeDeadlineEditModal();
  });

  els.deadlineEditSave.addEventListener('click', () => {
    const post = state.allPosts.find((p) => p.id === editingDeadlinePostId);
    if (!post) {
      closeDeadlineEditModal();
      return;
    }
    const days = Math.min(365, Math.max(1, parseInt(els.deadlineEditInput.value) || 30));
    post.createdAt = new Date();
    post.deadlineDays = days;
    closeDeadlineEditModal();
    renderPosts();
    showToast('募集期限を変更しました');
  });
}

async function loginWithGithub() {
  const fb = window._firebase;
  if (!fb) return;
  try {
    const provider = new fb.GithubAuthProvider();
    await fb.signInWithPopup(fb.auth, provider);
  } catch (err) {
    if (err.code !== 'auth/popup-closed-by-user') {
      showToast('ログインに失敗しました');
    }
    console.error(err);
  }
}

async function logoutFirebase() {
  const fb = window._firebase;
  if (!fb) return;
  try {
    await fb.signOut(fb.auth);
    showToast('ログアウトしました');
  } catch (err) {
    console.error(err);
  }
}

async function onFirebaseLogin(user) {
  state.currentUser = user;

  els.profileLoginSection.style.display = 'none';
  els.profileContent.style.display = 'flex';

  const fb = window._firebase;
  const userRef = fb.doc(fb.db, 'users', user.uid);

  try {
    const snap = await fb.getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data();
      state.profile.name = data.name || user.displayName || '名前';
      state.profile.avatarUrl = data.avatarUrl || user.photoURL || '';
      state.profile.bio = data.bio || '';
      state.profile.contact = data.contact || '';
      state.profile.links = data.links && data.links.length > 0 ? data.links : [''];
    } else {
      state.profile.name = user.displayName || '名前';
      state.profile.avatarUrl = user.photoURL || '';
      state.profile.bio = '';
      state.profile.contact = '';
      state.profile.links = [''];

      await fb.setDoc(userRef, {
        name: state.profile.name,
        avatarUrl: state.profile.avatarUrl,
        bio: state.profile.bio,
        contact: state.profile.contact,
        links: state.profile.links,
        githubUid: user.uid,
        githubName: user.displayName,
        githubPhoto: user.photoURL,
        email: user.email,
        createdAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.error('Firestore load error:', err);
    state.profile.name = user.displayName || '名前';
    state.profile.avatarUrl = user.photoURL || '';
  }

  els.profileNameInput.textContent = state.profile.name;
  els.profileContactDisplay.textContent = state.profile.contact;
  els.profileBio.value = state.profile.bio;
  applyProfileAvatar();
  renderProfileLinks();
  renderPosts();
}

function onFirebaseLogout() {
  state.currentUser = null;

  els.profileLoginSection.style.display = 'flex';
  els.profileContent.style.display = 'none';

  state.profile.name = '名前';
  state.profile.avatarUrl = 'images/ProfileIcon.png';
  state.profile.bio = '';
  state.profile.contact = '';
  state.profile.links = [''];

  els.profileNameInput.textContent = state.profile.name;
  els.profileContactDisplay.textContent = state.profile.contact;
  els.profileBio.value = state.profile.bio;
  applyProfileAvatar();
  renderProfileLinks();
  renderPosts();
  closeDetailModal();
}

let saveProfileTimer = null;
function debouncedSaveProfile() {
  if (!state.currentUser) return;
  clearTimeout(saveProfileTimer);
  saveProfileTimer = setTimeout(() => saveProfileToFirestore(), 1000);
}

async function saveProfileToFirestore() {
  const fb = window._firebase;
  if (!fb || !state.currentUser) return;

  try {
    const userRef = fb.doc(fb.db, 'users', state.currentUser.uid);
    await fb.setDoc(userRef, {
      name: state.profile.name,
      avatarUrl: state.profile.avatarUrl,
      bio: state.profile.bio,
      contact: state.profile.contact,
      links: state.profile.links.filter(l => l.trim() !== ''),
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.error('Firestore save error:', err);
  }
}
