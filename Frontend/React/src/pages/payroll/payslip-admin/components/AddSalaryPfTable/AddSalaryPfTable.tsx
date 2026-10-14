
// // import React from 'react';
// // import {
// //   CalendarDays,
// //   ChevronDown,
// //   FileSpreadsheet,
// //   Save,
// //   Send,
// //   UserRound,
// //   X,
// // } from 'lucide-react';

// // import type {
// //   AddSalaryPfFormData,
// // } from '../AddSalaryPfModal/AddSalaryPfModal';

// // import './AddSalaryPfTable.css';

// // export interface SalaryPfEmployeeOption {
// //   id: string;
// //   name: string;
// //   employeeId: string;
// // }

// // interface AddSalaryPfTableProps {
// //   form: AddSalaryPfFormData;
// //   employees: SalaryPfEmployeeOption[];
// //   isLoadingEmployees: boolean;
// //   isCheckingSalary: boolean;
// //   errorMessage: string;
// //   checkMessage: string;
// //   onFieldChange: <K extends keyof AddSalaryPfFormData>(
// //     field: K,
// //     value: AddSalaryPfFormData[K],
// //   ) => void;
// //   onCancel: () => void;
// //   onSave: () => void;
// // }

// // type NumericField =
// //   | 'availedLeave'
// //   | 'balanceLeave'
// //   | 'daysPaid'
// //   | 'lopAbsent'
// //   | 'basic'
// //   | 'hra'
// //   | 'cityCompensatoryAllowance'
// //   | 'specialAllowance'
// //   | 'otherEarning'
// //   | 'nightAllowance'
// //   | 'providentFundEmployee'
// //   | 'providentFundEmployer'
// //   | 'esic'
// //   | 'professionalTax'
// //   | 'otherDeduction';

// // interface NumericColumn {
// //   label: string;
// //   field: NumericField;
// //   editable: boolean;
// //   group: 'leave' | 'earning' | 'deduction' | 'summary';
// //   currency?: boolean;
// // }

// // const columns: NumericColumn[] = [
// //   { label: 'Availed Leave', field: 'availedLeave', editable: true, group: 'leave' },
// //   { label: 'Balance Leave', field: 'balanceLeave', editable: true, group: 'leave' },
// //   { label: 'Days Paid', field: 'daysPaid', editable: true, group: 'leave' },
// //   { label: 'LOP / Absent', field: 'lopAbsent', editable: true, group: 'leave' },
// //   { label: 'Basic', field: 'basic', editable: true, group: 'earning', currency: true },
// //   { label: 'HRA', field: 'hra', editable: true, group: 'earning', currency: true },
// //   { label: 'CCA', field: 'cityCompensatoryAllowance', editable: true, group: 'earning', currency: true },
// //   { label: 'Special', field: 'specialAllowance', editable: true, group: 'earning', currency: true },
// //   { label: 'Other', field: 'otherEarning', editable: true, group: 'earning', currency: true },
// //   { label: 'Night', field: 'nightAllowance', editable: true, group: 'earning', currency: true },
// //   { label: 'PF (Emp.)', field: 'providentFundEmployee', editable: true, group: 'deduction', currency: true },
// //   { label: 'PF (Er.)', field: 'providentFundEmployer', editable: true, group: 'deduction', currency: true },
// //   { label: 'ESIC', field: 'esic', editable: true, group: 'deduction', currency: true },
// //   { label: 'Prof. Tax', field: 'professionalTax', editable: true, group: 'deduction', currency: true },
// //   { label: 'Other', field: 'otherDeduction', editable: true, group: 'deduction', currency: true },
// // ];

// // const money = (value: number): string =>
// //   `₹${value.toLocaleString('en-IN', {
// //     maximumFractionDigits: 2,
// //   })}`;

// // const parseNumber = (value: string): number => {
// //   if (value.trim() === '') return 0;

// //   const parsed = Number(value);
// //   return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
// // };

// // export const AddSalaryPfTable: React.FC<AddSalaryPfTableProps> = ({
// //   form,
// //   employees,
// //   isLoadingEmployees,
// //   isCheckingSalary,
// //   errorMessage,
// //   checkMessage,
// //   onFieldChange,
// //   onCancel,
// //   onSave,
// // }) => {
// //   const selectedEmployee = employees.find(
// //     (employee) => employee.id === form.employee,
// //   );

