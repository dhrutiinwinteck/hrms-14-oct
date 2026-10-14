// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import MonthlyAttendanceHeader from "./components/MonthlyAttendanceHeader/MonthlyAttendanceHeader";
// import MonthlyAttendanceFilters from "./components/MonthlyAttendanceFilters/MonthlyAttendanceFilters";
// import MonthlyAttendanceTable from "./components/MonthlyAttendanceTable/MonthlyAttendanceTable";

// import {
//   useMonthlyAttendance,
// } from "./hooks/useMonthlyAttendance";

// import {
//   MONTH_OPTIONS,
//   YEAR_OPTIONS,
//   MONTH_NUMBER_MAP,
// } from "./constants/monthlyAttendance.constants";

// import "./MonthlyAttendancePage.css";

// const MonthlyAttendancePage: React.FC = () => {
//   const [selectedMonth, setSelectedMonth] =
//     useState<string>("September");

//   const [selectedYear, setSelectedYear] =
//     useState<string>("2026");

//   const [employeeSearch, setEmployeeSearch] =
//     useState<string>("");

//   const [recordsPerPage, setRecordsPerPage] =
//     useState<number>(10);

//   const [isSearching, setIsSearching] =
//     useState<boolean>(false);

//   const {
//     employees,
//     isLoading,
//     isDownloading,
//     error,
//     fetchSalarySheet,
//     downloadSalarySheet,
//   } = useMonthlyAttendance();

//   const selectedMonthNumber =
//     MONTH_NUMBER_MAP[selectedMonth];

//   const selectedYearNumber =
//     Number(selectedYear);

//   const loadSalarySheet = useCallback(
//     async (): Promise<void> => {
//       setIsSearching(true);

//       try {
//         await fetchSalarySheet(
//           selectedMonthNumber,
//           selectedYearNumber,
//         );
//       } finally {
//         setIsSearching(false);
//       }
//     },
//     [
//       fetchSalarySheet,
//       selectedMonthNumber,
//       selectedYearNumber,
//     ],
//   );

//   useEffect(() => {
//     void loadSalarySheet();
//   }, [loadSalarySheet]);

//   const filteredEmployees = useMemo(() => {
//     const normalizedSearch =
//       employeeSearch.trim().toLowerCase();

//     if (!normalizedSearch) {
//       return employees;
//     }

//     return employees.filter((employee) => {
//       return (
//         employee.employeeName
//           .toLowerCase()
//           .includes(normalizedSearch) ||
//         employee.uan
//           .toLowerCase()
//           .includes(normalizedSearch) ||
//         employee.bankName
//           .toLowerCase()
//           .includes(normalizedSearch) ||
//         employee.accountNo
//           .toLowerCase()
//           .includes(normalizedSearch) ||
//         employee.ifsc
//           .toLowerCase()
//           .includes(normalizedSearch)
//       );
//     });
//   }, [
//     employeeSearch,
//     employees,
//   ]);

//   const handleDownloadSalarySheet =
//     useCallback(async (): Promise<void> => {
//       await downloadSalarySheet(
//         selectedMonthNumber,
//         selectedYearNumber,
//       );
//     }, [
//       downloadSalarySheet,
//       selectedMonthNumber,
//       selectedYearNumber,
//     ]);

//   const handleDownloadAttendance =
//     useCallback((): void => {
//       console.info(
//         "Attendance API is not available yet.",
//       );
//     }, []);

//   const handleDownloadSalaryBreakdown =
//     useCallback((): void => {
//       console.info(
//         "Salary breakdown API is not available yet.",
//       );
//     }, []);

//   return (
//     <main className="monthly-attendance-page">
//       <div className="monthly-attendance-page__breadcrumb">
//         <span>Dashboard</span>

//         <span className="monthly-attendance-page__breadcrumb-separator">
//           &gt;
//         </span>

//         <span>Payroll</span>

//         <span className="monthly-attendance-page__breadcrumb-separator">
//           &gt;
//         </span>

