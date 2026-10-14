# from calendar import monthrange
# from datetime import date, datetime
# from decimal import Decimal
# from io import BytesIO

# from reportlab.lib import colors
# from reportlab.lib.pagesizes import A4
# from reportlab.lib.styles import getSampleStyleSheet
# from reportlab.lib.units import mm
# from reportlab.platypus import (
#     SimpleDocTemplate,
#     Paragraph,
#     Spacer,
#     Table,
#     TableStyle,
# )

# from app.infrastructure.repositories.payroll.payslip_repository import (
#     PayslipRepository,
# )


# class PayslipService:

#     def __init__(
#         self,
#         repository: PayslipRepository
#     ):
#         self.repository = repository

#     # =========================================================
#     # DECIMAL
#     # =========================================================

#     @staticmethod
#     def decimal(value):

#         if value is None:
#             return Decimal("0")

#         try:
#             return Decimal(str(value))
#         except Exception:
#             return Decimal("0")

#     # =========================================================
#     # EMPLOYEES
#     # =========================================================

#     def get_employees(self):

#         return self.repository.get_employees()


#         # =========================================================
#     # PAYSLIPS BY EMPLOYEE ID
#     # =========================================================

#     def get_payslips_by_employee_id(
#         self,
#         emp_id: int
#     ):

#         employee = (
#             self.repository.get_employee(emp_id)
#         )

#         if not employee:
#             raise ValueError(
#                 "Employee not found"
#             )

#         rows = (
#             self.repository
#             .get_payslips_by_employee_id(
#                 emp_id
#             )
#         )

#         return self._format_employee_payslips(
#             rows
#         )

#     # =========================================================
#     # PAYSLIPS BY EMPLOYEE CODE
#     # =========================================================

#     def get_payslips_by_employee_code(
#         self,
#         emp_code: str
#     ):

#         employee = (
#             self.repository
#             .get_employee_by_code(
#                 emp_code
#             )
#         )

#         if not employee:
#             raise ValueError(
#                 "Employee not found"
#             )

#         rows = (
#             self.repository
#             .get_payslips_by_employee_code(
#                 emp_code
#             )
#         )

#         return self._format_employee_payslips(
#             rows
#         )

#     # =========================================================
#     # FORMAT EMPLOYEE PAYSLIPS
#     # =========================================================

#     def _format_employee_payslips(
#         self,
#         rows: list
#     ):

#         result = []

#         today = date.today()

#         for row in rows:

#             payslip_month = row.get(
#                 "month"
#             )

#             can_view = False

#             if payslip_month:

#                 if hasattr(
#                     payslip_month,
#                     "date"
#                 ):
#                     payslip_month = (
#                         payslip_month.date()
#                     )

#                 release_date = (
#                     payslip_month.replace(
#                         day=5
#                     )
#                 )

#                 can_view = (
#                     today >= release_date
#                 )

#             first_name = (
#                 row.get("first_name")
#                 or ""
#             )

#             last_name = (
#                 row.get("last_name")
#                 or ""
#             )

#             result.append({

#                 "id": row.get("id"),

#                 "emp_id": row.get(
#                     "emp_id"
#                 ),

#                 "emp_code": row.get(
#                     "emp_code"
#                 ),

#                 "employee_name": (
#                     f"{first_name} "
#                     f"{last_name}"
#                 ).strip(),

#                 "month": row.get(
#                     "month"
#                 ),

#                 "salary": row.get(
#                     "salary"
#                 ),

#                 "day_paid": row.get(
#                     "day_paid"
#                 ),

#                 "lop_absent": row.get(
#                     "lop_absent"
#                 ),

#                 "total_earnings": row.get(
#                     "total_earnings"
#                 ),

#                 "total_deduction": row.get(
#                     "total_deduction"
#                 ),

#                 "net_pay": row.get(
#                     "net_pay"
#                 ),

#                 "can_view": can_view
#             })

#         return result

#     # =========================================================
#     # PAYSLIP LIST
#     # =========================================================

#     def get_payslips(
#         self,
#         emp_id=None,
#         year=None,
#         month=None
#     ):

#         rows = self.repository.get_payslips(
#             emp_id,
#             year,
#             month
#         )

#         result = []

#         today = date.today()

#         for row in rows:

#             payslip_month = row.get(
#                 "month"
#             )

#             can_view = False

#             if payslip_month:

#                 if hasattr(
#                     payslip_month,
#                     "date"
#                 ):
#                     payslip_month = (
#                         payslip_month.date()
#                     )

#                 release_date = payslip_month.replace(
#                     day=5
#                 )

#                 can_view = (
#                     today >= release_date
#                 )

#             first_name = (
#                 row.get("first_name")
#                 or ""
#             )

#             last_name = (
#                 row.get("last_name")
#                 or ""
#             )

#             result.append({

#                 "id": row.get("id"),

#                 "emp_id": row.get(
#                     "emp_id"
#                 ),

#                 "emp_code": row.get(
#                     "emp_code"
#                 ),

#                 "employee_name": (
#                     f"{first_name} "
#                     f"{last_name}"
#                 ).strip(),

#                 "month": row.get(
#                     "month"
#                 ),

#                 "salary": row.get(
#                     "salary"
#                 ),

#                 "day_paid": row.get(
#                     "day_paid"
#                 ),

#                 "lop_absent": row.get(
#                     "lop_absent"
#                 ),

#                 "total_earnings": row.get(
#                     "total_earnings"
#                 ),

#                 "total_deduction": row.get(
#                     "total_deduction"
#                 ),

#                 "net_pay": row.get(
#                     "net_pay"
#                 ),

#                 "can_view": can_view
#             })

#         return result

#     # =========================================================
#     # CHECK
#     # =========================================================

#     def check_payslip(
#         self,
#         emp_id: int,
#         year: int,
#         month: int
#     ):

#         setting = (
#             self.repository
#             .get_payroll_setting()
#         )

#         if not setting:

#             return {
#                 "res": "NoPayrollSetting",
#                 "message": (
#                     "Payroll setting not found"
#                 )
#             }

#         existing = (
#             self.repository
#             .get_existing_payslip(
#                 emp_id,
#                 year,
#                 month
#             )
#         )

#         if existing:

#             return {
#                 "res": "Slip",
#                 "message": (
#                     "Salary generated for this month"
#                 ),
#                 "payslip": existing
#             }

#         salary = (
#             self.repository
#             .get_employee_salary(
#                 emp_id
#             )
#         )

#         if not salary:

#             return {
#                 "res": "NoSalaryFound",
#                 "message": (
#                     "No salary found for employee"
#                 )
#             }

#         salary_amount = self.decimal(
#             salary.get("salary")
#         )

#         if salary_amount <= 0:

#             return {
#                 "res": "NoSalaryFound",
#                 "message": (
#                     "No salary found for employee"
#                 )
#             }

#         calculation = self.calculate_salary(
#             emp_id,
#             year,
#             month
#         )

#         return {
#             "res": "success",
#             "message": (
#                 "Salary details found"
#             ),
#             "ps": calculation
#         }

#     # =========================================================
#     # CALCULATE
#     # =========================================================

#     def calculate_salary(
#         self,
#         emp_id: int,
#         year: int,
#         month: int
#     ):

#         employee = (
#             self.repository
#             .get_employee(emp_id)
#         )

#         if not employee:

#             raise ValueError(
#                 "Employee not found"
#             )

#         salary_data = (
#             self.repository
#             .get_employee_salary(
#                 emp_id
#             )
#         )

#         if not salary_data:

#             raise ValueError(
#                 "Employee salary not found"
#             )

#         salary = self.decimal(
#             salary_data.get("salary")
#         )

#         if salary <= 0:

#             raise ValueError(
#                 "Employee salary is zero"
#             )

#         setting = (
#             self.repository
#             .get_payroll_setting()
#         )

#         if not setting:

#             raise ValueError(
#                 "Payroll setting not found"
#             )

#         days_in_month = monthrange(
#             year,
#             month
#         )[1]

#         first_date = date(
#             year,
#             month,
#             1
#         )

#         last_date = date(
#             year,
#             month,
#             days_in_month
#         )

#         # -----------------------------------------------------
#         # TIMESHEET
#         # -----------------------------------------------------

#         timesheets = (
#             self.repository
#             .get_timesheets(
#                 emp_id,
#                 first_date,
#                 last_date
#             )
#         )

#         working_days = len(
#             {
#                 (
#                     x.get("date").date()
#                     if hasattr(
#                         x.get("date"),
#                         "date"
#                     )
#                     else x.get("date")
#                 )
#                 for x in timesheets
#                 if x.get("date") is not None
#             }
#         )

