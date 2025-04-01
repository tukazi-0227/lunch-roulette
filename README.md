# 概要
### [ご飯たべたべルーレット(スマホのみ対応)](https://lunch-roulette-three.vercel.app/)
- お店を地域ごとに登録してルーレットでお店を決めてくれるアプリになっています。
- プレイヤー人数は 1人 or 2 ~ 4人で遊べます。

## 技術スタック
LUNCH-ROULETTEは以下の技術を利用しています。
- [Nuxt3](https://nuxt.com/docs/getting-started/introduction)
- [TailwindCSS](https://tailwindcss.com)
- [Firebase](https://firebase.google.com)
- [GCP](https://cloud.google.com)
- [Vercel](https://vercel.com)

## DB設計
### コレクション
| Collection | Collection |
| ---------- | ---------- |
|users       | outlet     |
|            | place      |
|            | roulette   |

### 各コレクションのフィールド
#### 1. users/
| Collection | Doc        | Type       |
| ---------- | ---------- | ---------- |
|users       | userId     | string     |
|            | id         | string     |
|            | password   | string     |

#### 2. users/{userId}/outlet/{id}
| Collection | Doc        | Type       |
| ---------- | ---------- | ---------- |
|outlet      | createdAt  | Timestamp  |
|            | id         | string     |
|            | detail     | string     |
|            | imageURL   | string     |
|            | name       | string     |
|            | place      | string     |

#### 3. users/{userId}/place/{id}
| Collection | Doc        | Type       |
| ---------- | ---------- | ---------- |
|place       | placeId    | string     |
|            | name       | string     |

#### 4. users/{userId}/place/{id}
| Collection | Doc        | Type       |
| ---------- | ---------- | ---------- |
|roulette    | outlet?    | 2のoutlet   |
|            | createdAt? | Timestamp  |
|            | outlets?   | 2のoutlet配列|

## 環境構築手順書
- node : v20.14.0
- npm : 10.7.0

## ① ローカルのパソコンに作業用のフォルダを作成します。
## ② Gitからソースをクローンします。
- cd {作業用ディレクトリ}
- git init
- git remote add origin https://github.com/tukazi-0227/lunch-roulette.git
- git remote -v
  - → 登録できていることを確認
- git pull origin main
  - ソースクローン完了！
## ③ npm install

クローンしたソースでnpm installをします。

- npm install

## ④ 環境変数
- 所有者である私に連絡して受け取って下さい
- 受け取ったファイルをルートディレクトリに.envとして保存
## ⑤ CMSの起動の確認

- npm run dev
  - → localhost:3000/login を起動する

環境構築完了です！ 👏 おつかれさまでした！

## プロジェクトの仕組み
◆ あまり意識しなくていい
- .nuxt → ビルドされたJavaScript群のファイルが作られている（開発で意識する必要はない）
- .output → ビルドされたJavaScript群のファイルが作られている（開発で意識する必要はない）
- .vscode → .vscodeの設定を共有するためのもの
- node_modules → npmライブラリ群
- .gitignore → gitで管理しないファイル・ソース・ディレクトリ等を記載する
- tsconfig.json → typeScriptの定義ファイル
- package-lock.json
- package.json

◆ 開発に必要

- @types → 開発で使い回す型定義ファイルが集まっているディレクトリ
- app → 開発に必要なファイルが集まっているディレクトリ
- public → 静的なファイル（画像とか）はここにおく
- .env → 環境変数のファイル
- nuxt.config.ts → Nuxt3のプロジェクトの設定
- tailwind.config.js → Tailwind使わないなら不要
