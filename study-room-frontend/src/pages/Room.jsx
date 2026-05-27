import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useRoomStore } from "../store/roomStore";
import { useSessionStore } from "../store/sessionStore";
import { useChatStore } from "../store/chatStore";
import { useAuthStore } from "../store/authStore";
import { socketService } from "../services/socket.service";
import { Button } from "../components/ui/Button";
import ActivityFeed from "../components/rooms/ActivityFeed";
import InviteModal from "../components/rooms/InviteModal";
import SessionGoals from "../components/timer/SessionGoals";
import SessionSummary from "../components/timer/SessionSummary";

export default function Room() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const { currentRoom, fetchRoom, leaveRoom } = useRoomStore();
  const { elapsedSeconds, isRunning, startSession, endSession, updateTimer } =
    useSessionStore();
  const { messages, addMessage, clearMessages } = useChatStore();
  const [messageInput, setMessageInput] = useState("");
  const [participants, setParticipants] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const messagesEndRef = useRef(null);
  const [sessionGoals, setSessionGoals] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [sharedGoals, setSharedGoals] = useState(null);
const [goalNotified, setGoalNotified] = useState(false);
  useEffect(() => {
    if (id) {
      fetchRoom(id);
    }
  }, [id]);

  // Check if current user is room owner
  useEffect(() => {
    if (currentRoom && user) {
      setIsOwner(currentRoom.owner?._id === user._id);
    }
  }, [currentRoom, user]);

  // Debug: Log whenever elapsedSeconds changes significantly
useEffect(() => {
  console.log("Timer update - Minutes:", Math.floor(elapsedSeconds / 60), "Seconds:", elapsedSeconds);
}, [elapsedSeconds]);

