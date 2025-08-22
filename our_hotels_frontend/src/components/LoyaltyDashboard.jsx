import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiStar, FiGift, FiTrendingUp, FiInfo } from 'react-icons/fi';

const LoyaltyDashboard = () => {
  // Mock data for loyalty program
  const [loyaltyData, setLoyaltyData] = useState({
    points: 1500,
    tier: 'Silver',
    nextTier: 'Gold',
    pointsToNextTier: 500,
    tierBenefits: [
      '5% cashback on all purchases',
      'Exclusive member-only deals',
      'Priority customer support',
      'Free shipping on orders over $50'
    ],
    pointHistory: [
      { id: 1, description: 'Purchase at Store', points: 250, date: '2023-05-15' },
      { id: 2, description: 'Birthday Bonus', points: 100, date: '2023-05-10' },
      { id: 3, description: 'Referral Bonus', points: 150, date: '2023-05-05' },
    ],
    rewards: [
      { id: 1, name: '$10 Discount', points: 500, claimed: false },
      { id: 2, name: 'Free Coffee', points: 300, claimed: true },
      { id: 3, name: 'Premium Gift Box', points: 1000, claimed: false },
    ]
  });

  // Calculate progress percentage
  const progressPercentage = Math.min(100, (loyaltyData.points / (loyaltyData.points + loyaltyData.pointsToNextTier)) * 100);

  // Tier colors and icons
  const tierConfig = {
    Bronze: { color: 'bg-amber-700', icon: <FiAward className="text-amber-700" /> },
    Silver: { color: 'bg-gray-400', icon: <FiStar className="text-gray-500" /> },
    Gold: { color: 'bg-yellow-400', icon: <FiAward className="text-yellow-500" /> },
    Platinum: { color: 'bg-indigo-500', icon: <FiStar className="text-indigo-400" /> },
  };

  const [activeTab, setActiveTab] = useState('benefits');
  const [showInfo, setShowInfo] = useState(false);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      // In a real app, this would be an API call
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-6 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiGift className="text-red-500" />
          Loyalty Rewards
        </h2>
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Loyalty program information"
        >
          <FiInfo className="text-gray-500" />
        </button>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-blue-50 p-4 rounded-lg mb-6 text-sm text-blue-800"
        >
          <p>Join our loyalty program to earn points with every purchase and unlock exclusive rewards and benefits!</p>
        </motion.div>
      )}

      {/* Points & Tier Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Points Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-xl shadow p-5 flex flex-col items-center justify-center"
        >
          <div className="text-4xl font-bold text-red-600 mb-2">{loyaltyData.points}</div>
          <div className="text-gray-500 text-sm">Points Balance</div>
          <div className="mt-3 text-xs text-gray-400 flex items-center">
            <FiTrendingUp className="mr-1" />
            <span>Next reward in {loyaltyData.pointsToNextTier} points</span>
          </div>
        </motion.div>

        {/* Tier Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-xl shadow p-5 flex flex-col items-center justify-center"
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${tierConfig[loyaltyData.tier].color} bg-opacity-20 mb-3`}>
            {tierConfig[loyaltyData.tier].icon}
          </div>
          <div className="text-xl font-bold text-gray-800">{loyaltyData.tier} Member</div>
          <div className="text-sm text-gray-500 mt-1">Current Tier</div>
        </motion.div>

        {/* Next Tier Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-xl shadow p-5 flex flex-col items-center justify-center"
        >
          <div className="text-lg font-bold text-gray-800 mb-1">{loyaltyData.nextTier}</div>
          <div className="text-sm text-gray-500 mb-3">Next Tier</div>
          <div className="text-xs text-gray-400">
            {loyaltyData.pointsToNextTier} points to go
          </div>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{loyaltyData.tier}</span>
          <span>{loyaltyData.nextTier}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <motion.div 
            className="bg-gradient-to-r from-red-500 to-red-600 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <div className="text-right text-xs text-gray-500 mt-1">
          {loyaltyData.points} / {loyaltyData.points + loyaltyData.pointsToNextTier} points
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'benefits' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('benefits')}
        >
          Tier Benefits
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'rewards' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('rewards')}
        >
          Available Rewards
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'history' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('history')}
        >
          Points History
        </button>
      </div>

      {/* Tab Content */}
      <div className="mb-6">
        {activeTab === 'benefits' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow p-5"
          >
            <h3 className="font-bold text-lg text-gray-800 mb-4">Your {loyaltyData.tier} Benefits</h3>
            <ul className="space-y-3">
              {loyaltyData.tierBenefits.map((benefit, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start"
                >
                  <div className="flex-shrink-0 mt-1 mr-3 text-red-500">
                    <FiStar />
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {activeTab === 'rewards' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {loyaltyData.rewards.map((reward) => (
              <motion.div
                key={reward.id}
                whileHover={{ y: -5 }}
                className={`bg-white rounded-lg shadow p-4 border ${reward.claimed ? 'border-green-200' : 'border-gray-200'}`}
              >
                <div className="font-medium text-gray-800">{reward.name}</div>
                <div className="flex items-center mt-2">
                  <div className="text-sm text-gray-500">{reward.points} points</div>
                  {reward.claimed ? (
                    <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Claimed</span>
                  ) : (
                    <button className="ml-auto text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200 transition-colors">
                      Redeem
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loyaltyData.pointHistory.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">+{item.points}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-5 text-white">
        <h3 className="font-bold text-lg mb-2">Earn More Points</h3>
        <p className="mb-4 text-red-100">Refer friends, make purchases, and complete challenges to earn more points and unlock higher tiers!</p>
        <button className="bg-white text-red-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
          View Earning Opportunities
        </button>
      </div>
    </motion.div>
  );
};

export default LoyaltyDashboard;