//         <strong>Monthly Salary Sheet</strong>
//       </div>

//       <MonthlyAttendanceHeader />

//       <section
//         className="monthly-attendance-content-card"
//         aria-label="Monthly salary sheet controls and records"
//       >
//         <MonthlyAttendanceFilters
//           selectedMonth={selectedMonth}
//           selectedYear={selectedYear}
//           employeeSearch={employeeSearch}
//           recordsPerPage={recordsPerPage}
//           monthOptions={MONTH_OPTIONS}
//           yearOptions={YEAR_OPTIONS}
//           isSearching={isSearching || isLoading}
//           onMonthChange={setSelectedMonth}
//           onYearChange={setSelectedYear}
//           onSearch={loadSalarySheet}
//           onEmployeeSearchChange={setEmployeeSearch}
//           onRecordsPerPageChange={setRecordsPerPage}
//           onDownloadSalarySheet={
//             handleDownloadSalarySheet
//           }
//           onDownloadAttendance={
//             handleDownloadAttendance
//           }
//           onDownloadSalaryBreakdown={
//             handleDownloadSalaryBreakdown
//           }
//         />

//         {error && (
//           <div
//             className="monthly-attendance-error"
//             role="alert"
//           >
//             {error}
//           </div>
//         )}

//         {isDownloading && (
//           <div
//             className="monthly-attendance-loading"
//             role="status"
//           >
//             Preparing salary sheet download...
//           </div>
//         )}

//         <MonthlyAttendanceTable
//           employees={filteredEmployees}
//           recordsPerPage={recordsPerPage}
//         />
//       </section>
//     </main>
//   );
// };

// export default MonthlyAttendancePage;



import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import MonthlyAttendanceHeader from "./components/MonthlyAttendanceHeader/MonthlyAttendanceHeader";
import MonthlyAttendanceFilters from "./components/MonthlyAttendanceFilters/MonthlyAttendanceFilters";
import MonthlyAttendanceTable from "./components/MonthlyAttendanceTable/MonthlyAttendanceTable";

import {
  useMonthlyAttendance,
} from "./hooks/useMonthlyAttendance";

import {
  MONTH_OPTIONS,
  YEAR_OPTIONS,
  MONTH_NUMBER_MAP,
} from "./constants/monthlyAttendance.constants";

import "./MonthlyAttendancePage.css";

/**
 * Convert supported backend date formats into a year/month pair.
 *
 * Supported:
 * YYYY-MM-DD
 * YYYY-MM-DDTHH:mm:ss
 * DD-MM-YYYY
 * DD/MM/YYYY
 *
 * Returns null when the date is missing or invalid.
 */
interface JoiningYearMonth {
  year: number;
  month: number;
}

const getJoiningYearMonth = (
  value: string | null | undefined,
): JoiningYearMonth | null => {
  if (!value) {
    return null;
  }

  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  // ISO date: 2026-05-15 or 2026-05-15T00:00:00
  const isoMatch = normalized.match(
    /^(\d{4})-(\d{1,2})-(\d{1,2})(?:$|T|\s)/,
  );

  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]);
    const day = Number(isoMatch[3]);

    const validDate =
      month >= 1 &&
      month <= 12 &&
      day >= 1 &&
      day <= 31;

    return validDate ? { year, month } : null;
  }

  // Indian-style date: 15-05-2026 or 15/05/2026
  const localMatch = normalized.match(
    /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/,
  );

  if (localMatch) {
    const day = Number(localMatch[1]);
    const month = Number(localMatch[2]);
    const year = Number(localMatch[3]);

    const validDate =
      month >= 1 &&
      month <= 12 &&
      day >= 1 &&
      day <= 31;

    return validDate ? { year, month } : null;
  }

  return null;
};

/**
 * True when the employee's joining month is on or before
 * the selected payroll month.
 */
