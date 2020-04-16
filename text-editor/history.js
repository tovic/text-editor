/*!
 * ==============================================================
 *  TEXT EDITOR HISTORY 1.1.2
 * ==============================================================
 * Author: Taufik Nurrohman <https://github.com/taufik-nurrohman>
 * License: MIT
 * --------------------------------------------------------------
 */

(function(win, doc, name) {

    var $ = win[name],
        _ = $._,
        _history = '_history',
        _historyState = _history + 'State';

    function isSet(x) {
        return 'undefined' !== typeof x;
    }

    function toEdge(a, b) {
        if (isSet(b[0]) && a < b[0]) {
            return b[0];
        }
        if (isSet(b[1]) && a > b[1]) {
            return b[1];
        }
        return a;
    }

    _[_history] = [];
    _[_historyState] = -1;

    // Get history data
    _.history = function(index) {
        var t = this;
        if (!isSet(index)) {
            return t[_history];
        }
        return isSet(t[_history][index]) ? t[_history][index] : null; 
    };

    // Save current state to history
    _.record = function(index) {
        var t = this,
            selection = t.$(),
            current = t[_history][t[_historyState]] || [],
            next = [t.self.value, selection.start, selection.end];
        if (
            next[0] === current[0] &&
            next[1] === current[1] &&
            next[2] === current[2]
        ) {
            return t; // Do not save duplicate
        }
        ++t[_historyState];
        return (t[_history][isSet(index) ? index : t[_historyState]] = next), t;
    };

    // Remove state from history
    _.loss = function(index) {
        var t = this, current;
        if (true === index) {
            t[_history] = [];
            t[_historyState] = -1;
            return [];
        }
        current = t[_history].splice(isSet(index) ? index : t[_historyState], 1);
        t[_historyState] = toEdge(t[_historyState] - 1, [-1]);
        return current;
    };

    // Undo current state
    _.undo = function() {
        var t = this, state;
        t[_historyState] = toEdge(t[_historyState] - 1, [0, t[_history].length - 1]);
        state = t[_history][t[_historyState]];
        return t.set(state[0]).select(state[1], state[2]);
    };

    // Redo previous state
    _.redo = function() {
        var t = this, state;
        t[_historyState] = toEdge(t[_historyState] + 1, [0, t[_history].length - 1]);
        state = t[_history][t[_historyState]];
        return t.set(state[0]).select(state[1], state[2]);
    };

})(this, this.document, 'TE');
