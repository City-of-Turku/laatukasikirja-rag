import logging
import json
import os
from datetime import datetime
from typing import Optional

from app.auth import get_api_token
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

change_log_router = r = APIRouter()

logger = logging.getLogger("uvicorn")

CHANGE_LOG_PATH = "./app/change_log/change_log.json"

class ChangeLogEntry(BaseModel):
    id: Optional[int] = None
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat(), description="Timestamp of the change")
    changes: list[str] = Field(..., min_length=1, description="List of changes made")

def load_change_log():
    """
    Load change log from JSON file, creating file if it doesn't exist.
    
    Returns:
        list: List of change log entries
    """
    if not os.path.exists(CHANGE_LOG_PATH):
        with open(CHANGE_LOG_PATH, "w") as file:
            json.dump({"entries": [], "next_id": 1}, file, indent=2)
    
    with open(CHANGE_LOG_PATH, "r") as file:
        return json.load(file)

def save_change_log(change_log):
    """
    Save change log to JSON file.
    
    Args:
        change_log (dict): Change log dictionary with entries and next_id
    """
    with open(CHANGE_LOG_PATH, "w") as file:
        json.dump(change_log, file, indent=2)

@r.get("/change_log")
def get_change_log(api_token: str = Depends(get_api_token)):
    """
    Retrieve all change log entries, sorted from latest to earliest.
    
    Returns:
        dict: Dictionary containing sorted change log entries
    """
    change_log = load_change_log()
    
    # Sort entries by timestamp in descending order (latest first)
    sorted_entries = sorted(
        change_log["entries"], 
        key=lambda x: datetime.fromisoformat(x['timestamp']), 
        reverse=True
    )
    
    return {"change_log": sorted_entries}

@r.post("/change_log")
def create_change_log_entry(entry: ChangeLogEntry, api_token: str = Depends(get_api_token)):
    """
    Create a new change log entry with auto-incremented ID.
    
    Args:
        entry (ChangeLogEntry): Change log entry to add
    
    Returns:
        dict: Created change log entry
    """
    change_log = load_change_log()
    
    # Use and increment the next available ID
    new_entry = entry.model_dump()
    new_entry['id'] = change_log["next_id"]
    change_log["next_id"] += 1
    
    change_log["entries"].append(new_entry)
    save_change_log(change_log)
    
    return {"message": "Change log entry created", "entry": new_entry}

@r.put("/change_log/{entry_id}")
def update_change_log_entry(entry_id: int, entry: ChangeLogEntry, api_token: str = Depends(get_api_token)):
    """
    Update an existing change log entry.
    
    Args:
        entry_id (int): ID of the entry to update
        entry (ChangeLogEntry): Updated entry details
    
    Returns:
        dict: Updated change log entry
    """
    change_log = load_change_log()
    
    # Find the entry to update
    for existing_entry in change_log["entries"]:
        if existing_entry['id'] == entry_id:
            # Update the entry, keeping the original ID and timestamp
            updated_entry = entry.model_dump()
            updated_entry['id'] = entry_id
            updated_entry['timestamp'] = existing_entry['timestamp']
            
            # Replace the old entry with the updated one
            change_log["entries"][change_log["entries"].index(existing_entry)] = updated_entry
            
            save_change_log(change_log)
            return {"message": "Change log entry updated", "entry": updated_entry}
    
    # If no entry found, raise an error
    raise HTTPException(status_code=404, detail=f"No entry found with ID {entry_id}")

@r.delete("/change_log/{entry_id}")
def delete_change_log_entry(entry_id: int, api_token: str = Depends(get_api_token)):
    """
    Delete a change log entry by its ID.
    
    Args:
        entry_id (int): ID of the entry to delete
    
    Returns:
        dict: Confirmation message
    """
    change_log = load_change_log()
    
    # Find and remove the entry with the matching ID
    original_length = len(change_log["entries"])
    change_log["entries"] = [entry for entry in change_log["entries"] if entry['id'] != entry_id]
    
    # Check if any entry was actually deleted
    if len(change_log["entries"]) == original_length:
        raise HTTPException(status_code=404, detail=f"No entry found with ID {entry_id}")
    
    save_change_log(change_log)
    
    return {"message": f"Change log entry {entry_id} deleted"}