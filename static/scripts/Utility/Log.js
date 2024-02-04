class Log {
    /**
    *  Constructor of the class Log
    */
    constructor(log = false) {
        this.log = log;
    }

    get log() {
        return this._log;
    }

    set log(log) {
        if (log !== true && log !== false) {
            console.error('Wrong type!');
            console.log(`%c Can not set log of the Class log: ${log}`, 'font-size:40px; color: red; font-weight: bold');
            return;
        }

        if (log === true) {
            console.log('%c Start logging', 'font-size:40px; color: orange; font-weight: bold');
            sessionStorage
        } else {
            console.log('%c Stop logging', 'font-size:40px; color: orange; font-weight: bold');
        }

        sessionStorage.setItem('log', log);
        this._log = log;
    }

    /**
     * Logs the message (alias funciton)
     * 
     * @param {string}  message The message to be logged
     * @param {string}  type    The type of logging (info, warn, error, default)
     * 
     * @returns  {void}
     * 
     * @access  public
    */
    console = (message, type) => this.l(message, type = `log`);


    /**
     * Logs the message
     * 
     * @param {string}  message The message to be logged
     * @param {string}  type    The type of logging (info, warn, error, default)
     * 
     * @returns  {void}
     * 
     * @access  public
    */
    l = (message, type = `log`) => {
        if (!this.log) {
            return;
        }

        switch (type) {
            case 'e':
            case 'error':
                console.error(message);
                console.trace();
                break;
            case 'i':
            case 'info':
                console.info(message);
                break;
            case 'w':
            case 'warn':
                console.warn(message);
                console.trace();
                break;
            case 'l':
            case 'log':
            default:
                console.log(message);
                break;
        }
    }


    /**
     * Logs the error message in red and a larger font
     * 
     * @param {string}  message The error message to be logged
     * 
     * @returns  {void}
     * 
     * @access public
    */
    error = message => {
        if (this.log) {
            console.log(`%c ${message}`, `font-size:50px; color: red; font-weight: bold`);
            console.trace();
        }
    }

    /**
     * Logs the message in different color and font size
     * 
     * @param {string}  message The message to be logged
     * @param {int}     fontSize The size of the font
     * @param {string}  color The color of the message
     * 
     * @returns  {void}
     * 
     * @access public
    */
    msg = (message, fontSize = 15, color = 'yellowgreen') => {
        if (this.log) {
            console.log(`%c ${message}`, `font-size:${fontSize}px; color: ${color}; font-weight: bold`);
        }
    }
}

(() => window.myLog = window.myLog ?? new Log(sessionStorage.getItem('log') === 'true'))(window);