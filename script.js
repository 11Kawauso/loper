/* =========================================================
   loper（ロッパー） メイン画面 スクリプト
   投稿はFirebase（Firestore / Storage）と連携しています。
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

/* 全カテゴリ共通で使う募集条件のタグ（各カテゴリの末尾に付く） */
const COMMON_TAGS = ['初心者歓迎', '学生歓迎', '社会人歓迎', 'リモート', '週末開発', '短期', '長期', '商用', '同人・趣味'];

/* カテゴリごとのタグ一覧（タグバー・タグ一覧パネル表示用） */
const CATEGORY_TAGS = {
  game:  ['Unity', 'UE5', 'Godot', 'RPGツクール', '2D', '3D', 'PixelArt', 'VR', 'AR', 'Steam', 'ゲームジャム', 'RPG', 'アクション', 'ホラー', 'パズル', 'シミュレーション', 'FPS', 'ADV', 'オープンワールド', 'ローグライク', '経験者募集', 'プログラマー募集', 'デザイナー募集', '作曲者募集', 'レベルデザイナー募集', 'シナリオライター募集', '3Dモデラー募集', ...COMMON_TAGS],
  app:   ['Android', 'iOS', 'Windows', 'Mac', 'Flutter', 'ReactNative', 'Swift', 'Kotlin', 'React', 'TypeScript', 'Python', 'Firebase', 'WebApp', 'ツールアプリ', 'ゲームアプリ', '個人開発', '生活系', 'SNS', '教育', '健康', 'AI', '業務効率化', 'プログラマー募集', 'デザイナー募集', 'UI/UXデザイナー募集', '企画募集', 'テスター募集', ...COMMON_TAGS],
  site:  ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vue', 'Nextjs', 'Tailwind', 'PHP', 'Laravel', 'WordPress', 'Figma', 'ポートフォリオ', 'LP', '企業サイト', 'ECサイト', 'ブログ', 'SEO', 'フロントエンド', 'バックエンド', 'プログラマー募集', 'デザイナー募集', 'コーダー募集', ...COMMON_TAGS],
  video: ['MV', 'PV', 'アニメーション', 'VFX', '3DCG', 'ショート動画', 'ドキュメンタリー', 'YouTube', 'VTuber', 'AfterEffects', 'PremierePro', 'DaVinciResolve', 'Blender', 'Maya', 'Cinema4D', '編集者募集', 'イラスト募集', '声優募集', '作曲者募集', 'モーションデザイナー募集', '撮影者募集', ...COMMON_TAGS],
};

// 「すべて」は各カテゴリのタグをまとめたもの（重複は除く）
CATEGORY_TAGS.all = [...new Set([
  ...CATEGORY_TAGS.game,
  ...CATEGORY_TAGS.app,
  ...CATEGORY_TAGS.site,
  ...CATEGORY_TAGS.video,
])];

/* ---------------- テスト投稿のテンプレート ----------------
   createTestPosts()（開発・動作確認用）から参照される。 */
const basePosts = [
  {
    category: 'game',
    title: '2Dアクションゲームの共同制作メンバー募集',
    description: 'ドット絵スタイルの2Dアクションゲームを作っています。プログラマー、ドット絵デザイナーを募集中です。未経験の方も歓迎します。',
    tags: ['Unity', '2D', 'PixelArt', '初心者歓迎'],
    daysAgo: 12,
    contact: 'X（旧Twitter）: @pixel_game_dev',
    images: [],
    deadlineDays: 60,
  },
  {
    category: 'app',
    title: 'タスク管理アプリを一緒に開発しませんか',
    description: 'Flutterで作るシンプルなタスク管理アプリです。UI実装が得意な方、一緒に開発を進めてくれる方を探しています。',
    tags: ['Flutter', 'iOS', 'Android', '個人開発'],
    daysAgo: 11,
    contact: 'Discord: taskapp#1234',
    images: [],
    deadlineDays: 45,
  },
  {
    category: 'site',
    title: 'ポートフォリオサイトのデザイン協力者募集',
    description: 'エンジニア向けポートフォリオサイトのテンプレートを作成中です。デザインが得意な方、コーディングを手伝ってくれる方を募集します。',
    tags: ['React', 'ポートフォリオ', 'デザイナー募集'],
    daysAgo: 10,
    contact: 'メール: portfolio.design@example.com',
    images: [],
    deadlineDays: 30,
  },
  {
    category: 'video',
    title: 'ゲーム実況用オープニング映像の制作チーム',
    description: 'YouTube向けのゲーム実況チャンネルのオープニング映像を制作しています。モーショングラフィックスの経験がある方を探しています。',
    tags: ['PV', 'AfterEffects', '編集者募集'],
    daysAgo: 9,
    contact: 'X（旧Twitter）: @op_movie_team',
    images: [],
    deadlineDays: 14,
  },
  {
    category: 'game',
    title: 'ローグライクRPGのレベルデザイナー募集',
    description: 'ダンジョン自動生成のローグライクRPGを開発中です。レベルデザインやバランス調整に興味がある方、ぜひご参加ください。',
    tags: ['Unity', 'RPG', '経験者募集'],
    daysAgo: 8,
    contact: 'Discord: roguelike_dev#5678',
    images: [],
    deadlineDays: 90,
  },
  {
    category: 'app',
    title: '習慣化アプリのUI/UXデザイナーを探しています',
    description: '毎日の習慣を記録できるアプリを開発中です。使いやすいUI/UXを一緒に考えてくれる方を募集しています。',
    tags: ['ReactNative', 'ツールアプリ', '生活系'],
    daysAgo: 7,
    contact: 'メール: habit.app.ux@example.com',
    images: [],
    deadlineDays: 10,
  },
  {
    category: 'site',
    title: '個人ブログのリニューアルを手伝ってくれる人',
    description: 'Vue.jsで作られた個人ブログのリニューアルプロジェクトです。SEO対策やLPの改善に詳しい方を歓迎します。',
    tags: ['WordPress', 'ブログ', 'コーダー募集'],
    daysAgo: 6,
    contact: 'X（旧Twitter）: @blog_renewal',
    images: [],
    deadlineDays: 30,
  },
  {
    category: 'video',
    title: 'ショート動画編集メンバーを募集しています',
    description: 'SNS向けのショート動画を定期的に制作するチームです。撮影や編集スキルを学びながら一緒に活動しませんか。',
    tags: ['編集者募集', 'PV', 'MV'],
    daysAgo: 5,
    contact: 'Discord: shortmovie#4321',
    images: [],
    deadlineDays: 7,
  },
  {
    category: 'game',
    title: '3Dアドベンチャーゲームのプログラマー募集',
    description: 'UnrealEngineを使った3Dアドベンチャーゲームを開発しています。C++またはブループリントが書けるプログラマーを募集します。',
    tags: ['UE5', '3D', 'プログラマー募集'],
    daysAgo: 4,
    contact: 'メール: adv.game.dev@example.com',
    images: [],
    deadlineDays: 60,
  },
  {
    category: 'app',
    title: '英語学習アプリの初期開発メンバーを探してます',
    description: 'スキマ時間で英単語を学習できるアプリを企画中です。初心者の方も大歓迎、一緒に学びながら開発しましょう。',
    tags: ['Flutter', '教育', '個人開発'],
    daysAgo: 3,
    contact: 'X（旧Twitter）: @english_app_dev',
    images: [],
    deadlineDays: 30,
  },
  {
    category: 'video',
    title: '自主制作アニメのBGM・SE担当を募集中',
    description: '個人で制作中の短編アニメーションにBGMや効果音をつけてくれる方を探しています。ジャンルはSFファンタジーです。',
    tags: ['アニメーション', 'Blender', '3DCG'],
    daysAgo: 2,
    contact: 'Discord: anime_bgm#9012',
    images: [],
    deadlineDays: 45,
  },
  {
    category: 'video',
    title: 'MV制作チームのモーションデザイナー募集',
    description: 'ボカロ楽曲のMVを制作するチームです。AfterEffectsやCinema4Dでモーショングラフィックスを作れる方を募集しています。',
    tags: ['MV', 'AfterEffects', 'Cinema4D', 'VFX'],
    daysAgo: 1,
    contact: 'X（旧Twitter）: @mv_motion_team',
    images: [],
    deadlineDays: 60,
  },
  {
    category: 'video',
    title: 'ドキュメンタリー映像の撮影・編集メンバー募集',
    description: '地域の伝統文化を記録するドキュメンタリー映像を制作中です。撮影や編集に興味がある方、一緒に作品を作りませんか。',
    tags: ['PremierePro', '編集者募集', 'PV'],
    daysAgo: 0,
    contact: 'メール: docs.film@example.com',
    images: [],
    deadlineDays: 30,
  },
];