// //   const totalEarnings =
// //     form.basic +
// //     form.hra +
// //     form.cityCompensatoryAllowance +
// //     form.specialAllowance +
// //     form.otherEarning +
// //     form.nightAllowance;

// //   const totalDeduction =
// //     form.providentFundEmployee +
// //     form.providentFundEmployer +
// //     form.esic +
// //     form.professionalTax +
// //     form.otherDeduction;

// //   const netPayable = totalEarnings - totalDeduction;

// //   const canSave =
// //     Boolean(form.employee) &&
// //     Boolean(form.month) &&
// //     !isLoadingEmployees &&
// //     !isCheckingSalary &&
// //     !errorMessage;

// //   const renderCell = (column: NumericColumn) => {
// //     const value = form[column.field];

// //     return (
// //       <td key={column.field}>
// //         <label className="add-salary-pf-table__cell">
// //           <span className="add-salary-pf-table__sr-only">
// //             {column.label}
// //           </span>

// //           {column.currency && (
// //             <span className="add-salary-pf-table__currency">
// //               ₹
// //             </span>
// //           )}

// //           <input
// //             type="text"
// //             inputMode="decimal"
// //             autoComplete="off"
// //             spellCheck={false}
// //             value={String(value)}
// //             onChange={(event) => {
// //               const rawValue = event.target.value;

// //               if (rawValue === '' || /^\d*\.?\d*$/.test(rawValue)) {
// //                 onFieldChange(
// //                   column.field,
// //                   parseNumber(rawValue),
// //                 );
// //               }
// //             }}
// //             aria-label={column.label}
// //             title={`${column.label}: ${value}`}
// //           />
// //         </label>
// //       </td>
// //     );
// //   };

// //   return (
// //     <form
// //       className="add-salary-pf-table"
// //       onSubmit={(event) => {
// //         event.preventDefault();
// //         if (canSave) onSave();
// //       }}
// //     >
// //       <section className="add-salary-pf-table__toolbar">
// //         <div className="add-salary-pf-table__filters">
// //           <label className="add-salary-pf-table__filter">
// //             <span className="add-salary-pf-table__filter-icon">
// //               <CalendarDays size={19} />
// //             </span>
// //             <span className="add-salary-pf-table__filter-content">
// //               <span className="add-salary-pf-table__filter-label">
// //                 Month <b>*</b>
// //               </span>
// //               <input
// //                 type="month"
// //                 value={form.month}
// //                 required
// //                 onChange={(event) =>
// //                   onFieldChange('month', event.target.value)
// //                 }
// //               />
// //             </span>
// //           </label>

// //           <label className="add-salary-pf-table__filter">
// //             <span className="add-salary-pf-table__filter-icon">
// //               <UserRound size={19} />
// //             </span>
// //             <span className="add-salary-pf-table__filter-content">
// //               <span className="add-salary-pf-table__filter-label">
// //                 Employee <b>*</b>
// //               </span>
// //               <span className="add-salary-pf-table__select-wrap">
// //                 <select
// //                   value={form.employee}
// //                   required
// //                   disabled={isLoadingEmployees}
// //                   onChange={(event) =>
// //                     onFieldChange('employee', event.target.value)
// //                   }
// //                 >
// //                   <option value="">
// //                     {isLoadingEmployees
// //                       ? 'Loading employees...'
// //                       : 'Select employee'}
// //                   </option>
// //                   {employees.map((employee) => (
// //                     <option key={employee.id} value={employee.id}>
// //                       {employee.name} ({employee.employeeId})
// //                     </option>
// //                   ))}
// //                 </select>
// //                 <ChevronDown size={15} />
// //               </span>
// //             </span>
// //           </label>
// //         </div>

// //         <div className="add-salary-pf-table__legend">
// //           <span><i className="add-salary-pf-table__dot add-salary-pf-table__dot--auto" /> Auto calculated</span>
// //           <span><i className="add-salary-pf-table__dot add-salary-pf-table__dot--edit" /> Editable</span>
// //         </div>
// //       </section>

// //       {(errorMessage || checkMessage || isCheckingSalary) && (
// //         <div
// //           className={`add-salary-pf-table__message ${
// //             errorMessage ? 'add-salary-pf-table__message--error' : ''
// //           }`}
// //           role={errorMessage ? 'alert' : 'status'}
// //         >
// //           {errorMessage ||
// //             (isCheckingSalary ? 'Loading salary calculation...' : checkMessage)}
// //         </div>
// //       )}

