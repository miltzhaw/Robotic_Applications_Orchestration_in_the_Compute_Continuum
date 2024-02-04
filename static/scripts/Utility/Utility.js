class Utility {
    /**
     * Returns the value of a key in an array
     * 
     * @param   {object}    array   The array to search in
     * @param   {string}    key     The key to search for
     * 
     * @returns {string}            The value of the key
     * 
     * @access  public
     * @static
    */
    static getValueFromArrayKey = (array, key) => {
        let value = null;
        for (let element of array) {
            if (element.name == key) {
                value = element.value;
                break;
            }
        }

        // Return the value as string
        return `${value}`;
    }


    /**
     * Adds or updates a key in an array
     * 
     * @param   {object}    array   The array to search in
     * @param   {string}    key     The key to be added or updated
     * @param   {boolean}   value   The value to update or add
     * 
     * @returns {void}
     * 
     * @access  public
     * @static
    */
    static addOrUpdateArrayKey = (array, key, value = false) => {
        for (let element of array) {
            if (element.name == key) {
                element.value = value;
                return;
            }
        }

        array.push({ name: key, value: value });
    }


    /**
     * Appends a property to a container
     * 
     * @param   {HTMLElement}   container   The container to append to
     * @param   {string}        title       The title of the property
     * @param   {object}        properties  The properties to search in
     * @param   {string}        key         The key to search for
     * 
     * @returns {void}
     * 
     * @access  public
     * @static
    */
    static appendPropertyToContainer = (container, title, properties, key) => {
        let cardText = document.createElement(`p`);
        cardText.innerHTML = `<span>${title}:</span> ${this.getValueFromArrayKey(properties, key) ?? `-`}`;

        container.appendChild(cardText);
    }


    /**
     * Logs the debug message
     * 
     * @param {string}  message The debug message to be logged
     * @param {string}  color   The color of the message
     * 
     * @returns  {void}
     * 
     * @access public
     * @static
     */
    static debugLog = (message, color = `black`) => {
        let listCell = document.createElement(`div`);
        listCell.classList.add(`debug-list-cell`);

        let detail = document.createElement(`div`);
        detail.classList.add(`debug-detail`);

        let date = new Date();
        let dateDiv = document.createElement(`div`);
        dateDiv.innerHTML = `<i>${date.toLocaleString("de-CH")}:${date.getMilliseconds()}</i>`;
        detail.appendChild(dateDiv);

        let code = document.createElement(`div`);
        code.innerHTML = `<code class="w3-text-${color}">${message}</code>`;
        detail.appendChild(code);

        listCell.appendChild(detail);
        document.getElementsByClassName(`debug-list`)[0].appendChild(listCell);

        // Only scroll to the bottom if the user is already at the bottom
        if (document.getElementsByClassName(`debug-list`)[0].scrollTop + 345 >= document.getElementsByClassName(`debug-list`)[0].scrollHeight) {
            // https://stackoverflow.com/questions/11715646/scroll-automatically-to-the-bottom-of-the-page
            document.getElementsByClassName(`debug-list`)[0].scrollTo(0, document.getElementsByClassName(`debug-list`)[0].scrollHeight);
        }
    }
}

export { Utility as Utility };