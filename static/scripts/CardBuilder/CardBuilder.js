class CardBuilder {
    /**
     * The selected card
     * 
     * @type {object}
     * 
     * @access  public
     * @static
     */
    static selectedCard = null;

    /**
     * The type of the selected card
     * 
     * @type {string}
     * 
     * @access  private
     */
    static selectedCardType = null;

    /**
     * Constructor of the abstract class RoboHandler
     */
    constructor() {
        if (this.constructor === CardBuilder) {
            throw new Error("Can't instantiate abstract class CardBuilder!");
        }
    }


    /**
     * Selects a robot
     * 
     * @param {Event}   e       The event
     * @param {object}  card    The object of the selected card (robot or service)
     * @param {string}  type    The type of the card (robot or service) 
     * 
     * @returns  {void}
     * 
     * @access  private
     */
    cardSelected = (e, card, type) => {
        // Check if the card is disabled
        if (e.currentTarget.classList.contains(`disabled-card`)) {
            myLog.l(`Card is disabled`, `warn`);
            return;
        }

        // Check if the selected card is of the same type as the current one
        if (CardBuilder.selectedCardType !== null && CardBuilder.selectedCardType !== type) {
            myLog.l(`Selected card is not of the same type as the current one`);
            return;
        }

        // Remove the selected-card class from all cards except the current one
        $(`.card`).not(e.currentTarget).removeClass(`selected-card disabled-card`);

        // Hide the card-footer
        $(`.card-footer`).css({ "display": `` });

        // Add or remove the selected-card class from the current card
        if (e.currentTarget.classList.contains(`selected-card`)) {
            e.currentTarget.classList.remove(`selected-card`);
            CardBuilder.selectedCard = null;
            CardBuilder.selectedCardType = null;

            // Enable all cards
            $(`.card`).removeClass(`disabled-card`);
        } else {
            e.currentTarget.classList.add(`selected-card`);
            CardBuilder.selectedCard = card;
            CardBuilder.selectedCardType = type;
            this.updateCards();
        }
    }


    /**
     * Updates the cards after selecting a robot or service
     * 
     * @returns  {void}
     * 
     * @access  public
     */
    updateCards = () => { throw new Error("Function needs to be implemented in the subclasses!") };

    /**
     * Remove a  card
     * 
     * @returns  {void}
     * 
     * @access  public
     */
    removeCard = () => { throw new Error("Function needs to be implemented in the subclasses!") };
}

export { CardBuilder as CardBuilder };