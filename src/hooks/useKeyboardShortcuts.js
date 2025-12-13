import { useEffect } from 'react';

/**
 * Keyboard Shortcuts Hook - Google Meet Style
 * Implements common video meeting keyboard shortcuts
 */
export const useKeyboardShortcuts = ({
    onToggleAudio,
    onToggleVideo,
    onToggleScreenShare,
    onToggleChat,
    onToggleParticipants,
    onToggleHand,
    onLeave,
    isEnabled = true
}) => {
    useEffect(() => {
        if (!isEnabled) return;

        const handleKeyPress = (e) => {
            // Ignore if user is typing in input/textarea
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            // Check for modifier keys
            const isCtrlOrCmd = e.ctrlKey || e.metaKey;
            const isShift = e.shiftKey;

            // Keyboard shortcuts
            switch (e.key.toLowerCase()) {
                // Ctrl/Cmd + D: Toggle microphone
                case 'd':
                    if (isCtrlOrCmd) {
                        e.preventDefault();
                        onToggleAudio?.();
                    }
                    break;

                // Ctrl/Cmd + E: Toggle camera
                case 'e':
                    if (isCtrlOrCmd) {
                        e.preventDefault();
                        onToggleVideo?.();
                    }
                    break;

                // Ctrl/Cmd + Shift + E: Toggle screen share
                case 'e':
                    if (isCtrlOrCmd && isShift) {
                        e.preventDefault();
                        onToggleScreenShare?.();
                    }
                    break;

                // Ctrl/Cmd + Shift + C: Toggle chat
                case 'c':
                    if (isCtrlOrCmd && isShift) {
                        e.preventDefault();
                        onToggleChat?.();
                    }
                    break;

                // Ctrl/Cmd + Shift + P: Toggle participants
                case 'p':
                    if (isCtrlOrCmd && isShift) {
                        e.preventDefault();
                        onToggleParticipants?.();
                    }
                    break;

                // Ctrl/Cmd + Shift + H: Raise/lower hand
                case 'h':
                    if (isCtrlOrCmd && isShift) {
                        e.preventDefault();
                        onToggleHand?.();
                    }
                    break;

                // Ctrl/Cmd + W: Leave meeting
                case 'w':
                    if (isCtrlOrCmd) {
                        e.preventDefault();
                        if (window.confirm('Leave meeting?')) {
                            onLeave?.();
                        }
                    }
                    break;

                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [
        onToggleAudio,
        onToggleVideo,
        onToggleScreenShare,
        onToggleChat,
        onToggleParticipants,
        onToggleHand,
        onLeave,
        isEnabled
    ]);
};

/**
 * Get keyboard shortcut help text
 */
export const getKeyboardShortcuts = () => [
    { key: 'Ctrl/⌘ + D', action: 'Toggle microphone' },
    { key: 'Ctrl/⌘ + E', action: 'Toggle camera' },
    { key: 'Ctrl/⌘ + Shift + E', action: 'Toggle screen share' },
    { key: 'Ctrl/⌘ + Shift + C', action: 'Toggle chat' },
    { key: 'Ctrl/⌘ + Shift + P', action: 'Toggle participants' },
    { key: 'Ctrl/⌘ + Shift + H', action: 'Raise/lower hand' },
    { key: 'Ctrl/⌘ + W', action: 'Leave meeting' }
];
