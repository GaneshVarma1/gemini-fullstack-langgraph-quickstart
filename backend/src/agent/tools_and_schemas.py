from typing import List, Optional
from pydantic import BaseModel, Field


class SearchQueryList(BaseModel):
    query: List[str] = Field(
        description="A list of search queries to be used for web research."
    )
    rationale: str = Field(
        description="A brief explanation of why these queries are relevant to the research topic."
    )


class Reflection(BaseModel):
    is_sufficient: bool = Field(
        description="Whether the provided summaries are sufficient to answer the user's question."
    )
    knowledge_gap: str = Field(
        description="A description of what information is missing or needs clarification."
    )
    follow_up_queries: List[str] = Field(
        description="A list of follow-up queries to address the knowledge gap."
    )


# New schemas for enhanced features
class FileUpload(BaseModel):
    filename: str = Field(description="Name of the uploaded file")
    content_type: str = Field(description="MIME type of the file")
    file_size: int = Field(description="Size of the file in bytes")
    file_path: str = Field(description="Path where the file is stored")


class DocumentAnalysis(BaseModel):
    document_type: str = Field(description="Type of document (PDF, DOCX, CSV, etc.)")
    summary: str = Field(description="Summary of the document content")
    key_insights: List[str] = Field(description="Key insights extracted from the document")
    questions_answered: List[str] = Field(description="Questions that can be answered from this document")


class ChatSession(BaseModel):
    session_id: str = Field(description="Unique identifier for the chat session")
    title: str = Field(description="Title of the chat session")
    created_at: str = Field(description="Timestamp when the session was created")
    last_updated: str = Field(description="Timestamp when the session was last updated")
    message_count: int = Field(description="Number of messages in the session")


class PromptTemplate(BaseModel):
    id: str = Field(description="Unique identifier for the template")
    title: str = Field(description="Display title for the template")
    description: str = Field(description="Description of what this template does")
    prompt: str = Field(description="The actual prompt template")
    category: str = Field(description="Category of the template (research, analysis, etc.)")
    effort_level: str = Field(description="Recommended effort level (low, medium, high)")
    model: str = Field(description="Recommended model for this template")