#         # -----------------------------------------------------
#         # WEEKENDS
#         # -----------------------------------------------------

#         weekends = 0

#         for day_number in range(
#             1,
#             days_in_month + 1
#         ):

#             current_date = date(
#                 year,
#                 month,
#                 day_number
#             )

#             if current_date.weekday() in (
#                 5,
#                 6
#             ):
#                 weekends += 1

#         # -----------------------------------------------------
#         # HOLIDAYS
#         # -----------------------------------------------------

#         holidays = (
#             self.repository
#             .get_holidays(
#                 first_date,
#                 last_date
#             )
#         )

#         holiday_dates = set()

#         for holiday in holidays:

#             holiday_date = holiday.get(
#                 "holiday_date"
#             )

#             if holiday_date:

#                 if hasattr(
#                     holiday_date,
#                     "date"
#                 ):
#                     holiday_date = (
#                         holiday_date.date()
#                     )

#                 holiday_dates.add(
#                     holiday_date
#                 )

#         holiday_count = len(
#             holiday_dates
#         )

#         # -----------------------------------------------------
#         # APPROVED LEAVES
#         # -----------------------------------------------------

#         leaves = (
#             self.repository
#             .get_leaves(
#                 emp_id,
#                 first_date,
#                 last_date
#             )
#         )

#         availed_leave = Decimal(
#             "0"
#         )

#         lop_absent = Decimal(
#             "0"
#         )

#         for leave in leaves:

#             leave_from = leave.get(
#                 "leave_from"
#             )

#             leave_to = leave.get(
#                 "leave_to"
#             )

#             if not leave_from or not leave_to:
#                 continue

#             if hasattr(
#                 leave_from,
#                 "date"
#             ):
#                 leave_from = (
#                     leave_from.date()
#                 )

#             if hasattr(
#                 leave_to,
#                 "date"
#             ):
#                 leave_to = (
#                     leave_to.date()
#                 )

#             effective_from = max(
#                 leave_from,
#                 first_date
#             )

#             effective_to = min(
#                 leave_to,
#                 last_date
#             )

#             if effective_from > effective_to:
#                 continue

#             days = self.decimal(
#                 leave.get(
#                     "no_of_days"
#                 )
#             )

#             if days <= 0:

#                 days = Decimal(
#                     (
#                         effective_to
#                         - effective_from
#                     ).days + 1
#                 )

#             leave_type = str(
#                 leave.get(
#                     "leave_type"
#                 )
#                 or ""
#             ).lower()

#             availed_leave += days

#             if "lop" in leave_type:

#                 lop_absent += days

#         # -----------------------------------------------------
#         # DAY PAID
#         # -----------------------------------------------------

#         day_paid = (
#             working_days
#             + weekends
#             + holiday_count
#         )

#         if day_paid > days_in_month:

#             day_paid = days_in_month

#         # -----------------------------------------------------
#         # DAILY SALARY
#         # -----------------------------------------------------

#         daily_salary = (
#             salary
#             / Decimal(days_in_month)
#         )

#         total_earnings = (
#             daily_salary
#             * Decimal(day_paid)
#         )

#         # -----------------------------------------------------
#         # BASIC
#         # -----------------------------------------------------

#         basic_percentage = self.decimal(
#             setting.get(
#                 "basic_earning"
#             )
#         )

#         basic = (
#             total_earnings
#             * basic_percentage
#             / Decimal("100")
#         )

#         # -----------------------------------------------------
#         # HRA
#         # -----------------------------------------------------

#         hra_percentage = self.decimal(
#             setting.get(
#                 "hra"
#             )
#         )

#         hra = (
#             basic
#             * hra_percentage
#             / Decimal("100")
#         )

#         # -----------------------------------------------------
#         # CONVEYANCE
#         # -----------------------------------------------------

#         conveyance = self.decimal(
#             setting.get(
#                 "conveyance_allowance"
#             )
#         )

#         # -----------------------------------------------------
#         # SPECIAL
#         # -----------------------------------------------------

#         special_allowance = (
#             total_earnings
#             - basic
#             - hra
#             - conveyance
#         )

#         # -----------------------------------------------------
#         # DEDUCTIONS
#         # -----------------------------------------------------

#         pf = self.decimal(
#             setting.get(
#                 "provident_fund"
#             )
#         )

#         esic = self.decimal(
#             setting.get(
#                 "esic"
#             )
#         )

#         pt = self.decimal(
#             setting.get(
#                 "professional_tax"
#             )
#         )

#         other_earning = Decimal(
#             "0"
#         )

#         night_allowance = Decimal(
#             "0"
#         )

#         other_deduction = Decimal(
#             "0"
#         )

#         pf_employer = Decimal(
#             "0"
#         )

#         total_deduction = (
#             pf
#             + esic
#             + pt
#             + other_deduction
#         )

#         net_pay = (
#             total_earnings
#             - total_deduction
#         )

#         # -----------------------------------------------------
#         # LEAVE BALANCE
#         # -----------------------------------------------------

#         balance_leave = Decimal(
#             "0"
#         )

#         leave_balance = (
#             self.repository
#             .get_leave_balance(
#                 employee.get("emp_code"),
#                 year
#             )
#         )

#         if leave_balance:

#             balance_leave = (
#                 self.decimal(
#                     leave_balance.get(
#                         "remained_paid_leave"
#                     )
#                 )
#                 +
#                 self.decimal(
#                     leave_balance.get(
#                         "remained_casual_leave"
#                     )
#                 )
#                 +
#                 self.decimal(
#                     leave_balance.get(
#                         "remained_comp_off"
#                     )
#                 )
#             )

#         return {

#             "Salary": salary,

#             "Day_Paid": day_paid,

#             "LOP_Absent": lop_absent,

#             "Basic": basic,

#             "HRA": hra,

#             "Conveyance_Allowance": conveyance,

#             "Special_Allowance": special_allowance,

#             "Other_Earning": other_earning,

#             "Night_Allowance": night_allowance,

#             "PF": pf,

#             "PF_Employer": pf_employer,

#             "ESIC": esic,

#             "PT": pt,

#             "Other_Deduction": other_deduction,

#             "Total_Earnings": total_earnings,

#             "Total_Deduction": total_deduction,

#             "Net_Pay": net_pay,

#             "Availed_leave": availed_leave,

#             "Balance_leave": balance_leave
#         }

#     # =========================================================
#     # GENERATE
#     # =========================================================

#     def generate_payslip(
#         self,
#         emp_id: int,
#         year: int,
#         month: int
#     ):

#         existing = (
#             self.repository
#             .get_existing_payslip(
#                 emp_id,
#                 year,
#                 month
#             )
#         )

#         if existing:

#             raise ValueError(
#                 "Payslip already generated "
#                 "for this employee and month"
#             )

#         calculation = (
#             self.calculate_salary(
#                 emp_id,
#                 year,
#                 month
#             )
#         )

#         data = {

#             "month": date(
#                 year,
#                 month,
#                 1
#             ),

#             "emp_id": emp_id,

#             "salary": calculation[
#                 "Salary"
#             ],

#             "day_paid": calculation[
#                 "Day_Paid"
#             ],

#             "lop_absent": calculation[
#                 "LOP_Absent"
#             ],

#             "basic": calculation[
#                 "Basic"
#             ],

#             "hra": calculation[
#                 "HRA"
#             ],

#             "conveyance_allowance":
#                 calculation[
#                     "Conveyance_Allowance"
#                 ],

#             "special_allowance":
#                 calculation[
#                     "Special_Allowance"
#                 ],

#             "other_earning":
#                 calculation[
#                     "Other_Earning"
#                 ],

#             "pf": calculation[
#                 "PF"
#             ],

#             "esic": calculation[
#                 "ESIC"
#             ],

#             "pt": calculation[
#                 "PT"
#             ],

#             "other_deduction":
#                 calculation[
#                     "Other_Deduction"
#                 ],

#             "total_earnings":
#                 calculation[
#                     "Total_Earnings"
#                 ],

#             "total_deduction":
#                 calculation[
#                     "Total_Deduction"
#                 ],

#             "net_pay":
#                 calculation[
#                     "Net_Pay"
#                 ],

#             "availed_leave":
#                 calculation[
#                     "Availed_leave"
#                 ],

#             "balance_leave":
#                 calculation[
#                     "Balance_leave"
#                 ],

#             "night_allowance":
#                 calculation[
#                     "Night_Allowance"
#                 ],

#             "pf_employer":
#                 calculation[
#                     "PF_Employer"
#                 ],

#             "createdon":
#                 datetime.now()
#         }

#         payslip_id = (
#             self.repository
#             .create_payslip(
#                 data
#             )
#         )

