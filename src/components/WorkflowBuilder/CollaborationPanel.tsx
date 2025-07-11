import React, { useState } from 'react';
import { Users, Wifi, WifiOff, Circle } from 'lucide-react';

interface CollaborationUser {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  isActive: boolean;
  lastSeen: Date;
  currentAction?: string;
}

interface CollaborationPanelProps {
  workflowId: string;
  currentUserId: string;
  onUserCursorMove?: (userId: string, position: { x: number; y: number }) => void;
  onUserSelection?: (userId: string, nodeIds: string[]) => void;
}

export const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  workflowId,
  currentUserId,
  onUserCursorMove,
  onUserSelection
}) => {
  const [activeUsers, setActiveUsers] = useState<CollaborationUser[]>([]);
  const [showUserList, setShowUserList] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  // Mock active users for demo
  React.useEffect(() => {
    const mockUsers: CollaborationUser[] = [
      {
        id: 'user-1',
        name: 'Dr. Sarah Johnson',
        color: '#3B82F6',
        isActive: true,
        lastSeen: new Date(),
        currentAction: 'Editing Form Builder'
      },
      {
        id: 'user-2',
        name: 'Mike Chen',
        color: '#10B981',
        isActive: true,
        lastSeen: new Date(Date.now() - 30000),
        currentAction: 'Viewing Canvas'
      }
    ];

    setActiveUsers(mockUsers);
  }, []);

  const activeUserCount = activeUsers.filter(user => user.isActive).length;

  return (
    <div className="relative">
      <button
        onClick={() => setShowUserList(!showUserList)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-border rounded-md hover:bg-muted transition-colors"
      >
        <div className="flex items-center space-x-1">
          {isConnected ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-500" />
          )}
          <Users className="w-4 h-4 text-muted-foreground" />
        </div>
        <span className="text-sm text-foreground">{activeUserCount}</span>
      </button>

      {showUserList && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-border rounded-lg shadow-lg z-10">
          <div className="p-3 border-b border-border">
            <h3 className="text-sm font-medium">Active Collaborators</h3>
            <p className="text-xs text-muted-foreground">
              {activeUserCount} user{activeUserCount !== 1 ? 's' : ''} online
            </p>
          </div>
          
          <div className="max-h-48 overflow-y-auto">
            {activeUsers.map(user => (
              <div key={user.id} className="flex items-center p-3 hover:bg-muted">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium mr-3"
                  style={{ backgroundColor: user.color }}
                >
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {user.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {user.currentAction || 'Viewing workflow'}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Circle
                    className={`w-2 h-2 ${
                      user.isActive ? 'text-green-500' : 'text-gray-400'
                    }`}
                    fill="currentColor"
                  />
                </div>
              </div>
            ))}
          </div>
          
          {activeUsers.length === 0 && (
            <div className="p-6 text-center text-muted-foreground">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No other users online</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};