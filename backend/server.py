
from flask import (Flask, jsonify, redirect, request, session)
from flask_api import status
# from Flask-DebugToolbar import DebugToolbarExtension
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from model import User, Book, BookUser, Genre, BookGenre, connect_to_db, db
from data.keys.secret_keys import flask
from random import choice

################################################################################
################################# SETUP ####################################### 
################################################################################

app = Flask(__name__)
cors = CORS(app, resources={
    r"/*": {r"supports_credentials": True, r"origins": r"http://localhost:3000"}})

# Required to use Flask sessions and the debug toolbar
app.secret_key = flask.secret


@app.after_request
def after(response):
    """Adds headers to all responses to satisfy CORS."""
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response


################################################################################
############################## GENERAL ROUTES ##################################
################################################################################


@app.route('/get-title', methods=['POST'])
@cross_origin()
def get_title():
    data = request.get_json()
    print(data)

    book = Book.query.get(data["id"])
    return jsonify(book.title)


@app.route('/get-name', methods=['POST'])
@cross_origin()
def get_username():
    data = request.get_json()
    print(data)

    user = User.query.get(data["id"])
    return jsonify(user.fname)


@app.route('/get-userid', methods=['GET'])
@cross_origin()
def get_userid():
    print(session)
    return jsonify(session['user_id'])


################################################################################
############################## HOME ROUTES #################################### 
################################################################################

@app.route('/')
def index():
    """Randomly choose quotation rendered on homepage"""

    quotes = [
        "“If you go home with somebody, and they don't have books, don't fuck 'em!” - John Waters", 
        '“Never trust anyone who has not brought a book with them.” – Lemony Snicket',
        '"People say that life is the thing, but I prefer reading." — Logan Pearsall Smith',
        '"Reading is a discount ticket to everywhere." — Mary Schmich',
        '"A book is a dream you hold in your hands." — Neil Gaiman',
        '“Reading one book is like eating one potato chip.” – Diane Duane',
        '“Books are a uniquely portable magic.” – Stephen King',
        '“People can lose their lives in libraries. They ought to be warned.” – Saul Bellow',
        '“Once you have read a book you care about, some part of it is always with you.” – Louis L’Amour',
        '“Literature is the most agreeable way of ignoring life.” – Fernando Pessoa',
        '"Always read something that will make you look good if you die in the middle of it.” – P.J. O’Rourke',
        '“You know you’ve read a good book when you turn the last page and feel a little as if you have lost a friend.” – Paul Sweeney',
        '“Some books leave us free and some books make us free.” – Ralph Waldo Emerson',
        '“Once you learn to read, you will be forever free.” – Frederick Douglas',
        '“To learn to read is to light a fire; every syllable that is spelled out is a spark.” – Victor Hugo',
        '“A book is a gift you can open again and again.” – Garrison Keillor',
        '“I have always imagined that paradise will be a kind of library.” – Jorge Luis Borges',
        '“Reading is a discount ticket to everywhere.” – Mary Schmich',
        '“If you are going to get anywhere in life you have to read a lot of books.” – Roald Dahl',
        '“I guess there are never enough books.” – John Steinbeck',
        '“Libraries will get you through times of no money better than money will get you through times of no libraries.” – Anne Herbert',
        '“I intend to put up with nothing that I can put down.” – Edgar Allan Poe',
        '“Reading for me, is spending time with a friend.” – Gary Paulsen',
        '“Never put off till tomorrow the book you can read today.” – Holbrook Jackson',
        '“What kind of life can you have in a house without books?” – Sherman Alexie'
        ]

    quote = choice(quotes)
    return jsonify({'quote': quote})


@app.route('/register', methods=['POST'])
@cross_origin()
def register():
    """Registers new user, adds them to db"""

    data = request.get_json()
    print(data)

    q = User.query.filter(User.email == data["email"])
    if q.count() > 0:
        return jsonify("User already exists")
    else:
        new_user = User(
            fname=data["fname"], lname=data["lname"], email=data["email"], password=data["password"])
        session['user_id'] = new_user.id
        db.session.add(new_user)
        db.session.commit()
        return jsonify("User successfully added to db")


@app.route('/login', methods=['POST'])
@cross_origin()
def login():
    """Validates user's login info"""
    data = request.get_json()
    print(data)

    q = User.query.filter(User.email == data["email"])

    if q.count() > 0:
        q = User.query.filter((User.email == data["email"]) & (
            User.password == data["password"]))
        if q.count() > 0:
            user = q.one()
            session['user_id'] = user.id
            return jsonify("Login successful"), status.HTTP_202_ACCEPTED
        else:
            return jsonify("Invalid credentials"), status.HTTP_401_UNAUTHORIZED
    else:
        return jsonify("User does not exist"), status.HTTP_401_UNAUTHORIZED


