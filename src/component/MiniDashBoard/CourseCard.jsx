import { User, MapPin } from 'lucide-react'; 

const CourseCard = ({ title, code, teacher, students, campus }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm w-full">
    <h3 className="font-bold text-gray-800">{title}</h3>
    <p className="text-sm text-gray-500 mb-4">{code}</p>
    <div className="space-y-2 text-sm text-gray-600">
      <p className="flex items-center"><User className="w-4 h-4 mr-2" /> Giảng viên: {teacher}</p>
      <p className="flex items-center"><User className="w-4 h-4 mr-2" /> {students} sinh viên</p>
    
      <p className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> Campus: {campus}</p>
    </div>
  </div>
);

export default CourseCard;