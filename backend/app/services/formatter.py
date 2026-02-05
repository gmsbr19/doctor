import re
from docxtpl import RichText
from app.domain.models import ITextFormatter

class DocxStyleFormatter(ITextFormatter):
    """
    Responsável por transformar texto cru em RichText do Word
    com as regras de Negrito e Fonte Arial.
    """
    def __init__(self, font_name: str = 'Arial'):
        self.font_name = font_name
        # Regex compilados para performance
        self.regex_titulo = re.compile(r'^((?:CLÁUSULA|Parágrafo|§).*?[-:])\s*(.*)$', re.IGNORECASE | re.DOTALL)
        self.regex_vars = re.compile(r'(\{\{\s*[\w_]+\s*\}\})')

    def format(self, raw_text: str, context: dict) -> RichText:
        rt = RichText()
        
        # 1. Separação de Título
        match = self.regex_titulo.match(raw_text)
        content = raw_text
        
        if match:
            titulo, resto = match.groups()
            rt.add(f"{titulo} ", bold=True, font=self.font_name)
            content = resto

        # 2. Injeção de Variáveis
        parts = self.regex_vars.split(content)
        for part in parts:
            if self.regex_vars.match(part):
                # É uma variável {{ var }}
                key = re.sub(r'[\{\}\s]', '', part)
                value = context.get(key, f"??{key}??")
                rt.add(str(value), bold=True, font=self.font_name)
            elif part:
                # É texto comum
                rt.add(part, font=self.font_name)
                
        return rt