#         return {
#             "id": payslip_id,
#             **calculation
#         }


#         # =========================================================
#     # NORMALIZE FULL PAYSLIP RESPONSE
#     # =========================================================

#     def normalize_payslip_response(self, data: dict):

#         if not data:
#             return None

#         employee = data.get("employee") or {}
#         personal = data.get("personal") or {}
#         bank = data.get("bank") or {}
#         salary_details = data.get("salary_details") or {}
#         company = data.get("company") or {}
#         designation = data.get("designation") or {}
#         department = data.get("department") or {}

#         first_name = employee.get("first_name") or ""
#         last_name = employee.get("last_name") or ""

#         employee_name = (
#             f"{first_name} {last_name}"
#         ).strip()

#         return {
#             # -------------------------------------------------
#             # EXISTING PAYSLIP DATA
#             # -------------------------------------------------

#             **data,

#             # -------------------------------------------------
#             # EMPLOYEE DETAILS
#             # -------------------------------------------------

#             "emp_id": data.get("emp_id"),

#             "emp_code": employee.get("emp_code"),

#             "first_name": first_name,

#             "last_name": last_name,

#             "employee_name": employee_name,

#             "doj": employee.get("doj"),

#             "location": employee.get(
#                 "company_location"
#             ),

#             # -------------------------------------------------
#             # PERSONAL DETAILS
#             # -------------------------------------------------

#             "pan_no": personal.get("pan_no"),

#             "aadhar_no": personal.get("aadhar_no"),

#             "passport_no": personal.get("passport_no"),

#             "email": personal.get("email"),

#             "phone": personal.get("phone"),

#             "current_address": personal.get(
#                 "current_address"
#             ),

#             "permanent_address": personal.get(
#                 "permanent_address"
#             ),

#             # -------------------------------------------------
#             # BANK DETAILS
#             # -------------------------------------------------

#             "bank_name": bank.get("bank_name"),

#             "account_no": bank.get("account_no"),

#             "ifsc_code": bank.get("ifsc_code"),

#             # -------------------------------------------------
#             # SALARY DETAILS
#             # -------------------------------------------------

#             "uan": salary_details.get("uan"),

#             "esic_no": salary_details.get("esic"),

#             "mode_pay": salary_details.get("mode_pay"),

#             "pay_mode": data.get("pay_mode"),

#             # -------------------------------------------------
#             # DESIGNATION AND DEPARTMENT
#             # -------------------------------------------------

#             "designation_name": designation.get("name"),

#             "department_name": department.get("name"),

#             # -------------------------------------------------
#             # COMPANY DETAILS
#             # -------------------------------------------------

#             "company_logo": company.get("company_logo"),

#             "company_name": company.get("company_name"),

#             "company_address": company.get(
#                 "company_address"
#             ),

#             "company_contact": company.get(
#                 "company_contact"
#             )
#         }

#     # =========================================================
#     # DETAIL
#     # =========================================================

#     def get_payslip(
#         self,
#         payslip_id: int
#     ):

#         data = (
#             self.repository
#             .get_full_payslip(
#                 payslip_id
#             )
#         )

#         if not data:
#             return None

#         return self.normalize_payslip_response(
#             data
#         )

#     # =========================================================
#     # PDF
#     # =========================================================

#     def generate_pdf(
#         self,
#         payslip_id: int
#     ):

#         data = self.get_payslip(
#             payslip_id
#         )

#         if not data:

#             raise ValueError(
#                 "Payslip not found"
#             )

#         payslip = data
#         employee = (
#             data.get("employee")
#             or {}
#         )

#         company = (
#             data.get("company")
#             or {}
#         )

#         department = (
#             data.get("department")
#             or {}
#         )

#         designation = (
#             data.get("designation")
#             or {}
#         )

#         buffer = BytesIO()

#         document = SimpleDocTemplate(
#             buffer,
#             pagesize=A4,
#             leftMargin=20 * mm,
#             rightMargin=20 * mm,
#             topMargin=15 * mm,
#             bottomMargin=15 * mm
#         )

#         styles = getSampleStyleSheet()

#         story = []

#         company_name = (
#             company.get(
#                 "company_name"
#             )
#             or "Company"
#         )

#         story.append(
#             Paragraph(
#                 f"<b>{company_name}</b>",
#                 styles["Title"]
#             )
#         )

#         story.append(
#             Spacer(
#                 1,
#                 5
#             )
#         )

#         story.append(
#             Paragraph(
#                 str(
#                     company.get(
#                         "company_address"
#                     )
#                     or ""
#                 ),
#                 styles["Normal"]
#             )
#         )

#         story.append(
#             Paragraph(
#                 str(
#                     company.get(
#                         "company_contact"
#                     )
#                     or ""
#                 ),
#                 styles["Normal"]
#             )
#         )

#         story.append(
#             Spacer(
#                 1,
#                 10
#             )
#         )

#         month_value = payslip.get(
#             "month"
#         )

#         month_text = ""

#         if month_value:

#             if hasattr(
#                 month_value,
#                 "strftime"
#             ):

#                 month_text = (
#                     month_value.strftime(
#                         "%B %Y"
#                     )
#                 )

#             else:

#                 month_text = str(
#                     month_value
#                 )

#         story.append(
#             Paragraph(
#                 f"<b>PAYSLIP - {month_text}</b>",
#                 styles["Heading2"]
#             )
#         )

#         story.append(
#             Spacer(
#                 1,
#                 10
#             )
#         )

#         employee_name = (
#             f"{employee.get('first_name') or ''} "
#             f"{employee.get('last_name') or ''}"
#         ).strip()

#         employee_table = Table(
#             [
#                 [
#                     "Employee Name",
#                     employee_name
#                 ],
#                 [
#                     "Employee ID",
#                     employee.get(
#                         "emp_code"
#                     ) or ""
#                 ],
#                 [
#                     "Department",
#                     department.get(
#                         "name"
#                     ) or ""
#                 ],
#                 [
#                     "Designation",
#                     designation.get(
#                         "name"
#                     ) or ""
#                 ],
#                 [
#                     "Payment Mode",
#                     data.get(
#                         "pay_mode"
#                     ) or "Other"
#                 ],
#                 [
#                     "Day Paid",
#                     str(
#                         payslip.get(
#                             "day_paid"
#                         )
#                         or 0
#                     )
#                 ],
#                 [
#                     "LOP / Absent",
#                     str(
#                         payslip.get(
#                             "lop_absent"
#                         )
#                         or 0
#                     )
#                 ]
#             ],
#             colWidths=[
#                 50 * mm,
#                 120 * mm
#             ]
#         )

#         employee_table.setStyle(
#             TableStyle([
#                 (
#                     "GRID",
#                     (0, 0),
#                     (-1, -1),
#                     0.5,
#                     colors.grey
#                 ),
#                 (
#                     "BACKGROUND",
#                     (0, 0),
#                     (0, -1),
#                     colors.lightgrey
#                 ),
#                 (
#                     "VALIGN",
#                     (0, 0),
#                     (-1, -1),
#                     "TOP"
#                 )
#             ])
#         )

#         story.append(
#             employee_table
#         )

#         story.append(
#             Spacer(
#                 1,
#                 12
#             )
#         )

#         def amount(field):

#             value = self.decimal(
#                 payslip.get(field)
#             )

#             return f"{value:.2f}"

#         earnings = Table(
#             [
#                 ["Earnings", "Amount"],

#                 ["Basic", amount("basic")],

#                 ["HRA", amount("hra")],

#                 [
#                     "Conveyance Allowance",
#                     amount(
#                         "conveyance_allowance"
#                     )
#                 ],

#                 [
#                     "Special Allowance",
#                     amount(
#                         "special_allowance"
#                     )
#                 ],

#                 [
#                     "Other Earnings",
#                     amount(
#                         "other_earning"
#                     )
#                 ],

#                 [
#                     "Night Allowance",
#                     amount(
#                         "night_allowance"
#                     )
#                 ],

#                 [
#                     "Total Earnings",
#                     amount(
#                         "total_earnings"
#                     )
#                 ]
#             ],
#             colWidths=[
#                 120 * mm,
#                 50 * mm
#             ]
#         )

#         earnings.setStyle(
#             TableStyle([
#                 (
#                     "GRID",
#                     (0, 0),
#                     (-1, -1),
#                     0.5,
#                     colors.grey
#                 ),
#                 (
#                     "BACKGROUND",
#                     (0, 0),
#                     (-1, 0),
#                     colors.lightgrey
#                 ),
#                 (
#                     "BACKGROUND",
#                     (0, -1),
#                     (-1, -1),
#                     colors.lightgrey
#                 )
#             ])
#         )

