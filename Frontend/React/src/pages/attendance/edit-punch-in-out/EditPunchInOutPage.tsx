
import React, { useMemo, useState } from "react";
import { Edit2, Save, X, Loader2 } from "lucide-react";

import { EditPunchInOutHeader } from "./components/EditPunchInOutHeader/EditPunchInOutHeader";
import { EditPunchInOutFilters } from "./components/EditPunchInOutFilters/EditPunchInOutFilters";
import { EditPunchInOutEmptyState } from "./components/EditPunchInOutEmptyState/EditPunchInOutEmptyState";
import { useEditPunchInOut } from "./hooks/useEditPunchInOut";
import { AttendanceRecord } from "./types/editPunchInOut.types";
import { editPunchInOutService } from "./services/editPunchInOut.service";

import "./EditPunchInOutPage.css";

const ATTENDANCE_STATUSES = [
  "Present",
  "WO",
  "PL",
  "CO",
  "CL",
  "HD-PL",
  "HD-CL",
  "HD-CO",
  "PH",
  "LOP",
  "HD-LOP",
  "LWP",
] as const;

type DisplayAttendanceRecord = AttendanceRecord & {
  isPlaceholder?: boolean;
};

const normalizeStatus = (status: unknown): string => {
  const value = String(status ?? "").trim().toUpperCase();

  const aliases: Record<string, string> = {
    PRESENT: "Present",
    WO: "WO",
    "WEEK OFF": "WO",
    WEEKOFF: "WO",
    PL: "PL",
    "PAID LEAVE": "PL",
    CO: "CO",
    "COMP OFF": "CO",
    "COMP-OFF": "CO",
    CL: "CL",
    "CASUAL LEAVE": "CL",
    "HD-PL": "HD-PL",
    "HALF DAY PL": "HD-PL",
    "HD-CL": "HD-CL",
    "HALF DAY CL": "HD-CL",
    "HD-CO": "HD-CO",
    "HALF DAY CO": "HD-CO",
    PH: "PH",
    "PUBLIC HOLIDAY": "PH",
    LOP: "LOP",
    "LOSS OF PAY": "LOP",
    "HD-LOP": "HD-LOP",
    LWP: "LWP",
    "LEAVE WITHOUT PAY": "LWP",
  };

  return aliases[value] ?? (value || "--");
};

const getStatusClass = (status: string): string => {
  const normalized = normalizeStatus(status).toLowerCase();

  if (normalized === "present") {
    return "present";
  }

  if (normalized === "lop" || normalized === "lwp") {
    return "lop";
  }

  if (normalized.startsWith("hd-")) {
    return "half-day";
  }

  if (["wo", "pl", "co", "cl", "ph"].includes(normalized)) {
    return "leave";
  }

  return "default";
};

const formatDate = (value: string): string => {
  const datePart = String(value ?? "").slice(0, 10);
  const parts = datePart.split("-");

  if (parts.length !== 3) {
    return value;
  }

  const [year, month, day] = parts;

  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// const formatTime = (value?: string | null): string => {
//   if (!value) {
//     return "--";
//   }

//   const match = String(value).match(/^(\d{1,2}):(\d{2})/);

//   if (!match) {
//     return value;
//   }

//   const hours = Number(match[1]);
//   const minutes = match[2];
//   const suffix = hours >= 12 ? "PM" : "AM";
//   const displayHours = hours % 12 || 12;

//   return `${String(displayHours).padStart(2, "0")}:${minutes} ${suffix}`;
// };

const formatTime = (value?: string | null): string => {
  if (!value) {
    return "--";
  }

  const match = String(value).match(/^(\d{1,2}):(\d{2})/);

  if (!match) {
    return "--";
  }

  return `${String(Number(match[1])).padStart(2, "0")}:${match[2]}`;
};
const formatDuration = (
  value: number | string | null | undefined
): string => {
  if (value === null || value === undefined || value === "") {
    return "--";
  }

  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return String(value);
  }

  return `${numberValue.toFixed(2)} hrs`;
};

