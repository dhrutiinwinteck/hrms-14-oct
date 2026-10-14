export interface MonthlyAttendanceEmployee {
  employeeId: number;
  employeeName: string;
  uan: string;
  esic: string;
  bankName: string;
  accountNo: string;
  ifsc: string;
  netSalary: number;
  joiningDate: string | null;
}

export interface MonthlySalaryApiRecord {
  employee_id: number;
  employee_name: string | null;
  uan: string | null;
  esic: string | null;
  bank_name: string | null;
  account_no: string | null;
  ifsc: string | null;
  net_salary: number | string | null;
  joining_date?: string | null;
  date_of_joining?: string | null;
  doj?: string | null;
  joiningDate?: string | null;
}

export interface MonthlySalaryApiResponse {
  month: number;
  year: number;
  total_records: number;
  data: MonthlySalaryApiRecord[];
}