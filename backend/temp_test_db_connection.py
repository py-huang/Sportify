from application import create_app, db
from flask import current_app

app = create_app()

with app.app_context():
    try:
        connection = db.engine.connect()
        print("資料庫連線成功！")
        connection.close()
    except Exception as e:
        print(f"資料庫連線失敗：{e}")