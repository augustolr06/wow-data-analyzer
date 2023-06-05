import psycopg2
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
import dotenv
import os
from collections import OrderedDict
import json

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

# GET: retorna todas as quests -------------------------------------------------------------------
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
# -----------------------------------------------------------------------------------------------

# GET: retorna a quest com o id <id> -------------------------------------------------------------


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
# -----------------------------------------------------------------------------------------------

# GET: Retorna todas as quests de acordo com uma quantidade de filtros ---------------------------


@App.route("/api/quests/filter", methods=["GET"])
def getQuestsFilter():
    # obetendo os dados do body da requisição
    data = request.args

    # reescrevendo a query acima utilizando f-strings
    sql = "SELECT * FROM quest WHERE "
    for key in data:
        if key == "id":
            sql += f"titulo LIKE {data[key]} AND "
        elif key == "area":
            sql += f"area = {data[key]} AND "
        else:
            sql += f"{key} = '{data[key]}' AND "
    sql = sql[:-5]

    # Executando a query
    cursor = conn.cursor()
    cursor.execute(sql)

    # Recuperando os resultados
    records = cursor.fetchall()

    # Transformando os resultados em um objeto quests com uma lista de quests
    quests = []
    for record in records:
        quest = OrderedDict([
            ("id", record[0]),
            ("titulo", record[1]),
            ("descricao", record[2]),
            ("categoria", record[3]),
            ("area", record[4]),
            ("tipo", record[5])
        ])
        quests.append(quest)

    # Devolvendo a resposta
    return make_response(json.dumps(quests, ensure_ascii=False, sort_keys=False), 200)
# -----------------------------------------------------------------------------------------------


def closeConnection():
    conn.close()


if __name__ == "__main__":
    # Iniciando o servidor Flask
    App.run(port=5000, host="localhost", debug=True)

    # Fechando a conexão com o banco de dados
    closeConnection()
