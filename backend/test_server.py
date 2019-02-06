import os
import tempfile

import pytest

import server


@pytest.fixture
def client():
    db_fd, server.app.config['DATABASE'] = tempfile.mkstemp()
    server.app.config['TESTING'] = True
    client = server.app.test_client()

    with server.app.app_context():
        server.connect_to_db(server.app)

    yield client

    os.close(db_fd)
    os.unlink(server.app.config['DATABASE'])


def test_empty_db(client):
    """Start with blank db."""

    rv = client.get('/')
    assert b'No entries here so far' in rv.data
