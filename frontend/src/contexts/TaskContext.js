import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const TaskContext = createContext();

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState([]);
    const [isPolling, setIsPolling] = useState(false);

    // Load tasks from localStorage on mount (optional persistence)
    useEffect(() => {
        try {
            const stored = localStorage.getItem('activeAnalysisTasks');
            if (stored) {
                setTasks(JSON.parse(stored));
            }
        } catch (err) {
            console.error('Failed to load tasks from storage:', err);
        }
    }, []);

    // Save tasks to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('activeAnalysisTasks', JSON.stringify(tasks));
        } catch (err) {
            console.error('Failed to save tasks to storage:', err);
        }
    }, [tasks]);

    const addTask = useCallback((task) => {
        setTasks(prev => {
            // Avoid duplicates
            if (prev.find(t => t.task_id === task.task_id)) return prev;
            return [...prev, { ...task, addedAt: new Date().toISOString() }];
        });
    }, []);

    const updateTask = useCallback((taskId, updates) => {
        setTasks(prev => prev.map(t =>
            t.task_id === taskId ? { ...t, ...updates } : t
        ));
    }, []);

    const removeTask = useCallback((taskId) => {
        setTasks(prev => prev.filter(t => t.task_id !== taskId));
    }, []);

    // Polling logic
    useEffect(() => {
        const activeTasks = tasks.filter(t => ['pending', 'processing'].includes(t.status));

        if (activeTasks.length === 0) {
            setIsPolling(false);
            return;
        }

        setIsPolling(true);
        const interval = setInterval(async () => {
            for (const task of activeTasks) {
                try {
                    // Determine endpoint based on task type (default analysis)
                    const endpoint = task.type === 'bulk'
                        ? `/bulk-status/${task.batch_id || task.task_id}`
                        : `/analyze-status/${task.task_id}`;

                    const res = await api.get(endpoint);
                    const data = res.data;

                    // Check for status change or completion
                    if (data.status !== task.status) {
                        updateTask(task.task_id, {
                            status: data.status,
                            message: data.message,
                            result_id: data.result_id,
                            error_message: data.error_message
                        });
                    }
                } catch (err) {
                    console.error(`Error polling task ${task.task_id}:`, err);
                    // Optional: Mark as failed if 404
                    if (err.response?.status === 404) {
                        updateTask(task.task_id, { status: 'failed', error_message: 'Task not found' });
                    }
                }
            }
        }, 5000); // Poll every 5s

        return () => clearInterval(interval);
    }, [tasks, updateTask]);

    return (
        <TaskContext.Provider value={{ tasks, addTask, updateTask, removeTask }}>
            {children}
        </TaskContext.Provider>
    );
}

export function useTasks() {
    return useContext(TaskContext);
}