const joinedBySelectedMonth = (
  joiningDate: string | null | undefined,
  selectedYear: number,
  selectedMonth: number,
): boolean => {
  const joining = getJoiningYearMonth(joiningDate);

  // Do not accidentally hide employees when a date is missing.
  // The mapper/backend must provide joiningDate for accurate filtering.
  if (!joining) {
    return true;
  }

  if (!joining) {
  return false;
}
  if (joining.year < selectedYear) {
    return true;
  }

  if (joining.year > selectedYear) {
    return false;
  }

  return joining.month <= selectedMonth;
};

const MonthlyAttendancePage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] =
    useState<string>("");

  const [selectedYear, setSelectedYear] =
    useState<string>("");

  const [employeeSearch, setEmployeeSearch] =
    useState<string>("");

  const [recordsPerPage, setRecordsPerPage] =
    useState<number>(10);

  const [isSearching, setIsSearching] =
    useState<boolean>(false);

  const {
    employees,
    isLoading,
    isDownloading,
    error,
    fetchSalarySheet,
    downloadSalarySheet,
  } = useMonthlyAttendance();

  const selectedMonthNumber =
    MONTH_NUMBER_MAP[selectedMonth];

  const selectedYearNumber =
    Number(selectedYear);

  /**
   * Load the salary sheet for the selected month and year.
   * The hook should map API records into MonthlyAttendanceEmployee,
   * including joiningDate.
   */
  const loadSalarySheet = useCallback(
    async (): Promise<void> => {
      setIsSearching(true);

      try {
        await fetchSalarySheet(
          selectedMonthNumber,
          selectedYearNumber,
        );
      } finally {
        setIsSearching(false);
      }
    },
    [
      fetchSalarySheet,
      selectedMonthNumber,
      selectedYearNumber,
    ],
  );

  useEffect(() => {
    void loadSalarySheet();
  }, [loadSalarySheet]);

  /**
   * Filter the API data using:
   * 1. Employee joining date versus selected payroll month.
   * 2. Employee search text.
   *
   * An employee who joined after the selected month is excluded.
   */
  // const filteredEmployees = useMemo(() => {
  //   const normalizedSearch =
  //     employeeSearch.trim().toLowerCase();

  //   return employees.filter((employee) => {
  //     // Read joiningDate from the mapped API employee.
  //     const employeeWithJoiningDate = employee as typeof employee & {
  //       joiningDate?: string | null;
  //     };

  //     const joiningDate =
  //       employeeWithJoiningDate.joiningDate;

  //     const isEligibleForMonth =
  //       joinedBySelectedMonth(
  //         joiningDate,
  //         selectedYearNumber,
  //         selectedMonthNumber,
  //       );

  //     if (!isEligibleForMonth) {
  //       return false;
  //     }

  //     if (!normalizedSearch) {
  //       return true;
  //     }

  //     return (
  //       employee.employeeName
  //         .toLowerCase()
  //         .includes(normalizedSearch) ||
  //       employee.uan
  //         .toLowerCase()
  //         .includes(normalizedSearch) ||
  //       employee.bankName
  //         .toLowerCase()
  //         .includes(normalizedSearch) ||
  //       employee.accountNo
  //         .toLowerCase()
  //         .includes(normalizedSearch) ||
  //       employee.ifsc
  //         .toLowerCase()
  //         .includes(normalizedSearch)
  //     );
  //   });
  // }, [
  //   employees,
  //   employeeSearch,
  //   selectedYearNumber,
  //   selectedMonthNumber,
  // ]);

  
