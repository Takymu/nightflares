#!/usr/bin/env python3
"""
Подставляет реальные данные из secrets.local.json в файлы сайта — перед публикацией.

Запуск:   python fill-secrets.py
Откат:    python fill-secrets.py --revert   (вернёт плейсхолдеры обратно)

secrets.local.json лежит локально и НЕ коммитится (см. .gitignore), поэтому реальные
ИНН/ФИО не попадают в публичный репозиторий во время превью.
"""
import json, sys, os

FILES = ["index.html", "privacy.html", "oferta.html", "script.js"]
HERE = os.path.dirname(os.path.abspath(__file__))

def load():
    p = os.path.join(HERE, "secrets.local.json")
    if not os.path.exists(p):
        sys.exit("Нет secrets.local.json рядом со скриптом.")
    data = json.load(open(p, encoding="utf-8"))
    return {k: v for k, v in data.items() if not k.startswith("_")}

def run(revert=False):
    pairs = load()
    total = 0
    for name in FILES:
        path = os.path.join(HERE, name)
        if not os.path.exists(path):
            continue
        text = open(path, encoding="utf-8").read()
        n = 0
        for placeholder, value in pairs.items():
            frm, to = (value, placeholder) if revert else (placeholder, value)
            c = text.count(frm)
            if c:
                text = text.replace(frm, to)
                n += c
        if n:
            open(path, "w", encoding="utf-8").write(text)
            print(f"  {name}: {'откат' if revert else 'подставлено'} {n}")
            total += n
    print(f"Готово. Всего замен: {total}." +
          ("" if revert else " Не забудь потом закоммитить и запушить."))

if __name__ == "__main__":
    run(revert="--revert" in sys.argv)
