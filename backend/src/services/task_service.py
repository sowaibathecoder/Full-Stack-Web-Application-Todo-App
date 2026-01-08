"""
Service layer for task-related operations in the Todo application.
Handles business logic for recurring tasks, notifications, and other advanced features.
"""
from datetime import datetime, timedelta
from typing import List, Optional
from sqlmodel import Session
from ..models import Task
from ..database.utils import get_task_by_id


def generate_next_occurrence(task: Task) -> Optional[Task]:
    """
    Generate the next occurrence of a recurring task based on its recurrence rule.
    """
    if not task.is_recurring or not task.recurrence_rule:
        return None

    # Create a new task instance based on the recurring task
    next_task = Task(
        title=task.title,
        description=task.description,
        user_id=task.user_id,
        priority=task.priority,
        tags=task.tags,
        is_recurring=task.is_recurring,
        recurrence_rule=task.recurrence_rule,
        # Copy other relevant fields
    )

    # Calculate the next due date based on the recurrence rule
    if task.due_date:
        current_due_date = task.due_date
        if task.recurrence_rule == "daily":
            next_task.due_date = current_due_date + timedelta(days=1)
        elif task.recurrence_rule == "weekly":
            next_task.due_date = current_due_date + timedelta(weeks=1)
        elif task.recurrence_rule == "monthly":
            # For simplicity, adding 30 days. A more robust solution would handle months properly
            next_task.due_date = current_due_date + timedelta(days=30)
        else:
            # Unknown recurrence rule, return None
            return None

    return next_task


def process_recurring_tasks(session: Session, user_id: str) -> List[Task]:
    """
    Process all recurring tasks for a user and generate new occurrences if needed.
    This should be run periodically (e.g., daily) to create new instances of recurring tasks.
    """
    from sqlmodel import select
    from datetime import date

    # Find all recurring tasks that are completed but have a recurrence rule
    recurring_tasks = session.exec(
        select(Task)
        .where(Task.user_id == user_id)
        .where(Task.is_recurring == True)
        .where(Task.recurrence_rule.is_not(None))
    ).all()

    new_tasks = []

    for task in recurring_tasks:
        # If the task is completed, we need to generate the next occurrence
        if task.completed:
            next_task = generate_next_occurrence(task)
            if next_task:
                # Set the new task as not completed
                next_task.completed = False
                next_task.created_at = datetime.utcnow()
                next_task.updated_at = datetime.utcnow()

                # Add the new task to the session
                session.add(next_task)
                session.commit()
                session.refresh(next_task)

                new_tasks.append(next_task)

    return new_tasks


def get_overdue_tasks(session: Session, user_id: str) -> List[Task]:
    """
    Retrieve all overdue tasks for a specific user.
    An overdue task is one that has a due date in the past and is not yet completed.
    """
    from sqlmodel import select
    from datetime import datetime

    overdue_tasks = session.exec(
        select(Task)
        .where(Task.user_id == user_id)
        .where(Task.due_date < datetime.utcnow())
        .where(Task.completed == False)
    ).all()

    return overdue_tasks