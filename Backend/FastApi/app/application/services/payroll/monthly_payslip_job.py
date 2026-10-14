"""
Monthly payslip job.

Run this script from the backend project root on/after the 5th of each month.
It generates the previous calendar month's payslips and attempts email delivery.

Example Windows Task Scheduler action:
    Program: <path-to-venv>\\Scripts\\python.exe
    Arguments: monthly_payslip_job.py
    Start in: <backend-project-root>
"""
import json
from datetime import date

from app.infrastructure.database.connection import get_db_session
from app.infrastructure.repositories.payroll.payslip_repository import (
    PayslipRepository,
)
from app.application.services.payroll.payslip_service import (
    PayslipService,
)


def previous_month(today: date | None = None) -> tuple[int, int]:
    today = today or date.today()
    if today.month == 1:
        return today.year - 1, 12
    return today.year, today.month - 1


def main() -> None:
    year, month = previous_month()
    session_generator = get_db_session()
    db = next(session_generator)

    try:
        service = PayslipService(PayslipRepository(db))
        result = service.generate_monthly_payslips(
            year=year,
            month=month,
            send_email=True,
        )
        db.commit()
        print(json.dumps(result, default=str, indent=2))
        if result.get("failed") or result.get("email_failed"):
            raise SystemExit(2)
    except BaseException:
        db.rollback()
        raise
    finally:
        session_generator.close()


if __name__ == "__main__":
    main()
