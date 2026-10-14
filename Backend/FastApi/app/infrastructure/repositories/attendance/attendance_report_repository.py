# # from datetime import date
# # from typing import List, Optional, Tuple

# # from sqlalchemy.orm import Session

# # from app.infrastructure.models.attendance.timesheet import TimesheetModel
# # from app.infrastructure.models.employee.employee import EmployeeModel


# # class AttendanceReportRepository:
# #     """
# #     Repository for Attendance Reporting.

# #     Responsibilities:
# #     - Fetch active employees
# #     - Fetch attendance/timesheet records
# #     - Keep database access isolated from business logic
# #     """

# #     def __init__(self, db: Session):
# #         self.db = db

# #     # ============================================================
# #     # ACTIVE EMPLOYEES
# #     # ============================================================

# #     def get_active_employees(
# #         self,
# #         employee_id: Optional[int] = None,
# #     ) -> List[EmployeeModel]:

# #         query = (
# #             self.db.query(EmployeeModel)
# #             .filter(EmployeeModel.is_remove == 0)
# #         )

# #         if employee_id is not None:
# #             query = query.filter(
# #                 EmployeeModel.id == employee_id
# #             )

# #         return (
# #             query
# #             .order_by(
# #                 EmployeeModel.first_name.asc(),
# #                 EmployeeModel.last_name.asc(),
# #                 EmployeeModel.id.asc(),
# #             )
# #             .all()
# #         )

# #     # ============================================================
# #     # ATTENDANCE / TIMESHEET
# #     # ============================================================

# #     def get_timesheets(
# #         self,
# #         start_date: date,
# #         end_date: date,
# #         employee_id: Optional[int] = None,
# #     ) -> List[TimesheetModel]:

# #         query = (
# #             self.db.query(TimesheetModel)
# #             .filter(
# #                 TimesheetModel.date >= start_date,
# #                 TimesheetModel.date <= end_date,
# #             )
# #         )

# #         if employee_id is not None:
# #             query = query.filter(
# #                 TimesheetModel.emp_id == employee_id
# #             )

# #         return (
# #             query
# #             .order_by(
# #                 TimesheetModel.date.asc(),
# #                 TimesheetModel.id.asc(),
# #             )
# #             .all()
# #         )

# #     # ============================================================
# #     # SINGLE EMPLOYEE ATTENDANCE
# #     # ============================================================

# #     def get_employee_timesheets(
# #         self,
# #         employee_id: int,
# #         start_date: date,
# #         end_date: date,
# #     ) -> List[TimesheetModel]:

# #         return (
# #             self.db.query(TimesheetModel)
# #             .filter(
# #                 TimesheetModel.emp_id == employee_id,
# #                 TimesheetModel.date >= start_date,
# #                 TimesheetModel.date <= end_date,
# #             )
# #             .order_by(
# #                 TimesheetModel.date.asc(),
# #                 TimesheetModel.id.asc(),
# #             )
# #             .all()
# #         )

# from datetime import date, datetime, time
# from typing import Any, Dict, List, Optional

# from sqlalchemy import and_, func, or_
# from sqlalchemy.orm import Session


# from app.domain.interfaces.attendance.attendance_report_interface import (
#     IAttendanceReportRepository,
# )
# from app.infrastructure.models.attendance.timesheet import TimesheetModel
# from app.infrastructure.models.employee.employee import EmployeeModel
# from app.infrastructure.models.employee.designation import DesignationModel
# from app.infrastructure.models.employee.department import DepartmentModel
# from app.infrastructure.models.roster.shift_date import ShiftDateModel
# from app.infrastructure.models.shifts.shift_pattern import ShiftPatternModel
# from app.infrastructure.models.leave.leave_log import LeaveLogModel
# from app.infrastructure.models.holiday.holiday import HolidayModel


# class AttendanceReportRepository(IAttendanceReportRepository):
#     """
#     PostgreSQL read-only repository used by the .NET attendance replica.

#     The old .NET code received an Attenance_History DataSet from SQL
#     Server and then enriched it with EmployeeShiftDates and ShiftPattern.

#     PostgreSQL does not use that SQL Server stored procedure here.
#     We reconstruct the same input rows from the normalized tables:
#         employee_detail
#         employeeshiftdates
#         shiftpattern
#         timesheet
#         leave_log
#         holiday
#     """

#     def __init__(self, db: Session):
#         self.db = db

#     def get_active_employees(
#         self,
#         search: Optional[str] = None,
#     ) -> List[Dict[str, Any]]:
#         query = (
#             self.db.query(EmployeeModel)
#             .filter(EmployeeModel.is_remove == 0)
#         )

