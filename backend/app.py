from flask import *
from flask_sqlalchemy import SQLAlchemy
import uuid
from functools import wraps

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SECRET_KEY'] = "kjigjeriogerigsiejgiosjergj7Z37843"

db = SQLAlchemy(app)

def gen_key():
    return (str(uuid.uuid4().hex))[:-12]

def request_format(keys):
    def deco(f):
        @wraps(f)
        def inner(*args, **kwargs):
            for x in keys:
                if x not in request.json:
                    return {"response":f"{x} key missing"}, 400
                return f(*args, **kwargs)
        return inner
    return deco

class Template(db.Model):
    id = db.Column(db.String(20), nullable=False, primary_key=True, default=gen_key)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.String(2000), nullable=False, unique=True)
    scheme_available = db.Column(db.Boolean, default=False)

class Node(db.Model):
    id = db.Column(db.String(20), nullable=False, primary_key=True, default=gen_key)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.String(2000), nullable=False, unique=True)
    upper = db.Column(db.String(20), db.ForeignKey('node.id'))

@request_format(["name", "descr"])
@app.route('/new_template', methods=["POST"])
def new_template():
    name = request.json["name"]
    descr = request.json["descr"]

    new_templ = Template(name=name, description=descr)
    db.session.add(new_templ)
    db.session.commit()

    return {"id": new_templ.id}, 200

@request_format(["name", "descr", "upper"])
@app.route('/new_node', methods=["POST"])
def new_node():
    name = request.json["name"]
    descr = request.json["descr"]
    upper = request.json["upper"]

    new_node = Node(name=name, description=descr, upper=upper)
    db.session.add(new_node)
    db.session.commit()

    return {"id": new_node.id}, 200

@app.route('/get_templates', methods=["POST"])
def get_templates():
    get_temp = [{"id": x.id, "name": x.name, "descr": x.description} for x in Template.query.all()]

    return get_temp, 200

@request_format(["upper"])
@app.route('/get_nodes', methods=["POST"])
def get_projects():
    upper = request.json["upper"]

    get_proj = [{"id": x.id, "name": x.name, "descr": x.description} for x in Node.query.filter_by(upper=upper).all()]

    return get_proj, 200

@request_format(["id"])
@app.route('/view_template', methods=["POST"])
def view_template():
    id = request.json["id"]
    temp = Template.query.filter_by(id=id).first()
    if temp.scheme_available:
        with open(f"scheme/{temp.id}", "r") as file:
            scheme = file.read()
        with open(f"ui_scheme/{temp.id}", "r") as file:
            ui_scheme = file.read()
    else:
        scheme = "{}"
        ui_scheme = "{}"

    temp_data = {"id": temp.id, "name": temp.name, "descr": temp.description, "scheme": scheme, "ui_scheme": ui_scheme}
    return temp_data, 200

@request_format(["id"])
@app.route('/view_node', methods=["POST"])
def view_node():
    id = request.json["id"]
    node = Node.query.filter_by(id=id).first()

    node_data = {"id": node.id, "name": node.name, "descr": node.description}
    return node_data, 200

@request_format(["id"])
@app.route('/get_scheme_form', methods=["POST"])
def get_scheme_form():
    id = request.json["id"]
    temp = Template.query.filter_by(id=id).first()
    if temp.scheme_available:
        return {"scheme": "{hello}", "ui_scheme": "{}"}, 200
    else:
        return {"scheme": "{world}", "ui_scheme": "{}"}, 200

@request_format(["id", "scheme", "ui_scheme"])
@app.route('/save_scheme_form', methods=["POST"])
def save_scheme_form():
    id = request.json["id"]
    scheme = request.json["scheme"]
    ui_scheme = request.json["ui_scheme"]

    temp = Template.query.filter_by(id=id).first()
    with open(f"scheme/{temp.id}", "w") as file:
        file.write(scheme)
    with open(f"ui_scheme/{temp.id}", "w") as file:
        file.write(ui_scheme)

    temp.scheme_available = True
    db.session.commit()

    return {}, 200


if __name__ == '__main__':
    app.run(debug=True)