@app.route('/logout', methods=['POST'])
@cross_origin()
def logout():
    """Remove user from session"""

    session.clear()
    return jsonify("User has been logged out")


################################################################################
############################## BOOK ROUTES #################################### 
################################################################################

############################ BOOK CRUD CYCLE ###################################


@app.route('/get-your-books', methods=['GET'])
@cross_origin()
def get_your_books():
    """Query db for logged in user's books"""

    books = []
    print("session id: {}".format(session['user_id']))

    if 'user_id' in session:
        q = BookUser.query.filter(BookUser.user_id == session['user_id']).all()
        for i in q:
            book = Book.query.get(i.book_id)
            books.append(
                {'title': book.title, 'author': book.author, 'id': book.id})
        print(books)
    return jsonify(books)


@app.route('/add-book', methods=['POST'])
@cross_origin()
def add_book():
    """Add new book to db"""

    data = request.get_json()
    print(data)
    print("session id: {}".format(session['user_id']))

    q = Book.query.filter((Book.title == data["title"]) & (
        Book.author == data["author"]))
    if q.count() > 0:
        book = q.one()
        new_user_book = BookUser(book_id=book.id, user_id=session['user_id'])
        db.session.add(new_user_book)
        db.session.commit()
        book = {'title': data["title"],
                'author': data["author"], 'id': book.id}
        return jsonify(book)

    else:
        new_book = Book(title=data['title'], author=data['author'])
        db.session.add(new_book)
        db.session.commit()
        new_user_book = BookUser(
            book_id=new_book.id, user_id=session['user_id'])
        db.session.add(new_user_book)
        db.session.commit()
        book = {'title': data["title"],
                'author': data["author"], 'id': new_book.id}
        return jsonify(book)


@app.route('/delete-book', methods=["POST"])
def delete_book():
    """Remove Book from db"""

    data = request.get_json()
    print(data)
    print(session)

    user_book = BookUser.query.filter(BookUser.book_id == data["id"]).one()
    db.session.delete(user_book)
    print(user_book)
    db.session.commit()
    return jsonify("Book successfully deleted")


@app.route('/update-book', methods=["POST"])
@cross_origin()
def update_book():
    """Update book in db"""

    data = request.get_json()
    print(data)
    print(session['user_id'])

    # Check if other users are reading the title
    q = BookUser.query.filter(BookUser.book_id == data["id"])
    # Check if the book already exists in the db
    q2 = Book.query.filter((Book.title == data["newTitle"]) & (
        Book.author == data["newAuthor"]))

    # move q2 logic first
    # only need one else

    # if q2.count() == 1: 
    #     if q.count() == 1

    if q.count() == 1:
        if q2.count() == 1:
            book = q2.one()
            new_book = BookUser(book_id=book.id, user_id=session['user_id'])
            db.session.add(new_book)
            db.session.commit()
            book = {'title': book.title,
                    'author': book.author, 'id': book.id}
            return jsonify(book)
        else:
            new_book = Book(title=data["newTitle"], author=data["newAuthor"])
            db.session.add(new_book)
            db.session.commit()
            new_user_book = BookUser(
                book_id=new_book.id, user_id=session['user_id'])
            db.session.add(new_user_book)
            old_user_book = BookUser.query.filter(
                (BookUser.user_id == session["user_id"]) & (BookUser.book_id == data["id"])).one()
            db.session.commit()
            db.session.delete(old_user_book)
            db.session.commit()
            book = {'title': data["newTitle"],
                    'author': data["newAuthor"], 'id': new_book.id}
            return jsonify(book)
    else:
        if q2.count() == 1:
            book = q2.one()
            print(book)
            new_book = BookUser(book_id=book.id, user_id=session['user_id'])
            db.session.add(new_book)
            db.session.commit()
            book = {'title': book.title,
                    'author': book.author, 'id': book.id}
            return jsonify(book)
        else:
            book = Book.query.get(data["id"])
            book.title = data["newTitle"]
            book.author = data["newAuthor"]
            db.session.commit()
            book = {'title': data["newTitle"],
                    'author': data["newAuthor"], 'id': book.id}
            return jsonify(book)


############################ ADDITIONAL BOOK PATHS #############################
################################## GENRE #######################################


