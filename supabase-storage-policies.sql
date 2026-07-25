-- loper: Supabase Storageのアクセスポリシー（見直し版）
--
-- 【重要】このSQLは、以前実行したポリシーを一度削除してから作り直します。
-- SQL Editor に貼り付けてそのまま実行してください。
--
-- 前提: Storage に「posts」という名前のバケットを Public で作成済みであること。
--
-- ■ 背景
-- SupabaseのアクセスポリシーはSupabase自身のログイン状態（auth.uid()）を前提に
-- しているが、このアプリのログインはFirebaseで行っているため、Supabase側からは
-- 「誰が操作しているか」を判定できない。
-- そのため権限は「全員に許可」か「全員に禁止」の二択になる。
--
-- ■ 方針
--   閲覧 : 許可（投稿の画像・ファイルを表示するために必要）
--   追加 : 許可（投稿時のアップロードに必要）
--   削除 : 禁止  ← 以前は許可していたが、公開されているキーを使えば
--                  誰でも全投稿の画像・ファイルを消せてしまうため禁止にする。
--                  副作用として、投稿を削除してもファイルはStorageに残る
--                  （容量を圧迫してきたら、Supabaseの画面から手動で整理する）。
--   更新 : 禁止（既存ファイルの中身を差し替えられるのを防ぐ）

-- 以前のポリシーを削除
drop policy if exists "posts bucket: public read" on storage.objects;
drop policy if exists "posts bucket: public upload" on storage.objects;
drop policy if exists "posts bucket: public delete" on storage.objects;

-- 閲覧：許可
create policy "posts bucket: public read"
on storage.objects for select
using (bucket_id = 'posts');

-- アップロード：許可
create policy "posts bucket: public upload"
on storage.objects for insert
with check (bucket_id = 'posts');

-- 削除・更新のポリシーは作らない（＝禁止）


-- ■ あわせて設定しておくと安全な項目（Supabaseの画面から設定する）
-- Storage → posts バケット → 設定
--   1. ファイルサイズ上限を 20MB 程度に設定する
--      （巨大ファイルを大量に置かれて無料枠を使い切られるのを防ぐ）
--   2. 許可するMIMEタイプを必要なものだけに絞る
--      例: image/png, image/jpeg, image/gif, image/webp,
--          application/pdf, application/zip, text/plain
--      （実行ファイルなど、悪用されうる形式の設置を防ぐ）
