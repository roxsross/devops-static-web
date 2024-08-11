from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField

class AddForm(FlaskForm):
    title = StringField('Name of Book: ')
    author = StringField('Name of Author: ')
    publisher = StringField('Name of Publisher: ')
    available = StringField('Note for Availability: ')
    submit = SubmitField('Add Book')

class DelForm(FlaskForm):
    id = IntegerField("Id Number of Book to Remove: ")
    submit = SubmitField('Remove Book')
    
