class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
     	if (!config.hasOwnProperty('initial') | !config.hasOwnProperty('states')) {
     		throw new Error('Problem with the configuration');
     	}

     	this.stateInitial = config.initial;

     	this.state = this.stateInitial;
     	this.states = {};

        this.statesHistory = [];    //We will save states history in this Array
        this.statesHistoryCounter = 0;

        //Let's put all possible states into one Array
        for (let state in config.states) {  
        	let statesHistoryArray = {};    
        	for (let event in config.states[state].transitions) {
        		statesHistoryArray[event] = config.states[state].transitions[event];
        	}

        	this.states[state] = statesHistoryArray;
        }
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
     	return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
     	let B = false;
     	let newState = null;
        //Let's check weather state exist
        for (let S in this.states) {    
        	if (S == state) {
        		newState = S;
        		B = true;
        	}
        }

        if (!B) throw new Error('This state is absent');

        this.statesHistoryCounter++;
        this.statesHistory.push(this.state);
        this.state = newState;
        this.statesHistory.push(this.state);
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
     	let currentState = this.state;
        //Let's check weather event exist
        if (this.states[currentState][event] == undefined) {  
        	throw new Error('This state is absent');
        }

        this.statesHistory.push(this.state);
        this.state = this.states[currentState][event];
        this.statesHistory.push(this.state);
        this.statesHistoryCounter++;
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
     	this.state = this.stateInitial;
     }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
     	let statesArray = [];
        //Let's check weather type we now type of event
        if (typeof event == 'undefined') {
        	return Object.keys(this.states);
        } 

        for (let s in this.states) {
        	for (let transName in this.states[s]) {
        		if (transName == event) {
        			statesArray.push(s);
        		}
        	}
        }

        return statesArray;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
     	let localStatesHistory = this.statesHistory;
        //Let's check weather there are states to undo
        if(localStatesHistory.length == 0 | this.statesHistoryCounter <= 0) {
        	return false;
        }

        let historyLength = localStatesHistory.length;

        this.state = localStatesHistory[historyLength - 2];
        this.statesHistoryCounter--;

        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
     	let localStatesHistory = this.statesHistory;
     	let preState = this.state;

     	if(localStatesHistory.length == 0) {
     		return false;
     	}

     	let historyLength = localStatesHistory.length;

     	this.state = localStatesHistory[historyLength - 1];

     	if (this.state != preState) {
     		return true;
     	}

     	this.statesHistoryCounter++;

     	return false;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
     	this.statesHistory.length = 0;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
