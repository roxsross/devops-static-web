import os
from forms import AddForm, DelForm
from flask import  Flask, render_template, url_for, redirect
from flask_sqlalchemy import SQLAlchemy
#from flask_migrate import Migrate

app = Flask(__name__)

app.config['SECRET_KEY'] = 'mysecretkey'

## SQL DATABASE SECTION

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///'+os.path.join(basedir, 'data.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
#Migrate(app, db)

## MODELS

class Book(db.Model):
     __tablename__ = 'books'
     id = db.Column(db.Integer, primary_key = True)
     title = db.Column(db.Text)
     author = db.Column(db.Text)
     publisher = db.Column(db.Text)
     available = db.Column(db.Text)

     def __init__(self, title, author, publisher, available):
         self.title = title
         self.author = author
         self.publisher = publisher
         self.available = available

     def __repr__(self):
        return "ID: {} Book name: {}, Author name: {}, Publisher name: {}, Availability: {}".format(self.id, self.title, self.author, self.publisher, self.available)

## VIEW FUNCTIONS -- HAVE FORMS
with app.app_context():
    db.create_all()
@app.route('/')
def index():
    return render_template('home.html')

@app.route('/add', methods=['GET', 'POST'])
def add_book():
    form = AddForm()

    if form.validate_on_submit():
        new_book = Book(form.title.data, form.author.data, form.publisher.data, form.available.data)
        db.session.add(new_book)
        db.session.commit()
        return redirect(url_for('list_book'))
    return render_template('add.html', form=form)

@app.route('/list')
def list_book():
    books = Book.query.all()
    return render_template('list.html', books=books)

@app.route('/delete', methods=['GET', 'POST'])
def del_book():
    form = DelForm()

    if form.validate_on_submit():
        id = form.id.data
        book = Book.query.get(id)
        db.session.delete(book)
        db.session.commit()
        return redirect(url_for('list_book'))
    return render_template('delete.html', form=form)

if __name__ == '__main__':
    app.run(debug=True)
