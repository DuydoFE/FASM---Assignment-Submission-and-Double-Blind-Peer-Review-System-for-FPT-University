import React, { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';

function InstructorManageCriteria() {
  const [criteria, setCriteria] = useState([
    {
      id: 1,
      title: 'Technical Implementation',
      weight: 25,
      items: [
        'Evaluate code quality',
        'Evaluate architecture',
        'Evaluate technical execution'
      ]
    },
    {
      id: 2,
      title: 'User Interface Design',
      weight: 20,
      items: [
        'Assess visual design',
        'Assess usability',
        'Assess user experience quality'
      ]
    },
    {
      id: 3,
      title: 'Documentation Quality',
      weight: 15,
      items: [
        'Evaluate completeness of project documentation',
        'Evaluate clarity of project documentation'
      ]
    },
    {
      id: 4,
      title: 'Performance & Optimization',
      weight: 15,
      items: [
        'Load time optimization',
        'Memory usage efficiency',
        'Database query performance'
      ]
    },
    {
      id: 5,
      title: 'Security Implementation',
      weight: 10,
      items: [
        'Input validation',
        'Authentication system',
        'Data protection measures'
      ]
    }
  ]);

  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
  const remainingWeight = 100 - totalWeight;

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Rubrics</span>
          <span>&gt;</span>
          <span className="font-semibold text-gray-900">Web Development Final Project</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Web Development Final Project</h1>

        {/* Rubric Summary Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Rubric Summary</h2>
          <div className="flex gap-12">
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Weight</div>
              <div className="text-3xl font-bold text-gray-900">{totalWeight}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Criteria</div>
              <div className="text-3xl font-bold text-gray-900">{criteria.length}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Scoring Methods</div>
              <div className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                10-Point Scale
              </div>
            </div>
          </div>
        </div>

        {/* Evaluation Criteria Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Evaluation Criteria</h2>
            <p className="text-sm text-gray-600">Manage and configure assessment criteria</p>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus size={20} />
            Add Criteria
          </button>
        </div>

        {/* Criteria Cards */}
        <div className="space-y-4">
          {criteria.map((criterion) => (
            <div
              key={criterion.id}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{criterion.title}</h3>
                <div className="flex items-center gap-4">
                  <span className="text-blue-600 font-medium">Weight: {criterion.weight}%</span>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Pencil size={18} />
                  </button>
                  <button className="text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <ul className="space-y-2">
                {criterion.items.map((item, idx) => (
                  <li key={idx} className="text-gray-600 text-sm flex items-start">
                    <span className="mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Weight Warning (if applicable) */}
        {remainingWeight !== 0 && (
          <div className={`mt-4 p-4 rounded-lg ${remainingWeight > 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={`text-sm ${remainingWeight > 0 ? 'text-yellow-800' : 'text-red-800'}`}>
              {remainingWeight > 0
                ? `Note: ${remainingWeight}% weight remaining to be allocated.`
                : `Warning: Total weight exceeds 100% by ${Math.abs(remainingWeight)}%.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InstructorManageCriteria;