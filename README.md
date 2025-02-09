# コーチングAIアプリ

## プロジェクト概要

このプロジェクトは、FlaskとReactを用いて開発された、AIによるコーチングを提供するWebアプリケーションです。 Firebase Authenticationで認証を行い、BigQueryに会話履歴を保存、Vertex AIを使用して会話を生成します。

## ファイル構成

```
.
├── .gitignore                   # Git管理から除外するファイル
├── backend                      # Flaskバックエンドのソースコード
│   ├── .gitignore               # backend用のGit管理除外ファイル
│   ├── Dockerfile               # Dockerイメージのビルド設定
│   ├── app.py                   # Flaskアプリケーションのエントリーポイント
│   ├── bqlibs.py                # BigQuery関連の関数
│   ├── config.py                # 設定ファイル
│   ├── firebase-credentials.json # Firebase認証情報（**注意：本番環境では安全に管理してください**）
│   ├── generate.py              # Vertex AI でのテキスト生成
│   ├── main.py                  # Flaskアプリの起動スクリプト
│   ├── models.py                # データモデル
│   ├── requirements.txt         # Pythonの依存関係
│   └── static                   # 静的ファイル
│       └── dist                 # ビルドされたReactアプリ
│           └── assets           # Reactアプリのアセットファイル
├── frontend                     # Reactフロントエンドのソースコード
│   ├── .gitignore               # frontend用のGit管理除外ファイル
│   ├── README.md                # ReactフロントエンドのREADME
│   ├── eslint.config.js         # ESLintの設定
│   ├── index.html               # Reactアプリのエントリーポイント
│   ├── package-lock.json        # Node.jsの依存関係ロックファイル
│   ├── package.json             # Node.jsの依存関係定義
│   ├── public                   # 静的アセット
│   │   └── mockServiceWorker.js # Mock Service Workerファイル
│   │   └── vite.svg           # Viteロゴ
│   └── src                      # Reactアプリのソースコード
│       ├── App.jsx              # Reactコンポーネントのエントリーポイント
│       ├── assets               # Reactアプリのアセットファイル
│       ├── components           # Reactコンポーネント
│       │   ├── Chat.jsx         # メインのチャットコンポーネント
│       │   ├── Login.jsx        # ログインコンポーネント
│       │   ├── MessageInput.jsx # メッセージ入力コンポーネント
│       │   └── MessageList.jsx  # メッセージリストコンポーネント
│       ├── index.jsx            # Reactアプリのエントリーポイント
│       ├── mocks                # Mock API
│       │   ├── browser.js       # ブラウザ環境用MSWセットアップ
│       │   └── handlers.js      # Mock API ハンドラ
│       └── services           # API呼び出しとFirebase関連のロジック
│           ├── api.js           # API呼び出し関数
│           └── firebase.js      # Firebase初期化と認証
└── README.md                  # プロジェクト全体のREADME (このファイル)
```

## 各ファイルの説明

### `.gitignore`

Gitリポジトリに含めたくないファイルを指定します。`venv`ディレクトリやIDEの設定ファイルなどが含まれます。

### `backend/`

Flaskバックエンドのソースコードが格納されています。

*   **`Dockerfile`**: アプリケーションをDockerコンテナとして構築するための手順が記述されています。
*   **`app.py`**: Flaskアプリケーションのエントリーポイントであり、APIエンドポイントの定義やFirebaseの初期化、BigQueryとの連携処理などが含まれます。
*   **`bqlibs.py`**: BigQueryへのクエリ実行やデータの挿入・削除を行う関数が定義されています。
*   **`config.py`**: アプリケーションの設定情報（APIキー、プロジェクトIDなど）を定義します。
*   **`firebase-credentials.json`**: Firebase Admin SDKを使用するための認証情報が格納されています。**本番環境では、このファイルを安全に管理し、リポジトリにコミットしないように注意してください。**
*   **`generate.py`**: Vertex AIを使用して会話を生成するロジックが含まれています。
*   **`main.py`**: Flaskアプリケーションを起動するためのスクリプトです。
*   **`models.py`**: BigQueryに保存するデータのモデル定義が含まれています。
*   **`requirements.txt`**: アプリケーションに必要なPythonパッケージがリストされています。

### `frontend/`

Reactフロントエンドのソースコードが格納されています。