// //       <section className="add-salary-pf-table__employee-summary">
// //         <div className="add-salary-pf-table__avatar">
// //           {selectedEmployee?.name
// //             .split(/\s+/)
// //             .filter(Boolean)
// //             .slice(0, 2)
// //             .map((part) => part.charAt(0).toUpperCase())
// //             .join('') || '—'}
// //         </div>
// //         <div>
// //           <strong>{selectedEmployee?.name || 'No employee selected'}</strong>
// //           <span>
// //             Employee ID: {selectedEmployee?.employeeId || '—'}
// //           </span>
// //         </div>
// //         <span className="add-salary-pf-table__month-badge">
// //           {form.month || 'Select month'}
// //         </span>
// //       </section>

// //       <div className="add-salary-pf-table__scroll">
// //         <table>
// //           <thead>
// //             <tr className="add-salary-pf-table__groups">
// //               <th rowSpan={2} className="add-salary-pf-table__number-head">#</th>
// //               <th rowSpan={2} className="add-salary-pf-table__employee-head">
// //                 Employee
// //               </th>
// //               <th colSpan={4} className="add-salary-pf-table__group--leave">
// //                 Leave Information
// //               </th>
// //               <th colSpan={6} className="add-salary-pf-table__group--earning">
// //                 Salary Additions (₹)
// //               </th>
// //               <th colSpan={5} className="add-salary-pf-table__group--deduction">
// //                 Deductions (₹)
// //               </th>
// //               <th colSpan={3} className="add-salary-pf-table__group--summary">
// //                 Summary (₹)
// //               </th>
// //             </tr>
// //             <tr className="add-salary-pf-table__columns">
// //               {columns.map((column) => (
// //                 <th key={column.field}>{column.label}</th>
// //               ))}
// //               <th>Total Earnings</th>
// //               <th>Total Deduction</th>
// //               <th>Net Payable</th>
// //             </tr>
// //           </thead>

// //           <tbody>
// //             <tr>
// //               <td className="add-salary-pf-table__number-cell">1</td>
// //               <td className="add-salary-pf-table__employee-cell">
// //                 <strong>{selectedEmployee?.name || '—'}</strong>
// //                 <span>{selectedEmployee?.employeeId || 'Select employee above'}</span>
// //               </td>

// //               {columns.map(renderCell)}

// //               <td className="add-salary-pf-table__total">
// //                 {money(totalEarnings)}
// //               </td>
// //               <td className="add-salary-pf-table__total">
// //                 {money(totalDeduction)}
// //               </td>
// //               <td className="add-salary-pf-table__net">
// //                 {money(netPayable)}
// //               </td>
// //             </tr>
// //           </tbody>
// //         </table>
// //       </div>

// //       <div className="add-salary-pf-table__footer-info">
// //         <span>1 employee · {form.month || 'Month not selected'}</span>
// //         <span>Values are editable unless marked auto calculated.</span>
// //       </div>

// //       <footer className="add-salary-pf-table__actions">
// //         <button
// //           type="button"
// //           className="add-salary-pf-table__button add-salary-pf-table__button--cancel"
// //           onClick={onCancel}
// //         >
// //           <X size={17} />
// //           Cancel
// //         </button>

// //         <div className="add-salary-pf-table__primary-actions">
// //           <button
// //             type="submit"
// //             className="add-salary-pf-table__button add-salary-pf-table__button--save"
// //             disabled={!canSave}
// //           >
// //             <Save size={16} />
// //             Save
// //           </button>

// //           <button
// //             type="submit"
// //             className="add-salary-pf-table__button add-salary-pf-table__button--send"
// //             disabled={!canSave}
// //           >
// //             <Send size={16} />
// //             Save &amp; Send
// //           </button>
// //         </div>
// //       </footer>

// //       <div className="add-salary-pf-table__export-note">
// //         <FileSpreadsheet size={14} />
// //         Excel export should use the latest persisted salary data.
// //       </div>
// //     </form>
// //   );
// // };

// // export default AddSalaryPfTable;





// import React from 'react';
// import {
//   CalendarDays, Download, Eye, Pencil, Save, Search, Send, X,
// } from 'lucide-react';
// import './AddSalaryPfTable.css';

