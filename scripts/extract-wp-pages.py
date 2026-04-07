#!/usr/bin/env python3
"""One-off: list published pages from WP SQL dump (xzwg_posts)."""
import re
import sys

path = sys.argv[1] if len(sys.argv) > 1 else "wordpress-site/d381968_vzjqrj.sql"
with open(path, "r", encoding="utf-8", errors="replace") as f:
    text = f.read()

# MySQL escaped quotes in strings: '' for '
# Extract tuples ending with ,'page','',0) or ,'page','',N)

def unescape_sql_str(s: str) -> str:
    return s.replace("''", "'").replace("\\'", "'")


def parse_posts_insert(block: str) -> list[dict]:
    out = []
    if "INSERT INTO `xzwg_posts`" not in block:
        return out
    i = block.find("VALUES")
    if i == -1:
        return out
    body = block[i + 6 :].strip()
    if body.endswith(";"):
        body = body[:-1].strip()
    # split rows on "),\n(" while respecting quoted strings
    rows = []
    cur = []
    depth = 0
    in_q = False
    esc = False
    j = 0
    while j < len(body):
        c = body[j]
        if in_q:
            if esc:
                esc = False
            elif c == "\\":
                esc = True
            elif c == "'":
                # doubled quote inside string
                if j + 1 < len(body) and body[j + 1] == "'":
                    j += 2
                    continue
                in_q = False
            j += 1
            continue
        if c == "'":
            in_q = True
            j += 1
            continue
        if c == "(":
            if depth == 0:
                cur = []
            depth += 1
            cur.append(c)
        elif c == ")":
            cur.append(c)
            depth -= 1
            if depth == 0:
                rows.append("".join(cur)[1:-1])  # strip outer parens
            cur = []
        else:
            if depth > 0:
                cur.append(c)
        j += 1

    for row in rows:
        if not row.endswith(",'page',''") and ",'page',''" not in row:
            continue
        if "'publish'" not in row:
            continue
        # fields: ID, author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, ...
        # Split by ',' not inside strings
        fields = []
        buf = []
        in_q = False
        esc = False
        k = 0
        while k < len(row):
            c = row[k]
            if in_q:
                buf.append(c)
                if esc:
                    esc = False
                elif c == "\\":
                    esc = True
                elif c == "'":
                    if k + 1 < len(row) and row[k + 1] == "'":
                        buf.append("'")
                        k += 2
                        continue
                    in_q = False
                k += 1
                continue
            if c == "'":
                in_q = True
                buf.append(c)
                k += 1
                continue
            if c == "," and not in_q:
                fields.append("".join(buf).strip())
                buf = []
                k += 1
                continue
            buf.append(c)
            k += 1
        if buf:
            fields.append("".join(buf).strip())

        if len(fields) < 12:
            continue
        try:
            pid = int(fields[0].strip("'") if fields[0].startswith("'") else fields[0])
        except ValueError:
            continue
        title = unescape_sql_str(fields[5].strip("'"))
        slug = unescape_sql_str(fields[11].strip("'"))  # post_name
        guid = unescape_sql_str(fields[18].strip("'")) if len(fields) > 18 else ""
        out.append({"id": pid, "title": title, "slug": slug, "guid": guid})
    return out


pages = []
for m in re.finditer(r"INSERT INTO `xzwg_posts`\s+[^;]+;", text, re.DOTALL | re.IGNORECASE):
    pages.extend(parse_posts_insert(m.group(0)))

# dedupe by id
seen = set()
uniq = []
for p in sorted(pages, key=lambda x: x["id"]):
    if p["id"] in seen:
        continue
    seen.add(p["id"])
    uniq.append(p)

for p in uniq:
    print(f"{p['id']}\t{p['slug']}\t{p['title']}")
