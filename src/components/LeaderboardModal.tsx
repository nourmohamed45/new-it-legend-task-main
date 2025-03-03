import { useRef, useEffect, useState } from "react";
import {
  X,
  Trophy,
  Crown,
  Medal,
  Award,
  ChevronDown,
  ChevronUp,
  Search,
  Star,
  Sparkles,
  Flame,
  Zap,
  Users,
} from "lucide-react";

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  progressPercentage: number;
  courseName?: string;
}

// Generate more mock data for testing scrolling
const generateMockLeaderboard = (count: number) => {
  const names = [
    "Ahmed",
    "Sara",
    "Mohammed",
    "Fatima",
    "Omar",
    "Layla",
    "Ali",
    "Noor",
    "Yusuf",
    "Zainab",
  ];
  const lastNames = [
    "M.",
    "K.",
    "A.",
    "Z.",
    "S.",
    "H.",
    "R.",
    "T.",
    "Q.",
    "N.",
  ];
  const avatars = ["/avatars/man.png", "/avatars/woman.png"];

  const entries = [];
  for (let i = 0; i < count; i++) {
    const nameIndex = Math.floor(Math.random() * names.length);
    const lastNameIndex = Math.floor(Math.random() * lastNames.length);
    const avatarIndex = Math.floor(Math.random() * avatars.length);
    const score = Math.floor(Math.random() * 30) + 70; // Scores between 70-99

    entries.push({
      name: `${names[nameIndex]} ${lastNames[lastNameIndex]}`,
      score,
      avatar: avatars[avatarIndex],
    });
  }

  // Sort by score descending
  entries.sort((a, b) => b.score - a.score);

  // Assign ranks after sorting (handling ties correctly)
  let currentRank = 1;
  let previousScore = -1;

  return entries.map((entry, index) => {
    // If this score is different from the previous one, update the rank
    if (entry.score !== previousScore) {
      currentRank = index + 1;
    }

    previousScore = entry.score;

    return {
      ...entry,
      rank: currentRank,
    };
  });
};