// export interface SalaryPfEmployeeOption {
//   id: string;
//   name: string;
//   employeeId: string;
// }
// export interface SalaryPfRow extends SalaryPfEmployeeOption {
//   availedLeave: number; balanceLeave: number; salary: number; daysPaid: number; lopAbsent: number;
//   basic: number; hra: number; cityCompensatoryAllowance: number; specialAllowance: number;
//   otherEarning: number; nightAllowance: number; providentFundEmployee: number;
//   providentFundEmployer: number; esic: number; professionalTax: number; otherDeduction: number;
//   status: 'loading' | 'ready' | 'generated' | 'error'; message: string;
// }
// type NumericField = Exclude<keyof SalaryPfRow, 'id' | 'name' | 'employeeId' | 'status' | 'message'>;
// interface Column { label: string; field: NumericField; group: 'leave' | 'earning' | 'deduction'; money?: boolean; }
// // const columns: Column[] = [
// //   { label: 'Availed Leave', field: 'availedLeave', group: 'leave' },
// //   { label: 'Balance Leave', field: 'balanceLeave', group: 'leave' },
// //   { label: 'Days Paid', field: 'daysPaid', group: 'leave' },
// //   { label: 'LOP / Absent', field: 'lopAbsent', group: 'leave' },
// //   { label: 'Basic', field: 'basic', group: 'earning', money: true },
// //   { label: 'HRA', field: 'hra', group: 'earning', money: true },
// //   { label: 'CCA', field: 'cityCompensatoryAllowance', group: 'earning', money: true },
// //   { label: 'Special', field: 'specialAllowance', group: 'earning', money: true },
// //   { label: 'Other', field: 'otherEarning', group: 'earning', money: true },
// //   { label: 'Night', field: 'nightAllowance', group: 'earning', money: true },
// //   { label: 'PF (Emp.)', field: 'providentFundEmployee', group: 'deduction', money: true },
// //   { label: 'PF (Er.)', field: 'providentFundEmployer', group: 'deduction', money: true },
// //   { label: 'ESIC', field: 'esic', group: 'deduction', money: true },
// //   { label: 'Prof. Tax', field: 'professionalTax', group: 'deduction', money: true },
// //   { label: 'Other', field: 'otherDeduction', group: 'deduction', money: true },
// // ];
// const columns: Column[] = [
//   { label: 'Availed Leave', field: 'availedLeave', group: 'leave' },
//   { label: 'Balance Leave', field: 'balanceLeave', group: 'leave' },
//   { label: 'Salary (₹)', field: 'salary', group: 'leave', money: true },
//   { label: 'Days Paid', field: 'daysPaid', group: 'leave' },
//   { label: 'LOP / Absent', field: 'lopAbsent', group: 'leave' },

//   { label: 'Basic', field: 'basic', group: 'earning', money: true },
//   { label: 'HRA', field: 'hra', group: 'earning', money: true },
//   { label: 'CCA', field: 'cityCompensatoryAllowance', group: 'earning', money: true },
//   { label: 'Special', field: 'specialAllowance', group: 'earning', money: true },
//   { label: 'Other', field: 'otherEarning', group: 'earning', money: true },
//   { label: 'Night', field: 'nightAllowance', group: 'earning', money: true },

//   { label: 'PF (Emp.)', field: 'providentFundEmployee', group: 'deduction', money: true },
//   { label: 'PF (Er.)', field: 'providentFundEmployer', group: 'deduction', money: true },
//   { label: 'ESIC', field: 'esic', group: 'deduction', money: true },
//   { label: 'Prof. Tax', field: 'professionalTax', group: 'deduction', money: true },
//   { label: 'Other', field: 'otherDeduction', group: 'deduction', money: true },
// ];

// const money = (n: number) => `₹ ${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
// const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
// const earnings = (r: SalaryPfRow) => r.basic + r.hra + r.cityCompensatoryAllowance + r.specialAllowance + r.otherEarning + r.nightAllowance;
// const deductions = (r: SalaryPfRow) => r.providentFundEmployee + r.providentFundEmployer + r.esic + r.professionalTax + r.otherDeduction;

