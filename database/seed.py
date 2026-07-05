import uuid
from datetime import datetime
from database.models import User, Match, SessionLocal

def seed_data():
    session = SessionLocal()
    try:
        # Clear existing data
        session.query(Match).delete()
        session.query(User).delete()

        # Insert sample users
        user1 = User(
            id=uuid.uuid4(),
            email="alice@example.com",
            password_hash="hashed_password_1",
            created_at=datetime(2023, 10, 1, 12, 0, 0)
        )
        user2 = User(
            id=uuid.uuid4(),
            email="bob@example.com",
            password_hash="hashed_password_2",
            created_at=datetime(2023, 10, 2, 12, 0, 0)
        )
        user3 = User(
            id=uuid.uuid4(),
            email="charlie@example.com",
            password_hash="hashed_password_3",
            created_at=datetime(2023, 10, 3, 12, 0, 0)
        )

        session.add_all([user1, user2, user3])

        # Insert sample matches
        match1 = Match(
            id=uuid.uuid4(),
            user_id=user1.id,
            result="win",
            winner="alice@example.com",
            moves=5,
            created_at=datetime(2023, 10, 4, 12, 0, 0)
        )
        match2 = Match(
            id=uuid.uuid4(),
            user_id=user2.id,
            result="draw",
            winner=None,
            moves=9,
            created_at=datetime(2023, 10, 5, 12, 0, 0)
        )
        match3 = Match(
            id=uuid.uuid4(),
            user_id=user3.id,
            result="loss",
            winner="bob@example.com",
            moves=7,
            created_at=datetime(2023, 10, 6, 12, 0, 0)
        )

        session.add_all([match1, match2, match3])
        session.commit()
    finally:
        session.close()