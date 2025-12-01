import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { searchStudent } from "../service/searchService";
import { Tabs, List, Card, Tag, Spin, Empty, Typography } from "antd";
import { BookOpen, MessageSquare, FileText, CheckCircle, ListChecks } from "lucide-react";

const { Title, Text } = Typography;

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const result = await searchStudent(query);
        setData(result.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query]);

  const renderList = (dataSource, icon, renderItemContent) => {
    if (!dataSource || dataSource.length === 0) return <Empty description="No results found in this category" />;
    
    return (
      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }}
        dataSource={dataSource}
        renderItem={(item) => (
          <List.Item>
            <Card hoverable className="h-full border-zinc-700 bg-zinc-900">
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
      key: '1',
      label: <span className="flex items-center gap-2"><BookOpen size={16}/> Assignments ({data?.assignments?.length || 0})</span>,
      children: renderList(data?.assignments, <BookOpen />, (item) => (
        <>
          <Title level={5} style={{ color: 'white' }}>{item.title}</Title>
          <Text className="text-zinc-400 block mb-1">Course: {item.courseName}</Text>
          <Text className="text-zinc-500 text-sm line-clamp-3">{item.descriptionSnippet}</Text>
          
        </>
      )),
    },
    {
      key: '2',
      label: <span className="flex items-center gap-2"><MessageSquare size={16}/> Feedback ({data?.feedback?.length || 0})</span>,
      children: renderList(data?.feedback, <MessageSquare />, (item) => (
        <>
          <Title level={5} style={{ color: 'white' }}>For: {item.assignmentTitle}</Title>
          <Tag color={item.reviewerType === 'Instructor' ? 'gold' : 'blue'} className="mb-2">{item.reviewerType}</Tag>
          <Text className="text-zinc-400 block italic">"{item.overallFeedback}"</Text>
        </>
      )),
    },
    {
      key: '3',
      label: <span className="flex items-center gap-2"><FileText size={16}/> Summaries ({data?.summaries?.length || 0})</span>,
      children: renderList(data?.summaries, <FileText />, (item) => (
        <>
          <Title level={5} style={{ color: 'white' }}>{item.assignmentTitle}</Title>
          <Tag color="purple">{item.summaryType}</Tag>
          <Text className="text-zinc-400 block mt-2 text-sm">{item.contentSnippet}</Text>
          <Text className="text-zinc-600 text-xs mt-2 block">Gen: {new Date(item.generatedAt).toLocaleDateString()}</Text>
        </>
      )),
    },
    {
      key: '4',
      label: <span className="flex items-center gap-2"><CheckCircle size={16}/> Submissions ({data?.submissions?.length || 0})</span>,
      children: renderList(data?.submissions, <CheckCircle />, (item) => (
        <>
           <Title level={5} style={{ color: 'white' }}>{item.assignmentTitle}</Title>
           <Text className="text-zinc-300 block">File: {item.fileName}</Text>
           <Text className="text-zinc-500 block text-xs mt-1">Keywords: {item.keywords}</Text>
           <Text className="text-zinc-500 block text-xs">Submitted: {new Date(item.submittedAt).toLocaleDateString()}</Text>
        </>
      )),
    },
    {
      key: '5',
      label: <span className="flex items-center gap-2"><ListChecks size={16}/> Criteria ({data?.criteria?.length || 0})</span>,
      children: renderList(data?.criteria, <ListChecks />, (item) => (
        <>
           <Title level={5} style={{ color: 'white' }}>{item.title}</Title>
           <Text className="text-zinc-400 block text-sm">{item.description}</Text>
           <div className="flex justify-between mt-2 text-xs text-zinc-500">
             <span>Rubric: {item.rubricTitle}</span>
             <span>Max Score: {item.maxScore}</span>
           </div>
        </>
      )),
    },
  ];

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
        <Tabs 
            defaultActiveKey="1" 
            items={items} 
            className="text-white custom-tabs"
            type="card"
        />
      )}
    </div>
  );
};

export default SearchResultsPage;