const LeaderboardModal = ({
  isOpen,
  onClose,
  progressPercentage,
  courseName = "Course Name Shown Here",
}: LeaderboardModalProps) => {
  const modalContentRef = useRef<HTMLDivElement>(null);
  const leaderboardRef = useRef<HTMLDivElement>(null);
  const [showAllEntries, setShowAllEntries] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"leaderboard" | "achievements">(
    "leaderboard"
  );
  const [animateProgress, setAnimateProgress] = useState(false);
  const [leaderboardEntries, setLeaderboardEntries] = useState<
    Array<{
      name: string;
      score: number;
      avatar: string;
      rank: number;
    }>
  >([]);

  // Generate leaderboard data only once when component mounts
  useEffect(() => {
    setLeaderboardEntries(generateMockLeaderboard(20));
  }, []);

  // Calculate user's position based on progress percentage
  const userScore = progressPercentage;
  const userRank =
    leaderboardEntries.length > 0
      ? leaderboardEntries.findIndex((entry) => entry.score <= userScore) + 1
      : 1;
  const userRankDisplay =
    userRank > 0 ? userRank : leaderboardEntries.length + 1;

  // Filter entries based on search term
  const filteredEntries = leaderboardEntries.filter((entry) =>
    entry.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Display entries based on showAllEntries state and search term
  const displayedEntries = showAllEntries
    ? filteredEntries
    : filteredEntries.slice(0, 5);

  // Handle click outside to close modal
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      modalContentRef.current &&
      !modalContentRef.current.contains(e.target as Node)
    ) {
      onClose();
    }
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Animate progress bar when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setAnimateProgress(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setAnimateProgress(false);
    }
  }, [isOpen]);

  // Get motivational message based on progress
  const getMotivationalMessage = () => {
    // Arabic text shown in the image
    if (progressPercentage >= 90) {
      return "عظيم! ما شاء الله. إنجازاتك في الكورس رائعة. أفضل من ٩٠٪ من باقي الطلبة.";
    } else if (progressPercentage >= 75) {
      return "رائع! أداؤك متميز في هذا الكورس. أنت في أعلى ٢٥٪ من الطلبة.";
    } else if (progressPercentage >= 50) {
      return "جيد جداً! أنت في منتصف الطريق. استمر في التعلم وستصل قريباً!";
    } else if (progressPercentage >= 25) {
      return "أحسنت! بدأت رحلتك التعليمية بشكل جيد. استمر في المثابرة!";
    } else {
      return "مرحباً بك في بداية رحلتك التعليمية! كل رحلة تبدأ بخطوة أولى.";
    }
  };

  // Get appropriate icon based on progress
  const getProgressIcon = () => {
    if (progressPercentage >= 90) {
      return <Crown size={28} className="text-yellow-500" />;
    } else if (progressPercentage >= 75) {
      return <Trophy size={28} className="text-yellow-500" />;
    } else if (progressPercentage >= 50) {
      return <Medal size={28} className="text-yellow-500" />;
    } else {
      return <Award size={28} className="text-yellow-500" />;
    }
  };

  // Get progress color based on percentage
  const getProgressColor = () => {
    if (progressPercentage >= 90)
      return "from-yellow-400 via-amber-500 to-yellow-600";
    if (progressPercentage >= 75)
      return "from-blue-400 via-indigo-500 to-blue-600";
    if (progressPercentage >= 50)
      return "from-green-400 via-emerald-500 to-green-600";
    if (progressPercentage >= 25)
      return "from-orange-400 via-amber-500 to-orange-600";
    return "from-gray-400 via-slate-500 to-gray-600";
  };

  // Get rank badge style
  const getRankBadgeStyle = (rank: number) => {
    if (rank === 1)
      return "bg-gradient-to-r from-yellow-300 to-yellow-500 shadow-yellow-200 shadow-lg";
    if (rank === 2)
      return "bg-gradient-to-r from-gray-300 to-gray-400 shadow-gray-200 shadow-md";
    if (rank === 3)
      return "bg-gradient-to-r from-amber-600 to-amber-800 shadow-amber-200 shadow-md";
    return "bg-gradient-to-r from-blue-400 to-blue-600 shadow-blue-200 shadow-sm";
  };

  // Get achievement data
  const getAchievements = () => {
    return [
      {
        icon: <Flame className="text-orange-500" size={24} />,
        title: "Fast Learner",
        description: "Completed 5 lessons in one day",
        earned: progressPercentage > 40,
        progress:
          progressPercentage > 40
            ? 100
            : Math.min(progressPercentage, 40) * 2.5,
      },
      {
        icon: <Sparkles className="text-purple-500" size={24} />,
        title: "Perfect Score",
        description: "Scored 100% on an exam",
        earned: progressPercentage > 60,
        progress:
          progressPercentage > 60
            ? 100
            : Math.min(progressPercentage, 60) * 1.66,
      },
      {
        icon: <Zap className="text-yellow-500" size={24} />,
        title: "Quick Thinker",
        description: "Completed an exam in record time",
        earned: progressPercentage > 80,
        progress:
          progressPercentage > 80
            ? 100
            : Math.min(progressPercentage, 80) * 1.25,
      },
      {
        icon: <Star className="text-blue-500" size={24} />,
        title: "Top Student",
        description: "Ranked in the top 10% of students",
        earned: progressPercentage > 90,
        progress:
          progressPercentage > 90
            ? 100
            : Math.min(progressPercentage, 90) * 1.11,
      },
    ];
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn"
      onClick={handleOutsideClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="leaderboard-modal-title"
      style={{ animation: "fadeIn 0.3s ease-out" }}
    >
      <div
        ref={modalContentRef}
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl transform transition-all animate-scaleIn max-h-[85vh] border border-gray-100"
        style={{ animation: "scaleIn 0.3s ease-out" }}
      >
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-yellow-500 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-blue-500 rounded-full opacity-20 blur-xl"></div>

        {/* Header with gradient background */}
        <div
          className={`bg-gradient-to-r ${getProgressColor()} py-5 px-6 text-white relative overflow-hidden`}
        >
          {/* Decorative particles */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div
              className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full opacity-60 animate-float"
              style={{ animationDelay: "0.5s", animationDuration: "3s" }}
            ></div>
            <div
              className="absolute top-3/4 left-1/2 w-2 h-2 bg-white rounded-full opacity-40 animate-float"
              style={{ animationDelay: "1.2s", animationDuration: "4s" }}
            ></div>
            <div
              className="absolute top-1/3 left-3/4 w-1.5 h-1.5 bg-white rounded-full opacity-50 animate-float"
              style={{ animationDelay: "0.8s", animationDuration: "3.5s" }}
            ></div>
            <div
              className="absolute top-2/3 left-1/5 w-1 h-1 bg-white rounded-full opacity-30 animate-float"
              style={{ animationDelay: "1.5s", animationDuration: "4.5s" }}
            ></div>
          </div>

          <button
            onClick={onClose}
            className="absolute right-3 top-3 text-white hover:text-gray-200 p-1.5 rounded-full hover:bg-white/10 transition-colors z-10"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="relative z-10">
            <div className="flex items-center mb-3">
              <div className="bg-white/20 p-2.5 rounded-full backdrop-blur-sm mr-4 shadow-inner">
                {getProgressIcon()}
              </div>
              <div className="flex-1">
                <h3 id="leaderboard-modal-title" className="text-xl font-bold">
                  {courseName}
                </h3>
                <p className="text-xs text-white/80 mt-0.5">
                  Your progress dashboard
                </p>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-medium">Your Progress</span>
                <span className="text-sm font-bold">{progressPercentage}%</span>
              </div>
              <div className="bg-white/20 rounded-full h-3 w-full overflow-hidden shadow-inner">
                <div
                  className="bg-white h-full transition-all duration-1500 ease-out rounded-full shadow-sm"
                  style={{
                    width: animateProgress ? `${progressPercentage}%` : "0%",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center transition-colors ${
              activeTab === "leaderboard"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("leaderboard")}
          >
            <Trophy size={16} className="mr-2" />
            Leaderboard
          </button>
          <button
            className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center transition-colors ${
              activeTab === "achievements"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("achievements")}
          >
            <Medal size={16} className="mr-2" />
            Achievements
          </button>
        </div>

        {/* Content area with scrolling */}
        <div
          className="overflow-y-auto custom-scrollbar"
          style={{ maxHeight: "calc(85vh - 200px)" }}
        >
          {activeTab === "leaderboard" ? (
            <div className="p-4">
              {/* Motivational message section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl mb-5 flex items-center shadow-inner">
                <div className="flex-shrink-0 mr-3">
                  <div className="bg-white p-2 rounded-full shadow-md border border-gray-100 flex items-center justify-center">
                    <img
                      src="/trophy-icon.svg"
                      alt="Trophy"
                      className="w-8 h-8 animate-pulse"
                      style={{ animationDuration: "3s" }}
                      onError={(e) => {
                        // Fallback if image doesn't load
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%23FFD700' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='M6 9H4.5a2.5 2.5 0 0 1 0-5H6'/%3e%3cpath d='M18 9h1.5a2.5 2.5 0 0 0 0-5H18'/%3e%3cpath d='M4 22h16'/%3e%3cpath d='M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22'/%3e%3cpath d='M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22'/%3e%3cpath d='M18 2H6v7a6 6 0 0 0 12 0V2Z'/%3e%3c/svg%3e";
                      }}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <p
                    className="text-sm font-medium text-right text-gray-800"
                    dir="rtl"
                  >
                    {getMotivationalMessage()}
                  </p>
                </div>
              </div>

              {/* Search input */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Stats summary */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-3 shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users size={16} className="text-blue-600" />
                    </div>
                    <div className="ml-2">
                      <p className="text-xs text-blue-700">Total Students</p>
                      <p className="text-lg font-bold text-blue-900">
                        {leaderboardEntries.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-lg p-3 shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Trophy size={16} className="text-yellow-600" />
                    </div>
                    <div className="ml-2">
                      <p className="text-xs text-yellow-700">Your Rank</p>
                      <p className="text-lg font-bold text-yellow-900">
                        {userRankDisplay}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leaderboard entries */}
              <div ref={leaderboardRef} className="space-y-2.5">
                {displayedEntries.length > 0 ? (
                  displayedEntries.map((entry, index) => (
                    <div
                      key={index}
                      className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center transition-all hover:shadow-md hover:border-blue-200 group"
                    >
                      <div
                        className={`${getRankBadgeStyle(
                          entry.rank
                        )} w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white mr-3`}
                      >
                        {entry.rank}
                      </div>
                      <div className="flex-shrink-0 mr-3 relative">
                        <img
                          src={entry.avatar}
                          alt={entry.name}
                          className="w-9 h-9 rounded-full border-2 border-gray-200 group-hover:border-blue-200 transition-colors"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3ccircle cx='12' cy='8' r='5'/%3e%3cpath d='M20 21a8 8 0 0 0-16 0'/%3e%3c/svg%3e";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {entry.name}
                        </p>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${entry.score}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 font-bold text-gray-700 ml-2">
                        {entry.score}%
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>No students found</p>
                  </div>
                )}

                {/* Toggle button to show more/less entries */}
                {filteredEntries.length > 5 && (
                  <button
                    onClick={() => setShowAllEntries(!showAllEntries)}
                    className="w-full mt-3 py-2 px-4 text-sm bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 hover:text-blue-800 flex items-center justify-center rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-colors font-medium"
                  >
                    {showAllEntries ? (
                      <>
                        <ChevronUp size={16} className="mr-1.5" /> Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} className="mr-1.5" /> Show More (
                        {filteredEntries.length - 5} more)
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4">
              <h4 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
                <Star size={18} className="text-yellow-500 mr-2" />
                Your Achievements
              </h4>

              <div className="space-y-4">
                {getAchievements().map((achievement, index) => (
                  <div
                    key={index}
                    className={`rounded-xl p-4 transition-all ${
                      achievement.earned
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100"
                        : "bg-gray-50 border border-gray-100"
                    }`}
                  >
                    <div className="flex items-start">
                      <div
                        className={`p-2.5 rounded-lg mr-3 ${
                          achievement.earned
                            ? "bg-white shadow-md"
                            : "bg-gray-100"
                        }`}
                      >
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h5 className="font-bold text-gray-800">
                            {achievement.title}
                          </h5>
                          {achievement.earned && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">
                              Earned
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {achievement.description}
                        </p>

                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">
                              {Math.round(achievement.progress)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                achievement.earned
                                  ? "bg-green-500"
                                  : "bg-blue-500"
                              }`}
                              style={{ width: `${achievement.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardModal;