const formatBreak = (
  value: number | string | null | undefined
): string => {
  if (value === null || value === undefined || value === "") {
    return "00:00:00 Hrs";
  }

  if (typeof value === "string" && value.includes(":")) {
    return `${value} Hrs`;
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "00:00:00 Hrs";
  }

  // Numeric break values are interpreted as minutes.
  const totalSeconds = Math.max(
    0,
    Math.round(numericValue * 60)
  );

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")} Hrs`;
};

/**
 * Converts the selected month into YYYY-MM.
 *
 * Supports common month values such as:
 * 2026-01
 * 2026-01-01
 * January 2026
 * Jan 2026
 *
 * If your month object has a dedicated YYYY-MM value,
 * prefer that value.
 */
const getMonthKey = (selectedMonth: unknown): string => {
  if (!selectedMonth) {
    return "";
  }

  let rawValue = "";

  if (typeof selectedMonth === "string") {
    rawValue = selectedMonth;
  } else if (typeof selectedMonth === "object") {
    const monthObject = selectedMonth as Record<string, unknown>;

    const candidates = [
      monthObject.value,
      monthObject.month,
      monthObject.date,
      monthObject.label,
    ];

    rawValue =
      candidates.find(
        (value) =>
          typeof value === "string" &&
          value.trim().length > 0
      ) as string ?? "";
  }

  const value = rawValue.trim();

  // YYYY-MM or YYYY-MM-DD
  const isoMatch = value.match(/^(\d{4})-(\d{2})(?:-\d{2})?$/);

  if (isoMatch) {
    const month = Number(isoMatch[2]);

    if (month >= 1 && month <= 12) {
      return `${isoMatch[1]}-${isoMatch[2]}`;
    }
  }

  // January 2026, Jan 2026, etc.
  const parsedDate = new Date(value);

  if (!Number.isNaN(parsedDate.getTime())) {
    return `${parsedDate.getFullYear()}-${String(
      parsedDate.getMonth() + 1
    ).padStart(2, "0")}`;
  }

  return "";
};

/**
 * Creates a full calendar month while preserving existing
 * attendance records.
 *
 * Missing dates are display-only placeholders.
 */
const generateMonthlyAttendance = (
  records: AttendanceRecord[],
  monthKey: string
): DisplayAttendanceRecord[] => {
  const match = monthKey.match(/^(\d{4})-(\d{2})$/);

  if (!match) {
    return records;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12
  ) {
    return records;
  }

  const daysInMonth = new Date(year, month, 0).getDate();

  const recordsByDate = new Map<string, AttendanceRecord>();

  records.forEach((record) => {
    const recordDate = String(record.date ?? "").slice(0, 10);

    if (recordDate.startsWith(`${monthKey}-`)) {
      recordsByDate.set(recordDate, record);
    }
  });

  const result: DisplayAttendanceRecord[] = [];

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = `${match[1]}-${match[2]}-${String(day).padStart(
      2,
      "0"
    )}`;

    const existingRecord = recordsByDate.get(date);

    if (existingRecord) {
      result.push(existingRecord);
      continue;
    }

    result.push({
      id: `missing-${date}`,
      date,
      checkIn: null,
      checkOut: null,
      status: "--",
      breakTime: null,
      shiftName: "Not Assigned",
      production: null,
      lateCount: null,
      isPlaceholder: true,
    } as DisplayAttendanceRecord);
  }

  return result;
};