// interface Props {
//   rows: SalaryPfRow[]; totalRows: number; month: string; onMonthChange: (value: string) => void;
//   search: string; onSearchChange: (value: string) => void; pageSize: number; onPageSizeChange: (value: number) => void;
//   page: number; totalPages: number; onPageChange: (value: number) => void; selectedIds: string[];
//   onToggleRow: (id: string, checked: boolean) => void; onToggleAll: (checked: boolean) => void;
//   isLoading: boolean; isCheckingSalary: boolean; isSaving: boolean; errorMessage: string; checkMessage: string;
//   bulkEdit: boolean; onBulkEdit: () => void; onFieldChange: (id: string, field: keyof SalaryPfRow, value: number) => void;
//   onExport: () => void; onCancel: () => void; onSave: () => void;
// }
// export const AddSalaryPfTable: React.FC<Props> = ({
//   rows, totalRows, month, onMonthChange, search, onSearchChange, pageSize, onPageSizeChange,
//   page, totalPages, onPageChange, selectedIds, onToggleRow, onToggleAll, isLoading,
//   isCheckingSalary, isSaving, errorMessage, checkMessage, bulkEdit, onBulkEdit, onFieldChange,
//   onExport, onCancel, onSave,
// }) => {
//   const allChecked = rows.length > 0 && rows.every((row) => selectedIds.includes(row.id));
//   return (
//     <section className="salary-entry">
//       <div className="salary-entry__toolbar">
//         <label className="salary-entry__month">
//           <CalendarDays size={20} />
//           <span><small>Month <b>*</b></small><input type="month" value={month} onChange={(e) => onMonthChange(e.target.value)} /></span>
//         </label>
//         <label className="salary-entry__search"><Search size={17} /><input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search by employee name or ID..." /></label>
//         <button type="button" className="salary-entry__outline-button" onClick={onExport}><Download size={16} /> Export to Excel</button>
//       </div>

//       {(errorMessage || checkMessage || isLoading || isCheckingSalary) && (
//         <div className={`salary-entry__message ${errorMessage ? 'is-error' : ''}`} role={errorMessage ? 'alert' : 'status'}>
//           {errorMessage || (isLoading ? 'Loading employees...' : isCheckingSalary ? 'Loading salary details for employees...' : checkMessage)}
//         </div>
//       )}

//       <div className="salary-entry__table-card">
//         <div className="salary-entry__table-tools">
//           <label>Show <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}><option value={10}>10</option><option value={25}>25</option><option value={50}>50</option><option value={100}>100</option></select> entries</label>
//           <div className="salary-entry__legend"><span><i className="auto" /> Auto calculated</span><span><i className="editable" /> Editable</span>
//             <button type="button" className={bulkEdit ? 'is-active' : ''} onClick={onBulkEdit}><Pencil size={14} /> {bulkEdit ? 'Bulk Edit On' : 'Bulk Edit'}</button>
//           </div>
//         </div>
//         <div className="salary-entry__scroll">
//           <table>
//             <thead>
//               <tr className="salary-entry__groups">
//                 {/* <th rowSpan={2} className="salary-entry__check-head"><input type="checkbox" checked={allChecked} onChange={(e) => onToggleAll(e.target.checked)} aria-label="Select all visible employees" /></th> */}
//                 <th rowSpan={2}>#</th><th rowSpan={2} className="salary-entry__employee-head">Employee<br /><small>ID | Name</small></th>
//                 <th colSpan={4} className="group-leave">Leave Information</th>
//                 <th colSpan={6} className="group-earning">Salary Additions (₹)</th>
//                 <th colSpan={5} className="group-deduction">Deductions (₹)</th>
//                 <th colSpan={3} className="group-summary">Summary (₹)</th><th rowSpan={2}>Status</th>
//               </tr>
//               <tr className="salary-entry__columns">{columns.map((c) => <th key={c.field}>{c.label}</th>)}<th>Total Earnings</th><th>Total Deduction</th><th>Net Payable</th></tr>
//             </thead>
//             <tbody>
//               {rows.map((row, index) => {
//                 const totalEarning = earnings(row); const totalDeduction = deductions(row);
//                 return <tr key={row.id}>
//                   {/* <td className="salary-entry__check"><input type="checkbox" checked={selectedIds.includes(row.id)} onChange={(e) => onToggleRow(row.id, e.target.checked)} aria-label={`Select ${row.name}`} /></td> */}
//                   <td className="salary-entry__serial">{(page - 1) * pageSize + index + 1}</td>
//                   <td className="salary-entry__employee"><span><strong>{row.name}</strong><small>{row.employeeId}</small></span></td>
//                   {columns.map((column) => <td key={column.field}>
//                     <input
//                    className={`salary-entry__cell-input ${column.group === 'earning' ? 'earning-input' : ''} ${column.group === 'deduction' ? 'deduction-input' : ''}`}
//                       type="number" min="0" step="0.01" value={row[column.field]}
//                       aria-label={`${row.name} ${column.label}`}
//                       disabled={row.status !== 'ready' || (!bulkEdit && selectedIds.length > 0 && !selectedIds.includes(row.id))}
//                       onChange={(e) => onFieldChange(row.id, column.field, Math.max(0, Number(e.target.value) || 0))}
//                     />
//                   </td>)}
//                   <td className="salary-entry__total">{money(totalEarning)}</td><td className="salary-entry__total">{money(totalDeduction)}</td><td className="salary-entry__net">{money(totalEarning - totalDeduction)}</td>
//                   <td><span className={`salary-entry__status status-${row.status}`}>{row.status === 'ready' ? 'Ready' : row.status === 'loading' ? 'Checking' : row.status === 'generated' ? 'Generated' : 'Issue'}</span>{row.message && row.status === 'error' && <small className="salary-entry__row-message" title={row.message}>{row.message}</small>}</td>
//                 </tr>;
//               })}
//               {!rows.length && <tr><td colSpan={22} className="salary-entry__empty">{isLoading ? 'Loading employees...' : 'No employees match your search.'}</td></tr>}
//             </tbody>
//           </table>
//         </div>
//         <div className="salary-entry__pagination">
//           <span>Showing {totalRows === 0 ? 0 : (page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalRows)} of {totalRows} entries</span>
//           <div><button type="button" onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1}>‹</button>{Array.from({ length: totalPages }, (_, i) => i + 1).filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1).map((n, i, arr) => <React.Fragment key={n}>{i > 0 && arr[i - 1] !== n - 1 && <span className="salary-entry__ellipsis">…</span>}<button type="button" className={n === page ? 'is-current' : ''} onClick={() => onPageChange(n)}>{n}</button></React.Fragment>)}<button type="button" onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>›</button></div>
//         </div>
//       </div>