#         if search and search.strip():
#             value = f"%{search.strip()}%"
#             query = query.filter(
#                 or_(
#                     EmployeeModel.emp_code.ilike(value),
#                     EmployeeModel.first_name.ilike(value),
#                     EmployeeModel.last_name.ilike(value),
#                     func.concat(
#                         EmployeeModel.first_name,
#                         " ",
#                         EmployeeModel.last_name,
#                     ).ilike(value),
#                 )
#             )

#         employees = (
#             query.order_by(
#                 EmployeeModel.first_name.asc(),
#                 EmployeeModel.last_name.asc(),
#                 EmployeeModel.id.asc(),
#             )
#             .all()
#         )

#         return [
#             {
#                 "id": employee.id,
#                 "emp_code": employee.emp_code,
#                 "first_name": employee.first_name,
#                 "last_name": employee.last_name,
#                 "employee_name": (
#                     f"{employee.first_name or ''} "
#                     f"{employee.last_name or ''}"
#                 ).strip(),
#             }
#             for employee in employees
#         ]

#     @staticmethod
#     def _employee_name(employee: EmployeeModel) -> str:
#         return (
#             f"{employee.first_name or ''} "
#             f"{employee.last_name or ''}"
#         ).strip()

#     @staticmethod
#     def _as_date(value: Any) -> Optional[date]:
#         if value is None:
#             return None
#         if isinstance(value, datetime):
#             return value.date()
#         if isinstance(value, date):
#             return value
#         return None

#     def get_monthly_attendance(
#         self,
#         start_date: date,
#         end_date: date,
#         employee_id: Optional[int] = None,
#     ) -> List[Dict[str, Any]]:
#         """
#         Reconstruct the attendance rows consumed by the active .NET
#         GetMonthlyAttendanceNumberCount() method.

#         Important:
#         - only active employees are considered;
#         - only roster dates having EmployeeShiftDates are considered;
#         - a missing Timesheet row becomes hasPunch=False;
#         - holiday/leave/week-off information is attached to that date;
#         - the service, not this repository, decides N1..N12.
#         """

#         shift_query = (
#             self.db.query(
#                 ShiftDateModel,
#                 ShiftPatternModel,
#                 EmployeeModel,
#                 DesignationModel,
#                 DepartmentModel,
#             )
#             .join(
#                 ShiftPatternModel,
#                 ShiftPatternModel.patternid
#                 == ShiftDateModel.patternid,
#             )
#             .join(
#                 EmployeeModel,
#                 EmployeeModel.id
#                 == ShiftDateModel.empid,
#             )
#             .outerjoin(
#                 DesignationModel,
#                 EmployeeModel.designation
#                 == DesignationModel.id,
#             )
#             .outerjoin(
#                 DepartmentModel,
#                 DesignationModel.depart_id
#                 == DepartmentModel.id,
#             )
#             .filter(
#                 EmployeeModel.is_remove == 0,
#                 func.date(ShiftDateModel.dates) >= start_date,
#                 func.date(ShiftDateModel.dates) <= end_date,
#             )
#         )

#         if employee_id is not None:
#             shift_query = shift_query.filter(
#                 ShiftDateModel.empid == employee_id
#             )

#         shift_rows = shift_query.order_by(
#             ShiftDateModel.dates.asc(),
#             EmployeeModel.first_name.asc(),
#             EmployeeModel.last_name.asc(),
#         ).all()

#         if not shift_rows:
#             return []

#         employee_ids = {
#             int(shift_date.empid)
#             for shift_date, _, _, _, _ in shift_rows
#         }

#         # --------------------------------------------------------
#         # Timesheet map: employee/date -> latest attendance row
#         # --------------------------------------------------------

#         timesheet_query = (
#             self.db.query(TimesheetModel)
#             .filter(
#                 TimesheetModel.date >= start_date,
#                 TimesheetModel.date <= end_date,
#                 TimesheetModel.emp_id.in_(employee_ids),
#             )
#             .order_by(
#                 TimesheetModel.date.asc(),
#                 TimesheetModel.id.asc(),
#             )
#         )

#         timesheets: Dict[tuple[int, date], TimesheetModel] = {}

#         for record in timesheet_query.all():
#             record_date = self._as_date(record.date)
#             if record_date is None:
#                 continue
#             timesheets[(int(record.emp_id), record_date)] = record

#         # --------------------------------------------------------
#         # Holidays
#         # --------------------------------------------------------

#         holidays = (
#             self.db.query(HolidayModel)
#             .filter(
#                 HolidayModel.holiday_date >= start_date,
#                 HolidayModel.holiday_date <= end_date,
#                 HolidayModel.status == 1,
#             )
#             .all()
#         )

#         holiday_map: Dict[date, Any] = {}

#         for holiday in holidays:
#             holiday_date = self._as_date(
#                 getattr(holiday, "holiday_date", None)
#             )
#             if holiday_date is None:
#                 continue
#             holiday_map[holiday_date] = holiday