#         story.append(
#             earnings
#         )

#         story.append(
#             Spacer(
#                 1,
#                 12
#             )
#         )

#         deductions = Table(
#             [
#                 ["Deductions", "Amount"],

#                 ["PF", amount("pf")],

#                 ["ESIC", amount("esic")],

#                 ["Professional Tax", amount("pt")],

#                 [
#                     "Other Deduction",
#                     amount(
#                         "other_deduction"
#                     )
#                 ],

#                 [
#                     "Total Deduction",
#                     amount(
#                         "total_deduction"
#                     )
#                 ],

#                 [
#                     "Net Pay",
#                     amount("net_pay")
#                 ]
#             ],
#             colWidths=[
#                 120 * mm,
#                 50 * mm
#             ]
#         )

#         deductions.setStyle(
#             TableStyle([
#                 (
#                     "GRID",
#                     (0, 0),
#                     (-1, -1),
#                     0.5,
#                     colors.grey
#                 ),
#                 (
#                     "BACKGROUND",
#                     (0, 0),
#                     (-1, 0),
#                     colors.lightgrey
#                 ),
#                 (
#                     "BACKGROUND",
#                     (0, -2),
#                     (-1, -1),
#                     colors.lightgrey
#                 )
#             ])
#         )

#         story.append(
#             deductions
#         )

#         story.append(
#             Spacer(
#                 1,
#                 15
#             )
#         )

#         story.append(
#             Paragraph(
#                 "<b>This is a system generated payslip.</b>",
#                 styles["Normal"]
#             )
#         )

#         document.build(
#             story
#         )

#         buffer.seek(0)

#         return buffer.read()

#     # =========================================================
#     # DELETE
#     # =========================================================

#     def delete_payslip(
#         self,
#         payslip_id: int
#     ):

#         existing = (
#             self.repository
#             .get_payslip(
#                 payslip_id
#             )
#         )

#         if not existing:

#             raise ValueError(
#                 "Payslip not found"
#             )

#         self.repository.delete_payslip(
#             payslip_id
#         )

#         return {
#             "id": payslip_id
#         }

#     # =========================================================
#     # PAYROLL SETTINGS
#     # =========================================================

#     def get_payroll_settings(self):

#         return (
#             self.repository
#             .get_payroll_setting()
#         )

#     # =========================================================
#     # UPDATE SETTINGS
#     # =========================================================

#     def update_payroll_settings(
#         self,
#         data: dict
#     ):

#         setting_id = (
#             self.repository
#             .update_payroll_setting(
#                 data
#             )
#         )

#         return {
#             "id": setting_id
#         }


from calendar import month, monthrange
from datetime import date, datetime
from decimal import Decimal
from io import BytesIO
import os
import smtplib
from email.message import EmailMessage

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

from app.infrastructure.repositories.payroll.payslip_repository import (
    PayslipRepository,
)

from app.core.config import settings