//       <footer className="salary-entry__footer">
//         <button type="button" className="salary-entry__cancel" onClick={onCancel}><X size={17} /> Cancel</button>
//         <div><button type="button" className="salary-entry__save" disabled={isSaving || isCheckingSalary || !rows.some((r) => r.status === 'ready')} onClick={onSave}><Save size={16} /> {isSaving ? 'Saving...' : 'Save'}</button><button type="button" className="salary-entry__send" disabled={isSaving || isCheckingSalary || !rows.some((r) => r.status === 'ready')} onClick={onSave}><Send size={16} /> Save &amp; Send</button></div>
//       </footer>
//     </section>
//   );
// };
// export default AddSalaryPfTable;






import React from 'react';
import { CalendarDays, Download, Pencil, Save, Search, Send, X } from 'lucide-react';
import './AddSalaryPfTable.css';

export interface SalaryPfEmployeeOption {
  id: string;
  name: string;
  employeeId: string;
}

export interface SalaryPfRow extends SalaryPfEmployeeOption {
  availedLeave: number;
  balanceLeave: number;
  salary: number;
  daysPaid: number;
  lopAbsent: number;
  basic: number;
  hra: number;
  cityCompensatoryAllowance: number;
  specialAllowance: number;
  otherEarning: number;
  nightAllowance: number;
  providentFundEmployee: number;
  providentFundEmployer: number;
  esic: number;
  professionalTax: number;
  otherDeduction: number;
  status: 'loading' | 'ready' | 'generated' | 'error';
  message: string;
}

type NumericField = Exclude<keyof SalaryPfRow, 'id' | 'name' | 'employeeId' | 'status' | 'message'>;
interface Column {
  label: string;
  field: NumericField;
  group: 'leave' | 'earning' | 'deduction';
  money?: boolean;
}

const columns: Column[] = [
  { label: 'Availed Leave', field: 'availedLeave', group: 'leave' },
  { label: 'Balance Leave', field: 'balanceLeave', group: 'leave' },
  { label: 'Salary (₹)', field: 'salary', group: 'leave', money: true },
  { label: 'Days Paid', field: 'daysPaid', group: 'leave' },
  { label: 'LOP / Absent', field: 'lopAbsent', group: 'leave' },
  { label: 'Basic', field: 'basic', group: 'earning', money: true },
  { label: 'HRA', field: 'hra', group: 'earning', money: true },
  { label: 'CCA', field: 'cityCompensatoryAllowance', group: 'earning', money: true },
  { label: 'Special', field: 'specialAllowance', group: 'earning', money: true },
  { label: 'Other', field: 'otherEarning', group: 'earning', money: true },
  { label: 'Night', field: 'nightAllowance', group: 'earning', money: true },
  { label: 'PF (Emp.)', field: 'providentFundEmployee', group: 'deduction', money: true },
  { label: 'PF (Er.)', field: 'providentFundEmployer', group: 'deduction', money: true },
  { label: 'ESIC', field: 'esic', group: 'deduction', money: true },
  { label: 'Prof. Tax', field: 'professionalTax', group: 'deduction', money: true },
  { label: 'Other', field: 'otherDeduction', group: 'deduction', money: true },
];

