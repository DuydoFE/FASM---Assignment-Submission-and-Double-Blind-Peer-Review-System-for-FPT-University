import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminClassManagement() {
  const navigate = useNavigate();

  // data
  const [classes, setClasses] = useState([]);

  // cascading filters state
  const [filters, setFilters] = useState({
    campus: "",
    year: "",
    term: "",
    major: "",
    course: "",
    search: "",
  });

  // options for filters
  const [years, setYears] = useState([]);
  const [termsForYear, setTermsForYear] = useState([]);
  const [majors, setMajors] = useState([]);
  const [coursesByMajor, setCoursesByMajor] = useState([]);

  // UI states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // create form
  const [newClass, setNewClass] = useState({
    campus: "",
    year: "",
    term: "",
    major: "",
    course: "",
    name: "",
    startDate: "",
    endDate: "",
  });

  const handleCampusChange = (e) => {
    setFilters({ campus: e.target.value, year: "", term: "", major: "", course: "", search: "" });
  };

  const handleYearChange = (e) => setFilters({ ...filters, year: e.target.value });
  const handleTermChange = (e) => setFilters({ ...filters, term: e.target.value });
  const handleMajorChange = (e) => setFilters({ ...filters, major: e.target.value });
  const handleCourseChange = (e) => setFilters({ ...filters, course: e.target.value });
  const handleSearchChange = (e) => setFilters({ ...filters, search: e.target.value });

  const handleViewDetail = (id) => {
    navigate(`/admin/classes/${id}/users`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-orange-500">🏫 Class Management</h2>

      {/* Filter & Actions */}
      <div className="bg-white p-4 rounded-xl shadow-md flex flex-wrap gap-4 items-center">
        <select className="border rounded p-2" value={filters.campus} onChange={handleCampusChange}>
          <option value="">Select Campus</option>
          <option value="1">Hồ Chí Minh</option>
          <option value="2">Hà Nội</option>
        </select>

        {filters.campus && (
          <>
            <select className="border rounded p-2" value={filters.year} onChange={handleYearChange}>
              <option value="">Year</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            {filters.year && (
              <select className="border rounded p-2" value={filters.term} onChange={handleTermChange}>
                <option value="">Term</option>
                {termsForYear.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            )}

            <select className="border rounded p-2" value={filters.major} onChange={handleMajorChange}>
              <option value="">Major</option>
              {majors.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {filters.major && (
              <select className="border rounded p-2" value={filters.course} onChange={handleCourseChange}>
                <option value="">Course</option>
                {coursesByMajor.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </>
        )}

        <input
          type="text"
          placeholder="Search by class name"
          className="border rounded p-2 flex-1 min-w-[200px]"
          value={filters.search}
          onChange={handleSearchChange}
        />

        <div className="ml-auto flex flex-wrap gap-2">
          <button onClick={() => setShowImportModal(true)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium">
            📂 Import Class List
          </button>

          <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100">
            + Add Class
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        {classes.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="p-2 text-left">Class Name</th>
                <th className="p-2 text-left">Campus</th>
                <th className="p-2 text-left">Year</th>
                <th className="p-2 text-left">Term</th>
                <th className="p-2 text-left">Major</th>
                <th className="p-2 text-left">Course</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c) => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">{c.campus}</td>
                  <td className="p-2">{c.year}</td>
                  <td className="p-2">{c.term}</td>
                  <td className="p-2">{c.major}</td>
                  <td className="p-2">{c.courseName}</td>
                  <td className="p-2">{c.status}</td>
                  <td className="p-2 space-x-2">
                    <button className="text-orange-500 hover:underline" onClick={() => handleViewDetail(c.id)}>
                      View Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-4 text-center text-gray-500">
            {filters.campus ? "No classes found" : "Please select a campus to start filtering classes"}
          </p>
        )}
      </div>

      {/* IMPORT Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Import Class List (Excel)</h3>
            <input type="file" accept=".xlsx,.xls" />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowImportModal(false)} className="px-4 py-2 border rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Create New Class</h3>
            <form className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <select required value={newClass.campus} onChange={(e) => setNewClass({ ...newClass, campus: e.target.value })} className="border rounded p-2">
                  <option value="">Select Campus</option>
                  <option value="1">Hồ Chí Minh</option>
                  <option value="2">Hà Nội</option>
                </select>

                <select required value={newClass.year} onChange={(e) => setNewClass({ ...newClass, year: e.target.value })} className="border rounded p-2">
                  <option value="">Year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>

                <select required value={newClass.term} onChange={(e) => setNewClass({ ...newClass, term: e.target.value })} className="border rounded p-2">
                  <option value="">Term</option>
                  {termsForYear.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                <select required value={newClass.major} onChange={(e) => setNewClass({ ...newClass, major: e.target.value })} className="border rounded p-2">
                  <option value="">Major</option>
                  {majors.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>

                <select required value={newClass.course} onChange={(e) => setNewClass({ ...newClass, course: e.target.value })} className="border rounded p-2">
                  <option value="">Course</option>
                  {coursesByMajor.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <input required value={newClass.name} onChange={(e) => setNewClass({ ...newClass, name: e.target.value })} placeholder="Class name" className="border rounded p-2" />

                <input type="date" required value={newClass.startDate} onChange={(e) => setNewClass({ ...newClass, startDate: e.target.value })} className="border rounded p-2" />

                <input type="date" required value={newClass.endDate} onChange={(e) => setNewClass({ ...newClass, endDate: e.target.value })} className="border rounded p-2" />
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border rounded">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