// Check goal achievement and notify
useEffect(() => {
  if (isRunning && (sessionGoals?.targetDuration || sharedGoals?.targetDuration)) {
    const targetDuration = sessionGoals?.targetDuration || sharedGoals?.targetDuration;
    const currentMinutes = Math.floor(elapsedSeconds / 60);
    
    if (currentMinutes >= targetDuration && targetDuration > 0) {
      if (!goalNotified) {
        const goalDescription = sessionGoals?.description || sharedGoals?.description;
        console.log("🎉 Goal achieved! 🎉");
        
        // Show notification to current user
        toast.success(`🎉 Congratulations! You've achieved your study goal: "${goalDescription}"! 🎉`, {
          duration: 5000,
          icon: '🏆'
        });
        
        setGoalNotified(true);
        
        // Broadcast to other participants in the room
        socketService.emit('goal_achieved', {
          roomId: id,
          userName: user?.name,
          goal: goalDescription
        });
      }
    }
  }
}, [elapsedSeconds, isRunning, sessionGoals, sharedGoals, goalNotified]);

  // Setup socket connection
  useEffect(() => {
    if (!token || !id) return;

    socketService.connect(token);

    // Connection status check
    const checkInterval = setInterval(() => {
      setSocketConnected(socketService.isSocketConnected());
    }, 1000);

    // Socket event listeners
    socketService.on("participants_update", (data) => {
      console.log("Participants update:", data);
      setParticipants(data.participants || []);
    });

    socketService.on("user_joined", (data) => {
      console.log("User joined:", data);
      toast.success(`${data.userName} joined the room`);
    });

    socketService.on("user_left", (data) => {
      console.log("User left:", data);
      toast.info(`${data.userName} left the room`);
    });

    socketService.on("user_kicked", (data) => {
      console.log("User kicked:", data);
      toast.info(`${data.userName} was kicked by ${data.kickedBy}`);
      if (data.userId === user?._id) {
        toast.error("You were kicked from the room!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    });

    socketService.on("kicked_from_room", (data) => {
      toast.error(data.message);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    });

    socketService.on("new_message", (data) => {
      console.log("New message received:", data);
      const messageData = data.message || data;
      addMessage(messageData);
      scrollToBottom();
    });

    //goald for all
    socketService.on("session_goals_updated", (data) => {
      console.log("Session goals updated by another participant:", data);
      setSharedGoals(data.goals);
      setSessionGoals(data.goals);
      toast.info(
        `${data.updatedBy} updated the session goals: "${data.goals.description}"`,
      );
    });

    //session start
    socketService.on("session_started", (data) => {
  console.log("Session started:", data);
  toast.success("Study session started!");

  // Reset goal notification flag for new session
  setGoalNotified(false);

  // Start the session in store
  startSession(id);

  // Use the real session ID from backend
  if (data.sessionId) {
    console.log("Real session ID from backend:", data.sessionId);
    setCurrentSessionId(data.sessionId);
  }
});

   socketService.on("session_ended", (data) => {
  console.log("Session ended event received:", data);
  console.log("Session ID from event:", data.sessionId);
  
  const minutes = data.duration || 0;
  toast.success(`Session ended! Duration: ${minutes} minutes`);
  
  // End the session in store
  endSession();
  
  // Set session ID for summary
  if (data.sessionId) {
    console.log("Setting currentSessionId for summary:", data.sessionId);
    setCurrentSessionId(data.sessionId);
  }
  
  // Show summary for EVERYONE
  setTimeout(() => {
    console.log("Showing summary modal for everyone");
    setShowSummary(true);
  }, 500);
});

    socketService.on("timer_sync", (data) => {
      console.log("Timer sync received:", data);
      // Update timer without restarting it
      if (data.elapsedSeconds !== undefined) {
        updateTimer(data.elapsedSeconds);
      }
    });

// Listen for goal achievements from other participants
socketService.on("goal_achieved", (data) => {
  console.log("Goal achieved by other participant:", data);
  toast.success(`🎉 ${data.userName} achieved the study goal: "${data.goal}"! 🎉`, {
    duration: 5000,
    icon: '🏆'
  });
});
    socketService.on("session_active", (data) => {
      console.log("Session already active, syncing timer:", data);
      toast.info("A study session is already in progress!");

      // Update timer with current elapsed time
      if (data.elapsedSeconds !== undefined) {
        updateTimer(data.elapsedSeconds);
      }

      // Set session as running without starting a new one
      if (!isRunning) {
        startSession(id);
      }

      // Set the real session ID
      if (data.sessionId) {
        setCurrentSessionId(data.sessionId);
      }
    });

    socketService.on("connect", () => {
      console.log("Socket connected, joining room:", id);
      setSocketConnected(true);
      socketService.emit("join_room", { roomId: id });
    });

    return () => {
      clearInterval(checkInterval);
      socketService.emit("leave_room", { roomId: id });
      socketService.disconnect();
      clearMessages();
    };
  }, [token, id, user]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    if (!socketConnected) {
      toast.error("Connecting to chat...");
      return;
    }
    console.log("Sending message:", { roomId: id, content: messageInput });
    socketService.emit("send_message", { roomId: id, content: messageInput });
    setMessageInput("");
  };

  const handleStartSession = () => {
    if (!socketConnected) {
      toast.error("Please wait, connecting to server...");
      return;
    }
    console.log("Starting session in room:", id);
    socketService.emit("start_session", { roomId: id });
    startSession(id);
  };

  const handleEndSession = () => {
    if (!socketConnected) {
      toast.error("Please wait, connecting to server...");
      return;
    }
    console.log("Ending session in room:", id);
    socketService.emit("end_session", { roomId: id, duration: elapsedSeconds });
    endSession();

    // Show summary after session ends
    setTimeout(() => {
      setShowSummary(true);
    }, 500);
  };

  const handleKickUser = (userId, userName) => {
    if (
      window.confirm(`Are you sure you want to kick ${userName} from the room?`)
    ) {
      socketService.emit("kick_participant", { roomId: id, userId, userName });
      toast.success(`Kicking ${userName}...`);
    }
  };

  const handleLeaveRoom = async () => {
    socketService.emit("leave_room", { roomId: id });
    await leaveRoom(id);
    navigate("/dashboard");
    toast.success("Left room");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!currentRoom) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Socket Status */}
      <div className="fixed bottom-4 right-4 z-50">
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${socketConnected ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}`}
        >
          {socketConnected ? "● Connected" : "○ Connecting..."}
        </div>
      </div>

      {/* Header - Fixed height */}
      <header className="bg-white border-b px-6 py-3 shadow-sm flex-shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {currentRoom.name}
            </h1>
            <p className="text-xs text-gray-500">
              {currentRoom.description || "No description"}
            </p>

            {/* Room ID Display with Copy Button */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400">Room ID:</span>
              <code className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {id}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(id);
                  toast.success("Room ID copied!");
                }}
                className="text-xs text-blue-600 hover:text-blue-800"
                title="Copy Room ID"
              >
                📋 Copy
              </button>
              {isOwner && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="text-xs bg-green-500 text-white px-2 py-0.5 rounded hover:bg-green-600"
                >
                  👥 Invite
                </button>
              )}
            </div>

            {isOwner && (
              <p className="text-xs text-blue-600 mt-0.5">👑 Room Owner</p>
            )}
          </div>
          <Button onClick={handleLeaveRoom} variant="outline" size="sm">
            Leave Room
          </Button>
        </div>
      </header>

      {/* Main Content - Takes remaining space */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Side - Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Timer - Compact size */}
          <div className="bg-white border-b px-4 py-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">
                  📚 Study Timer
                </span>
                <div className="text-2xl font-mono font-bold text-blue-600">
                  {formatTime(elapsedSeconds)}
                </div>
              </div>
              <div className="flex gap-2">
                {!isRunning ? (
                  <Button
                    onClick={handleStartSession}
                    size="sm"
                    disabled={!socketConnected}
                  >
                    ▶ Start
                  </Button>
                ) : (
                  <>
                    {/* Goals Button - always visible during session */}
                    {currentSessionId && (
                      <SessionGoals
                        roomId={id}
                        sessionId={currentSessionId}
                        currentGoals={sessionGoals || sharedGoals}
                        onGoalsUpdated={setSessionGoals}
                      />
                    )}
                    <Button
                      onClick={handleEndSession}
                      variant="destructive"
                      size="sm"
                      disabled={!socketConnected}
                    >
                      ⏹ End
                    </Button>
                  </>
                )}
              </div>
            </div>

{/* Goals Display - Prominent and Visible to All Participants */}
{isRunning && (sessionGoals?.description || sharedGoals?.description) && (
  <div className="mt-3 pt-2 border-t border-gray-200">
    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg border border-green-200">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">🎯</span>
        <span className="font-semibold text-gray-800">Group Study Goal</span>
        {sessionGoals?.achieved && <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Achieved!</span>}
      </div>
      <div className="text-base font-medium text-gray-900 mb-2">
        {sessionGoals?.description || sharedGoals?.description}
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-1">
          <span>⏱️</span>
          <span className="text-gray-600">Target: <span className="font-semibold text-blue-600">{(sessionGoals?.targetDuration || sharedGoals?.targetDuration)} min</span></span>
        </div>
        <div className="flex items-center gap-1">
          <span>💬</span>
          <span className="text-gray-600">Target: <span className="font-semibold text-blue-600">{(sessionGoals?.targetMessages || sharedGoals?.targetMessages)} messages</span></span>
        </div>
        <div className="flex items-center gap-1">
          <span>📊</span>
          <span className="text-gray-600">Progress: <span className="font-semibold text-green-600">{Math.floor(elapsedSeconds / 60)} min / {(sessionGoals?.targetDuration || sharedGoals?.targetDuration)} min</span></span>
        </div>
      </div>
      {/* Progress Bar - FIXED: Convert seconds to minutes */}
      <div className="mt-2">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-green-500 rounded-full h-2.5 transition-all duration-500"
            style={{ 
              width: `${Math.min((Math.floor(elapsedSeconds / 60) / (sessionGoals?.targetDuration || sharedGoals?.targetDuration || 1)) * 100, 100)}%` 
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0 min</span>
          <span>{Math.floor(elapsedSeconds / 60)} min / {(sessionGoals?.targetDuration || sharedGoals?.targetDuration)} min</span>
          <span>{(sessionGoals?.targetDuration || sharedGoals?.targetDuration)} min</span>
        </div>
      </div>
    </div>
  </div>
)}
          </div>

          {/* Chat and Activity Tabs Container */}
          <div className="flex-1 flex flex-col p-4 min-h-0">
            <div className="bg-white rounded-lg border shadow-sm flex-1 flex flex-col overflow-hidden">
              {/* Tab Headers */}
              <div className="border-b bg-gray-50 flex-shrink-0">
                <div className="flex">
                  <button
                    className={`px-4 py-2.5 text-sm font-medium transition-all ${
                      activeTab === "chat"
                        ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("chat")}
                  >
                    💬 Chat
                  </button>
                  <button
                    className={`px-4 py-2.5 text-sm font-medium transition-all ${
                      activeTab === "activity"
                        ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("activity")}
                  >
                    📋 Activity Feed
                  </button>
                </div>
              </div>

              {/* Chat Tab Content */}
              {activeTab === "chat" ? (
                <>
                  {/* Messages Container - Scrollable */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-400 py-8">
                        No messages yet. Start the conversation!
                      </div>
                    ) : (
                      messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex ${msg.user?._id === user?._id ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg px-3 py-1.5 ${
                              msg.user?._id === user?._id
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            {msg.user?._id !== user?._id && (
                              <p className="text-xs font-semibold mb-0.5 text-blue-600">
                                {msg.user?.name}
                              </p>
                            )}
                            <p className="text-sm break-words whitespace-pre-wrap">
                              {msg.content}
                            </p>
                            <p className="text-xs mt-0.5 opacity-70">
                              {msg.createdAt
                                ? new Date(msg.createdAt).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" },
                                  )
                                : new Date().toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input - Fixed at bottom */}
                  <div className="p-3 border-t bg-white flex-shrink-0">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        placeholder={
                          socketConnected
                            ? "Type a message..."
                            : "Connecting..."
                        }
                        disabled={!socketConnected}
                        className="flex-1 px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!socketConnected}
                        size="sm"
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                /* Activity Tab Content */
                <ActivityFeed roomId={id} />
              )}
            </div>
          </div>
        </div>

        {/* Participants Sidebar - Fixed width */}
<div className="w-72 bg-white border-l flex flex-col flex-shrink-0">
  <div className="p-3 border-b flex-shrink-0">
    <h3 className="font-semibold text-gray-700 text-sm">
      👥 Participants
    </h3>
    <p className="text-xs text-gray-500 mt-0.5">
      Total: {participants.length } {participants.length === 0 ? 'person' : 'people'} in room
    </p>
  </div>
  <div className="flex-1 overflow-y-auto p-3 space-y-2">
    {/* Current User - Always show current user */}
    <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-sm text-gray-900">
            {user?.name} <span className="text-xs text-gray-500">(You)</span>
          </p>
          <p className="text-xs text-green-600">● Online</p>
        </div>
      </div>
      {isOwner && (
        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Owner</span>
      )}
    </div>
    
    {/* Other Participants - Filter out current user to avoid duplication */}
    {participants
      .filter(p => {
        // Filter out current user by checking multiple possible ID fields
        const participantId = p.userId || p.user?._id;
        return participantId !== user?._id;
      })
      .map((p) => {
        const participantId = p.userId || p.user?._id;
        const participantName = p.userName || p.user?.name;
        return (
          <div key={participantId} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {participantName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-sm text-gray-900">
                  {participantName}
                </p>
                <p className="text-xs text-green-600">● Online</p>
              </div>
            </div>
            {isOwner && (
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => handleKickUser(participantId, participantName)}
                className="text-xs h-7 px-2"
              >
                Kick
              </Button>
            )}
          </div>
        );
      })}
    
    {/* Show message when no other participants */}
    {participants.filter(p => {
      const participantId = p.userId || p.user?._id;
      return participantId !== user?._id;
    }).length === 0 && (
      <div className="text-center text-gray-400 text-sm py-4">
        No other participants yet
      </div>
    )}
  </div>
</div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal
          roomId={id}
          roomName={currentRoom?.name}
          onClose={() => setShowInviteModal(false)}
        />
      )}
      {/* Session Summary Modal */}
      {showSummary && currentSessionId && (
        <SessionSummary
          sessionId={currentSessionId}
          onClose={() => {
            setShowSummary(false);
            setCurrentSessionId(null);
            setSessionGoals(null);
          }}
        />
      )}
    </div>
  );
}
