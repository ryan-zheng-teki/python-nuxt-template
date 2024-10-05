import pytest
from sqlalchemy.exc import IntegrityError
from repository_sqlalchemy.transaction_management import transaction

from linda_server.db.repositories.user_repository import UserRepository
from linda_server.services.user_service import UserService


def test_create_user(user_service):
    with transaction() as session:
        user = user_service.create_user("testuser", "test@example.com", "Test User")
        assert user.id is not None
        assert user.username == "testuser"
        assert user.email == "test@example.com"
        assert user.full_name == "Test User"
        session.rollback()


def test_find_user_by_id(user_service):
    with transaction() as session:
        user = user_service.create_user("testuser", "test@example.com", "Test User")
        found_user = user_service.find_user_by_id(user.id)
        assert found_user is not None
        assert found_user.id == user.id
        assert found_user.username == "testuser"
        session.rollback()


def test_find_all_users(user_service):
    with transaction() as session:
        user_service.create_user("user1", "user1@example.com", "User One")
        user_service.create_user("user2", "user2@example.com", "User Two")
        all_users = user_service.find_all_users()
        assert len(all_users) == 2
        assert all_users[0].username == "user1"
        assert all_users[1].username == "user2"
        session.rollback()


def test_update_user(user_service):
    with transaction() as session:
        user = user_service.create_user("testuser", "test@example.com", "Test User")
        updated_user = user_service.update_user(user.id, username="newusername", email="new@example.com")
        assert updated_user is not None
        assert updated_user.username == "newusername"
        assert updated_user.email == "new@example.com"
        assert updated_user.full_name == "Test User"  # Unchanged
        session.rollback()


def test_delete_user(user_service):
    with transaction() as session:
        user = user_service.create_user("testuser", "test@example.com", "Test User")
        deleted = user_service.delete_user(user.id)
        assert deleted is True
        found_user = user_service.find_user_by_id(user.id)
        assert found_user is None
        session.rollback()


def test_create_user_with_duplicate_username(user_service):
    with transaction() as session:
        user_service.create_user("testuser", "test1@example.com", "Test User 1")
        with pytest.raises(IntegrityError):
            user_service.create_user("testuser", "test2@example.com", "Test User 2")
        session.rollback()


def test_create_user_with_duplicate_email(user_service):
    with transaction() as session:
        user_service.create_user("testuser1", "test@example.com", "Test User 1")
        with pytest.raises(IntegrityError):
            user_service.create_user("testuser2", "test@example.com", "Test User 2")
        session.rollback()


def test_update_nonexistent_user(user_service):
    with transaction() as session:
        updated_user = user_service.update_user(999, username="newusername")
        assert updated_user is None
        session.rollback()


def test_delete_nonexistent_user(user_service):
    with transaction() as session:
        deleted = user_service.delete_user(999)
        assert deleted is False
        session.rollback()