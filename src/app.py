"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User, Ofertas
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_cors import CORS
from flask_jwt_extended import JWTManager

# from models import Person



ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

app.config["JWT_SECRET_KEY"] = "L@t@m-21"  # Change this!
jwt = JWTManager(app)

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type = True)
db.init_app(app)

# Allow CORS requests to this API
CORS(app)
CORS(app, resources={r"/api/*": {"origins": "https://didactic-tribble-979j6wrrgg9vhpg7p-3000.app.github.dev"}})




# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file





# Get all users
@app.route('/user', methods=['GET'])
def get_users():
    all_users = User.query.all()
    results = list(map(lambda user: user.serialize(), all_users))
    response_body = {
        "msg": "GET /user response",
        "data": results
    }
    return jsonify(response_body), 200


@app.route('/ofertas', methods=['GET'])
def get_ofertas():
    all_ofertas= Ofertas.query.all()
    results = list(map(lambda oferta: oferta.serialize(), all_ofertas))
    response_body = {
        "msg": "GET /ofertas response",
        "data": results
    }
    return jsonify(response_body), 200

@app.route('/ofertas/<int:oferta_id>', methods=['GET'])
def get_oferta(oferta_id):
    # Retrieve the oferta from the database by its ID
    oferta = Ofertas.query.get(oferta_id)

    # Check if the oferta with the given ID exists
    if not oferta:
        return jsonify({"error": "Oferta not found"}), 404

    # Return the serialized oferta in the response
    response_body = {
        "msg": f"GET /ofertas/{oferta_id} response",
        "data": oferta.serialize()
    }
    return jsonify(response_body), 200



@app.route('/ofertas', methods=['POST'])
def add_new_oferta():
    request_body = request.json

    # Check if 'FechaOferta' is present in the request JSON
    if 'FechaOferta' not in request_body or request_body['FechaOferta'] == "":
        # If not provided, set it to None (null)
        request_body['FechaOferta'] = None


    new_oferta = Ofertas(
        TipoProyecto=request_body['TipoProyecto'],
        TipoEquipo=request_body['TipoEquipo'],
        Pais=request_body['Pais'],
        FechaOferta=request_body['FechaOferta'],
        Precio=request_body['Precio']
    )

    db.session.add(new_oferta)
    db.session.commit()

    response_body = {"msg": "Oferta added successfully", "data": new_oferta.serialize()}
    return jsonify(response_body), 201  # 201 Created status code


@app.route('/ofertas/<int:oferta_id>', methods=['PUT'])
def update_oferta(oferta_id):
    # Retrieve the existing oferta from the database
    oferta = Ofertas.query.get(oferta_id)
    print("PRUEBA")

    # Check if the oferta with the given ID exists
    if not oferta:
        return jsonify({"error": "Oferta not found"}), 404

    # Get the updated data from the request JSON
    updated_data = request.json

    # Update the oferta fields with the new data
    oferta.TipoProyecto = updated_data.get('TipoProyecto', oferta.TipoProyecto)
    oferta.TipoEquipo = updated_data.get('TipoEquipo', oferta.TipoEquipo)
    oferta.Pais = updated_data.get('Pais', oferta.Pais)
    oferta.FechaOferta = updated_data.get('FechaOferta', oferta.FechaOferta)
    oferta.Precio = updated_data.get('Precio', oferta.Precio)

    # Commit the changes to the database
    db.session.commit()

    # Return the updated oferta in the response
    response_body = {
        "msg": f"Oferta with ID {oferta_id} updated successfully",
        "data": oferta.serialize()
    }
    return jsonify(response_body), 200



@app.route('/ofertas/<int:oferta_id>', methods=['DELETE'])
def delete_oferta(oferta_id):
    # Retrieve the oferta from the database by its ID
    oferta = Ofertas.query.get(oferta_id)

    # Check if the oferta with the given ID exists
    if not oferta:
        return jsonify({"error": "Oferta not found"}), 404

    # Delete the oferta from the database
    db.session.delete(oferta)
    db.session.commit()

    # Return a success message in the response
    response_body = {
        "msg": f"DELETE /ofertas/{oferta_id} response",
        "data": {"status": "success", "message": f"Oferta with ID {oferta_id} deleted successfully"}
    }
    return jsonify(response_body), 200






@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
