import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getHistory } from '../services/api';
import { BentoGrid, BentoGridItem } from '../components/ui/BentoGrid';
import { FileText, Calendar, AlertCircle } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await getHistory();
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-12 text-center">Analysis History</h1>

      {loading ? (
        <div className="text-center text-gray-500">Loading history...</div>
      ) : (
        <BentoGrid>
          {history.map((item, i) => (
            <BentoGridItem
              key={item._id}
              title={`Analysis #${item._id.slice(-6)}`}
              description={
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${
                      item.overallScore > 50 ? 'text-red-400' : 'text-green-400'
                    }`}>
                      Score: {item.overallScore}%
                    </span>
                  </div>
                </div>
              }
              header={
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 p-4 overflow-hidden relative group">
                  <p className="text-xs text-gray-500 line-clamp-4 group-hover:text-gray-300 transition-colors">
                    {item.originalText}
                  </p>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <button className="text-white text-sm font-bold">View Details</button>
                  </div>
                </div>
              }
              icon={<FileText className="h-4 w-4 text-neutral-500" />}
              className={i === 3 || i === 6 ? "md:col-span-2" : ""}
            />
          ))}
        </BentoGrid>
      )}
    </div>
  );
};

export default History;
