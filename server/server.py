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

# Criando os endpoints:
# GET: retorna todas as quests -------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------

# GET: retorna toda a quest com o id especificado -------------------------------------------------
# ------------------------------------------------------------------------------------------------

# GET: retorna todas as quests com os filtros especificados ---------------------------------------
# Esse endpoint devolve apenas os dados das quests. A tabela quest possui chaves estrangeiras para cada tabela de filtro, então é necessário fazer um join com cada tabela de filtro para pegar os dados de cada filtro.


@App.route("/api/quests/filters", methods=["GET"])
def getQuestsByFilters():
    query = "SELECT q.id, q.title, q.area, q.description, q.requirements, q.rewards FROM Quest q"
    # Convertendo os parâmetros da URL em um dicionário. Ex: ?quest.title=titulo%20da%20quest&requirements.money=5000&requirements.level=10&rewards.faction=1&rewards.minCharacterLevel=10 -> {"quest.title": "titulo da quest", "requirements.money": "5000", "requirements.level": "10", "rewards.faction": "1", "rewards.minCharacterLevel": "10"}
    filtersParams = request.args.to_dict()
    # pegando cada chave do dicionário e verificar qual a tabela que ela pertence, adicionando em uma lista de tabelas, adicionando um quest_ no começo de do nome das tabelas rewards e requirements, apenas. Se houver outras tabelas, adicionar o nome delas na lista de tabelas. Ex: {"quest.title": "titulo da quest", "requirements.money": "5000", "requirements.level": "10", "rewards.faction": "1", "rewards.minCharacterLevel": "10"} -> ["quest", "requirements", "rewards"]
    tablesName = []
    questsForeignKeys = []
    # tablesName deve conter um quest_ no começo do nome das tabelas rewards e requirements, apenas. Ex: ["quest", "requirements", "rewards"]
    # QuestsForeignKeys deve conter o nome das tabelas rewards e requirements, apenas. Ex: ["requirements", "rewards"]
    for key in filtersParams.keys():
        keySplit = key.split(".")
        table = keySplit[0]
        if table == 'quest':
            continue
        if table == "rewards" or table == "requirements":
            tableAux = "quest_" + table
            if tableAux not in tablesName:
                tablesName.append(tableAux)
                questsForeignKeys.append(table)
        else:
            if table not in tablesName:
                tablesName.append(table)
                questsForeignKeys.append(table)

    # adicionando os joins na query
    for table in tablesName:
        query += f" JOIN {table}"
    for foreignKey in questsForeignKeys:
        query += f" q.{foreignKey} = {foreignKey}.id AND"
    query = query[:-4]

    # adicionando os filtros na query
    for key in filtersParams.keys():
        keySplit = key.split(".")
        table = keySplit[0]
        column = keySplit[1]
        value = filtersParams[key]
        if table == "rewards" or table == "requirements":
            table = "quest_" + table
        query += f" WHERE {table}.{column} = '{value}'"

    print(query)

    # executando a query
    cursor = conn.cursor()
    cursor.execute(query)

    # pegando os dados da query
    quests = cursor.fetchall()

    # fechando o cursor
    cursor.close()

    # retornando os dados da query
    return jsonify(quests)


# ------------------------------------------------------------------------------------------------

# GET: retorna todos os itens --------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------

# GET: retorna todos os itens com o id especificado -----------------------------------------------
# ------------------------------------------------------------------------------------------------


def closeConnection():
    conn.close()


if __name__ == "__main__":
    # Iniciando o servidor Flask
    App.run(port=5000, host="localhost", debug=True)

    # Fechando a conexão com o banco de dados
    closeConnection()

    # for key in filtersParams.keys():
    #     keySplit = key.split(".")
    #     table = keySplit[0]
    #     if table == "rewards" or table == "requirements":
    #         table = "quest_" + table
    #     if table not in tables:
    #         tables.append(table)

    # # adicionando os joins na query
    # for table in tables:
    #     query += f" JOIN {table} ON q.{table} = {table}.id"

    # # adicionando os filtros na query
    # for key in filtersParams.keys():
    #     keySplit = key.split(".")
    #     table = keySplit[0]
    #     column = keySplit[1]
    #     value = filtersParams[key]
    #     if table == "rewards" or table == "requirements":
    #         table = "quest_" + table
    #     query += f" WHERE {table}.{column} = '{value}'"
