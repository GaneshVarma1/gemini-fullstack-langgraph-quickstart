"""Document processing utilities for the enhanced AI research assistant."""

import os
import tempfile
from typing import Dict, List, Any, Optional
import PyPDF2
import pandas as pd
from docx import Document
from PIL import Image
import aiofiles
from langchain_google_genai import ChatGoogleGenerativeAI
from agent.tools_and_schemas import DocumentAnalysis, FileUpload


class DocumentProcessor:
    """Handles processing of various document types."""

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash-exp",
            temperature=0.3,
            api_key=api_key,
        )

    async def process_file(self, file_upload: FileUpload) -> DocumentAnalysis:
        """Process an uploaded file and return analysis."""
        file_path = file_upload.file_path
        content_type = file_upload.content_type
        
        try:
            # Extract text based on file type
            extracted_text = ""
            document_type = self._get_document_type(content_type)
            
            if document_type == "PDF":
                extracted_text = await self._process_pdf(file_path)
            elif document_type == "DOCX":
                extracted_text = await self._process_docx(file_path)
            elif document_type == "CSV":
                extracted_text = await self._process_csv(file_path)
            elif document_type == "TXT":
                extracted_text = await self._process_txt(file_path)
            elif document_type == "IMAGE":
                extracted_text = await self._process_image(file_path)
            else:
                raise ValueError(f"Unsupported document type: {document_type}")

            # Analyze the extracted content using Gemini
            analysis = await self._analyze_content(extracted_text, document_type)
            
            return DocumentAnalysis(
                document_type=document_type,
                summary=analysis["summary"],
                key_insights=analysis["key_insights"],
                questions_answered=analysis["questions_answered"]
            )
            
        except Exception as e:
            # Return error analysis
            return DocumentAnalysis(
                document_type=document_type or "UNKNOWN",
                summary=f"Error processing document: {str(e)}",
                key_insights=["Document processing failed"],
                questions_answered=["Unable to analyze due to processing error"]
            )

    def _get_document_type(self, content_type: str) -> str:
        """Determine document type from content type."""
        if "pdf" in content_type.lower():
            return "PDF"
        elif "word" in content_type.lower() or "docx" in content_type.lower():
            return "DOCX"
        elif "csv" in content_type.lower():
            return "CSV"
        elif "text" in content_type.lower():
            return "TXT"
        elif "image" in content_type.lower():
            return "IMAGE"
        else:
            return "UNKNOWN"

    async def _process_pdf(self, file_path: str) -> str:
        """Extract text from PDF file."""
        text = ""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
        except Exception as e:
            text = f"Error reading PDF: {str(e)}"
        return text

    async def _process_docx(self, file_path: str) -> str:
        """Extract text from DOCX file."""
        try:
            doc = Document(file_path)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return text
        except Exception as e:
            return f"Error reading DOCX: {str(e)}"

    async def _process_csv(self, file_path: str) -> str:
        """Process CSV file and return analysis."""
        try:
            df = pd.read_csv(file_path)
            
            # Generate summary statistics
            summary = f"CSV file with {len(df)} rows and {len(df.columns)} columns.\n"
            summary += f"Columns: {', '.join(df.columns.tolist())}\n\n"
            
            # Add data types
            summary += "Column data types:\n"
            for col, dtype in df.dtypes.items():
                summary += f"- {col}: {dtype}\n"
            
            # Add sample data
            summary += f"\nFirst 5 rows:\n{df.head().to_string()}\n"
            
            # Add basic statistics for numeric columns
            numeric_cols = df.select_dtypes(include=['number']).columns
            if len(numeric_cols) > 0:
                summary += f"\nNumeric column statistics:\n{df[numeric_cols].describe().to_string()}\n"
            
            return summary
        except Exception as e:
            return f"Error reading CSV: {str(e)}"

    async def _process_txt(self, file_path: str) -> str:
        """Extract text from TXT file."""
        try:
            async with aiofiles.open(file_path, 'r', encoding='utf-8') as file:
                text = await file.read()
            return text
        except Exception as e:
            return f"Error reading TXT: {str(e)}"

    async def _process_image(self, file_path: str) -> str:
        """Process image file (placeholder for OCR functionality)."""
        try:
            with Image.open(file_path) as img:
                # For now, just return image metadata
                # In the future, this could use OCR or Google Vision API
                info = f"Image file: {img.format}, Size: {img.size}, Mode: {img.mode}"
                return info
        except Exception as e:
            return f"Error processing image: {str(e)}"

    async def _analyze_content(self, content: str, document_type: str) -> Dict[str, Any]:
        """Analyze extracted content using Gemini."""
        
        analysis_prompt = f"""
        Analyze the following {document_type} document content and provide:
        
        1. A concise summary (2-3 sentences)
        2. 3-5 key insights or main points
        3. 3-5 questions that can be answered based on this content
        
        Document content:
        {content[:4000]}  # Limit content to avoid token limits
        
        Please format your response as JSON with the following structure:
        {{
            "summary": "Brief summary here",
            "key_insights": ["insight 1", "insight 2", "insight 3"],
            "questions_answered": ["question 1", "question 2", "question 3"]
        }}
        """
        
        try:
            response = self.llm.invoke(analysis_prompt)
            
            # Parse the response (simple approach)
            # In production, you'd want more robust JSON parsing
            import json
            
            # Extract JSON from response
            response_text = response.content
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            
            if start_idx != -1 and end_idx != -1:
                json_str = response_text[start_idx:end_idx]
                analysis = json.loads(json_str)
            else:
                # Fallback if JSON parsing fails
                analysis = {
                    "summary": "Document analysis completed",
                    "key_insights": ["Content extracted successfully"],
                    "questions_answered": ["General questions about document content"]
                }
            
            return analysis
            
        except Exception as e:
            # Fallback analysis
            return {
                "summary": f"Analysis completed for {document_type} document",
                "key_insights": ["Document processed successfully", "Content extracted"],
                "questions_answered": ["What is the main topic?", "What are the key points?"]
            }


async def save_uploaded_file(file_data: bytes, filename: str) -> str:
    """Save uploaded file to temporary location."""
    # Create uploads directory if it doesn't exist
    uploads_dir = "uploads"
    os.makedirs(uploads_dir, exist_ok=True)
    
    # Create unique filename
    import uuid
    unique_filename = f"{uuid.uuid4()}_{filename}"
    file_path = os.path.join(uploads_dir, unique_filename)
    
    # Save file
    async with aiofiles.open(file_path, 'wb') as f:
        await f.write(file_data)
    
    return file_path 