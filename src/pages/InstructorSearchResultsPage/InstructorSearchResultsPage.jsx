import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchInstructor } from "../../service/searchService";
import {
  Tabs,
  List,
  Card,
  Tag,
  Spin,
  Empty,
  Typography,
  ConfigProvider,
} from "antd";
import {
  BookOpen,
  MessageSquare,
  FileText,
  CheckCircle,
  ListChecks,
} from "lucide-react";

const { Title, Text } = Typography;

const InstructorSearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const result = await searchInstructor(query);
        setData(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query]);

  const handleCardClick = (item) => {
    // Custom navigation logic for instructor
    if (item.type === "Assignment" || item.type === "assignment") {
      if (item.classId && item.assignmentId) {
        navigate(`/instructor/manage-assignment/${item.classId}`);
      }
    } else if (item.type === "Submission" || item.type === "submission") {
      if (item.submissionId) {
        navigate(`/instructor/submission-detail/${item.submissionId}`);
      }
    } else if (item.type === "Summary" || item.type === "summary") {
      if (item.assignmentId) {
        navigate(`/instructor/assignment/${item.assignmentId}/summary`);
      }
    } else if (item.type === "Criteria" || item.type === "criteria") {
      if (item.rubricId) {
        navigate(`/instructor/manage-criteria/${item.rubricId}`);
      }
    }
  };

  const renderList = (dataSource, icon, renderItemContent) => {
    if (!dataSource || dataSource.length === 0) {
      return (
        <Empty
          description={<span className="text-gray-500">No results found</span>}
        />
      );
    }

    return (
      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }}
        dataSource={dataSource}
        renderItem={(item) => (
          <List.Item>
            <Card
              hoverable
              onClick={() => handleCardClick(item)}
              className="h-full border-gray-200 bg-white cursor-pointer hover:!border-orange-500 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-orange-50 rounded-lg text-orange-500">
                  {icon}
                </div>
                <div>
                  <Tag color="orange">{item.type || "Unknown"}</Tag>
                </div>
              </div>
              {renderItemContent(item)}
            </Card>
          </List.Item>
        )}
      />
    );
  };

  const items = [
    {
      key: "1",
      label: (
        <span className="flex items-center gap-2">
          <BookOpen size={16} /> Assignments ({data?.assignments?.length || 0})
        </span>
      ),
      children: renderList(data?.assignments, <BookOpen />, (item) => (
        <>
          <Title level={5} className="!text-gray-800 !mb-2">
            {item.title}
          </Title>
          <Text className="text-gray-600 block mb-1">
            Class: {item.className}
          </Text>
          <Text className="text-gray-500 text-sm line-clamp-3">
            {item.descriptionSnippet}
          </Text>
        </>
      )),
    },
    {
      key: "2",
      label: (
        <span className="flex items-center gap-2">
          <MessageSquare size={16} /> Feedback ({data?.feedback?.length || 0})
        </span>
      ),
      children: renderList(data?.feedback, <MessageSquare />, (item) => (
        <>
          <Title level={5} className="!text-gray-800 !mb-2">
            For: {item.assignmentTitle}
          </Title>
          <Text className="text-gray-600 block mb-1">
            Student: {item.studentName}
          </Text>
          <Tag
            color={item.reviewerType === "Instructor" ? "gold" : "blue"}
            className="mb-2"
          >
            {item.reviewerType}
          </Tag>
          <Text className="text-gray-500 block italic">
            "{item.overallFeedback}"
          </Text>
        </>
      )),
    },
    {
      key: "3",
      label: (
        <span className="flex items-center gap-2">
          <CheckCircle size={16} /> Submissions (
          {data?.submissions?.length || 0})
        </span>
      ),
      children: renderList(data?.submissions, <CheckCircle />, (item) => (
        <>
          <Title level={5} className="!text-gray-800 !mb-2">
            {item.assignmentTitle}
          </Title>
          <Text className="text-gray-600 block">
            Student: {item.studentName}
          </Text>
          <Text className="text-gray-600 block">File: {item.fileName}</Text>
          <Text className="text-gray-500 block text-xs mt-1">
            Keywords: {item.keywords}
          </Text>
          <Text className="text-gray-500 block text-xs">
            Submitted: {new Date(item.submittedAt).toLocaleDateString()}
          </Text>
        </>
      )),
    },
    {
      key: "4",
      label: (
        <span className="flex items-center gap-2">
          <FileText size={16} /> Summaries ({data?.summaries?.length || 0})
        </span>
      ),
      children: renderList(data?.summaries, <FileText />, (item) => (
        <>
          <Title level={5} className="!text-gray-800 !mb-2">
            {item.assignmentTitle}
          </Title>
          <Tag color="purple">{item.summaryType}</Tag>
          <Text className="text-gray-600 block mt-2 text-sm">
            {item.contentSnippet}
          </Text>
          <Text className="text-gray-500 text-xs mt-2 block">
            Generated: {new Date(item.generatedAt).toLocaleDateString()}
          </Text>
        </>
      )),
    },
    {
      key: "5",
      label: (
        <span className="flex items-center gap-2">
          <ListChecks size={16} /> Criteria ({data?.criteria?.length || 0})
        </span>
      ),
      children: renderList(data?.criteria, <ListChecks />, (item) => (
        <>
          <Title level={5} className="!text-gray-800 !mb-2">
            {item.title}
          </Title>
          <Text className="text-gray-600 block text-sm">
            {item.description}
          </Text>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Rubric: {item.rubricTitle}</span>
            <span>Max Score: {item.maxScore}</span>
          </div>
        </>
      )),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Search Results for "<span className="text-orange-500">{query}</span>"
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                itemColor: "#6b7280",
                itemSelectedColor: "#f97316",
                itemHoverColor: "#fb923c",
                titleFontSize: 14,
                cardBg: "#ffffff",
                cardGutter: 4,
              },
              Spin: {
                colorPrimary: "#f97316",
              },
            },
          }}
        >
          <Tabs defaultActiveKey="1" items={items} type="card" />
        </ConfigProvider>
      )}
    </div>
  );
};

export default InstructorSearchResultsPage;
