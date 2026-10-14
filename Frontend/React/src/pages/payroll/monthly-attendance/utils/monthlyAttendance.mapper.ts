// // import {
// //   MonthlyAttendanceEmployee,
// //   MonthlySalaryApiRecord,
// // } from "../types/monthlyAttendance.types";

// // const safeText = (value: string | null | undefined): string => {
// //   return value?.trim() || "-";
// // };

// // const safeNumber = (
// //   value: number | string | null | undefined,
// // ): number => {
// //   const parsedValue = Number(value ?? 0);

// //   return Number.isFinite(parsedValue) ? parsedValue : 0;
// // };

// // // export const mapMonthlySalaryRecord = (
// // //   record: MonthlySalaryApiRecord,
// // // ): MonthlyAttendanceEmployee => {
// // //   return {
// // //     employeeId: record.employee_id,
// // //     employeeName: safeText(record.employee_name),
// // //     uan: safeText(record.uan),
// // //     esic: safeText(record.esic),
// // //     bankName: safeText(record.bank_name),
// // //     accountNo: safeText(record.account_no),
// // //     ifsc: safeText(record.ifsc),
// // //     netSalary: safeNumber(record.net_salary),
// // //   };
// // // };

// // export const mapMonthlySalaryRecord = (
// //   record: MonthlySalaryApiRecord,
// // ): MonthlyAttendanceEmployee => {
// //   return {
// //     employeeId: record.employee_id,
// //     employeeName: safeText(record.employee_name),
// //     uan: safeText(record.uan),
// //     esic: safeText(record.esic),
// //     bankName: safeText(record.bank_name),
// //     accountNo: safeText(record.account_no),
// //     ifsc: safeText(record.ifsc),
// //     netSalary: safeNumber(record.net_salary),

// //     joiningDate:
// //       record.joining_date ??
// //       record.date_of_joining ??
// //       record.doj ??
// //       record.joiningDate ??
// //       null,
// //   };
// // };







// import {
//   MonthlyAttendanceEmployee,
//   MonthlySalaryApiRecord,
// } from "../types/monthlyAttendance.types";

// const safeText = (
//   value: string | null | undefined,
// ): string => {
//   return value?.trim() || "-";
// };

// const safeNumber = (
//   value: number | string | null | undefined,
// ): number => {
//   const parsedValue = Number(value ?? 0);
//   return Number.isFinite(parsedValue) ? parsedValue : 0;
// };

// export const mapMonthlySalaryRecord = (
//   record: MonthlySalaryApiRecord,
// ): MonthlyAttendanceEmployee => {
//   // Support common backend naming conventions.
//   const rawRecord = record as MonthlySalaryApiRecord &
//     Record<string, unknown>;

//   const rawJoiningDate =
//     rawRecord.joining_date ??
//     rawRecord.date_of_joining ??
//     rawRecord.doj ??
//     rawRecord.joiningDate ??
//     rawRecord.dateOfJoining ??
//     rawRecord.Date_Of_Joining ??
//     rawRecord.DateOfJoining ??
//     rawRecord.DOJ;

//   const joiningDate =
//     typeof rawJoiningDate === "string"
//       ? rawJoiningDate.trim() || null
//       : rawJoiningDate instanceof Date
//         ? rawJoiningDate.toISOString()
//         : null;

//   return {
//     employeeId: record.employee_id,
//     employeeName: safeText(record.employee_name),
//     uan: safeText(record.uan),
//     esic: safeText(record.esic),
//     bankName: safeText(record.bank_name),
//     accountNo: safeText(record.account_no),
//     ifsc: safeText(record.ifsc),
//     netSalary: safeNumber(record.net_salary),
//     joiningDate,
//   };
// };





import {
  MonthlyAttendanceEmployee,
  MonthlySalaryApiRecord,
} from "../types/monthlyAttendance.types";

const safeText = (
  value: string | null | undefined,
): string => value?.trim() || "-";

const safeNumber = (
  value: number | string | null | undefined,
): number => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getJoiningDate = (
  record: MonthlySalaryApiRecord,
): string | null => {
  const raw = record as unknown as Record<string, unknown>;

  // Normalize keys so joining_date, JoiningDate and
  // date_of_joining can be compared consistently.
  const entries = Object.entries(raw);

  const candidates = [
    "joiningdate",
    "dateofjoining",
    "doj",
    "dateofjoin",
  ];

  for (const candidate of candidates) {
    const match = entries.find(([key]) => {
      const normalizedKey = key
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();

      return normalizedKey === candidate;
    });

    if (match?.[1] instanceof Date) {
      return match[1].toISOString();
    }

    if (typeof match?.[1] === "string" && match[1].trim()) {
      return match[1].trim();
    }
  }

  return null;
};

export const mapMonthlySalaryRecord = (
  record: MonthlySalaryApiRecord,
): MonthlyAttendanceEmployee => {
  return {
    employeeId: record.employee_id,
    employeeName: safeText(record.employee_name),
    uan: safeText(record.uan),
    esic: safeText(record.esic),
    bankName: safeText(record.bank_name),
    accountNo: safeText(record.account_no),
    ifsc: safeText(record.ifsc),
    netSalary: safeNumber(record.net_salary),
    joiningDate: getJoiningDate(record),
  };
};
