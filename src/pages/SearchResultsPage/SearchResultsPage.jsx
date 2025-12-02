import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchStudent } from "../../service/searchService";
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
  AlertCircle,
} from "lucide-react";

const { Title, Text } = Typography;

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!query) return;

      setLoading(true);
      setErrorMsg(null); 
      setData(null); 

      try {
        const result = await searchStudent(query);
        setData(result.data);
      } catch (error) {
        console.error(error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setErrorMsg(error.response.data.message);
        } else {
          setErrorMsg("An unexpected error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query]);

  const handleCardClick = (item) => {
    if (item.type === "Assignment" || item.type === "assignment") {
      if (item.courseId && item.assignmentId) {
        navigate(`/assignment/${item.courseId}/${item.assignmentId}`);
      } else if (item.courseId) {
        navigate(`/assignment/${item.courseId}`);
      } else {
        console.warn("Missing courseId or assignmentId for navigation");
      }
    }
  };

  const renderList = (dataSource, icon, renderItemContent) => {
    if (!dataSource || dataSource.length === 0)
      return (
        <Empty
          description={<span className="text-zinc-400">No results found</span>}
        />
      );

    return (
      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }}
        dataSource={dataSource}
        renderItem={(item) => (
          <List.Item>
            <Card
              hoverable
              onClick={() => handleCardClick(item)}
              className="h-full border-zinc-700 bg-zinc-900 !border-white/10 cursor-pointer hover:!border-cyan-500/50 transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-white/10 rounded-lg text-cyan-400">
                  {icon}
                </div>
                <div>
                  <Tag color="cyan">{item.type || "Unknown"}</Tag>
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
          <Title level={5} style={{ color: "white" }}>
            {item.title}
          </Title>
          <Text className="text-zinc-400 block mb-1">
            Course: {item.courseName}
          </Text>
          <Text className="text-zinc-500 text-sm line-clamp-3">
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
          <Title level={5} style={{ color: "white" }}>
            For: {item.assignmentTitle}
          </Title>
          <Tag
            color={item.reviewerType === "Instructor" ? "gold" : "blue"}
            className="mb-2"
          >
            {item.reviewerType}
          </Tag>
          <Text className="text-zinc-400 block italic">
            "{item.overallFeedback}"
          </Text>
        </>
      )),
    },
    {
      key: "3",
      label: (
        <span className="flex items-center gap-2">
          <FileText size={16} /> Summaries ({data?.summaries?.length || 0})
        </span>
      ),
      children: renderList(data?.summaries, <FileText />, (item) => (
        <>
          <Title level={5} style={{ color: "white" }}>
            {item.assignmentTitle}
          </Title>
          <Tag color="purple">{item.summaryType}</Tag>
          <Text className="text-zinc-400 block mt-2 text-sm">
            {item.contentSnippet}
          </Text>
          <Text className="text-zinc-600 text-xs mt-2 block">
            Gen: {new Date(item.generatedAt).toLocaleDateString()}
          </Text>
        </>
      )),
    },
    {
      key: "4",
      label: (
        <span className="flex items-center gap-2">
          <CheckCircle size={16} /> Submissions (
          {data?.submissions?.length || 0})
        </span>
      ),
      children: renderList(data?.submissions, <CheckCircle />, (item) => (
        <>
          <Title level={5} style={{ color: "white" }}>
            {item.assignmentTitle}
          </Title>
          <Text className="text-zinc-300 block">File: {item.fileName}</Text>
          <Text className="text-zinc-500 block text-xs mt-1">
            Keywords: {item.keywords}
          </Text>
          <Text className="text-zinc-500 block text-xs">
            Submitted: {new Date(item.submittedAt).toLocaleDateString()}
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
          <Title level={5} style={{ color: "white" }}>
            {item.title}
          </Title>
          <Text className="text-zinc-400 block text-sm">
            {item.description}
          </Text>
          <div className="flex justify-between mt-2 text-xs text-zinc-500">
            <span>Rubric: {item.rubricTitle}</span>
            <span>Max Score: {item.maxScore}</span>
          </div>
        </>
      )),
    },
  ];

  if (errorMsg) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <h1 className="text-2xl font-bold text-white mb-6">Search Results</h1>
        <div className="flex flex-col items-center justify-center h-96 bg-white/5 rounded-xl border border-white/10">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Search Failed
          </h2>
          <p className="text-red-400 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20 text-center">
            {errorMsg}
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/10"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">
        Search Results for "<span className="text-cyan-400">{query}</span>"
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
                itemColor: "#f6f6faff",
                itemSelectedColor: "#000000ff",
                itemHoverColor: "#22d3ee",
                titleFontSize: 14,
                cardBg: "rgba(255, 255, 255, 0.05)",
                cardGutter: 4,
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

export default SearchResultsPage;