*   **`README.md`**: Reactフロントエンドに関する情報が記載されています。
*   **`eslint.config.js`**: ESLintの設定ファイルであり、コードの品質を保つためのルールが定義されています。
*   **`index.html`**: ReactアプリケーションをレンダリングするためのHTMLファイルです。
*   **`package.json`**: プロジェクトに必要なNode.jsパッケージとそのバージョンがリストされています。
*   **`src/App.jsx`**: Reactアプリケーションのエントリーポイントであり、ルーティングや認証状態の管理などを行います。
*   **`src/components/`**: Reactコンポーネントが格納されています。
    *   `Chat.jsx`: メインのチャット画面を提供するコンポーネントです。
    *   `Login.jsx`: ログイン画面を提供するコンポーネントです。
    *   `MessageInput.jsx`: メッセージ入力フォームを提供するコンポーネントです。
    *   `MessageList.jsx`: メッセージリストを表示するコンポーネントです。
*   **`src/mocks/`**: Mock APIを定義するファイル。
    *   `browser.js`: ブラウザ環境でMSW (Mock Service Worker) をセットアップします。
    *   `handlers.js`: Mock APIのエンドポイントとそれに対応するハンドラを定義します。
*   **`src/services/`**: API呼び出しやFirebase関連のロジックをまとめたファイル。
    *   `api.js`: バックエンドAPIへの呼び出し関数を定義します。
    *   `firebase.js`: Firebaseの初期化と認証関連の関数を定義します。

## 環境構築

1.  **Python環境のセットアップ:**
    *   Python 3.9以上が必要です。
    *   仮想環境を作成し、必要なパッケージをインストールします。

    ```bash
    python3 -m venv venv
    source venv/bin/activate  # macOS/Linux
    venv\Scripts\activate.bat # Windows
    pip install -r backend/requirements.txt
    ```

2.  **Node.js環境のセットアップ:**
    *   Node.js 18以上が必要です。
    *   npmまたはyarnを使用して、必要なパッケージをインストールします。

    ```bash
    cd frontend
    npm install
    ```

3.  **Firebaseプロジェクトのセットアップ:**
    *   Firebaseプロジェクトを作成し、Webアプリとして登録します。
    *   Firebaseプロジェクトの認証情報を取得し、`backend/firebase-credentials.json`に配置します。**本番環境では、認証情報を安全に管理し、publicリポジトリにコミットしないように注意してください。**
    *   Firebaseプロジェクトの設定情報を、`backend/config.py`に設定します。
    *   Firebase Authenticationを有効にし、Googleログインを有効にします。
    *   Firebase Authenticationでユーザーを作成し、APIをテストできるようにします。

4.  **BigQueryのセットアップ:**
    *   Google Cloud PlatformでBigQueryを有効にします。
    *   データセットとテーブルを作成し、`backend/bqlibs.py`のテーブルIDを更新します。
    *   BigQueryへのアクセス権を持つサービスアカウントを作成し、その認証情報を`backend/firebase-credentials.json`に含めます。

5.  **Vertex AIのセットアップ:**
    *   Google Cloud PlatformでVertex AIを有効にします。
    *   Vertex AI APIへのアクセス権を持つサービスアカウントを設定します。

## 開発

1.  **Flaskバックエンドの起動:**

    ```bash
    cd backend
    python main.py
    ```

2.  **Reactフロントエンドの起動:**

    ```bash
    cd frontend
    npm run dev
    ```

    これにより、Reactアプリケーションが`http://localhost:3000`で起動します。

## 本番環境へのデプロイ

本番環境へのデプロイには、cloud runにGithubリポジトリを接続する方法を取りました。
こうすることにより、Githubリポジトリに変更した情報をpushすると、自動的にcloud runにデプロイされるようになります。

## 注意事項

*   **Firebase認証情報**: `firebase-credentials.json`は機密情報を含むため、publicリポジトリにコミットしないように注意してください。本番環境では、環境変数などを使用して安全に管理することを推奨します。可能であればgoogleのSecret Managerを使用するとより安全にキーを管理することができます。
*   **APIキー**: APIキーも同様に、安全に管理してください。
*   **セキュリティ**: 本番環境では、アプリケーションのセキュリティを確保するために、適切な対策を講じてください（HTTPSの使用、入力値の検証、など）。

## 連絡先

このプロジェクトに関する質問やフィードバックは、以下までお寄せください。

miya

[ご意見ご感想連絡フォーム](https://docs.google.com/forms/d/e/1FAIpQLSdFpGYIpPL-RvCs0MR_CHR6QLv39qeAK9QPPDAoncLIiCu7Zg/viewform?usp=header)
