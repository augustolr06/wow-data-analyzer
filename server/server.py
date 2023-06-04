import psycopg2
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
import dotenv
import os

# Objetivo inicial: disponibilizar um crud para a tabela quest
# endpoints:
# GET /api/quest -> retorna todas as quests
# GET /api/quest/<id> -> retorna a quest com o id <id>
# POST /api/quest -> cria uma nova quest
# PUT /api/quest/<id> -> atualiza a quest com o id <id>
# DELETE /api/quest/<id> -> deleta a quest com o id <id>

# Carregando variáveis de ambiente
dotenv.load_dotenv()

# Link de conexão PostgreSQL
conn_string = os.getenv("POSTGRESQL_CONNECTION_STRING")

# Conectando ao banco de dados
conn = psycopg2.connect(conn_string)

# Criando o servidor Flask e habilitando o CORS
App = Flask(__name__)
CORS(App)


# Definindo as rotas:

# GET /api/quests -> retorna todas as quests


@App.route("/api/quests", methods=["GET"])
def getQuests():
    # Executando uma query
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM quest")

    # Recuperando os resultados
    records = cursor.fetchall()

    # Transformando os resultados em um objeto quests com uma lista de quests
    quests = []
    for record in records:
        quest = {
            "id": record[0],
            "titulo": record[1],
            "descricao": record[2],
            "categoria": record[3],
            "area": record[4],
            "tipo": record[5]
        }
        quests.append(quest)

    # Devolvendo a resposta
    return jsonify(quests)


# GET /api/quest/<id> -> retorna a quest com o id <id>
@App.route("/api/quest/<id>", methods=["GET"])
def getQuest(id):
    # Executando uma query
    cursor = conn.cursor()
    sql = "SELECT * FROM quest WHERE id = %s"
    cursor.execute(sql, (id,))

    # Recuperando os resultados
    records = cursor.fetchall()

    # Verificando se a quest existe
    if len(records) == 0:
        return make_response(jsonify({"message": "Quest not found"}), 404)

    # Transformando os resultados em um objeto quest
    record = records[0]
    quest = {
        "id": record[0],
        "titulo": record[1],
        "descricao": record[2],
        "categoria": record[3],
        "area": record[4],
        "tipo": record[5]
    }

    # Devolvendo a resposta
    return jsonify(quest)

# POST /api/quest -> cria uma nova quest


@App.route("/api/quest", methods=["POST"])
def createQuest():
    # obetendo os dados do body da requisição
    data = request.get_json()
    # armazenando os dados do body da requisição em variáveis
    titulo = data["titulo"]
    descricao = data["descricao"]
    categoria = data["categoria"]
    area = data["area"]
    tipo = data["tipo"]

    # Verificando se a quest já existe
    cursor = conn.cursor()
    sql = "SELECT * FROM quest WHERE titulo = %s AND descricao = %s AND categoria = %s AND area = %s AND tipo = %s"
    cursor.execute(sql, (titulo, descricao, categoria, area, tipo))
    records = cursor.fetchall()
    if len(records) > 0:
        return make_response(jsonify({"message": "Quest already exists"}), 409)

    # Executando a query
    cursor = conn.cursor()
    sql = "INSERT INTO quest (titulo, descricao, categoria, area, tipo) VALUES (%s, %s, %s, %s, %s)"
    cursor.execute(sql, (titulo, descricao, categoria, area, tipo))

    # Recuperando o id da quest criada
    sql = "SELECT id FROM quest WHERE titulo = %s AND descricao = %s AND categoria = %s AND area = %s AND tipo = %s"
    cursor.execute(sql, (data["titulo"], data["descricao"],
                         data["categoria"], data["area"], data["tipo"]))
    id = cursor.fetchone()[0]

    # Commitando a query
    conn.commit()

    # Retornando a resposta
    return make_response(jsonify({"message": "Quest created", "id": id}), 201)


# PUT /api/quest/<id> -> atualiza a quest com o id <id>
@App.route("/api/quest/<id>", methods=["PUT"])
def updateQuest(id):
    # obetendo os dados do body da requisição
    data = request.get_json()

    # Verificando se a quest existe
    cursor = conn.cursor()
    sql = "SELECT * FROM quest WHERE id = %s"
    cursor.execute(sql, (id,))
    records = cursor.fetchall()
    if len(records) == 0:
        return make_response(jsonify({"message": "Quest not found"}), 404)

    # Executando a query
    cursor = conn.cursor()
    sql = "UPDATE quest SET titulo = %s, descricao = %s, categoria = %s, area = %s, tipo = %s WHERE id = %s"
    cursor.execute(sql, (data["titulo"], data["descricao"],
                         data["categoria"], data["area"], data["tipo"], id))

    # Commitando a query
    conn.commit()

    # Retornando a resposta
    return make_response(jsonify({"message": "Quest updated"}), 200)


# DELETE /api/quest/<id> -> deleta a quest com o id <id>
@App.route("/api/quest/<id>", methods=["DELETE"])
def deleteQuest(id):

    # Verificando se a quest existe
    cursor = conn.cursor()
    sql = "SELECT * FROM quest WHERE id = %s"
    cursor.execute(sql, (id,))
    records = cursor.fetchall()
    if len(records) == 0:
        return make_response(jsonify({"message": "Quest not found"}), 404)

    # Executando a query
    cursor = conn.cursor()
    sql = "DELETE FROM quest WHERE id = %s"
    cursor.execute(sql, (id,))

    # Commitando a query
    conn.commit()

    # Retornando a resposta
    return make_response(jsonify({"message": "Quest deleted"}), 200)


def closeConnection():
    conn.close()


if __name__ == "__main__":
    # Iniciando o servidor Flask
    App.run(port=5000, host="localhost", debug=True)

    # Fechando a conexão com o banco de dados
    closeConnection()