const filteredEmployees = useMemo(() => {
  const normalizedSearch = employeeSearch.trim().toLowerCase();

  const selectedPeriod =
    selectedYearNumber * 12 + selectedMonthNumber;

  return employees.filter((employee) => {
    const joiningDate = employee.joiningDate;

    // A joining date is required for accurate historical filtering.
    if (!joiningDate) {
      return false;
    }

    const normalizedDate = joiningDate.trim();

    // Supports YYYY-MM-DD and ISO datetime strings.
    const isoMatch = normalizedDate.match(
      /^(\d{4})-(\d{1,2})-(\d{1,2})(?:$|T|\s)/
    );

    // Supports DD-MM-YYYY and DD/MM/YYYY.
    const localMatch = normalizedDate.match(
      /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/
    );

    let joiningYear = 0;
    let joiningMonth = 0;

    if (isoMatch) {
      joiningYear = Number(isoMatch[1]);
      joiningMonth = Number(isoMatch[2]);
    } else if (localMatch) {
      joiningMonth = Number(localMatch[2]);
      joiningYear = Number(localMatch[3]);
    } else {
      console.warn(
        "Unrecognized employee joining date:",
        employee.employeeName,
        joiningDate
      );
      return false;
    }

    if (
      joiningMonth < 1 ||
      joiningMonth > 12 ||
      joiningYear < 1900
    ) {
      return false;
    }

    const joiningPeriod = joiningYear * 12 + joiningMonth;

    // Do not show an employee before their joining month.
    if (joiningPeriod > selectedPeriod) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    return (
      employee.employeeName.toLowerCase().includes(normalizedSearch) ||
      employee.uan.toLowerCase().includes(normalizedSearch) ||
      employee.bankName.toLowerCase().includes(normalizedSearch) ||
      employee.accountNo.toLowerCase().includes(normalizedSearch) ||
      employee.ifsc.toLowerCase().includes(normalizedSearch)
    );
  });
}, [
  employees,
  employeeSearch,
  selectedYearNumber,
  selectedMonthNumber,
]);

  const handleDownloadSalarySheet =
    useCallback(async (): Promise<void> => {
      await downloadSalarySheet(
        selectedMonthNumber,
        selectedYearNumber,
      );
    }, [
      downloadSalarySheet,
      selectedMonthNumber,
      selectedYearNumber,
    ]);

  const handleDownloadAttendance =
    useCallback((): void => {
      console.info(
        "Attendance API is not available yet.",
      );
    }, []);

  const handleDownloadSalaryBreakdown =
    useCallback((): void => {
      console.info(
        "Salary breakdown API is not available yet.",
      );
    }, []);

  return (
    <main className="monthly-attendance-page">
      <div className="monthly-attendance-page__breadcrumb">
        <span>Dashboard</span>

        <span className="monthly-attendance-page__breadcrumb-separator">
          &gt;
        </span>

        <span>Payroll</span>

        <span className="monthly-attendance-page__breadcrumb-separator">
          &gt;
        </span>

        <strong>Monthly Salary Sheet</strong>
      </div>

      <MonthlyAttendanceHeader />

      <section
        className="monthly-attendance-content-card"
        aria-label="Monthly salary sheet controls and records"
      >
        <MonthlyAttendanceFilters
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          employeeSearch={employeeSearch}
          recordsPerPage={recordsPerPage}
          monthOptions={MONTH_OPTIONS}
          yearOptions={YEAR_OPTIONS}
          isSearching={isSearching || isLoading}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
          onSearch={loadSalarySheet}
          onEmployeeSearchChange={setEmployeeSearch}
          onRecordsPerPageChange={setRecordsPerPage}
          onDownloadSalarySheet={
            handleDownloadSalarySheet
          }
          onDownloadAttendance={
            handleDownloadAttendance
          }
          onDownloadSalaryBreakdown={
            handleDownloadSalaryBreakdown
          }
        />

        {error && (
          <div
            className="monthly-attendance-error"
            role="alert"
          >
            {error}
          </div>
        )}

        {isDownloading && (
          <div
            className="monthly-attendance-loading"
            role="status"
          >
            Preparing salary sheet download...
          </div>
        )}

        <MonthlyAttendanceTable
          employees={filteredEmployees}
          recordsPerPage={recordsPerPage}
        />
      </section>
    </main>
  );
};

export default MonthlyAttendancePage;
