import psycopg2

# Link de conexão PostgreSQL
conn_string = ""

# Conectando ao banco de dados
conn = psycopg2.connect(conn_string)

# Criando um cursor
cursor = conn.cursor()

# Executando uma query
cursor.execute("SELECT * FROM quest")

# Recuperando os resultados
records = cursor.fetchall()

# Imprimindo os resultados
print(records)

# Fechando a conexão
conn.close()
