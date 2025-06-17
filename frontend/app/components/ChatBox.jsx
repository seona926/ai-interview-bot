import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { BounceLoader } from 'react-spinners';
import QuestionCard from './QuestionCard';
import FeedbackCard from './FeedbackCard';
import FolderSelector from './FolderSelector';
import ControlButtons from './ControlButtons';
import HistoryList from './HistoryList';

export default function ChatBox({ resumeText }) {
    const socketRef = useRef(null);
    const [question, setQuestion] = useState('');
    const [feedback, setFeedback] = useState('');
    const [answer, setAnswer] = useState('');
    const [step, setStep] = useState('idle'); // idle | question | feedback
    const [history, setHistory] = useState([]); // [{ question, answer, feedback, bookmarked }]
    const [showHistory, setShowHistory] = useState(false);
    const [expandedIndexes, setExpandedIndexes] = useState([]);
    const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);
    const [folders, setFolders] = useState(['기본']); // 사용자 정의 폴더들
    const [activeFolder, setActiveFolder] = useState('기본'); // 현재 질문 저장용
    const [filterFolder, setFilterFolder] = useState('기본'); // 히스토리 필터링용
    const [pendingHistory, setPendingHistory] = useState(null); // 피드백 대기 중 항목

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4000');
        socketRef.current = ws;

        ws.onopen = () => {
            console.log('WebSocket connected');
            requestQuestion();
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'question') {
                setQuestion(data.text);
                setStep('question');
            }
            if (data.type === 'feedback') {
                setFeedback(data.text);
                setStep('feedback');
            }
        };

        ws.onerror = (err) => {
            console.error('WebSocket error', err);
        };

        return () => {
            ws.close();
        };
    }, [resumeText]);

    useEffect(() => {
        if (step === 'feedback' && question && answer && feedback) {
            setPendingHistory({
                question,
                answer,
                feedback,
                bookmarked: false,
                folder: '',
            });
        }
    }, [step]);

    const requestQuestion = () => {
        if (
            !socketRef.current ||
            socketRef.current.readyState !== WebSocket.OPEN
        ) {
            console.warn('⚠️ WebSocket이 아직 연결되지 않았습니다.');
            return;
        }

        setQuestion('');
        setAnswer('');
        setFeedback('');
        setStep('loading');

        socketRef.current.send(
            JSON.stringify({
                type: 'ask-question',
                resumeText,
            })
        );
    };

    const sendAnswer = () => {
        if (
            !socketRef.current ||
            socketRef.current.readyState !== WebSocket.OPEN
        ) {
            console.warn("⚠️ WebSocket이 아직 연결되지 않았습니다.");
            return;
        }

        setStep('loading');

        socketRef.current.send(
            JSON.stringify({
                type: 'user-answer',
                answerText: answer,
            })
        );
    };

    const toggleIndex = (index) => {
        setExpandedIndexes(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const toggleBookmark = (index) => {
        setHistory(prev =>
            prev.map((item, i) =>
                i === index ? { ...item, bookmarked: !item.bookmarked } : item
            )
        );
    };

    const handleAddFolder = () => {
        const name = prompt('새 폴더 이름을 입력하세요:');
        if (name && !folders.includes(name)) {
        setFolders([...folders, name]);
        setActiveFolder(name);
        }
    };

    return (
        <div className="space-y-4 p-4 border rounded max-w-2xl mx-auto relative">
        {/* 로딩 오버레이 */}
        {step === 'loading' && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex flex-col items-center justify-center z-10 rounded">
            <BounceLoader color="#4A90E2" size={60} />
            <p className="mt-4 text-gray-600">AI가 생각 중입니다...</p>
            </div>
        )}

        {/* 질문 카드 */}
        {question && (
            <QuestionCard
            question={question}
            answer={answer}
            step={step}
            isBookmarked={history[history.length - 1]?.bookmarked}
            onToggleBookmark={() => toggleBookmark(history.length - 1)}
            />
        )}

        {/* 답변 입력 */}
        {step === 'question' && (
            <div>
            <textarea
                className="w-full border p-2 rounded"
                rows={4}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="이 질문에 대한 답변을 입력하세요..."
            />
            <button
                onClick={sendAnswer}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
            >
                답변 제출
            </button>
            </div>
        )}

        {/* 피드백 */}
        <FeedbackCard feedback={feedback} />

        {/* 폴더 선택 */}
        {step === 'feedback' && (
            <FolderSelector
                folders={folders}
                activeFolder={pendingHistory?.folder || ''}
                onChange={(folder) => {
                    setPendingHistory((prev) => ({ ...prev, folder }));
                }}
                onAddFolder={handleAddFolder}
            />
        )}

        {/* 버튼 컨트롤 */}
        {step === 'feedback' && (
            <ControlButtons
                onNext={requestQuestion}
                onToggleHistory={() => setShowHistory(prev => !prev)}
                showHistory={showHistory}
                disabled={step === 'loading'}
            />
        )}

        {/* 히스토리 */}
        {showHistory && (
            <>
                <div className="flex items-center justify-between mt-8 mb-2">
                        <h2 className="text-xl font-semibold text-gray-800">📚 이전 질문 목록</h2>
                        
                    {/* 책갈피 필터 */}
                    <label className="flex items-center text-sm gap-1">
                        <input
                        type="checkbox"
                        checked={showOnlyBookmarked}
                        onChange={(e) => setShowOnlyBookmarked(e.target.checked)}
                        />
                        책갈피만 보기
                    </label>
                    </div>
                    
                 {/* 폴더 필터링 select */}
                <select
                    value={filterFolder}
                    onChange={(e) => setFilterFolder(e.target.value)}
                    className="border rounded p-1 mb-4"
                    >
                    {folders.map(folder => (
                        <option key={folder} value={folder}>{folder}</option>
                    ))}
                </select>    

                <HistoryList
                    history={history}
                    activeFolder={filterFolder}
                    showOnlyBookmarked={showOnlyBookmarked}
                    expandedIndexes={expandedIndexes}
                    toggleIndex={toggleIndex}
                    toggleBookmark={toggleBookmark}
                />
            </>
        )}
        </div>
    );
}
