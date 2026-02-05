from docxtpl import DocxTemplate
import locale
from app.infrastructure.repository import JsonRepository
from app.services.formatter import DocxStyleFormatter

# Configuração de Locale (Global)
try:
    locale.setlocale(locale.LC_TIME, 'pt_BR.UTF-8')
except:
    locale.setlocale(locale.LC_TIME, 'C')

class ContractGenerator:
    """
    Facade que orquestra a geração.
    Recebe as dependências no construtor (Injeção de Dependência).
    """
    def __init__(self, template_path: str, repository: JsonRepository, formatter: DocxStyleFormatter):
        self.template_path = template_path
        self.repository = repository
        self.formatter = formatter

    def build_structure(self, context_data: dict):
        chapters = self.repository.get_chapters()
        structured_data = []

        for cap in chapters:
            cap_structure = {
                "titulo": cap.titulo,
                "clausulas": []
            }
            
            for cl in cap.clausulas:
                # Usa o formatador injetado para processar o texto
                processed_cl = {
                    "rich_conteudo": self.formatter.format(cl.texto, context_data),
                    "paragrafos": [self.formatter.format(p, context_data) for p in cl.paragrafos]
                }
                cap_structure["clausulas"].append(processed_cl)
            
            structured_data.append(cap_structure)
        
        return structured_data

    def generate(self, context_data: dict, output_path: str):
        doc = DocxTemplate(self.template_path)
        
        # Monta a estrutura complexa
        contract_body = self.build_structure(context_data)
        
        # Cria o contexto final (dados simples + corpo do contrato)
        final_context = {**context_data, 'lista_estruturada': contract_body}
        
        doc.render(final_context)
        doc.save(output_path)
        print(f"Contrato gerado em: {output_path}")