const money = (n: number) =>
  `₹ ${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

const earnings = (row: SalaryPfRow) =>
  row.basic + row.hra + row.cityCompensatoryAllowance + row.specialAllowance + row.otherEarning + row.nightAllowance;

const deductions = (row: SalaryPfRow) =>
  row.providentFundEmployee + row.providentFundEmployer + row.esic + row.professionalTax + row.otherDeduction;

interface Props {
  rows: SalaryPfRow[];
  totalRows: number;
  month: string;
  onMonthChange: (value: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  pageSize: number;
  onPageSizeChange: (value: number) => void;
  page: number;
  totalPages: number;
  onPageChange: (value: number) => void;
  selectedIds: string[];
  onToggleRow: (id: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  isLoading: boolean;
  isCheckingSalary: boolean;
  isSaving: boolean;
  errorMessage: string;
  checkMessage: string;
  bulkEdit: boolean;
  onBulkEdit: () => void;
  onFieldChange: (id: string, field: keyof SalaryPfRow, value: number) => void;
  onExport: () => void;
  onCancel: () => void;
  onSave: () => void;
  onSaveAndSend: () => void;
}

export const AddSalaryPfTable: React.FC<Props> = ({
  rows, totalRows, month, onMonthChange, search, onSearchChange, pageSize,
  onPageSizeChange, page, totalPages, onPageChange, selectedIds, onToggleRow,
  onToggleAll, isLoading, isCheckingSalary, isSaving, errorMessage, checkMessage,
  bulkEdit, onBulkEdit, onFieldChange, onExport, onCancel, onSave,  onSaveAndSend,
}) => {
  const allChecked = rows.length > 0 && rows.every((row) => selectedIds.includes(row.id));

  return (
    <section className="salary-entry">
      <div className="salary-entry__toolbar">
        <label className="salary-entry__month">
          <CalendarDays size={20} />
          <span><small>Month <b>*</b></small><input type="month" value={month} onChange={(e) => onMonthChange(e.target.value)} /></span>
        </label>
        <label className="salary-entry__search">
          <Search size={17} />
          <input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search by employee name or ID..." />
        </label>
        <button type="button" className="salary-entry__outline-button" onClick={onExport}><Download size={16} /> Export to Excel</button>
      </div>

      {(errorMessage || checkMessage || isLoading || isCheckingSalary) && (
        <div className={`salary-entry__message ${errorMessage ? 'is-error' : ''}`} role={errorMessage ? 'alert' : 'status'}>
          {errorMessage || (isLoading ? 'Loading employees...' : isCheckingSalary ? 'Loading salary details for employees...' : checkMessage)}
        </div>
      )}

      <div className="salary-entry__table-card">
        <div className="salary-entry__table-tools">
          <label>Show <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}><option value={10}>10</option><option value={25}>25</option><option value={50}>50</option><option value={100}>100</option></select> entries</label>
          <div className="salary-entry__legend">
            <span><i className="auto" /> Auto calculated</span>
            <span><i className="editable" /> Editable</span>
            <button type="button" className={bulkEdit ? 'is-active' : ''} onClick={onBulkEdit}><Pencil size={14} /> {bulkEdit ? 'Bulk Edit On' : 'Bulk Edit'}</button>
          </div>
        </div>

        <div className="salary-entry__scroll">
          <table>
            <thead>
              <tr className="salary-entry__groups">
                <th rowSpan={2}>#</th>
                <th rowSpan={2} className="salary-entry__employee-head">Employee<br /><small>ID | Name</small></th>
                <th colSpan={5} className="group-leave">Leave Information</th>
                <th colSpan={6} className="group-earning">Salary Additions (₹)</th>
                <th colSpan={5} className="group-deduction">Deductions (₹)</th>
                <th colSpan={3} className="group-summary">Summary (₹)</th>
                <th rowSpan={2}>Status</th>
              </tr>
              <tr className="salary-entry__columns">
                {columns.map((column) => <th key={column.field}>{column.label}</th>)}
                <th>Total Earnings</th><th>Total Deduction</th><th>Net Payable</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const totalEarning = earnings(row);
                const totalDeduction = deductions(row);
                return (
                  <tr key={row.id}>
                    <td className="salary-entry__serial">{(page - 1) * pageSize + index + 1}</td>
                    <td className="salary-entry__employee"><span><strong>{row.name}</strong><small>{row.employeeId}</small></span></td>
                    {columns.map((column) => (
                      <td key={column.field}>
                        <div className={`salary-entry__input-wrap ${column.money ? 'is-money' : ''}`}>
                          {column.money && <span className="salary-entry__currency" aria-hidden="true">₹</span>}
                          <input
                            className={`salary-entry__cell-input ${column.money ? 'money-input' : 'days-input'} ${column.group === 'earning' ? 'earning-input' : ''} ${column.group === 'deduction' ? 'deduction-input' : ''}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={row[column.field]}
                            aria-label={`${row.name} ${column.label}`}
                            disabled={row.status !== 'ready' || (!bulkEdit && selectedIds.length > 0 && !selectedIds.includes(row.id))}
                            onChange={(e) => onFieldChange(row.id, column.field, Math.max(0, Number(e.target.value) || 0))}
                          />
                        </div>
                      </td>
                    ))}
                    <td className="salary-entry__total">{money(totalEarning)}</td>
                    <td className="salary-entry__total">{money(totalDeduction)}</td>
                    <td className="salary-entry__net">{money(totalEarning - totalDeduction)}</td>
                    <td>
                      <span className={`salary-entry__status status-${row.status}`}>
                        {row.status === 'ready' ? 'Ready' : row.status === 'loading' ? 'Checking' : row.status === 'generated' ? 'Generated' : 'Issue'}
                      </span>
                      {row.message && row.status === 'error' && <small className="salary-entry__row-message" title={row.message}>{row.message}</small>}
                    </td>
                  </tr>
                );
              })}
              {!rows.length && <tr><td colSpan={22} className="salary-entry__empty">{isLoading ? 'Loading employees...' : 'No employees match your search.'}</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="salary-entry__pagination">
          <span>Showing {totalRows === 0 ? 0 : (page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalRows)} of {totalRows} entries</span>
          <div>
            <button type="button" onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
              .map((n, i, arr) => (
                <React.Fragment key={n}>
                  {i > 0 && arr[i - 1] !== n - 1 && <span className="salary-entry__ellipsis">…</span>}
                  <button type="button" className={n === page ? 'is-current' : ''} onClick={() => onPageChange(n)}>{n}</button>
                </React.Fragment>
              ))}
            <button type="button" onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>›</button>
          </div>
        </div>
      </div>

      {/* <footer className="salary-entry__footer">
        <button type="button" className="salary-entry__cancel" onClick={onCancel}><X size={17} /> Cancel</button>
        <div>
          <button type="button" className="salary-entry__save" disabled={isSaving || isCheckingSalary || !rows.some((r) => r.status === 'ready')} onClick={onSave}><Save size={16} /> {isSaving ? 'Saving...' : 'Save'}</button>
          <button type="button" className="salary-entry__send" disabled={isSaving || isCheckingSalary || !rows.some((r) => r.status === 'ready')} onClick={onSave}><Send size={16} /> Save &amp; Send</button>
        </div>
      </footer> */}

      <footer className="salary-entry__footer">
  <button
    type="button"
    className="salary-entry__cancel"
    onClick={onCancel}
  >
    <X size={17} /> Cancel
  </button>

  <div>
    <button
      type="button"
      className="salary-entry__save"
      disabled={
        isSaving ||
        isCheckingSalary ||
        !rows.some((r) => r.status === 'ready')
      }
      onClick={onSave}
    >
      <Save size={16} />
      {isSaving ? 'Saving...' : 'Save'}
    </button>

    <button
      type="button"
      className="salary-entry__send"
      disabled={
        isSaving ||
        isCheckingSalary ||
        !rows.some((r) => r.status === 'ready')
      }
      onClick={onSaveAndSend}
    >
      <Send size={16} /> Save &amp; Send
    </button>
  </div>
</footer>
    </section>
  );
};

export default AddSalaryPfTable;