/* ---------------- 状態管理 ---------------- */
const state = {
  allPosts: [],          // 読み込み済みの投稿（無限スクロールで増える）
  lastDoc: null,          // Firestoreページングの続き位置
  currentCategory: 'all',
  tagBarCategory: 'all',
  activeTags: new Set(),
  searchKeyword: '',
  searchIncludeBody: false,
  sortOrder: 'default',
  loading: false,
  loadError: false,
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
let postExistingFiles = [];
let editingPostId = null;
let editingDeadlinePostId = null;
let mySettingsPosts = [];        // マイページ「投稿済み募集」「期限切れ募集」用に取得した自分の全投稿
let mySettingsPostsLoaded = false; // 上記を今回のマイページ表示中に取得済みか
let mySettingsPostsPromise = null; // 取得中のPromise（件数表示と一覧で二重取得しないため）

let pinnedPosts = [];            // マイページ「ピン止め」タブ用に取得した、自分がピン止めした投稿
let pinnedPostsLoaded = false;   // 上記を今回のマイページ表示中に取得済みか
let pinnedPostsPromise = null;   // 同上・取得中のPromise

/* 「投稿済み募集」「期限切れ募集」「ピン止め」は同じ操作（その場で開く）を持つため、
   タブごとの状態と設定をここにまとめ、描画処理を共通化する。
   ピン止めは他ユーザーの投稿も含むため、選択してまとめて削除する機能は持たない。 */
const POST_LIST_VIEWS = {
  myposts: {
    expandedId: null,          // その場に開いている投稿（同時に1件のみ）
    selectMode: false,         // 選択モード（チェックボックスでまとめて削除）中か
    selectedIds: new Set(),    // 選択モード中にチェックされている投稿id
    emptyText: '自分の投稿はありません',
    getPosts: () => mySettingsPosts,
    getEls: () => ({
      list: els.myPostsList,
      selectBtn: els.myPostsSelectBtn,
      bulkBar: els.myPostsBulkBar,
      bulkDeleteBtn: els.myPostsBulkDeleteBtn,
    }),
  },
  expired: {
    expandedId: null,
    selectMode: false,
    selectedIds: new Set(),
    emptyText: '期限切れの募集はありません',
    getPosts: () => mySettingsPosts.filter((post) => isPostExpired(post)),
    getEls: () => ({
      list: els.expiredPostsList,
      selectBtn: els.expiredSelectBtn,
      bulkBar: els.expiredBulkBar,
      bulkDeleteBtn: els.expiredBulkDeleteBtn,
    }),
  },
  pinned: {
    expandedId: null,
    selectMode: false,
    selectedIds: new Set(),
    emptyText: 'ピン止めした投稿はありません',
    detailAction: 'unpin', // 他人の投稿なので、編集ではなくピン止め解除を置く
    getPosts: () => pinnedPosts,
    getEls: () => ({ list: els.pinnedPostsList }),
  },
};

let inboxMessages = [];          // マイページ「メッセージ」タブ用の受信メッセージ
let messagesLoaded = false;      // 上記を今回のマイページ表示中に取得済みか
let publicProfileTargetUid = null;   // 現在開いている他ユーザープロフィールのuid（メッセージ送信先）
let publicProfileTargetName = '';    // 同上・表示名

const CROP_SIZE = 280;    // トリムコンテナのサイズ（px）
const CROP_RADIUS = 120;  // トリム円の半径（px）
const cropState = { scale: 1, minScale: 1, maxScale: 4, tx: 0, ty: 0, dragging: false, lastX: 0, lastY: 0 };

const INITIAL_PAGE_SIZE = 12; // 初回表示件数
const PAGE_SIZE = 16;       // 1回のスクロールで読み込む件数
const ADS_EVERY = 20;       // 何件ごとに広告を挟むか

const MAX_NAME_LENGTH = 20; // 設定画面のname入力欄と同じ上限（index.htmlのmaxlengthと合わせること）

/* ログインプロバイダの表示名は文字数制限が無い/緩いことがあるため、
   サイト内の上限に合わせて切り詰める */
function truncateName(name) {
  return (name || '').trim().slice(0, MAX_NAME_LENGTH);
}

/* =========================================================
   URLの安全確認
   投稿データ（画像・添付ファイル・投稿者アイコン）のURLは、
   他の利用者が自由に書き込める値なので、そのまま使うと
   javascript: などを仕込まれてスクリプトを実行されてしまう。
   表示に使う前に、必ず以下の関数で安全なものだけに絞り込む。
   ========================================================= */

/* リンク（aタグのhref）に使ってよいURLだけを返す。それ以外はnull */
function toSafeLinkUrl(url) {
  if (typeof url !== 'string') return null;
  const trimmed = url.trim();
  return /^https?:\/\/[^\s"'<>]+$/i.test(trimmed) ? trimmed : null;
}

/* 画像の表示に使ってよいURLだけを返す。それ以外はnull。
   Supabaseのhttps URL、アイコンのdata:image、サイト内の相対パスを許可する。
   CSSのurl()にも使うため、引用符・括弧・空白を含むものは弾く。 */
function toSafeImageUrl(url) {
  if (typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (/["'()\s\\]/.test(trimmed)) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^data:image\/(png|jpeg|jpg|gif|webp);base64,[A-Za-z0-9+/=]+$/i.test(trimmed)) return trimmed;
  if (/^[\w.-]+(\/[\w.-]+)*$/.test(trimmed)) return trimmed; // 相対パス（images/ProfileIcon.png など）
  return null;
}

/* 安全な画像URLだけをCSSのbackground-imageに設定する */
function setBackgroundImageSafely(el, url) {
  const safe = toSafeImageUrl(url);
  el.style.backgroundImage = safe ? 'url("' + safe + '")' : '';
}

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
  els.tagScrollHintLeft = document.getElementById('tagScrollHintLeft');
  els.tagScrollHintRight = document.getElementById('tagScrollHintRight');

  els.sidebarCategoryItems = document.querySelectorAll('.category-list-section .category-item');
  els.pulldownItems = document.querySelectorAll('.pulldown-item');

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
  els.menuProfileBtn = document.getElementById('menuProfileBtn');
  els.menuAuthBtn = document.getElementById('menuAuthBtn');
  els.menuInboxBtn = document.getElementById('menuInboxBtn');
  els.menuInboxBadge = document.getElementById('menuInboxBadge');

  els.detailPane = document.getElementById('detailPane');
  els.detailBackBtn = document.getElementById('detailBackBtn');
  els.detailAvatar = document.getElementById('detailAvatar');
  els.detailAuthor = document.getElementById('detailAuthor');
  els.detailMoreMenuWrap = document.getElementById('detailMoreMenuWrap');
  els.detailTitle = document.getElementById('detailTitle');
  els.detailImageBox = document.getElementById('detailImageBox');
  els.detailFiles = document.getElementById('detailFiles');
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

  els.expiredPostsList = document.getElementById('expiredPostsList');
  els.myPostsList = document.getElementById('myPostsList');
  els.myPostsSelectBtn = document.getElementById('myPostsSelectBtn');
  els.myPostsBulkBar = document.getElementById('myPostsBulkBar');
  els.myPostsBulkDeleteBtn = document.getElementById('myPostsBulkDeleteBtn');
  els.expiredSelectBtn = document.getElementById('expiredSelectBtn');
  els.expiredBulkBar = document.getElementById('expiredBulkBar');
  els.expiredBulkDeleteBtn = document.getElementById('expiredBulkDeleteBtn');
  els.myPostsCount = document.getElementById('myPostsCount');
  els.expiredCount = document.getElementById('expiredCount');
  els.pinnedPostsList = document.getElementById('pinnedPostsList');
  els.pinnedCount = document.getElementById('pinnedCount');
  els.menuMyPostsCount = document.getElementById('menuMyPostsCount');
  els.menuExpiredCount = document.getElementById('menuExpiredCount');
  els.menuPinnedCount = document.getElementById('menuPinnedCount');
  els.menuShortcutBtns = document.querySelectorAll('.menu-list-item[data-mypage-tab]');

  els.toast = document.getElementById('toast');

  els.myPageOverlay = document.getElementById('myPageOverlay');
  els.myPagePanel = document.getElementById('myPagePanel');
  els.myPageCloseBtn = document.getElementById('myPageCloseBtn');
  els.myPageNav = document.getElementById('myPageNav');
  els.myPageNavItems = document.querySelectorAll('.mypage-nav-item[data-tab]');
  els.myPageNavIcon = document.getElementById('myPageNavIcon');
  els.myPageTabPanels = document.querySelectorAll('.mypage-tab-panel');
  els.profileAvatar = document.getElementById('profileAvatar');
  els.profileAvatarInput = document.getElementById('profileAvatarInput');
  els.profileAvatarDeleteBtn = document.getElementById('profileAvatarDeleteBtn');
  els.profileNameInput = document.getElementById('profileNameInput');
  els.profileNameEditBtn = document.getElementById('profileNameEditBtn');
  els.profileNameEditInput = document.getElementById('profileNameEditInput');
  els.profileContactDisplay = document.getElementById('profileContactDisplay');
  els.profileBio = document.getElementById('profileBio');
  els.profileLinksContainer = document.getElementById('profileLinks');
  els.profileAddLinkBtn = document.getElementById('profileAddLinkBtn');
  els.myPageLoginSection = document.getElementById('myPageLoginSection');
  els.myPageContent = document.getElementById('myPageContent');
  els.githubLoginBtn = document.getElementById('githubLoginBtn');
  els.twitterLoginBtn = document.getElementById('twitterLoginBtn');
  els.myPageLogoutBtn = document.getElementById('myPageLogoutBtn');
  els.deleteAccountBtn = document.getElementById('deleteAccountBtn');

  els.publicProfileOverlay = document.getElementById('publicProfileOverlay');
  els.publicProfileCloseBtn = document.getElementById('publicProfileCloseBtn');
  els.publicProfileAvatar = document.getElementById('publicProfileAvatar');
  els.publicProfileName = document.getElementById('publicProfileName');
  els.publicProfileContact = document.getElementById('publicProfileContact');
  els.publicProfileBio = document.getElementById('publicProfileBio');
  els.publicProfileLinks = document.getElementById('publicProfileLinks');
  els.publicProfileMessageBtn = document.getElementById('publicProfileMessageBtn');

  els.messagesUnreadBadge = document.getElementById('messagesUnreadBadge');
  els.messagesList = document.getElementById('messagesList');
  els.messageComposeOverlay = document.getElementById('messageComposeOverlay');
  els.messageComposeClose = document.getElementById('messageComposeClose');
  els.messageComposeTitle = document.getElementById('messageComposeTitle');
  els.messageComposeInput = document.getElementById('messageComposeInput');
  els.messageComposeSend = document.getElementById('messageComposeSend');

  els.avatarCropOverlay = document.getElementById('avatarCropOverlay');
  els.avatarCropContainer = document.getElementById('avatarCropContainer');
  els.avatarCropImage = document.getElementById('avatarCropImage');
  els.avatarCropZoom = document.getElementById('avatarCropZoom');
  els.avatarCropCancel = document.getElementById('avatarCropCancel');
  els.avatarCropConfirm = document.getElementById('avatarCropConfirm');
}

/* ---------------- 初期化 ---------------- */
function init() {
  // 最初の投稿を読み込む（非同期。完了まで「読み込み中…」を表示）
  renderPosts();
  loadMorePosts(INITIAL_PAGE_SIZE);

  renderTagList();

  setupCategorySidebar();
  setupSidebarToggle();
  setupPulldown();
  setupSortDropdown();
  setupTagPanelToggle();
  setupTagListEvents();
  setupSelectedTagsDropdown();
  setupPostButton();
  setupSearch();
  setupProfileIcon();
  setupAvatarCrop();
  setupMyPage();
  setupPublicProfile();
  setupMessageCompose();
  applyProfileAvatar();
  setupDetailModal();
  setupPostModal();
  setupInfiniteScroll();
  setupGenericConfirm();
  setupDeadlineEditModal();
  setupFirebase();
  applyLastLoginHints();
}

/* =========================================================
   投稿データ（Firestore連携）
   ========================================================= */

/* Firestoreのドキュメントをアプリのpostオブジェクトへ変換 */
function docToPost(docSnap) {
  const data = docSnap.data();
  const createdAt = data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : new Date();
  return {
    id: docSnap.id,
    category: data.category,
    title: data.title,
    description: data.description,
    tags: data.tags || [],
    date: formatDate(createdAt),
    createdAt: createdAt,
    deadlineDays: data.deadlineDays,
    contact: data.contact || '',
    images: data.images || [],
    files: data.files || [],
    pinnedBy: data.pinnedBy || [],
    closed: !!data.closed,
    edited: !!data.edited,
    authorUid: data.authorUid || null,
    authorName: data.authorName || '名前',
    authorAvatarUrl: data.authorAvatarUrl || 'images/ProfileIcon.png',
  };
}

/* =========================================================
   開発・動作確認用のダミー投稿作成（本番の自動実行はしない）
   ブラウザのコンソールから、実際にログインした状態で以下のように呼び出す。
     createTestPosts(20)   … ログイン中のアカウント名義でテスト投稿を20件作成
     deleteTestPosts()     … 上記で作った「【テスト】」投稿をまとめて削除
   投稿は必ずログイン中の本人名義になる（Firestoreのルール上、
   投稿者なしでの作成は許可していないため）。
   ========================================================= */
async function createTestPosts(count = 20) {
  if (!state.currentUser) {
    console.warn('先にログインしてから実行してください。');
    return;
  }
  const fb = window._firebase;
  for (let i = 0; i < count; i++) {
    const template = basePosts[i % basePosts.length];
    // タイトルは30文字以内という制限があるため、接頭辞・番号を付けても
    // 収まるように元のタイトルを必要な分だけ切り詰める
    const prefix = '【テスト】';
    const suffix = '（' + (i + 1) + '）';
    const maxBodyLen = Math.max(0, 30 - prefix.length - suffix.length);
    const title = prefix + template.title.slice(0, maxBodyLen) + suffix;
    try {
      await fb.addDoc(fb.collection(fb.db, 'posts'), {
        category: template.category,
        title: title,
        description: template.description,
        tags: template.tags.slice(),
        contact: '',
        images: [],
        files: [],
        deadlineDays: template.deadlineDays,
        createdAt: fb.serverTimestamp(),
        pinnedBy: [],
        closed: false,
        authorUid: state.currentUser.uid,
        authorName: state.profile.name || '名前',
        authorAvatarUrl: state.profile.avatarUrl || 'images/ProfileIcon.png',
      });
    } catch (err) {
      console.error((i + 1) + '件目の作成に失敗しました:', err);
      break;
    }
  }
  console.log('テスト投稿の作成が完了しました。ページを再読み込みして確認してください。');
}
window.createTestPosts = createTestPosts;

async function deleteTestPosts() {
  if (!state.currentUser) {
    console.warn('先にログインしてから実行してください。');
    return;
  }
  const fb = window._firebase;
  const snap = await fb.getDocs(fb.query(fb.collection(fb.db, 'posts'), fb.where('authorUid', '==', state.currentUser.uid)));
  const targets = snap.docs.filter((d) => (d.data().title || '').startsWith('【テスト】'));
  for (const d of targets) {
    try {
      await fb.deleteDoc(fb.doc(fb.db, 'posts', d.id));
    } catch (err) {
      console.error(d.id + 'の削除に失敗しました:', err);
    }
  }
  console.log(targets.length + '件のテスト投稿を削除しました。ページを再読み込みして確認してください。');
}
window.deleteTestPosts = deleteTestPosts;

async function loadMorePosts(count = PAGE_SIZE) {
  if (state.loading || state.reachedEnd) return;
  const fb = window._firebase;
  if (!fb) return;

  state.loading = true;
  state.loadError = false;
  try {
    const constraints = [fb.orderBy('createdAt', 'desc'), fb.limit(count)];
    if (state.lastDoc) constraints.push(fb.startAfter(state.lastDoc));
    const q = fb.query(fb.collection(fb.db, 'posts'), ...constraints);
    const snap = await fb.getDocs(q);

    const newPosts = snap.docs.map(docToPost);
    state.allPosts = state.allPosts.concat(newPosts);

    if (snap.docs.length > 0) {
      state.lastDoc = snap.docs[snap.docs.length - 1];
    }
    if (snap.docs.length < count) {
      state.reachedEnd = true;
    }
  } catch (err) {
    console.error('投稿の読み込みに失敗しました:', err);
    state.loadError = true;
    showToast('投稿の読み込みに失敗しました');
  } finally {
    state.loading = false;
    renderPosts();
  }
}

/* =========================================================
   期限判定
   ========================================================= */
function isPostExpired(post) {
  if (post.closed) return true;
  if (!post.createdAt || !post.deadlineDays) return false;
  const deadline = new Date(post.createdAt);
  deadline.setDate(deadline.getDate() + post.deadlineDays);
  return new Date() > deadline;
}

/* ピン止めは投稿ごとの共有フラグではなく、ログインユーザーごとの
   「自分がピン止めしたか」で判定する（post.pinnedByにuidの配列を保持） */
function isPinnedByMe(post) {
  return !!(state.currentUser && post.pinnedBy && post.pinnedBy.includes(state.currentUser.uid));
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

    if (state.currentCategory !== 'all' && post.category !== state.currentCategory) {
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

  updateTagScrollHints();
}

/* タグバーが左右にスクロールできるかどうかに応じて、端の矢印の表示を切り替える */
function updateTagScrollHints() {
  const el = els.tagList;
  const maxScroll = el.scrollWidth - el.clientWidth;
  els.tagScrollHintLeft.classList.toggle('show', el.scrollLeft > 1);
  els.tagScrollHintRight.classList.toggle('show', el.scrollLeft < maxScroll - 1);
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
    // 初回の読み込み中／読み込み失敗時は「該当する投稿がありません」と誤解させないようにする
    if (state.loading && state.allPosts.length === 0) {
      msg.textContent = '読み込み中…';
    } else if (state.loadError && state.allPosts.length === 0) {
      msg.textContent = '投稿の読み込みに失敗しました。時間をおいて再度お試しください。';
    } else {
      msg.textContent = '該当する投稿がありません。';
    }
    els.postsGrid.appendChild(msg);
    fillPostsIfNeeded();
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

  fillPostsIfNeeded();
}

/* カテゴリ・タグなどの絞り込み直後は、表示件数が少なくスクロールバーが
   出ないために無限スクロールが働かないことがある。その場合は自動でもう1ページ
   読み込み、絞り込み条件に合う投稿を切らさないようにする。 */
function fillPostsIfNeeded() {
  if (state.loading || state.reachedEnd) return;
  const el = els.postsPane;
  if (el.clientHeight > 0 && el.scrollHeight <= el.clientHeight + 1) {
    loadMorePosts();
  }
}

/* 投稿後に編集された投稿には、タイトルの横に「編集済み」を添える */
function appendEditedBadge(titleEl, post) {
  if (!post.edited) return;
  const badge = document.createElement('span');
  badge.className = 'post-edited-badge';
  badge.textContent = '編集済み';
  titleEl.appendChild(badge);
}

function createPostCard(post) {
  const card = document.createElement('div');
  card.className = 'post-card ' + (CATEGORY_BORDER_CLASS[post.category] || '');
  card.dataset.id = post.id;

  // ピン止めボタン（カード右上）
  const pinned = isPinnedByMe(post);
  const pinBtn = document.createElement('div');
  pinBtn.className = 'post-pin-btn' + (pinned ? ' pinned' : '');
  pinBtn.textContent = '📌';
  pinBtn.title = pinned ? 'ピン止めを解除' : 'ピン止めする';
  pinBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePin(post, pinBtn);
  });
  card.appendChild(pinBtn);

  // アイコン＋名前（投稿者の情報を表示。クリックでプロフィールを開く）
  const header = document.createElement('div');
  header.className = 'post-header';

  const openAuthorProfile = (e) => {
    e.stopPropagation();
    openPublicProfile(post.authorUid, { name: post.authorName, avatarUrl: post.authorAvatarUrl });
  };

  const avatar = document.createElement('div');
  avatar.className = 'post-avatar';
  if (post.authorUid) avatar.classList.add('clickable');
  setBackgroundImageSafely(avatar, post.authorAvatarUrl);
  avatar.addEventListener('click', openAuthorProfile);
  header.appendChild(avatar);

  const author = document.createElement('span');
  author.className = 'post-author';
  if (post.authorUid) author.classList.add('clickable');
  author.textContent = post.authorName || '名前';
  author.addEventListener('click', openAuthorProfile);
  header.appendChild(author);

  card.appendChild(header);

  // タイトル（太字）
  const title = document.createElement('h3');
  title.className = 'post-title';
  title.textContent = post.title;
  appendEditedBadge(title, post);
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
    if (!post.closed) {
      menu.appendChild(createPostMoreMenuItem('募集を締め切る', false, (e) => {
        e.stopPropagation();
        closeAllPostMenus();
        if (!isOwnPost(post)) {
          closeDetailModal();
          showLoginPrompt();
          return;
        }
        showGenericConfirm('この募集を締め切りますか？', async () => {
          const fb = window._firebase;
          try {
            await fb.updateDoc(fb.doc(fb.db, 'posts', String(post.id)), { closed: true });
            post.closed = true;
            closeDetailModal();
            renderPosts();
            showToast('募集を締め切りました');
          } catch (err) {
            console.error('募集の締め切りに失敗しました:', err);
            showToast('操作に失敗しました');
          }
        });
      }));
    }
    menu.appendChild(createPostMoreMenuItem('削除', true, (e) => {
      e.stopPropagation();
      closeAllPostMenus();
      if (!isOwnPost(post)) {
        closeDetailModal();
        showLoginPrompt();
        return;
      }
      showGenericConfirm('この投稿を削除しますか？', async () => {
        const fb = window._firebase;
        try {
          await fb.deleteDoc(fb.doc(fb.db, 'posts', String(post.id)));
          deletePostFiles(post); // 添付ファイルの削除は結果を待たずベストエフォートで行う
          state.allPosts = state.allPosts.filter((p) => p.id !== post.id);
          mySettingsPosts = mySettingsPosts.filter((p) => p.id !== post.id);
          pinnedPosts = pinnedPosts.filter((p) => p.id !== post.id);
          closeDetailModal();
          renderPosts();
          renderMyPosts();
          renderExpiredPosts();
          renderPinnedPosts();
          updatePostCounts();
          showToast('投稿を削除しました');
        } catch (err) {
          console.error('投稿の削除に失敗しました:', err);
          showToast('削除に失敗しました');
        }
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
  // 広告(ad.html)はloper本体とは別ドメイン（loper-ads）に置いている。
  // allow-same-originを付けても、それは広告用ドメイン自身の
  // Cookie等にアクセスできるだけで、loper本体のログイン情報などには
  // 一切触れられない。別ドメインに分離しているからこそ安全に付けられる。
  iframe.sandbox = 'allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin';
  iframe.src = 'https://11kawauso.github.io/loper-ads/ad.html';

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
  default: 'デフォルト',
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
    case 'newest':
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'oldest':
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    case 'deadline_long':
      sorted.sort((a, b) => (getPostDeadline(b) || 0) - (getPostDeadline(a) || 0));
      break;
    case 'deadline_short':
      sorted.sort((a, b) => (getPostDeadline(a) || 0) - (getPostDeadline(b) || 0));
      break;
    case 'default':
    default:
      // 並び替えをせず、取得した順のまま返す
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

  // 左右端の矢印クリックでタグバーをスクロール
  els.tagScrollHintLeft.addEventListener('click', () => {
    els.tagList.scrollLeft -= 160;
    updateTagScrollHints();
  });
  els.tagScrollHintRight.addEventListener('click', () => {
    els.tagList.scrollLeft += 160;
    updateTagScrollHints();
  });

  // スクロール位置が変わるたびに矢印の表示・非表示を更新
  els.tagList.addEventListener('scroll', updateTagScrollHints);

  // マウスホイールで横スクロール
  els.tagList.addEventListener('wheel', (e) => {
    if (e.deltaY !== 0) {
      e.preventDefault();
      els.tagList.scrollLeft += e.deltaY;
      updateTagScrollHints();
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
    updateTagScrollHints();
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

  // 画面幅が変わってスクロール可否が変わる場合にも矢印を更新
  window.addEventListener('resize', updateTagScrollHints);
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
async function togglePin(post, btnEl) {
  if (!state.currentUser) {
    showLoginPrompt();
    return;
  }
  const fb = window._firebase;
  const uid = state.currentUser.uid;
  const wasPinned = isPinnedByMe(post);
  const nowPinned = !wasPinned;

  // 楽観的にUIを先に更新する
  post.pinnedBy = post.pinnedBy || [];
  post.pinnedBy = nowPinned
    ? [...post.pinnedBy, uid]
    : post.pinnedBy.filter((id) => id !== uid);

  applyPinButtonState(post, btnEl);

  try {
    await fb.updateDoc(fb.doc(fb.db, 'posts', String(post.id)), {
      pinnedBy: nowPinned ? fb.arrayUnion(uid) : fb.arrayRemove(uid),
    });
  } catch (err) {
    console.error('ピン止めの更新に失敗しました:', err);
    // 失敗したら表示を元に戻す
    post.pinnedBy = wasPinned
      ? [...post.pinnedBy, uid]
      : post.pinnedBy.filter((id) => id !== uid);
    applyPinButtonState(post, btnEl);
    showToast('ピン止めの更新に失敗しました');
  }
}

/* ピンボタン・一覧・詳細画面の表示をpost.pinnedByの現在値に合わせて更新する */
function applyPinButtonState(post, btnEl) {
  const pinned = isPinnedByMe(post);

  // カード上のピンアイコンの表示を更新
  const card = els.postsGrid.querySelector('.post-card[data-id="' + post.id + '"]');
  const pinBtn = btnEl || (card ? card.querySelector('.post-pin-btn') : null);
  if (pinBtn) {
    pinBtn.classList.toggle('pinned', pinned);
    pinBtn.title = pinned ? 'ピン止めを解除' : 'ピン止めする';

    // ピンを付けるときにアニメーションを表示
    if (pinned) {
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
/* 検索実行後、次に検索欄をクリックしたときに全選択するためのフラグ */
let searchSelectAllPending = false;

function setupSearch() {
  els.searchBtn.addEventListener('click', () => runSearch());
  els.searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      runSearch();
    }
  });

  // 検索バーにフォーカスしたらオプションパネルを表示
  // 入力済みの文字があれば全選択する（Tabキーでのフォーカス用）
  els.searchInput.addEventListener('focus', () => {
    els.searchOptionsPanel.classList.add('open');
    if (els.searchInput.value) els.searchInput.select();
  });

  // マウスクリックの場合、focus時のselectはmouseupで解除されてしまうため、
  // click時点で改めて全選択する。対象は次の2パターン：
  //   1. フォーカスが無い状態からのクリック
  //   2. 検索実行後（キーワード確定後）の最初のクリック
  // （それ以外のフォーカス済み欄のクリックは通常どおりカーソル移動できる）
  let selectAllOnClick = false;
  els.searchInput.addEventListener('pointerdown', () => {
    selectAllOnClick = document.activeElement !== els.searchInput || searchSelectAllPending;
  });
  els.searchInput.addEventListener('click', () => {
    if (selectAllOnClick && els.searchInput.value) {
      els.searchInput.select();
    }
    selectAllOnClick = false;
    searchSelectAllPending = false;
  });

  // 検索後に入力を続けた場合は「次クリックで全選択」を解除する
  els.searchInput.addEventListener('input', () => {
    searchSelectAllPending = false;

    // 検索バーが空になったら検索を解除し、元の投稿一覧に戻す
    if (els.searchInput.value.trim() === '' && state.searchKeyword) {
      state.searchKeyword = '';
      renderPosts();
      els.postsPane.scrollTop = 0;
    }
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
  searchSelectAllPending = !!keyword;

  if (keyword) {
    els.sidebarCategoryItems.forEach((item) => item.classList.remove('active'));
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
  const safe = toSafeImageUrl(src);
  if (!safe) return;
  els.lightboxImage.src = safe;
  els.lightboxOverlay.classList.add('show');
}

/* 投稿の画像サムネイルを指定の入れ物に並べる（投稿詳細・マイページで共通）。
   不正なURLを除外した結果0枚になることもあるため、実際の件数で表示を切り替える。 */
function fillPostImageBox(box, post) {
  (post.images || []).forEach((src) => {
    const safeSrc = toSafeImageUrl(src);
    if (!safeSrc) return;
    const img = document.createElement('img');
    img.src = safeSrc;
    img.className = 'modal-thumbnail';
    img.alt = '';
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(safeSrc);
    });
    box.appendChild(img);
  });
  box.classList.toggle('has-image', box.childElementCount > 0);
  return box.childElementCount > 0;
}

/* 投稿の添付ファイルのリンクを指定の入れ物に並べる（投稿詳細・マイページで共通） */
function fillPostFileList(box, post) {
  (post.files || []).forEach((file) => {
    const safeUrl = toSafeLinkUrl(file && file.url);
    if (!safeUrl) return;
    const link = document.createElement('a');
    link.className = 'detail-file-link';
    link.href = safeUrl;
    link.download = file.name;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = '📄 ' + file.name;
    link.addEventListener('click', (e) => e.stopPropagation());
    box.appendChild(link);
  });
  box.classList.toggle('has-files', box.childElementCount > 0);
  return box.childElementCount > 0;
}

/* マイページの展開表示用に、画像・添付ファイルの入れ物ごと作る（無ければnull） */
function createPostImageBox(post) {
  const box = document.createElement('div');
  box.className = 'modal-image-box';
  return fillPostImageBox(box, post) ? box : null;
}

function createPostFileList(post) {
  const box = document.createElement('div');
  box.className = 'detail-files';
  return fillPostFileList(box, post) ? box : null;
}

function openDetailModal(post) {
  els.detailPane.dataset.postId = String(post.id);

  // カテゴリに応じたページ上部の配色（ゲーム=青／アプリ=紫／サイト=茶色／映像=白）
  els.detailPane.className = 'content-pane detail-pane ' + (CATEGORY_BORDER_CLASS[post.category] || '');

  // アイコン・名前（投稿者の情報。クリックでプロフィールを開く）
  setBackgroundImageSafely(els.detailAvatar, post.authorAvatarUrl);
  els.detailAuthor.textContent = post.authorName || '名前';
  const openAuthorProfile = () => {
    openPublicProfile(post.authorUid, { name: post.authorName, avatarUrl: post.authorAvatarUrl });
  };
  els.detailAvatar.onclick = post.authorUid ? openAuthorProfile : null;
  els.detailAuthor.onclick = post.authorUid ? openAuthorProfile : null;
  els.detailAvatar.classList.toggle('clickable', !!post.authorUid);
  els.detailAuthor.classList.toggle('clickable', !!post.authorUid);

  els.detailMoreMenuWrap.innerHTML = '';
  els.detailMoreMenuWrap.appendChild(createPostMoreMenu(post));

  els.detailTitle.textContent = post.title;
  appendEditedBadge(els.detailTitle, post);

  // 画像（サムネイル一覧。クリックでライトボックス）
  els.detailImageBox.innerHTML = '';
  fillPostImageBox(els.detailImageBox, post);

  // 添付ファイル（クリックでダウンロード）
  els.detailFiles.innerHTML = '';
  fillPostFileList(els.detailFiles, post);

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
  const pinned = isPinnedByMe(post);
  const label = pinned ? 'ピン止めを解除する' : 'ピン止めする';
  els.detailPinBtn.title = label;
  els.detailPinBtn.setAttribute('aria-label', label);
  els.detailPinBtn.classList.toggle('pinned', pinned);
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
    if (restorePostDraft()) {
      showToast('下書きを復元しました');
    }
    els.postModalTitle.textContent = '投稿を作成';
    els.postSubmitBtn.textContent = '投稿する';
    els.postDeadlineGroup.style.display = '';
    els.postModalOverlay.classList.add('show');
  });
}

/* =========================================================
   投稿の下書き（新規投稿のみ。localStorageに保存）
   ========================================================= */
const POST_DRAFT_KEY = 'loper_postDraft';

function savePostDraft() {
  if (editingPostId !== null) return; // 編集モードは下書き対象外
  const draft = {
    title: els.postTitleInput.value,
    category: els.postCategoryInput.value,
    description: els.postDescInput.value,
    contact: els.postContactInput.value,
    freeTags: els.postTagsInput.value,
    selectedTags: [...postSelectedTags],
    deadline: els.postDeadlineInput.value,
  };
  const hasContent = draft.title.trim() || draft.description.trim() || draft.contact.trim()
    || draft.freeTags.trim() || draft.selectedTags.length > 0;
  try {
    if (hasContent) {
      localStorage.setItem(POST_DRAFT_KEY, JSON.stringify(draft));
    } else {
      localStorage.removeItem(POST_DRAFT_KEY);
    }
  } catch (err) { /* localStorageが使えない環境では何もしない */ }
}

/* 下書きがあればフォームへ反映して true を返す */
function restorePostDraft() {
  let draft = null;
  try {
    draft = JSON.parse(localStorage.getItem(POST_DRAFT_KEY));
  } catch (err) { /* 壊れた下書きは無視 */ }
  if (!draft) return false;

  els.postTitleInput.value = draft.title || '';
  els.postTitleInput.dispatchEvent(new Event('input'));
  els.postCategoryInput.value = draft.category || 'game';
  updatePostModalBorder();
  els.postDescInput.value = draft.description || '';
  els.postDescInput.dispatchEvent(new Event('input'));
  els.postContactInput.value = draft.contact || '';
  els.postTagsInput.value = draft.freeTags || '';
  postSelectedTags = new Set(draft.selectedTags || []);
  renderPostTagSelector();
  if (draft.deadline) els.postDeadlineInput.value = draft.deadline;
  return true;
}

function clearPostDraft() {
  try {
    localStorage.removeItem(POST_DRAFT_KEY);
  } catch (err) { /* noop */ }
}

/* フォームを新規投稿用の初期状態にリセット */
function resetPostForm() {
  editingPostId = null;
  els.postForm.reset();
  els.postSubmitBtn.disabled = false;
  postSelectedTags = new Set();
  postSelectedFiles = [];
  postExistingImages = [];
  postExistingFiles = [];
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
  postExistingFiles = (post.files || []).slice();
  updateImagePreviews();
  updateFileInputDisplay();

  els.postModalTitle.textContent = '投稿を編集';
  els.postSubmitBtn.textContent = '更新する';
  els.postDeadlineGroup.style.display = 'none';

  els.postModalOverlay.classList.add('show');
}

/* =========================================================
   投稿の画像・添付ファイル（Supabase Storage）
   ※ Firebaseの無料プラン（Spark）ではStorageの利用にカード登録が
     必要なため、ファイル保存だけSupabase Storageを使っている。
     認証・投稿データはこれまで通りFirebase（Auth / Firestore）。
   ========================================================= */
const SUPABASE_STORAGE_BUCKET = 'posts';

/* Supabase Storageの保存キーに使える拡張子だけを取り出す（日本語・記号等は除外） */
function getSafeFileExtension(name) {
  const m = /\.([a-zA-Z0-9]{1,10})$/.exec(name || '');
  return m ? '.' + m[1].toLowerCase() : '';
}

/* ファイルをSupabase Storageにアップロードし、公開URLを返す。
   保存キーには元のファイル名を含めない（日本語や全角スペースが入っていると
   Supabase側で「Invalid key」エラーになるため）。元のファイル名は
   Firestore側のfiles[].nameに保存し、表示・ダウンロード名に使う。 */
async function uploadPostFile(file, uid) {
  const sb = window._supabase;
  const ext = getSafeFileExtension(file.name);
  const path = uid + '/' + Date.now() + '_' + Math.random().toString(36).slice(2) + ext;
  const { error } = await sb.storage.from(SUPABASE_STORAGE_BUCKET).upload(path, file);
  if (error) throw error;
  const { data } = sb.storage.from(SUPABASE_STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/* Supabaseの公開URLから、削除に必要なストレージ内パスを取り出す */
function supabasePathFromUrl(url) {
  const marker = '/object/public/' + SUPABASE_STORAGE_BUCKET + '/';
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}

/* 投稿削除時、添付されていた画像・ファイルもStorageから消せるなら消す。
   削除対象は投稿者本人のフォルダ配下のみ。投稿データに他人のファイルのURLを
   紛れ込ませて、投稿削除に便乗して消させる、という手口を防ぐ。

   なお、公開キーによる一括削除を防ぐためStorage側で削除を禁止している場合は
   ここでの削除は失敗する（想定内）。その場合ファイルはStorageに残るため、
   容量が気になってきたらSupabaseの画面から手動で整理する。 */
async function deletePostFiles(post) {
  const sb = window._supabase;
  const ownerPrefix = post.authorUid ? post.authorUid + '/' : null;
  if (!ownerPrefix) return;

  const urls = [...(post.images || []), ...(post.files || []).map((f) => f && f.url)];
  const paths = urls
    .map((url) => (typeof url === 'string' ? supabasePathFromUrl(url) : null))
    .filter((p) => p !== null && p.startsWith(ownerPrefix));
  if (paths.length === 0) return;

  try {
    const { error } = await sb.storage.from(SUPABASE_STORAGE_BUCKET).remove(paths);
    if (error) console.info('添付ファイルはStorageに残ります:', error.message);
  } catch (err) {
    console.info('添付ファイルはStorageに残ります:', err);
  }
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
  els.postModalClose.addEventListener('click', () => {
    savePostDraft();
    closePostModal();
  });
  els.postModalOverlay.addEventListener('click', (e) => {
    if (e.target === els.postModalOverlay) {
      savePostDraft();
      closePostModal();
    }
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

  // 画像・ファイル選択
  els.postImageInput.addEventListener('change', (e) => {
    const newFiles = [...e.target.files];
    const remaining = 4 - (postExistingImages.length + postExistingFiles.length + postSelectedFiles.length);
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

  els.postForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!state.currentUser) {
      showLoginPrompt();
      return;
    }

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
    const isEditing = editingPostId !== null;

    const finishSaving = async (newImages, newFiles) => {
      const fb = window._firebase;
      const images = [...postExistingImages, ...newImages].slice(0, 4);
      const files = [...postExistingFiles, ...newFiles].slice(0, 4);
      const tagsToSave = tags.length > 0 ? tags : ['未設定'];

      if (isEditing) {
        const postId = editingPostId;
        await fb.updateDoc(fb.doc(fb.db, 'posts', String(postId)), {
          category, title, description, tags: tagsToSave, contact, images, files,
          edited: true,
        });

        // 一覧・マイページの双方が同じ投稿を保持しているため、両方に反映する
        [state.allPosts, mySettingsPosts].forEach((list) => {
          const post = list.find((p) => p.id === postId);
          if (!post) return;
          post.category = category;
          post.title = title;
          post.description = description;
          post.tags = tagsToSave;
          post.contact = contact;
          post.images = images;
          post.files = files;
          post.edited = true;
        });
        editingPostId = null;
        renderPosts();
        renderMyPosts();
        renderExpiredPosts();
        closePostModal();
        showToast('投稿を更新しました');
        return;
      }

      const deadlineDays = Math.min(365, Math.max(1, parseInt(els.postDeadlineInput.value) || 30));
      const docData = {
        category, title, description, tags: tagsToSave, contact, images, files,
        deadlineDays,
        createdAt: fb.serverTimestamp(),
        pinnedBy: [],
        closed: false,
        edited: false,
        authorUid: state.currentUser.uid,
        authorName: state.profile.name || '名前',
        authorAvatarUrl: state.profile.avatarUrl || 'images/ProfileIcon.png',
      };
      const docRef = await fb.addDoc(fb.collection(fb.db, 'posts'), docData);

      const newPost = {
        id: docRef.id,
        category, title, description, tags: tagsToSave, contact, images, files,
        date: formatDate(new Date()),
        createdAt: new Date(),
        deadlineDays,
        pinnedBy: [],
        closed: false,
        edited: false,
        authorUid: docData.authorUid,
        authorName: docData.authorName,
        authorAvatarUrl: docData.authorAvatarUrl,
      };

      state.allPosts.unshift(newPost);

      selectCategory('all');

      clearPostDraft();
      closePostModal();
      showToast('投稿を作成しました');
    };

    const remainingSlots = Math.max(0, 4 - postExistingImages.length - postExistingFiles.length);
    const selected = postSelectedFiles.slice(0, remainingSlots);
    const imageFiles = selected.filter((f) => f.type && f.type.startsWith('image/'));
    const otherFiles = selected.filter((f) => !(f.type && f.type.startsWith('image/')));

    const uid = state.currentUser.uid;
    els.postSubmitBtn.disabled = true;
    els.postSubmitBtn.textContent = isEditing ? '更新中…' : '投稿中…';

    try {
      const [images, files] = await Promise.all([
        Promise.all(imageFiles.map((f) => uploadPostFile(f, uid))),
        Promise.all(otherFiles.map(async (f) => ({ name: f.name, url: await uploadPostFile(f, uid) }))),
      ]);
      await finishSaving(images, files);
    } catch (err) {
      console.error('投稿の保存に失敗しました:', err);
      showToast('投稿に失敗しました。もう一度お試しください');
      els.postSubmitBtn.disabled = false;
      els.postSubmitBtn.textContent = isEditing ? '更新する' : '投稿する';
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
  const count = postExistingImages.length + postExistingFiles.length + postSelectedFiles.length;
  if (count === 0) {
    els.fileInputDisplay.textContent = 'ファイルが選択されていません';
    els.fileInputDisplay.setAttribute('for', 'postImageInput');
  } else if (count >= 4) {
    els.fileInputDisplay.textContent = '4件選択中（上限）';
    els.fileInputDisplay.removeAttribute('for');
  } else {
    els.fileInputDisplay.textContent = count + '件選択中（クリックで追加）';
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

  postExistingFiles.forEach((file, i) => {
    const item = createFilePreviewItem(file.name, () => {
      postExistingFiles.splice(i, 1);
      updateImagePreviews();
      updateFileInputDisplay();
    });
    els.imagePreviewContainer.appendChild(item);
  });

  postSelectedFiles.forEach((file, i) => {
    const removeFile = () => {
      postSelectedFiles.splice(i, 1);
      updateImagePreviews();
      updateFileInputDisplay();
    };

    // 画像以外のファイルはファイル名のプレビューを表示
    if (!(file.type && file.type.startsWith('image/'))) {
      els.imagePreviewContainer.appendChild(createFilePreviewItem(file.name, removeFile));
      return;
    }

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
    removeBtn.addEventListener('click', removeFile);

    item.appendChild(img);
    item.appendChild(removeBtn);
    els.imagePreviewContainer.appendChild(item);
  });
}

/* 画像以外のファイル用のプレビュー要素を作成 */
function createFilePreviewItem(name, onRemove) {
  const item = document.createElement('div');
  item.className = 'image-preview-item';

  const box = document.createElement('div');
  box.className = 'file-preview-box';

  const icon = document.createElement('span');
  icon.className = 'file-preview-icon';
  icon.textContent = '📄';

  const label = document.createElement('span');
  label.className = 'file-preview-name';
  label.textContent = name;
  label.title = name;

  box.appendChild(icon);
  box.appendChild(label);

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'image-preview-remove';
  removeBtn.textContent = '×';
  removeBtn.addEventListener('click', onRemove);

  item.appendChild(box);
  item.appendChild(removeBtn);
  return item;
}

/* =========================================================
   プロフィールアイコン・マイページ
   ========================================================= */
function setupProfileIcon() {
  els.hamburgerBtn.addEventListener('click', () => openMenu());
  els.menuCloseBtn.addEventListener('click', () => closeMenu());
  els.menuOverlay.addEventListener('click', (e) => {
    if (e.target === els.menuOverlay) closeMenu();
  });
  els.menuProfileArea.addEventListener('click', openMyPageFromMenu);
  els.menuProfileBtn.addEventListener('click', openMyPageFromMenu);
  els.menuInboxBtn.addEventListener('click', openMessagesFromMenu);

  // マイページ各タブへのショートカット
  els.menuShortcutBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      openMyPageTabFromMenu(btn.dataset.mypageTab, 'マイページを利用するにはログインしてください');
    });
  });
  els.menuAuthBtn.addEventListener('click', () => {
    if (state.currentUser) {
      showLogoutConfirm();
    } else {
      closeMenu();
      showLoginPrompt('ログイン方法を選択してください');
    }
  });
}

// メニューからマイページへ（未ログイン時はログインを促す）
function openMyPageFromMenu() {
  if (!state.currentUser) {
    showLoginPrompt('プロフィールを利用するにはログインしてください');
    return;
  }
  closeMenu();
  openMyPage();
}

// メニューからメッセージタブへ直接ジャンプする（未ログイン時はログインを促す）
function openMessagesFromMenu() {
  openMyPageTabFromMenu('messages', 'メッセージを利用するにはログインしてください');
}

/* メニュー画面のショートカットから、マイページの該当タブを直接開く */
function openMyPageTabFromMenu(tab, loginMessage) {
  if (!state.currentUser) {
    showLoginPrompt(loginMessage);
    return;
  }
  closeMenu();
  openMyPage(tab);
}

function openMenu() {
  applyMenuProfile();
  checkUnreadMessages();
  // ショートカットに件数を出すため、開いたタイミングで取得しておく
  updatePostCounts();
  if (state.currentUser) {
    ensureMySettingsPosts();
    ensurePinnedPosts();
  }
  els.menuOverlay.classList.add('show');
}

function closeMenu() {
  els.menuOverlay.classList.remove('show');
}

function applyMenuProfile() {
  setBackgroundImageSafely(els.menuProfileIcon, state.profile.avatarUrl);
  els.menuProfileName.textContent = state.profile.name || '名前';
  els.menuAuthBtn.textContent = state.currentUser ? 'ログアウト' : 'ログイン';
}

function openMyPage(tab = 'profile') {
  // 開くたびに投稿一覧・ピン止め・メッセージは再取得させる
  mySettingsPostsLoaded = false;
  mySettingsPostsPromise = null;
  pinnedPostsLoaded = false;
  pinnedPostsPromise = null;
  messagesLoaded = false;
  resetPostListView('myposts');
  resetPostListView('expired');
  resetPostListView('pinned');
  activateMyPageTab(tab);
  checkUnreadMessages();
  // 左メニューに件数を出すため、タブを開く前に取得を始めておく
  updatePostCounts();
  if (state.currentUser) {
    ensureMySettingsPosts();
    ensurePinnedPosts();
  }
  els.myPageOverlay.classList.add('show');
}

function closeMyPage() {
  els.myPageOverlay.classList.remove('show');
}

/* 左メニューで選ばれたタブの内容だけを表示する。
   投稿一覧のタブは、開いたタイミングで初回だけFirestoreから取得する。 */
async function activateMyPageTab(tab) {
  els.myPageNavItems.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  els.myPageTabPanels.forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.tabPanel === tab);
  });

  if (tab === 'myposts' || tab === 'expired') {
    if (!mySettingsPostsLoaded) {
      els.myPostsList.innerHTML = '<div class="expired-posts-empty">読み込み中…</div>';
      els.expiredPostsList.innerHTML = '<div class="expired-posts-empty">読み込み中…</div>';
      await ensureMySettingsPosts();
    }
    renderMyPosts();
    renderExpiredPosts();
  }

  if (tab === 'pinned') {
    if (!pinnedPostsLoaded) {
      els.pinnedPostsList.innerHTML = '<div class="expired-posts-empty">読み込み中…</div>';
      await ensurePinnedPosts();
    }
    renderPinnedPosts();
  }

  if (tab === 'messages') {
    if (!messagesLoaded) {
      els.messagesList.innerHTML = '<div class="expired-posts-empty">読み込み中…</div>';
      await loadInboxMessages();
      messagesLoaded = true;
    }
    renderInboxMessages();
    markInboxMessagesRead();
  }
}

function applyProfileAvatar() {
  setBackgroundImageSafely(els.profileAvatar, state.profile.avatarUrl);
  setBackgroundImageSafely(els.menuProfileIcon, state.profile.avatarUrl);
  setBackgroundImageSafely(els.myPageNavIcon, state.profile.avatarUrl);
  els.menuProfileName.textContent = state.profile.name || '名前';
}

/* =========================================================
   投稿者のプロフィール閲覧（他ユーザー・閲覧専用）
   ========================================================= */
function setupPublicProfile() {
  els.publicProfileCloseBtn.addEventListener('click', closePublicProfile);
  els.publicProfileOverlay.addEventListener('click', (e) => {
    if (e.target === els.publicProfileOverlay) closePublicProfile();
  });

  els.publicProfileMessageBtn.addEventListener('click', () => {
    if (!state.currentUser) {
      showLoginPrompt('メッセージを送るにはログインしてください');
      return;
    }
    openMessageCompose(publicProfileTargetUid, publicProfileTargetName);
  });
}

/* uidの投稿者プロフィールを開く。fallbackには投稿に複製されている
   名前・アイコンを渡すことで、Firestoreの応答を待たずに先に表示できる。 */
async function openPublicProfile(uid, fallback) {
  if (!uid) return; // 運営名義の投稿など、投稿者が存在しない場合は開かない

  publicProfileTargetUid = uid;
  const isOwnProfile = state.currentUser && uid === state.currentUser.uid;
  els.publicProfileMessageBtn.style.display = isOwnProfile ? 'none' : '';

  els.publicProfileOverlay.classList.add('show');
  renderPublicProfile({
    name: fallback && fallback.name,
    avatarUrl: fallback && fallback.avatarUrl,
    bio: '',
    contact: '',
    links: [],
  });

  const fb = window._firebase;
  if (!fb) return;
  try {
    const snap = await fb.getDoc(fb.doc(fb.db, 'publicProfiles', uid));
    if (snap.exists() && els.publicProfileOverlay.classList.contains('show')) {
      renderPublicProfile(snap.data());
    }
  } catch (err) {
    console.error('プロフィールの取得に失敗しました:', err);
  }
}

function renderPublicProfile(data) {
  setBackgroundImageSafely(els.publicProfileAvatar, data.avatarUrl);
  publicProfileTargetName = truncateName(data.name) || '名前';
  els.publicProfileName.textContent = publicProfileTargetName;
  els.publicProfileContact.textContent = data.contact || '';

  els.publicProfileBio.textContent = data.bio || '';

  els.publicProfileLinks.innerHTML = '';
  (data.links || []).forEach((url) => {
    const safe = toSafeLinkUrl(url);
    if (!safe) return;
    const a = document.createElement('a');
    a.className = 'public-profile-link';
    a.href = safe;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = safe;
    els.publicProfileLinks.appendChild(a);
  });
}

/* =========================================================
   メッセージ（一方通行・ユーザー間のやり取り）
   ========================================================= */
function setupMessageCompose() {
  els.messageComposeClose.addEventListener('click', closeMessageCompose);
  els.messageComposeOverlay.addEventListener('click', (e) => {
    if (e.target === els.messageComposeOverlay) closeMessageCompose();
  });
  els.messageComposeSend.addEventListener('click', sendMessage);
}

function openMessageCompose(toUid, toName) {
  if (!toUid) return;
  els.messageComposeInput.value = '';
  els.messageComposeTitle.textContent = (toName || '名前') + 'さんにメッセージを送る';
  els.messageComposeOverlay.classList.add('show');
}

function closeMessageCompose() {
  els.messageComposeOverlay.classList.remove('show');
}

async function sendMessage() {
  const fb = window._firebase;
  if (!fb || !state.currentUser || !publicProfileTargetUid) return;

  const body = els.messageComposeInput.value.trim();
  if (!body) return;

  els.messageComposeSend.disabled = true;
  try {
    await fb.addDoc(fb.collection(fb.db, 'messages'), {
      fromUid: state.currentUser.uid,
      fromName: state.profile.name || '名前',
      fromAvatarUrl: state.profile.avatarUrl || 'images/ProfileIcon.png',
      toUid: publicProfileTargetUid,
      body,
      read: false,
      createdAt: fb.serverTimestamp(),
    });
    showToast('メッセージを送信しました');
    closeMessageCompose();
  } catch (err) {
    console.error('メッセージの送信に失敗しました:', err);
    showToast('送信に失敗しました');
  } finally {
    els.messageComposeSend.disabled = false;
  }
}

/* 受信メッセージ一覧を取得する（マイページ「メッセージ」タブ表示時） */
async function loadInboxMessages() {
  if (!state.currentUser) {
    inboxMessages = [];
    return;
  }
  const fb = window._firebase;
  try {
    const q = fb.query(fb.collection(fb.db, 'messages'), fb.where('toUid', '==', state.currentUser.uid), fb.limit(200));
    const snap = await fb.getDocs(q);
    inboxMessages = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (b.createdAt ? b.createdAt.toMillis() : 0) - (a.createdAt ? a.createdAt.toMillis() : 0));
  } catch (err) {
    console.error('メッセージの取得に失敗しました:', err);
    inboxMessages = [];
  }
}

function renderInboxMessages() {
  els.messagesList.innerHTML = '';

  if (inboxMessages.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'expired-posts-empty';
    empty.textContent = 'メッセージはまだありません';
    els.messagesList.appendChild(empty);
    return;
  }

  inboxMessages.forEach((msg) => {
    const item = document.createElement('div');
    item.className = 'message-item' + (msg.read ? '' : ' unread');

    const avatar = document.createElement('div');
    avatar.className = 'message-item-avatar';
    setBackgroundImageSafely(avatar, msg.fromAvatarUrl);

    const info = document.createElement('div');
    info.className = 'message-item-info';

    const head = document.createElement('div');
    head.className = 'message-item-head';

    const name = document.createElement('span');
    name.className = 'message-item-name';
    name.textContent = truncateName(msg.fromName) || '名前';
    head.appendChild(name);

    if (!msg.read) {
      const dot = document.createElement('span');
      dot.className = 'message-item-unread-dot';
      head.appendChild(dot);
    }

    const body = document.createElement('div');
    body.className = 'message-item-body';
    body.textContent = msg.body || '';

    info.appendChild(head);
    info.appendChild(body);
    item.appendChild(avatar);
    item.appendChild(info);
    els.messagesList.appendChild(item);
  });
}

/* 未読メッセージの赤丸バッジ（メニューの受信ボタン・マイページのメッセージタブ）をまとめて切り替える */
function setUnreadBadgeVisible(visible) {
  els.messagesUnreadBadge.style.display = visible ? '' : 'none';
  els.menuInboxBadge.style.display = visible ? '' : 'none';
}

/* メッセージタブを開いたタイミングで、未読メッセージをまとめて既読にする */
async function markInboxMessagesRead() {
  const fb = window._firebase;
  const unread = inboxMessages.filter((m) => !m.read);
  if (!fb || unread.length === 0) return;

  unread.forEach((m) => { m.read = true; });
  setUnreadBadgeVisible(false);

  for (const m of unread) {
    try {
      await fb.updateDoc(fb.doc(fb.db, 'messages', m.id), { read: true });
    } catch (err) {
      console.error('既読への更新に失敗しました:', err);
    }
  }
}

/* マイページ・メニューを開いたタイミングで、未読メッセージの有無だけ軽く確認する */
async function checkUnreadMessages() {
  if (!state.currentUser) {
    setUnreadBadgeVisible(false);
    return;
  }
  const fb = window._firebase;
  try {
    const q = fb.query(
      fb.collection(fb.db, 'messages'),
      fb.where('toUid', '==', state.currentUser.uid),
      fb.where('read', '==', false),
      fb.limit(1)
    );
    const snap = await fb.getDocs(q);
    setUnreadBadgeVisible(!snap.empty);
  } catch (err) {
    console.error('未読メッセージの確認に失敗しました:', err);
  }
}

function closePublicProfile() {
  els.publicProfileOverlay.classList.remove('show');
}

function setupMyPage() {
  // ×ボタンでメニュー画面へ戻る
  els.myPageCloseBtn.addEventListener('click', () => {
    closeMyPage();
    openMenu();
  });
  // 背景クリックで一気にメイン画面へ戻る
  els.myPageOverlay.addEventListener('click', (e) => {
    if (e.target === els.myPageOverlay) closeMyPage();
  });

  // 左メニューでのタブ切り替え
  els.myPageNavItems.forEach((btn) => {
    btn.addEventListener('click', () => activateMyPageTab(btn.dataset.tab));
  });

  // アイコンクリックでファイル選択 → トリムモーダルへ
  els.profileAvatar.addEventListener('click', () => {
    els.profileAvatarInput.click();
  });

  // バツボタンで削除確認モーダルを表示
  els.profileAvatarDeleteBtn.addEventListener('click', () => {
    showIconDeleteConfirm();
  });

  // 名前編集（鉛筆アイコンで入力欄に切り替え）
  els.profileNameEditBtn.addEventListener('click', () => {
    els.profileNameEditInput.value = state.profile.name;
    els.profileNameInput.parentElement.classList.add('editing');
    els.profileNameEditInput.focus();
    els.profileNameEditInput.select();
  });
  els.profileNameEditInput.addEventListener('blur', saveProfileNameEdit);
  els.profileNameEditInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      els.profileNameEditInput.blur();
    } else if (e.key === 'Escape') {
      els.profileNameEditInput.value = state.profile.name;
      els.profileNameEditInput.blur();
    }
  });

  // 自己紹介
  els.profileBio.addEventListener('input', () => {
    state.profile.bio = els.profileBio.value;
    debouncedSaveProfile();
  });

  // 連絡先
  els.profileContactDisplay.addEventListener('input', () => {
    state.profile.contact = els.profileContactDisplay.value;
    debouncedSaveProfile();
  });

  // リンク
  renderProfileLinks();
  els.profileAddLinkBtn.addEventListener('click', () => {
    if (state.profile.links.length >= 10) return;
    state.profile.links.push('');
    renderProfileLinks();
  });

  // アカウント削除
  els.deleteAccountBtn.addEventListener('click', () => {
    showGenericConfirm(
      'アカウントを削除しますか？プロフィールと投稿したすべての募集が完全に削除されます。この操作は取り消せません。',
      deleteAccountFirebase
    );
  });

  // 投稿済み募集・期限切れ募集：選択モード・まとめて削除
  els.myPostsSelectBtn.addEventListener('click', () => togglePostListSelectMode('myposts'));
  els.myPostsBulkDeleteBtn.addEventListener('click', () => deleteSelectedPosts('myposts'));
  els.expiredSelectBtn.addEventListener('click', () => togglePostListSelectMode('expired'));
  els.expiredBulkDeleteBtn.addEventListener('click', () => deleteSelectedPosts('expired'));
}

/* 名前編集欄をblurまたはEnterで確定し、表示に戻す */
function saveProfileNameEdit() {
  const newName = els.profileNameEditInput.value.trim();
  if (newName && newName !== state.profile.name) {
    state.profile.name = newName;
    els.profileNameInput.textContent = newName;
    els.menuProfileName.textContent = newName;
    debouncedSaveProfile();
    syncProfileToPosts();
    showToast('名前を変更しました');
  }
  els.profileNameInput.parentElement.classList.remove('editing');
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
  closeAvatarCrop();
  debouncedSaveProfile();
  syncProfileToPosts();
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
/* 「投稿済み募集」「期限切れ募集」タブ用に、自分が投稿した全件をFirestoreから直接取得する。
   一覧のページング状態（state.allPosts）とは独立させ、まだ画面に読み込まれていない
   自分の投稿も漏れなく表示できるようにする。 */
async function loadMySettingsPosts() {
  if (!state.currentUser) {
    mySettingsPosts = [];
    return;
  }
  const fb = window._firebase;
  try {
    // orderByを付けないことでFirestoreの複合インデックス作成を不要にし、並び替えはJS側で行う
    const q = fb.query(fb.collection(fb.db, 'posts'), fb.where('authorUid', '==', state.currentUser.uid), fb.limit(200));
    const snap = await fb.getDocs(q);
    mySettingsPosts = snap.docs.map(docToPost).sort((a, b) => b.createdAt - a.createdAt);
  } catch (err) {
    console.error('自分の投稿の取得に失敗しました:', err);
    mySettingsPosts = state.allPosts.filter((post) => isOwnPost(post));
  }
}

function renderExpiredPosts() {
  renderOwnPostList('expired');
}

function renderPinnedPosts() {
  renderOwnPostList('pinned');
}

/* 自分がピン止めした投稿を取得する。自分の投稿とは限らないので、
   authorUidではなくpinnedByに自分のuidが入っているかで引く。 */
async function loadPinnedPosts() {
  if (!state.currentUser) {
    pinnedPosts = [];
    return;
  }
  const fb = window._firebase;
  try {
    const q = fb.query(
      fb.collection(fb.db, 'posts'),
      fb.where('pinnedBy', 'array-contains', state.currentUser.uid),
      fb.limit(200)
    );
    const snap = await fb.getDocs(q);
    pinnedPosts = snap.docs.map(docToPost).sort((a, b) => b.createdAt - a.createdAt);
  } catch (err) {
    console.error('ピン止めした投稿の取得に失敗しました:', err);
    pinnedPosts = state.allPosts.filter((post) => isPinnedByMe(post));
  }
}

/* 左メニュー・メニュー画面のショートカットに、それぞれの件数を表示する。
   まだ取得できていない間は空にしておく（CSSで非表示になる）。 */
function updatePostCounts() {
  const myReady = !!state.currentUser && mySettingsPostsLoaded;
  const myPosts = myReady ? POST_LIST_VIEWS.myposts.getPosts().length : '';
  const expired = myReady ? POST_LIST_VIEWS.expired.getPosts().length : '';

  const pinnedReady = !!state.currentUser && pinnedPostsLoaded;
  const pinned = pinnedReady ? POST_LIST_VIEWS.pinned.getPosts().length : '';

  els.myPostsCount.textContent = myPosts;
  els.expiredCount.textContent = expired;
  els.pinnedCount.textContent = pinned;

  els.menuMyPostsCount.textContent = myPosts;
  els.menuExpiredCount.textContent = expired;
  els.menuPinnedCount.textContent = pinned;
}

/* 自分の投稿は「件数の表示」と「一覧タブ」の両方から必要になるため、
   取得を1回にまとめ、同時に呼ばれても二重に取りに行かないようにする。 */
function ensureMySettingsPosts() {
  if (mySettingsPostsLoaded) return Promise.resolve();
  if (!mySettingsPostsPromise) {
    mySettingsPostsPromise = loadMySettingsPosts().then(() => {
      mySettingsPostsLoaded = true;
      mySettingsPostsPromise = null;
      updatePostCounts();
    });
  }
  return mySettingsPostsPromise;
}

function ensurePinnedPosts() {
  if (pinnedPostsLoaded) return Promise.resolve();
  if (!pinnedPostsPromise) {
    pinnedPostsPromise = loadPinnedPosts().then(() => {
      pinnedPostsLoaded = true;
      pinnedPostsPromise = null;
      updatePostCounts();
    });
  }
  return pinnedPostsPromise;
}

/* 選択モードを切り替える。切り替え時は選択・展開状態をリセットする */
function togglePostListSelectMode(key) {
  const view = POST_LIST_VIEWS[key];
  view.selectMode = !view.selectMode;
  view.selectedIds.clear();
  view.expandedId = null;

  const viewEls = view.getEls();
  viewEls.selectBtn.textContent = view.selectMode ? 'キャンセル' : '選択';
  viewEls.selectBtn.classList.toggle('active', view.selectMode);
  viewEls.bulkBar.style.display = view.selectMode ? '' : 'none';

  updateBulkDeleteBtn(key);
  renderOwnPostList(key);
}

function updateBulkDeleteBtn(key) {
  const view = POST_LIST_VIEWS[key];
  const btn = view.getEls().bulkDeleteBtn;
  btn.disabled = view.selectedIds.size === 0;
  btn.textContent = view.selectedIds.size > 0
    ? '選択した投稿を削除（' + view.selectedIds.size + '）'
    : '選択した投稿を削除';
}

function togglePostSelection(key, postId) {
  const view = POST_LIST_VIEWS[key];
  if (view.selectedIds.has(postId)) {
    view.selectedIds.delete(postId);
  } else {
    view.selectedIds.add(postId);
  }
  updateBulkDeleteBtn(key);
}

const POST_EXPAND_DURATION = 260;
const POST_EXPAND_EASING = 'cubic-bezier(0.2, 0, 0, 1)';

/* OSの「視差効果を減らす」設定を尊重し、その場合はアニメーションを行わない */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function togglePostExpand(key, postId) {
  const view = POST_LIST_VIEWS[key];
  const listEl = view.getEls().list;

  // 描画し直すと要素が作り直されCSSトランジションが効かないため、
  // 描画前後の位置を測って差分を打ち消すアニメーション（FLIP）で滑らかに見せる。
  const beforeTops = new Map();
  if (!prefersReducedMotion()) {
    listEl.querySelectorAll('.expired-post-item').forEach((el) => {
      beforeTops.set(el.dataset.postId, el.getBoundingClientRect().top);
    });
  }

  view.expandedId = view.expandedId === postId ? null : postId;
  renderOwnPostList(key);

  if (prefersReducedMotion()) return;
  animateExpandedDetail(listEl);
  animateListShift(listEl, beforeTops);
}

/* 開いた投稿の中身を、高さ0から本来の高さへ広げながらフェードインさせる */
function animateExpandedDetail(listEl) {
  const detail = listEl.querySelector('.expired-post-item.expanded .expired-post-detail');
  if (!detail || !detail.animate) return;

  const style = getComputedStyle(detail);
  const height = detail.getBoundingClientRect().height;
  detail.animate(
    [
      { height: '0px', paddingBottom: '0px', opacity: 0 },
      { height: height + 'px', paddingBottom: style.paddingBottom, opacity: 1 },
    ],
    { duration: POST_EXPAND_DURATION, easing: POST_EXPAND_EASING }
  );
}

/* 開閉によって位置がずれた投稿を、元の位置から新しい位置へ滑らせる */
function animateListShift(listEl, beforeTops) {
  listEl.querySelectorAll('.expired-post-item').forEach((el) => {
    const beforeTop = beforeTops.get(el.dataset.postId);
    if (beforeTop === undefined || !el.animate) return;

    const delta = beforeTop - el.getBoundingClientRect().top;
    if (Math.abs(delta) < 1) return;

    el.animate(
      [
        { transform: 'translateY(' + delta + 'px)' },
        { transform: 'translateY(0)' },
      ],
      { duration: POST_EXPAND_DURATION, easing: POST_EXPAND_EASING }
    );
  });
}

/* 選択モード・展開状態を初期化する（マイページを開き直したときなど） */
function resetPostListView(key) {
  const view = POST_LIST_VIEWS[key];
  view.selectMode = false;
  view.expandedId = null;
  view.selectedIds.clear();

  // ピン止めタブは選択モードを持たないため、ある場合だけ戻す
  const viewEls = view.getEls();
  if (!viewEls.selectBtn) return;
  viewEls.selectBtn.textContent = '選択';
  viewEls.selectBtn.classList.remove('active');
  viewEls.bulkBar.style.display = 'none';
}

/* 選択モードでチェックした投稿をまとめて削除する */
function deleteSelectedPosts(key) {
  const view = POST_LIST_VIEWS[key];
  if (view.selectedIds.size === 0) return;
  const count = view.selectedIds.size;

  showGenericConfirm('選択した' + count + '件の投稿を削除しますか？この操作は取り消せません。', async () => {
    const fb = window._firebase;
    const targets = mySettingsPosts.filter((p) => view.selectedIds.has(p.id));

    for (const post of targets) {
      try {
        await fb.deleteDoc(fb.doc(fb.db, 'posts', String(post.id)));
        deletePostFiles(post); // 添付ファイルの削除は結果を待たずベストエフォートで行う
      } catch (err) {
        console.error(post.id + 'の削除に失敗しました:', err);
      }
    }

    const deletedIds = new Set(targets.map((p) => p.id));
    mySettingsPosts = mySettingsPosts.filter((p) => !deletedIds.has(p.id));
    state.allPosts = state.allPosts.filter((p) => !deletedIds.has(p.id));
    pinnedPosts = pinnedPosts.filter((p) => !deletedIds.has(p.id));

    resetPostListView(key);
    renderMyPosts();
    renderExpiredPosts();
    renderPinnedPosts();
    updatePostCounts();
    renderPosts();
    showToast(count + '件の投稿を削除しました');
  });
}

/* 投稿を「その場で」展開表示する内容。投稿一覧のカードと同じ見た目にするが、
   マイページ内なのでピン止めボタン・投稿者アイコン・名前は表示しない。
   タイトルは外側の見出し（.expired-post-header）に出ているため省略し、
   投稿日時・期限は見出しから移動して一番下に表示する。
   末尾のボタンはタブごとに変わる（自分の投稿は「編集する」、
   ピン止めは他人の投稿もあるため「ピン止めを外す」）。 */
function createMyPostDetail(post, key) {
  const wrap = document.createElement('div');
  wrap.className = 'expired-post-detail';

  const card = document.createElement('div');
  card.className = 'post-card my-post-detail-card';

  const contentBox = document.createElement('div');
  contentBox.className = 'post-content-box';
  contentBox.appendChild(document.createTextNode(post.description));
  card.appendChild(contentBox);

  // 画像・添付ファイル（投稿詳細画面と同じ並び・見た目）
  const imageBox = createPostImageBox(post);
  if (imageBox) card.appendChild(imageBox);

  const fileList = createPostFileList(post);
  if (fileList) card.appendChild(fileList);

  const tagsWrap = document.createElement('div');
  tagsWrap.className = 'post-tags';
  (post.tags || []).forEach((tag) => {
    const pill = document.createElement('span');
    pill.className = 'tag-pill';
    pill.textContent = '#' + tag;
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMyPage();
      searchByTag(tag);
    });
    tagsWrap.appendChild(pill);
  });
  card.appendChild(tagsWrap);

  const footer = document.createElement('div');
  footer.className = 'post-footer';

  const dateEl = document.createElement('span');
  dateEl.className = 'post-date';
  dateEl.textContent = '投稿日時　' + post.date;
  footer.appendChild(dateEl);

  if (post.closed) {
    const closedEl = document.createElement('span');
    closedEl.textContent = '締め切り済み';
    footer.appendChild(closedEl);
  } else if (isPostExpired(post)) {
    const expiredEl = document.createElement('span');
    expiredEl.className = 'post-deadline urgent';
    expiredEl.textContent = '期限切れ';
    footer.appendChild(expiredEl);
  } else {
    const deadline = getPostDeadline(post);
    if (deadline) {
      const remaining = Math.ceil((deadline - new Date()) / (24 * 60 * 60 * 1000));
      const deadlineEl = document.createElement('span');
      deadlineEl.className = 'post-deadline' + (remaining <= 3 ? ' urgent' : '');
      deadlineEl.textContent = '残り ' + remaining + ' 日';
      footer.appendChild(deadlineEl);
    }
  }

  card.appendChild(footer);

  const actionBtn = document.createElement('button');
  actionBtn.type = 'button';
  actionBtn.className = 'my-post-edit-btn';

  if (POST_LIST_VIEWS[key].detailAction === 'unpin') {
    actionBtn.textContent = 'ピン止めを外す';
    actionBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      await togglePin(post);
      // 一覧から取り除き、件数もあわせて更新する
      pinnedPosts = pinnedPosts.filter((p) => p.id !== post.id);
      POST_LIST_VIEWS.pinned.expandedId = null;
      renderPinnedPosts();
      updatePostCounts();
      showToast('ピン止めを外しました');
    });
  } else {
    // 編集ボタン。マイページを閉じて、メイン画面側の投稿編集フォームへ移る
    actionBtn.textContent = '編集する';
    actionBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMyPage();
      closeDetailModal();
      openEditPostModal(post);
    });
  }
  card.appendChild(actionBtn);

  wrap.appendChild(card);
  return wrap;
}

function renderMyPosts() {
  renderOwnPostList('myposts');
}

/* 「投稿済み募集」「期限切れ募集」の一覧を描画する。
   どちらもクリックでその場に開き、選択モードではまとめて削除できる。 */
function renderOwnPostList(key) {
  const view = POST_LIST_VIEWS[key];
  const listEl = view.getEls().list;
  listEl.innerHTML = '';

  if (!state.currentUser) {
    const empty = document.createElement('div');
    empty.className = 'expired-posts-empty';
    empty.textContent = 'ログインすると表示されます';
    listEl.appendChild(empty);
    return;
  }

  const posts = view.getPosts();
  if (posts.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'expired-posts-empty';
    empty.textContent = view.emptyText;
    listEl.appendChild(empty);
    return;
  }

  posts.forEach((post) => {
    const expanded = !view.selectMode && view.expandedId === post.id;
    const item = document.createElement('div');
    item.className = 'expired-post-item'
      + (expanded ? ' expanded' : '')
      + ' ' + (CATEGORY_BORDER_CLASS[post.category] || '');
    // 描画し直しても同じ投稿だと分かるようにしておく（開閉アニメーションで使う）
    item.dataset.postId = post.id;

    const header = document.createElement('div');
    header.className = 'expired-post-header';

    let checkbox = null;
    if (view.selectMode) {
      checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'expired-post-checkbox';
      checkbox.checked = view.selectedIds.has(post.id);
      header.appendChild(checkbox);
    }

    const info = document.createElement('div');
    info.className = 'expired-post-info';

    const title = document.createElement('div');
    title.className = 'expired-post-title';
    title.textContent = post.title;
    appendEditedBadge(title, post);

    const meta = document.createElement('div');
    meta.className = 'expired-post-meta';
    if (post.closed) {
      meta.textContent = post.date + ' ／ 締め切り済み';
    } else if (isPostExpired(post)) {
      meta.textContent = post.date + ' ／ 期限切れ';
    } else {
      const deadline = getPostDeadline(post);
      const remaining = deadline ? Math.ceil((deadline - new Date()) / (24 * 60 * 60 * 1000)) : null;
      meta.textContent = post.date + (remaining !== null ? ' ／ 残り ' + remaining + ' 日' : '');
    }

    info.appendChild(title);
    // 展開中は投稿日時・期限を内容の一番下に表示するため、見出し側では重複させない
    if (!expanded) {
      info.appendChild(meta);
    }
    header.appendChild(info);

    if (!view.selectMode) {
      const arrow = document.createElement('span');
      arrow.className = 'expired-post-arrow';
      arrow.textContent = '▾';
      header.appendChild(arrow);
    }

    header.addEventListener('click', () => {
      if (view.selectMode) {
        togglePostSelection(key, post.id);
        checkbox.checked = view.selectedIds.has(post.id);
      } else {
        togglePostExpand(key, post.id);
      }
    });

    item.appendChild(header);
    if (expanded) {
      item.appendChild(createMyPostDetail(post, key));
    }
    listEl.appendChild(item);
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
  els.twitterLoginBtn.addEventListener('click', loginWithTwitter);
  els.myPageLogoutBtn.addEventListener('click', () => {
    showLogoutConfirm();
  });
  setupLoginPrompt();
}

/* ログイン促進モーダル */
function setupLoginPrompt() {
  const overlay = document.getElementById('loginPromptOverlay');
  const closeBtn = document.getElementById('loginPromptClose');
  const githubBtn = document.getElementById('loginPromptGithubBtn');
  const twitterBtn = document.getElementById('loginPromptTwitterBtn');

  closeBtn.addEventListener('click', () => overlay.classList.remove('show'));
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('show');
  });

  githubBtn.addEventListener('click', async () => {
    overlay.classList.remove('show');
    await loginWithGithub();
  });

  twitterBtn.addEventListener('click', async () => {
    overlay.classList.remove('show');
    await loginWithTwitter();
  });
}

function showLoginPrompt(message) {
  document.querySelector('.login-prompt-message').textContent = message || '投稿するにはログインしてください';
  applyLastLoginHints();
  document.getElementById('loginPromptOverlay').classList.add('show');
}

/* =========================================================
   前回ログインしたプロバイダの記憶（localStorage）
   ========================================================= */
const LAST_LOGIN_PROVIDER_KEY = 'loper_lastLoginProvider';
const LAST_LOGIN_LABELS = {
  github: 'GitHub',
  twitter: 'X（旧Twitter）',
};

function getLastLoginProvider() {
  try {
    return localStorage.getItem(LAST_LOGIN_PROVIDER_KEY);
  } catch (err) {
    return null;
  }
}

function setLastLoginProvider(provider) {
  try {
    localStorage.setItem(LAST_LOGIN_PROVIDER_KEY, provider);
  } catch (err) { /* localStorageが使えない環境では何もしない */ }
}

/* 前回ログインしたプロバイダのボタンを青でハイライトし、案内文を表示する。
   初回ログイン時（記録が無い場合）は何も表示しない。 */
function applyLastLoginHints() {
  const provider = getLastLoginProvider();

  document.querySelectorAll('.oauth-login-btn.github').forEach((el) => {
    el.classList.toggle('recent-login', provider === 'github');
  });
  document.querySelectorAll('.oauth-login-btn.twitter').forEach((el) => {
    el.classList.toggle('recent-login', provider === 'twitter');
  });

  const hintText = provider ? '前回' + LAST_LOGIN_LABELS[provider] + 'でログインしました。' : '';
  const hint1 = document.getElementById('loginPromptLastLoginHint');
  const hint2 = document.getElementById('myPageLastLoginHint');
  if (hint1) hint1.textContent = hintText;
  if (hint2) hint2.textContent = hintText;
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
    debouncedSaveProfile();
    syncProfileToPosts();
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

  els.deadlineEditSave.addEventListener('click', async () => {
    const post = state.allPosts.find((p) => p.id === editingDeadlinePostId);
    if (!post) {
      closeDeadlineEditModal();
      return;
    }
    const days = Math.min(365, Math.max(1, parseInt(els.deadlineEditInput.value) || 30));
    const fb = window._firebase;
    try {
      await fb.updateDoc(fb.doc(fb.db, 'posts', String(post.id)), {
        createdAt: fb.serverTimestamp(),
        deadlineDays: days,
        closed: false,
      });
      post.createdAt = new Date();
      post.date = formatDate(post.createdAt);
      post.deadlineDays = days;
      post.closed = false;
      closeDeadlineEditModal();
      renderPosts();
      showToast('募集期限を変更しました');
    } catch (err) {
      console.error('募集期限の変更に失敗しました:', err);
      showToast('変更に失敗しました');
    }
  });
}

async function loginWithGithub() {
  const fb = window._firebase;
  if (!fb) return;
  try {
    const provider = new fb.GithubAuthProvider();
    await fb.signInWithPopup(fb.auth, provider);
    setLastLoginProvider('github');
  } catch (err) {
    if (err.code !== 'auth/popup-closed-by-user') {
      showToast('ログインに失敗しました');
    }
    console.error(err);
  }
}

async function loginWithTwitter() {
  const fb = window._firebase;
  if (!fb) return;
  try {
    const provider = new fb.TwitterAuthProvider();
    await fb.signInWithPopup(fb.auth, provider);
    setLastLoginProvider('twitter');
  } catch (err) {
    if (err.code !== 'auth/popup-closed-by-user') {
      showToast('ログインに失敗しました');
    }
    console.error(err);
  }
}

/* アカウント削除：投稿とその添付ファイル、プロフィールデータ、認証アカウントの順に消す。
   認証アカウントを最後に消すのは、途中で失敗してもユーザーがログインしたまま
   データにアクセスできる状態を保つため。 */
async function deleteAccountFirebase() {
  const fb = window._firebase;
  if (!fb || !state.currentUser) return;
  const user = state.currentUser;
  const uid = user.uid;

  try {
    const snap = await fb.getDocs(fb.query(fb.collection(fb.db, 'posts'), fb.where('authorUid', '==', uid)));
    for (const d of snap.docs) {
      const post = { id: d.id, ...d.data() };
      await deletePostFiles(post);
      await fb.deleteDoc(fb.doc(fb.db, 'posts', d.id));
    }

    await fb.deleteDoc(fb.doc(fb.db, 'users', uid));
    await fb.deleteDoc(fb.doc(fb.db, 'publicProfiles', uid));

    await fb.deleteUser(user);
    showToast('アカウントを削除しました');
  } catch (err) {
    if (err.code === 'auth/requires-recent-login') {
      showToast('セキュリティのため、再度ログインしてからもう一度お試しください');
    } else {
      console.error('アカウント削除に失敗しました:', err);
      showToast('アカウントの削除に失敗しました');
    }
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

  els.myPageLoginSection.style.display = 'none';
  els.myPageContent.style.display = 'flex';
  els.myPageNav.style.display = 'flex';

  const fb = window._firebase;
  const userRef = fb.doc(fb.db, 'users', user.uid);

  try {
    const snap = await fb.getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data();
      state.profile.name = truncateName(data.name) || truncateName(user.displayName) || '名前';
      state.profile.avatarUrl = data.avatarUrl || user.photoURL || '';
      state.profile.bio = data.bio || '';
      state.profile.contact = data.contact || '';
      state.profile.links = data.links && data.links.length > 0 ? data.links : [''];
    } else {
      state.profile.name = truncateName(user.displayName) || '名前';
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
        authProvider: (user.providerData[0] && user.providerData[0].providerId) || 'unknown',
        authProviderUid: user.uid,
        authProviderName: user.displayName,
        authProviderPhoto: user.photoURL,
        email: user.email,
        createdAt: new Date().toISOString(),
      });
      await savePublicProfileToFirestore();
    }
  } catch (err) {
    console.error('Firestore load error:', err);
    state.profile.name = truncateName(user.displayName) || '名前';
    state.profile.avatarUrl = user.photoURL || '';
  }

  els.profileNameInput.textContent = state.profile.name;
  els.profileContactDisplay.value = state.profile.contact;
  els.profileBio.value = state.profile.bio;
  applyProfileAvatar();
  applyMenuProfile();
  renderProfileLinks();
  renderPosts();
}