#         # --------------------------------------------------------
#         # Leaves
#         # --------------------------------------------------------

#         start_datetime = datetime.combine(start_date, time.min)
#         end_datetime = datetime.combine(end_date, time.max)

#         leave_rows = (
#             self.db.query(LeaveLogModel)
#             .filter(
#                 LeaveLogModel.emp_id.in_(employee_ids),
#                 LeaveLogModel.leave_from <= end_datetime,
#                 LeaveLogModel.leave_to >= start_datetime,
#                 LeaveLogModel.status == 1,
#             )
#             .all()
#         )

#         leaves_by_employee: Dict[int, List[Any]] = {}

#         for leave in leave_rows:
#             leaves_by_employee.setdefault(
#                 int(leave.emp_id),
#                 [],
#             ).append(leave)

#         result: List[Dict[str, Any]] = []

#         for (
#             shift_date,
#             shift_pattern,
#             employee,
#             designation,
#             department,
#         ) in shift_rows:

#             attendance_date = self._as_date(shift_date.dates)

#             if attendance_date is None:
#                 continue

#             attendance = timesheets.get(
#                 (int(employee.id), attendance_date)
#             )

#             leave = None

#             for candidate in leaves_by_employee.get(
#                 int(employee.id),
#                 [],
#             ):
#                 leave_from = getattr(candidate, "leave_from", None)
#                 leave_to = getattr(candidate, "leave_to", None)

#                 if not leave_from or not leave_to:
#                     continue

#                 if (
#                     leave_from
#                     <= datetime.combine(
#                         attendance_date,
#                         time.max,
#                     )
#                     and leave_to
#                     >= datetime.combine(
#                         attendance_date,
#                         time.min,
#                     )
#                 ):
#                     leave = candidate
#                     break

#             holiday = holiday_map.get(attendance_date)

#             leave_type = None
#             no_of_days = None

#             if leave is not None:
#                 leave_type = getattr(
#                     leave,
#                     "leave_type",
#                     None,
#                 )
#                 no_of_days = getattr(
#                     leave,
#                     "no_of_days",
#                     None,
#                 )

#             holiday_name = None

#             if holiday is not None:
#                 holiday_name = (
#                     getattr(holiday, "name", None)
#                     or getattr(holiday, "holiday_name", None)
#                     or getattr(holiday, "description", None)
#                     or "Public Holiday"
#                 )

#             result.append(
#                 {
#                     "attendance_date": attendance_date,
#                     "day_of_week": attendance_date.strftime("%A"),

#                     "employee_id": int(employee.id),
#                     "employee_code": employee.emp_code,
#                     "employee_name": self._employee_name(employee),

#                     "designation": getattr(
#                         designation,
#                         "name",
#                         None,
#                     ),
#                     "department": getattr(
#                         department,
#                         "name",
#                         None,
#                     ),

#                     "shift_start_time": getattr(
#                         shift_pattern,
#                         "starttime",
#                         None,
#                     ),
#                     "shift_end_time": getattr(
#                         shift_pattern,
#                         "endtime",
#                         None,
#                     ),
#                     "patternname": getattr(
#                         shift_pattern,
#                         "patternname",
#                         None,
#                     ),

#                     # EmployeeShiftDates is the roster source used by
#                     # the .NET monthly calculation.
#                     "isweekoff": bool(
#                         getattr(
#                             shift_date,
#                             "isweekoff",
#                             False,
#                         )
#                     ),

#                     "leave_type": leave_type,
#                     "no_of_days": no_of_days,
#                     "holiday_name": holiday_name,

#                     "punch_in": (
#                         attendance.punch_in
#                         if attendance
#                         else None
#                     ),
#                     "punch_out": (
#                         attendance.punch_out
#                         if attendance
#                         else None
#                     ),
#                     "working_hours": (
#                         attendance.working_hrs or 0.0
#                         if attendance
#                         else 0.0
#                     ),
#                     "break_minutes": (
#                         attendance.total_break or 0.0
#                         if attendance
#                         else 0.0
#                     ),
#                 }
#             )

#         return result







# from datetime import date
# from typing import List, Optional, Tuple

# from sqlalchemy.orm import Session

# from app.infrastructure.models.attendance.timesheet import TimesheetModel
# from app.infrastructure.models.employee.employee import EmployeeModel


# class AttendanceReportRepository:
#     """
#     Repository for Attendance Reporting.

#     Responsibilities:
#     - Fetch active employees
#     - Fetch attendance/timesheet records
#     - Keep database access isolated from business logic
#     """

#     def __init__(self, db: Session):
#         self.db = db

#     # ============================================================
#     # ACTIVE EMPLOYEES
#     # ============================================================

