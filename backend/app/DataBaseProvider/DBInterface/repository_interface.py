from abc import ABC, abstractmethod


class RepoInterface(ABC):
    @abstractmethod
    def __init__(self, databaseName: str) -> None:
        pass

    @abstractmethod
    def close(self) -> None:
        pass

    @abstractmethod
    def list(self, props: dict) -> dict:
        pass

    @abstractmethod
    def add(self, props: dict) -> dict:
        pass

    @abstractmethod
    def update(self, props: dict) -> dict:
        pass

    @abstractmethod
    def delete(self, props: dict) -> dict:
        pass
