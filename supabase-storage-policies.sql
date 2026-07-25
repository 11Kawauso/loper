-- loper: Supabase Storageの初期設定
--
-- 事前準備（SupabaseダッシュボードのUIで行う）:
--   1. Storage → New bucket → 名前を「posts」、Public bucket を ON にして作成
--
-- このSQLは SQL Editor に貼り付けて実行してください。
--
-- 注意：SupabaseのRLSはSupabase自身の認証（auth.uid()）を前提にしており、
-- このアプリのログインはFirebase Authで行っているため、Supabase側からは
-- 「本人かどうか」を検証できません。そのため、アップロード・削除は
-- ログイン有無に関わらず誰でも実行できる設定にしています。
-- 「投稿の所有者だけが編集・削除できる」というアプリ上の制御は、
-- 引き続きFirestore側（authorUidのチェック）で行われます。

-- 誰でも読み取り可能（Publicバケットなら本来不要だが明示しておく）
create policy "posts bucket: public read"
on storage.objects for select
using (bucket_id = 'posts');

-- 誰でもアップロード可能
create policy "posts bucket: public upload"
on storage.objects for insert
with check (bucket_id = 'posts');

-- 誰でも削除可能（投稿削除時にアプリからファイルを消すために必要）
create policy "posts bucket: public delete"
on storage.objects for delete
using (bucket_id = 'posts');
