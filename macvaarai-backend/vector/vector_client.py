import psycopg2
from config import DB_CONFIG

def get_table_for_vector_size(size):
    return f"docs_{size}"

def query_semantic_db(embedding, top_k=3):
    table_name = get_table_for_vector_size(len(embedding))
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    cur.execute(f"""
        SELECT content, 1 - (embedding <#> %s::vector) AS score
        FROM {table_name}
        ORDER BY embedding <#> %s::vector
        LIMIT %s
    """, (embedding.tolist(), embedding.tolist(), top_k))
    results = cur.fetchall()
    cur.close()
    conn.close()
    return [{"content": row[0], "score": float(row[1])} for row in results]

def insert_doc(content, embedding):
    table_name = get_table_for_vector_size(len(embedding))
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    cur.execute(f"""
        INSERT INTO {table_name} (content, embedding)
        VALUES (%s, %s)
    """, (content, embedding.tolist()))
    conn.commit()
    cur.close()
    conn.close()