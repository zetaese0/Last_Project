from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'  # Specify the table name explicitly
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), unique=False, nullable=False)


    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password
        self.is_active = True

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "name": self.name,
            "email": self.email,
            "is_active": True
            # do not serialize the password, it's a security breach
        }
    
class Administradores(db.Model):
    __tablename__ = 'administadores'  # Specify the table name explicitly
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), unique=False, nullable=False)
    
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password
        self.is_active = True

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id":self.id,
            "name": self.name,
            "email": self.email,
            "is_active": True
            # do not serialize the password, it's a security breach
        }




class Ofertas(db.Model):
    __tablename__ = 'Ofertas'
    id = db.Column(db.Integer, primary_key=True)
    TipoProyecto = db.Column(db.String(250), nullable=False)
    TipoEquipo = db.Column(db.String(250), nullable=False)
    Pais = db.Column(db.String(250), nullable=False)
    FechaOferta = db.Column(db.DateTime, nullable=True)
    Precio=db.Column(db.Integer, nullable=False)

    

    def serialize(self):
        return {
            "id": self.id,
            "TipoProyecto": self.TipoProyecto,
            "TipoEquipo": self.TipoEquipo,
            "Pais": self.Pais,
            "FechaOferta": self.FechaOferta,
            "Precio":self.Precio
            # Add other fields as needed
        }