@app.route('/get-genres', methods=['GET'])
@cross_origin()
def get_genres():
    "Query db for all genres"

    genres = []
    q = Genre.query.all()
    for i in q:
        genres.append({'text': i.genre, 'value': i.id})

    return jsonify(genres)


@app.route('/get-bookgenres', methods=['POST'])
@cross_origin()
def get_bookgenres():
    """Get all genres associated with a book's id"""

    data = request.get_json()
    print(data)

    genres = []
    q = BookGenre.query.filter(BookGenre.book_id == data['id'])

    for i in q.all():
        genre = Genre.query.get(i.genre_id)
        genres.append({'genre': genre.genre})
    print(genres)
    return jsonify(genres)


@app.route('/set-genres', methods=['POST'])
@cross_origin()
def set_genres():
    """Adds new BookGenre entries"""

    data = request.get_json()
    print(data)

    for genre in data["genres"]:
        new_book_genre = BookGenre(book_id=data["id"], genre_id=genre["value"])
        db.session.add(new_book_genre)
    db.session.commit()
    return jsonify("Genres added")


################################### DATES ######################################


@app.route('/get-start-date', methods=['POST'])
@cross_origin()
def get_start_date():
    """Query db for reading date user began reading a title"""

    data = request.get_json()
    print(data)

    book_user = BookUser.query.filter((BookUser.book_id==data['book_id']) & (BookUser.user_id==data['id'])).one()
    return jsonify(book_user.start_date)


@app.route('/book/set-start-date', methods=['POST'])
@cross_origin()
def set_start_date():
    """Add date user began reading title to db"""

    data = request.get_json()
    print(data)

    book = BookUser.query.filter(BookUser.book_id == data["id"]).one()
    book.start_date = data["start"]
    db.session.commit()
    return jsonify("Start date added")


@app.route('/get-end-date', methods=['POST'])
@cross_origin()
def get_end_date():
    """Query db for date user finished reading a title"""

    data = request.get_json()
    print(data)

    book_user = BookUser.query.filter((BookUser.book_id==data['book_id']) & (BookUser.user_id==data['id'])).one()
    return jsonify(book_user.end_date)


@app.route('/book/set-end-date', methods=['POST'])
@cross_origin()
def set_end_date():
    """Add date user completed reading a title to db"""

    data = request.get_json()
    print(data)

    book = BookUser.query.filter(BookUser.book_id == data["id"]).one()
    book.end_date = data["end"]
    db.session.commit()
    return jsonify("End date added")

############################ BOOK CRUD CYCLE ###################################
@app.route('/get-readers', methods=['POST'])
@cross_origin()
def get_readers():
    """Query db for other users reading title"""

    data = request.get_json()
    print(data)

    readers = []
    q = BookUser.query.filter(BookUser.book_id==data['book_id'])

    if q.count() > 1:
        for i in q.all():
            print(i.user_id)
            if int(i.user_id) != int(data['id']):
                user = User.query.get(i.user_id)
                reader = {"name": user.fname, "id": user.id}
                readers.append(reader)
    return jsonify(readers)

@app.route('/get-authorization', methods=['POST'])
@cross_origin()
def get_authorization():
    """Confirm url param matches id in session"""

    data = request.get_json()
    print(data)

    if int(data['id']) == session['user_id']:
        return jsonify("woo"), status.HTTP_200_OK
    else:
        return jsonify("nope"), status.HTTP_401_UNAUTHORIZED


################################################################################
############################## USER ROUTES #################################### 
################################################################################


@app.route('/get-users', methods=['GET'])
@cross_origin()
def get_users():
    """Return list of users from db."""

    users = []
    print("session id: {}".format(session['user_id']))

    q = User.query.all()
    print(q)
    for user in q:
        if user.id != session['user_id']:
            users.append({'name': user.fname, 'id': user.id})
    return jsonify(users)


@app.route('/get-user-books', methods=['POST'])
@cross_origin()
def get_user_books():
    """Query db for a user's books"""

    data = request.get_json()
    print(data)

    books = []
    q = BookUser.query.filter(BookUser.user_id == data['id']).all()
    
    for i in q:
        book = Book.query.get(i.book_id)
        books.append(
            {'title': book.title, 'author': book.author, 'id': book.id})
    print(books)
    return jsonify(books)


if __name__ == "__main__":
    # We have to set debug=True here, since it has to be True at the
    # point that we invoke the DebugToolbarExtension
    app.debug = True

    connect_to_db(app)

    # Use the DebugToolbar
    # DebugToolbarExtension(app)

    app.run(port=5000, host='0.0.0.0')