function onFirebaseLogout() {
  state.currentUser = null;

  els.myPageLoginSection.style.display = 'flex';
  els.myPageContent.style.display = 'none';
  els.myPageNav.style.display = 'none';
  applyLastLoginHints();

  state.profile.name = '名前';
  state.profile.avatarUrl = 'images/ProfileIcon.png';
  state.profile.bio = '';
  state.profile.contact = '';
  state.profile.links = [''];

  els.profileNameInput.textContent = state.profile.name;
  els.profileContactDisplay.value = state.profile.contact;
  els.profileBio.value = state.profile.bio;
  applyProfileAvatar();
  applyMenuProfile();
  renderProfileLinks();
  renderPosts();
  closeDetailModal();

  inboxMessages = [];
  messagesLoaded = false;
  setUnreadBadgeVisible(false);

  mySettingsPosts = [];
  mySettingsPostsLoaded = false;
  mySettingsPostsPromise = null;
  pinnedPosts = [];
  pinnedPostsLoaded = false;
  pinnedPostsPromise = null;
  updatePostCounts();
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
    await savePublicProfileToFirestore();
  } catch (err) {
    console.error('Firestore save error:', err);
  }
}

/* 投稿に複製している名前・アイコンを最新のプロフィールへ同期する。
   投稿は作成時点の名前・アイコンをコピーして保持しているため、
   名前やアイコンを変更した直後に呼び出して古いままにならないようにする。 */
