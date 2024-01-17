from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
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