export const EditPunchInOutPage: React.FC = () => {
  const {
    selectedEmployee,
    selectedMonth,
    employeeSearchText,
    monthSearchText,
    isEmployeeDropdownOpen,
    isMonthDropdownOpen,
    isLoading,
    searchPerformed,
    attendanceData,
    setAttendanceData,
    error,
    validationErrors,
    filteredEmployees,
    filteredMonths,
    employeeRef,
    monthRef,
    handleEmployeeSelect,
    handleEmployeeSearch,
    handleEmployeeClear,
    handleEmployeeToggle,
    handleMonthSelect,
    handleMonthSearch,
    handleMonthClear,
    handleMonthToggle,
    handleSearch,
  } = useEditPunchInOut();

  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<AttendanceRecord>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const monthKey = useMemo(
    () => getMonthKey(selectedMonth),
    [selectedMonth]
  );

  const records = useMemo<DisplayAttendanceRecord[]>(() => {
    const data = attendanceData ?? [];

    if (!monthKey) {
      return data;
    }

    return generateMonthlyAttendance(data, monthKey);
  }, [attendanceData, monthKey]);

  const handleEditClick = (record: DisplayAttendanceRecord) => {
    if (record.isPlaceholder) {
      setSaveError(
        "No attendance record exists for this date. You cannot edit a missing record."
      );
      return;
    }

    setEditingRecord(record.id);

    setEditData({
      checkIn: record.checkIn,
     checkOut: record.checkOut,
      
      status: record.status,
      lateMark: record.lateMark,
      breakTime: record.breakTime,
      overtime: record.overtime,
    });

    setSaveError(null);
    setSaveSuccess(null);
  };

  const handleInputChange = (
    field: keyof AttendanceRecord,
    value: string | number | null
  ) => {
    setEditData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
    setEditData({});
    setSaveError(null);
    setSaveSuccess(null);
  };

  const handleSaveEdit = async (recordId: string) => {
    const original = (attendanceData ?? []).find(
      (item) => item.id === recordId
    );

    if (!original || recordId.startsWith("missing-")) {
      setSaveError(
        "Attendance record not found. Missing-date placeholders cannot be saved."
      );
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const updatedRecord =
        await editPunchInOutService.updateAttendance(
          recordId,
          editData,
          original.date
        );

      setAttendanceData((previous) =>
        (previous ?? []).map((item) =>
          item.id === recordId
            ? {
                ...item,
                ...updatedRecord,
              }
            : item
        )
      );

      setEditingRecord(null);
      setEditData({});
      setSaveSuccess("Attendance updated successfully.");
    } catch (err: unknown) {
      setSaveError(
        err instanceof Error
          ? err.message
          : "Failed to update attendance."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="edit-punch-in-out-page">
      <EditPunchInOutHeader />

      <EditPunchInOutFilters
        selectedEmployee={selectedEmployee}
        employeeSearchText={employeeSearchText}
        isEmployeeDropdownOpen={isEmployeeDropdownOpen}
        filteredEmployees={filteredEmployees}
        onEmployeeSelect={handleEmployeeSelect}
        onEmployeeSearch={handleEmployeeSearch}
        onEmployeeClear={handleEmployeeClear}
        onEmployeeToggle={handleEmployeeToggle}
        employeeRef={employeeRef}
        employeeError={validationErrors.employee}
        selectedMonth={selectedMonth}
        monthSearchText={monthSearchText}
        isMonthDropdownOpen={isMonthDropdownOpen}
        filteredMonths={filteredMonths}
        onMonthSelect={handleMonthSelect}
        onMonthSearch={handleMonthSearch}
        onMonthClear={handleMonthClear}
        onMonthToggle={handleMonthToggle}
        monthRef={monthRef}
        monthError={validationErrors.month}
        onSearch={handleSearch}
        isLoading={isLoading}
      />

      {isLoading && (
        <div className="edit-punch-in-out-page__loading">
          <Loader2
            size={22}
            className="edit-punch-in-out-page__spinner"
          />
          Loading attendance records...
        </div>
      )}

      {error && (
        <div className="edit-punch-in-out-page__error">
          {error}
        </div>
      )}

      {!searchPerformed && !isLoading && !error && (
        <EditPunchInOutEmptyState />
      )}

      {searchPerformed && !isLoading && !error && (
        <section className="edit-punch-in-out-page__results">
          <div className="edit-punch-in-out-page__results-header">
            <h2 className="edit-punch-in-out-page__results-title">
              Attendance Records
            </h2>

            <div className="edit-punch-in-out-page__results-summary">
              <span>
                Employee: {selectedEmployee?.name ?? "--"}
              </span>

              <span>
                Month: {selectedMonth?.label ?? "--"}
              </span>
            </div>
          </div>

          {saveError && (
            <div className="edit-punch-in-out-page__error">
              {saveError}
            </div>
          )}

          {saveSuccess && (
            <div className="edit-punch-in-out-page__success">
              {saveSuccess}
            </div>
          )}

          <div className="edit-punch-in-out-page__results-table-wrapper">
            <table className="edit-punch-in-out-page__results-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Shift</th>
                  <th>Punch In</th>
                  <th>Punch Out</th>
                  <th>Production</th>
                  <th>Break</th>
                  <th>Status</th>
                  <th>Late Count</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="edit-punch-in-out-page__no-records"
                    >
                      No attendance records found for the selected employee and month.
                    </td>
                  </tr>
                ) : (
                  records.map((record) => {
                    const isEditing = editingRecord === record.id;
                    const isPlaceholder = Boolean(record.isPlaceholder);
                    const status = normalizeStatus(record.status);

                    return (
                      <tr
                        key={`${record.id}-${record.date}`}
                        className={isEditing ? "editing" : ""}
                      >
                        <td className="attendance-date">
                          {formatDate(record.date)}
                        </td>

                        <td>
                          {record.shiftName || "Not Assigned"}
                        </td>

                        <td>
                          {isEditing ? (
                            <input
                              type="time"
                              className="edit-punch-in-out-page__edit-input"
                              value={String(editData.checkIn ?? "").slice(0, 5)}
                              onChange={(event) =>
                                handleInputChange(
                                  "checkIn",
                                  event.target.value || null
                                )
                              }
                              disabled={isSaving}
                            />
                          ) : (
                            formatTime(record.checkIn)
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <input
                              type="time"
                              className="edit-punch-in-out-page__edit-input"
                              value={String(editData.checkOut ?? "").slice(0, 5)}
                              onChange={(event) =>
                                handleInputChange(
                                  "checkOut",
                                  event.target.value || null
                                )
                              }
                              disabled={isSaving}
                            />
                          ) : (
                            formatTime(record.checkOut)
                          )}
                        </td>

                        <td>
                          {formatDuration(record.production)}
                        </td>

                        <td>
                          {formatBreak(record.breakTime)}
                        </td>

                        <td>
                          {isPlaceholder ? (
                            "--"
                          ) : isEditing ? (
                            <select
                              className="edit-punch-in-out-page__edit-select"
                              value={status}
                              onChange={(event) =>
                                handleInputChange(
                                  "status",
                                  event.target.value
                                )
                              }
                              disabled={isSaving}
                            >
                              {ATTENDANCE_STATUSES.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span
                              className={`edit-punch-in-out-page__status-badge edit-punch-in-out-page__status-badge--${getStatusClass(
                                status
                              )}`}
                            >
                              {status}
                            </span>
                          )}
                        </td>

                        <td>
                          {record.lateCount != null &&
                          Number(record.lateCount) !== 0 ? (
                            <span className="edit-punch-in-out-page__late-count">
                              {record.lateCount}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <div className="edit-punch-in-out-page__actions">
                              <button
                                type="button"
                                className="edit-punch-in-out-page__action-btn edit-punch-in-out-page__action-btn--save"
                                onClick={() => handleSaveEdit(record.id)}
                                disabled={isSaving}
                                title="Save"
                              >
                                {isSaving ? (
                                  <Loader2
                                    size={16}
                                    className="edit-punch-in-out-page__spinner"
                                  />
                                ) : (
                                  <Save size={16} />
                                )}
                              </button>

                              <button
                                type="button"
                                className="edit-punch-in-out-page__action-btn edit-punch-in-out-page__action-btn--cancel"
                                onClick={handleCancelEdit}
                                disabled={isSaving}
                                title="Cancel"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : isPlaceholder ? (
                            <span title="No attendance record for this date">
                              --
                            </span>
                          ) : (
                            <button
                              type="button"
                              className="edit-punch-in-out-page__action-btn edit-punch-in-out-page__action-btn--edit"
                              onClick={() => handleEditClick(record)}
                              title="Edit attendance"
                            >
                              <Edit2 size={16} />
                              <span>Edit</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default EditPunchInOutPage;