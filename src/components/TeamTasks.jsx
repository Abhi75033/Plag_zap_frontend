import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, CheckCircle, Circle, Clock, AlertCircle, X, 
    Calendar, User, Tag, Trash2, ChevronDown 
} from 'lucide-react';
import { getTeamTasks, createTeamTask, updateTeamTask, deleteTeamTask, getTeamMembersList } from '../services/api';
import toast from 'react-hot-toast';

const PRIORITY_COLORS = {
    low: 'text-gray-400 bg-gray-500/20',
    medium: 'text-blue-400 bg-blue-500/20',
    high: 'text-orange-400 bg-orange-500/20',
    urgent: 'text-red-400 bg-red-500/20'
};

const STATUS_ICONS = {
    todo: Circle,
    in_progress: Clock,
    review: AlertCircle,
    done: CheckCircle
};

const TeamTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [members, setMembers] = useState([]);
    const [filter, setFilter] = useState('all');
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'medium',
        assignee: '',
        dueDate: ''
    });

    useEffect(() => {
        loadTasks();
        loadMembers();
    }, [filter]);

    const loadTasks = async () => {
        try {
            const status = filter === 'all' ? undefined : filter;
            const { data } = await getTeamTasks(status);
            setTasks(data.tasks || []);
        } catch (error) {
            console.error('Failed to load tasks', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMembers = async () => {
        try {
            const { data } = await getTeamMembersList();
            setMembers(data.members || []);
        } catch (error) {
            console.error('Failed to load members', error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newTask.title.trim()) return;

        try {
            const { data } = await createTeamTask({
                ...newTask,
                assignee: newTask.assignee || null,
                dueDate: newTask.dueDate || null
            });
            setTasks(prev => [data.task, ...prev]);
            setNewTask({ title: '', description: '', priority: 'medium', assignee: '', dueDate: '' });
            setShowForm(false);
            toast.success('Task created');
        } catch (error) {
            toast.error('Failed to create task');
        }
    };

    const handleStatusChange = async (taskId, status) => {
        try {
            await updateTeamTask(taskId, { status });
            setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status } : t));
        } catch (error) {
            toast.error('Failed to update task');
        }
    };

    const handleDelete = async (taskId) => {
        if (!confirm('Delete this task?')) return;
        try {
            await deleteTeamTask(taskId);
            setTasks(prev => prev.filter(t => t._id !== taskId));
            toast.success('Task deleted');
        } catch (error) {
            toast.error('Failed to delete task');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-48">
                <div className="animate-spin h-8 w-8 border-b-2 border-purple-500 rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    {['all', 'todo', 'in_progress', 'done'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                filter === f ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                            }`}
                        >
                            {f === 'all' ? 'All' : f.replace('_', ' ')}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium text-sm hover:bg-purple-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Task
                </button>
            </div>

            {/* New Task Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.form
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        onSubmit={handleCreate}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 overflow-hidden"
                    >
                        <input
                            type="text"
                            value={newTask.title}
                            onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Task title..."
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                        />
                        <textarea
                            value={newTask.description}
                            onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Description (optional)"
                            rows={2}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 resize-none"
                        />
                        <div className="flex gap-2 flex-wrap">
                            <select
                                value={newTask.priority}
                                onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                                className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                            <select
                                value={newTask.assignee}
                                onChange={(e) => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
                                className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="">Unassigned</option>
                                {members.map(m => (
                                    <option key={m._id} value={m._id}>{m.name}</option>
                                ))}
                            </select>
                            <input
                                type="date"
                                value={newTask.dueDate}
                                onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                                className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium">
                                Create Task
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-white/5 text-gray-400 rounded-lg text-sm">
                                Cancel
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Tasks List */}
            {tasks.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No tasks yet</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {tasks.map(task => {
                        const StatusIcon = STATUS_ICONS[task.status] || Circle;
                        return (
                            <motion.div
                                key={task._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`bg-white/5 border border-white/10 rounded-xl p-4 hover:border-purple-500/30 transition-colors ${
                                    task.status === 'done' ? 'opacity-60' : ''
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <button
                                        onClick={() => handleStatusChange(task._id, task.status === 'done' ? 'todo' : 'done')}
                                        className="mt-0.5"
                                    >
                                        <StatusIcon className={`w-5 h-5 ${task.status === 'done' ? 'text-green-400' : 'text-gray-500'}`} />
                                    </button>
                                    <div className="flex-1">
                                        <h4 className={`font-medium ${task.status === 'done' ? 'line-through text-gray-500' : ''}`}>
                                            {task.title}
                                        </h4>
                                        {task.description && (
                                            <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                                        )}
                                        <div className="flex items-center gap-3 mt-2 text-xs">
                                            <span className={`px-2 py-0.5 rounded-full ${PRIORITY_COLORS[task.priority]}`}>
                                                {task.priority}
                                            </span>
                                            {task.assignee && (
                                                <span className="flex items-center gap-1 text-gray-400">
                                                    <User className="w-3 h-3" />
                                                    {task.assignee.name}
                                                </span>
                                            )}
                                            {task.dueDate && (
                                                <span className="flex items-center gap-1 text-gray-400">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(task.dueDate).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(task._id)}
                                        className="text-gray-500 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TeamTasks;
