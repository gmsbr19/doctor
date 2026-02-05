from dataclasses import dataclass
from typing import List, Optional, Any

@dataclass
class Clause:
    texto: str
    paragrafos: List[str]

@dataclass
class Chapter:
    titulo: str
    clausulas: List[Clause]

# Interface para garantir que qualquer formatador siga o mesmo padrão
from abc import ABC, abstractmethod

class ITextFormatter(ABC):
    @abstractmethod
    def format(self, text: str, context: dict) -> Any:
        pass