async function syncProfileToPosts() {
  const fb = window._firebase;
  if (!fb || !state.currentUser) return;

  const uid = state.currentUser.uid;
  const name = state.profile.name || '名前';
  const avatarUrl = state.profile.avatarUrl || 'images/ProfileIcon.png';

  try {
    const snap = await fb.getDocs(fb.query(fb.collection(fb.db, 'posts'), fb.where('authorUid', '==', uid), fb.limit(200)));
    const targets = snap.docs.filter((d) => {
      const data = d.data();
      return data.authorName !== name || data.authorAvatarUrl !== avatarUrl;
    });
    if (targets.length === 0) return;

    for (const d of targets) {
      try {
        await fb.updateDoc(fb.doc(fb.db, 'posts', d.id), { authorName: name, authorAvatarUrl: avatarUrl });
      } catch (err) {
        console.error(d.id + 'の投稿者情報の同期に失敗しました:', err);
      }
    }

    // 一覧の表示にもすぐ反映する
    state.allPosts.forEach((post) => {
      if (post.authorUid === uid) {
        post.authorName = name;
        post.authorAvatarUrl = avatarUrl;
      }
    });
    renderPosts();
  } catch (err) {
    console.error('投稿一覧の取得に失敗しました:', err);
  }
}

/* usersのうち公開してよい項目だけを、他人が読める publicProfiles にも複製保存する。
   投稿者アイコンやユーザー名クリックから開くプロフィール閲覧画面はここを参照する。 */
async function savePublicProfileToFirestore() {
  const fb = window._firebase;
  if (!fb || !state.currentUser) return;

  try {
    const publicRef = fb.doc(fb.db, 'publicProfiles', state.currentUser.uid);
    await fb.setDoc(publicRef, {
      name: state.profile.name || '名前',
      avatarUrl: state.profile.avatarUrl || 'images/ProfileIcon.png',
      bio: state.profile.bio || '',
      contact: state.profile.contact || '',
      links: state.profile.links.filter(l => l.trim() !== ''),
    });
  } catch (err) {
    console.error('公開プロフィールの保存に失敗しました:', err);
  }
}
