# loper
## 開発者用仲間募集サイト
### 読みは「ロッパー」っすよ

- Firebase連携済み
- GitHubでログイン可能。
- プロフィール画面からログイン可能。

## 広告追加しました
- 広告(admaxタグ)は別リポジトリ https://github.com/11Kawauso/loper-ads （公開URL: https://11kawauso.github.io/loper-ads/ ）のad.htmlに置いてあり、script.jsのcreateAdCard()からiframeで読み込んでいる。
  同一ドメインにしないのはセキュリティのため（別ドメインだからsandboxにallow-same-originを付けても安全）。
- loperのURLを変えたら、忍者admax管理画面のURL登録を変えること。
- loper-ads側のURL・リポジトリ名を変えたら、script.jsのcreateAdCard()内のiframe.srcも変えること。

## ゲーム制作予定
- Unity
- 横スクロール
- 2Dアクション

## 予定
- [x] スマホ対応
- [x] カテゴリごとの色
- [x] 画像のドラッグ禁止
- [x] 募集カードの期限表示
- [x] 募集カード内の通報ボタン追加
- [x] 自分が投稿した募集の設定
      (投稿の削除や期限の引き延ばし、短くなど。)
- [x] プロフィール画面、メニュー画面のアニメーション追加
