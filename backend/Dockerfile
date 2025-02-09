# Python イメージを使用
FROM python:3.9

# 作業ディレクトリを設定
WORKDIR /app

# 必要なファイルをコピー
COPY . .

# 依存関係をインストール
RUN pip install -r requirements.txt

# Flask アプリを起動
CMD ["python", "app.py"]

# Gunicorn で Flask を起動（複数ワーカー & Cloud Run 用）
CMD exec gunicorn --bind :8080 --workers 4 --threads 8 main:app
