import strawberry
from typing import List, Optional

@strawberry.type
class GeometrySolutionStep:
    description: str
    reasoning: Optional[str] = None
    calculation: Optional[str] = None

@strawberry.type
class GeometrySolution:
    steps: List[GeometrySolutionStep]
    final_answer: str
    animation_url: Optional[str] = None

@strawberry.input
class GeometryProblemInput:
    problem_text: str
    image_base64: Optional[str] = None