class PayslipService:

    def __init__(
        self,
        repository: PayslipRepository
    ):
        self.repository = repository

    # =========================================================
    # DECIMAL
    # =========================================================

    @staticmethod
    def decimal(value):

        if value is None:
            return Decimal("0")

        try:
            return Decimal(str(value))
        except Exception:
            return Decimal("0")

    # =========================================================
    # EMPLOYEES
    # =========================================================

    # def get_employees(self):

    #     return self.repository.get_employees()

    def get_employees(
        self,
        year: int | None = None,
        month: int | None = None,
    ):
        return self.repository.get_employees(
            year=year,
            month=month,
        )


        # =========================================================
    # PAYSLIPS BY EMPLOYEE ID
    # =========================================================

    def get_payslips_by_employee_id(
        self,
        emp_id: int
    ):

        employee = (
            self.repository.get_employee(emp_id)
        )

        if not employee:
            raise ValueError(
                "Employee not found"
            )

        rows = (
            self.repository
            .get_payslips_by_employee_id(
                emp_id
            )
        )

        return self._format_employee_payslips(
            rows
        )

    # =========================================================
    # PAYSLIPS BY EMPLOYEE CODE
    # =========================================================

    def get_payslips_by_employee_code(
        self,
        emp_code: str
    ):

        employee = (
            self.repository
            .get_employee_by_code(
                emp_code
            )
        )

        if not employee:
            raise ValueError(
                "Employee not found"
            )

        rows = (
            self.repository
            .get_payslips_by_employee_code(
                emp_code
            )
        )

        return self._format_employee_payslips(
            rows
        )

    # =========================================================
    # FORMAT EMPLOYEE PAYSLIPS
    # =========================================================

    def _format_employee_payslips(
        self,
        rows: list
    ):

        result = []

        today = date.today()

        for row in rows:

            payslip_month = row.get(
                "month"
            )

            can_view = False

            if payslip_month:

                if hasattr(
                    payslip_month,
                    "date"
                ):
                    payslip_month = (
                        payslip_month.date()
                    )

                release_date = (
                    payslip_month.replace(
                        day=5
                    )
                )

                can_view = (
                    today >= release_date
                )

            first_name = (
                row.get("first_name")
                or ""
            )

            last_name = (
                row.get("last_name")
                or ""
            )

            # result.append({

            #     "id": row.get("id"),

            #     "emp_id": row.get(
            #         "emp_id"
            #     ),

            #     "emp_code": row.get(
            #         "emp_code"
            #     ),

            #     "employee_name": (
            #         f"{first_name} "
            #         f"{last_name}"
            #     ).strip(),

            #     "month": row.get(
            #         "month"
            #     ),

            #     "salary": row.get(
            #         "salary"
            #     ),

            #     "day_paid": row.get(
            #         "day_paid"
            #     ),

            #     "lop_absent": row.get(
            #         "lop_absent"
            #     ),

            #     "total_earnings": row.get(
            #         "total_earnings"
            #     ),

            #     "total_deduction": row.get(
            #         "total_deduction"
            #     ),

            #     "net_pay": row.get(
            #         "net_pay"
            #     ),

            #     "can_view": can_view
            # })

            
            result.append({
                "id": row.get("id"),
                "emp_id": row.get("emp_id"),
                "emp_code": row.get("emp_code"),
                "employee_name": f"{first_name} {last_name}".strip(),

                "month": row.get("month"),
                "salary": row.get("salary"),
                "day_paid": row.get("day_paid"),
                "lop_absent": row.get("lop_absent"),

                # Earnings
                "basic": row.get("basic"),
                "hra": row.get("hra"),
                "conveyance_allowance": row.get("conveyance_allowance"),
                "special_allowance": row.get("special_allowance"),
                "other_earning": row.get("other_earning"),
                "night_allowance": row.get("night_allowance"),
                "total_earnings": row.get("total_earnings"),

                # Deductions
                "pf": row.get("pf"),
                "pf_employer": row.get("pf_employer"),
                "esic": row.get("esic"),
                "pt": row.get("pt"),
                "other_deduction": row.get("other_deduction"),
                "total_deduction": row.get("total_deduction"),

                # Net pay and leave
                "net_pay": row.get("net_pay"),
                "availed_leave": row.get("availed_leave"),
                "balance_leave": row.get("balance_leave"),

                # Preserve existing access control
                "can_view": can_view
            })

        return result

    # =========================================================
    # PAYSLIP LIST
    # =========================================================

    def get_payslips(
        self,
        emp_id=None,
        year=None,
        month=None
    ):

        rows = self.repository.get_payslips(
            emp_id,
            year,
            month
        )

        result = []

        today = date.today()

        for row in rows:

            payslip_month = row.get(
                "month"
            )

            can_view = False

            if payslip_month:

                if hasattr(
                    payslip_month,
                    "date"
                ):
                    payslip_month = (
                        payslip_month.date()
                    )

                release_date = payslip_month.replace(
                    day=5
                )

                can_view = (
                    today >= release_date
                )

            first_name = (
                row.get("first_name")
                or ""
            )

            last_name = (
                row.get("last_name")
                or ""
            )

            # result.append({

            #     "id": row.get("id"),

            #     "emp_id": row.get(
            #         "emp_id"
            #     ),

            #     "emp_code": row.get(
            #         "emp_code"
            #     ),

            #     "employee_name": (
            #         f"{first_name} "
            #         f"{last_name}"
            #     ).strip(),

            #     "month": row.get(
            #         "month"
            #     ),

            #     "salary": row.get(
            #         "salary"
            #     ),

            #     "day_paid": row.get(
            #         "day_paid"
            #     ),

            #     "lop_absent": row.get(
            #         "lop_absent"
            #     ),

            #     "total_earnings": row.get(
            #         "total_earnings"
            #     ),

            #     "total_deduction": row.get(
            #         "total_deduction"
            #     ),

            #     "net_pay": row.get(
            #         "net_pay"
            #     ),

            #     "can_view": can_view
            # })

            
            result.append({
                # Payslip identification
                "id": row.get("id"),
                "emp_id": row.get("emp_id"),
                "emp_code": row.get("emp_code"),
                "employee_name": f"{first_name} {last_name}".strip(),

                # Period and attendance
                "month": row.get("month"),
                "salary": row.get("salary"),
                "day_paid": row.get("day_paid"),
                "lop_absent": row.get("lop_absent"),

                # Earnings
                "basic": row.get("basic"),
                "hra": row.get("hra"),
                "conveyance_allowance": row.get("conveyance_allowance"),
                "special_allowance": row.get("special_allowance"),
                "other_earning": row.get("other_earning"),
                "night_allowance": row.get("night_allowance"),
                "total_earnings": row.get("total_earnings"),

                # Deductions
                "pf": row.get("pf"),
                "pf_employer": row.get("pf_employer"),
                "esic": row.get("esic"),
                "pt": row.get("pt"),
                "other_deduction": row.get("other_deduction"),
                "total_deduction": row.get("total_deduction"),

                # Final payment and leave
                "net_pay": row.get("net_pay"),
                "availed_leave": row.get("availed_leave"),
                "balance_leave": row.get("balance_leave"),

                # Audit fields
                "createdby": row.get("createdby"),
                "createdon": row.get("createdon"),
                "modifiedby": row.get("modifiedby"),
                "modifiedon": row.get("modifiedon"),

                # Preserve existing release-date logic
                "can_view": can_view
            })

        return result

    # =========================================================
    # CHECK
    # =========================================================

    def check_payslip(
        self,
        emp_id: int,
        year: int,
        month: int
    ):

        setting = (
            self.repository
            .get_payroll_setting()
        )

        if not setting:

            return {
                "res": "NoPayrollSetting",
                "message": (
                    "Payroll setting not found"
                )
            }

        existing = (
            self.repository
            .get_existing_payslip(
                emp_id,
                year,
                month
            )
        )

        if existing:

            return {
                "res": "Slip",
                "message": (
                    "Salary generated for this month"
                ),
                "payslip": existing
            }

        salary = (
            self.repository
            .get_employee_salary(
                emp_id
            )
        )

        if not salary:

            return {
                "res": "NoSalaryFound",
                "message": (
                    "No salary found for employee"
                )
            }

        salary_amount = self.decimal(
            salary.get("salary")
        )

        if salary_amount <= 0:

            return {
                "res": "NoSalaryFound",
                "message": (
                    "No salary found for employee"
                )
            }

        calculation = self.calculate_salary(
            emp_id,
            year,
            month
        )

        return {
            "res": "success",
            "message": (
                "Salary details found"
            ),
            "ps": calculation
        }

    # =========================================================
    # CALCULATE
    # =========================================================

    def calculate_salary(
        self,
        emp_id: int,
        year: int,
        month: int
    ):

        if month < 1 or month > 12:
            raise ValueError("Month must be between 1 and 12.")

        employee = self.repository.get_employee(emp_id)
        if not employee:
            raise ValueError("Employee not found")

        if employee.get("is_remove") == 1:
            raise ValueError("Cannot generate a payslip for an inactive employee")

        salary_data = self.repository.get_employee_salary(emp_id)
        if not salary_data:
            raise ValueError("Employee salary not found")

        monthly_salary = self.decimal(salary_data.get("salary"))
        if monthly_salary <= 0:
            raise ValueError("Employee salary must be greater than zero")

        setting = self.repository.get_payroll_setting()
        if not setting:
            raise ValueError("Payroll setting not found")

        days_in_month = monthrange(year, month)[1]
        first_date = date(year, month, 1)
        last_date = date(year, month, days_in_month)

        # -----------------------------------------------------
        # ATTENDANCE: reuse the existing N1-N12 attendance
        # implementation instead of counting timesheets,
        # weekends, and holidays independently.
        # -----------------------------------------------------
        from app.infrastructure.repositories.attendance.attendance_report_repository import (
            AttendanceReportRepository,
        )
        from app.application.services.attendance.attendance_report_service import (
            AttendanceReportService,
        )

        attendance_repository = AttendanceReportRepository(
            self.repository.db
        )
        attendance_service = AttendanceReportService(
            attendance_repository
        )
        attendance_result = attendance_service.get_monthly_numbers(
            year=year,
            month=month,
            employee_id=emp_id,
        )

        attendance_rows = attendance_result.get("data") or []
        attendance = next(
            (
                row for row in attendance_rows
                if int(row.get("employee_id", -1)) == int(emp_id)
            ),
            None,
        )

        if attendance is None:
            raise ValueError(
                "No roster/attendance records were found for this employee "
                "and month. Payslip generation was stopped to avoid an "
                "incorrect salary calculation."
            )

        # The legacy payslip attendance calculation sums N1-N9 for paid
        # days and N10-N11 for LOP/absence. N12 is preserved separately
        # because the legacy attendance helper treats it as its own bucket.
        n_values = {
            f"N{i}": self.decimal(attendance.get(f"n{i}"))
            for i in range(1, 13)
        }
        day_paid = sum(
            (n_values[f"N{i}"] for i in range(1, 10)),
            Decimal("0"),
        )
        lop_absent = (
            n_values["N10"] + n_values["N11"]
        )

        if day_paid > Decimal(days_in_month):
            day_paid = Decimal(days_in_month)

        # -----------------------------------------------------
        # APPROVED LEAVE AVAILED IN THIS MONTH
        # -----------------------------------------------------
        leaves = self.repository.get_leaves(
            emp_id,
            first_date,
            last_date,
        )
        availed_leave = Decimal("0")

        for leave in leaves:
            leave_from = leave.get("leave_from")
            leave_to = leave.get("leave_to")
            if not leave_from or not leave_to:
                continue

            if hasattr(leave_from, "date"):
                leave_from = leave_from.date()
            if hasattr(leave_to, "date"):
                leave_to = leave_to.date()

            overlap_from = max(leave_from, first_date)
            overlap_to = min(leave_to, last_date)
            if overlap_from > overlap_to:
                continue

            declared_days = self.decimal(leave.get("no_of_days"))
            total_span_days = Decimal((leave_to - leave_from).days + 1)
            overlap_span_days = Decimal((overlap_to - overlap_from).days + 1)

            if declared_days <= 0 or total_span_days <= 0:
                month_leave_days = overlap_span_days
            else:
                # If one approved leave spans two months, allocate only
                # the overlapping portion to this payslip month.
                month_leave_days = (
                    declared_days * overlap_span_days / total_span_days
                )
            availed_leave += month_leave_days

        # -----------------------------------------------------
        # SALARY PRORATION
        # Monthly salary / calendar days * legacy paid days.
        # -----------------------------------------------------
        daily_salary = monthly_salary / Decimal(days_in_month)
        total_earnings = self._money(daily_salary * day_paid)

        # -----------------------------------------------------
        # EARNINGS: use Payroll Setting values, not duplicate static
        # UAN/no-UAN JavaScript or PayrollService formulas.
        # -----------------------------------------------------
        basic_percentage = self.decimal(setting.get("basic_earning"))
        hra_percentage = self.decimal(setting.get("hra"))

        basic = self._money(
            total_earnings * basic_percentage / Decimal("100")
        )
        hra = self._money(
            basic * hra_percentage / Decimal("100")
        )
        conveyance = self._money(
            self.decimal(setting.get("conveyance_allowance"))
        )

        other_earning = Decimal("0.00")
        night_allowance = Decimal("0.00")
        pf_employer = Decimal("0.00")

        # Special allowance balances earnings to the prorated gross.
        special_allowance = self._money(
            total_earnings - basic - hra - conveyance
            - other_earning - night_allowance
        )

        # -----------------------------------------------------
        # DEDUCTIONS: the legacy controller uses the configured
        # Payroll_Setting values as amounts. Do not silently replace
        # them with the conflicting hard-coded 12%/₹1800 JS rules.
        # -----------------------------------------------------
        pf = self._money(self.decimal(setting.get("provident_fund")))
        esic = self._money(self.decimal(setting.get("esic")))
        pt = self._money(self.decimal(setting.get("professional_tax")))
        other_deduction = Decimal("0.00")

        total_deduction = self._money(
            pf + esic + pt + other_deduction
        )
        net_pay = self._money(total_earnings - total_deduction)

        # -----------------------------------------------------
        # LEAVE BALANCE
        # -----------------------------------------------------
        balance_leave = Decimal("0.00")
        leave_balance = self.repository.get_leave_balance(
            employee.get("emp_code"),
            year,
        )
        if leave_balance:
            balance_leave = self._money(
                self.decimal(leave_balance.get("remained_paid_leave"))
                + self.decimal(leave_balance.get("remained_casual_leave"))
                + self.decimal(leave_balance.get("remained_comp_off"))
            )

        return {
            "Salary": self._money(monthly_salary),
            "Day_Paid": day_paid,
            "LOP_Absent": lop_absent,
            "Basic": basic,
            "HRA": hra,
            "Conveyance_Allowance": conveyance,
            "Special_Allowance": special_allowance,
            "Other_Earning": other_earning,
            "Night_Allowance": night_allowance,
            "PF": pf,
            "PF_Employer": pf_employer,
            "ESIC": esic,
            "PT": pt,
            "Other_Deduction": other_deduction,
            "Total_Earnings": total_earnings,
            "Total_Deduction": total_deduction,
            "Net_Pay": net_pay,
            "Availed_leave": self._money(availed_leave),
            "Balance_leave": balance_leave,
            "Attendance_N1": n_values["N1"],
            "Attendance_N2": n_values["N2"],
            "Attendance_N3": n_values["N3"],
            "Attendance_N4": n_values["N4"],
            "Attendance_N5": n_values["N5"],
            "Attendance_N6": n_values["N6"],
            "Attendance_N7": n_values["N7"],
            "Attendance_N8": n_values["N8"],
            "Attendance_N9": n_values["N9"],
            "Attendance_N10": n_values["N10"],
            "Attendance_N11": n_values["N11"],
            "Attendance_N12": n_values["N12"],
        }

    @staticmethod
    def _money(value):
        from decimal import ROUND_HALF_UP
        return Decimal(str(value)).quantize(
            Decimal("0.01"),
            rounding=ROUND_HALF_UP,
        )


    # =========================================================
    # GENERATE
    # =========================================================

    def generate_payslip(
        self,
        emp_id: int,
        year: int,
        month: int
    ):

        existing = (
            self.repository
            .get_existing_payslip(
                emp_id,
                year,
                month
            )
        )

        if existing:

            raise ValueError(
                "Payslip already generated "
                "for this employee and month"
            )

        calculation = (
            self.calculate_salary(
                emp_id,
                year,
                month
            )
        )

        data = {

            "month": date(
                year,
                month,
                1
            ),

            "emp_id": emp_id,

            "salary": calculation[
                "Salary"
            ],

            "day_paid": calculation[
                "Day_Paid"
            ],

            "lop_absent": calculation[
                "LOP_Absent"
            ],

            "basic": calculation[
                "Basic"
            ],

            "hra": calculation[
                "HRA"
            ],

            "conveyance_allowance":
                calculation[
                    "Conveyance_Allowance"
                ],

            "special_allowance":
                calculation[
                    "Special_Allowance"
                ],

            "other_earning":
                calculation[
                    "Other_Earning"
                ],

            "pf": calculation[
                "PF"
            ],

            "esic": calculation[
                "ESIC"
            ],

            "pt": calculation[
                "PT"
            ],

            "other_deduction":
                calculation[
                    "Other_Deduction"
                ],

            "total_earnings":
                calculation[
                    "Total_Earnings"
                ],

            "total_deduction":
                calculation[
                    "Total_Deduction"
                ],

            "net_pay":
                calculation[
                    "Net_Pay"
                ],

            "availed_leave":
                calculation[
                    "Availed_leave"
                ],

            "balance_leave":
                calculation[
                    "Balance_leave"
                ],

            "night_allowance":
                calculation[
                    "Night_Allowance"
                ],

            "pf_employer":
                calculation[
                    "PF_Employer"
                ],

            "createdon":
                datetime.now()
        }

        payslip_id = (
            self.repository
            .create_payslip(
                data
            )
        )

        return {
            "id": payslip_id,
            **calculation
        }


        # =========================================================
    # NORMALIZE FULL PAYSLIP RESPONSE
    # =========================================================

    def normalize_payslip_response(self, data: dict):

        if not data:
            return None

        employee = data.get("employee") or {}
        personal = data.get("personal") or {}
        bank = data.get("bank") or {}
        salary_details = data.get("salary_details") or {}
        company = data.get("company") or {}
        designation = data.get("designation") or {}
        department = data.get("department") or {}

        first_name = employee.get("first_name") or ""
        last_name = employee.get("last_name") or ""

        employee_name = (
            f"{first_name} {last_name}"
        ).strip()

        return {
            # -------------------------------------------------
            # EXISTING PAYSLIP DATA
            # -------------------------------------------------

            **data,

            # -------------------------------------------------
            # EMPLOYEE DETAILS
            # -------------------------------------------------

            "emp_id": data.get("emp_id"),

            "emp_code": employee.get("emp_code"),

            "first_name": first_name,

            "last_name": last_name,

            "employee_name": employee_name,

            "doj": employee.get("doj"),

            "location": employee.get(
                "company_location"
            ),

            # -------------------------------------------------
            # PERSONAL DETAILS
            # -------------------------------------------------

            "pan_no": personal.get("pan_no"),

            "aadhar_no": personal.get("aadhar_no"),

            "passport_no": personal.get("passport_no"),

            "email": personal.get("email"),

            "phone": personal.get("phone"),

            "current_address": personal.get(
                "current_address"
            ),

            "permanent_address": personal.get(
                "permanent_address"
            ),

            # -------------------------------------------------
            # BANK DETAILS
            # -------------------------------------------------

            "bank_name": bank.get("bank_name"),

            "account_no": bank.get("account_no"),

            "ifsc_code": bank.get("ifsc_code"),

            # -------------------------------------------------
            # SALARY DETAILS
            # -------------------------------------------------

            "uan": salary_details.get("uan"),

            "esic_no": salary_details.get("esic"),

            "mode_pay": salary_details.get("mode_pay"),

            "pay_mode": data.get("pay_mode"),

            # -------------------------------------------------
            # DESIGNATION AND DEPARTMENT
            # -------------------------------------------------

            "designation_name": designation.get("name"),

            "department_name": department.get("name"),

            # -------------------------------------------------
            # COMPANY DETAILS
            # -------------------------------------------------

            "company_logo": company.get("company_logo"),

            "company_name": company.get("company_name"),

            "company_address": company.get(
                "company_address"
            ),

            "company_contact": company.get(
                "company_contact"
            )
        }

    # =========================================================
    # DETAIL
    # =========================================================

    def get_payslip(
        self,
        payslip_id: int
    ):

        data = (
            self.repository
            .get_full_payslip(
                payslip_id
            )
        )

        if not data:
            return None

        return self.normalize_payslip_response(
            data
        )

    # =========================================================
    # PDF
    # =========================================================

    def generate_pdf(
        self,
        payslip_id: int
    ):

        data = self.get_payslip(
            payslip_id
        )

        if not data:

            raise ValueError(
                "Payslip not found"
            )

        payslip = data
        employee = (
            data.get("employee")
            or {}
        )

        company = (
            data.get("company")
            or {}
        )

        department = (
            data.get("department")
            or {}
        )

        designation = (
            data.get("designation")
            or {}
        )

        buffer = BytesIO()

        document = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            leftMargin=20 * mm,
            rightMargin=20 * mm,
            topMargin=15 * mm,
            bottomMargin=15 * mm
        )

        styles = getSampleStyleSheet()

        story = []

        company_name = (
            company.get(
                "company_name"
            )
            or "Company"
        )

        story.append(
            Paragraph(
                f"<b>{company_name}</b>",
                styles["Title"]
            )
        )

        story.append(
            Spacer(
                1,
                5
            )
        )

        story.append(
            Paragraph(
                str(
                    company.get(
                        "company_address"
                    )
                    or ""
                ),
                styles["Normal"]
            )
        )

        story.append(
            Paragraph(
                str(
                    company.get(
                        "company_contact"
                    )
                    or ""
                ),
                styles["Normal"]
            )
        )

        story.append(
            Spacer(
                1,
                10
            )
        )

        month_value = payslip.get(
            "month"
        )

        month_text = ""

        if month_value:

            if hasattr(
                month_value,
                "strftime"
            ):

                month_text = (
                    month_value.strftime(
                        "%B %Y"
                    )
                )

            else:

                month_text = str(
                    month_value
                )

        story.append(
            Paragraph(
                f"<b>PAYSLIP - {month_text}</b>",
                styles["Heading2"]
            )
        )

        story.append(
            Spacer(
                1,
                10
            )
        )

        employee_name = (
            f"{employee.get('first_name') or ''} "
            f"{employee.get('last_name') or ''}"
        ).strip()

        employee_table = Table(
            [
                [
                    "Employee Name",
                    employee_name
                ],
                [
                    "Employee ID",
                    employee.get(
                        "emp_code"
                    ) or ""
                ],
                [
                    "Department",
                    department.get(
                        "name"
                    ) or ""
                ],
                [
                    "Designation",
                    designation.get(
                        "name"
                    ) or ""
                ],
                [
                    "Payment Mode",
                    data.get(
                        "pay_mode"
                    ) or "Other"
                ],
                [
                    "Day Paid",
                    str(
                        payslip.get(
                            "day_paid"
                        )
                        or 0
                    )
                ],
                [
                    "LOP / Absent",
                    str(
                        payslip.get(
                            "lop_absent"
                        )
                        or 0
                    )
                ]
            ],
            colWidths=[
                50 * mm,
                120 * mm
            ]
        )

        employee_table.setStyle(
            TableStyle([
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.grey
                ),
                (
                    "BACKGROUND",
                    (0, 0),
                    (0, -1),
                    colors.lightgrey
                ),
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "TOP"
                )
            ])
        )

        story.append(
            employee_table
        )

        story.append(
            Spacer(
                1,
                12
            )
        )

        def amount(field):

            value = self.decimal(
                payslip.get(field)
            )

            return f"{value:.2f}"

        earnings = Table(
            [
                ["Earnings", "Amount"],

                ["Basic", amount("basic")],

                ["HRA", amount("hra")],

                [
                    "Conveyance Allowance",
                    amount(
                        "conveyance_allowance"
                    )
                ],

                [
                    "Special Allowance",
                    amount(
                        "special_allowance"
                    )
                ],

                [
                    "Other Earnings",
                    amount(
                        "other_earning"
                    )
                ],

                [
                    "Night Allowance",
                    amount(
                        "night_allowance"
                    )
                ],

                [
                    "Total Earnings",
                    amount(
                        "total_earnings"
                    )
                ]
            ],
            colWidths=[
                120 * mm,
                50 * mm
            ]
        )

        earnings.setStyle(
            TableStyle([
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.grey
                ),
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.lightgrey
                ),
                (
                    "BACKGROUND",
                    (0, -1),
                    (-1, -1),
                    colors.lightgrey
                )
            ])
        )

        story.append(
            earnings
        )

        story.append(
            Spacer(
                1,
                12
            )
        )

        deductions = Table(
            [
                ["Deductions", "Amount"],

                ["PF", amount("pf")],

                ["ESIC", amount("esic")],

                ["Professional Tax", amount("pt")],

                [
                    "Other Deduction",
                    amount(
                        "other_deduction"
                    )
                ],

                [
                    "Total Deduction",
                    amount(
                        "total_deduction"
                    )
                ],

                [
                    "Net Pay",
                    amount("net_pay")
                ]
            ],
            colWidths=[
                120 * mm,
                50 * mm
            ]
        )

        deductions.setStyle(
            TableStyle([
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.grey
                ),
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.lightgrey
                ),
                (
                    "BACKGROUND",
                    (0, -2),
                    (-1, -1),
                    colors.lightgrey
                )
            ])
        )

        story.append(
            deductions
        )

        story.append(
            Spacer(
                1,
                15
            )
        )

        story.append(
            Paragraph(
                "<b>This is a system generated payslip.</b>",
                styles["Normal"]
            )
        )

        document.build(
            story
        )

        buffer.seek(0)

        return buffer.read()

    # =========================================================
    # EMAIL PAYSLIP PDF
    # =========================================================

    # def send_email(self, payslip_id: int):
    #     """
    #     Send the generated payslip PDF to the employee's personal email.
    #     SMTP settings are read only from environment variables:
    #     SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD,
    #     SMTP_FROM_EMAIL (optional).
    #     """
    #     smtp_host = os.getenv("SMTP_HOST")
    #     smtp_port = int(os.getenv("SMTP_PORT", "587"))
    #     smtp_username = os.getenv("SMTP_USERNAME")
    #     smtp_password = os.getenv("SMTP_PASSWORD")
    #     from_email = os.getenv("SMTP_FROM_EMAIL") or smtp_username

    #     if not all((smtp_host, smtp_username, smtp_password, from_email)):
    #         raise ValueError(
    #             "SMTP is not configured. Set SMTP_HOST, SMTP_PORT, "
    #             "SMTP_USERNAME, SMTP_PASSWORD, and SMTP_FROM_EMAIL."
    #         )

    #     data = self.get_payslip(payslip_id)
    #     if not data:
    #         raise ValueError("Payslip not found")

    #     recipient = (data.get("email") or "").strip()
    #     if not recipient:
    #         raise ValueError(
    #             "Employee email address is missing; payslip was not sent."
    #         )

    #     pdf_bytes = self.generate_pdf(payslip_id)
    #     month_value = data.get("month")
    #     if hasattr(month_value, "strftime"):
    #         month_text = month_value.strftime("%B %Y")
    #     else:
    #         month_text = str(month_value or "Payroll")

    #     employee_name = data.get("employee_name") or "Employee"
    #     net_pay = self.decimal(data.get("net_pay"))

    #     message = EmailMessage()
    #     message["Subject"] = f"Payslip for {month_text}"
    #     message["From"] = from_email
    #     message["To"] = recipient
    #     message.set_content(
    #         f"Dear {employee_name},\n\n"
    #         f"Please find attached your payslip for {month_text}.\n"
    #         f"Net pay: ₹{net_pay:,.2f}\n\n"
    #         "This is an automatically generated email. Please contact HR "
    #         "if you have any questions.\n"
    #     )
    #     message.add_attachment(
    #         pdf_bytes,
    #         maintype="application",
    #         subtype="pdf",
    #         filename=f"Payslip_{payslip_id}.pdf",
    #     )

    #     with smtplib.SMTP(smtp_host, smtp_port, timeout=30) as smtp:
    #         smtp.ehlo()
    #         smtp.starttls()
    #         smtp.ehlo()
    #         smtp.login(smtp_username, smtp_password)
    #         smtp.send_message(message)

    #     return {
    #         "success": True,
    #         "payslip_id": payslip_id,
    #         "recipient": recipient,
    #     }

    
    # def send_email(self, payslip_id: int):
    #     """
    #     Send the generated payslip PDF to the employee's email.

    #     Supports both:
    #     MAIL_SERVER, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD,
    #     MAIL_FROM, MAIL_FROM_NAME, MAIL_STARTTLS, MAIL_SSL_TLS

    #     and the SMTP_* environment variable names.
    #     """
    #     import os
    #     import smtplib
    #     from email.message import EmailMessage
    #     from email.utils import formataddr
    #     from email import policy

    #     # Support the application's existing environment configuration.
    #     smtp_host = (
    #         os.getenv("SMTP_HOST")
    #         or os.getenv("MAIL_SERVER")
    #     )

    #     smtp_port = int(
    #         os.getenv("SMTP_PORT")
    #         or os.getenv("MAIL_PORT")
    #         or "587"
    #     )

    #     smtp_username = (
    #         os.getenv("SMTP_USERNAME")
    #         or os.getenv("MAIL_USERNAME")
    #     )

    #     smtp_password = (
    #         os.getenv("SMTP_PASSWORD")
    #         or os.getenv("MAIL_PASSWORD")
    #     )

    #     from_email = (
    #         os.getenv("SMTP_FROM_EMAIL")
    #         or os.getenv("MAIL_FROM")
    #         or smtp_username
    #     )

    #     from_name = (
    #         os.getenv("SMTP_FROM_NAME")
    #         or os.getenv("MAIL_FROM_NAME")
    #         or "HRMS"
    #     )

    #     starttls_enabled = (
    #         os.getenv("MAIL_STARTTLS", "true").strip().lower()
    #         in ("true", "1", "yes")
    #     )

    #     ssl_enabled = (
    #         os.getenv("MAIL_SSL_TLS", "false").strip().lower()
    #         in ("true", "1", "yes")
    #     )

    #     if not all(
    #         (smtp_host, smtp_username, smtp_password, from_email)
    #     ):
    #         raise ValueError(
    #             "Email is not configured. Check MAIL_SERVER, MAIL_PORT, "
    #             "MAIL_USERNAME, MAIL_PASSWORD, and MAIL_FROM in your .env."
    #         )

    #     if ssl_enabled and starttls_enabled:
    #         raise ValueError(
    #             "Invalid SMTP configuration: enable either MAIL_SSL_TLS "
    #             "or MAIL_STARTTLS, not both."
    #         )

    #     if not ssl_enabled and not starttls_enabled:
    #         raise ValueError(
    #             "SMTP encryption is disabled. Configure MAIL_STARTTLS=true "
    #             "or MAIL_SSL_TLS=true."
    #         )

    #     # Load the existing payslip and employee details.
    #     data = self.get_payslip(payslip_id)

    #     if not data:
    #         raise ValueError("Payslip not found")

    #     recipient = (data.get("email") or "").strip()

    #     if not recipient:
    #         raise ValueError(
    #             "Employee email address is missing; payslip was not sent."
    #         )

    #     # Generate the PDF using the existing implementation.
    #     pdf_bytes = self.generate_pdf(payslip_id)

    #     month_value = data.get("month")

    #     if hasattr(month_value, "strftime"):
    #         month_text = month_value.strftime("%B %Y")
    #     else:
    #         month_text = str(month_value or "Payroll")

    #     employee_name = data.get("employee_name") or "Employee"
    #     net_pay = self.decimal(data.get("net_pay"))

    #     # Preserve the existing email body and attachment.
    #     message = EmailMessage(policy=policy.SMTP)
    #     message["Subject"] = f"Payslip for {month_text}"
    #     message["From"] = formataddr((from_name, from_email))
    #     message["To"] = recipient

    #     message.set_content(
    #         f"Dear {employee_name},\n\n"
    #         f"Please find attached your payslip for {month_text}.\n"
    #         f"Net pay: ₹{net_pay:,.2f}\n\n"
    #         "This is an automatically generated email. Please contact HR "
    #         "if you have any questions.\n"
    #     )

    #     message.add_attachment(
    #         pdf_bytes,
    #         maintype="application",
    #         subtype="pdf",
    #         filename=f"Payslip_{payslip_id}.pdf",
    #     )

    #     # Gmail: port 587 uses STARTTLS; port 465 normally uses SSL.
    #     if ssl_enabled:
    #         with smtplib.SMTP_SSL(
    #             smtp_host,
    #             smtp_port,
    #             timeout=30,
    #         ) as smtp:
    #             smtp.login(smtp_username, smtp_password)
    #             smtp.send_message(message)
    #     else:
    #         with smtplib.SMTP(
    #             smtp_host,
    #             smtp_port,
    #             timeout=30,
    #         ) as smtp:
    #             smtp.ehlo()
    #             smtp.starttls()
    #             smtp.ehlo()
    #             smtp.login(smtp_username, smtp_password)
    #             smtp.send_message(message)

    #     return {
    #         "success": True,
    #         "payslip_id": payslip_id,
    #         "recipient": recipient,
    #     }

    
    def send_email(self, payslip_id: int):
        """Send the generated payslip PDF to the employee's email."""

        import smtplib
        from email.message import EmailMessage
        from email.utils import formataddr
        from email import policy

        # Read SMTP settings through Pydantic configuration.
        smtp_host = (settings.MAIL_SERVER or "").strip()
        smtp_port = settings.MAIL_PORT
        smtp_username = (settings.MAIL_USERNAME or "").strip()
        smtp_password = settings.MAIL_PASSWORD or ""
        from_email = (
            (settings.MAIL_FROM or "").strip()
            or smtp_username
        )
        from_name = settings.MAIL_FROM_NAME or "HRMS"

        starttls_enabled = settings.MAIL_STARTTLS
        ssl_enabled = settings.MAIL_SSL_TLS

        # Validate configuration.
        if not all((
            smtp_host,
            smtp_username,
            smtp_password,
            from_email,
        )):
            raise ValueError(
                "Email is not configured. Check MAIL_SERVER, MAIL_PORT, "
                "MAIL_USERNAME, MAIL_PASSWORD, and MAIL_FROM in your .env."
            )

        if starttls_enabled and ssl_enabled:
            raise ValueError(
                "Invalid SMTP configuration: enable either "
                "MAIL_STARTTLS or MAIL_SSL_TLS, not both."
            )

        if not starttls_enabled and not ssl_enabled:
            raise ValueError(
                "SMTP encryption is disabled. Set MAIL_STARTTLS=true "
                "or MAIL_SSL_TLS=true."
            )

        # Fetch payslip details.
        data = self.get_payslip(payslip_id)

        if not data:
            raise ValueError("Payslip not found")

        recipient = (data.get("email") or "").strip()

        if not recipient:
            raise ValueError(
                "Employee email address is missing; payslip was not sent."
            )

        # Generate the existing payslip PDF.
        pdf_bytes = self.generate_pdf(payslip_id)

        month_value = data.get("month")

        if hasattr(month_value, "strftime"):
            month_text = month_value.strftime("%B %Y")
        else:
            month_text = str(month_value or "Payroll")

        employee_name = data.get("employee_name") or "Employee"
        net_pay = self.decimal(data.get("net_pay"))

        # Construct the email.
        message = EmailMessage(policy=policy.SMTP)
        message["Subject"] = f"Payslip for {month_text}"
        message["From"] = formataddr((from_name, from_email))
        message["To"] = recipient

        message.set_content(
            f"Dear {employee_name},\n\n"
            f"Please find attached your payslip for {month_text}.\n"
            f"Net pay: ₹{net_pay:,.2f}\n\n"
            "This is an automatically generated email. Please contact HR "
            "if you have any questions.\n"
        )

        message.add_attachment(
            pdf_bytes,
            maintype="application",
            subtype="pdf",
            filename=f"Payslip_{payslip_id}.pdf",
        )

        # Send using the configured encryption method.
        if ssl_enabled:
            with smtplib.SMTP_SSL(
                smtp_host,
                smtp_port,
                timeout=30,
            ) as smtp:
                smtp.login(smtp_username, smtp_password)
                smtp.send_message(message)

        else:
            with smtplib.SMTP(
                smtp_host,
                smtp_port,
                timeout=30,
            ) as smtp:
                smtp.ehlo()
                smtp.starttls()
                smtp.ehlo()
                smtp.login(smtp_username, smtp_password)
                smtp.send_message(message)

        return {
            "success": True,
            "payslip_id": payslip_id,
            "recipient": recipient,
        }

    # =========================================================
    # GENERATE MONTHLY PAYSLIPS IN BULK
    # =========================================================

    def generate_monthly_payslips(
        self,
        year: int,
        month: int,
        send_email: bool = True,
    ):
        if month < 1 or month > 12:
            raise ValueError("Month must be between 1 and 12")

        results = []
        for employee in self.get_employees():
            emp_id = int(employee["id"])
            name = employee.get("employee_name") or str(emp_id)

            existing = self.repository.get_existing_payslip(
                emp_id,
                year,
                month,
            )
            if existing:
                results.append({
                    "emp_id": emp_id,
                    "employee_name": name,
                    "status": "skipped",
                    "reason": "Payslip already exists for this month",
                    "payslip_id": existing.get("id"),
                })
                continue

            try:
                generated = self.generate_payslip(
                    emp_id,
                    year,
                    month,
                )
                item = {
                    "emp_id": emp_id,
                    "employee_name": name,
                    "status": "generated",
                    "payslip_id": generated["id"],
                    "net_pay": generated.get("Net_Pay"),
                }

                if send_email:
                    try:
                        item["email"] = self.send_email(generated["id"])
                    except Exception as exc:
                        # Do not discard a successfully generated payslip
                        # just because SMTP delivery failed.
                        item["email_error"] = str(exc)

                results.append(item)

            except Exception as exc:
                results.append({
                    "emp_id": emp_id,
                    "employee_name": name,
                    "status": "failed",
                    "reason": str(exc),
                })

        return {
            "success": all(item["status"] != "failed" for item in results),
            "year": year,
            "month": month,
            "generated": sum(item["status"] == "generated" for item in results),
            "skipped": sum(item["status"] == "skipped" for item in results),
            "failed": sum(item["status"] == "failed" for item in results),
            "email_failed": sum("email_error" in item for item in results),
            "data": results,
        }

    # =========================================================
    # DELETE
    # =========================================================

    def delete_payslip(
        self,
        payslip_id: int
    ):

        existing = (
            self.repository
            .get_payslip(
                payslip_id
            )
        )

        if not existing:

            raise ValueError(
                "Payslip not found"
            )

        self.repository.delete_payslip(
            payslip_id
        )

        return {
            "id": payslip_id
        }

    # =========================================================
    # PAYROLL SETTINGS
    # =========================================================

    def get_payroll_settings(self):

        return (
            self.repository
            .get_payroll_setting()
        )

    # =========================================================
    # UPDATE SETTINGS
    # =========================================================

    def update_payroll_settings(
        self,
        data: dict
    ):

        setting_id = (
            self.repository
            .update_payroll_setting(
                data
            )
        )

        return {
            "id": setting_id
        }