#     def get_active_employees(
#         self,
#         employee_id: Optional[int] = None,
#     ) -> List[EmployeeModel]:

#         query = (
#             self.db.query(EmployeeModel)
#             .filter(EmployeeModel.is_remove == 0)
#         )

#         if employee_id is not None:
#             query = query.filter(
#                 EmployeeModel.id == employee_id
#             )

#         return (
#             query
#             .order_by(
#                 EmployeeModel.first_name.asc(),
#                 EmployeeModel.last_name.asc(),
#                 EmployeeModel.id.asc(),
#             )
#             .all()
#         )

#     # ============================================================
#     # ATTENDANCE / TIMESHEET
#     # ============================================================

#     def get_timesheets(
#         self,
#         start_date: date,
#         end_date: date,
#         employee_id: Optional[int] = None,
#     ) -> List[TimesheetModel]:

#         query = (
#             self.db.query(TimesheetModel)
#             .filter(
#                 TimesheetModel.date >= start_date,
#                 TimesheetModel.date <= end_date,
#             )
#         )

#         if employee_id is not None:
#             query = query.filter(
#                 TimesheetModel.emp_id == employee_id
#             )

#         return (
#             query
#             .order_by(
#                 TimesheetModel.date.asc(),
#                 TimesheetModel.id.asc(),
#             )
#             .all()
#         )

#     # ============================================================
#     # SINGLE EMPLOYEE ATTENDANCE
#     # ============================================================

#     def get_employee_timesheets(
#         self,
#         employee_id: int,
#         start_date: date,
#         end_date: date,
#     ) -> List[TimesheetModel]:

#         return (
#             self.db.query(TimesheetModel)
#             .filter(
#                 TimesheetModel.emp_id == employee_id,
#                 TimesheetModel.date >= start_date,
#                 TimesheetModel.date <= end_date,
#             )
#             .order_by(
#                 TimesheetModel.date.asc(),
#                 TimesheetModel.id.asc(),
#             )
#             .all()
#         )

from datetime import date, datetime, time, timedelta
from typing import Any, Dict, List, Optional

from sqlalchemy import and_, func, or_
from sqlalchemy.orm import Session


from app.domain.interfaces.attendance.attendance_report_interface import (
    IAttendanceReportRepository,
)
from app.infrastructure.models.attendance.timesheet import TimesheetModel
from app.infrastructure.models.employee.employee import EmployeeModel
from app.infrastructure.models.employee.designation import DesignationModel
from app.infrastructure.models.employee.department import DepartmentModel
from app.infrastructure.models.roster.shift_date import ShiftDateModel
from app.infrastructure.models.shifts.shift_pattern import ShiftPatternModel
from app.infrastructure.models.leave.leave_log import LeaveLogModel
from app.infrastructure.models.holiday.holiday import HolidayModel


