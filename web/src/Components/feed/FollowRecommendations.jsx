// import React from 'react';


// export default function FollowRecommendations({ recommendations, followUser }) {
//   return (
//     <div className="bg-white rounded-lg shadow-md p-4">
//       <h2 className="text-xl font-semibold mb-4">Who to Follow</h2>
//       <ul className="space-y-4">
//         {recommendations.map((rec) => (
//           <li key={rec.id} className="flex justify-between items-center">
//             <div>
//               <span className="font-medium">{rec.username}</span>
//               <p className="text-sm text-gray-500">{rec.mutualFriends} mutual friends</p>
//             </div>
//             <button
//               onClick={() => followUser(rec.id)}
//               className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600 transition-colors"
//             >
//               Follow
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }


'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, UserPlus, Users } from "lucide-react"

// Assume these functions exist in your API utilities
const followUser = async (userId) => {
  // Implement the API call to follow a user
  console.log(`Following user ${userId}`)
  // Return the updated user object
  return { id: userId, isFollowing: true }
}

const getMutualFriends = async (userId) => {
  // Implement the API call to get mutual friends
  console.log(`Getting mutual friends for user ${userId}`)
  // Return a mock list of mutual friends
  return [
    { id: 'friend1', username: 'John Doe' },
    { id: 'friend2', username: 'Jane Smith' },
  ]
}

interface  FollowRecommendations{
  id: string
  username: string
  mutualFriends: number
  isFollowing: boolean
}

interface FollowRecommendations{
  initialRecommendations: Recommendation[]
  onFollowStatusChange: (userId: string, isFollowing: boolean) => void
}

export default function FollowRecommendations({ initialRecommendations, onFollowStatusChange }) {
  const [recommendations, setRecommendations] = useState(initialRecommendations)
  const [mutualFriends, setMutualFriends] = useState<{ [key]: { id: string, username: string } }>({})

  const handleFollow = async (userId) => {
    try {
      const updatedUser = await followUser(userId)
      setRecommendations(prevRecs => 
        prevRecs.map(rec => 
          rec.id === userId ? { ...rec, isFollowing: updatedUser.isFollowing } : rec
        )
      )
      onFollowStatusChange(userId, updatedUser.isFollowing)

      if (updatedUser.isFollowing) {
        const mutualFriendsList = await getMutualFriends(userId)
        setMutualFriends(prev => ({ ...prev, [userId]: mutualFriendsList }))
      }
    } catch (error) {
      console.error('Error following user:', error)
    }
  }

  return (
    <div className="bg-card rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">Who to Follow</h2>
      <ul className="space-y-4">
        {recommendations.map((rec) => (
          <li key={rec.id} className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="font-medium">{rec.username}</span>
                <p className="text-sm text-muted-foreground">{rec.mutualFriends} mutual friends</p>
              </div>
              <Button
                onClick={() => handleFollow(rec.id)}
                variant={rec.isFollowing ? "secondary" : "default"}
                size="sm"
              >
                {rec.isFollowing ? (
                  <Users className="mr-2 h-4 w-4" />
                ) : (
                  <UserPlus className="mr-2 h-4 w-4" />
                )}
                {rec.isFollowing ? 'Following' : 'Follow'}
              </Button>
            </div>
            {rec.isFollowing && mutualFriends[rec.id] && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    Mutual Friends <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {mutualFriends[rec.id].map((friend) => (
                    <DropdownMenuItem key={friend.id}>
                      {friend.username}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}