from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import UniqueConstraint
db = SQLAlchemy()


class Book(db.Model):
    """Book added to db"""
    # Possible to add constraint to two columns
    __tablename__ = "books"

    id = db.Column(db.Integer,
                   autoincrement=True,
                   primary_key=True)
    title = db.Column(db.String(250),
                      nullable=False)
    author = db.Column(db.String(50))
    UniqueConstraint(title, author)

    def __repr__(self):
        return "<Book id={} title={} author={}>".format(self.id, self.title, self.author)


class Genre(db.Model):
    """Genres added to db"""

    __tablename__ = "genres"
    id = db.Column(db.Integer,
                   autoincrement=True,
                   primary_key=True)
    genre = db.Column(db.String(25),
                      unique=True)

    def __repr__(self):
        return "<Genre id={} genre={}>".format(self.id, self.genre)


class BookGenre(db.Model):
    """Relational table of books with their genre"""

    __tablename__ = "books_genres"
    id = db.Column(db.Integer,
                   autoincrement=True,
                   primary_key=True)
    book_id = db.Column(db.Integer,
                        db.ForeignKey('books.id'),
                        nullable=False)
    genre_id = db.Column(db.Integer,
                         db.ForeignKey('genres.id'),
                         nullable=False)

    def __repr__(self):
        return "<BookGenre id={} Book id={} Genre id={}>".format(
            self.id, self.book_id, self.genre_id)


class User(db.Model):
    """Users added to the db"""

    __tablename__ = "users"
    id = db.Column(db.Integer,
                   autoincrement=True,
                   primary_key=True)
    fname = db.Column(db.String(25))
    lname = db.Column(db.String(25))
    email = db.Column(db.String(50))
    password = db.Column(db.String(25))

    def __repr__(self):
        return "<User id={} fname={} lname{} email={} password{}>".format(
            self.id, self.fname, self.lname, self.email, self.password)


class BookUser(db.Model):
    """User and their books"""

    ___tablename___ = "book_users"
    id = db.Column(db.Integer,
                   autoincrement=True,
                   primary_key=True)
    user_id = db.Column(db.Integer,
                        db.ForeignKey('users.id'),
                        nullable=False)
    book_id = db.Column(db.Integer,
                        db.ForeignKey('books.id'),
                        nullable=False)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    UniqueConstraint(user_id, book_id)

    def __repr__(self):
        return "<BookUser id={} User id={} Book id={}>".format(
            self.id, self.user_id, self.book_id)


# class Meeting(db.Model):
#     """Meetings added to the db"""

#     __tablename__ = "meetings"
#     id = db.Column(db.Integer,
#                    autoincrement=True,
#                    primary_key=True)
#     month = db.Column(db.String(9))
#     year = db.Column(db.Integer)

#     def __repr__(self):
#         return "<Meeting id={} month={} year={}>".format(
#             self.id, self.month, self.year)


# class UserMeeting(db.Model):
#     """Users at a Meeting"""

#     __tablename__ = "user_meetings"
#     id = db.Column(db.Integer,
#                    autoincrement=True,
#                    primary_key=True)
#     user_id = db.Column(db.Integer,
#                         db.ForeignKey('users.id'),
#                         nullable=False)
#     meeting_id = db.Column(db.Integer,
#                            db.ForeignKey('meetings.id'),
#                            nullable=False)

#     def __repr__(self):
#         return "<UserMeeting id={} user_id={} meeting_id={}>".format(
#             self.id, self.user_id, self.meeting_id)


# class MeetingBook(db.Model):
#     """Books at a Meeting"""

#     __tablename__ = "meeting_books"
#     id = db.Column(db.Integer,
#                    autoincrement=True,
#                    primary_key=True)
#     meeting_id = db.Column(db.Integer,
#                            db.ForeignKey('meetings.id'),
#                            nullable=False)
#     book_id = db.Column(db.Integer,
#                         db.ForeignKey('books.id'),
#                         nullable=False)

#     def __repr__(self):
#         return "<MeetingBook id={} meeting_id={} book_id{}>".format(
#             self.id, self.meeting_id, self.book_id)


##############################################################################
# Helper functions

def connect_to_db(app):
    """Connect the database to our Flask app."""

    # Configure to use our PstgreSQL database
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///books'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.app = app
    db.init_app(app)


if __name__ == "__main__":
    # As a convenience, if we run this module interactively, it will leave
    # you in a state of being able to work with the database directly.

    from server import app
    connect_to_db(app)
    print("Connected to DB.")
