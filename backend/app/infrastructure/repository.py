import json
from typing import List
from app.domain.models import Chapter, Clause

class JsonRepository:
    """Responsável apenas por ler os dados brutos."""
    def __init__(self, file_path: str):
        self.file_path = file_path

    def get_chapters(self) -> List[Chapter]:
        with open(self.file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Converte JSON em Objetos de Domínio (Chapter/Clause)
        chapters = []
        for cap in data:
            clausulas_objs = []
            for cl in cap['clausulas']:
                clausulas_objs.append(Clause(
                    texto=cl['texto'],
                    paragrafos=cl.get('paragrafos', [])
                ))
            chapters.append(Chapter(titulo=cap['titulo_capitulo'], clausulas=clausulas_objs))
        return chapters