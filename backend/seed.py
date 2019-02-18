import csv
from model import Book, User, Genre, BookUser, BookGenre, connect_to_db, db
from server import app
import requests
from data.keys.secret_keys import nytimes


def load_users():
    """Load users into db"""

    print("Users")

    # Delete row to avoid duplicates
    User.query.delete()

    user_rows = csv.DictReader(open('data/user_data.csv'))
    for user in user_rows:
        new_user = User(fname=user["fname"],
                        lname=user["lname"],
                        email=user["email"],
                        password=user["password"])
        db.session.add(new_user)
    db.session.commit()


def load_books():
    """Load books from into db"""

    print("Books")

    # Delete row to avoid duplicates
    Book.query.delete()

    book_rows = csv.DictReader(open('data/book_data.csv'))
    for book in book_rows:
        q = Book.query.filter((Book.title.like('%{}%'.format(
            book["title"])) & (Book.author == book["author"])))
        if q.first() is None:
            new_book = Book(title=book["title"],
                            author=book["author"])
            db.session.add(new_book)
    db.session.commit()


def load_genres():
    """Load genres into db"""

    print("Genres")

    # Delete row to avoid duplicates
    Genre.query.delete()

    for row in (open('data/genres.csv')):
        row = row.rstrip()
        new_genre = Genre(genre=row)
        db.session.add(new_genre)
    db.session.commit()


def load_user_books():
    """Load a user's books into db"""

    print("BookUser")

    # Delete row to avoid duplicates
    BookUser.query.delete()

    bookuser_rows = csv.DictReader(open('data/bookuser.csv'))

    for bookuser in bookuser_rows:
        print(bookuser["title"])
        user = User.query.filter(User.fname == bookuser["fname"]).one()
        book = Book.query.filter(Book.title == bookuser["title"]).one()

        new_bookuser = BookUser(user_id=user.id,
                                book_id=book.id,
                                start_date=bookuser["start"],
                                end_date=bookuser["end"])
        db.session.add(new_bookuser)
    db.session.commit()


def load_bookgenre():
    """load bookgenres into db"""

    print("BookGenre")

    # Delete row to avoid duplicates
    BookGenre.query.delete()

    bookgenre_rows = csv.DictReader(open('data/bookgenre.csv'))

    for bookgenre in bookgenre_rows:
        print(bookgenre["genre"])
        book = Book.query.filter(Book.title == bookgenre["book"]).one()
        genre = Genre.query.filter(Genre.genre == bookgenre["genre"]).one()

        new_bookgenre = BookGenre(book_id=book.id,
                                  genre_id=genre.id)
        db.session.add(new_bookgenre)
    db.session.commit()


def get_bestsellers():
    """Get bestseller history from NYT Books API"""

    print("BestSellers")
    payload = {'api-key': nytimes.key}

    r = requests.get(
        'https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json', params=payload)

    r = r.json()

    for result in r["results"]:
        new_book = Book(title=result["title"], author=result["author"])
        db.session.add(new_book)
    db.session.commit()


if __name__ == "__main__":
    connect_to_db(app)
    print(db)

    # In case tables haven't been created, create them

    db.create_all()

    # Import different types of data

    load_users()
    load_books()
    load_genres()
    load_user_books()
    load_bookgenre()
    get_bestsellers()