class AttendanceReportRepository(IAttendanceReportRepository):
    """
    PostgreSQL read-only repository used by the .NET attendance replica.

    The old .NET code received an Attenance_History DataSet from SQL
    Server and then enriched it with EmployeeShiftDates and ShiftPattern.

    PostgreSQL does not use that SQL Server stored procedure here.
    We reconstruct the same input rows from the normalized tables:
        employee_detail
        employeeshiftdates
        shiftpattern
        timesheet
        leave_log
        holiday
    """

    def __init__(self, db: Session):
        self.db = db

    def get_active_employees(
        self,
        search: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        query = (
            self.db.query(EmployeeModel)
            .filter(EmployeeModel.is_remove == 0)
        )

        if search and search.strip():
            value = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    EmployeeModel.emp_code.ilike(value),
                    EmployeeModel.first_name.ilike(value),
                    EmployeeModel.last_name.ilike(value),
                    func.concat(
                        EmployeeModel.first_name,
                        " ",
                        EmployeeModel.last_name,
                    ).ilike(value),
                )
            )

        employees = (
            query.order_by(
                EmployeeModel.first_name.asc(),
                EmployeeModel.last_name.asc(),
                EmployeeModel.id.asc(),
            )
            .all()
        )

        return [
            {
                "id": employee.id,
                "emp_code": employee.emp_code,
                "first_name": employee.first_name,
                "last_name": employee.last_name,
                "employee_name": (
                    f"{employee.first_name or ''} "
                    f"{employee.last_name or ''}"
                ).strip(),
            }
            for employee in employees
        ]

    @staticmethod
    def _employee_name(employee: EmployeeModel) -> str:
        return (
            f"{employee.first_name or ''} "
            f"{employee.last_name or ''}"
        ).strip()

    @staticmethod
    def _as_date(value: Any) -> Optional[date]:
        if value is None:
            return None
        if isinstance(value, datetime):
            return value.date()
        if isinstance(value, date):
            return value
        return None

    # def get_monthly_attendance(
    #     self,
    #     start_date: date,
    #     end_date: date,
    #     employee_id: Optional[int] = None,
    # ) -> List[Dict[str, Any]]:
    #     """
    #     Reconstruct the attendance rows consumed by the active .NET
    #     GetMonthlyAttendanceNumberCount() method.

    #     Important:
    #     - only active employees are considered;
    #     - only roster dates having EmployeeShiftDates are considered;
    #     - a missing Timesheet row becomes hasPunch=False;
    #     - holiday/leave/week-off information is attached to that date;
    #     - the service, not this repository, decides N1..N12.
    #     """

    #     shift_query = (
    #         self.db.query(
    #             ShiftDateModel,
    #             ShiftPatternModel,
    #             EmployeeModel,
    #             DesignationModel,
    #             DepartmentModel,
    #         )
    #         .join(
    #             ShiftPatternModel,
    #             ShiftPatternModel.patternid
    #             == ShiftDateModel.patternid,
    #         )
    #         .join(
    #             EmployeeModel,
    #             EmployeeModel.id
    #             == ShiftDateModel.empid,
    #         )
    #         .outerjoin(
    #             DesignationModel,
    #             EmployeeModel.designation
    #             == DesignationModel.id,
    #         )
    #         .outerjoin(
    #             DepartmentModel,
    #             DesignationModel.depart_id
    #             == DepartmentModel.id,
    #         )
    #         .filter(
    #             EmployeeModel.is_remove == 0,
    #             func.date(ShiftDateModel.dates) >= start_date,
    #             func.date(ShiftDateModel.dates) <= end_date,
    #         )
    #     )

    #     if employee_id is not None:
    #         shift_query = shift_query.filter(
    #             ShiftDateModel.empid == employee_id
    #         )

    #     shift_rows = shift_query.order_by(
    #         ShiftDateModel.dates.asc(),
    #         EmployeeModel.first_name.asc(),
    #         EmployeeModel.last_name.asc(),
    #     ).all()

    #     if not shift_rows:
    #         return []

    #     employee_ids = {
    #         int(shift_date.empid)
    #         for shift_date, _, _, _, _ in shift_rows
    #     }

    #     # --------------------------------------------------------
    #     # Timesheet map: employee/date -> latest attendance row
    #     # --------------------------------------------------------

    #     timesheet_query = (
    #         self.db.query(TimesheetModel)
    #         .filter(
    #             TimesheetModel.date >= start_date,
    #             TimesheetModel.date <= end_date,
    #             TimesheetModel.emp_id.in_(employee_ids),
    #         )
    #         .order_by(
    #             TimesheetModel.date.asc(),
    #             TimesheetModel.id.asc(),
    #         )
    #     )

    #     timesheets: Dict[tuple[int, date], TimesheetModel] = {}

    #     for record in timesheet_query.all():
    #         record_date = self._as_date(record.date)
    #         if record_date is None:
    #             continue
    #         timesheets[(int(record.emp_id), record_date)] = record

    #     # --------------------------------------------------------
    #     # Holidays
    #     # --------------------------------------------------------

    #     holidays = (
    #         self.db.query(HolidayModel)
    #         .filter(
    #             HolidayModel.holiday_date >= start_date,
    #             HolidayModel.holiday_date <= end_date,
    #             HolidayModel.status == 1,
    #         )
    #         .all()
    #     )

    #     holiday_map: Dict[date, Any] = {}

    #     for holiday in holidays:
    #         holiday_date = self._as_date(
    #             getattr(holiday, "holiday_date", None)
    #         )
    #         if holiday_date is None:
    #             continue
    #         holiday_map[holiday_date] = holiday

    #     # --------------------------------------------------------
    #     # Leaves
    #     # --------------------------------------------------------

    #     start_datetime = datetime.combine(start_date, time.min)
    #     end_datetime = datetime.combine(end_date, time.max)

    #     leave_rows = (
    #         self.db.query(LeaveLogModel)
    #         .filter(
    #             LeaveLogModel.emp_id.in_(employee_ids),
    #             LeaveLogModel.leave_from <= end_datetime,
    #             LeaveLogModel.leave_to >= start_datetime,
    #             LeaveLogModel.status == 1,
    #         )
    #         .all()
    #     )

    #     leaves_by_employee: Dict[int, List[Any]] = {}

    #     for leave in leave_rows:
    #         leaves_by_employee.setdefault(
    #             int(leave.emp_id),
    #             [],
    #         ).append(leave)

    #     result: List[Dict[str, Any]] = []

    #     for (
    #         shift_date,
    #         shift_pattern,
    #         employee,
    #         designation,
    #         department,
    #     ) in shift_rows:

    #         attendance_date = self._as_date(shift_date.dates)

    #         if attendance_date is None:
    #             continue

    #         attendance = timesheets.get(
    #             (int(employee.id), attendance_date)
    #         )

    #         leave = None

    #         for candidate in leaves_by_employee.get(
    #             int(employee.id),
    #             [],
    #         ):
    #             leave_from = getattr(candidate, "leave_from", None)
    #             leave_to = getattr(candidate, "leave_to", None)

    #             if not leave_from or not leave_to:
    #                 continue

    #             if (
    #                 leave_from
    #                 <= datetime.combine(
    #                     attendance_date,
    #                     time.max,
    #                 )
    #                 and leave_to
    #                 >= datetime.combine(
    #                     attendance_date,
    #                     time.min,
    #                 )
    #             ):
    #                 leave = candidate
    #                 break

    #         holiday = holiday_map.get(attendance_date)

    #         leave_type = None
    #         no_of_days = None

    #         if leave is not None:
    #             leave_type = getattr(
    #                 leave,
    #                 "leave_type",
    #                 None,
    #             )
    #             no_of_days = getattr(
    #                 leave,
    #                 "no_of_days",
    #                 None,
    #             )

    #         holiday_name = None

    #         if holiday is not None:
    #             holiday_name = (
    #                 getattr(holiday, "name", None)
    #                 or getattr(holiday, "holiday_name", None)
    #                 or getattr(holiday, "description", None)
    #                 or "Public Holiday"
    #             )

    #         result.append(
    #             {
    #                 "attendance_date": attendance_date,
    #                 "day_of_week": attendance_date.strftime("%A"),

    #                 "employee_id": int(employee.id),
    #                 "employee_code": employee.emp_code,
    #                 "employee_name": self._employee_name(employee),

    #                 "designation": getattr(
    #                     designation,
    #                     "name",
    #                     None,
    #                 ),
    #                 "department": getattr(
    #                     department,
    #                     "name",
    #                     None,
    #                 ),

    #                 "shift_start_time": getattr(
    #                     shift_pattern,
    #                     "starttime",
    #                     None,
    #                 ),
    #                 "shift_end_time": getattr(
    #                     shift_pattern,
    #                     "endtime",
    #                     None,
    #                 ),
    #                 "patternname": getattr(
    #                     shift_pattern,
    #                     "patternname",
    #                     None,
    #                 ),

    #                 # EmployeeShiftDates is the roster source used by
    #                 # the .NET monthly calculation.
    #                 "isweekoff": bool(
    #                     getattr(
    #                         shift_date,
    #                         "isweekoff",
    #                         False,
    #                     )
    #                 ),

    #                 "leave_type": leave_type,
    #                 "no_of_days": no_of_days,
    #                 "holiday_name": holiday_name,

    #                 "punch_in": (
    #                     attendance.punch_in
    #                     if attendance
    #                     else None
    #                 ),
    #                 "punch_out": (
    #                     attendance.punch_out
    #                     if attendance
    #                     else None
    #                 ),
    #                 "working_hours": (
    #                     attendance.working_hrs or 0.0
    #                     if attendance
    #                     else 0.0
    #                 ),
    #                 "break_minutes": (
    #                     attendance.total_break or 0.0
    #                     if attendance
    #                     else 0.0
    #                 ),
    #             }
    #         )

    #     return result



    
    def get_monthly_attendance(
        self,
        start_date: date,
        end_date: date,
        employee_id: Optional[int] = None,
    ) -> List[Dict[str, Any]]:
        """
        Build one attendance-history row per active employee per calendar day.

        A shift assignment is optional. Attendance, holidays and approved
        leave must still be available when a shift is not assigned.
        """

        # ------------------------------------------------------------
        # 1. Load active employees independently of shift assignments.
        # ------------------------------------------------------------
        employee_query = (
            self.db.query(
                EmployeeModel,
                DesignationModel,
                DepartmentModel,
            )
            .outerjoin(
                DesignationModel,
                EmployeeModel.designation == DesignationModel.id,
            )
            .outerjoin(
                DepartmentModel,
                DesignationModel.depart_id == DepartmentModel.id,
            )
            .filter(EmployeeModel.is_remove == 0)
        )

        if employee_id is not None:
            employee_query = employee_query.filter(
                EmployeeModel.id == employee_id
            )

        employee_rows = employee_query.order_by(
            EmployeeModel.first_name.asc(),
            EmployeeModel.last_name.asc(),
            EmployeeModel.id.asc(),
        ).all()

        if not employee_rows:
            return []

        employees = {
            int(employee.id): {
                "employee": employee,
                "designation": designation,
                "department": department,
                "joining_date": self._as_date(
                    getattr(employee, "doj", None)
                ),
            }
            for employee, designation, department in employee_rows
        }

        employee_ids = list(employees.keys())

        # ------------------------------------------------------------
        # 2. Load shift assignments separately.
        #    Employees without a shift remain in the result.
        # ------------------------------------------------------------
        shift_rows = (
            self.db.query(ShiftDateModel, ShiftPatternModel)
            .outerjoin(
                ShiftPatternModel,
                ShiftPatternModel.patternid == ShiftDateModel.patternid,
            )
            .filter(
                ShiftDateModel.empid.in_(employee_ids),
                func.date(ShiftDateModel.dates) >= start_date,
                func.date(ShiftDateModel.dates) <= end_date,
            )
            .order_by(ShiftDateModel.dates.asc())
            .all()
        )

        shifts_by_employee_date: Dict[tuple[int, date], tuple] = {}

        for shift_date, shift_pattern in shift_rows:
            shift_day = self._as_date(shift_date.dates)

            if shift_day is None:
                continue

            key = (int(shift_date.empid), shift_day)

            # Keep the first assignment if duplicate rows exist.
            shifts_by_employee_date.setdefault(
                key,
                (shift_date, shift_pattern),
            )

        # ------------------------------------------------------------
        # 3. Load attendance records independently of shifts.
        # ------------------------------------------------------------
        timesheet_rows = (
            self.db.query(TimesheetModel)
            .filter(
                TimesheetModel.emp_id.in_(employee_ids),
                TimesheetModel.date >= start_date,
                TimesheetModel.date <= end_date,
            )
            .order_by(
                TimesheetModel.date.asc(),
                TimesheetModel.id.asc(),
            )
            .all()
        )

        timesheets: Dict[tuple[int, date], TimesheetModel] = {}

        for attendance in timesheet_rows:
            attendance_day = self._as_date(attendance.date)

            if attendance_day is None:
                continue

            # If duplicate employee/date records exist, retain the latest
            # record according to the existing ID ordering.
            timesheets[
                (int(attendance.emp_id), attendance_day)
            ] = attendance

        # ------------------------------------------------------------
        # 4. Load active public holidays.
        # ------------------------------------------------------------
        holiday_rows = (
            self.db.query(HolidayModel)
            .filter(
                HolidayModel.holiday_date >= start_date,
                HolidayModel.holiday_date <= end_date,
                HolidayModel.status == 1,
            )
            .all()
        )

        holiday_map: Dict[date, Any] = {}

        for holiday in holiday_rows:
            holiday_day = self._as_date(
                getattr(holiday, "holiday_date", None)
            )

            if holiday_day is not None:
                holiday_map[holiday_day] = holiday

        # ------------------------------------------------------------
        # 5. Load approved leave overlapping the requested period.
        # ------------------------------------------------------------
        # start_datetime = datetime.combine(start_date, time.min)
        # end_datetime = datetime.combine(end_date, time.max)

        # leave_rows = (
        #     self.db.query(LeaveLogModel)
        #     .filter(
        #         LeaveLogModel.emp_id.in_(employee_ids),
        #         LeaveLogModel.leave_from <= end_datetime,
        #         LeaveLogModel.leave_to >= start_datetime,
        #         LeaveLogModel.status == 1,
        #     )
        #     .all()
        # )

        # leaves_by_employee: Dict[int, List[Any]] = {}

        # for leave in leave_rows:
        #     leaves_by_employee.setdefault(
        #         int(leave.emp_id), []
        #     ).append(leave)

        
        # ------------------------------------------------------------
        # 5. Load approved leave overlapping the requested period.
        #    Match calendar dates explicitly to avoid datetime-boundary
        #    mismatches. Keep the approved status filter unchanged.
        # ------------------------------------------------------------

        leave_rows = (
            self.db.query(LeaveLogModel)
            .filter(
                LeaveLogModel.emp_id.in_(employee_ids),
                LeaveLogModel.leave_from.isnot(None),
                LeaveLogModel.leave_to.isnot(None),
                func.date(LeaveLogModel.leave_from) <= end_date,
                func.date(LeaveLogModel.leave_to) >= start_date,
                LeaveLogModel.status == 1,
            )
            .all()
        )

        leaves_by_employee: Dict[int, List[Any]] = {}

        for leave in leave_rows:
            if leave.emp_id is None:
                continue

            leaves_by_employee.setdefault(
                int(leave.emp_id),
                [],
            ).append(leave)


        # ------------------------------------------------------------
        # 6. Generate one row per employee/date, including no-shift days.
        # ------------------------------------------------------------
        result: List[Dict[str, Any]] = []
        current_date = start_date

        while current_date <= end_date:
            for emp_id, employee_info in employees.items():
                employee = employee_info["employee"]
                designation = employee_info["designation"]
                department = employee_info["department"]
                joining_date = employee_info["joining_date"]

                # Do not generate attendance before the employee joined.
                # if joining_date is not None and current_date < joining_date:
                #     continue

                
                # Keep the calendar date visible, but mark it as outside
                # the employee's employment period.
                if joining_date is not None and current_date < joining_date:
                    result.append(
                        {
                            "attendance_date": current_date,
                            "day_of_week": current_date.strftime("%A"),
                            "employee_id": emp_id,
                            "employee_code": employee.emp_code,
                            "employee_name": self._employee_name(employee),
                            "designation": getattr(designation, "name", None),
                            "department": getattr(department, "name", None),
                            "shift_start_time": None,
                            "shift_end_time": None,
                            "patternname": None,
                            "isweekoff": False,
                            "leave_type": None,
                            "no_of_days": None,
                            "holiday_name": None,
                            "punch_in": None,
                            "punch_out": None,
                            "working_hours": 0.0,
                            "break_minutes": 0.0,
                            "is_pre_joining": True,
                        }
                    )
                    continue


                
                # if joining_date is not None and current_date < joining_date:
                #     result.append({
                #         "attendance_date": current_date,
                #         "day_of_week": current_date.strftime("%A"),
                #         "employee_id": emp_id,
                #         "employee_code": employee.emp_code,
                #         "employee_name": self._employee_name(employee),
                #         "designation": getattr(designation, "name", None),
                #         "department": getattr(department, "name", None),
                #         "shift_start_time": None,
                #         "shift_end_time": None,
                #         "patternname": None,
                #         "isweekoff": False,
                #         "leave_type": None,
                #         "no_of_days": None,
                #         "holiday_name": None,
                #         "punch_in": None,
                #         "punch_out": None,
                #         "working_hours": None,
                #         "break_minutes": None,
                #         "is_pre_joining": True,
                #     })
                #     continue


                shift_info = shifts_by_employee_date.get(
                    (emp_id, current_date)
                )

                shift_date = shift_info[0] if shift_info else None
                shift_pattern = shift_info[1] if shift_info else None

                attendance = timesheets.get((emp_id, current_date))
                holiday = holiday_map.get(current_date)

                # Find an approved leave covering this day.
                leave = None

                for candidate in leaves_by_employee.get(emp_id, []):
                    leave_from = getattr(candidate, "leave_from", None)
                    leave_to = getattr(candidate, "leave_to", None)

                    if leave_from is None or leave_to is None:
                        continue

                    # Handle date-only or datetime leave fields.
                    if isinstance(leave_from, datetime):
                        leave_start = leave_from
                    else:
                        leave_start = datetime.combine(
                            leave_from, time.min
                        )

                    if isinstance(leave_to, datetime):
                        leave_end = leave_to
                    else:
                        leave_end = datetime.combine(
                            leave_to, time.max
                        )

                    if (
                        leave_start <= datetime.combine(
                            current_date, time.max
                        )
                        and leave_end >= datetime.combine(
                            current_date, time.min
                        )
                    ):
                        leave = candidate
                        break

                leave_type = (
                    getattr(leave, "leave_type", None)
                    if leave is not None
                    else None
                )
                no_of_days = (
                    getattr(leave, "no_of_days", None)
                    if leave is not None
                    else None
                )

                holiday_name = None

                if holiday is not None:
                    holiday_name = (
                        getattr(holiday, "name", None)
                        or getattr(holiday, "holiday_name", None)
                        or getattr(holiday, "description", None)
                        or "Public Holiday"
                    )

                result.append(
                    {
                        "attendance_date": current_date,
                        "day_of_week": current_date.strftime("%A"),
                        "employee_id": emp_id,
                        "employee_code": employee.emp_code,
                        "employee_name": self._employee_name(employee),
                        "designation": getattr(
                            designation, "name", None
                        ),
                        "department": getattr(
                            department, "name", None
                        ),
                        "shift_start_time": getattr(
                            shift_pattern, "starttime", None
                        ),
                        "shift_end_time": getattr(
                            shift_pattern, "endtime", None
                        ),
                        "patternname": getattr(
                            shift_pattern, "patternname", None
                        ),
                        "isweekoff": bool(
                            getattr(shift_date, "isweekoff", False)
                        ),
                        "leave_type": leave_type,
                        "no_of_days": no_of_days,
                        "holiday_name": holiday_name,
                        "punch_in": (
                            attendance.punch_in
                            if attendance is not None
                            else None
                        ),
                        "punch_out": (
                            attendance.punch_out
                            if attendance is not None
                            else None
                        ),
                        "working_hours": (
                            attendance.working_hrs or 0.0
                            if attendance is not None
                            else 0.0
                        ),
                        "break_minutes": (
                            attendance.total_break or 0.0
                            if attendance is not None
                            else 0.0
                        ),
                    }
                )

            current_date += timedelta(days=1)

        return result
